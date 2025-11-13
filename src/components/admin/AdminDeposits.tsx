'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  AlertCircle, 
  DollarSign,
  User,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Download,
  FileText,
  CreditCard,
  TrendingUp,
  Hash,
  Image as ImageIcon,
  MessageSquare,
  X
} from 'lucide-react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  referralCode?: string;
}

interface DepositInfo {
  portfolioId?: number;
  portfolioName?: string;
  investmentAmount?: number;
  subscriptionFee?: number;
  platformFee?: number;
  totalAmount?: number;
  paymentProof?: {
    method: string;
    transactionHash?: string;
    proofImage?: string;
    notes?: string;
    uploadedAt: string;
  };
}

interface Deposit {
  id: number;
  transactionId: string;
  userId: number;
  amount: string;
  currency: string;
  status: 'pending' | 'completed' | 'rejected' | 'cancelled';
  description: string;
  depositInfo: DepositInfo;
  paymentMethod?: string;
  transactionHash?: string;
  proofImage?: string;
  notes?: string;
  adminNotes?: string;
  investmentAmount?: string;
  subscriptionFee?: string;
  platformFee?: string;
  created_at: string;
  user: User;
  approvedBy?: number;
  approvedAt?: string;
  rejectedBy?: number;
  rejectedAt?: string;
  rejectionReason?: string;
}

interface DepositStats {
  totalDeposits: number;
  pendingDeposits: number;
  approvedDeposits: number;
  rejectedDeposits: number;
  totalDepositAmount: number;
  todayDeposits: number;
}

