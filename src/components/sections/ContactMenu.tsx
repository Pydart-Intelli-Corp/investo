'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import theme from '../styles/theme';

const ContactMenuContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: ${theme.zIndices.tooltip};
`;

const ContactButton = styled(motion.button)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.secondary};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${theme.shadows.medium};
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

  const ContactMenu: React.FC = () => {
  const handleContactClick = () => {
    window.open('https://forms.gle/HEqHPwQn5jgXCvMQ6', '_blank');
  };  return (
    <ContactMenuContainer>
      <ContactButton
        onClick={handleContactClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Contact Us"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      </ContactButton>

    </ContactMenuContainer>
  );
};

export default ContactMenu;