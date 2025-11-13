'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import theme from '@/styles/theme';

const InvestmentContainer = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, 
    ${theme.colors.background} 0%,
    rgba(20, 20, 20, 0.95) 50%,
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
    background: radial-gradient(circle at 30% 20%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(255, 215, 0, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const SectionContent = styled.div`
  max-width: 900px;
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

const SectionDescription = styled(motion.p)`
  font-size: 1.2rem;
  color: ${theme.colors.gray.light};
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const InvestmentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const InvestmentCard = styled(motion.div)`
  background: linear-gradient(135deg, 
    ${theme.colors.cardBackground} 0%,
    rgba(26, 26, 26, 0.95) 100%
  );
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 24px;
  padding: 3rem;
  position: relative;
  overflow: hidden;
  
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
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, ${theme.colors.primary}, #fff700);
    border-radius: 26px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 215, 0, 0.4);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 30px rgba(255, 215, 0, 0.2);
    
    &::after {
      opacity: 1;
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const CardIcon = styled.div`
  font-size: 3rem;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${theme.colors.primary}, #fff700);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
`;

const CardTitleSection = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 2rem;
  color: ${theme.colors.secondary};
  font-weight: ${theme.fontWeights.bold};
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
`;

const CardSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.primary};
  font-weight: ${theme.fontWeights.semiBold};
  margin: 0;
`;

const CardContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const FeatureColumn = styled.div`
  flex: 1;
  min-width: 250px;
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
  font-size: 1rem;
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

const HighlightBadge = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(255, 215, 0, 0.15) 0%,
    rgba(255, 215, 0, 0.05) 100%
  );
  border: 1px solid ${theme.colors.primary};
  border-radius: 50px;
  padding: 1rem 2rem;
  text-align: center;
  margin-top: 2rem;
  
  h4 {
    color: ${theme.colors.primary};
    font-size: 1.1rem;
    font-weight: ${theme.fontWeights.bold};
    margin: 0 0 0.5rem 0;
  }
  
  p {
    color: ${theme.colors.text};
    margin: 0;
    font-size: 1rem;
  }
`;

const InvestmentOptionsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Individual refs for each card
  const cardRefs = Array.from({ length: 2 }, () => {
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
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.8,
        delay: index * 0.2
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

  return (
    <InvestmentContainer ref={ref}>
      <SectionContent>
        <SectionHeader>
          <SectionTitle
            initial={{ opacity: 0, y: -30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Investment Options
          </SectionTitle>
          
          <SectionDescription
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Choose between our AI-powered digital gold trading or secure physical gold investment. 
            Both options offer proven returns with complete transparency and investor control.
          </SectionDescription>
        </SectionHeader>

        <InvestmentOptions>
          {/* Digital Gold Investment */}
          <InvestmentCard
            ref={cardRefs[0].ref}
            variants={getCardVariants(0)}
            initial="hidden"
            animate={cardRefs[0].inView ? "visible" : "hidden"}
            whileHover={{ 
              y: -8,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
          >
            <CardHeader>
              <CardIcon>🤖</CardIcon>
              <CardTitleSection>
                <CardTitle>Digital Gold Investment</CardTitle>
                <CardSubtitle>💡 Smart, AI-powered, and Proven</CardSubtitle>
              </CardTitleSection>
            </CardHeader>
            
            <CardContent>
              <FeatureColumn>
                <FeatureList>
                  <FeatureItem
                    variants={itemVariants}
                    initial="hidden"
                    animate={cardRefs[0].inView ? "visible" : "hidden"}
                    transition={{ delay: 0.3 }}
                  >
                    AI robotic strategy with 3+ years proven track record
                  </FeatureItem>
                  <FeatureItem
                    variants={itemVariants}
                    initial="hidden"
                    animate={cardRefs[0].inView ? "visible" : "hidden"}
                    transition={{ delay: 0.4 }}
                  >
                    Monthly returns: Minimum 3% up to 10%
                  </FeatureItem>
                  <FeatureItem
                    variants={itemVariants}
                    initial="hidden"
                    animate={cardRefs[0].inView ? "visible" : "hidden"}
                    transition={{ delay: 0.5 }}
                  >
                    Full investor account control & transparency
                  </FeatureItem>
                  <FeatureItem
                    variants={itemVariants}
                    initial="hidden"
                    animate={cardRefs[0].inView ? "visible" : "hidden"}
                    transition={{ delay: 0.6 }}
                  >
                    Built-in risk management (30% stop-out level)
                  </FeatureItem>
                </FeatureList>
              </FeatureColumn>
            </CardContent>
            
            <HighlightBadge
              initial={{ opacity: 0, scale: 0.9 }}
              animate={cardRefs[0].inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h4>⚡ Key Advantage</h4>
              <p>Higher monthly returns with monthly compounding growth</p>
            </HighlightBadge>
          </InvestmentCard>

          {/* Physical Gold Investment */}
          <InvestmentCard
            ref={cardRefs[1].ref}
            variants={getCardVariants(1)}
            initial="hidden"
            animate={cardRefs[1].inView ? "visible" : "hidden"}
            whileHover={{ 
              y: -8,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
          >
            <CardHeader>
              <CardIcon>🏛️</CardIcon>
              <CardTitleSection>
                <CardTitle>Physical Gold Investment</CardTitle>
                <CardSubtitle>🔒 Stable & Zero-Risk</CardSubtitle>
              </CardTitleSection>
            </CardHeader>
            
            <CardContent>
              <FeatureColumn>
                <FeatureList>
                  <FeatureItem
                    variants={itemVariants}
                    initial="hidden"
                    animate={cardRefs[1].inView ? "visible" : "hidden"}
                    transition={{ delay: 0.3 }}
                  >
                    UAE-based with full legal compliance & security
                  </FeatureItem>
                  <FeatureItem
                    variants={itemVariants}
                    initial="hidden"
                    animate={cardRefs[1].inView ? "visible" : "hidden"}
                    transition={{ delay: 0.4 }}
                  >
                    Annual returns: 12–15% plus price appreciation
                  </FeatureItem>
                  <FeatureItem
                    variants={itemVariants}
                    initial="hidden"
                    animate={cardRefs[1].inView ? "visible" : "hidden"}
                    transition={{ delay: 0.5 }}
                  >
                    Minimum entry: 1 KG gold (institutional-grade access)
                  </FeatureItem>
                  <FeatureItem
                    variants={itemVariants}
                    initial="hidden"
                    animate={cardRefs[1].inView ? "visible" : "hidden"}
                    transition={{ delay: 0.6 }}
                  >
                    100% secure, tangible asset with zero risk
                  </FeatureItem>
                </FeatureList>
              </FeatureColumn>
            </CardContent>
            
            <HighlightBadge
              initial={{ opacity: 0, scale: 0.9 }}
              animate={cardRefs[1].inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h4>🛡️ Key Advantage</h4>
              <p>Complete security with tangible asset backing</p>
            </HighlightBadge>
          </InvestmentCard>
        </InvestmentOptions>
      </SectionContent>
    </InvestmentContainer>
  );
};

export default InvestmentOptionsSection;