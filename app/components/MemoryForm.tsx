/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/components/MemoryForm.js

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MemoryForm() {
  const router = useRouter();
  const [memory, setMemory] = useState<{
    title: string;
    date: string;
    location: string;
    people: string;
    description: string;
    feelings: string;
    sensoryDetails: string;
    significance: string;
    photos: string[];
  }>({
    title: '',
    date: '',
    location: '',
    people: '',
    description: '',
    feelings: '',
    sensoryDetails: '',
    significance: '',
    photos: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setMemory((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e:any) => {
    // In a real app, you'd handle file upload to a service like Cloudinary
    console.log('Photo upload:', e.target.files);
    // For simplicity, we're just acknowledging the upload here
    setMemory((prev) => ({ 
      ...prev, 
      photos: [...prev.photos, 'photo-url-placeholder'] 
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memory),
      });

      if (!response.ok) {
        throw new Error('Failed to save memory');
      }

      const data = await response.json();
      router.push(`/memories/${data.id}`);
    } catch (error) {
      console.error('Error saving memory:', error);
      alert('Failed to save your memory. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Memory Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={memory.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={memory.date}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={memory.location}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="people" className="block text-sm font-medium text-gray-700">
          People Present
        </label>
        <input
          type="text"
          id="people"
          name="people"
          value={memory.people}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={memory.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="feelings" className="block text-sm font-medium text-gray-700">
          How did you feel?
        </label>
        <textarea
          id="feelings"
          name="feelings"
          rows={2}
          value={memory.feelings}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="sensoryDetails" className="block text-sm font-medium text-gray-700">
          Sensory Details (smells, sounds, tastes, etc.)
        </label>
        <textarea
          id="sensoryDetails"
          name="sensoryDetails"
          rows={2}
          value={memory.sensoryDetails}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="significance" className="block text-sm font-medium text-gray-700">
          Why is this memory significant?
        </label>
        <textarea
          id="significance"
          name="significance"
          rows={2}
          value={memory.significance}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Photos (optional)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Saving...' : 'Save Memory'}
        </button>
      </div>
    </form>
  )
};