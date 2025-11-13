'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Image from 'next/image';
import theme from '@/styles/theme';

const FooterContainer = styled.footer`
  background-color: ${theme.colors.surface};
  color: ${theme.colors.secondary};
  padding: 3rem 0 1.5rem;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 2.5rem 0 1.2rem;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 2rem 0 1rem;
  }
`;

const FooterContent = styled.div`
  max-width: ${theme.grid.containerWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0 ${theme.spacing.md};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0 ${theme.spacing.sm};
    max-width: 100%;
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing.lg};
  }
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.lg};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
  }
`;

const FooterLogo = styled.div`
  margin-bottom: ${theme.spacing.lg};
  height: 56px;
  width: fit-content;
  
  img {
    height: 100% !important;
    width: auto !important;
    max-width: 200px !important;
    object-fit: contain !important;
  }
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    height: 50px;
    margin-bottom: ${theme.spacing.md};
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    
    img {
      max-width: 180px !important;
      height: 50px !important;
    }
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 44px;
    margin-bottom: ${theme.spacing.xs};
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: center;
    
    img {
      max-width: 170px !important;
      height: 44px !important;
    }
  }
  
  @media (max-width: 360px) {
    height: 40px;
    margin-bottom: 8px;
    
    img {
      max-width: 160px !important;
      height: 40px !important;
    }
  }
`;

const FooterDescription = styled.p`
  color: ${theme.colors.gray.medium};
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.6;
  font-size: ${theme.fontSizes.base};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-bottom: ${theme.spacing.md};
    text-align: center;
    font-size: ${theme.fontSizes.small};
    line-height: 1.5;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-bottom: ${theme.spacing.xs};
    font-size: 13px;
    line-height: 1.3;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    justify-content: center;
    gap: ${theme.spacing.sm};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.xs};
    flex-wrap: wrap;
  }
`;

const SocialLink = styled(motion.a)`
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.secondary};
    transform: translateY(-2px);
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 36px;
    height: 36px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const FooterColumn = styled.div`
  @media (max-width: ${theme.breakpoints.tablet}) {
    text-align: center;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    text-align: left;
  }
`;

const ColumnTitle = styled.h4`
  margin-bottom: ${theme.spacing.lg};
  font-weight: ${theme.fontWeights.semiBold};
  position: relative;
  display: inline-block;
  font-size: ${theme.fontSizes.medium};
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: ${theme.colors.primary};
  }
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-bottom: ${theme.spacing.md};
    font-size: ${theme.fontSizes.base};
    
    &:after {
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
    }
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-bottom: ${theme.spacing.sm};
    font-size: ${theme.fontSizes.small};
    
    &:after {
      left: 0;
      transform: none;
      width: 25px;
      height: 1.5px;
    }
  }
`;

const FooterLinks = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: ${theme.spacing.sm};
  
  a {
    color: ${theme.colors.gray.medium};
    text-decoration: none;
    transition: ${theme.transitions.default};
    font-size: ${theme.fontSizes.base};
    display: block;
    padding: 2px 0;
    
    &:hover {
      color: ${theme.colors.primary};
      padding-left: 5px;
    }
  }
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-bottom: 6px;
    
    a {
      font-size: ${theme.fontSizes.small};
    }
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-bottom: 4px;
    
    a {
      font-size: 14px;
      padding: 4px 0;
    }
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSizes.base};
  
  svg {
    margin-right: ${theme.spacing.sm};
    margin-top: 3px;
    color: ${theme.colors.primary};
    min-width: 16px;
  }
  
  div {
    color: ${theme.colors.gray.medium};
    line-height: 1.4;
  }
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    justify-content: center;
    text-align: left;
    margin-bottom: ${theme.spacing.sm};
    font-size: ${theme.fontSizes.small};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-bottom: 8px;
    font-size: 14px;
    
    svg {
      margin-right: 8px;
      width: 14px;
      height: 14px;
    }
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: ${theme.spacing.lg} 0;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    margin: ${theme.spacing.md} 0;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    margin: ${theme.spacing.sm} 0;
  }
`;

const BottomFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
    text-align: center;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: 8px;
  }
