'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  CreditCard,
  Wallet,
  UserCheck,
  AlertCircle,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import {
  UsersManagement,
  WithdrawalsManagement,
  ReferralManagement,
  AdminWalletSettings,
} from '@/components';
import AdminPaymentManagement from '@/components/admin/AdminPaymentManagement';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface DashboardStats {
  users: {
    total: number;
    active: number;
    newToday: number;
  };
  transactions: {
    total: number;
    pending: number;
    totalDeposits: number;
    totalWithdrawals: number;
  };
  portfolios: {
    active: number;
  };
  pendingApprovals: {
    deposits: number;
    withdrawals: number;
  };
  recentTransactions: any[];
}

interface NavigationItem {
  name: string;
  icon: any;
  path: string;
  count?: number;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchDashboardStats();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    const userRole = localStorage.getItem('userRole');
    const adminUser = localStorage.getItem('adminUser');

    if (!token || (userRole !== 'admin' && userRole !== 'superadmin')) {
      router.push('/adminpanel');
      return;
    }

    if (adminUser) {
      setUser(JSON.parse(adminUser));
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminUser');
    router.push('/adminpanel');
  };

  const navigationItems: NavigationItem[] = [
    { name: 'Dashboard', icon: BarChart3, path: 'dashboard' },
    { name: 'Users', icon: Users, path: 'users' },
    { 
      name: 'Deposits', 
      icon: CreditCard, 
      path: 'deposits',
      count: stats?.pendingApprovals.deposits || 0
    },
    { 
      name: 'Withdrawals', 
      icon: Wallet, 
      path: 'withdrawals',
      count: stats?.pendingApprovals.withdrawals || 0
    },
    { name: 'Payment Management', icon: DollarSign, path: 'payment-management' },
    { name: 'Portfolios', icon: TrendingUp, path: 'portfolios' },
    { name: 'Referrals', icon: UserCheck, path: 'referrals' },
    { name: 'Wallet Settings', icon: Settings, path: 'wallet-settings' },
    { name: 'Deposit Management', icon: CreditCard, path: 'deposit-management' },
    { name: 'Reports', icon: Activity, path: 'reports' },
    { name: 'Settings', icon: Settings, path: 'settings' },
  ];

