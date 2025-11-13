'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Shield, 
  Eye, 
  Database, 
  Lock,
  Share2,
  Settings,
  Mail,
  Globe,
  UserCheck,
  Clock,
  AlertCircle
} from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'introduction', title: '1. Introduction', icon: Shield },
    { id: 'information', title: '2. Information We Collect', icon: Database },
    { id: 'usage', title: '3. How We Use Information', icon: Settings },
    { id: 'sharing', title: '4. Information Sharing', icon: Share2 },
    { id: 'security', title: '5. Data Security', icon: Lock },
    { id: 'retention', title: '6. Data Retention', icon: Clock },
    { id: 'rights', title: '7. Your Privacy Rights', icon: UserCheck },
    { id: 'cookies', title: '8. Cookies & Tracking', icon: Eye },
    { id: 'international', title: '9. International Transfers', icon: Globe },
    { id: 'updates', title: '10. Policy Updates', icon: AlertCircle },
    { id: 'contact', title: '11. Contact Us', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: October 14, 2025
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          document.getElementById(section.id)?.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                          activeSection === section.id
                            ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
                    <p className="text-gray-600">investogold Trading Platform</p>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-800">
                        <strong>Your Privacy Matters:</strong> We are committed to protecting your personal 
                        information and being transparent about how we collect, use, and share your data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="px-8 py-6 prose prose-gray max-w-none">
                
                {/* Section 1: Introduction */}
                <motion.section 
                  id="introduction"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span>1. Introduction</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      This Privacy Policy explains how investogold ("we," "our," or "us") collects, uses, 
                      processes, and protects your personal information when you use our cryptocurrency 
                      trading platform and related services.
                    </p>
                    <p>
                      By using our services, you consent to the collection and use of your information 
                      as described in this Privacy Policy. If you do not agree with our practices, 
                      please do not use our services.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Quick Summary:</strong> We collect information necessary to provide our 
                        trading services, comply with regulations, and enhance your experience. We never 
                        sell your personal data to third parties.
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* Section 2: Information We Collect */}
                <motion.section 
                  id="information"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span>2. Information We Collect</span>
                  </h2>
                  <div className="space-y-6 text-gray-700">
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Full name and contact information (email, phone number)</li>
                        <li>Identity verification documents (government ID, passport)</li>
                        <li>Address and proof of residence</li>
                        <li>Date of birth and nationality</li>
                        <li>Financial information and source of funds</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Usage Information</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Trading activity and transaction history</li>
                        <li>Platform usage patterns and preferences</li>
                        <li>Device information and browser details</li>
                        <li>IP address and location data</li>
                        <li>Communication records with our support team</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Technical Information</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Cookies and similar tracking technologies</li>
                        <li>Log files and server data</li>
                        <li>Performance and error reports</li>
                        <li>Security event logs</li>
                      </ul>
                    </div>
                  </div>
                </motion.section>

                {/* Section 3: How We Use Information */}
                <motion.section 
                  id="usage"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-purple-600" />
                    <span>3. How We Use Information</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>We use your information to:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Service Provision</h4>
                        <ul className="list-disc pl-4 space-y-1 text-sm">
                          <li>Process trading transactions</li>
                          <li>Manage your account</li>
                          <li>Provide customer support</li>
                          <li>Send service notifications</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Legal Compliance</h4>
                        <ul className="list-disc pl-4 space-y-1 text-sm">
                          <li>Identity verification (KYC)</li>
                          <li>Anti-money laundering (AML)</li>
                          <li>Regulatory reporting</li>
                          <li>Fraud prevention</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Security & Safety</h4>
                        <ul className="list-disc pl-4 space-y-1 text-sm">
                          <li>Monitor for suspicious activity</li>
                          <li>Protect against cyber threats</li>
                          <li>Secure account access</li>
                          <li>Investigate security incidents</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Improvement</h4>
                        <ul className="list-disc pl-4 space-y-1 text-sm">
                          <li>Enhance platform functionality</li>
                          <li>Analyze usage patterns</li>
                          <li>Develop new features</li>
                          <li>Optimize user experience</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Section 4: Information Sharing */}
                <motion.section 
                  id="sharing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Share2 className="h-5 w-5 text-indigo-600" />
                    <span>4. Information Sharing</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-800">
                        <strong>We do not sell your personal data.</strong> We only share information 
                        when necessary for service provision, legal compliance, or with your consent.
                      </p>
                    </div>
                    <p>We may share your information with:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Service Providers:</strong> Third-party companies that help us operate our platform</li>
                      <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                      <li><strong>Business Partners:</strong> With your consent for specific services</li>
                      <li><strong>Regulators:</strong> For compliance with financial regulations</li>
                      <li><strong>Professional Advisors:</strong> Lawyers, accountants, and consultants</li>
                    </ul>
                  </div>
                </motion.section>

                {/* Section 5: Data Security */}
                <motion.section 
                  id="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-red-600" />
                    <span>5. Data Security</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      We implement comprehensive security measures to protect your personal information:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">🔒 Encryption</h4>
                        <p className="text-sm text-blue-800">
                          All data is encrypted in transit and at rest using industry-standard protocols.
                        </p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-2">🛡️ Access Control</h4>
                        <p className="text-sm text-green-800">
                          Strict access controls ensure only authorized personnel can access your data.
                        </p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="font-medium text-purple-900 mb-2">📱 Multi-Factor Auth</h4>
                        <p className="text-sm text-purple-800">
                          Two-factor authentication protects your account from unauthorized access.
                        </p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Security Notice:</strong> While we implement strong security measures, 
                        no system is 100% secure. Please use strong passwords and enable two-factor authentication.
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* Section 6: Data Retention */}
                <motion.section 
                  id="retention"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span>6. Data Retention</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      We retain your personal information for as long as necessary to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Provide our services to you</li>
                      <li>Comply with legal and regulatory requirements</li>
                      <li>Resolve disputes and enforce agreements</li>
                      <li>Detect and prevent fraud or abuse</li>
                    </ul>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Typical Retention Periods:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <strong>Account Information:</strong> 7 years after account closure</li>
                        <li>• <strong>Transaction Records:</strong> 7 years for regulatory compliance</li>
                        <li>• <strong>Identity Documents:</strong> 7 years after relationship ends</li>
                        <li>• <strong>Communication Records:</strong> 3 years from last interaction</li>
                      </ul>
                    </div>
                  </div>
                </motion.section>

                {/* Section 7: Your Privacy Rights */}
                <motion.section 
                  id="rights"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-teal-600" />
                    <span>7. Your Privacy Rights</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>Depending on your location, you may have the following rights:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-blue-600">1</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Access</h4>
                            <p className="text-sm text-gray-600">Request copies of your personal data</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-green-600">2</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Rectification</h4>
                            <p className="text-sm text-gray-600">Correct inaccurate information</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-purple-600">3</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Erasure</h4>
                            <p className="text-sm text-gray-600">Request deletion of your data</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-orange-600">4</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Portability</h4>
                            <p className="text-sm text-gray-600">Receive your data in a portable format</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-red-600">5</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Restriction</h4>
                            <p className="text-sm text-gray-600">Limit how we process your data</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-teal-600">6</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Objection</h4>
                            <p className="text-sm text-gray-600">Object to certain processing activities</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        To exercise your rights, contact us at <strong>privacy@investogold.com</strong>. 
                        We will respond within 30 days of receiving your request.
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* Section 8: Cookies & Tracking */}
                <motion.section 
                  id="cookies"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-cyan-600" />
                    <span>8. Cookies & Tracking Technologies</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      We use cookies and similar technologies to enhance your experience, analyze usage, 
                      and provide personalized content.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">🍪 Essential Cookies</h4>
                        <p className="text-sm text-gray-700">
                          Required for basic functionality, security, and session management.
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">📊 Analytics Cookies</h4>
                        <p className="text-sm text-gray-700">
                          Help us understand how users interact with our platform.
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">⚙️ Functional Cookies</h4>
                        <p className="text-sm text-gray-700">
                          Remember your preferences and settings for a better experience.
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">🎯 Marketing Cookies</h4>
                        <p className="text-sm text-gray-700">
                          Deliver relevant content and measure campaign effectiveness.
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      You can manage cookie preferences through your browser settings or our cookie preference center.
                    </p>
                  </div>
                </motion.section>

                {/* Section 9: International Transfers */}
                <motion.section 
                  id="international"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-emerald-600" />
                    <span>9. International Data Transfers</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Your information may be transferred to and processed in countries other than your own. 
                      We ensure appropriate safeguards are in place to protect your data:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Standard contractual clauses approved by data protection authorities</li>
                      <li>Adequacy decisions recognizing equivalent protection levels</li>
                      <li>Binding corporate rules for intra-group transfers</li>
                      <li>Your explicit consent for specific transfers</li>
                    </ul>
                  </div>
                </motion.section>

                {/* Section 10: Policy Updates */}
                <motion.section 
                  id="updates"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-pink-600" />
                    <span>10. Policy Updates</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      We may update this Privacy Policy from time to time to reflect changes in our 
                      practices, technology, or legal requirements.
                    </p>
                    <p>
                      We will notify you of material changes by email or through a prominent notice 
                      on our platform. Your continued use of our services after such notice constitutes 
                      acceptance of the updated policy.
                    </p>
                  </div>
                </motion.section>

                {/* Section 11: Contact Information */}
                <motion.section 
                  id="contact"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>11. Contact Information</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      If you have questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-green-900 mb-2">Privacy Officer</h4>
                          <div className="space-y-1 text-sm text-green-800">
                            <p><strong>Email:</strong> privacy@investogold.com</p>
                            <p><strong>Response Time:</strong> Within 30 days</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-900 mb-2">General Support</h4>
                          <div className="space-y-1 text-sm text-green-800">
                            <p><strong>Email:</strong> support@investogold.com</p>
                            <p><strong>Phone:</strong> [Your Contact Number]</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <p className="text-sm text-green-800">
                          <strong>Mailing Address:</strong><br />
                          investogold Privacy Department<br />
                          [Your Company Address]<br />
                          [City, State, ZIP Code]
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.section>

              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>© 2025 investogold. All rights reserved.</p>
                    <p>Last updated: October 14, 2025</p>
                  </div>
                  <div className="flex space-x-4">
                    <Link 
                      href="/terms-and-conditions" 
                      className="text-sm text-green-600 hover:text-green-700 transition-colors"
                    >
                      Terms & Conditions
                    </Link>
                    <Link 
                      href="/contact" 
                      className="text-sm text-green-600 hover:text-green-700 transition-colors"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