`;

const Copyright = styled.p`
  color: ${theme.colors.gray.medium};
  font-size: ${theme.fontSizes.small};
  margin: 0;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 12px;
  }
`;

const FooterNav = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  
  a {
    color: ${theme.colors.gray.medium};
    font-size: ${theme.fontSizes.small};
    transition: ${theme.transitions.default};
    text-decoration: none;
    padding: 4px 8px;
    border-radius: 4px;
    
    &:hover {
      color: ${theme.colors.primary};
      background-color: rgba(255, 215, 0, 0.1);
    }
  }
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    gap: ${theme.spacing.md};
    flex-wrap: wrap;
    justify-content: center;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.sm};
    
    a {
      font-size: 12px;
      padding: 3px 6px;
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterColumn>
            <FooterLogo>
              <Image 
                src="/images/logo.webp" 
                alt="Investo Gold Logo" 
                width={200} 
                height={50}
                style={{
                  maxWidth: '200px',
                  width: '200px',
                  height: '50px',
                  objectFit: 'contain'
                }}
                priority
              />
            </FooterLogo>
            <FooterDescription>
              Leveraging cutting-edge AI technology and deep gold market expertise to deliver 
              exceptional returns for our investors. Your trusted partner in gold investments.
            </FooterDescription>
            <SocialLinks>
              <SocialLink 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </SocialLink>
              <SocialLink 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                aria-label="Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </SocialLink>
              <SocialLink 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </SocialLink>
              <SocialLink 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </SocialLink>
            </SocialLinks>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Quick Links</ColumnTitle>
            <FooterLinks>
              <FooterLink><a href="/">Home</a></FooterLink>
              <FooterLink><a href="/about">About Us</a></FooterLink>
              <FooterLink><a href="/digital-gold">Digital Gold</a></FooterLink>
              <FooterLink><a href="/physical-gold">Physical Gold</a></FooterLink>
              <FooterLink><a href="/how-it-works">How It Works</a></FooterLink>
            </FooterLinks>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Resources</ColumnTitle>
            <FooterLinks>
              <FooterLink><a href="/blog">Blog</a></FooterLink>
              <FooterLink><a href="/faq">FAQs</a></FooterLink>
              <FooterLink><a href="/testimonials">Testimonials</a></FooterLink>
              <FooterLink><a href="/performance">Performance Reports</a></FooterLink>
              <FooterLink><a href="/gold-market">Gold Market News</a></FooterLink>
            </FooterLinks>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Contact Us</ColumnTitle>
            <ContactItem>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
              </svg>
              <div>
                <strong>Dubai:</strong> Building 1-141-469<br />
                Mankhool Burjuman, Dubai, UAE<br />
                <strong>Kuwait:</strong> Hawally
              </div>
            </ContactItem>
            <ContactItem>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4h-16c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zm0 4l-8 5-8-5v-2l8 5 8-5v2z"/>
              </svg>
              <div>
                <a href="mailto:info@investogold.com" style={{color: 'inherit', textDecoration: 'none'}}>
                  info@investogold.com
                </a>
              </div>
            </ContactItem>
            <ContactItem>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 22.621l-3.521-6.795c-.008.004-1.974.97-2.064 1.011-2.24 1.086-6.799-7.82-4.609-8.994l2.083-1.026-3.493-6.817-2.106 1.039c-7.202 3.755 4.233 25.982 11.6 22.615.121-.055 2.102-1.029 2.11-1.033z"/>
              </svg>
              <div>
                <a href="tel:+971545684237" style={{color: 'inherit', textDecoration: 'none'}}>
                  Dubai   : +971545684237
                </a><br />
                <a href="tel:+96565107244" style={{color: 'inherit', textDecoration: 'none'}}>
                  Kuwait: +96565107244
                </a>
              </div>
            </ContactItem>
          </FooterColumn>
        </FooterGrid>
        
        <Divider />
        
        <BottomFooter>
          <Copyright>
            © {new Date().getFullYear()} Investo Gold. All rights reserved.
          </Copyright>
          
          <FooterNav>
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/cookies">Cookie Policy</a>
          </FooterNav>
        </BottomFooter>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;