'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TermsConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already accepted terms
    const hasAcceptedTerms = localStorage.getItem('hasAcceptedTerms');
    if (!hasAcceptedTerms) {
      setShowConsent(true);
    }
  }, []);

  const acceptTerms = () => {
    localStorage.setItem('hasAcceptedTerms', 'true');
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white shadow-md border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 md:flex md:items-center md:justify-between md:py-6 lg:px-8">
        <div className="md:flex-1 md:pr-6">
          <p className="text-base text-gray-700">
            Memory Storyteller collects the information you provide to create personalized stories. 
            We value your privacy and take steps to protect your data. By using our service, you agree to our 
            <Link href="/terms" className="text-indigo-600 hover:text-indigo-800 font-medium mx-1">
              Terms and Privacy Policy
            </Link>.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <Link 
            href="/terms" 
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Learn more
          </Link>
          <button
            type="button"
            onClick={acceptTerms}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            I Accept
          </button>
        </div>
      </div>
    </div>
  );
}