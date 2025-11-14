'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Network, X, Check } from 'lucide-react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  referralCode: string;
  totalReferrals: number;
  directReferrals: number;
  totalCommissions: number;
  currentRank: string;
  createdAt: string;
  referrals?: User[];
}

interface ReferralStats {
  totalUsers: number;
  totalReferrals: number;
  totalCommissions: number;
  activeReferrers: number;
}

const ReferralManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showReferralTree, setShowReferralTree] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [treeData, setTreeData] = useState<User | null>(null);
  const [generatedLink, setGeneratedLink] = useState<{code: string, link: string} | null>(null);

  // Generate referral form state
  const [generateForm, setGenerateForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    customCode: ''
  });

  const fetchReferralData = async (page = 1, search = '') => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/referrals?page=${page}&search=${search}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users);
        setStats(data.data.stats);
        setCurrentPage(data.data.pagination.currentPage);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        // Handle error responses
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        if (response.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/adminpanel';
        }
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReferralData(1, searchTerm);
  };

  const handleGenerateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/referrals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(generateForm)
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedLink({
          code: data.data.referralCode,
          link: data.data.referralLink
        });
        setShowGenerateForm(false);
        setGenerateForm({ email: '', firstName: '', lastName: '', customCode: '' });
        fetchReferralData();
      } else {
        try {
          const error = await response.json();
          alert(`Error: ${error.message}`);
        } catch (parseError) {
          const errorText = await response.text();
          alert(`Error: ${response.status} - ${errorText}`);
        }
        if (response.status === 401) {
          window.location.href = '/adminpanel';
        }
      }
    } catch (error) {
      console.error('Error generating referral:', error);
      alert('Error generating referral link');
    }
  };

  const fetchReferralTree = async (userId: number, user: User) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/referrals/tree/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTreeData(data.data);
        setSelectedUser(user);
        setShowReferralTree(true);
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        alert('Error loading referral tree');
        if (response.status === 401) {
          window.location.href = '/adminpanel';
        }
      }
    } catch (error) {
      console.error('Error fetching referral tree:', error);
      alert('Error loading referral tree');
    }
  };

  const copyToClipboard = async (code: string) => {
    const link = `${window.location.origin}/register?ref=${code}`;
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement('textarea');
        textArea.value = link;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
          } else {
            throw new Error('Copy command failed');
          }
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      // Show the link in a prompt as last resort
      prompt('Copy this link:', link);
    }
  };

  const getRankColor = (rank: string) => {
    const colors = {
      'Bronze': 'text-orange-600',
      'Silver': 'text-gray-500',
      'Gold': 'text-yellow-500',
      'Platinum': 'text-blue-500',
      'Diamond': 'text-purple-500'
    };
    return colors[rank as keyof typeof colors] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Referral Management</h2>
        <button
          onClick={() => setShowGenerateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Referral Link
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Referrals</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.totalReferrals}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Commissions</h3>
            <p className="text-2xl font-bold text-green-600">${stats.totalCommissions}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Active Referrers</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.activeReferrers}</p>
          </div>
        </div>
      )}

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by email, name, or referral code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referral Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referrals
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.referralCode}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getRankColor(user.currentRank)}`}>
                    {user.currentRank}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    Direct: {user.directReferrals}
                  </div>
                  <div className="text-sm text-gray-500">
                    Total: {user.totalReferrals}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${parseFloat(user.totalCommissions.toString()).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fetchReferralTree(user.id, user)}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                      title="View Referral Tree"
                    >
                      <Network className="h-4 w-4 mr-1" />
                      Tree
                    </button>
                    <button
                      onClick={() => copyToClipboard(user.referralCode)}
                      className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors shadow-sm"
                      title="Copy Referral Link"
                    >
                      {copiedCode === user.referralCode ? (
                        <><Check className="h-4 w-4 mr-1" /> Copied</>
                      ) : (
                        <><Copy className="h-4 w-4 mr-1" /> Copy</>
                      )}
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  fetchReferralData(page, searchTerm);
                }}
                className={`px-3 py-2 rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Referral Tree Modal */}
      {showReferralTree && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Referral Network - {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Code: <span className="font-mono font-semibold text-blue-600">{selectedUser.referralCode}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setShowReferralTree(false);
                  setSelectedUser(null);
                  setTreeData(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {treeData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-medium text-blue-700 mb-1">Direct Referrals</h4>
                      <p className="text-2xl font-bold text-blue-900">{selectedUser.directReferrals}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="text-sm font-medium text-purple-700 mb-1">Total Network</h4>
                      <p className="text-2xl font-bold text-purple-900">{selectedUser.totalReferrals}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="text-sm font-medium text-green-700 mb-1">Total Commissions</h4>
                      <p className="text-2xl font-bold text-green-900">${parseFloat(selectedUser.totalCommissions.toString()).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Network Structure</h4>
                    {treeData.referrals && treeData.referrals.length > 0 ? (
                      <div className="space-y-2">
                        {treeData.referrals.map((referral: User, index: number) => (
                          <div key={referral.id} className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {referral.firstName} {referral.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{referral.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-700">Code: {referral.referralCode}</p>
                              <p className="text-xs text-gray-500">{referral.totalReferrals} referrals</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No direct referrals yet</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <button
                      onClick={() => copyToClipboard(selectedUser.referralCode)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {copiedCode === selectedUser.referralCode ? (
                        <><Check className="h-5 w-5 mr-2" /> Link Copied!</>
                      ) : (
                        <><Copy className="h-5 w-5 mr-2" /> Copy Referral Link</>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Generated Link Success Modal */}
      {generatedLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg w-full max-w-lg"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-green-600">✓ Referral Link Generated!</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referral Code
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generatedLink.code}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-lg font-semibold text-blue-600"
                  />
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(generatedLink.code);
                        setCopiedCode(generatedLink.code);
                        setTimeout(() => setCopiedCode(null), 2000);
                      } catch (err) {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = generatedLink.code;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        setCopiedCode(generatedLink.code);
                        setTimeout(() => setCopiedCode(null), 2000);
                      }
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Copy Code"
                  >
                    {copiedCode === generatedLink.code ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-700" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referral Link
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generatedLink.link}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700"
                  />
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(generatedLink.link);
                        setCopiedCode(generatedLink.link);
                        setTimeout(() => setCopiedCode(null), 2000);
                      } catch (err) {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = generatedLink.link;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        setCopiedCode(generatedLink.link);
                        setTimeout(() => setCopiedCode(null), 2000);
                      }
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                    title="Copy Link"
                  >
                    {copiedCode === generatedLink.link ? (
                      <><Check className="h-5 w-5" /><span>Copied!</span></>
                    ) : (
                      <><Copy className="h-5 w-5" /><span>Copy</span></>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>✓ Success!</strong> Share this link with new users. They will be automatically connected to this referral code when they register.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setGeneratedLink(null)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Generate Referral Modal */}
      {showGenerateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Generate Referral Link</h3>
            <p className="text-sm text-gray-600 mb-4">
              Generate a referral link that can be shared with new users. All fields are optional - just for labeling/reference.
            </p>
            <form onSubmit={handleGenerateReferral}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={generateForm.email}
                  onChange={(e) => setGenerateForm({ ...generateForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="For reference only"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name (Optional)
                </label>
                <input
                  type="text"
                  value={generateForm.firstName}
                  onChange={(e) => setGenerateForm({ ...generateForm, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="For code generation"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name (Optional)
                </label>
                <input
                  type="text"
                  value={generateForm.lastName}
                  onChange={(e) => setGenerateForm({ ...generateForm, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="For code generation"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Referral Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Leave empty for auto-generation"
                  value={generateForm.customCode}
                  onChange={(e) => setGenerateForm({ ...generateForm, customCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowGenerateForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Generate Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralManagement;