'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Wallet,
  Copy,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  CreditCard,
  Shield,
  Clock,
  Camera,
  FileImage,
  X
} from 'lucide-react';
import Image from 'next/image';

interface Portfolio {
  id: number;
  name: string;
  description: string;
  minInvestment: number;
  maxInvestment: number;
  dailyROI: number;
}

interface AdminWallet {
  id: number;
  walletType: string;
  walletAddress: string;
  qrCodeImage: string | null;
  networkType: string;
  description: string;
  isActive: boolean;
}

interface PaymentScreenProps {
  portfolio: Portfolio;
  investmentAmount: number;
  onBack: () => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ 
  portfolio, 
  investmentAmount, 
  onBack 
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [adminWallets, setAdminWallets] = useState<AdminWallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<AdminWallet | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const subscriptionFee = 25;
  const totalAmount = investmentAmount + subscriptionFee;

  // Check authentication status
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (!authToken || !userData) {
      setError('Please log in to make a payment');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      return;
    }
    
    setIsAuthenticated(true);
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminWallets();
    }
  }, [isAuthenticated]);

  const fetchAdminWallets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/wallets/public');
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        setAdminWallets(data.data);
        // Select the first USDT BEP20 wallet as default
        const defaultWallet = data.data.find((w: AdminWallet) => 
          w.walletType === 'USDT' && w.networkType === 'BEP20' && w.isActive
        ) || data.data.find((w: AdminWallet) => w.isActive) || data.data[0];
        setSelectedWallet(defaultWallet);
      } else {
        setError('No admin wallets found. Please contact support.');
      }
    } catch (error) {
      console.error('Error fetching admin wallets:', error);
      setError('Failed to load payment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = async () => {
    if (selectedWallet?.walletAddress) {
      try {
        await navigator.clipboard.writeText(selectedWallet.walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy address:', error);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (PNG, JPG, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setScreenshot(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCompletePayment = async () => {
    if (!screenshot) {
      setError('Please upload a payment screenshot');
      return;
    }

    if (!selectedWallet) {
      setError('Please select a payment wallet');
      return;
    }

    // Check if user is logged in
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (!authToken || !userData) {
      setError('Please log in to submit payment');
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('portfolioId', portfolio.id.toString());
      formData.append('amount', investmentAmount.toString());
      formData.append('subscriptionFee', subscriptionFee.toString());
      formData.append('totalAmount', totalAmount.toString());
      formData.append('adminWalletId', selectedWallet.id.toString());
      formData.append('paymentType', selectedWallet.walletType);
      formData.append('networkType', selectedWallet.networkType);
      formData.append('screenshot', screenshot);

      const response = await fetch('/api/payments/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Auto redirect after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setError(data.message || 'Failed to submit payment. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      setError('Failed to submit payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600 text-lg font-medium">
            {!isAuthenticated ? 'Checking Authentication...' : 'Loading Payment Details...'}
          </p>
          {!isAuthenticated && (
            <p className="text-gray-500 text-sm">You will be redirected to login if not authenticated</p>
          )}
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center"
        >
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your payment has been submitted for review. You will receive a confirmation email once it's processed.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Processing Time:</strong> Usually within 24 hours<br/>
              <strong>Status Updates:</strong> Check your dashboard for updates
            </p>
          </div>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Plans
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
              Payment Summary
            </h2>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">{portfolio.name}</h3>
                <p className="text-sm text-gray-600">{portfolio.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Investment Amount:</span>
                  <span className="font-medium">${investmentAmount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Bot Subscription (Yearly):</span>
                  <span className="font-medium">${subscriptionFee}</span>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between py-2">
                    <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                    <span className="text-lg font-bold text-blue-600">${totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-900">Processing Time</h4>
                    <p className="text-sm text-amber-800">Manual verification usually takes 2-24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Wallet Selection & Payment Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Wallet className="w-5 h-5 text-green-600 mr-2" />
              Select Payment Wallet
            </h2>

            {/* Wallet Selection */}
            {adminWallets.length > 1 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Available Wallets</h3>
                <div className="grid gap-3">
                  {adminWallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      onClick={() => setSelectedWallet(wallet)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedWallet?.id === wallet.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            wallet.walletType === 'USDT' 
                              ? 'bg-green-100 text-green-600'
                              : wallet.walletType === 'BTC'
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            <Wallet className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {wallet.walletType} ({wallet.networkType})
                            </h4>
                            <p className="text-sm text-gray-600">{wallet.description}</p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedWallet?.id === wallet.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedWallet?.id === wallet.id && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Wallet Details */}
            {selectedWallet && (
              <div className="space-y-6">
                {/* QR Code */}
                {selectedWallet.qrCodeImage && (
                  <div className="text-center">
                    <div className="bg-gray-50 rounded-lg p-4 inline-block">
                      <Image
                        src={selectedWallet.qrCodeImage}
                        alt="Payment QR Code"
                        width={200}
                        height={200}
                        className="rounded-lg"
                        unoptimized
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Scan QR code to pay with {selectedWallet.walletType}
                    </p>
                  </div>
                )}

                {/* Wallet Information */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <h3 className="font-bold text-green-900 mb-2">Wallet Address</h3>
                    <div className="flex items-center space-x-2">
                      <code className="bg-white px-3 py-2 rounded border text-sm flex-1 break-all text-black font-mono">
                        {selectedWallet.walletAddress}
                      </code>
                      <button
                        onClick={handleCopyAddress}
                        className={`px-3 py-2 rounded transition-colors ${
                          copied 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="font-medium text-blue-900 text-sm">Currency</h4>
                      <p className="text-blue-800 font-bold">{selectedWallet.walletType}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <h4 className="font-medium text-purple-900 text-sm">Network</h4>
                      <p className="text-purple-800 font-bold">{selectedWallet.networkType}</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Shield className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Important</h4>
                        <p className="text-sm text-yellow-800">
                          Only send {selectedWallet.walletType} on {selectedWallet.networkType} network. 
                          Other networks may result in permanent loss.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Screenshot Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Camera className="w-5 h-5 text-purple-600 mr-2" />
            Upload Payment Screenshot
          </h2>

          <div className="space-y-6">
            {!screenshot ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Payment Screenshot</h3>
                <p className="text-gray-600 mb-4">
                  Take a screenshot of your payment confirmation and upload it here
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center space-x-2 mx-auto"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Image</span>
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: PNG, JPG, JPEG (Max 5MB)
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={screenshotPreview!}
                      alt="Payment Screenshot"
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{screenshot.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {(screenshot.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Ready to submit</span>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveScreenshot}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Complete Payment Button */}
            <div className="flex justify-end">
              <button
                onClick={handleCompletePayment}
                disabled={!screenshot || submitting}
                className={`px-8 py-3 rounded-lg font-bold text-white transition-all duration-300 flex items-center space-x-2 ${
                  screenshot && !submitting
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-1 shadow-lg hover:shadow-xl'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        {selectedWallet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
          >
            <h3 className="font-bold text-blue-900 mb-4">Payment Instructions</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>1. Send exactly <strong>${totalAmount.toLocaleString()} {selectedWallet.walletType}</strong> to the wallet address above</p>
              <p>2. Make sure to use the <strong>{selectedWallet.networkType}</strong> network</p>
              <p>3. Take a screenshot of your payment confirmation</p>
              <p>4. Upload the screenshot and click "Complete Payment"</p>
              <p>5. Wait for manual verification (usually within 24 hours)</p>
            </div>
            
            <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Selected Wallet Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Wallet ID:</span>
                  <span className="font-medium text-gray-900 ml-2">#{selectedWallet.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900 ml-2">{selectedWallet.walletType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Network:</span>
                  <span className="font-medium text-gray-900 ml-2">{selectedWallet.networkType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 ml-2">Active</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PaymentScreen;