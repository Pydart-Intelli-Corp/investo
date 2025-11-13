'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import theme from '@/styles/theme';

const BenefitsSectionContainer = styled.section`
  padding: 6rem 0;
  background-color: ${theme.colors.background};
  position: relative;
  min-height: 100vh;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 4rem 0 3rem 0;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 2.5rem 0 2rem 0;
    min-height: auto;
  }
`;

const WhyGoldSection = styled.div`
  max-width: ${theme.grid.containerWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  margin-bottom: 4rem;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0 ${theme.spacing.md};
    margin-bottom: 3rem;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0 ${theme.spacing.sm};
    margin-bottom: 2rem;
  }
`;

const WhyGoldContent = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const WhyGoldTitle = styled(motion.h2)`
  font-size: ${theme.fontSizes.xxlarge};
  margin-bottom: ${theme.spacing.xl};
  color: ${theme.colors.text};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.xlarge};
    margin-bottom: ${theme.spacing.lg};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.large};
    margin-bottom: ${theme.spacing.md};
  }
`;

const WhyGoldDescription = styled(motion.p)`
  font-size: ${theme.fontSizes.large};
  line-height: 1.6;
  color: white;
  margin-bottom: ${theme.spacing.xl};
  
  .gold-word {
    color: white;
    transition: color 0.3s ease;
    cursor: pointer;
    
    &:hover {
      color: ${theme.colors.primary};
    }
  }
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.medium};
    line-height: 1.5;
    margin-bottom: ${theme.spacing.lg};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.base};
    line-height: 1.4;
    margin-bottom: ${theme.spacing.md};
  }
`;

const JoinButton = styled(motion.button)`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.black};
  font-weight: ${theme.fontWeights.semiBold};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  font-size: ${theme.fontSizes.medium};
  margin-bottom: 3rem;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.base};
    margin-bottom: 2.5rem;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.fontSizes.xs};
    margin-bottom: 1.5rem;
  }
`;

const BenefitsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0 ${theme.spacing.md};
    max-width: 900px;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0 ${theme.spacing.sm};
    max-width: 100%;
  }
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  color: ${theme.colors.text};
  font-size: 2.5rem;
  font-weight: ${theme.fontWeights.bold};
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
  
  @media (max-width: 360px) {
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
`;

// Modern Professional Timeline Components
const TimelineContainer = styled.div`
  position: relative;
  max-width: 1000px;
  margin: 3rem auto 0;
  padding: 2rem 0;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(255, 215, 0, 0.3) 5%,
      ${theme.colors.primary} 20%,
      ${theme.colors.primary} 80%,
      rgba(255, 215, 0, 0.3) 95%,
      transparent 100%
    );
    transform: translateX(-50%);
    z-index: 1;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 6px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(255, 215, 0, 0.1) 10%,
      rgba(255, 215, 0, 0.05) 50%,
      rgba(255, 215, 0, 0.1) 90%,
      transparent 100%
    );
    transform: translateX(-50%);
    z-index: 0;
    animation: pulse 3s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  
  @media (max-width: 768px) {
    margin: 2rem auto 0;
    padding: 1rem 0;
    max-width: 400px;
    
    &::before {
      left: 20px;
      transform: none;
    }
    
    &::after {
      left: 17px;
      transform: none;
    }
  }
  
  @media (max-width: 480px) {
    max-width: 320px;
    margin: 1.5rem auto 0;
    
    &::before {
      left: 15px;
    }
    
    &::after {
      left: 12px;
    }
  }
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  margin-bottom: 5rem;
  display: flex;
  align-items: stretch;
  justify-content: ${props => props.index % 2 === 0 ? 'flex-start' : 'flex-end'};
  
  &:last-child {
    margin-bottom: 3rem;
  }
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    margin-bottom: 3rem;
    padding-left: 50px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 2.5rem;
    padding-left: 40px;
  }
