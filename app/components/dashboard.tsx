/* eslint-disable react/no-unescaped-entities */
// /app/components/Dashboard.js

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  interface Memory {
    id: string;
    title: string;
    date: string;
  }

  const [memories, setMemories] = useState<Memory[]>([]);
  interface Story {
    id: string;
    title: string;
    createdAt: string;
    scheduledFor?: string;
    deliveryStatus: 'SENT' | 'FAILED' | 'PENDING';
  }

  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch memories
        const memoriesRes = await fetch('/api/memories');
        const memoriesData = await memoriesRes.json();
        setMemories(memoriesData);

        // Fetch stories
        const storiesRes = await fetch('/api/stories');
        const storiesData = await storiesRes.json();
        setStories(storiesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading your memories...</div>;
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Memories</h2>
          <Link 
            href="/memories/add" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Add New Memory
          </Link>
        </div>
        
        {memories.length === 0 ? (
          <p>You haven't added any memories yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memories.map((memory) => (
              <Link href={`/memories/${memory.id}`} key={memory.id}>
                <div className="border rounded-lg p-4 hover:shadow-md transition">
                  <h3 className="font-medium">{memory.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(memory.date).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Stories</h2>
        {stories.length === 0 ? (
          <p>No stories have been generated yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stories.map((story) => (
              <Link href={`/stories/${story.id}`} key={story.id}>
                <div className="border rounded-lg p-4 hover:shadow-md transition">
                  <h3 className="font-medium">{story.title}</h3>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      Created: {new Date(story.createdAt).toLocaleDateString()}
                    </span>
                    {story.scheduledFor && (
                      <span className="text-sm text-indigo-600">
                        Scheduled: {new Date(story.scheduledFor).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
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
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}