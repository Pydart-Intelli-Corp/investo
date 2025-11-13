'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import theme from '@/styles/theme';

const DigitalGoldContainer = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, 
    ${theme.colors.background} 0%,
    rgba(26, 26, 26, 0.95) 50%,
    ${theme.colors.cardBackground} 100%
  );
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3rem;
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.text};
  font-weight: ${theme.fontWeights.bold};
  background: linear-gradient(135deg, ${theme.colors.text} 0%, ${theme.colors.primary} 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xl};
  font-weight: ${theme.fontWeights.semiBold};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, ${theme.colors.primary}, #fff700);
    border-radius: 2px;
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled(motion.div)`
  position: relative;
  background: linear-gradient(135deg, 
    ${theme.colors.cardBackground} 0%,
    rgba(26, 26, 26, 0.95) 100%
  );
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  overflow: hidden;
  
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
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, ${theme.colors.primary}, #fff700, ${theme.colors.primary});
    border-radius: 22px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    border-color: rgba(255, 215, 0, 0.4);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 30px rgba(255, 215, 0, 0.2);
    
    &::after {
      opacity: 1;
    }
    
    &::before {
      background: linear-gradient(135deg, 
        rgba(255, 215, 0, 0.05) 0%,
        transparent 50%,
        rgba(255, 215, 0, 0.05) 100%
      );
    }
  }
`;

const CardIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, ${theme.colors.primary}, #fff700);
    border-radius: 1px;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${theme.colors.secondary};
  font-weight: ${theme.fontWeights.bold};
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled(motion.li)`
  color: ${theme.colors.gray.light};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.6;
  
  &:before {
    content: '✨';
    font-size: 1rem;
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const HighlightCard = styled(motion.div)`
  grid-column: 1 / -1;
  background: linear-gradient(135deg, 
    rgba(255, 215, 0, 0.1) 0%,
    rgba(255, 215, 0, 0.05) 50%,
    transparent 100%
  );
  border: 2px solid ${theme.colors.primary};
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 215, 0, 0.1), 
      transparent
    );
    transition: left 0.8s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const HighlightTitle = styled.h4`
  color: ${theme.colors.primary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: ${theme.fontWeights.bold};
`;

const HighlightText = styled.p`
  color: ${theme.colors.text};
  font-size: 1.1rem;
  margin: 0;
  font-weight: ${theme.fontWeights.medium};
  line-height: 1.6;
`;

const DigitalGoldSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Individual refs for each card for staggered animation
  const cardRefs = Array.from({ length: 5 }, () => {
    const [ref, inView] = useInView({
      threshold: 0.3,
      triggerOnce: true,
      rootMargin: '-50px 0px'
    });
    return { ref, inView };
  });

  const getCardVariants = (index) => ({
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9,
      rotateY: 15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.8,
        delay: index * 0.1
      }
    }
  });

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const features = [
    {
      icon: "🤖",
      title: "AI Strategy & Performance",
      items: [
        "Trading only in gold with AI robotic strategy",
        "Proven track record of 3+ years",
        "Consistent monthly profits delivered",
        "Live verified accounts available on request"
      ]
    },
    {
      icon: "📈",
      title: "Returns & Transparency",
      items: [
        "Returns: Minimum 3% up to 10% monthly",
        "Full transparency with live accounts",
        "Complete investor account control",
        "Profits shared only when you gain"
      ]
    },
    {
      icon: "🛡️",
      title: "Capital Protection",
      items: [
        "Stop-out level at 30% equity",
        "Automatic risk management system",
        "Safety net never triggered in 3 years",
        "Built-in downside protection"
      ]
    },
    {
      icon: "⚡",
      title: "Key Benefits",
      items: [
        "Higher monthly returns potential",
        "Full investor account control",
        "Monthly compounding growth",
        "Proven AI technology advantage"
      ]
    }
  ];

  return (
    <DigitalGoldContainer ref={ref}>
      <SectionContent>
        <SectionHeader>
          <SectionTitle
            initial={{ opacity: 0, y: -30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Digital Gold Investment
          </SectionTitle>
          
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            💡 Smart, AI-powered, and Proven
          </SectionSubtitle>
        </SectionHeader>

        <CardsContainer>
          {features.map((feature, index) => {
            const { ref: cardRef, inView: cardInView } = cardRefs[index];
            
            return (
              <FeatureCard
                key={index}
                ref={cardRef}
                variants={getCardVariants(index)}
                initial="hidden"
                animate={cardInView ? "visible" : "hidden"}
                whileHover={{ 
                  y: -12,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                <CardIcon>{feature.icon}</CardIcon>
                <CardTitle>{feature.title}</CardTitle>
                <FeatureList>
                  {feature.items.map((item, itemIndex) => (
                    <FeatureItem
                      key={itemIndex}
                      variants={itemVariants}
                      initial="hidden"
                      animate={cardInView ? "visible" : "hidden"}
                      transition={{ delay: 0.3 + (itemIndex * 0.1) }}
                    >
                      {item}
                    </FeatureItem>
                  ))}
                </FeatureList>
              </FeatureCard>
            );
          })}
          
          <HighlightCard
            ref={cardRefs[4].ref}
            variants={getCardVariants(4)}
            initial="hidden"
            animate={cardRefs[4].inView ? "visible" : "hidden"}
            whileHover={{ 
              scale: 1.02,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
          >
            <HighlightTitle>⚡ Key Benefit</HighlightTitle>
            <HighlightText>
              Higher monthly returns with full investor account control (profits only shared if you gain)
            </HighlightText>
          </HighlightCard>
        </CardsContainer>
      </SectionContent>
    </DigitalGoldContainer>
  );
};

export default DigitalGoldSection;