`;

const TimelineCard = styled(motion.div)`
  position: relative;
  width: 45%;
  background: linear-gradient(135deg, 
    ${theme.colors.cardBackground} 0%,
    rgba(26, 26, 26, 0.95) 100%
  );
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  padding-top: 2rem;
  backdrop-filter: blur(10px);
  overflow: visible;
  margin: ${props => props.index % 2 === 0 ? '0 auto 0 0' : '0 0 0 auto'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 215, 0, 0.02) 0%,
      transparent 50%,
      rgba(255, 215, 0, 0.02) 100%
    );
    pointer-events: none;
    border-radius: 16px;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    ${props => props.index % 2 === 0 ? 'right: -12px;' : 'left: -12px;'}
    width: 24px;
    height: 24px;
    background: ${theme.colors.cardBackground};
    border: 1px solid rgba(255, 215, 0, 0.3);
    transform: translateY(-50%) rotate(45deg);
    z-index: 5;
  }
  
  &:hover {
    border-color: rgba(255, 215, 0, 0.4);
    transform: translateY(-3px);
    box-shadow: 
      0 15px 30px rgba(0, 0, 0, 0.3),
      0 0 25px rgba(255, 215, 0, 0.1);
    
    &::before {
      background: linear-gradient(135deg, 
        rgba(255, 215, 0, 0.05) 0%,
        transparent 50%,
        rgba(255, 215, 0, 0.05) 100%
      );
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    margin: 0;
    padding: 1.2rem;
    padding-top: 1.8rem;
    border-radius: 12px;
    
    &::after {
      left: -12px;
      right: auto;
      width: 20px;
      height: 20px;
    }
  }
  
  @media (max-width: 480px) {
    max-width: 280px;
    padding: 1rem;
    padding-top: 1.5rem;
    
    &::after {
      left: -10px;
      width: 16px;
      height: 16px;
    }
  }
  
  @media (max-width: 360px) {
    max-width: 260px;
    padding: 0.8rem;
    padding-top: 1.3rem;
  }
`;

const TimelineImage = styled(motion.div)`
  width: 100%;
  height: 160px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
  position: relative;
  background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    filter: brightness(0.8) contrast(1.1) saturate(1.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 215, 0, 0.1) 0%,
      transparent 30%,
      transparent 70%,
      rgba(255, 215, 0, 0.1) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 6px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 2;
  }
  
  ${TimelineCard}:hover & {
    &::before,
    &::after {
      opacity: 1;
    }
    
    img {
      transform: scale(1.05);
      filter: brightness(1) contrast(1.2) saturate(1.3);
    }
  }
  
  @media (max-width: 768px) {
    height: 140px;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    height: 120px;
    margin-bottom: 0.6rem;
    border-radius: 8px;
  }
  
  @media (max-width: 360px) {
    height: 100px;
  }
