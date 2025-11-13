// API client utilities for frontend-backend communication
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : `http://localhost:${process.env.PORT || 5000}/api`;

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for authentication
    ...options,
  };

  // Add auth token if available (client-side)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`
      }));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Authentication API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // User login
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token in localStorage (client-side only)
    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  },

  // User logout
  logout: async () => {
    const response = await apiRequest('/auth/logout', {
      method: 'POST',
    });
    
    // Remove token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    
    return response;
  },

  // Verify email
  verifyEmail: async (token) => {
    return apiRequest(`/auth/verify-email?token=${token}`, {
      method: 'GET',
    });
  },

  // Forgot password
  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};

// User API functions
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    return apiRequest('/user/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Get user dashboard data
  getDashboard: async () => {
    return apiRequest('/user/dashboard');
  },

  // Upload profile image
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiRequest('/user/upload-avatar', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
};

// Portfolio API functions
export const portfolioAPI = {
  // Get all portfolios
  getAll: async () => {
    return apiRequest('/portfolios');
  },

  // Get portfolio by ID
  getById: async (id) => {
    return apiRequest(`/portfolios/${id}`);
  },

  // Subscribe to portfolio
  subscribe: async (portfolioId, subscriptionData) => {
    return apiRequest(`/portfolios/${portfolioId}/subscribe`, {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
  },

  // Get user's active subscriptions
  getUserSubscriptions: async () => {
    return apiRequest('/portfolios/my-subscriptions');
  },
};

// Transaction API functions
export const transactionAPI = {
  // Get transaction history
  getHistory: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/transactions/history?${queryString}`);
  },

  // Create deposit
  createDeposit: async (depositData) => {
    return apiRequest('/transactions/deposit', {
      method: 'POST',
      body: JSON.stringify(depositData),
    });
  },

  // Upload deposit proof
  uploadDepositProof: async (transactionId, file) => {
    const formData = new FormData();
    formData.append('proof', file);
    
    return apiRequest(`/transactions/deposit/${transactionId}/proof`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  // Request withdrawal
  requestWithdrawal: async (withdrawalData) => {
    return apiRequest('/transactions/withdraw', {
      method: 'POST',
      body: JSON.stringify(withdrawalData),
    });
  },

  // Get transaction by ID
  getById: async (id) => {
    return apiRequest(`/transactions/${id}`);
  },
};

// Affiliate API functions
export const affiliateAPI = {
  // Get referral dashboard
  getDashboard: async () => {
    return apiRequest('/affiliate/dashboard');
  },

  // Get referral tree
  getReferralTree: async (level = 1) => {
    return apiRequest(`/affiliate/tree?level=${level}`);
  },

  // Get commission history
  getCommissions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/affiliate/commissions?${queryString}`);
  },

  // Generate referral link
  generateReferralLink: async () => {
    return apiRequest('/affiliate/generate-link', {
      method: 'POST',
    });
  },

  // Get referral statistics
  getStats: async (period = '30d') => {
    return apiRequest(`/affiliate/stats?period=${period}`);
  },
};

// Admin API functions (for admin users)
export const adminAPI = {
  // Get admin dashboard
  getDashboard: async () => {
    return apiRequest('/admin/dashboard');
  },

  // Get all users
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users?${queryString}`);
  },

  // Update user status
  updateUserStatus: async (userId, status) => {
    return apiRequest(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Get pending deposits
  getPendingDeposits: async () => {
    return apiRequest('/admin/deposits/pending');
  },

  // Approve/reject deposit
  updateDepositStatus: async (depositId, status, notes = '') => {
    return apiRequest(`/admin/deposits/${depositId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  },

  // Get pending withdrawals
  getPendingWithdrawals: async () => {
    return apiRequest('/admin/withdrawals/pending');
  },

  // Approve/reject withdrawal
  updateWithdrawalStatus: async (withdrawalId, status, notes = '') => {
    return apiRequest(`/admin/withdrawals/${withdrawalId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  },

  // Get system statistics
  getSystemStats: async () => {
    return apiRequest('/admin/stats');
  },
};

// Utility functions
export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  },

  // Get stored auth token
  getAuthToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  },

  // Clear auth data
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  },

  // Format currency
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  // Format date
  formatDate: (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  },
};

// Export everything as default
const API = {
  authAPI,
  userAPI,
  portfolioAPI,
  transactionAPI,
  affiliateAPI,
  adminAPI,
  apiUtils,
};

export default API;