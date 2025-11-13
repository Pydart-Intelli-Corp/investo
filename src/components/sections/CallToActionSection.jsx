'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import theme from '@/styles/theme';

const CTAContainer = styled.section`
  padding: 5rem 0;
  background: linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.cardBackground} 100%);
  position: relative;
  overflow: hidden;
`;

const CTAContent = styled.div`
  max-width: ${theme.grid.containerWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  text-align: center;
  position: relative;
  z-index: 2;
`;

const CTATitle = styled(motion.h2)`
  font-size: ${theme.fontSizes.xxlarge};
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text};
  font-weight: ${theme.fontWeights.bold};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.xlarge};
    margin-bottom: ${theme.spacing.md};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.large};
    margin-bottom: ${theme.spacing.sm};
  }
  
  @media (max-width: 360px) {
    font-size: ${theme.fontSizes.medium};
    margin-bottom: ${theme.spacing.xs};
  }
`;

const CTASubtitle = styled(motion.p)`
  font-size: ${theme.fontSizes.large};
  margin-bottom: ${theme.spacing.xxl};
  color: white;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.medium};
    margin-bottom: ${theme.spacing.xl};
    line-height: 1.5;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.base};
    margin-bottom: ${theme.spacing.lg};
    line-height: 1.4;
  }
  
  @media (max-width: 360px) {
    font-size: ${theme.fontSizes.small};
    margin-bottom: ${theme.spacing.md};
    line-height: 1.3;
  }
`;

const ActionGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xxl};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
`;

const ActionCard = styled(motion.div)`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.medium};
  border: 2px solid transparent;
  transition: ${theme.transitions.default};
  
  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: ${theme.shadows.gold};
    transform: translateY(-5px);
  }
`;

const ActionIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${theme.spacing.md};
`;

const ActionTitle = styled.h3`
  font-size: ${theme.fontSizes.large};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.primary};
  font-weight: ${theme.fontWeights.semiBold};
`;

const ActionDescription = styled.p`
  color: white;
  font-size: ${theme.fontSizes.medium};
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${theme.spacing.xxl};
`;

const PrimaryButton = styled(motion.button)`
  padding: ${theme.spacing.lg} ${theme.spacing.xxl};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.black};
  font-weight: ${theme.fontWeights.bold};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  font-size: ${theme.fontSizes.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const SecondaryButton = styled(motion.button)`
  padding: ${theme.spacing.lg} ${theme.spacing.xxl};
  background-color: transparent;
  color: ${theme.colors.text};
  font-weight: ${theme.fontWeights.bold};
  border: 2px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  font-size: ${theme.fontSizes.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  &:hover {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.black};
  }
`;

const TaglineSection = styled(motion.div)`
  background: linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.primary}10);
  border: 2px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xl};
`;

const Tagline = styled.h3`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.xlarge};
  margin: 0;
  font-weight: ${theme.fontWeights.bold};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.large};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.medium};
  }
  
  @media (max-width: 360px) {
    font-size: ${theme.fontSizes.base};
  }
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background-image: url('/images/gold-bars.webp');
  background-size: cover;
  background-position: center;
  z-index: 1;
`;

const CallToActionSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const actionSteps = [
    {
      icon: "📞",
      title: "Schedule Discussion",
      description: "Let's schedule a one-on-one discussion to understand your investment goals and preferences."
    },
    {
      icon: "📊",
      title: "View Live Performance",
      description: "See our live accounts, performance history, and complete documentation for full transparency."
    },
    {
      icon: "🚀",
      title: "Start Your Journey",
      description: "Begin your gold investment journey with Investo Gold and start building wealth today."
    }
  ];

  return (
    <CTAContainer ref={ref}>
      <BackgroundDecoration />
      <CTAContent>
        <CTATitle
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Ready to Start Your Gold Investment Journey?
        </CTATitle>
        
        <CTASubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join hundreds of satisfied investors who trust Investo Gold for their wealth building journey. 
          Take the first step towards financial freedom today.
        </CTASubtitle>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <ActionGrid variants={itemVariants}>
            {actionSteps.map((step, index) => (
              <ActionCard key={index} variants={itemVariants}>
                <ActionIcon>{step.icon}</ActionIcon>
                <ActionTitle>{step.title}</ActionTitle>
                <ActionDescription>{step.description}</ActionDescription>
              </ActionCard>
            ))}
          </ActionGrid>

          <TaglineSection variants={itemVariants}>
            <Tagline>
              👉 Investo Gold – Where Trust Meets Profitability
            </Tagline>
          </TaglineSection>
        </motion.div>
      </CTAContent>
    </CTAContainer>
  );
};

export default CallToActionSection;
