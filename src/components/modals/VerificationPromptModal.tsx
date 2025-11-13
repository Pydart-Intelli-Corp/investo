'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface VerificationPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSendOTP: () => Promise<void>;
}

const VerificationPromptModal: React.FC<VerificationPromptModalProps> = ({
  isOpen,
  onClose,
  email,
  onSendOTP
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    setIsSending(true);
    setError('');
    setIsSuccess(false);

    try {
      await onSendOTP();
      setIsSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (!isSending) {
      setError('');
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 mx-4 max-w-md w-full border border-white/20"
          >
            {/* Close Button */}
            {!isSending && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            {/* Content */}
            <div className="text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white mb-2">
                Email Verification Required
              </h2>

              {/* Description */}
              <p className="text-gray-300 mb-1">
                Your email address needs to be verified before you can log in.
              </p>
              <p className="text-sm text-gray-400 mb-6">
                We'll send a verification code to: <span className="text-blue-400 font-medium">{email}</span>
              </p>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3 mb-4"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {/* Success Message */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-3 mb-4"
                >
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">Verification code sent! Redirecting...</span>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Send OTP Button */}
                <button
                  onClick={handleSendOTP}
                  disabled={isSending || isSuccess}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSending ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending Code...</span>
                    </div>
                  ) : isSuccess ? (
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Code Sent!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Send className="h-5 w-5" />
                      <span>Send Verification Code</span>
                    </div>
                  )}
                </button>

                {/* Cancel Button */}
                {!isSending && !isSuccess && (
                  <button
                    onClick={handleClose}
                    className="w-full bg-white/5 border border-white/20 text-gray-300 font-medium py-3 px-4 rounded-lg hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-white/20 focus:outline-none transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VerificationPromptModal;