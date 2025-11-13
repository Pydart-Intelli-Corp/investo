'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  CreditCard, 
  TrendingUp,
  Settings,
  Users,
  DollarSign,
  History,
  Bell,
  RefreshCw,
  Crown
} from 'lucide-react';

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  walletBalance: string;
  role: string;
  currentRank?: string;
}

const UserHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage or make API call
    const userData = localStorage.getItem('userData');
    console.log('UserHeader - userData from localStorage:', userData);
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('UserHeader - parsed user:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('userData');
      }
    } else {
      console.log('UserHeader - No user data found in localStorage');
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isProfileOpen && !target.closest('[data-profile-dropdown]')) {
        setIsProfileOpen(false);
      }
    };

    // Close dropdown with escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isProfileOpen) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    console.log('Logout initiated from header');
    
    // Close the dropdown first
    setIsProfileOpen(false);
    
    // Clear all authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('userRole');
    
    // Clear any session storage as well
    sessionStorage.clear();
    
    console.log('All authentication data cleared');
    
    // Small delay to ensure state updates
    setTimeout(() => {
      // Redirect to home page
      window.location.href = '/';
    }, 100);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Refresh the page or trigger a data refresh
    window.location.reload();
  };

  const getRankColor = (rank: string) => {
    const colors = {
      'Bronze': 'text-orange-600 bg-orange-100',
      'Silver': 'text-gray-700 bg-gray-100',
      'Gold': 'text-yellow-600 bg-yellow-100',
      'Platinum': 'text-yellow-600 bg-yellow-100',
      'Diamond': 'text-amber-600 bg-amber-100'
    };
    return colors[rank as keyof typeof colors] || 'text-gray-700 bg-gray-100';
  };

  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black backdrop-blur-lg shadow-xl border-b border-yellow-500/30 sticky top-0 z-[100]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-600/50">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Investogold
              </span>
              <p className="text-xs text-gray-400">Trading Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-1 text-gray-300 hover:text-yellow-400 transition-colors"
            >
              <TrendingUp size={18} />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/plans" 
              className="flex items-center space-x-1 text-gray-300 hover:text-yellow-400 transition-colors"
            >
              <CreditCard size={18} />
              <span>Plans</span>
            </Link>
            <Link 
              href="/transactions" 
              className="flex items-center space-x-1 text-gray-300 hover:text-yellow-400 transition-colors"
            >
              <History size={18} />
              <span>Transactions</span>
            </Link>
            <Link 
              href="/referrals" 
              className="flex items-center space-x-1 text-gray-300 hover:text-yellow-400 transition-colors"
            >
              <Users size={18} />
              <span>Referrals</span>
            </Link>
          </div>

          {/* User Actions & Profile */}
          <div className="flex items-center space-x-4">
            {/* Wallet Balance */}
            {user && (
              <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 border border-yellow-500/50 px-3 py-2 rounded-lg">
                <DollarSign size={16} className="text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-400">
                  ${parseFloat(user.walletBalance || '0').toFixed(2)}
                </span>
              </div>
            )}

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-yellow-400 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </button>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" data-profile-dropdown>
              <button
                onClick={toggleProfile}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                  isProfileOpen 
                    ? 'bg-yellow-500/20 text-yellow-400 ring-2 ring-yellow-500/50' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                }`}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white">
                    {user ? `${user.firstName || 'User'} ${user.lastName || ''}`.trim() : 'User Profile'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user?.email || 'user@example.com'}
                  </p>
                  {user?.currentRank && (
                    <div className="flex items-center justify-end mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRankColor(user.currentRank)}`}>
                        <Crown className="h-3 w-3 mr-1" />
                        {user.currentRank}
                      </span>
                    </div>
                  )}
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-600/50">
                  <User size={16} className="text-white" />
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl border-2 border-yellow-500/30 py-2 z-[9999] ring-1 ring-yellow-500/20 backdrop-blur-sm">
                  <div className="px-4 py-3 border-b border-yellow-500/30 bg-gradient-to-r from-yellow-600/10 to-amber-600/10 rounded-t-xl">
                    <p className="text-sm font-bold text-white">
                      {user ? `${user.firstName || 'User'} ${user.lastName || ''}`.trim() : 'User Profile'}
                    </p>
                    <p className="text-xs font-medium text-gray-400">{user?.email || 'user@example.com'}</p>
                    {user?.currentRank && (
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRankColor(user.currentRank)}`}>
                          <Crown className="h-3 w-3 mr-1" />
                          {user.currentRank}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-gray-300 hover:bg-yellow-500/20 hover:text-yellow-400 transition-colors border-b border-yellow-500/20"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings size={16} className="text-yellow-400" />
                    <span className="font-bold text-white">Profile Settings</span>
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <Link
                      href="/adminpanel"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-gray-300 hover:bg-yellow-500/20 hover:text-yellow-400 transition-colors border-b border-yellow-500/20"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={16} className="text-yellow-400" />
                      <span className="font-bold text-white">Admin Panel</span>
                    </Link>
                  )}
                  
                  <div className="border-t border-yellow-500/30 my-1"></div>
                  
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors rounded-b-xl"
                  >
                    <LogOut size={16} className="text-red-400" />
                    <span className="font-bold text-red-400">Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-300 hover:text-yellow-400 p-2 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-gradient-to-br from-gray-900 to-black backdrop-blur-lg rounded-xl shadow-xl border border-yellow-500/30 p-4 z-[9999]">
            <div className="flex flex-col space-y-3">
              {/* Mobile User Info */}
              {user && (
                <div className="py-3 border-b border-yellow-500/30">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-600/50">
                      <User size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{user.firstName} {user.lastName}</p>
                      {user.currentRank && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRankColor(user.currentRank)}`}>
                          <Crown className="h-3 w-3 mr-1" />
                          {user.currentRank}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Wallet Balance</span>
                    <span className="font-semibold text-yellow-400">
                      ${parseFloat(user.walletBalance || '0').toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <Link 
                href="/dashboard" 
                className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <TrendingUp size={18} />
                <span>Dashboard</span>
              </Link>
              
              <Link 
                href="/plans" 
                className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <CreditCard size={18} />
                <span>Plans</span>
              </Link>
              
              <Link 
                href="/transactions" 
                className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <History size={18} />
                <span>Transactions</span>
              </Link>
              
              <Link 
                href="/referrals" 
                className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users size={18} />
                <span>Referrals</span>
              </Link>

              <div className="pt-3 border-t border-yellow-500/30">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings size={18} />
                  <span>Profile Settings</span>
                </Link>
                
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings size={18} />
                    <span>Admin Panel</span>
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-2 w-full text-left text-red-400 hover:text-red-300 transition-colors py-2"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default UserHeader;