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
    // Beginning
    location: string;
    timeAndWeather: string;
    sensoryImpression: string;
    // Characters
    peoplePresent: string;
    peopleActions: string;
    peopleAppearance: string;
    // Middle
    leadUp: string;
    keyMoment: string;
    sceneDescription: string;
    // Emotions
    initialFeeling: string;
    emotionalJourney: string;
    strongestEmotion: string;
    // End/Reflection
    impact: string;
    wouldChange: string;
    significance: string;
    // Photos
    photos: string[];
  }>({
    title: '',
    date: '',
    // Beginning
    location: '',
    timeAndWeather: '',
    sensoryImpression: '',
    // Characters
    peoplePresent: '',
    peopleActions: '',
    peopleAppearance: '',
    // Middle
    leadUp: '',
    keyMoment: '',
    sceneDescription: '',
    // Emotions
    initialFeeling: '',
    emotionalJourney: '',
    strongestEmotion: '',
    // End/Reflection
    impact: '',
    wouldChange: '',
    significance: '',
    // Photos
    photos: [],
  });
  
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setMemory((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: any) => {
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

    // Transform the new structure back to the API expected format
    const apiMemory = {
      title: memory.title,
      date: memory.date,
      location: memory.location,
      people: memory.peoplePresent,
      description: `
${memory.sceneDescription}

Lead up: ${memory.leadUp}
Key moment: ${memory.keyMoment}
Time and weather: ${memory.timeAndWeather}
      `.trim(),
      feelings: `
Initial feeling: ${memory.initialFeeling}
Emotional journey: ${memory.emotionalJourney}
Strongest emotion: ${memory.strongestEmotion}
      `.trim(),
      sensoryDetails: memory.sensoryImpression,
      significance: `
Impact: ${memory.impact}
What I would change: ${memory.wouldChange}
Why this memory is special: ${memory.significance}
      `.trim(),
      photos: memory.photos,
      // Include additional fields for AI context
      peopleActions: memory.peopleActions,
      peopleAppearance: memory.peopleAppearance,
    };

    try {
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
      router.push(`/memories/${data.id}`);
    } catch (error) {
      console.error('Error saving memory:', error);
      alert('Failed to save your memory. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    {
      title: "Basic Details",
      fields: [
        {
          name: "title",
          label: "Memory Title",
          type: "text",
          required: true,
        },
        {
          name: "date",
          label: "When did this happen?",
          type: "date",
          required: true,
        },
      ],
    },
    {
      title: "1. Let's Set the Scene (Beginning)",
      fields: [
        {
          name: "location",
          label: "Where did this memory happen?",
          type: "text",
          required: false,
        },
        {
          name: "timeAndWeather",
          label: "What time of day was it? What was the weather like?",
          type: "textarea",
          rows: 2,
          required: false,
        },
        {
          name: "sensoryImpression",
          label: "What do you remember seeing, hearing, or smelling?",
          type: "textarea", 
          rows: 3,
          required: false,
        },
      ],
    },
    {
      title: "2. The Characters",
      fields: [
        {
          name: "peoplePresent",
          label: "Who was there with you?",
          type: "text",
          required: false,
        },
        {
          name: "peopleActions",
          label: "What were they doing? What did they say?",
          type: "textarea",
          rows: 2,
          required: false,
        },
        {
          name: "peopleAppearance",
          label: "How did they look or act?",
          type: "textarea",
          rows: 2,
          required: false,
        },
      ],
    },
    {
      title: "3. The Story (the middle)",
      fields: [
        {
          name: "leadUp",
          label: "What happened before this moment?",
          type: "textarea",
          rows: 2,
          required: false,
        },
        {
          name: "keyMoment",
          label: "What was the most important part?",
          type: "textarea",
          rows: 2,
          required: false,
        },
        {
          name: "sceneDescription",
          label: "If you had to describe this as a movie scene, what would happen?",
          type: "textarea",
          rows: 3,
          required: true,
        },
      ],
    },
    {
      title: "4. Emotions and Feelings",
      fields: [
        {
          name: "initialFeeling",
          label: "How did you feel in that moment?",
          type: "textarea",
          rows: 2,
          required: false,
        },
        {
          name: "emotionalJourney",
          label: "Did your emotions change during the memory? Why?",
          type: "textarea",
          rows: 2,
          required: false,
        },
        {
          name: "strongestEmotion",
          label: "What's the strongest feeling you remember?",
          type: "textarea",
          rows: 2,
          required: false,
        },
      ],
    },
    {
      title: "5. From future me (the end)",
      fields: [
        {
          name: "impact",
          label: "Did this memory change anything for you?",
          type: "textarea",
          rows: 2,
          required: false,
        },
        {
          name: "wouldChange",
          label: "If you could relive it, would you change anything?",
          type: "textarea",
          rows: 2,
          required: false,
        },
        {
          name: "significance",
          label: "Why is this memory special to you?",
          type: "textarea",
          rows: 3,
          required: false,
        },
      ],
    },
    {
      title: "6. Photos (Optional)",
      fields: [
        {
          name: "photos",
          label: "Upload photos from this memory",
          type: "file",
          required: false,
        },
      ],
    },
  ];

  const nextSection = () => {
    if (activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
      case 'date':
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={memory[field.name as keyof typeof memory] as string}
            onChange={handleChange}
            required={field.required}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        );
      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            rows={field.rows || 3}
            value={memory[field.name as keyof typeof memory] as string}
            onChange={handleChange}
            required={field.required}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder={field.placeholder}
          />
        );
      case 'file':
        return (
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        );
      default:
        return null;
    }
  };

  const currentSection = sections[activeSection];

  return (
    <div>
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {sections.map((section, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSection(idx)}
              className={`rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium ${
                idx === activeSection
                  ? 'bg-indigo-600 text-white'
                  : idx < activeSection
                  ? 'bg-indigo-200 text-indigo-800'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="h-0.5 w-full bg-gray-200"></div>
          </div>
          <div className="relative flex justify-between">
            {sections.map((section, idx) => (
              <div key={idx} className="h-0.5">
                <div
                  className={`h-0.5 ${
                    idx <= activeSection ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                  style={{
                    width: idx === sections.length - 1 ? '0' : (idx < activeSection ? '100%' : '0')
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">{currentSection.title}</h2>
        
        <div className="space-y-4">
          {currentSection.fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          {activeSection > 0 && (
            <button
              type="button"
              onClick={prevSection}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          
          <div className="flex-1"></div>
          
          {activeSection < sections.length - 1 ? (
            <button
              type="button"
              onClick={nextSection}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Memory'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}