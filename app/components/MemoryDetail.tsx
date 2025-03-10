/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/components/MemoryDetail.js
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MemoryDetail({ memory }: {memory: any}) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [aiModel, setAiModel] = useState('claude'); 

  const generateStory = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memoryId: memory.id,
          scheduledFor: deliveryDate ? new Date(deliveryDate).toISOString() : null,
          aiModel: aiModel,
        }),
      });

      console.log('story response', response);
      
      if (!response.ok) {
        throw new Error('Failed to generate story');
      }
      
      const story = await response.json();
      router.push(`/stories/${story.id}`);
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Failed to generate story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteMemory = async () => {
    if (!confirm('Are you sure you want to delete this memory? This will also delete all associated stories.')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/memories/${memory.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete memory');
      }
      
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error deleting memory:', error);
      alert('Failed to delete memory. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{memory.title}</h1>
        <button
          onClick={deleteMemory}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-800"
        >
          {isDeleting ? 'Deleting...' : 'Delete Memory'}
        </button>
      </div>
      
      <div className="mb-6 text-gray-500">
        {memory.date ? format(new Date(memory.date), 'MMMM d, yyyy') : 'Date not specified'}
        {memory.location && ` • ${memory.location}`}
      </div>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="whitespace-pre-line">{memory.description}</p>
        </section>
        
        {memory.feelings && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Feelings</h2>
            <p className="whitespace-pre-line">{memory.feelings}</p>
          </section>
        )}
        
        {memory.sensoryDetails && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Sensory Details</h2>
            <p className="whitespace-pre-line">{memory.sensoryDetails}</p>
          </section>
        )}
        
        {memory.significance && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Significance</h2>
            <p className="whitespace-pre-line">{memory.significance}</p>
          </section>
        )}
        
        {memory.photos && memory.photos.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {memory.photos.map((photo: any) => (
                <div key={photo.id} className="aspect-w-1 aspect-h-1">
                  <img
                    src={photo.url}
                    alt="Memory"
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      
      <div className="mt-10 border-t pt-6">
        <h2 className="text-2xl font-semibold mb-4">Stories from this Memory</h2>
        
        {memory.stories && memory.stories.length > 0 ? (
          <div className="space-y-4">
            {memory.stories.map((story: any) => (
              <div key={story.id} className="border rounded-lg p-4">
                <h3 className="font-medium">{story.title}</h3>
                <p className="text-sm text-gray-500">
                  Created: {format(new Date(story.createdAt), 'MMMM d, yyyy')}
                </p>
                <div className="mt-2">
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full mr-2">
                    {story.aiModel === 'chatgpt' ? 'ChatGPT' : 'Claude AI'}
                  </span>
                  <Link
                    href={`/stories/${story.id}`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    View Story
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven&apos;t created any stories from this memory yet.</p>
        )}
        
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Generate a New Story</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="aiModel" className="block text-sm font-medium text-gray-700 mb-1">
                Select AI Model
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="aiModel"
                    value="claude"
                    checked={aiModel === 'claude'}
                    onChange={() => setAiModel('claude')}
                    className="mr-2"
                  />
                  <span className="text-sm">Claude AI</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="aiModel"
                    value="chatgpt"
                    checked={aiModel === 'chatgpt'}
                    onChange={() => setAiModel('chatgpt')}
                    className="mr-2"
                  />
                  <span className="text-sm">ChatGPT</span>
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {aiModel === 'claude' 
                  ? 'Claude AI tends to create more emotional, nuanced stories with rich sensory details.'
                  : 'ChatGPT often creates well-structured, coherent stories with good narrative flow.'}
              </p>
            </div>
          
            <div>
              <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Schedule Delivery (Optional)
              </label>
              <input
                type="datetime-local"
                id="deliveryDate"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p className="mt-1 text-sm text-gray-500">
                Leave blank to generate without scheduling delivery
              </p>
            </div>
          </div>
          
          <button
            onClick={generateStory}
            disabled={isGenerating}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isGenerating ? 'Generating...' : `Generate Story with ${aiModel === 'claude' ? 'Claude AI' : 'ChatGPT'}`}
          </button>
        </div>
      </div>
    </div>
  );
}