const AdminDeposits: React.FC = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [stats, setStats] = useState<DepositStats | null>(null);
  const [loading, setLoading] = useState({
    deposits: true,
    stats: true,
    action: false
  });
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 20
  });
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionData, setActionData] = useState({
    type: '' as 'approve' | 'reject',
    notes: '',
    reason: ''
  });
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchDeposits();
    fetchStats();
  }, [filters.status, filters.page]);

  const fetchDeposits = async () => {
    try {
      setLoading(prev => ({ ...prev, deposits: true }));
      const token = localStorage.getItem('adminToken');
      
      const params = new URLSearchParams({
        status: filters.status,
        page: filters.page.toString(),
        limit: filters.limit.toString()
      });

      const response = await fetch(`/api/admin/deposits?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setDeposits(data.data);
      } else {
        showNotification('error', data.message || 'Failed to fetch deposits');
      }
    } catch (error) {
      console.error('Error fetching deposits:', error);
      showNotification('error', 'Error fetching deposits');
    } finally {
      setLoading(prev => ({ ...prev, deposits: false }));
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/deposits/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const handleApproveDeposit = async () => {
    if (!selectedDeposit) return;

    try {
      setLoading(prev => ({ ...prev, action: true }));
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/admin/deposits/${selectedDeposit.id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes: actionData.notes })
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('success', 'Deposit approved successfully');
        fetchDeposits();
        fetchStats();
        setShowModal(false);
        setSelectedDeposit(null);
      } else {
        showNotification('error', data.message || 'Failed to approve deposit');
      }
    } catch (error) {
      console.error('Error approving deposit:', error);
      showNotification('error', 'Error approving deposit');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleRejectDeposit = async () => {
    if (!selectedDeposit || !actionData.reason.trim()) {
      showNotification('error', 'Rejection reason is required');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, action: true }));
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/admin/deposits/${selectedDeposit.id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: actionData.reason })
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('success', 'Deposit rejected successfully');
        fetchDeposits();
        fetchStats();
        setShowModal(false);
        setSelectedDeposit(null);
      } else {
        showNotification('error', data.message || 'Failed to reject deposit');
      }
    } catch (error) {
      console.error('Error rejecting deposit:', error);
      showNotification('error', 'Error rejecting deposit');
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const openActionModal = (deposit: Deposit, action: 'approve' | 'reject') => {
    setSelectedDeposit(deposit);
    setActionData({ type: action, notes: '', reason: '' });
    setShowModal(true);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount.toString()));
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Deposit Management</h1>
        <p className="text-slate-300">Manage user deposit requests and payment approvals</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Deposits</p>
                <p className="text-2xl font-bold text-white">{stats.totalDeposits}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pendingDeposits}</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-400">{stats.approvedDeposits}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Rejected</p>
                <p className="text-2xl font-bold text-red-400">{stats.rejectedDeposits}</p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Amount</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.totalDepositAmount)}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Today</p>
                <p className="text-2xl font-bold text-blue-400">{stats.todayDeposits}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-slate-400" />
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by user, transaction ID..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="bg-slate-700 border border-slate-600 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[300px]"
              />
            </div>
          </div>

          <button
            onClick={() => { fetchDeposits(); fetchStats(); }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Deposits Table */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Payment Details</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading.deposits ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="text-slate-400">Loading deposits...</span>
                    </div>
                  </td>
                </tr>
              ) : deposits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-slate-400">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No deposits found</p>
                      <p className="text-sm">No deposits match the current filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                deposits.map((deposit) => (
                  <tr key={deposit.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-slate-700 rounded-full p-2">
                          <User className="h-4 w-4 text-slate-300" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {deposit.user.firstName} {deposit.user.lastName}
                          </p>
                          <p className="text-xs text-slate-400">{deposit.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-mono text-white">{deposit.transactionId}</p>
                        <p className="text-xs text-slate-400">ID: {deposit.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-lg font-bold text-green-400">{formatCurrency(deposit.amount)}</p>
                        {deposit.investmentAmount && (
                          <p className="text-xs text-slate-400">
                            Investment: {formatCurrency(deposit.investmentAmount)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {deposit.paymentMethod && (
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-3 w-3 text-slate-400" />
                            <span className="text-xs text-slate-300">{deposit.paymentMethod}</span>
                          </div>
                        )}
                        {deposit.transactionHash && (
                          <div className="flex items-center space-x-2">
                            <Hash className="h-3 w-3 text-slate-400" />
                            <span className="text-xs text-slate-300 font-mono truncate max-w-[100px]">
                              {deposit.transactionHash}
                            </span>
                          </div>
                        )}
                        {deposit.proofImage && (
                          <div className="flex items-center space-x-2">
                            <ImageIcon className="h-3 w-3 text-slate-400" />
                            <button
                              onClick={() => window.open(`/uploads/payment-proofs/${deposit.proofImage}`, '_blank')}
                              className="text-xs text-blue-400 hover:text-blue-300 underline"
                            >
                              View proof
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(deposit.status)}`}>
                        {getStatusIcon(deposit.status)}
                        <span className="capitalize">{deposit.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-white">
                          {new Date(deposit.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(deposit.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {deposit.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openActionModal(deposit, 'approve')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => openActionModal(deposit, 'reject')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1"
                            >
                              <XCircle className="h-3 w-3" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setSelectedDeposit(deposit);
                            setShowDetailsModal(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      {showModal && selectedDeposit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-700"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {actionData.type === 'approve' ? 'Approve Deposit' : 'Reject Deposit'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Deposit Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Transaction ID:</span>
                      <span className="text-white font-mono">{selectedDeposit.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Amount:</span>
                      <span className="text-white font-bold">{formatCurrency(selectedDeposit.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">User:</span>
                      <span className="text-white">{selectedDeposit.user.firstName} {selectedDeposit.user.lastName}</span>
                    </div>
                    {selectedDeposit.paymentMethod && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payment Method:</span>
                        <span className="text-white">{selectedDeposit.paymentMethod}</span>
                      </div>
                    )}
                  </div>
                </div>

                {actionData.type === 'approve' ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      value={actionData.notes}
                      onChange={(e) => setActionData(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      rows={3}
                      placeholder="Add any notes about this approval..."
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Rejection Reason *
                    </label>
                    <textarea
                      value={actionData.reason}
                      onChange={(e) => setActionData(prev => ({ ...prev, reason: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={3}
                      placeholder="Please provide a reason for rejecting this deposit..."
                      required
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={actionData.type === 'approve' ? handleApproveDeposit : handleRejectDeposit}
                  disabled={loading.action || (actionData.type === 'reject' && !actionData.reason.trim())}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 ${
                    actionData.type === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {loading.action ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    actionData.type === 'approve' ? 'Approve Deposit' : 'Reject Deposit'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedDeposit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Deposit Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Deposit Information */}
                <div className="space-y-4">
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Transaction Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Transaction ID:</span>
                        <span className="text-white font-mono">{selectedDeposit.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Amount:</span>
                        <span className="text-white font-bold text-lg">{formatCurrency(selectedDeposit.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Currency:</span>
                        <span className="text-white">{selectedDeposit.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedDeposit.status)}`}>
                          {getStatusIcon(selectedDeposit.status)}
                          <span className="capitalize">{selectedDeposit.status}</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Created:</span>
                        <span className="text-white">
                          {new Date(selectedDeposit.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-3 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      User Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Name:</span>
                        <span className="text-white">{selectedDeposit.user.firstName} {selectedDeposit.user.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-white">{selectedDeposit.user.email}</span>
                      </div>
                      {selectedDeposit.user.referralCode && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Referral Code:</span>
                          <span className="text-white font-mono">{selectedDeposit.user.referralCode}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Details */}
                  {(selectedDeposit.paymentMethod || selectedDeposit.transactionHash) && (
                    <div className="bg-slate-900 p-4 rounded-lg">
                      <h4 className="font-medium text-white mb-3 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        {selectedDeposit.paymentMethod && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Method:</span>
                            <span className="text-white">{selectedDeposit.paymentMethod}</span>
                          </div>
                        )}
                        {selectedDeposit.transactionHash && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Transaction Hash:</span>
                            <span className="text-white font-mono text-xs break-all">
                              {selectedDeposit.transactionHash}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {(selectedDeposit.notes || selectedDeposit.adminNotes || selectedDeposit.rejectionReason) && (
                    <div className="bg-slate-900 p-4 rounded-lg">
                      <h4 className="font-medium text-white mb-3 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Notes
                      </h4>
                      <div className="space-y-3 text-sm">
                        {selectedDeposit.notes && (
                          <div>
                            <span className="text-slate-400 block mb-1">User Notes:</span>
                            <span className="text-white">{selectedDeposit.notes}</span>
                          </div>
                        )}
                        {selectedDeposit.adminNotes && (
                          <div>
                            <span className="text-slate-400 block mb-1">Admin Notes:</span>
                            <span className="text-white">{selectedDeposit.adminNotes}</span>
                          </div>
                        )}
                        {selectedDeposit.rejectionReason && (
                          <div>
                            <span className="text-red-400 block mb-1">Rejection Reason:</span>
                            <span className="text-red-300">{selectedDeposit.rejectionReason}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Proof Image */}
                <div className="space-y-4">
                  {selectedDeposit.proofImage ? (
                    <div className="bg-slate-900 p-4 rounded-lg">
                      <h4 className="font-medium text-white mb-3 flex items-center">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Payment Proof
                      </h4>
                      <div className="relative">
                        <img
                          src={`/uploads/payment-proofs/${selectedDeposit.proofImage}`}
                          alt="Payment proof"
                          className="w-full h-auto rounded-lg border border-slate-600"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                          }}
                        />
                        <button
                          onClick={() => window.open(`/uploads/payment-proofs/${selectedDeposit.proofImage}`, '_blank')}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-75 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900 p-4 rounded-lg">
                      <h4 className="font-medium text-white mb-3 flex items-center">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Payment Proof
                      </h4>
                      <div className="text-center py-8 text-slate-400">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No payment proof uploaded</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-3">Actions</h4>
                    <div className="space-y-2">
                      {selectedDeposit.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setShowDetailsModal(false);
                              openActionModal(selectedDeposit, 'approve');
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve Deposit</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowDetailsModal(false);
                              openActionModal(selectedDeposit, 'reject');
                            }}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject Deposit</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setShowDetailsModal(false)}
                        className="w-full bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDeposits;