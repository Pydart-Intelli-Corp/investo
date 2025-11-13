'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserInfo {
  email: string;
  firstName: string;
  welcomeEmailSent: boolean;
}

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('No verification token provided.');
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch(`/api/auth/verify-email?token=${verificationToken}`);
      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setUserInfo(data.data);
      } else {
        setStatus('error');
        setMessage(data.message || 'Email verification failed.');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setStatus('error');
      setMessage('An error occurred during email verification. Please try again.');
    }
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resendEmail.trim()) {
      alert('Please enter your email address');
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resendEmail }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Verification email has been sent! Please check your inbox.');
        setShowResendForm(false);
        setResendEmail('');
      } else {
        alert(data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h2>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Email Verified Successfully!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            
            {userInfo && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  Welcome {userInfo.firstName}! Your account is now active.
                  {userInfo.welcomeEmailSent && " A welcome email has been sent to your inbox."}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Link 
                href="/login"
                className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-700 hover:to-amber-700 transition-all duration-200 inline-block text-center shadow-lg shadow-yellow-500/25"
              >
                Login to Your Account
              </Link>
              <Link 
                href="/"
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block text-center"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-red-800 mb-2">Possible reasons:</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• The verification link has expired (links are valid for 24 hours)</li>
                <li>• The link has already been used</li>
                <li>• The link is invalid or corrupted</li>
              </ul>
            </div>

            {!showResendForm ? (
              <div className="space-y-3">
                <button
                  onClick={() => setShowResendForm(true)}
                  className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors shadow-lg shadow-yellow-500/25"
                >
                  Request New Verification Email
                </button>
                <Link 
                  href="/register"
                  className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block text-center"
                >
                  Create New Account
                </Link>
                <Link 
                  href="/"
                  className="w-full text-gray-500 px-6 py-3 rounded-lg font-medium hover:text-gray-700 transition-colors inline-block text-center"
                >
                  Back to Homepage
                </Link>
              </div>
            ) : (
              <form onSubmit={handleResendVerification} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <button
                    type="submit"
                    disabled={isResending}
                    className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-yellow-500/25"
                  >
                    {isResending ? 'Sending...' : 'Send Verification Email'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResendForm(false);
                      setResendEmail('');
                    }}
                    className="w-full text-gray-500 px-6 py-2 rounded-lg font-medium hover:text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
            Investogold
          </h1>
          <p className="mt-2 text-sm text-gray-400">Email Verification</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-3xl sm:px-10 border border-white/20">
          {renderContent()}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@investogold.com" className="text-yellow-400 hover:text-yellow-300">
              support@investogold.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}