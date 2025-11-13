'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styled from 'styled-components';
import theme from '@/styles/theme';

const ParallaxContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  min-height: ${props => props.height || '100vh'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const BackgroundImage = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  z-index: -1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, ${props => props.overlay || 0.5});
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: ${theme.grid.containerWidth};
  padding: 0 ${theme.spacing.lg};
  position: relative;
  z-index: 1;
  color: ${theme.colors.white};
`;

const ParallaxBackground = ({ 
  children, 
  image, 
  height, 
  overlay, 
  parallaxStrength = 100,
  className = "" 
}) => {
  const [windowHeight, setWindowHeight] = useState(0);
  const { scrollY } = useScroll();
  
  useEffect(() => {
    // Set window height for parallax calculation
    setWindowHeight(window.innerHeight);
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Calculate parallax transform based on scroll position
  const y = useTransform(
    scrollY,
    [0, windowHeight],
    [0, parallaxStrength]
  );
  
  return (
    <ParallaxContainer 
      height={height}
      className={className}
    >
      <BackgroundImage 
        image={image}
        overlay={overlay}
        style={{ y }}
      />
      <ContentContainer>
        {children}
      </ContentContainer>
    </ParallaxContainer>
  );
};

export default ParallaxBackground;