  const StatCard = ({ title, value, subtext, icon: Icon, color = 'blue' }: {
    title: string;
    value: string | number;
    subtext?: string;
    icon: any;
    color?: string;
  }) => (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-gradient-to-br from-gray-900 via-slate-900 to-black rounded-xl shadow-2xl border border-yellow-500/30 p-6 hover:border-yellow-500/60 transition-all hover:shadow-yellow-600/20"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-300">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mt-1">{value}</p>
          {subtext && (
            <p className="text-sm text-gray-400 mt-1">{subtext}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-r ${
          color === 'blue' ? 'from-yellow-500 to-amber-600' :
          color === 'green' ? 'from-green-500 to-green-600' :
          color === 'red' ? 'from-red-500 to-red-600' :
          color === 'purple' ? 'from-amber-500 to-amber-600' :
          'from-gray-500 to-gray-600'
        } shadow-lg shadow-${color === 'blue' || color === 'purple' ? 'yellow' : color}-600/50`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const RecentTransactionItem = ({ transaction }: { transaction: any }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-700 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${
          transaction.type === 'deposit' ? 'bg-gradient-to-r from-green-500 to-green-600' :
          transaction.type === 'withdrawal' ? 'bg-gradient-to-r from-red-500 to-red-600' :
          'bg-gradient-to-r from-yellow-500 to-amber-600'
        } shadow-lg`}>
          {transaction.type === 'deposit' ? (
            <TrendingUp className="h-4 w-4 text-white" />
          ) : transaction.type === 'withdrawal' ? (
            <Wallet className="h-4 w-4 text-white" />
          ) : (
            <DollarSign className="h-4 w-4 text-white" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            {transaction.user?.firstName} {transaction.user?.lastName}
          </p>
          <p className="text-xs text-gray-400">
            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-white">
          ${parseFloat(transaction.amount).toLocaleString()}
        </p>
        <div className="flex items-center space-x-1">
          {transaction.status === 'pending' && (
            <Clock className="h-3 w-3 text-yellow-400" />
          )}
          {transaction.status === 'completed' && (
            <CheckCircle className="h-3 w-3 text-green-400" />
          )}
          {transaction.status === 'rejected' && (
            <XCircle className="h-3 w-3 text-red-400" />
          )}
          <span className={`text-xs font-medium ${
            transaction.status === 'pending' ? 'text-yellow-400' :
            transaction.status === 'completed' ? 'text-green-400' :
            'text-red-400'
          }`}>
            {transaction.status}
          </span>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-yellow-600 rounded-full animate-spin"></div>
          <span className="text-yellow-400 text-lg font-medium">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 via-slate-900 to-black shadow-2xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 border-r border-yellow-500/20`}>
        <div className="flex items-center justify-between p-6 border-b border-yellow-500/30 bg-gradient-to-r from-yellow-600/10 to-amber-600/10">
          <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">Investogold Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-yellow-600/20 text-yellow-400 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                setActiveSection(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-6 py-3 text-left transition-all duration-200 ${
                activeSection === item.path 
                  ? 'bg-gradient-to-r from-yellow-600 to-amber-600 border-r-4 border-yellow-400 text-white shadow-lg shadow-yellow-600/50' 
                  : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-600/10 hover:border-r-2 hover:border-yellow-600/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`h-5 w-5 ${activeSection === item.path ? 'text-white' : ''}`} />
                <span className="font-medium">{item.name}</span>
              </div>
              {item.count && item.count > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                  {item.count}
                </span>
              )}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-6 py-3 mt-6 text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-all duration-200 border-t border-red-500/20"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-gradient-to-r from-gray-900 via-slate-900 to-black shadow-xl border-b border-yellow-500/30 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-yellow-600/20 text-yellow-400 transition-all"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent capitalize">
                {activeSection}
              </h2>
            </div>

            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-yellow-400 capitalize font-medium">{user.role}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-600/50 ring-2 ring-yellow-400/50">
                  <span className="text-white text-sm font-bold">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 bg-gradient-to-br from-black via-gray-900 to-black min-h-screen">
          {activeSection === 'dashboard' && stats && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Users"
                  value={stats.users.total}
                  subtext={`${stats.users.active} active`}
                  icon={Users}
                  color="blue"
                />
                <StatCard
                  title="Total Deposits"
                  value={`$${stats.transactions.totalDeposits.toLocaleString()}`}
                  subtext={`${stats.pendingApprovals.deposits} pending`}
                  icon={CreditCard}
                  color="green"
                />
                <StatCard
                  title="Total Withdrawals"
                  value={`$${stats.transactions.totalWithdrawals.toLocaleString()}`}
                  subtext={`${stats.pendingApprovals.withdrawals} pending`}
                  icon={Wallet}
                  color="red"
                />
                <StatCard
                  title="Active Portfolios"
                  value={stats.portfolios.active}
                  subtext="Investment plans"
                  icon={TrendingUp}
                  color="purple"
                />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-black rounded-xl shadow-2xl border border-yellow-500/30">
                  <div className="p-6 border-b border-yellow-500/30 bg-gradient-to-r from-yellow-600/10 to-amber-600/10">
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">Recent Transactions</h3>
                  </div>
                  <div className="p-6">
                    {stats.recentTransactions.length > 0 ? (
                      <div className="space-y-1">
                        {stats.recentTransactions.slice(0, 5).map((transaction) => (
                          <RecentTransactionItem key={transaction.id} transaction={transaction} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-4">No recent transactions</p>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-black rounded-xl shadow-2xl border border-yellow-500/30">
                  <div className="p-6 border-b border-yellow-500/30 bg-gradient-to-r from-yellow-600/10 to-amber-600/10">
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">Quick Actions</h3>
                  </div>
                  <div className="p-6 space-y-3">
                    {stats.pendingApprovals.deposits > 0 && (
                      <button
                        onClick={() => setActiveSection('deposits')}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-yellow-600 to-amber-600 border border-yellow-500 rounded-lg hover:from-yellow-700 hover:to-amber-700 transition-all shadow-lg hover:shadow-yellow-600/50 transform hover:scale-105"
                      >
                        <div className="flex items-center space-x-3">
                          <AlertCircle className="h-5 w-5 text-white" />
                          <span className="font-medium text-white">
                            Review Pending Deposits
                          </span>
                        </div>
                        <span className="bg-white text-yellow-700 text-sm px-2 py-1 rounded font-bold">
                          {stats.pendingApprovals.deposits}
                        </span>
                      </button>
                    )}

                    {stats.pendingApprovals.withdrawals > 0 && (
                      <button
                        onClick={() => setActiveSection('withdrawals')}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-600 to-pink-600 border border-red-500 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-red-600/50 transform hover:scale-105"
                      >
                        <div className="flex items-center space-x-3">
                          <AlertCircle className="h-5 w-5 text-white" />
                          <span className="font-medium text-white">
                            Review Pending Withdrawals
                          </span>
                        </div>
                        <span className="bg-white text-red-700 text-sm px-2 py-1 rounded font-bold">
                          {stats.pendingApprovals.withdrawals}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => setActiveSection('users')}
                      className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-600 to-amber-600 border border-yellow-500 rounded-lg hover:from-yellow-700 hover:to-amber-700 transition-all shadow-lg hover:shadow-yellow-600/50 transform hover:scale-105"
                    >
                      <Eye className="h-5 w-5 text-white" />
                      <span className="font-medium text-white">Manage Users</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Section Rendering */}
          {activeSection === 'users' && (
            <UsersManagement />
          )}



          {activeSection === 'withdrawals' && (
            <WithdrawalsManagement />
          )}

          {activeSection === 'referrals' && (
            <ReferralManagement />
          )}

          {activeSection === 'wallet-settings' && (
            <AdminWalletSettings />
          )}

          {activeSection === 'payment-management' && (
            <AdminPaymentManagement />
          )}

          {/* Other sections placeholder */}
          {!['dashboard', 'users', 'deposits', 'withdrawals', 'referrals', 'wallet-settings', 'deposit-management', 'payment-management'].includes(activeSection) && (
            <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-black rounded-xl shadow-2xl border border-yellow-500/30 p-8 text-center">
              <div className="mb-4">
                <Settings className="h-12 w-12 text-yellow-400 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mb-2">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Module
              </h3>
              <p className="text-gray-400">
                This section is under development. Advanced admin features coming soon.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
