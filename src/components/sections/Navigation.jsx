'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Image from 'next/image';
import theme from '@/styles/theme';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${theme.colors.surface};
  color: ${theme.colors.secondary};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${theme.zIndices.navigation};
  transition: ${theme.transitions.default};
  box-shadow: ${props => props['data-scrolled'] === 'true' ? theme.shadows.medium : 'none'};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0.8rem 1.5rem;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0.6rem 1rem;
  }
`;

const MobileRightSection = styled.div`
  display: none;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 40px;
  
  img {
    height: 100%;
    width: auto;
    object-fit: contain;
  }
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    height: 35px;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 30px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  color: #FFFFFF !important;
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  position: relative;
  text-decoration: none;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: ${theme.colors.primary};
    transition: ${theme.transitions.default};
  }
  
  &:hover:after {
    width: 100%;
  }
  
  &:hover {
    color: #FFFFFF !important;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${theme.colors.secondary};
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    display: block;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const SignInButton = styled(motion.button)`
  padding: 0.5rem 1.2rem;
  background-color: transparent;
  color: #FFFFFF !important;
  font-weight: ${theme.fontWeights.medium};
  border: 1px solid ${theme.colors.secondary};
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};
  font-size: ${theme.fontSizes.base};
  
  &:hover {
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.surface} !important;
    transform: scale(1.05);
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0.4rem 1rem;
    font-size: ${theme.fontSizes.small};
  }
`;

const RegisterButton = styled(motion.button)`
  padding: 0.5rem 1.5rem;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-weight: ${theme.fontWeights.semiBold};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};
  font-size: ${theme.fontSizes.base};
  
  &:hover {
    box-shadow: ${theme.shadows.gold};
    transform: scale(1.05);
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0.4rem 1.2rem;
    font-size: ${theme.fontSizes.small};
  }
`;

const CTAButton = styled(motion.button)`
  padding: 0.5rem 1.5rem;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-weight: ${theme.fontWeights.semiBold};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};
  font-size: ${theme.fontSizes.base};
  
  &:hover {
    box-shadow: ${theme.shadows.gold};
    transform: scale(1.05);
  }
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0.4rem 1.2rem;
    font-size: ${theme.fontSizes.small};
    display: none; /* Hide in desktop mobile view since it will be in MobileRightSection */
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0.3rem 1rem;
    font-size: ${theme.fontSizes.small};
  }
`;

const MobileAuthButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const MobileSignInButton = styled(motion.button)`
  padding: 0.3rem 0.8rem;
  background-color: transparent;
  color: ${theme.colors.secondary};
  font-weight: ${theme.fontWeights.medium};
  border: 1px solid ${theme.colors.secondary};
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};
  font-size: ${theme.fontSizes.small};
  
  &:hover {
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.surface};
    transform: scale(1.05);
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0.25rem 0.6rem;
    font-size: 0.8rem;
  }
`;

const MobileCTAButton = styled(motion.button)`
  padding: 0.4rem 1rem;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-weight: ${theme.fontWeights.semiBold};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};
  font-size: ${theme.fontSizes.small};
  
  &:hover {
    box-shadow: ${theme.shadows.gold};
    transform: scale(1.05);
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, ${theme.colors.surface} 0%, rgba(26, 26, 26, 0.98) 100%);
  backdrop-filter: blur(10px);
  padding: 0;
  flex-direction: column;
  z-index: ${theme.zIndices.modal};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  background-color: rgba(0, 0, 0, 0.3);
`;

const MobileMenuLogo = styled.div`
  height: 35px;
  
  img {
    height: 100%;
    width: auto;
    object-fit: contain;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: ${theme.transitions.default};
  
  &:hover {
    background-color: rgba(255, 215, 0, 0.1);
    transform: rotate(90deg);
  }
`;

const MobileMenuContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  gap: 1.5rem;
`;

const MobileNavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
`;

const MobileNavLink = styled(motion.a)`
  color: ${theme.colors.secondary};
  font-size: ${theme.fontSizes.large};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  padding: 1rem 1.5rem;
  border-radius: ${theme.borderRadius.medium};
  text-align: center;
  transition: ${theme.transitions.default};
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    border-color: ${theme.colors.primary};
    background-color: rgba(255, 215, 0, 0.05);
    transform: translateY(-2px);
    
    &:before {
      left: 100%;
    }
  }
`;

const MobileMenuFooter = styled.div`
  padding: 2rem;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const MobileMenuCTA = styled(motion.button)`
  width: 100%;
  max-width: 250px;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, ${theme.colors.primary}, #f4d03f);
  color: ${theme.colors.surface};
  font-weight: ${theme.fontWeights.bold};
  border: none;
  border-radius: ${theme.borderRadius.large};
  cursor: pointer;
  font-size: ${theme.fontSizes.base};
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  
  &:hover {
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
    transform: translateY(-2px);
  }
`;

const MobileContactInfo = styled.div`
  text-align: center;
  color: ${theme.colors.secondary};
  font-size: ${theme.fontSizes.small};
  opacity: 0.8;
`;

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Digital Gold', href: '/digital-gold' },
    { name: 'Physical Gold', href: '/physical-gold' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: 'https://forms.gle/HEqHPwQn5jgXCvMQ6', target: '_blank' }
  ];
  
  return (
    <>
      <NavContainer data-scrolled={scrolled.toString()}>
        <Logo>
          <Image 
            src="/images/logo.webp" 
            alt="Investo Gold Logo" 
            width={150} 
            height={40}
            priority
          />
        </Logo>
        
        <NavLinks>
          {navItems.map((item, index) => (
            <NavLink 
              key={index} 
              href={item.href}
              target={item.target || '_self'}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              {item.name}
            </NavLink>
          ))}
        </NavLinks>
        
        <AuthButtons>
          <SignInButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('/login', '_self')}
          >
            Sign In
          </SignInButton>
          
          <RegisterButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('/register', '_self')}
          >
            Register
          </RegisterButton>
        </AuthButtons>
        
        <MobileRightSection>
          <MobileAuthButtons>
            <MobileSignInButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('/login', '_self')}
            >
              Sign In
            </MobileSignInButton>
            
            <MobileCTAButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('/register', '_self')}
            >
              Register
            </MobileCTAButton>
          </MobileAuthButtons>
          
          <MobileMenuButton onClick={toggleMobileMenu}>
            ☰
          </MobileMenuButton>
        </MobileRightSection>
      </NavContainer>
      
      {mobileMenuOpen && (
        <MobileMenu
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <MobileMenuHeader>
            <MobileMenuLogo>
              <Image 
                src="/images/logo.webp" 
                alt="Investo Gold Logo" 
                width={120} 
                height={35}
              />
            </MobileMenuLogo>
            <CloseButton onClick={toggleMobileMenu}>✕</CloseButton>
          </MobileMenuHeader>
          
          <MobileMenuContent>
            <MobileNavSection>
              {navItems.map((item, index) => (
                <MobileNavLink 
                  key={index} 
                  href={item.href}
                  target={item.target || '_self'}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleMobileMenu}
                >
                  {item.name}
                </MobileNavLink>
              ))}
            </MobileNavSection>
          </MobileMenuContent>
          
          <MobileMenuFooter>
            <MobileMenuCTA
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => window.open('/register', '_self')}
            >
              Create Account
            </MobileMenuCTA>
            
            <MobileContactInfo>
              Already have an account?<br />
              <strong style={{ color: theme.colors.primary, cursor: 'pointer' }} onClick={() => window.open('/login', '_self')}>Sign In Here</strong>
            </MobileContactInfo>
          </MobileMenuFooter>
        </MobileMenu>
      )}
    </>
  );
};

export default Navigation;