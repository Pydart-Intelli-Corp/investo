'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, CheckCircle, ChevronDown, Coins } from 'lucide-react';
import { handleApiResponse } from '@/utils/errorHandler';

// Custom CSS to force text visibility
const inputStyle = `
  .register-input {
    color: #111827 !important;
    background-color: #ffffff !important;
    -webkit-text-fill-color: #111827 !important;
  }
  .register-input:focus {
    color: #111827 !important;
    background-color: #ffffff !important;
    -webkit-text-fill-color: #111827 !important;
  }
  .register-input::-webkit-autofill,
  .register-input::-webkit-autofill:hover,
  .register-input::-webkit-autofill:focus,
  .register-input::-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #111827 !important;
    color: #111827 !important;
  }
  
  /* Force link visibility */
  .register-link {
    color: #d97706 !important;
    text-decoration: none !important;
  }
  .register-link:hover {
    color: #b45309 !important;
    text-decoration: none !important;
  }
  .register-link:visited {
    color: #d97706 !important;
  }
  .register-link:active {
    color: #92400e !important;
  }
  
  /* Override any global link styles */
  a.register-link,
  a.register-link:hover,
  a.register-link:focus,
  a.register-link:active,
  a.register-link:visited {
    color: #d97706 !important;
    opacity: 1 !important;
    background: none !important;
    -webkit-background-clip: initial !important;
    background-clip: initial !important;
    -webkit-text-fill-color: #d97706 !important;
  }
  a.register-link:hover {
    color: #b45309 !important;
    -webkit-text-fill-color: #b45309 !important;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = inputStyle;
  document.head.appendChild(styleSheet);
}

// Flag display component with fallback
const FlagDisplay = ({ country, size = 'md' }: { country: any, size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg', 
    lg: 'text-xl'
  };
  
  const fontSize = {
    sm: '14px',
    md: '18px',
    lg: '20px'
  };

  return (
    <span 
      className={`${sizeClasses[size]} inline-block`}
      style={{ 
        fontFamily: '"Twemoji Mozilla", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "EmojiOne", "Android Emoji", "EmojiSymbols"',
        fontSize: fontSize[size],
        lineHeight: '1',
        textRendering: 'optimizeSpeed'
      }}
      title={country.name}
    >
      {country.flag}
    </span>
  );
};

// Country codes data with fallback flag display
const COUNTRIES = [
  { code: '+1', name: 'United States', flag: '🇺🇸', fallback: 'US', iso: 'US' },
  { code: '+1', name: 'Canada', flag: '🇨🇦', fallback: 'CA', iso: 'CA' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', iso: 'GB' },
  { code: '+91', name: 'India', flag: '🇮🇳', iso: 'IN' },
  { code: '+86', name: 'China', flag: '🇨🇳', iso: 'CN' },
  { code: '+49', name: 'Germany', flag: '🇩🇪', iso: 'DE' },
  { code: '+33', name: 'France', flag: '🇫🇷', iso: 'FR' },
  { code: '+81', name: 'Japan', flag: '🇯🇵', iso: 'JP' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷', iso: 'KR' },
  { code: '+61', name: 'Australia', flag: '🇦🇺', iso: 'AU' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷', iso: 'BR' },
  { code: '+7', name: 'Russia', flag: '🇷🇺', iso: 'RU' },
  { code: '+39', name: 'Italy', flag: '🇮🇹', iso: 'IT' },
  { code: '+34', name: 'Spain', flag: '🇪🇸', iso: 'ES' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱', iso: 'NL' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭', iso: 'CH' },
  { code: '+46', name: 'Sweden', flag: '🇸🇪', iso: 'SE' },
  { code: '+47', name: 'Norway', flag: '🇳🇴', iso: 'NO' },
  { code: '+45', name: 'Denmark', flag: '🇩🇰', iso: 'DK' },
  { code: '+358', name: 'Finland', flag: '🇫🇮', iso: 'FI' },
  { code: '+32', name: 'Belgium', flag: '🇧🇪', iso: 'BE' },
  { code: '+43', name: 'Austria', flag: '🇦🇹', iso: 'AT' },
  { code: '+48', name: 'Poland', flag: '🇵🇱', iso: 'PL' },
  { code: '+420', name: 'Czech Republic', flag: '🇨🇿', iso: 'CZ' },
  { code: '+36', name: 'Hungary', flag: '🇭🇺', iso: 'HU' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹', iso: 'PT' },
  { code: '+30', name: 'Greece', flag: '🇬🇷', iso: 'GR' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷', iso: 'TR' },
  { code: '+972', name: 'Israel', flag: '🇮🇱', iso: 'IL' },
  { code: '+971', name: 'UAE', flag: '🇦🇪', iso: 'AE' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦', iso: 'SA' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾', iso: 'MY' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬', iso: 'SG' },
  { code: '+66', name: 'Thailand', flag: '🇹🇭', iso: 'TH' },
  { code: '+84', name: 'Vietnam', flag: '🇻🇳', iso: 'VN' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭', iso: 'PH' },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩', iso: 'ID' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦', iso: 'ZA' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬', iso: 'EG' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬', iso: 'NG' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪', iso: 'KE' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽', iso: 'MX' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷', iso: 'AR' },
  { code: '+56', name: 'Chile', flag: '🇨🇱', iso: 'CL' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴', iso: 'CO' },
  { code: '+51', name: 'Peru', flag: '🇵🇪', iso: 'PE' }
];

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Default to US
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [referrerInfo, setReferrerInfo] = useState<any>(null);
  const [validatingRef, setValidatingRef] = useState(false);

  // Filter countries based on search term
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
    country.code.includes(countrySearchTerm)
  );

  // Validate referral code on component mount (optional)
  useEffect(() => {
    if (referralCode) {
      validateReferralCode(referralCode);
    }
  }, [referralCode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showCountryDropdown && !target.closest('.country-picker-container')) {
        setShowCountryDropdown(false);
        setCountrySearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCountryDropdown]);

  const validateReferralCode = async (refCode: string) => {
    setValidatingRef(true);
    try {
      const response = await fetch(`/api/auth/validate-referral/${refCode}`);
      if (response.ok) {
        const data = await response.json();
        setReferrerInfo(data.data);
      } else {
        setError('Invalid referral code. Please check the link and try again.');
      }
    } catch (error) {
      setError('Error validating referral code.');
    } finally {
      setValidatingRef(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear general error when user interacts with form
    if (error) setError('');
    if (success) setSuccess('');

    // Real-time validation for specific fields
    validateField(name, type === 'checkbox' ? checked : value);
  };

  const validateField = (fieldName: string, value: any) => {
    let fieldError = '';

    switch (fieldName) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          fieldError = 'Please enter a valid email address';
        }
        break;
      
      case 'password':
        if (value && value.length < 8) {
          fieldError = 'Password must be at least 8 characters long';
        } else if (value && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          fieldError = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
        }
        break;
      
      case 'confirmPassword':
        if (value && value !== formData.password) {
          fieldError = 'Passwords do not match';
        }
        break;
      
      case 'firstName':
        if (value && !/^[a-zA-Z\s]+$/.test(value)) {
          fieldError = 'First name can only contain letters and spaces';
        }
        break;
      
      case 'lastName':
        if (value && !/^[a-zA-Z\s]+$/.test(value)) {
          fieldError = 'Last name can only contain letters and spaces';
        }
        break;
      
      case 'phoneNumber':
        if (value && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
          fieldError = 'Please enter a valid phone number';
        }
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: fieldError
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
      isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // First name validation
    if (!formData.firstName) {
      errors.firstName = 'First name is required';
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      errors.firstName = 'First name can only contain letters and spaces';
      isValid = false;
    }

    // Last name validation
    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      errors.lastName = 'Last name can only contain letters and spaces';
      isValid = false;
    }

    // Phone number validation (optional but validate if provided)
    if (formData.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
      isValid = false;
    }

    setFieldErrors(errors);

    if (!isValid) {
      setError('Please fix the errors below and try again.');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phoneNumber: formData.phoneNumber ? `${selectedCountry.code} ${formData.phoneNumber}` : '',
          referralCode: referralCode || null
        }),
      });

      const result = await handleApiResponse(response);

      if (result.success) {
        // Registration successful - redirect to OTP verification
        setSuccess('Registration successful! Redirecting to email verification...');
        
        // Store email before clearing form
        const registeredEmail = formData.email;
        
        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: ''
        });
        
        // Redirect to OTP verification page
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(registeredEmail)}`);
        }, 1500);
      } else {
        // Handle different types of errors with user-friendly messages  
        if (result.message.includes('already exists')) {
          setFieldErrors({ email: 'An account with this email already exists' });
        }
        setError(result.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading during referral validation

  if (validatingRef) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-white mt-4">Validating referral code...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-500/10 rounded-full mix-blend-screen filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full mix-blend-screen filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-600/10 rounded-full mix-blend-screen filter blur-xl animate-pulse animation-delay-4000"></div>
        <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-amber-600/10 rounded-full mix-blend-screen filter blur-xl animate-pulse animation-delay-6000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div className="flex flex-col justify-center items-center p-12 text-white w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-lg"
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-yellow-500/25">
                  <div className="text-4xl font-bold text-black">🪙</div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-3xl opacity-20 blur-lg"></div>
              </div>
              
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Investogold
              </h1>
              
              <p className="text-xl text-gray-200 mb-12 leading-relaxed">
                Join the future of gold investment. Create your account and start your investment journey today.
              </p>
              
              <div className="space-y-6 text-left">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
                >
                  <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full"></div>
                  <span className="text-gray-200 font-medium">Free Account Creation</span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
                >
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full"></div>
                  <span className="text-gray-200 font-medium">Instant Email Verification</span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
                >
                  <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full"></div>
                  <span className="text-gray-200 font-medium">Referral Rewards Program</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md my-8"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                  <Coins className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-3xl opacity-20 blur-lg"></div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">Investogold</h1>
            </div>

            {/* Form Container */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600">Join thousands of successful investors</p>
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-full">
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700 font-medium">Account Registration</span>
                </div>
              </div>

              {/* Referrer Info */}
              {referrerInfo && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Referred by: {referrerInfo.firstName} {referrerInfo.lastName}
                      </p>
                      <p className="text-xs text-green-600">
                        Referral Code: {referralCode}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Referral Message */}
              {!referralCode && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center">
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Registering without a referral link
                      </p>
                      <p className="text-xs text-yellow-600">
                        You can still join Investogold! Referral links are optional but provide benefits.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Success Message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-700 text-sm">{success}</span>
                  </motion.div>
                )}

                {/* General Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center"
                  >
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`register-input w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200 ${
                          fieldErrors.firstName
                            ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                            : ''
                        }`}
                        placeholder="First name"
                        required
                        style={{
                          color: '#111827 !important',
                          backgroundColor: '#ffffff !important',
                          WebkitTextFillColor: '#111827 !important'
                        }}
                      />
                    </div>
                    {fieldErrors.firstName && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`register-input w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200 ${
                          fieldErrors.lastName
                            ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                            : ''
                        }`}
                        placeholder="Last name"
                        required
                        style={{
                          color: '#111827 !important',
                          backgroundColor: '#ffffff !important',
                          WebkitTextFillColor: '#111827 !important'
                        }}
                      />
                    </div>
                    {fieldErrors.lastName && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`register-input w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200 ${
                        fieldErrors.email
                          ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                          : ''
                      }`}
                      placeholder="Enter your email address"
                      required
                      style={{
                        color: '#111827 !important',
                        backgroundColor: '#ffffff !important',
                        WebkitTextFillColor: '#111827 !important'
                      }}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <div className="flex">
                      {/* Country Code Picker */}
                      <div className="relative country-picker-container">
                        <button
                          type="button"
                          onClick={() => {
                            setShowCountryDropdown(!showCountryDropdown);
                            setCountrySearchTerm('');
                          }}
                          className="flex items-center justify-center px-4 py-4 border border-r-0 border-gray-200 rounded-l-xl bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200 min-w-[100px] h-[56px]"
                        >
                          <div className="mr-1">
                            <FlagDisplay country={selectedCountry} size="md" />
                          </div>
                          <span className="text-sm text-gray-800 mr-1">{selectedCountry.code}</span>
                          <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Country Dropdown */}
                        {showCountryDropdown && (
                          <div className="absolute top-full left-0 z-50 w-72 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-hidden">
                            <div className="p-3 border-b border-gray-200">
                              <input
                                type="text"
                                placeholder="Search countries..."
                                value={countrySearchTerm}
                                onChange={(e) => setCountrySearchTerm(e.target.value)}
                                className="register-input w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 bg-white"
                                autoFocus
                                style={{
                                  color: '#111827 !important',
                                  backgroundColor: '#ffffff !important',
                                  WebkitTextFillColor: '#111827 !important'
                                }}
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {filteredCountries.length > 0 ? (
                                filteredCountries.map((country, index) => (
                                  <button
                                    key={`${country.iso}-${index}`}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(country);
                                      setShowCountryDropdown(false);
                                      setCountrySearchTerm('');
                                    }}
                                    className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors ${
                                      selectedCountry.iso === country.iso && selectedCountry.code === country.code ? 'bg-yellow-50' : ''
                                    }`}
                                  >
                                    <div className="mr-3 flex-shrink-0">
                                      <FlagDisplay country={country} size="md" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-900">{country.name}</div>
                                      <div className="text-xs text-gray-600">{country.code}</div>
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-3 text-sm text-gray-600 text-center">
                                  No countries found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Phone Number Input */}
                      <div className="relative flex-1">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className={`register-input w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-r-xl placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200 h-[56px] ${
                            fieldErrors.phoneNumber
                              ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                              : ''
                          }`}
                          placeholder="123-456-7890"
                          style={{
                            color: '#111827 !important',
                            backgroundColor: '#ffffff !important',
                            WebkitTextFillColor: '#111827 !important'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {fieldErrors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.phoneNumber}</p>
                  )}
                  <div className="mt-1 text-xs text-gray-600 flex items-center">
                    <div className="mr-1">
                      <FlagDisplay country={selectedCountry} size="sm" />
                    </div>
                    Selected: {selectedCountry.name} ({selectedCountry.code})
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password *
                  </label>
                  <div className="relative overflow-hidden rounded-xl">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      autoComplete="new-password"
                      style={{ 
                        WebkitTextSecurity: showPassword ? 'none' : 'disc',
                        color: '#111827 !important',
                        backgroundColor: '#ffffff !important',
                        WebkitTextFillColor: '#111827 !important'
                      } as React.CSSProperties}
                      className={`register-input w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-xl placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200 [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-caps-lock-indicator]:hidden [&::-webkit-strong-password-auto-fill-button]:hidden [&::-ms-reveal]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden ${
                        fieldErrors.password
                          ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                          : ''
                      }`}
                      placeholder="Enter password"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 z-10">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none p-1"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                  )}
                  <div className="mt-1 text-xs text-gray-600">
                    Password must be at least 8 characters with uppercase, lowercase, and number
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Confirm Password *
                  </label>
                  <div className="relative overflow-hidden rounded-xl">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      autoComplete="new-password"
                      style={{ 
                        WebkitTextSecurity: showConfirmPassword ? 'none' : 'disc',
                        color: '#111827 !important',
                        backgroundColor: '#ffffff !important',
                        WebkitTextFillColor: '#111827 !important'
                      } as React.CSSProperties}
                      className={`register-input w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-xl placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200 [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-caps-lock-indicator]:hidden [&::-webkit-strong-password-auto-fill-button]:hidden [&::-ms-reveal]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden ${
                        fieldErrors.confirmPassword
                          ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                          : ''
                      }`}
                      placeholder="Confirm password"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 z-10">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none p-1"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !!success}
                  className="w-full bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-yellow-700 hover:via-amber-700 hover:to-yellow-800 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-yellow-500/25"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : success ? (
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Account Created!</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>

                {/* Links */}
                <div className="mt-6 space-y-4">
                  <div className="border-t border-gray-200 pt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <Link href="/login" className="register-link font-semibold transition-colors">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Back to Home */}
            <div className="mt-8 text-center">
              <Link 
                href="/" 
                className="text-sm text-gray-300 hover:text-white transition-colors inline-flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to Home</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
