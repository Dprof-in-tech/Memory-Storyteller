/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/components/StoryDetail.js
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function StoryDetail({ story }: {story: any}) {
  const router = useRouter();
  const [isDelivering, setIsDelivering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(
    story.scheduledFor ? new Date(story.scheduledFor).toISOString().slice(0, 16) : ''
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Determine which AI model was used
  const aiModelName = story.aiModel === 'chatgpt' ? 'ChatGPT' : 'Claude AI';
  const aiModelClass = story.aiModel === 'chatgpt' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800';


  const deliverStory = async () => {
    if (!confirm('Are you sure you want to send this story via WhatsApp now?')) {
      return;
    }
    
    setIsDelivering(true);
    
    try {
      const response = await fetch(`/api/stories/${story.id}/deliver`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to deliver story');
      }
      
      alert('Story sent successfully!');
      router.refresh();
    } catch (error) {
      console.error('Error delivering story:', error);
      alert('Failed to deliver story. Please try again.');
    } finally {
      setIsDelivering(false);
    }
  };

  const updateSchedule = async () => {
    setIsUpdating(true);
    
    try {
      const response = await fetch(`/api/stories/${story.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduledFor: deliveryDate ? new Date(deliveryDate).toISOString() : null,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update schedule');
      }
      
      alert('Delivery schedule updated!');
      router.refresh();
    } catch (error) {
      console.error('Error updating schedule:', error);
      alert('Failed to update schedule. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteStory = async () => {
    if (!confirm('Are you sure you want to delete this story?')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/stories/${story.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete story');
      }
      
      router.push(`/memories/${story.memory.id}`);
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Failed to delete story. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{story.title}</h1>
        <button
          onClick={deleteStory}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-800"
        >
          {isDeleting ? 'Deleting...' : 'Delete Story'}
        </button>
      </div>
      
      <div className="mb-6 text-gray-500">
        <div>
          From memory: {story.memory.title} 
          ({story.memory.date ? format(new Date(story.memory.date), 'MMMM d, yyyy') : 'Date not specified'})
        </div>
        <div>Created: {format(new Date(story.createdAt), 'MMMM d, yyyy')}</div>
        <div className="mt-1 flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${aiModelClass}`}>
            Generated with {aiModelName}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            story.deliveryStatus === 'SENT' 
              ? 'bg-green-100 text-green-800' 
              : story.deliveryStatus === 'FAILED'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {story.deliveryStatus}
          </span>
        </div>
      </div>
      
      <div className="prose prose-indigo max-w-none">
        {/* Render story content with paragraph breaks */}
        {story.content.split('\n\n').map((paragraph: any, index: any) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      
      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Delivery Options</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Schedule Delivery</h3>
            <div className="flex items-end space-x-4">
              <div className="flex-grow">
                <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date and Time
                </label>
                <input
                  type="datetime-local"
                  id="deliveryDate"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                onClick={updateSchedule}
                disabled={isUpdating}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isUpdating ? 'Updating...' : 'Update Schedule'}
              </button>
            </div>
            {story.scheduledFor && (
              <p className="mt-2 text-sm text-gray-500">
                Currently scheduled for: {format(new Date(story.scheduledFor), 'MMMM d, yyyy h:mm a')}
              </p>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Send Now</h3>
            <p className="mb-2 text-sm text-gray-500">
              Send this story via WhatsApp immediately.
            </p>
            <button
              onClick={deliverStory}
              disabled={isDelivering || story.deliveryStatus === 'SENT'}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                story.deliveryStatus === 'SENT'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isDelivering 
                ? 'Sending...' 
                : story.deliveryStatus === 'SENT'
                ? 'Already Sent'
                : 'Send via WhatsApp Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}