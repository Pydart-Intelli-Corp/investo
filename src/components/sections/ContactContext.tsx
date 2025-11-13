'use client';

import React from 'react';
import { useState } from 'react';

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactContext = React.createContext({
  isOpen: false,
  contactInfo: {
    name: '',
    email: '',
    phone: '',
    message: ''
  },
  updateContactInfo: (_info: Partial<ContactInfo>) => {},
  toggleContactForm: () => {},
  submitContact: () => Promise.resolve(),
});

interface ContactProviderProps {
  children: React.ReactNode;
}

export const ContactProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const updateContactInfo = (newInfo: Partial<ContactInfo>) => {
    setContactInfo(prev => ({ ...prev, ...newInfo }));
  };

  const toggleContactForm = () => {
    setIsOpen(prev => !prev);
  };

  const submitContact = async () => {
    // Here you can implement the actual contact form submission logic
    // For now, we'll just log the contact info and close the form
    console.log('Contact form submitted:', contactInfo);
    
    // Reset form after submission
    setContactInfo({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    setIsOpen(false);
    
    // You can add API call here to submit to your backend
    // await api.submitContact(contactInfo);
  };

  return (
    <ContactContext.Provider
      value={{
        isOpen,
        contactInfo,
        updateContactInfo,
        toggleContactForm,
        submitContact,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => {
  const context = React.useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
};

// Export ContactProvider as the default export
export default ContactProvider;