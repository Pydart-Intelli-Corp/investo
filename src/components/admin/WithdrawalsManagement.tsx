'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  User,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface WithdrawalInfo {
  walletAddress: string;
  withdrawalMethod: string;
  processingFee: number;
  netAmount: number;
  bankDetails?: any;
  transactionHash?: string;
  processedAt?: string;
}

interface Withdrawal {
  id: number;
  transactionId: string;
  userId: number;
  amount: number;
  currency: string;
  status: string;
  withdrawalInfo: WithdrawalInfo;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
  processedAt?: string;
  approvedAt?: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    walletAddress: string;
    phoneNumber: string;
    walletBalance: number;
  };
}

interface WithdrawalsResponse {
  withdrawals: Withdrawal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const WithdrawalsManagement = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [showWithdrawalDetails, setShowWithdrawalDetails] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

  useEffect(() => {
    fetchPendingWithdrawals();
  }, [pagination.page]);

  const fetchPendingWithdrawals = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await fetch(`/api/admin/withdrawals/pending?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: { data: WithdrawalsResponse } = await response.json();
        setWithdrawals(data.data.withdrawals);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const approveWithdrawal = async (withdrawalId: number, notes: string, txHash: string) => {
    setProcessingId(withdrawalId);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/withdrawals/${withdrawalId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          notes,
          transactionHash: txHash 
        }),
      });

      if (response.ok) {
        fetchPendingWithdrawals();
        setShowWithdrawalDetails(false);
        setApprovalNotes('');
        setTransactionHash('');
      }
    } catch (error) {
      console.error('Error approving withdrawal:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const rejectWithdrawal = async (withdrawalId: number, reason: string) => {
    setProcessingId(withdrawalId);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/withdrawals/${withdrawalId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        fetchPendingWithdrawals();
        setShowWithdrawalDetails(false);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      processing: 'text-blue-600 bg-blue-100',
      completed: 'text-green-600 bg-green-100',
      rejected: 'text-red-600 bg-red-100',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const WithdrawalCard = ({ withdrawal }: { withdrawal: Withdrawal }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Wallet className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {withdrawal.user.firstName} {withdrawal.user.lastName}
            </h3>
            <p className="text-sm text-gray-500">{withdrawal.user.email}</p>
            <p className="text-xs text-gray-400">ID: {withdrawal.transactionId}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(withdrawal.amount)}
          </p>
          {withdrawal.withdrawalInfo.processingFee > 0 && (
            <p className="text-sm text-gray-500">
              Fee: {formatCurrency(withdrawal.withdrawalInfo.processingFee)}
            </p>
          )}
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
            {getStatusIcon(withdrawal.status)}
            <span className="capitalize">{withdrawal.status}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-xs text-gray-500">Net Amount</p>
          <p className="font-semibold text-green-600">
            {formatCurrency(withdrawal.withdrawalInfo.netAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Current Balance</p>
          <p className="font-semibold text-blue-600">
            {formatCurrency(withdrawal.user.walletBalance)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Method</p>
          <p className="font-medium text-sm">{withdrawal.withdrawalInfo.withdrawalMethod}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Requested</p>
          <p className="font-medium text-sm">{formatDate(withdrawal.createdAt)}</p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-500">Withdrawal Address</p>
        <p className="font-mono text-xs break-all bg-gray-50 p-2 rounded">
          {withdrawal.withdrawalInfo.walletAddress}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center space-x-2">
          {withdrawal.user.walletBalance >= withdrawal.amount ? (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs">Sufficient Balance</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">Insufficient Balance</span>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            setSelectedWithdrawal(withdrawal);
            setShowWithdrawalDetails(true);
          }}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Eye className="h-4 w-4" />
          <span className="text-sm">Review</span>
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Withdrawals</h1>
          <p className="text-gray-500">Review and process user withdrawal requests</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{pagination.total} pending approvals</span>
        </div>
      </div>

      {/* Withdrawals List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading withdrawals...</span>
          </div>
        </div>
      ) : withdrawals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {withdrawals.map((withdrawal) => (
            <WithdrawalCard key={withdrawal.id} withdrawal={withdrawal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-500">No pending withdrawals to review at the moment</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page <= 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">
              {pagination.page}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page >= pagination.pages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalsManagement;