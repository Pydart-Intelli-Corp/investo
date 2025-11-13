'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import theme from '@/styles/theme';

const FAQSectionContainer = styled.section`
  padding: 5rem 0;
  background-color: ${theme.colors.gray.light};
`;

const SectionContent = styled.div`
  max-width: ${theme.grid.containerWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  margin-bottom: ${theme.spacing.xxl};
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

const FAQContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const FAQItem = styled(motion.div)`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${theme.shadows.small};
`;

const FAQQuestion = styled.button`
  width: 100%;
  text-align: left;
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.cardBackground};
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: ${theme.fontSizes.medium};
  font-weight: ${theme.fontWeights.semiBold};
  color: #FFFFFF !important;
  transition: ${theme.transitions.default};
  
  &:hover {
    background-color: ${theme.colors.surface};
    color: #FFFFFF !important;
  }
`;

const FAQAnswer = styled(motion.div)`
  padding: 0 ${theme.spacing.lg};
  color: ${theme.colors.gray.dark};
  font-size: ${theme.fontSizes.base};
  line-height: 1.6;
`;

const AnswerContent = styled.div`
  padding-bottom: ${theme.spacing.lg};
`;

const CheckmarkIcon = styled(motion.span)`
  color: ${theme.colors.primary};
  font-size: 1.5rem;
`;

const PlusIcon = styled.span`
  font-size: 1.5rem;
  transition: ${theme.transitions.default};
  transform: ${props => props['data-isopen'] === 'true' ? 'rotate(45deg)' : 'rotate(0)'};
`;

const SectionIntro = styled(motion.p)`
  text-align: center;
  max-width: 700px;
  margin: 0 auto ${theme.spacing.xxl};
  color: ${theme.colors.gray.dark};
  font-size: ${theme.fontSizes.medium};
  line-height: 1.6;
`;

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // FAQ data
  const faqs = [
    {
      question: "How does Investo Gold's AI trading strategy work?",
      answer: "Our proprietary AI system analyzes millions of data points across global gold markets to identify optimal trading opportunities. It combines technical analysis, sentiment analysis, and macroeconomic indicators to execute trades with precision timing and risk management."
    },
    {
      question: "What are the minimum investment requirements?",
      answer: "We offer flexible investment options starting from $10,000 for our digital gold trading program. For physical gold investments, minimums start at $25,000. We also provide custom portfolio solutions for investments exceeding $100,000."
    },
    {
      question: "How can I track my investment performance?",
      answer: "All investors receive access to our secure client portal where you can monitor your investment performance in real-time. We also provide detailed monthly reports and quarterly strategy reviews with our investment specialists."
    },
    {
      question: "Is my investment secure with Investo Gold?",
      answer: "Absolutely. For digital gold investments, we implement rigorous risk management protocols and never risk more than 2% of capital on any single trade. Physical gold investments are stored in high-security, fully insured vaults with optional personal storage solutions available."
    },
    {
      question: "Can I withdraw my investment at any time?",
      answer: "Yes, our investment plans offer liquidity with a standard 30-day notice period. Physical gold investments can be liquidated or delivered according to your preference. Emergency withdrawals can be accommodated with minimal processing fees."
    },
    {
      question: "What makes Investo Gold different from other gold investment firms?",
      answer: "Our combination of cutting-edge AI trading technology, traditional gold investment expertise, and personalized consultation sets us apart. We're the only gold investment firm offering a unified approach to both digital and physical gold assets with proven returns exceeding market averages."
    }
  ];
  
  // Toggle FAQ open/closed
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };
  
  const checkmarkVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 15
      }
    }
  };
  
  return (
    <FAQSectionContainer>
      <SectionContent>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Frequently Asked Questions
        </SectionTitle>
        
        <SectionIntro
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Get answers to the most common questions about investing with Investo Gold. 
          If you don't find what you're looking for, our team is always available for personalized assistance.
        </SectionIntro>
        
        <FAQContainer
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              variants={itemVariants}
            >
              <FAQQuestion 
                onClick={() => toggleFAQ(index)}
                aria-expanded={openFAQ === index}
              >
                {faq.question}
                {openFAQ === index ? (
                  <CheckmarkIcon
                    variants={checkmarkVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    ✓
                  </CheckmarkIcon>
                ) : (
                  <PlusIcon data-isopen={(openFAQ === index).toString()}>+</PlusIcon>
                )}
              </FAQQuestion>
              
              <AnimatePresence>
                {openFAQ === index && (
                  <FAQAnswer
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: 'auto', 
                      opacity: 1,
                      transition: {
                        height: {
                          duration: 0.3
                        },
                        opacity: {
                          duration: 0.25,
                          delay: 0.15
                        }
                      }
                    }}
                    exit={{ 
                      height: 0, 
                      opacity: 0,
                      transition: {
                        height: {
                          duration: 0.3
                        },
                        opacity: {
                          duration: 0.25
                        }
                      }
                    }}
                  >
                    <AnswerContent>
                      {faq.answer}
                    </AnswerContent>
                  </FAQAnswer>
                )}
              </AnimatePresence>
            </FAQItem>
          ))}
        </FAQContainer>
      </SectionContent>
    </FAQSectionContainer>
  );
};

export default FAQSection;