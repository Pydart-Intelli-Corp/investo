'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { handleApiResponse } from '@/utils/errorHandler';

// Custom CSS to force text visibility
const inputStyle = `
  .otp-input {
    color: #111827 !important;
    background-color: #ffffff !important;
    -webkit-text-fill-color: #111827 !important;
  }
  .otp-input:focus {
    color: #111827 !important;
    background-color: #ffffff !important;
    -webkit-text-fill-color: #111827 !important;
  }
  .otp-input::-webkit-autofill,
  .otp-input::-webkit-autofill:hover,
  .otp-input::-webkit-autofill:focus,
  .otp-input::-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #111827 !important;
    color: #111827 !important;
  }
  
  /* Force link visibility */
  .otp-link {
    color: #d97706 !important;
    text-decoration: none !important;
  }
  .otp-link:hover {
    color: #b45309 !important;
    text-decoration: none !important;
  }
  .otp-link:visited {
    color: #d97706 !important;
  }
  .otp-link:active {
    color: #92400e !important;
  }
  
  /* Override any global link styles */
  a.otp-link,
  a.otp-link:hover,
  a.otp-link:focus,
  a.otp-link:active,
  a.otp-link:visited {
    color: #d97706 !important;
    opacity: 1 !important;
    background: none !important;
    -webkit-background-clip: initial !important;
    background-clip: initial !important;
    -webkit-text-fill-color: #d97706 !important;
  }
  a.otp-link:hover {
    color: #b45309 !important;
    -webkit-text-fill-color: #b45309 !important;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = inputStyle;
  document.head.appendChild(styleSheet);
}

interface UserInfo {
  email: string;
  firstName: string;
  welcomeEmailSent: boolean;
  token?: string;
  refreshToken?: string;
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export default function VerifyOTPPage() {
  const [status, setStatus] = useState<'input' | 'verifying' | 'success' | 'error'>('input');
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(5);

  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  useEffect(() => {
    // Start countdown timer
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newOtp.every(digit => digit) && newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      handleVerifyOTP(pastedData);
    }
  };

  const handleVerifyOTP = async (otpCode: string) => {
    if (!email.trim()) {
      setStatus('error');
      setMessage('Email address is required. Please go back to registration.');
      return;
    }

    setStatus('verifying');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email, 
          otp: otpCode 
        }),
      });

      const result = await handleApiResponse(response);

      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setUserInfo(result.data);

        // Handle automatic login if tokens are provided
        if (result.autoLogin && result.data?.token) {
          const { token, refreshToken, user, redirectTo } = result.data;
          
          // Store authentication tokens with correct keys
          localStorage.setItem('authToken', token);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('userData', JSON.stringify(user));

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push(redirectTo || '/dashboard');
          }, 2000);
        }
      } else {
        setStatus('error');
        setMessage(result.message);
        
        // Extract attempts left from error message
        const match = result.message.match(/(\d+) attempts remaining/);
        if (match) {
          setAttemptsLeft(parseInt(match[1]));
        }
        
        // Clear OTP inputs
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (!email.trim()) {
      alert('Email address is required');
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await handleApiResponse(response);

      if (result.success) {
        setStatus('input');
        setMessage('');
        setOtp(['', '', '', '', '', '']);
        setAttemptsLeft(5);
        setTimeLeft(600); // 10 minutes
        inputRefs.current[0]?.focus();
        alert('A new OTP has been sent to your email address.');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    switch (status) {
      case 'input':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
            <p className="text-gray-600 mb-6">
              We've sent a 6-digit verification code to
              <br />
              <span className="font-medium text-gray-900">{email}</span>
            </p>

            <div className="space-y-6">
              <div className="flex justify-center space-x-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="otp-input w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-all bg-white"
                    placeholder="0"
                    style={{
                      color: '#111827 !important',
                      backgroundColor: '#ffffff !important',
                      WebkitTextFillColor: '#111827 !important'
                    }}
                  />
                ))}
              </div>

              {message && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{message}</p>
                  {attemptsLeft < 5 && (
                    <p className="text-xs text-red-600 mt-1">
                      {attemptsLeft} attempts remaining
                    </p>
                  )}
                </div>
              )}

              <div className="text-sm text-gray-500">
                {timeLeft > 0 ? (
                  <p>Code expires in {formatTime(timeLeft)}</p>
                ) : (
                  <p>Code has expired. Please request a new one.</p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleVerifyOTP(otp.join(''))}
                  disabled={otp.join('').length !== 6}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-700 hover:via-amber-700 hover:to-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Verify Code
                </button>

                <button
                  onClick={handleResendOTP}
                  disabled={isResending || timeLeft > 540} // Disable for first 60 seconds
                  className="w-full text-yellow-600 px-6 py-2 rounded-lg font-medium hover:text-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isResending ? 'Sending...' : 'Resend Code'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'verifying':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Code</h2>
            <p className="text-gray-600">Please wait while we verify your code...</p>
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
                  Welcome {userInfo.firstName || userInfo.user?.firstName}! Your account is now active.
                  {userInfo.welcomeEmailSent && " A welcome email has been sent to your inbox."}
                </p>
                {userInfo.token && (
                  <div className="mt-3 flex items-center justify-center text-yellow-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                    <span className="text-sm font-medium">Logging you in and redirecting to dashboard...</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              {!userInfo?.token && (
                <Link 
                  href="/login"
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-700 hover:via-amber-700 hover:to-yellow-800 transition-all duration-200 inline-block text-center"
                >
                  Login to Your Account
                </Link>
              )}
              <Link 
                href="/"
                className="otp-link w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors inline-block text-center"
                style={{ color: '#374151 !important' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
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
              <h3 className="text-sm font-medium text-red-800 mb-2">Need help?</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Make sure you entered all 6 digits correctly</li>
                <li>• Check your email for the latest code</li>
                <li>• The code expires after 10 minutes</li>
                <li>• You have {attemptsLeft} attempts remaining</li>
              </ul>
            </div>

            <div className="space-y-3">
              {attemptsLeft > 0 ? (
                <button
                  onClick={() => {
                    setStatus('input');
                    setMessage('');
                    setOtp(['', '', '', '', '', '']);
                    inputRefs.current[0]?.focus();
                  }}
                  className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                >
                  Try Again
                </button>
              ) : (
                <button
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isResending ? 'Sending...' : 'Get New Code'}
                </button>
              )}
              
              <Link 
                href="/register"
                className="otp-link w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors inline-block text-center"
                style={{ color: '#374151 !important' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
              >
                Start Over
              </Link>
            </div>
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
          <p className="text-xs text-gray-400 mb-2">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@investogold.com" className="text-yellow-400 hover:text-yellow-300">
              support@investogold.com
            </a>
          </p>
          
          {/* Legal Links */}
          <div className="flex justify-center space-x-4 text-xs text-gray-500 mt-2">
            <Link 
              href="/terms-and-conditions" 
              target="_blank"
              className="hover:text-yellow-400 transition-colors"
            >
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link 
              href="/privacy-policy" 
              target="_blank"
              className="hover:text-yellow-400 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

