'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';
import theme from '@/styles/theme';

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

const LoaderContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isHidden',
})`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.cardBackground} 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.5s ease-out, visibility 0.5s ease-out;
  
  ${props => props.isHidden && `
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  `}
`;

const LogoContainer = styled.div`
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
`;

const LogoImage = styled.img`
  width: 120px;
  height: auto;
  margin-bottom: ${theme.spacing.md};
  filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.3));
`;

const BrandText = styled.h1`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.xlarge};
  font-weight: ${theme.fontWeights.bold};
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const BrandSubtext = styled.p`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.medium};
  margin: ${theme.spacing.sm} 0 0 0;
  font-weight: ${theme.fontWeights.semiBold};
`;

const DotsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
`;

const Dot = styled.div`
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, #ffd700 100%);
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite ease-in-out both;
  box-shadow: 0 4px 8px rgba(255, 215, 0, 0.4);
  
  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  
  &:nth-child(2) {
    animation-delay: -0.16s;
  }
  
  &:nth-child(3) {
    animation-delay: 0s;
  }
`;

const LoadingText = styled.p`
  color: ${theme.colors.gray.light};
  font-size: ${theme.fontSizes.small};
  margin-top: ${theme.spacing.lg};
  font-weight: ${theme.fontWeights.medium};
  letter-spacing: 0.5px;
`;

const LoadingSpinner = ({ isLoading }) => {
  return (
    <LoaderContainer isHidden={!isLoading}>
      <LogoContainer>
        <LogoImage src="/images/logo.webp" alt="Investo Gold" />
        <BrandSubtext>Trusted Gold Investment Partner</BrandSubtext>
      </LogoContainer>
      
      <DotsContainer>
        <Dot />
        <Dot />
        <Dot />
      </DotsContainer>
      
      <LoadingText>Loading your investment opportunity...</LoadingText>
    </LoaderContainer>
  );
};

export default LoadingSpinner;