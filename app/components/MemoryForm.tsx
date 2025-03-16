/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function MemoryForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [memory, setMemory] = useState({
    title: '',
    date: '',
    memory: '',
    significance: '',
    people: '',
    location: '',
    photos: [],
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<any[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setMemory((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      // Store the actual file objects for later submission
      const newFiles = Array.from(e.target.files);
      setPhotoFiles([...photoFiles, ...newFiles]);
      
      // Create preview URLs for display
      const newPreviewUrls = newFiles.map((file: any) => URL.createObjectURL(file));
      setPhotoPreviewUrls([...photoPreviewUrls, ...newPreviewUrls]);
      
      // We'll replace these with actual paths after upload
      setMemory((prev: any) => ({ 
        ...prev, 
        photos: [...prev.photos, ...newFiles.map(() => '')] 
      }));
    }
  };

  const removePhoto = (index: number) => {
    const updatedFiles = [...photoFiles];
    updatedFiles.splice(index, 1);
    setPhotoFiles(updatedFiles);

    const updatedPreviews = [...photoPreviewUrls];
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setPhotoPreviewUrls(updatedPreviews);

    const updatedPhotos = [...memory.photos];
    updatedPhotos.splice(index, 1);
    setMemory(prev => ({
      ...prev,
      photos: updatedPhotos
    }));
  };

  const uploadPhotos = async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];
    if (!session?.user) throw new Error('User not authenticated');
    
    // Sanitize user ID - remove spaces and special characters
    const rawUserId = session.user.name || session.user.email || 'anonymous';
    const userId = rawUserId.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    
    // Create a single timestamp for all files in this upload batch
    // This ensures the timestamp is the same for all files
    const batchTimestamp = new Date().getTime();
    
    const uploadPromises = files.map(async (file, index) => {
      // Sanitize the filename
      const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      // Create a consistent filename that will be used both client & server-side
      const filename = `${batchTimestamp}-${index}-${safeFilename}`;
      
      // Create form data for the upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('filename', filename); // Pass the predetermined filename
      
      // Send the file to our API endpoint
      const response = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to upload photo: ${errorData.error || 'Unknown error'}`);
      }
      
      // Return the same path that we're expecting the server to use
      return `/uploads/${userId}/${filename}`;
    });
    
    // Wait for all uploads to complete
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // First, upload the photos
      const uploadedPhotoUrls = await uploadPhotos(photoFiles);

      // Format the memory for API submission
      const apiMemory = {
        title: memory.title,
        date: memory.date,
        description: memory.memory,
        significance: memory.significance,
        people: memory.people,
        location: memory.location,
        photos: uploadedPhotoUrls,
      };

      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiMemory),
      });

      if (!response.ok) {
        throw new Error('Failed to save memory');
      }

      const data = await response.json();
      
      // Clean up the object URLs to prevent memory leaks
      photoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
      
      router.push(`/memories/${data.id}`);
    } catch (error) {
      console.error('Error saving memory:', error);
      alert('Failed to save your memory. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6">Capture a Memory</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-1">
              What would you call this memory? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={memory.title}
              onChange={handleChange}
              required
              placeholder="e.g., First camping trip with Dad, Sarah's graduation"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3"
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-lg font-medium text-gray-700 mb-1">
              When did this happen? <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={memory.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3"
            />
          </div>
        </div>
        
        {/* The Memory */}
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <label htmlFor="memory" className="block text-lg font-medium text-gray-700 mb-1">
              Share your memory the way you remember it <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Tell the story in your own words. What happened? How did it feel?
            </p>
            <textarea
              id="memory"
              name="memory"
              rows={6}
              value={memory.memory}
              onChange={handleChange}
              required
              placeholder="I remember it was starting to rain when we..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3"
            />
          </div>
        </div>
        
        {/* Additional Context (Optional) */}
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-700">A few more details that help bring the memory to life</h2>
          
          <div>
            <label htmlFor="people" className="block text-base font-medium text-gray-700 mb-1">
              Who was there with you?
            </label>
            <input
              type="text"
              id="people"
              name="people"
              value={memory.people}
              onChange={handleChange}
              placeholder="e.g., Mom, Dad, Sarah, my dog Rex"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-base font-medium text-gray-700 mb-1">
              Where did this happen?
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={memory.location}
              onChange={handleChange}
              placeholder="e.g., Grandma's house, Yosemite National Park"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3"
            />
          </div>
          
          <div>
            <label htmlFor="significance" className="block text-base font-medium text-gray-700 mb-1">
              Why is this memory special to you?
            </label>
            <textarea
              id="significance"
              name="significance"
              rows={3}
              value={memory.significance}
              onChange={handleChange}
              placeholder="This memory matters to me because..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3"
            />
          </div>
        </div>
        
        {/* Photos */}
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <label htmlFor="photos" className="block text-lg font-medium text-gray-700 mb-1">
              Add photos from this memory
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Images help bring your memories to life
            </p>
            <input
              type="file"
              id="photos"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 px-4 py-3"
            />
            
            {/* Photo previews */}
            {photoPreviewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photoPreviewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={url} 
                      alt={`Preview ${index}`} 
                      className="h-32 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 rounded-full bg-red-500 text-white w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Upload Progress */}
        {isSubmitting && photoFiles.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Uploading photos...</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{Math.round(uploadProgress)}% complete</p>
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save This Memory'}
          </button>
        </div>
      </form>
    </div>
  );
}