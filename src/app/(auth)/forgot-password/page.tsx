'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { handleApiResponse } from '@/utils/errorHandler';

// Custom CSS to force text visibility
const inputStyle = `
  .forgot-password-input {
    color: #111827 !important;
    background-color: #ffffff !important;
    -webkit-text-fill-color: #111827 !important;
  }
  .forgot-password-input:focus {
    color: #111827 !important;
    background-color: #ffffff !important;
    -webkit-text-fill-color: #111827 !important;
  }
  .forgot-password-input::-webkit-autofill,
  .forgot-password-input::-webkit-autofill:hover,
  .forgot-password-input::-webkit-autofill:focus,
  .forgot-password-input::-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #111827 !important;
    color: #111827 !important;
  }
  
  /* Force link visibility */
  .forgot-password-link {
    color: #d97706 !important;
    text-decoration: none !important;
  }
  .forgot-password-link:hover {
    color: #b45309 !important;
    text-decoration: none !important;
  }
  .forgot-password-link:visited {
    color: #d97706 !important;
  }
  .forgot-password-link:active {
    color: #92400e !important;
  }
  
  /* Override any global link styles */
  a.forgot-password-link,
  a.forgot-password-link:hover,
  a.forgot-password-link:focus,
  a.forgot-password-link:active,
  a.forgot-password-link:visited {
    color: #d97706 !important;
    opacity: 1 !important;
    background: none !important;
    -webkit-background-clip: initial !important;
    background-clip: initial !important;
    -webkit-text-fill-color: #d97706 !important;
  }
  a.forgot-password-link:hover {
    color: #b45309 !important;
    -webkit-text-fill-color: #b45309 !important;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = inputStyle;
  document.head.appendChild(styleSheet);
}

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsSuccess(false);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await handleApiResponse(response);

      if (result.success) {
        setIsSuccess(true);
        setError('');
        // Optionally redirect after a delay
        setTimeout(() => {
          router.push('/login');
        }, 5000);
      } else {
        setError(result.message || 'Failed to send reset email. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Network error. Please check your internet connection and try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto h-16 w-16 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full flex items-center justify-center mb-6"
          >
            <span className="text-white font-bold text-xl">🔑</span>
          </motion.div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-white/20"
        >
          {/* Success Message */}
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-green-400 text-xl">✓</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Reset Link Sent!
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    If an account with that email exists, a password reset link has been sent. 
                    Please check your inbox and spam folder.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-xl">⚠</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="forgot-password-input relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 transition-all duration-200 bg-white"
                placeholder="Enter your email address"
                disabled={isLoading || isSuccess}
                style={{
                  color: '#111827 !important',
                  backgroundColor: '#ffffff !important',
                  WebkitTextFillColor: '#111827 !important'
                }}
              />
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || isSuccess}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Sending Reset Link...
                  </div>
                ) : isSuccess ? (
                  <div className="flex items-center">
                    <span className="mr-2">✓</span>
                    Reset Link Sent
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </motion.button>
            </div>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/login"
                className="forgot-password-link inline-flex items-center text-sm font-medium transition-colors duration-200"
              >
                <span className="mr-2">←</span>
                Back to Login
              </Link>
            </motion.div>
          </div>

          {/* Additional Help */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Remember your password?{' '}
              <Link href="/login" className="forgot-password-link font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center text-sm text-gray-500"
        >
          <p>
            Need help?{' '}
            <Link href="/contact" className="forgot-password-link font-medium">
              Contact Support
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

