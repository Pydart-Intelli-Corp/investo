'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardPlans } from '@/components';
import { 
  User, 
  Wallet, 
  TrendingUp, 
  Users, 
  Gift, 
  History, 
  Settings, 
  LogOut, 
  Copy, 
  ExternalLink,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Crown,
  Award,
  Bell,
  Eye,
  EyeOff,
  DollarSign,
  Activity,
  Zap,
  Target,
  Calendar,
  BarChart3,
  TrendingDown,
  Plus,
  Minus,
  ChevronRight,
  Star,
  Shield,
  RefreshCw
} from 'lucide-react';

// Custom CSS to force text visibility in dashboard inputs
const dashboardInputStyle = `
  .dashboard-input {
    color: #111827 !important;
    background-color: #ffffff !important;
    -webkit-text-fill-color: #111827 !important;
  }
  .dashboard-input:focus {
    color: #111827 !important;
    background-color: #ffffff !important;
    -webkit-text-fill-color: #111827 !important;
  }
  .dashboard-input::-webkit-autofill,
  .dashboard-input::-webkit-autofill:hover,
  .dashboard-input::-webkit-autofill:focus,
  .dashboard-input::-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #111827 !important;
    color: #111827 !important;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = dashboardInputStyle;
  document.head.appendChild(styleSheet);
}

interface DashboardUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  referralCode: string;
  walletBalance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalEarnings: number;
  totalCommissions: number;
  currentRank: string;
  directReferrals: number;
  totalReferrals: number;
  subscriptionStatus: string;
  isProfileComplete: boolean;
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
  description: string;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const [userResponse, transactionsResponse] = await Promise.all([
        fetch('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/user/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.data);
        setReferralLink(`${window.location.origin}/register?ref=${userData.data.referralCode}`);
      }

      if (transactionsResponse.ok) {
        const transactionData = await transactionsResponse.json();
        setTransactions(transactionData.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    router.push('/');
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      // Use a more modern toast notification instead of alert
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';
      toast.textContent = 'Referral link copied to clipboard!';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    });
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const getRankColor = (rank: string) => {
    const colors = {
      'Bronze': 'text-orange-400 bg-gradient-to-br from-orange-500/20 to-orange-600/20',
      'Silver': 'text-gray-400 bg-gray-100',
      'Gold': 'text-yellow-600 bg-yellow-100',
      'Platinum': 'text-yellow-600 bg-yellow-100',
      'Diamond': 'text-amber-600 bg-amber-100'
    };
    return colors[rank as keyof typeof colors] || 'text-gray-400 bg-gray-100';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'text-yellow-600 bg-yellow-100',
      'completed': 'text-green-400 bg-gradient-to-br from-green-500/20 to-green-600/20',
      'processing': 'text-yellow-600 bg-yellow-100',
      'failed': 'text-red-400 bg-gradient-to-br from-red-500/20 to-red-600/20',
      'rejected': 'text-red-400 bg-gradient-to-br from-red-500/20 to-red-600/20'
    };
    return colors[status as keyof typeof colors] || 'text-gray-400 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Dashboard</h2>
          <button
            onClick={() => router.push('/login')}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Show plans section if active tab is plans
  if (activeTab === 'plans') {
    return <DashboardPlans onClose={() => setActiveTab('overview')} showHeader={false} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user.firstName}! 👋
              </h2>
              <p className="text-gray-400 text-lg">
                Here's your portfolio overview and recent activity
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Current Time</p>
              <p className="text-lg font-semibold text-white">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Wallet Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl border border-yellow-500/30 p-6 relative overflow-hidden hover:border-yellow-500/60 transition-all"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-amber-600/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <button
                    onClick={toggleBalanceVisibility}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
                <div className="text-xs text-green-400 bg-gradient-to-br from-green-500/20 to-green-600/20 px-2 py-1 rounded-full">
                  +12.5%
                </div>
              </div>
              <p className="text-sm font-medium text-gray-400 mb-1">Wallet Balance</p>
              <p className="text-2xl font-bold text-white">
                {showBalance ? `$${parseFloat(user.walletBalance.toString()).toFixed(2)}` : '•••••'}
              </p>
              <p className="text-xs text-gray-500 mt-2">Available for withdrawal</p>
            </div>
          </motion.div>

          {/* Total Earnings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl border border-yellow-500/30 p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="text-xs text-green-400 bg-gradient-to-br from-green-500/20 to-green-600/20 px-2 py-1 rounded-full">
                  +8.2%
                </div>
              </div>
              <p className="text-sm font-medium text-gray-400 mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-green-400">
                {showBalance ? `$${parseFloat(user.totalEarnings.toString()).toFixed(2)}` : '•••••'}
              </p>
              <p className="text-xs text-gray-500 mt-2">Lifetime earnings</p>
            </div>
          </motion.div>

          {/* Referrals Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl border border-yellow-500/30 p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                  +{user.directReferrals} new
                </div>
              </div>
              <p className="text-sm font-medium text-gray-400 mb-1">Total Referrals</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold text-amber-600">
                  {user.totalReferrals}
                </p>
                <p className="text-sm text-gray-500">
                  ({user.directReferrals} direct)
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-2">Active network members</p>
            </div>
          </motion.div>

          {/* Commissions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl border border-yellow-500/30 p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Gift className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                  +15.3%
                </div>
              </div>
              <p className="text-sm font-medium text-gray-400 mb-1">Commissions</p>
              <p className="text-2xl font-bold text-yellow-600">
                {showBalance ? `$${parseFloat(user.totalCommissions.toString()).toFixed(2)}` : '•••••'}
              </p>
              <p className="text-xs text-gray-500 mt-2">Referral commissions earned</p>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Primary Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl border border-yellow-500/30 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Portfolio Overview</h3>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-400">
                    ROI: <span className="text-green-400 font-semibold">+18.5%</span>
                  </div>
                  <button className="text-white bg-yellow-600 hover:bg-yellow-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    View Details →
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
                  <DollarSign className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 mb-1">Total Invested</p>
                  <p className="text-xl font-bold text-yellow-600">
                    ${parseFloat(user.totalDeposited.toString()).toFixed(2)}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 mb-1">Profit Generated</p>
                  <p className="text-xl font-bold text-green-400">
                    ${(parseFloat(user.totalEarnings.toString()) - parseFloat(user.totalDeposited.toString())).toFixed(2)}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl">
                  <Target className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 mb-1">Success Rate</p>
                  <p className="text-xl font-bold text-amber-600">92.4%</p>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Referral Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl border border-yellow-500/30 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Referral Program</h3>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-400">Premium Member</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-gray-300 mb-3">Your Unique Referral Link</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="dashboard-input flex-1 px-4 py-3 border border-gray-200 rounded-lg bg-gray-900 text-sm font-mono"
                    style={{
                      color: '#111827 !important',
                      backgroundColor: '#ffffff !important',
                      WebkitTextFillColor: '#111827 !important'
                    }}
                  />
                  <button
                    onClick={copyReferralLink}
                    className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-6 py-3 rounded-lg hover:from-yellow-700 hover:to-amber-700 transition-all flex items-center space-x-2 transform hover:scale-105"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="font-medium">Copy</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-400">Commission Rate</p>
                  <p className="text-lg font-bold text-green-400">10%</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-gray-400">Bonus Levels</p>
                  <p className="text-lg font-bold text-amber-600">5 Tiers</p>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl border border-yellow-500/30 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                <button 
                  onClick={() => router.push('/transactions')}
                  className="text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {transactions.length > 0 ? (
                  transactions.slice(0, 4).map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-white/30 hover:bg-gray-900/70 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${
                          transaction.type === 'deposit' ? 'bg-gradient-to-br from-green-500/20 to-green-600/20' : 
                          transaction.type === 'withdrawal' ? 'bg-gradient-to-br from-red-500/20 to-red-600/20' : 'bg-yellow-100'
                        }`}>
                          {transaction.type === 'deposit' ? (
                            <Plus className="h-5 w-5 text-green-400" />
                          ) : transaction.type === 'withdrawal' ? (
                            <Minus className="h-5 w-5 text-red-400" />
                          ) : (
                            <Gift className="h-5 w-5 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {transaction.description || `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}`}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center space-x-2">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${
                          transaction.type === 'deposit' || transaction.type === 'commission' 
                            ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'commission' ? '+' : '-'}
                          ${parseFloat(transaction.amount.toString()).toFixed(2)}
                        </p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No transactions yet</p>
                    <p className="text-gray-400 text-sm">Your trading activity will appear here</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl border border-yellow-500/30 p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Account Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Verification</span>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Verified</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Profile</span>
                  <span className={`text-sm font-medium ${user.isProfileComplete ? 'text-green-400' : 'text-yellow-600'}`}>
                    {user.isProfileComplete ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Trading Bot</span>
                  <span className={`text-sm font-medium ${
                    user.subscriptionStatus === 'active' ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {user.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Profile Completion Alert */}
            {!user.isProfileComplete && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-xl p-6"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-bold text-yellow-800">Profile Incomplete</h3>
                </div>
                <p className="text-sm text-yellow-700 mb-4">
                  Complete your profile to unlock withdrawals and premium features.
                </p>
                <button 
                  onClick={() => router.push('/profile')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 font-medium"
                >
                  Complete Now →
                </button>
              </motion.div>
            )}

            {/* Enhanced Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl border border-yellow-500/30 p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/deposit')}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-4 py-3 rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span>Make Deposit</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('plans')}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 font-medium"
                >
                  <Zap className="h-4 w-4" />
                  <span>Trading Plans</span>
                </button>
                
                <button 
                  onClick={() => router.push('/referrals')}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-3 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 font-medium"
                >
                  <Users className="h-4 w-4" />
                  <span>My Network</span>
                </button>
                
                <button 
                  onClick={() => router.push('/profile')}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 font-medium"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </div>
            </motion.div>

            {/* Enhanced Subscription Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl border border-yellow-500/30 p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Trading Bot Status</h3>
              <div className="text-center">
                {user.subscriptionStatus === 'active' ? (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-3 bg-gradient-to-br from-green-500/20 to-green-600/20 text-green-800">
                      <Activity className="h-4 w-4 mr-2 text-green-400" />
                      Bot Active
                    </div>
                    <p className="text-sm text-green-700 font-medium mb-2">
                      🤖 Your bot is actively trading
                    </p>
                    <p className="text-xs text-green-400">
                      Generating returns automatically
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-3 bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-800 border border-red-200">
                      <Activity className="h-4 w-4 mr-2 text-red-400" />
                      <span className="text-red-400">No Active Plan</span>
                    </div>
                    <p className="text-xs text-red-400 mb-3">
                      Choose a plan to start earning
                    </p>
                    <button 
                      onClick={() => router.push('/plans')}
                      className="text-xs text-green-400 hover:text-green-700 font-medium bg-gray-900 px-3 py-1 rounded-md border border-green-200 hover:bg-green-50 transition-colors"
                    >
                      <span className="text-green-400">View Available Plans →</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;




