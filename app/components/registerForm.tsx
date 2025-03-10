/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/components/RegisterForm.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    partnerName: '',
    partnerPhoneNumber: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Phone number validation (if provided)
    if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
      setError('Invalid phone number format. Please include country code (e.g., +1234567890)');
      return;
    }
    
    if (formData.partnerPhoneNumber && !isValidPhoneNumber(formData.partnerPhoneNumber)) {
      setError('Invalid partner phone number format. Please include country code (e.g., +1234567890)');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          partnerName: formData.partnerName,
          partnerPhoneNumber: formData.partnerPhoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Registration successful, redirect to login
      router.push('/login?registered=true');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to validate phone number format
  function isValidPhoneNumber(phoneNumber: any) {
    // Allow only digits, plus sign at the beginning, and require at least 10 digits
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phoneNumber);
  }

  return (
    <div className="w-[600px] my-auto bg-white rounded-xl px-6 py-4 text-black">
      <h1 className="text-2xl font-bold mb-6">Create an Account</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
            Your Phone Number (for WhatsApp)
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+1234567890"
            className="w-full p-2 border rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Include country code (e.g., +1 for USA)
          </p>
        </div>
        
        <div>
          <label htmlFor="partnerName" className="block text-sm font-medium mb-1">
            Partner&apos;s Name
          </label>
          <input
            type="text"
            id="partnerName"
            name="partnerName"
            value={formData.partnerName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="partnerPhoneNumber" className="block text-sm font-medium mb-1">
            Partner&apos;s Phone Number (for WhatsApp)
          </label>
          <input
            type="tel"
            id="partnerPhoneNumber"
            name="partnerPhoneNumber"
            value={formData.partnerPhoneNumber}
            onChange={handleChange}
            placeholder="+1234567890"
            className="w-full p-2 border rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your stories will be sent to this number. Include country code (e.g., +1 for USA)
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
};