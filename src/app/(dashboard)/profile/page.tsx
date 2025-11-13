'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Wallet, 
  QrCode,
  Save,
  Upload,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Settings,
  Camera,
  Check,
  X,
  Copy,
  Verified,
  Award
} from 'lucide-react';

// Custom CSS to force text visibility
const inputStyle = `
  .profile-input {
    color: #6b7280 !important;
    background-color: #ffffff !important;
    -webkit-text-fill-color: #6b7280 !important;
  }
  .profile-input:focus {
    color: #6b7280 !important;
    background-color: #ffffff !important;
    -webkit-text-fill-color: #6b7280 !important;
  }
  .profile-input::-webkit-autofill,
  .profile-input::-webkit-autofill:hover,
  .profile-input::-webkit-autofill:focus,
  .profile-input::-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #6b7280 !important;
    color: #6b7280 !important;
  }
  
  /* Fix for active menu buttons */
  .profile-menu-active {
    background-color: #dbeafe !important;
    color: #2563eb !important;
    border: 1px solid #93c5fd !important;
  }
  .profile-menu-active .menu-icon,
  .profile-menu-active .menu-text {
    color: #16a34a !important;
    -webkit-text-fill-color: #16a34a !important;
  }
  .profile-menu-inactive {
    color: #4b5563 !important;
    -webkit-text-fill-color: #4b5563 !important;
  }
  .profile-menu-inactive:hover {
    background-color: #f9fafb !important;
    color: #374151 !important;
    -webkit-text-fill-color: #374151 !important;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = inputStyle;
  document.head.appendChild(styleSheet);
}

// Flag display component
const FlagDisplay = ({ countryCode }: { countryCode: string }) => {
  const country = COUNTRIES.find(c => c.code === countryCode);
  return (
    <span 
      className="text-lg inline-block"
      style={{ 
        fontFamily: '"Twemoji Mozilla", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "EmojiOne", "Android Emoji", "EmojiSymbols"',
        fontSize: '18px',
        lineHeight: '1',
        textRendering: 'optimizeSpeed'
      }}
      title={country?.name}
    >
      {country?.flag || '🏳️'}
    </span>
  );
};

interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  walletAddress: string;
  walletQRCode: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isProfileComplete: boolean;
  referralCode: string;
  currentRank: string;
  walletBalance: string;
  totalDeposited: string;
  totalWithdrawn: string;
  totalEarnings: string;
  created_at: string;
}

interface CountryData {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const COUNTRIES: CountryData[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', dialCode: '+420' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', dialCode: '+36' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', dialCode: '+352' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', dialCode: '+356' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', dialCode: '+357' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', dialCode: '+886' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', dialCode: '+852' },
  { code: 'MO', name: 'Macau', flag: '🇲🇴', dialCode: '+853' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dialCode: '+973' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54' },
];

const ProfileSettings: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(COUNTRIES[25]); // Default to India
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string>('');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    walletAddress: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Validation states
  const [validation, setValidation] = useState({
    email: false,
    phone: false,
    wallet: false,
    qrCode: false
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    walletAddress: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        
        // Populate form data
        setFormData({
          firstName: data.data.firstName || '',
          lastName: data.data.lastName || '',
          phoneNumber: data.data.phoneNumber || '',
          walletAddress: data.data.walletAddress || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        // Set validation states
        setValidation({
          email: data.data.isEmailVerified,
          phone: !!data.data.phoneNumber,
          wallet: !!data.data.walletAddress,
          qrCode: !!data.data.walletQRCode
        });

        // Extract country from phone number if available
        if (data.data.phoneNumber) {
          const phoneWithoutSpaces = data.data.phoneNumber.replace(/\s/g, '');
          const country = COUNTRIES.find(c => phoneWithoutSpaces.startsWith(c.dialCode));
          if (country) {
            setSelectedCountry(country);
          }
        }

        // Set QR code preview if available
        if (data.data.walletQRCode) {
          setQrCodePreview(data.data.walletQRCode);
        }
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      walletAddress: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    // Name validation - only if we're on personal tab
    if (activeTab === 'personal') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      } else if (formData.firstName.trim().length < 2) {
        newErrors.firstName = 'First name must be at least 2 characters';
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      } else if (formData.lastName.trim().length < 2) {
        newErrors.lastName = 'Last name must be at least 2 characters';
      }

      // Phone validation - optional but if provided, must be valid
      if (formData.phoneNumber && formData.phoneNumber.trim()) {
        const cleanPhone = formData.phoneNumber.replace(/\s/g, '').replace(/[^\d]/g, '');
        if (cleanPhone.length < 7 || cleanPhone.length > 15) {
          newErrors.phoneNumber = 'Please enter a valid phone number (7-15 digits)';
        }
      }
    }

    // Wallet validation - only if we're on wallet tab
    if (activeTab === 'wallet') {
      if (formData.walletAddress && formData.walletAddress.trim()) {
        const wallet = formData.walletAddress.trim();
        // More flexible wallet validation - most crypto addresses are 25-62 characters
        if (wallet.length < 25 || wallet.length > 62) {
          newErrors.walletAddress = 'Wallet address must be between 25-62 characters';
        } else if (!/^[a-zA-Z0-9]+$/.test(wallet)) {
          newErrors.walletAddress = 'Wallet address can only contain letters and numbers';
        }
      }
    }

    // Password validation - only if we're on security tab
    if (activeTab === 'security') {
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          newErrors.currentPassword = 'Current password is required to change password';
        }
        if (formData.newPassword.length < 6) {
          newErrors.newPassword = 'New password must be at least 6 characters';
        }
        if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }
    }

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (hasErrors) {
      console.log('Validation errors:', newErrors);
    }
    
    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No auth token found');
        showNotification('error', 'You are not logged in. Please login again.');
        router.push('/login');
        return;
      }

      // Clean phone number - extract only the number part if it already has country code
      let cleanPhoneNumber = formData.phoneNumber;
      if (cleanPhoneNumber && !cleanPhoneNumber.startsWith(selectedCountry.dialCode)) {
        cleanPhoneNumber = `${selectedCountry.dialCode} ${cleanPhoneNumber}`;
      }

      const updateData: any = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: cleanPhoneNumber.trim(),
        walletAddress: formData.walletAddress.trim(),
      };

      console.log('Sending update data:', updateData);

      if (qrCodeFile) {
        console.log('Processing QR code file:', qrCodeFile.name);
        // Convert file to base64
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            updateData.walletQRCode = reader.result as string;
            await submitUpdate(updateData);
          } catch (error) {
            console.error('Error updating profile with QR code:', error);
            showNotification('error', 'Failed to update profile. Please try again.');
          } finally {
            setSaving(false);
          }
        };
        reader.onerror = () => {
          console.error('Failed to read QR code file');
          showNotification('error', 'Failed to read QR code file. Please try again.');
          setSaving(false);
        };
        reader.readAsDataURL(qrCodeFile);
      } else {
        await submitUpdate(updateData);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('error', 'Failed to update profile. Please try again.');
      setSaving(false);
    }
  };

  const submitUpdate = async (updateData: any) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('No auth token in submitUpdate');
      alert('You are not logged in. Please login again.');
      router.push('/login');
      return;
    }

    console.log('Making API request to /api/user/profile with:', updateData);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      console.log('API response status:', response.status);
      const data = await response.json();
      console.log('API response data:', data);
      
      if (response.ok && data.success) {
        // Update user state with new data
        const updatedUser = data.data.user || data.data;
        setUser(updatedUser);
        
        // Update form data to reflect saved changes
        setFormData({
          firstName: updatedUser.firstName || '',
          lastName: updatedUser.lastName || '',
          phoneNumber: updatedUser.phoneNumber ? updatedUser.phoneNumber.replace(selectedCountry.dialCode, '').trim() : '',
          walletAddress: updatedUser.walletAddress || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Update validation states
        setValidation({
          email: updatedUser.isEmailVerified,
          phone: !!updatedUser.phoneNumber,
          wallet: !!updatedUser.walletAddress,
          qrCode: !!updatedUser.walletQRCode || !!qrCodeFile
        });

        // Clear QR code file and preview after successful upload
        if (qrCodeFile) {
          setQrCodeFile(null);
          if (updatedUser.walletQRCode) {
            setQrCodePreview(updatedUser.walletQRCode);
          }
        }

        // Update localStorage userData if it exists
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          const updatedUserData = { ...userData, ...updatedUser };
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
        }

        showNotification('success', 'Profile updated successfully!');
        console.log('Profile update successful');
      } else {
        console.error('API request failed:', data);
        showNotification('error', data.message || 'Failed to update profile. Please try again.');
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Network error in submitUpdate:', error);
      showNotification('error', 'Network error. Please check your connection and try again.');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    console.log('Password change initiated');
    
    // Clear previous errors
    setErrors({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      walletAddress: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      console.log('Missing required password fields');
      if (!formData.currentPassword) {
        setErrors(prev => ({ ...prev, currentPassword: 'Current password is required' }));
      }
      if (!formData.newPassword) {
        setErrors(prev => ({ ...prev, newPassword: 'New password is required' }));
      }
      if (!formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Please confirm your new password' }));
      }
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      console.log('Passwords do not match');
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    if (formData.newPassword.length < 6) {
      console.log('Password too short');
      setErrors(prev => ({ ...prev, newPassword: 'New password must be at least 6 characters long' }));
      return;
    }

    setSaving(true);
    console.log('Sending password change request');

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No auth token found');
        showNotification('error', 'You are not logged in. Please login again.');
        router.push('/login');
        return;
      }

      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      console.log('Password change response status:', response.status);
      const data = await response.json();
      console.log('Password change response data:', data);

      if (response.ok && data.success) {
        console.log('Password changed successfully');
        
        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        showNotification('success', 'Password changed successfully!');
      } else {
        console.error('Password change failed:', data);
        const errorMessage = data.message || 'Failed to change password. Please try again.';
        
        // Set specific error based on the response
        if (errorMessage.toLowerCase().includes('current password')) {
          setErrors(prev => ({ ...prev, currentPassword: errorMessage }));
        } else {
          setErrors(prev => ({ ...prev, newPassword: errorMessage }));
        }
        
        showNotification('error', errorMessage);
      }
    } catch (error) {
      console.error('Network error in password change:', error);
      showNotification('error', 'Network error. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleQrCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('error', 'File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showNotification('error', 'Please upload an image file');
        return;
      }

      setQrCodeFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setQrCodePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/user/send-verification', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        showNotification('success', 'Verification email sent! Please check your inbox.');
      } else {
        showNotification('error', 'Failed to send verification email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  };

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      showNotification('success', 'Referral code copied to clipboard!');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    console.log('Showing notification:', type, message);
    setNotification({ type, message });
    setTimeout(() => {
      console.log('Hiding notification');
      setNotification(null);
    }, 6000); // Increased to 6 seconds
  };

  const handleLogout = () => {
    console.log('Profile page logout initiated...');
    try {
      // Clear all authentication and user data
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('userPreferences');
      sessionStorage.clear();
      
      console.log('Profile page: All tokens and data cleared');
      
      // Force redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Profile page logout error:', error);
      // Fallback redirect
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const completionPercentage = Object.values(validation).filter(Boolean).length * 25;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-xl shadow-2xl border-2 min-w-[300px] ${
            notification.type === 'success' 
              ? 'bg-green-600 text-white border-green-400' 
              : 'bg-red-600 text-white border-red-400'
          }`}
          style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-center space-x-3">
            {notification.type === 'success' ? (
              <div className="bg-green-500 rounded-full p-1">
                <CheckCircle size={20} className="text-white" />
              </div>
            ) : (
              <div className="bg-red-500 rounded-full p-1">
                <AlertCircle size={20} className="text-white" />
              </div>
            )}
            <span className="font-semibold text-white flex-1">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <Shield size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Completion Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Profile Completion</h2>
              <span className="text-2xl font-bold text-blue-600">{completionPercentage}%</span>
            </div>
            
            <div className="bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`flex items-center space-x-2 ${validation.email ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle size={20} />
                <span className="text-sm">Email Verified</span>
              </div>
              <div className={`flex items-center space-x-2 ${validation.phone ? 'text-green-600' : 'text-gray-400'}`}>
                <Phone size={20} />
                <span className="text-sm">Phone Added</span>
              </div>
              <div className={`flex items-center space-x-2 ${validation.wallet ? 'text-green-600' : 'text-gray-400'}`}>
                <Wallet size={20} />
                <span className="text-sm">Wallet Address</span>
              </div>
              <div className={`flex items-center space-x-2 ${validation.qrCode ? 'text-green-600' : 'text-gray-400'}`}>
                <QrCode size={20} />
                <span className="text-sm">QR Code</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'personal' 
                        ? 'profile-menu-active' 
                        : 'profile-menu-inactive'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <User size={20} className={activeTab === 'personal' ? 'menu-icon text-green-600' : 'text-gray-600'} />
                      <span className={activeTab === 'personal' ? 'menu-text text-green-600 font-medium' : 'text-gray-600'}>Personal Info</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'security' 
                        ? 'profile-menu-active' 
                        : 'profile-menu-inactive'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Shield size={20} className={activeTab === 'security' ? 'menu-icon text-green-600' : 'text-gray-600'} />
                      <span className={activeTab === 'security' ? 'menu-text text-green-600 font-medium' : 'text-gray-600'}>Security</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('wallet')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'wallet' 
                        ? 'profile-menu-active' 
                        : 'profile-menu-inactive'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Wallet size={20} className={activeTab === 'wallet' ? 'menu-icon text-green-600' : 'text-gray-600'} />
                      <span className={activeTab === 'wallet' ? 'menu-text text-green-600 font-medium' : 'text-gray-600'}>Wallet & QR</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('referral')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'referral' 
                        ? 'profile-menu-active' 
                        : 'profile-menu-inactive'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Settings size={20} className={activeTab === 'referral' ? 'menu-icon text-green-600' : 'text-gray-600'} />
                      <span className={activeTab === 'referral' ? 'menu-text text-green-600 font-medium' : 'text-gray-600'}>Referral Info</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSubmit}>
                  {/* Personal Information Tab */}
                  {activeTab === 'personal' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
                      
                      {/* Email Verification Section */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Mail className={validation.email ? 'text-green-600' : 'text-gray-400'} size={20} />
                            <div>
                              <p className="font-medium text-gray-900">{user?.email}</p>
                              <p className={`text-sm ${validation.email ? 'text-green-600' : 'text-orange-600'}`}>
                                {validation.email ? 'Verified' : 'Not Verified'}
                              </p>
                            </div>
                          </div>
                          {!validation.email && (
                            <button
                              type="button"
                              onClick={sendVerificationEmail}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Verify Email
                            </button>
                          )}
                          {validation.email && (
                            <Verified className="text-green-600" size={24} />
                          )}
                        </div>
                      </div>

                      {/* Name Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className={`profile-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.firstName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your first name"
                            style={{
                              color: '#6b7280 !important',
                              backgroundColor: '#ffffff !important',
                              WebkitTextFillColor: '#6b7280 !important'
                            }}
                          />
                          {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className={`profile-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.lastName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your last name"
                            style={{
                              color: '#6b7280 !important',
                              backgroundColor: '#ffffff !important',
                              WebkitTextFillColor: '#6b7280 !important'
                            }}
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                          )}
                        </div>
                      </div>

                      {/* Phone Number with Country Picker */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="flex">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                              className="flex items-center space-x-2 px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <FlagDisplay countryCode={selectedCountry.code} />
                              <span className="text-sm text-gray-700">{selectedCountry.dialCode}</span>
                            </button>

                            {countryDropdownOpen && (
                              <div className="absolute top-full left-0 z-50 w-80 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                                {COUNTRIES.map((country) => (
                                  <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(country);
                                      setCountryDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                                  >
                                    <FlagDisplay countryCode={country.code} />
                                    <span className="text-sm text-gray-900">{country.name}</span>
                                    <span className="text-sm text-gray-500 ml-auto">{country.dialCode}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className={`profile-input flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your phone number"
                            style={{
                              color: '#6b7280 !important',
                              backgroundColor: '#ffffff !important',
                              WebkitTextFillColor: '#6b7280 !important'
                            }}
                          />
                        </div>
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={formData.currentPassword}
                              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                              className={`profile-input w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter current password"
                              style={{
                                color: '#6b7280 !important',
                                backgroundColor: '#ffffff !important',
                                WebkitTextFillColor: '#6b7280 !important'
                              }}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none p-1"
                              >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                          </div>
                          {errors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            className={`profile-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.newPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter new password"
                            style={{
                              color: '#6b7280 !important',
                              backgroundColor: '#ffffff !important',
                              WebkitTextFillColor: '#6b7280 !important'
                            }}
                          />
                          {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className={`profile-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Confirm new password"
                            style={{
                              color: '#6b7280 !important',
                              backgroundColor: '#ffffff !important',
                              WebkitTextFillColor: '#6b7280 !important'
                            }}
                          />
                          {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handlePasswordChange}
                          disabled={saving}
                          className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {saving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Changing Password...</span>
                            </>
                          ) : (
                            <>
                              <Shield size={20} />
                              <span>Change Password</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Wallet & QR Tab */}
                  {activeTab === 'wallet' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Wallet & QR Code</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Wallet Address
                          </label>
                          <input
                            type="text"
                            value={formData.walletAddress}
                            onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                            className={`profile-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.walletAddress ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your crypto wallet address"
                            style={{
                              color: '#6b7280 !important',
                              backgroundColor: '#ffffff !important',
                              WebkitTextFillColor: '#6b7280 !important'
                            }}
                          />
                          {errors.walletAddress && (
                            <p className="mt-1 text-sm text-red-600">{errors.walletAddress}</p>
                          )}
                          <p className="mt-1 text-sm text-gray-500">
                            This wallet address will be used for withdrawals
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Wallet QR Code
                          </label>
                          
                          {qrCodePreview && (
                            <div className="mb-4">
                              <img 
                                src={qrCodePreview} 
                                alt="Wallet QR Code"
                                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                              />
                            </div>
                          )}

                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                              type="file"
                              id="qrCodeUpload"
                              accept="image/*"
                              onChange={handleQrCodeUpload}
                              className="hidden"
                            />
                            <label 
                              htmlFor="qrCodeUpload"
                              className="cursor-pointer flex flex-col items-center space-y-2"
                            >
                              <Camera className="text-gray-400" size={48} />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Click to upload QR code
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG up to 5MB
                                </p>
                              </div>
                            </label>
                          </div>
                          
                          <p className="mt-1 text-sm text-gray-500">
                            Upload a QR code image for your wallet address
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Referral Info Tab */}
                  {activeTab === 'referral' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Referral Information</h3>
                      
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Your Referral Code</h4>
                              <div className="flex items-center space-x-2">
                                <code className="bg-white px-3 py-2 rounded border text-lg font-mono">
                                  {user?.referralCode}
                                </code>
                                <button
                                  type="button"
                                  onClick={copyReferralCode}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Copy size={20} />
                                </button>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Current Rank</h4>
                              <div className="flex items-center space-x-2">
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  user?.currentRank === 'Diamond' ? 'bg-blue-100 text-blue-800' :
                                  user?.currentRank === 'Platinum' ? 'bg-purple-100 text-purple-800' :
                                  user?.currentRank === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                                  user?.currentRank === 'Silver' ? 'bg-gray-100 text-gray-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {user?.currentRank}
                                </div>
                                <Award className="text-gray-400" size={20} />
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">
                                ${parseFloat(user?.walletBalance || '0').toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">Wallet Balance</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">
                                ${parseFloat(user?.totalDeposited || '0').toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">Total Deposited</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-purple-600">
                                ${parseFloat(user?.totalEarnings || '0').toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">Total Earnings</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-orange-600">
                                ${parseFloat(user?.totalWithdrawn || '0').toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">Total Withdrawn</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                            <div>
                              <h4 className="font-medium text-blue-900 mb-1">Profile Completion Required</h4>
                              <p className="text-sm text-blue-700">
                                Complete your profile to enable withdrawals and unlock all platform features. 
                                You need to verify your email, add phone number, wallet address, and upload QR code.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Save Button */}
                  {activeTab !== 'security' && activeTab !== 'referral' && (
                    <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save size={20} />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;