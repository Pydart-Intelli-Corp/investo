'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import VideoBackground from './VideoBackground';
import theme from '@/styles/theme';

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8rem 0 4rem;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 6rem 0 3rem;
    max-width: 600px;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 4rem 0 2rem;
    max-width: 90%;
  }
`;

const Title = styled(motion.h1)`
  font-size: ${theme.fontSizes.xxlarge};
  font-weight: ${theme.fontWeights.bold};
  margin-bottom: ${theme.spacing.lg};
  color: white;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.xlarge};
    margin-bottom: ${theme.spacing.md};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.large};
    margin-bottom: ${theme.spacing.sm};
    line-height: 1.2;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: ${theme.fontSizes.large};
  margin-bottom: ${theme.spacing.xl};
  color: white;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.medium};
    margin-bottom: ${theme.spacing.lg};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.base};
    margin-bottom: ${theme.spacing.md};
    line-height: 1.4;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
    width: 100%;
    max-width: 300px;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    max-width: 280px;
  }
`;

const PrimaryButton = styled(motion.button)`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-weight: ${theme.fontWeights.semiBold};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  font-size: ${theme.fontSizes.medium};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.base};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.small};
  }
`;

const SecondaryButton = styled(motion.button)`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background-color: transparent;
  color: white;
  font-weight: ${theme.fontWeights.semiBold};
  border: 2px solid white;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  font-size: ${theme.fontSizes.medium};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.base};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.small};
  }
`;

const GoldHighlight = styled.span`
  color: ${theme.colors.primary};
`;

const HeroSection = () => {
  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, delay: 0.2 } 
    }
  };
  
  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay: 0.4 } 
    }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, delay: 0.6 } 
    }
  };

  return (
    <VideoBackground 
      videoSrc="/video/hero.mp4" 
      overlay={0.2}
    >
      <HeroContent>
        <Title
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          Trusted <GoldHighlight>Gold Investment</GoldHighlight> Partner
        </Title>
        
        <Subtitle
          initial="hidden"
          animate="visible"
          variants={subtitleVariants}
        >
          UAE-based investment consultancy specializing exclusively in <GoldHighlight>gold investments</GoldHighlight>. We provide Digital Gold powered by AI-driven trading for consistent monthly profits, and Physical Gold offering stable annual returns.
        </Subtitle>
        
        <ButtonContainer>
          <PrimaryButton
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: theme.shadows.goldIntense 
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://forms.gle/HEqHPwQn5jgXCvMQ6', '_blank')}
          >
            Join Today
          </PrimaryButton>
          
          <SecondaryButton
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
            whileHover={{ 
              scale: 1.05, 
              borderColor: theme.colors.primary,
              color: theme.colors.primary
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://www.tradingview.com/symbols/XAUUSD/', '_blank')}
          >
            View Performance
          </SecondaryButton>
        </ButtonContainer>
      </HeroContent>
    </VideoBackground>
  );
};

export default HeroSection;