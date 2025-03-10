/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/components/UserProfile.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserProfile({ user }: {user: any}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    partnerName: '',
    phoneNumber: '',
    partnerPhoneNumber: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        partnerName: user.partnerName || '',
        phoneNumber: user.phoneNumber || '',
        partnerPhoneNumber: user.partnerPhoneNumber || '',
      });
    }
  }, [user]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setMessage('Profile updated successfully!');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white text-black rounded-xl p-[48px]">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      {message && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 px-4 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="mt-1 px-4 py-3 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
            />
            <p className="mt-1 text-sm text-gray-500">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label htmlFor="partnerName" className="block text-sm font-medium text-gray-700">
              Partner&apos;s Name
            </label>
            <input
              type="text"
              id="partnerName"
              name="partnerName"
              value={formData.partnerName}
              onChange={handleChange}
              className="mt-1 px-4 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Used in story generation to personalize content
            </p>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Your Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1234567890"
              className="mt-1 px-4 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Your WhatsApp number (including country code)
            </p>
          </div>

          <div>
            <label htmlFor="partnerPhoneNumber" className="block text-sm font-medium text-gray-700">
              Partner&apos;s Phone Number
            </label>
            <input
              type="tel"
              id="partnerPhoneNumber"
              name="partnerPhoneNumber"
              value={formData.partnerPhoneNumber}
              onChange={handleChange}
              placeholder="+1234567890"
              className="mt-1 px-4 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Your partner&apos;s WhatsApp number where stories will be sent (including country code)
            </p>
          </div>
        </div>

        <div className="flex items-center justify-start">
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}