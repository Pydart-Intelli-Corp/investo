'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import theme from '@/styles/theme';

const PhysicalGoldContainer = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, 
    ${theme.colors.cardBackground} 0%,
    rgba(20, 20, 20, 0.95) 50%,
    ${theme.colors.background} 100%
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
    background: radial-gradient(circle at 70% 30%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 30% 80%, rgba(255, 215, 0, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.3;
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

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled(motion.div)`
  position: relative;
  background: linear-gradient(135deg, 
    ${theme.colors.background} 0%,
    rgba(15, 15, 15, 0.95) 100%
  );
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  text-align: center;
  backdrop-filter: blur(10px);
  overflow: hidden;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 215, 0, 0.03) 0%,
      transparent 50%,
      rgba(255, 215, 0, 0.03) 100%
    );
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, 
      ${theme.colors.primary}, 
      #fff700, 
      ${theme.colors.primary}, 
      #fff700
    );
    border-radius: 27px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.4s ease;
    background-size: 200% 200%;
    animation: gradientShift 3s ease infinite;
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    border-color: rgba(255, 215, 0, 0.5);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.4),
      0 0 40px rgba(255, 215, 0, 0.3);
    
    &::after {
      opacity: 1;
    }
    
    &::before {
      background: linear-gradient(135deg, 
        rgba(255, 215, 0, 0.08) 0%,
        transparent 50%,
        rgba(255, 215, 0, 0.08) 100%
      );
    }
  }
`;

const CardIcon = styled(motion.div)`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, ${theme.colors.primary}, #fff700);
    border-radius: 2px;
  }
`;

const CardTitle = styled(motion.h3)`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: ${theme.colors.secondary};
  font-weight: ${theme.fontWeights.bold};
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CardDescription = styled(motion.p)`
  color: ${theme.colors.gray.light};
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
`;

const HighlightSection = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(255, 215, 0, 0.12) 0%,
    rgba(255, 215, 0, 0.06) 50%,
    transparent 100%
  );
  border: 2px solid ${theme.colors.primary};
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
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
      rgba(255, 215, 0, 0.15), 
      transparent
    );
    transition: left 1s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const HighlightTitle = styled(motion.h4)`
  color: ${theme.colors.primary};
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: ${theme.fontWeights.bold};
`;

const AdvantagesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const AdvantageItem = styled(motion.div)`
  background-color: rgba(255, 215, 0, 0.05);
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text};
  border: 1px solid rgba(255, 215, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 215, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.4);
    transform: translateY(-2px);
  }
`;

const SecurityBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, ${theme.colors.primary}, #fff700);
  color: ${theme.colors.black};
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: ${theme.fontWeights.bold};
  font-size: 1.1rem;
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
`;

const PhysicalGoldSection = () => {
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
      y: 80,
      scale: 0.8,
      rotateX: 20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 100,
        duration: 0.9,
        delay: index * 0.15
      }
    }
  });

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
        delay: 0.3
      }
    }
  };

  const features = [
    {
      icon: "🏛️",
      title: "UAE-Based & Legal",
      description: "Based in the UAE with full legal documentation & compliance ensuring complete security"
    },
    {
      icon: "⚖️",
      title: "Minimum Entry",
      description: "Minimum entry requirement of 1 KG of gold for institutional-grade investment access"
    },
    {
      icon: "📈",
      title: "Annual Returns",
      description: "12–15% annual returns plus additional upside from global gold price appreciation"
    },
    {
      icon: "🔐",
      title: "Zero Risk",
      description: "Secure, tangible, and completely risk-free investment with physical asset backing"
    }
  ];

  const advantages = [
    "Tangible Asset Security",
    "UAE Legal Compliance", 
    "Price Appreciation Upside",
    "Long-term Stability"
  ];

  return (
    <PhysicalGoldContainer ref={ref}>
      <SectionContent>
        <SectionHeader>
          <SectionTitle
            initial={{ opacity: 0, y: -30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Physical Gold Investment
          </SectionTitle>
          
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            🔒 Stable & Zero-Risk
          </SectionSubtitle>
        </SectionHeader>

        <CardsGrid>
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
                  y: -15,
                  scale: 1.03,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                <CardIcon
                  variants={iconVariants}
                  initial="hidden"
                  animate={cardInView ? "visible" : "hidden"}
                >
                  {feature.icon}
                </CardIcon>
                <CardTitle
                  initial={{ opacity: 0, y: 20 }}
                  animate={cardInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                >
                  {feature.title}
                </CardTitle>
                <CardDescription
                  initial={{ opacity: 0, y: 20 }}
                  animate={cardInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                >
                  {feature.description}
                </CardDescription>
              </FeatureCard>
            );
          })}
        </CardsGrid>

        <HighlightSection
          ref={cardRefs[4].ref}
          variants={getCardVariants(4)}
          initial="hidden"
          animate={cardRefs[4].inView ? "visible" : "hidden"}
          whileHover={{ 
            scale: 1.02,
            transition: { type: "spring", stiffness: 300, damping: 20 }
          }}
        >
          <HighlightTitle
            initial={{ opacity: 0, scale: 0.8 }}
            animate={cardRefs[4].inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            🔒 Physical Gold Advantages
          </HighlightTitle>
          
          <AdvantagesList>
            {advantages.map((advantage, index) => (
              <AdvantageItem
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={cardRefs[4].inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                whileHover={{ scale: 1.05 }}
              >
                {advantage}
              </AdvantageItem>
            ))}
          </AdvantagesList>
          
          <SecurityBadge
            initial={{ opacity: 0, y: 30 }}
            animate={cardRefs[4].inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 12px 35px rgba(255, 215, 0, 0.4)"
            }}
          >
            🛡️ 100% Secure & Risk-Free
          </SecurityBadge>
        </HighlightSection>
      </SectionContent>
    </PhysicalGoldContainer>
  );
};

export default PhysicalGoldSection;
