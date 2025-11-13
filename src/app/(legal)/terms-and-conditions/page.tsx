'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Scale,
  Globe,
  Mail
} from 'lucide-react';

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'acceptance', title: '1. Acceptance of Terms', icon: CheckCircle },
    { id: 'description', title: '2. Service Description', icon: FileText },
    { id: 'eligibility', title: '3. User Eligibility', icon: Shield },
    { id: 'account', title: '4. Account Registration', icon: Globe },
    { id: 'risks', title: '5. Risk Disclosure', icon: AlertTriangle },
    { id: 'prohibited', title: '6. Prohibited Activities', icon: Scale },
    { id: 'intellectual', title: '7. Intellectual Property', icon: FileText },
    { id: 'limitation', title: '8. Limitation of Liability', icon: Shield },
    { id: 'termination', title: '9. Termination', icon: Clock },
    { id: 'governing', title: '10. Governing Law', icon: Scale },
    { id: 'contact', title: '11. Contact Information', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Terms & Conditions</h1>
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
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
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
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Terms and Conditions</h1>
                    <p className="text-gray-600">investogoldold Trading Platform</p>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800">
                        <strong>Important:</strong> Please read these terms carefully before using our services. 
                        By accessing or using investogoldold, you agree to be bound by these terms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="px-8 py-6 prose prose-gray max-w-none">
                
                {/* Section 1: Acceptance of Terms */}
                <motion.section 
                  id="acceptance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>1. Acceptance of Terms</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      By accessing, browsing, or using the investogoldold platform ("Platform"), you acknowledge 
                      that you have read, understood, and agree to be bound by these Terms and Conditions 
                      ("Terms") and our Privacy Policy.
                    </p>
                    <p>
                      These Terms constitute a legally binding agreement between you ("User," "you," or "your") 
                      and investogoldold ("Company," "we," "us," or "our"). If you do not agree to these Terms, 
                      you must not access or use our Platform.
                    </p>
                    <p>
                      We reserve the right to modify these Terms at any time. Any changes will be effective 
                      immediately upon posting on our Platform. Your continued use of the Platform after 
                      any modifications constitutes your acceptance of the updated Terms.
                    </p>
                  </div>
                </motion.section>

                {/* Section 2: Service Description */}
                <motion.section 
                  id="description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>2. Service Description</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      investogoldold is an automated cryptocurrency trading platform that provides:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Automated Bitcoin and cryptocurrency trading services</li>
                      <li>Portfolio management and tracking tools</li>
                      <li>Market analysis and trading signals</li>
                      <li>Affiliate and referral programs</li>
                      <li>Educational resources and market insights</li>
                    </ul>
                    <p>
                      Our services are provided "as is" and "as available." We do not guarantee 
                      continuous, uninterrupted, or secure access to our Platform, and operation 
                      of the Platform may be interfered with by numerous factors outside our control.
                    </p>
                  </div>
                </motion.section>

                {/* Section 3: User Eligibility */}
                <motion.section 
                  id="eligibility"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibent text-gray-900 mb-4 flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <span>3. User Eligibility</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>To use our Platform, you must:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Be at least 18 years old or the age of majority in your jurisdiction</li>
                      <li>Have the legal capacity to enter into binding agreements</li>
                      <li>Not be located in a jurisdiction where cryptocurrency trading is prohibited</li>
                      <li>Comply with all applicable laws and regulations</li>
                      <li>Provide accurate and complete information during registration</li>
                    </ul>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-800">
                        <strong>Restricted Jurisdictions:</strong> Our services are not available to 
                        residents of certain jurisdictions including but not limited to the United States, 
                        North Korea, Iran, and other sanctioned territories.
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* Section 4: Account Registration */}
                <motion.section 
                  id="account"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-indigo-600" />
                    <span>4. Account Registration</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>When creating an account, you agree to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Provide accurate, current, and complete information</li>
                      <li>Maintain and update your information as necessary</li>
                      <li>Keep your account credentials secure and confidential</li>
                      <li>Accept responsibility for all activities under your account</li>
                      <li>Notify us immediately of any unauthorized access</li>
                    </ul>
                    <p>
                      We reserve the right to suspend or terminate accounts that violate these Terms 
                      or engage in fraudulent, illegal, or harmful activities.
                    </p>
                  </div>
                </motion.section>

                {/* Section 5: Risk Disclosure */}
                <motion.section 
                  id="risks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>5. Risk Disclosure</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h3 className="font-semibold text-red-900 mb-3">⚠️ High Risk Warning</h3>
                      <p className="text-red-800 mb-4">
                        Cryptocurrency trading involves substantial risk of loss and is not suitable for all investors.
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-red-800">
                        <li>Past performance does not guarantee future results</li>
                        <li>Market volatility can result in significant losses</li>
                        <li>Automated trading systems may malfunction</li>
                        <li>Regulatory changes may affect service availability</li>
                        <li>Technical issues may impact trading execution</li>
                      </ul>
                    </div>
                    <p>
                      You acknowledge that you understand these risks and that you are trading at your own risk. 
                      Only invest what you can afford to lose.
                    </p>
                  </div>
                </motion.section>

                {/* Section 6: Prohibited Activities */}
                <motion.section 
                  id="prohibited"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Scale className="h-5 w-5 text-orange-600" />
                    <span>6. Prohibited Activities</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>You agree not to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Use the Platform for any illegal or unauthorized purpose</li>
                      <li>Attempt to gain unauthorized access to our systems</li>
                      <li>Interfere with or disrupt the Platform's operation</li>
                      <li>Create multiple accounts or share account access</li>
                      <li>Engage in market manipulation or fraudulent activities</li>
                      <li>Violate any applicable laws or regulations</li>
                      <li>Use automated systems to access the Platform without permission</li>
                    </ul>
                  </div>
                </motion.section>

                {/* Section 7: Intellectual Property */}
                <motion.section 
                  id="intellectual"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-cyan-600" />
                    <span>7. Intellectual Property</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      All content, features, and functionality of the Platform, including but not limited to 
                      text, graphics, logos, images, software, and design, are owned by investogoldold and are 
                      protected by copyright, trademark, and other intellectual property laws.
                    </p>
                    <p>
                      You may not reproduce, distribute, modify, or create derivative works without our 
                      express written permission.
                    </p>
                  </div>
                </motion.section>

                {/* Section 8: Limitation of Liability */}
                <motion.section 
                  id="limitation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-teal-600" />
                    <span>8. Limitation of Liability</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-800">
                        <strong>Disclaimer:</strong> To the maximum extent permitted by law, investogoldold 
                        shall not be liable for any indirect, incidental, special, consequential, or 
                        punitive damages, including but not limited to loss of profits, data, or use.
                      </p>
                    </div>
                    <p>
                      Our total liability to you for any claims related to these Terms or the Platform 
                      shall not exceed the amount you have paid to us in the twelve months preceding 
                      the claim.
                    </p>
                  </div>
                </motion.section>

                {/* Section 9: Termination */}
                <motion.section 
                  id="termination"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-pink-600" />
                    <span>9. Termination</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      We may terminate or suspend your account and access to the Platform at any time, 
                      with or without notice, for any reason, including violation of these Terms.
                    </p>
                    <p>
                      You may terminate your account by contacting our support team. Upon termination, 
                      your right to use the Platform will cease immediately.
                    </p>
                  </div>
                </motion.section>

                {/* Section 10: Governing Law */}
                <motion.section 
                  id="governing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Scale className="h-5 w-5 text-emerald-600" />
                    <span>10. Governing Law</span>
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], 
                      without regard to its conflict of law provisions.
                    </p>
                    <p>
                      Any disputes arising from these Terms or your use of the Platform shall be subject to the 
                      exclusive jurisdiction of the courts in [Your Jurisdiction].
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
                      If you have any questions about these Terms, please contact us:
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="space-y-2">
                        <p><strong>Email:</strong> legal@investogoldold.com</p>
                        <p><strong>Support:</strong> support@investogoldold.com</p>
                        <p><strong>Address:</strong> [Your Company Address]</p>
                        <p><strong>Phone:</strong> [Your Contact Number]</p>
                      </div>
                    </div>
                  </div>
                </motion.section>

              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>© 2025 investogoldold. All rights reserved.</p>
                    <p>Last updated: October 14, 2025</p>
                  </div>
                  <div className="flex space-x-4">
                    <Link 
                      href="/privacy-policy" 
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    <Link 
                      href="/contact" 
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
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

export default TermsAndConditions;
