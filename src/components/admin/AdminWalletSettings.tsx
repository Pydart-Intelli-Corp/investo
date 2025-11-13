'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  QrCode,
  Save,
  Upload,
  Camera,
  CheckCircle,
  AlertCircle,
  Copy,
  Edit,
  Trash2,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminWallet {
  id?: number;
  walletType: string;
  walletAddress: string;
  qrCodeImage: string;
  isActive: boolean;
  description: string;
  networkType: string;
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}

const AdminWalletSettings = () => {
  const [wallets, setWallets] = useState<AdminWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState<AdminWallet | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string>('');

  const [formData, setFormData] = useState<AdminWallet>({
    walletType: 'USDT',
    walletAddress: '',
    qrCodeImage: '',
    isActive: true,
    description: '',
    networkType: 'TRC20'
  });

  const cryptoOptions = [
    { value: 'USDT', label: 'USDT (Tether)', networks: ['TRC20', 'ERC20', 'BEP20'] },
    { value: 'BTC', label: 'Bitcoin', networks: ['Bitcoin'] },
    { value: 'ETH', label: 'Ethereum', networks: ['ERC20'] },
    { value: 'BNB', label: 'Binance Coin', networks: ['BEP20'] },
    { value: 'LTC', label: 'Litecoin', networks: ['Litecoin'] },
    { value: 'DOGE', label: 'Dogecoin', networks: ['Dogecoin'] }
  ];

  useEffect(() => {
    fetchAdminWallets();
  }, []);

  const fetchAdminWallets = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/wallets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setWallets(data.data || []);
      } else {
        showNotification('error', 'Failed to fetch admin wallets');
      }
    } catch (error) {
      console.error('Error fetching admin wallets:', error);
      showNotification('error', 'Network error while fetching wallets');
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.walletAddress.trim()) {
      showNotification('error', 'Wallet address is required');
      return;
    }

    if (!formData.description.trim()) {
      showNotification('error', 'Description is required');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      let submitData = { ...formData };

      // Handle QR code upload
      if (qrCodeFile) {
        const reader = new FileReader();
        reader.onload = async () => {
          submitData.qrCodeImage = reader.result as string;
          await submitWallet(submitData);
        };
        reader.readAsDataURL(qrCodeFile);
      } else {
        await submitWallet(submitData);
      }
    } catch (error) {
      console.error('Error saving wallet:', error);
      showNotification('error', 'Failed to save wallet');
      setSaving(false);
    }
  };

  const submitWallet = async (walletData: AdminWallet) => {
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingWallet 
        ? `/api/admin/wallets/${editingWallet.id}` 
        : '/api/admin/wallets';
      
      const method = editingWallet ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(walletData)
      });

      if (response.ok) {
        const data = await response.json();
        showNotification('success', `Wallet ${editingWallet ? 'updated' : 'added'} successfully!`);
        
        // Reset form
        resetForm();
        
        // Refresh wallets list
        await fetchAdminWallets();
      } else {
        const errorData = await response.json();
        showNotification('error', errorData.message || 'Failed to save wallet');
      }
    } catch (error) {
      console.error('Error submitting wallet:', error);
      showNotification('error', 'Network error while saving wallet');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (wallet: AdminWallet) => {
    setEditingWallet(wallet);
    setFormData({ ...wallet });
    setQrCodePreview(wallet.qrCodeImage);
    setShowAddForm(true);
  };

  const handleDelete = async (walletId: number) => {
    if (!confirm('Are you sure you want to delete this wallet?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/wallets/${walletId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        showNotification('success', 'Wallet deleted successfully!');
        await fetchAdminWallets();
      } else {
        showNotification('error', 'Failed to delete wallet');
      }
    } catch (error) {
      console.error('Error deleting wallet:', error);
      showNotification('error', 'Network error while deleting wallet');
    }
  };

  const toggleWalletStatus = async (walletId: number, isActive: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/wallets/${walletId}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        showNotification('success', `Wallet ${!isActive ? 'activated' : 'deactivated'} successfully!`);
        await fetchAdminWallets();
      } else {
        showNotification('error', 'Failed to update wallet status');
      }
    } catch (error) {
      console.error('Error toggling wallet status:', error);
      showNotification('error', 'Network error while updating wallet');
    }
  };

  const resetForm = () => {
    setFormData({
      walletType: 'USDT',
      walletAddress: '',
      qrCodeImage: '',
      isActive: true,
      description: '',
      networkType: 'TRC20'
    });
    setEditingWallet(null);
    setShowAddForm(false);
    setQrCodeFile(null);
    setQrCodePreview('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('success', 'Copied to clipboard!');
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const selectedCrypto = cryptoOptions.find(opt => opt.value === formData.walletType);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6 rounded-xl">
      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Admin Wallet Settings</h2>
          <p className="text-gray-300 mt-1">
            Manage crypto wallet addresses for receiving payments from users
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>Add Wallet</span>
        </button>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet) => (
          <motion.div
            key={wallet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 hover:border-slate-600 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  wallet.isActive 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg' 
                    : 'bg-gradient-to-r from-gray-500 to-gray-600'
                }`}>
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {wallet.walletType}
                  </h3>
                  <p className="text-sm text-gray-400">{wallet.networkType}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                wallet.isActive 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 text-gray-300'
              }`}>
                {wallet.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-300">Wallet Address</p>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="flex-1 text-xs bg-slate-700 text-gray-300 px-3 py-2 rounded-lg font-mono break-all border border-slate-600">
                    {wallet.walletAddress}
                  </code>
                  <button
                    onClick={() => copyToClipboard(wallet.walletAddress)}
                    className="text-gray-400 hover:text-blue-400 transition-colors p-2 hover:bg-slate-700 rounded-lg"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-300">Description</p>
                <p className="text-sm text-gray-400 mt-1">{wallet.description}</p>
              </div>

              {wallet.qrCodeImage && (
                <div>
                  <p className="text-sm font-medium text-gray-300">QR Code</p>
                  <img 
                    src={wallet.qrCodeImage}
                    alt="Wallet QR Code"
                    className="w-24 h-24 object-cover rounded-lg border border-slate-600 mt-1 bg-white"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2 pt-4 border-t border-slate-700">
                <button
                  onClick={() => handleEdit(wallet)}
                  className="flex-1 flex items-center justify-center space-x-1 text-blue-400 hover:bg-blue-900/30 px-3 py-2 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                  <span className="text-sm">Edit</span>
                </button>
                <button
                  onClick={() => toggleWalletStatus(wallet.id!, wallet.isActive)}
                  className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    wallet.isActive 
                      ? 'text-red-400 hover:bg-red-900/30' 
                      : 'text-green-400 hover:bg-green-900/30'
                  }`}
                >
                  {wallet.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span className="text-sm">{wallet.isActive ? 'Disable' : 'Enable'}</span>
                </button>
                <button
                  onClick={() => handleDelete(wallet.id!)}
                  className="flex items-center justify-center text-red-400 hover:bg-red-900/30 px-3 py-2 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {wallets.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700">
            <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Wallets Added</h3>
            <p className="text-gray-400 mb-4">Add your first crypto wallet to start receiving payments</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              <Plus size={20} />
              <span>Add First Wallet</span>
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Wallet Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingWallet ? 'Edit Wallet' : 'Add New Wallet'}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cryptocurrency Type
                  </label>
                  <select
                    value={formData.walletType}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      walletType: e.target.value,
                      networkType: cryptoOptions.find(opt => opt.value === e.target.value)?.networks[0] || ''
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {cryptoOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Network Type
                  </label>
                  <select
                    value={formData.networkType}
                    onChange={(e) => setFormData({ ...formData, networkType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {selectedCrypto?.networks.map((network) => (
                      <option key={network} value={network}>
                        {network}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wallet Address *
                  </label>
                  <input
                    type="text"
                    value={formData.walletAddress}
                    onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter wallet address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Main USDT receiving wallet"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Code (Optional)
                  </label>
                  
                  {qrCodePreview && (
                    <div className="mb-3">
                      <img 
                        src={qrCodePreview} 
                        alt="QR Code Preview"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
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
                      <Camera className="text-gray-400" size={32} />
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
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active (Available for payments)
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 bg-red-500 text-white border-2 border-red-600 rounded-lg hover:bg-red-600 hover:border-red-700 transition-colors font-medium shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>{editingWallet ? 'Update' : 'Save'} Wallet</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminWalletSettings;