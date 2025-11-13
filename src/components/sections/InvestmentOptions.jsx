'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import theme from '@/styles/theme';

const InvestmentOptionsContainer = styled.section`
  padding: 5rem 0;
  background-color: ${theme.colors.cardBackground};
`;

const SectionContent = styled.div`
  max-width: ${theme.grid.containerWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  position: relative;
  display: inline-block;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.xlarge};
  font-weight: ${theme.fontWeights.bold};
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${theme.colors.primary};
  }
`;

const SectionIntro = styled(motion.p)`
  text-align: center;
  max-width: 700px;
  margin: 0 auto ${theme.spacing.xxl};
  color: ${theme.colors.gray.dark};
  font-size: ${theme.fontSizes.medium};
  line-height: 1.6;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const OptionCard = styled(motion.div)`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${theme.shadows.medium};
  transition: ${theme.transitions.default};
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${theme.shadows.gold};
  }
`;

const OptionImage = styled.div`
  height: 250px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  }
`;

const OptionTitle = styled.h3`
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #FFFFFF;
  z-index: 1;
  margin: 0;
  font-weight: ${theme.fontWeights.bold};
  font-size: ${theme.fontSizes.large};
`;

const OptionContent = styled.div`
  padding: ${theme.spacing.xl};
`;

const OptionDescription = styled.p`
  color: ${theme.colors.gray.dark};
  font-size: ${theme.fontSizes.base};
  line-height: 1.6;
  margin-bottom: ${theme.spacing.lg};
`;

const OptionFeatures = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: ${theme.spacing.xl};
`;

const OptionFeature = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.text};
  
  &:before {
    content: '✓';
    color: ${theme.colors.primary};
    margin-right: ${theme.spacing.sm};
    font-weight: bold;
  }
`;

const OptionButton = styled(motion.button)`
  width: 100%;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.secondary};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-weight: ${theme.fontWeights.semiBold};
  cursor: pointer;
  transition: ${theme.transitions.default};
  
  &:hover {
    box-shadow: ${theme.shadows.gold};
  }
`;

const ReturnRate = styled.div`
  font-size: ${theme.fontSizes.xlarge};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
  margin: ${theme.spacing.md} 0;
`;

const InvestmentOptions = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  // Investment options data
  const options = [
    {
      title: "Digital Gold Investment",
      image: "/images/ai-robot.webp",
      description: "AI-driven trading with consistent monthly profits. Smart, AI-powered, and proven with 3+ years track record.",
      features: [
        "Minimum 3% up to 10% monthly returns",
        "AI robotic trading strategy",
        "Full investor account control",
        "Live verified accounts available",
        "Monthly compounding growth"
      ],
      returnRate: "3% - 10% Monthly",
      buttonText: "Start Digital Gold"
    },
    {
      title: "Physical Gold Investment",
      image: "/images/gold-bars.webp",
      description: "UAE-regulated, zero-risk investment with stable annual returns. Secure, tangible, and completely risk-free.",
      features: [
        "12-15% annual returns guaranteed",
        "Minimum 1 KG gold entry",
        "UAE legal compliance & documentation",
        "Global gold price appreciation upside",
        "Zero-risk tangible asset"
      ],
      returnRate: "12-15% Annual",
      buttonText: "Invest in Physical Gold"
    }
  ];
  
  return (
    <InvestmentOptionsContainer>
      <SectionContent>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          The Opportunity for Investors
        </SectionTitle>
        
        <SectionIntro
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Partner with Investo Gold and grow with the trusted gold experts. Choose from our dual investment options designed for different financial goals and risk preferences.
        </SectionIntro>
        
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <OptionsGrid>
            {options.map((option, index) => (
              <OptionCard
                key={index}
                variants={itemVariants}
              >
                <OptionImage image={option.image}>
                  <OptionTitle>{option.title}</OptionTitle>
                </OptionImage>
                
                <OptionContent>
                  <OptionDescription>{option.description}</OptionDescription>
                  <ReturnRate className="gold-shimmer">{option.returnRate}</ReturnRate>
                  
                  <OptionFeatures>
                    {option.features.map((feature, i) => (
                      <OptionFeature key={i}>{feature}</OptionFeature>
                    ))}
                  </OptionFeatures>
                  
                  <OptionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open('https://forms.gle/HEqHPwQn5jgXCvMQ6', '_blank')}
                  >
                    {option.buttonText}
                  </OptionButton>
                </OptionContent>
              </OptionCard>
            ))}
          </OptionsGrid>
        </motion.div>
      </SectionContent>
    </InvestmentOptionsContainer>
  );
};

export default InvestmentOptions;