'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PhotoIcon,
  LinkIcon,
  FunnelIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CalendarIcon,
  UserIcon,
  WalletIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

interface PaymentRequest {
  id: number;
  userId: number;
  portfolioId: number;
  amount: number;
  subscriptionFee: number;
  totalAmount: number;
  paymentType: string;
  networkType: string;
  adminWalletId: number;
  paymentScreenshot: string;
  screenshotUrl: string;
  transactionHash: string | null;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  adminNotes: string | null;
  processedBy: number | null;
  processedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    referralCode: string;
    walletBalance: number;
  };
  portfolio: {
    id: number;
    name: string;
    description: string;
    type: string;
    riskLevel: string;
  };
  adminWallet: {
    id: number;
    walletAddress: string;
    networkType: string;
    currency: string;
  };
  processedByUser?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface PaymentStats {
  totalPayments: number;
  pendingPayments: number;
  completedPayments: number;
  rejectedPayments: number;
  processingPayments: number;
  todayPayments: number;
  totalAmount: number;
  completedAmount: number;
  pendingAmount: number;
  recentActivity: Array<{
    id: number;
    userName: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
  paymentsByType: Array<{
    type: string;
    count: number;
    totalAmount: number;
  }>;
}

export default function AdminPaymentManagement() {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentType, setSelectedPaymentType] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [paymentToReject, setPaymentToReject] = useState<PaymentRequest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bulkSelected, setBulkSelected] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchPayments();
    fetchStats();
  }, [selectedStatus, selectedPaymentType, currentPage]);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    const userRole = localStorage.getItem('userRole');

    if (!token || (userRole !== 'admin' && userRole !== 'superadmin')) {
      // Redirect to admin login
      window.location.href = '/adminpanel';
      return false;
    }
    return true;
  };

  const fetchPayments = async () => {
    if (!checkAuth()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        status: selectedStatus,
        paymentType: selectedPaymentType,
        page: currentPage.toString(),
        limit: '20'
      });

      const response = await fetch(`/api/admin/payments?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setPayments(data.data.payments);
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
      } else {
        setError(data.message || 'Failed to fetch payments');
      }
    } catch (err: any) {
      setError('Error fetching payments');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!checkAuth()) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/payments/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleApprovePayment = async (payment: PaymentRequest) => {
    setActionLoading(`approve-${payment.id}`);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/payments/${payment.id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminNotes })
      });

      const data = await response.json();
      if (data.success) {
        setPayments(prevPayments => 
          prevPayments.map(p => 
            p.id === payment.id 
              ? { ...p, status: 'COMPLETED', processedAt: new Date().toISOString() }
              : p
          )
        );
        alert('Payment approved successfully!');
        setShowDetailsModal(false);
        fetchStats();
      } else {
        setError(data.message || 'Failed to approve payment');
      }
    } catch (err: any) {
      setError('Error approving payment');
    } finally {
      setActionLoading(null);
      setAdminNotes('');
    }
  };

  const handleRejectPayment = async () => {
    if (!paymentToReject || !rejectReason.trim()) return;

    setActionLoading(`reject-${paymentToReject.id}`);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/payments/${paymentToReject.id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          reason: rejectReason.trim(),
          adminNotes 
        })
      });

      const data = await response.json();
      if (data.success) {
        setPayments(prevPayments => 
          prevPayments.map(p => 
            p.id === paymentToReject.id 
              ? { ...p, status: 'REJECTED', rejectionReason: rejectReason.trim(), processedAt: new Date().toISOString() }
              : p
          )
        );
        alert('Payment rejected successfully!');
        setShowRejectModal(false);
        setShowDetailsModal(false);
        setRejectReason('');
        setAdminNotes('');
        setPaymentToReject(null);
        fetchStats();
      } else {
        setError(data.message || 'Failed to reject payment');
      }
    } catch (err: any) {
      setError('Error rejecting payment');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: { bg: 'bg-gradient-to-r from-yellow-500 to-orange-500', text: 'text-white', icon: ClockIcon },
      PROCESSING: { bg: 'bg-gradient-to-r from-blue-500 to-blue-600', text: 'text-white', icon: ArrowPathIcon },
      COMPLETED: { bg: 'bg-gradient-to-r from-green-500 to-green-600', text: 'text-white', icon: CheckCircleIcon },
      REJECTED: { bg: 'bg-gradient-to-r from-red-500 to-red-600', text: 'text-white', icon: XCircleIcon },
      CANCELLED: { bg: 'bg-gradient-to-r from-gray-500 to-gray-600', text: 'text-white', icon: XCircleIcon }
    };

    const badge = badges[status as keyof typeof badges] || badges.PENDING;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-lg ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (bulkSelected.length === 0) return;
    
    if (action === 'reject' && !rejectReason.trim()) {
      alert('Please provide a rejection reason for bulk reject action');
      return;
    }

    setActionLoading(`bulk-${action}`);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/payments/bulk-action', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          paymentIds: bulkSelected,
          reason: action === 'reject' ? rejectReason.trim() : undefined,
          adminNotes
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Bulk ${action} completed: ${data.data.successCount} successful, ${data.data.errorCount} errors`);
        setBulkSelected([]);
        setShowBulkActions(false);
        setRejectReason('');
        setAdminNotes('');
        fetchPayments();
        fetchStats();
      } else {
        setError(data.message || `Failed to perform bulk ${action}`);
      }
    } catch (err: any) {
      setError(`Error performing bulk ${action}`);
    } finally {
      setActionLoading(null);
    }
  };

  const exportPayments = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        status: selectedStatus,
        paymentType: selectedPaymentType,
        export: 'true'
      });

      const response = await fetch(`/api/admin/payments?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        // Convert payment data to CSV
        const csvData = convertToCSV(data.data.payments);
        downloadCSV(csvData, `payments-export-${new Date().toISOString().split('T')[0]}.csv`);
      } else {
        setError(data.message || 'Failed to export payments');
      }
    } catch (err: any) {
      setError('Error exporting payments');
      console.error('Export error:', err);
    }
  };

  const convertToCSV = (payments: PaymentRequest[]) => {
    const headers = [
      'ID',
      'User Name',
      'User Email',
      'Portfolio',
      'Investment Amount',
      'Subscription Fee',
      'Total Amount',
      'Payment Type',
      'Network Type',
      'Status',
      'Created Date',
      'Processed Date',
      'Admin Notes',
      'Rejection Reason'
    ];

    const rows = payments.map(payment => [
      payment.id,
      `${payment.user.firstName} ${payment.user.lastName}`,
      payment.user.email,
      payment.portfolio.name,
      payment.amount,
      payment.subscriptionFee,
      payment.totalAmount,
      payment.paymentType,
      payment.networkType,
      payment.status,
      formatDate(payment.createdAt),
      payment.processedAt ? formatDate(payment.processedAt) : '',
      payment.adminNotes || '',
      payment.rejectionReason || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Payment Management</h2>
          <p className="text-gray-300">Monitor and manage user payment requests</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPayments}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-lg"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportPayments}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
          >
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 hover:border-slate-600 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-300">Total Payments</h3>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalPayments}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 hover:border-slate-600 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-300">Pending</h3>
                <p className="text-2xl font-bold text-white mt-1">{stats.pendingPayments}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 hover:border-slate-600 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-300">Completed</h3>
                <p className="text-2xl font-bold text-white mt-1">{stats.completedPayments}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 hover:border-slate-600 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-300">Rejected</h3>
                <p className="text-2xl font-bold text-white mt-1">{stats.rejectedPayments}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
                <XCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 hover:border-slate-600 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-300">Total Volume</h3>
                <p className="text-lg font-bold text-white mt-1">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 hover:border-slate-600 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-300">Today</h3>
                <p className="text-2xl font-bold text-white mt-1">{stats.todayPayments}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-300" />
            <label className="text-sm font-medium text-gray-300">Status:</label>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-300">Payment Type:</label>
          </div>
          <select
            value={selectedPaymentType}
            onChange={(e) => setSelectedPaymentType(e.target.value)}
            className="border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="USDT">USDT</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="BNB">BNB</option>
          </select>

          {bulkSelected.length > 0 && (
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-sm text-gray-300">{bulkSelected.length} selected</span>
              <button
                onClick={() => setShowBulkActions(true)}
                className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded text-sm hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg"
              >
                Bulk Actions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Requests Table */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="text-lg font-medium text-white">Payment Requests</h3>
        </div>

        {error && (
          <div className="p-4 bg-red-900/50 border-b border-red-700">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          </div>
        )}

        {payments.length === 0 ? (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Payments Found</h3>
            <p className="text-gray-400">
              {selectedStatus === 'all' ? 'No payment requests available.' : `No ${selectedStatus.toLowerCase()} payments found.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={bulkSelected.length === payments.filter(p => p.status === 'PENDING').length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBulkSelected(payments.filter(p => p.status === 'PENDING').map(p => p.id));
                        } else {
                          setBulkSelected([]);
                        }
                      }}
                      className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Payment Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Portfolio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800/50 divide-y divide-slate-700">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      {payment.status === 'PENDING' && (
                        <input
                          type="checkbox"
                          checked={bulkSelected.includes(payment.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkSelected([...bulkSelected, payment.id]);
                            } else {
                              setBulkSelected(bulkSelected.filter(id => id !== payment.id));
                            }
                          }}
                          className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <UserIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">
                            {payment.user.firstName} {payment.user.lastName}
                          </div>
                          <div className="text-sm text-gray-300">{payment.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        <div className="font-medium">{formatCurrency(payment.totalAmount)}</div>
                        <div className="text-xs text-gray-400">
                          Investment: {formatCurrency(payment.amount)}
                        </div>
                        <div className="text-xs text-gray-400">
                          Fee: {formatCurrency(payment.subscriptionFee)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <WalletIcon className="h-4 w-4 text-gray-300 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-white">{payment.paymentType}</div>
                          <div className="text-xs text-gray-400">{payment.networkType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{payment.portfolio.name}</div>
                      <div className="text-xs text-gray-400">{payment.portfolio.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowDetailsModal(true);
                        }}
                        className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded hover:from-indigo-700 hover:to-indigo-800 transition-all"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {payment.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprovePayment(payment)}
                            disabled={actionLoading === `approve-${payment.id}`}
                            className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-green-600 to-green-700 text-white rounded hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setPaymentToReject(payment);
                              setShowRejectModal(true);
                            }}
                            disabled={actionLoading === `reject-${payment.id}`}
                            className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white rounded hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all"
                          >
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-slate-600 bg-slate-700 text-white rounded text-sm disabled:opacity-50 hover:bg-slate-600 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-slate-600 bg-slate-700 text-white rounded text-sm disabled:opacity-50 hover:bg-slate-600 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full z-50"
          >
            <div className="relative top-20 mx-auto p-5 border border-slate-700 w-11/12 md:w-3/4 lg:w-1/2 shadow-2xl rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Payment Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">User</label>
                    <p className="mt-1 text-sm text-white">
                      {selectedPayment.user.firstName} {selectedPayment.user.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{selectedPayment.user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">User Balance</label>
                    <p className="mt-1 text-sm text-white">{formatCurrency(selectedPayment.user.walletBalance)}</p>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Investment Amount</label>
                    <p className="mt-1 text-sm text-white">{formatCurrency(selectedPayment.amount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Subscription Fee</label>
                    <p className="mt-1 text-sm text-white">{formatCurrency(selectedPayment.subscriptionFee)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Total Amount</label>
                    <p className="mt-1 text-sm font-medium text-white">{formatCurrency(selectedPayment.totalAmount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Payment Type</label>
                    <p className="mt-1 text-sm text-white">{selectedPayment.paymentType} ({selectedPayment.networkType})</p>
                  </div>
                </div>

                {/* Portfolio Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-300">Portfolio</label>
                  <p className="mt-1 text-sm text-white">{selectedPayment.portfolio.name}</p>
                  <p className="text-xs text-gray-400">{selectedPayment.portfolio.description}</p>
                </div>

                {/* Admin Wallet */}
                <div>
                  <label className="block text-sm font-medium text-gray-300">Admin Wallet Address</label>
                  <p className="mt-1 text-sm font-mono text-white break-all bg-slate-700 p-2 rounded border border-slate-600">
                    {selectedPayment.adminWallet.walletAddress}
                  </p>
                </div>

                {/* Transaction Hash */}
                {selectedPayment.transactionHash && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Transaction Hash</label>
                    <p className="mt-1 text-sm font-mono text-white break-all bg-slate-700 p-2 rounded border border-slate-600">
                      {selectedPayment.transactionHash}
                    </p>
                  </div>
                )}

                {/* Payment Screenshot */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Payment Screenshot</label>
                  <div className="border border-slate-600 rounded-lg overflow-hidden bg-slate-700">
                    <img 
                      src={selectedPayment.screenshotUrl} 
                      alt="Payment Screenshot"
                      className="w-full h-64 object-contain"
                    />
                  </div>
                </div>

                {/* Status and Processing Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Created</label>
                    <p className="mt-1 text-sm text-white">{formatDate(selectedPayment.createdAt)}</p>
                  </div>
                </div>

                {selectedPayment.processedAt && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Processed At</label>
                      <p className="mt-1 text-sm text-white">{formatDate(selectedPayment.processedAt)}</p>
                    </div>
                    {selectedPayment.processedByUser && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Processed By</label>
                        <p className="mt-1 text-sm text-white">
                          {selectedPayment.processedByUser.firstName} {selectedPayment.processedByUser.lastName}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    placeholder="Add internal notes..."
                  />
                </div>

                {/* Current Admin Notes */}
                {selectedPayment.adminNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Current Admin Notes</label>
                    <div className="mt-1 p-3 bg-slate-700 border border-slate-600 rounded-lg">
                      <p className="text-sm text-white">{selectedPayment.adminNotes}</p>
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {selectedPayment.rejectionReason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Rejection Reason</label>
                    <div className="mt-1 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                      <p className="text-sm text-red-200">{selectedPayment.rejectionReason}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedPayment.status === 'PENDING' && (
                  <div className="flex space-x-3 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => handleApprovePayment(selectedPayment)}
                      disabled={actionLoading === `approve-${selectedPayment.id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-all"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      {actionLoading === `approve-${selectedPayment.id}` ? 'Approving...' : 'Approve Payment'}
                    </button>
                    <button
                      onClick={() => {
                        setPaymentToReject(selectedPayment);
                        setShowRejectModal(true);
                      }}
                      disabled={actionLoading === `reject-${selectedPayment.id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-red-700 rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-all"
                    >
                      <XCircleIcon className="h-4 w-4 mr-2" />
                      Reject Payment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full z-50"
          >
            <div className="relative top-20 mx-auto p-5 border border-slate-700 w-96 shadow-2xl rounded-xl bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Reject Payment</h3>
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectReason('');
                      setPaymentToReject(null);
                    }}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                    className="w-full border border-slate-600 bg-slate-700 text-white rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
                    placeholder="Please provide a reason for rejecting this payment..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectReason('');
                      setPaymentToReject(null);
                    }}
                    className="flex-1 px-4 py-2 border border-slate-600 rounded-lg text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRejectPayment}
                    disabled={!rejectReason.trim() || actionLoading === `reject-${paymentToReject?.id}`}
                    className="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all shadow-lg"
                  >
                    {actionLoading === `reject-${paymentToReject?.id}` ? 'Rejecting...' : 'Reject Payment'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions Modal */}
      <AnimatePresence>
        {showBulkActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full z-50"
          >
            <div className="relative top-20 mx-auto p-5 border border-slate-700 w-96 shadow-2xl rounded-xl bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Bulk Actions</h3>
                  <button
                    onClick={() => setShowBulkActions(false)}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                <p className="text-sm text-gray-300 mb-4">
                  {bulkSelected.length} payment(s) selected
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (for bulk reject)
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Required for bulk reject action..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes (optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add notes for all selected payments..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleBulkAction('approve')}
                    disabled={actionLoading === 'bulk-approve'}
                    className="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading === 'bulk-approve' ? 'Approving...' : 'Bulk Approve'}
                  </button>
                  <button
                    onClick={() => handleBulkAction('reject')}
                    disabled={actionLoading === 'bulk-reject' || !rejectReason.trim()}
                    className="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading === 'bulk-reject' ? 'Rejecting...' : 'Bulk Reject'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}