`;

const TimelineDot = styled(motion.div)`
  position: absolute;
  left: 47%;
  top: 50%;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, #fff700 100%);
  border: 4px solid ${theme.colors.cardBackground};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 20;
  box-shadow: 
    0 0 0 3px rgba(255, 215, 0, 0.2),
    0 0 20px rgba(255, 215, 0, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  overflow: visible;
  
  &::before {
    content: '';
    position: absolute;
    width: 80px;
    height: 80px;
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-radius: 50%;
    border-style: dashed;
    animation: rotate 15s linear infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    border: 1px solid rgba(255, 215, 0, 0.1);
    border-radius: 50%;
    animation: rotate 20s linear infinite reverse;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 
      0 0 0 5px rgba(255, 215, 0, 0.2),
      0 0 25px rgba(255, 215, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    display: none;
  }
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const TimelineContent = styled.div`
  position: relative;
  z-index: 2;
`;

const TimelineNumber = styled(motion.div)`
  position: absolute;
  top: -12px;
  ${props => props.index % 2 === 0 ? 'right: 16px;' : 'left: 16px;'}
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, ${theme.colors.primary}, #fff700);
  color: ${theme.colors.black};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.fontWeights.bold};
  font-size: 1.1rem;
  box-shadow: 
    0 3px 10px rgba(255, 215, 0, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.2);
  z-index: 10;
  overflow: visible;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, ${theme.colors.primary}, #fff700);
    border-radius: 12px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 0.7;
  }
  
  @media (max-width: 768px) {
    top: -10px;
    right: 12px;
    left: auto;
    width: 30px;
    height: 30px;
    font-size: 1rem;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
    right: 10px;
    top: -8px;
  }
  
  @media (max-width: 360px) {
    width: 25px;
    height: 25px;
    font-size: 0.8rem;
    right: 8px;
    top: -6px;
  }
`;

const TimelineTitle = styled(motion.h3)`
  font-size: 1.3rem;
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.secondary};
  margin-bottom: 0.8rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, ${theme.colors.primary}, #fff700);
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 1px;
  }
  
  ${TimelineCard}:hover & {
    &::after {
      width: 60px;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 0.7rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 0.6rem;
  }
  
  @media (max-width: 360px) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    
    &::after {
      width: 40px;
    }
  }
`;

const TimelineDescription = styled(motion.p)`
  font-size: 0.95rem;
  color: ${theme.colors.gray.dark};
  line-height: 1.6;
  margin: 0;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    line-height: 1.4;
  }
  
  @media (max-width: 360px) {
    font-size: 0.8rem;
    line-height: 1.3;
  }
`;

const TimelineProgress = styled(motion.div)`
  position: absolute;
  left: 50%;
  top: 0;
  width: 6px;
  height: 0;
  background: linear-gradient(to bottom, ${theme.colors.primary}, #fff700);
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
  border-radius: 3px;
  
  @media (max-width: 768px) {
    left: 20px;
    transform: none;
    width: 4px;
  }
  
  @media (max-width: 480px) {
    left: 15px;
    width: 3px;
  }
`;

const BenefitsSection = () => {
  // Animation settings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  // Intersection Observer hook to trigger animations when in view
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Benefits data
  const benefits = [
    {
      icon: "🥇",
      title: "Gold-centric",
      description: "Exclusive focus on gold - no distractions",
      image: "/images/gold-coin.webp"
    },
    {
      icon: "🛡️",
      title: "Reliability",
      description: "Proven AI trading history with live performance",
      image: "/images/ai-robot.webp"
    },
    {
      icon: "⚡",
      title: "Versatility",
      description: "Flexibility to benefit from both sides of the market",
      image: "/images/gold-bars-hand.webp"
    },
    {
      icon: "⚖️",
      title: "Legitimacy",
      description: "UAE-based with complete legal compliance",
      image: "/images/business-meeting-uae.webp"
    },
    {
      icon: "🔍",
      title: "Transparency",
      description: "Transparent, investor-controlled system",
      image: "/images/consultation.webp"
    },
    {
      icon: "📈",
      title: "Compounding Growth",
      description: "Steady growth through reinvested returns, multiplying wealth exponentially",
      image: "/images/gold-bars.webp"
    }
  ];
  
  const [progressRef, progressInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  // Individual refs for each timeline item for staggered animation
  const timelineItemRefs = benefits.map(() => {
    const [ref, inView] = useInView({
      threshold: 0.3,
      triggerOnce: true,
      rootMargin: '-50px 0px'
    });
    return { ref, inView };
  });

  const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const getCardVariants = (index) => ({
    hidden: { 
      opacity: 0, 
      y: 60,
      x: index % 2 === 0 ? -30 : 30,
      scale: 0.95,
      filter: "blur(4px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.7,
        delay: index * 0.15
      }
    }
  });

  const getDotVariants = (index) => ({
    hidden: { 
      scale: 0, 
      opacity: 0,
      y: 20,
      rotate: -90
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        delay: 0.2 + (index * 0.1)
      }
    }
  });

  const getImageVariants = (index) => ({
    hidden: { 
      scale: 1.1, 
      opacity: 0,
      y: 30,
      filter: "blur(8px)"
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.1 + (index * 0.1)
      }
    }
  });

  const getNumberVariants = (index) => ({
    hidden: { 
      scale: 0, 
      opacity: 0,
      y: -30,
      rotate: -45
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
        delay: 0.3 + (index * 0.1)
      }
    }
  });

  return (
    <BenefitsSectionContainer>
      <WhyGoldSection>
        <WhyGoldContent>
          <WhyGoldTitle
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Why <span className="gold-word">Gold</span>?
          </WhyGoldTitle>
          
          <WhyGoldDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <span className="gold-word">Gold</span> is the world's most reliable safe-haven asset, immune to inflation, political instability, and currency fluctuations. It offers unmatched liquidity, long-term value preservation, and steady growth, making it a timeless choice for investors.
          </WhyGoldDescription>
          
          <JoinButton
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://forms.gle/HEqHPwQn5jgXCvMQ6', '_blank')}
          >
            JOIN WITH US
          </JoinButton>
        </WhyGoldContent>
      </WhyGoldSection>

      <BenefitsContent>
        <SectionTitle
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Why Choose Investogold?
        </SectionTitle>

        <TimelineContainer ref={progressRef}>
          <TimelineProgress
            initial={{ height: 0 }}
            animate={progressInView ? { height: "100%" } : { height: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
          />
          
          {benefits.map((benefit, index) => {
            const { ref: itemRef, inView: itemInView } = timelineItemRefs[index];
            
            return (
              <TimelineItem key={index} index={index} ref={itemRef}>
                <TimelineCard
                  variants={getCardVariants(index)}
                  index={index}
                  initial="hidden"
                  animate={itemInView ? "visible" : "hidden"}
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                >
                  <TimelineNumber
                    variants={getNumberVariants(index)}
                    index={index}
                    initial="hidden"
                    animate={itemInView ? "visible" : "hidden"}
                    whileHover={{ 
                      scale: 1.1,
                      transition: { type: "spring", stiffness: 400, damping: 15 }
                    }}
                  >
                    {index + 1}
                  </TimelineNumber>

                  <TimelineContent>
                    <TimelineImage
                      variants={getImageVariants(index)}
                      initial="hidden"
                      animate={itemInView ? "visible" : "hidden"}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <img src={benefit.image} alt={benefit.title} loading="lazy" />
                    </TimelineImage>

                    <TimelineTitle
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      animate={itemInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      transition={{ duration: 0.6, delay: 0.4 + (index * 0.05) }}
                    >
                      {benefit.title}
                    </TimelineTitle>

                    <TimelineDescription
                      initial={{ opacity: 0, y: 20 }}
                      animate={itemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: 0.5 + (index * 0.05) }}
                    >
                      {benefit.description}
                    </TimelineDescription>
                  </TimelineContent>
                </TimelineCard>

                <TimelineDot
                  variants={getDotVariants(index)}
                  initial="hidden"
                  animate={itemInView ? "visible" : "hidden"}
                  whileHover={{ 
                    scale: 1.15,
                    boxShadow: "0 0 40px rgba(255, 215, 0, 0.5)",
                    transition: { type: "spring", stiffness: 400, damping: 20 }
                  }}
                >
                  {benefit.icon}
                </TimelineDot>
              </TimelineItem>
            );
          })}
        </TimelineContainer>
      </BenefitsContent>
    </BenefitsSectionContainer>
  );
};

export default BenefitsSection;