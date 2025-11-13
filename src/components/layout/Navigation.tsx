'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Digital Gold', href: '/digital-gold' },
    { name: 'Physical Gold', href: '/physical-gold' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <>
      <nav 
        className="flex justify-between items-center fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
        style={{ 
          backgroundColor: '#2a2a2a', 
          color: '#FFFFFF',
          padding: '1rem 2rem',
          boxShadow: scrolled ? '0 4px 8px rgba(255, 255, 255, 0.1)' : 'none'
        }}
      >
        {/* Logo */}
        <div className="flex items-center cursor-pointer h-10">
          <Image 
            src="/images/logo.webp" 
            alt="Investo Gold Logo" 
            width={150} 
            height={40}
            className="h-full w-auto object-contain"
            priority
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              className="cursor-pointer relative nav-link"
              style={{ 
                textDecoration: 'none',
                color: '#FFFFFF !important',
                fontWeight: 500
              }}
            >
              {item.name}
            </motion.a>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-3 items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-medium border rounded-lg cursor-pointer signin-btn"
            style={{
              padding: '0.5rem 1.2rem',
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              border: '1px solid #FFFFFF',
              borderRadius: '8px',
              fontSize: '16px',
              transition: '0.3s ease',
              fontWeight: 500
            }}
            onClick={() => window.open('/login', '_self')}
          >
            Sign In
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-semibold border-none rounded-lg cursor-pointer register-btn"
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#FFD700',
              color: '#000000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              transition: '0.3s ease',
              fontWeight: 600
            }}
            onClick={() => window.open('/register', '_self')}
          >
            Register
          </motion.button>
        </div>

        {/* Mobile Right Section */}
        <div className="flex md:hidden items-center gap-4">
          <div className="flex gap-2 items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-medium border rounded-lg cursor-pointer mobile-signin-btn"
              style={{
                padding: '0.3rem 0.8rem',
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                border: '1px solid #FFFFFF',
                borderRadius: '8px',
                fontSize: '14px',
                transition: '0.3s ease',
                fontWeight: 500
              }}
              onClick={() => window.open('/login', '_self')}
            >
              Sign In
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-semibold border-none rounded-lg cursor-pointer mobile-register-btn"
              style={{
                padding: '0.4rem 1rem',
                backgroundColor: '#FFD700',
                color: '#000000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                transition: '0.3s ease',
                fontWeight: 600
              }}
              onClick={() => window.open('/register', '_self')}
            >
              Register
            </motion.button>
          </div>
          
          <button
            onClick={toggleMobileMenu}
            className="text-white p-2 bg-none border-none text-2xl cursor-pointer"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 bottom-0 z-[200] flex flex-col md:hidden"
            style={{
              background: 'linear-gradient(135deg, #2a2a2a 0%, rgba(26, 26, 26, 0.98) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {/* Mobile Menu Header */}
            <div 
              className="flex justify-between items-center px-8 py-6"
              style={{
                borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }}
            >
              <div className="h-9">
                <Image 
                  src="/images/logo.webp" 
                  alt="Investo Gold Logo" 
                  width={120} 
                  height={35}
                  className="h-full w-auto object-contain"
                />
              </div>
              <button 
                onClick={toggleMobileMenu}
                className="bg-none border-none text-[#FFD700] text-3xl cursor-pointer p-2 rounded-full hover:bg-[rgba(255,215,0,0.1)] transition-all duration-300 hover:rotate-90"
              >
                ✕
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex-1 flex flex-col justify-center items-center gap-6" style={{ padding: '2rem' }}>
              <div className="flex flex-col gap-4 w-full" style={{ maxWidth: '300px' }}>
                {navItems.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="block cursor-pointer rounded-lg text-center relative overflow-hidden mobile-nav-link"
                    style={{ 
                      fontSize: '24px',
                      padding: '1rem 1.5rem',
                      backgroundColor: 'transparent',
                      border: '1px solid transparent',
                      borderRadius: '8px',
                      transition: '0.3s ease',
                      textDecoration: 'none',
                      color: '#FFFFFF !important',
                      fontWeight: 500
                    }}
                    onClick={toggleMobileMenu}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Mobile Menu Footer */}
            <div 
              className="flex flex-col items-center gap-4"
              style={{
                padding: '2rem',
                borderTop: '1px solid rgba(255, 215, 0, 0.2)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)'
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full font-bold border-none cursor-pointer uppercase mobile-cta-btn"
                style={{
                  maxWidth: '250px',
                  padding: '1rem 2rem',
                  color: '#2a2a2a',
                  background: 'linear-gradient(45deg, #FFD700, #f4d03f)',
                  borderRadius: '16px',
                  fontSize: '16px',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                  transition: '0.3s ease'
                }}
                onClick={() => window.open('/register', '_self')}
              >
                Create Account
              </motion.button>
              
              <div 
                className="text-center text-white"
                style={{ fontSize: '14px', opacity: 0.8 }}
              >
                Already have an account?<br />
                <strong 
                  className="text-[#FFD700] cursor-pointer hover:text-[#f4d03f] transition-colors"
                  onClick={() => window.open('/login', '_self')}
                >
                  Sign In Here
                </strong>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        /* Reset all link colors */
        a, a:link, a:visited, a:hover, a:active {
          color: inherit;
          text-decoration: none;
        }
        
        .nav-link {
          position: relative;
          color: #FFFFFF !important;
        }
        
        .nav-link, .nav-link:link, .nav-link:visited, .nav-link:hover, .nav-link:active {
          color: #FFFFFF !important;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #FFD700;
          transition: 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }

        /* Sign In button - white text */
        .signin-btn,
        .mobile-signin-btn {
          color: #FFFFFF !important;
        }

        /* Sign In button hover effects */
        .signin-btn:hover,
        .mobile-signin-btn:hover {
          background-color: #FFFFFF !important;
          color: #2a2a2a !important;
        }

        /* Register button - black text on gold */
        .register-btn,
        .mobile-register-btn {
          color: #000000 !important;
        }

        /* Register button hover effects */
        .register-btn:hover,
        .mobile-register-btn:hover {
          box-shadow: 0 0 15px #FFD700 !important;
          color: #000000 !important;
        }

        /* Mobile nav link effects */
        .mobile-nav-link {
          color: #FFFFFF !important;
        }
        
        .mobile-nav-link, .mobile-nav-link:link, .mobile-nav-link:visited, .mobile-nav-link:hover, .mobile-nav-link:active {
          color: #FFFFFF !important;
        }
        
        .mobile-nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
          transition: left 0.5s;
        }

        .mobile-nav-link:hover {
          border-color: #FFD700 !important;
          background-color: rgba(255, 215, 0, 0.05) !important;
          transform: translateY(-2px);
        }

        .mobile-nav-link:hover::before {
          left: 100%;
        }

        /* Mobile CTA button hover */
        .mobile-cta-btn:hover {
          box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
};

export default Navigation;