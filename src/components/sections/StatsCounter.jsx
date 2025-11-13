'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import theme from '@/styles/theme';

const StatsCounterContainer = styled.section`
  padding: 4rem 0;
  background-color: ${theme.colors.secondary};
  color: ${theme.colors.white};
`;

const StatsContent = styled.div`
  max-width: ${theme.grid.containerWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.xl} ${theme.spacing.md};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled(motion.div)`
  text-align: center;
  padding: ${theme.spacing.lg};
  
  &:hover .stat-number {
    color: ${theme.colors.primary};
  }
`;

const StatNumber = styled.div`
  font-size: ${theme.fontSizes.xxlarge};
  font-weight: ${theme.fontWeights.bold};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.white};
  transition: ${theme.transitions.default};
`;

const StatLabel = styled.div`
  font-size: ${theme.fontSizes.medium};
  font-weight: ${theme.fontWeights.medium};
`;

// Function to animate counting from 0 to target number
const CountUp = ({ end, duration = 2000, className }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const countUp = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      // Calculate current count based on progress
      const currentCount = Math.min(
        Math.floor((progress / duration) * end),
        end
      );
      
      setCount(currentCount);
      
      if (progress < duration) {
        animationFrame = requestAnimationFrame(countUp);
      }
    };
    
    animationFrame = requestAnimationFrame(countUp);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return <span className={className}>{count}</span>;
};

const StatsCounter = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const statsData = [
    { number: 100, suffix: "+", label: "Happy Clients" },
    { number: 5, suffix: "+", label: "Years of experience with proud" },
    { number: 1, suffix: "M +", label: "Revenue in 2017 investment" },
    { number: 1520, suffix: "+", label: "Colleagues & counting more daily" }
  ];
  
  return (
    <StatsCounterContainer>
      <StatsContent>
        <StatsGrid ref={ref}>
          {statsData.map((stat, index) => (
            <StatItem
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <StatNumber className="stat-number">
                {inView ? (
                  <>
                    <CountUp end={stat.number} duration={2000} />
                    {stat.suffix}
                  </>
                ) : (
                  `0${stat.suffix}`
                )}
              </StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatsGrid>
      </StatsContent>
    </StatsCounterContainer>
  );
};

export default StatsCounter;