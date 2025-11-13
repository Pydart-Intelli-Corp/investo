'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import theme from '@/styles/theme';

const TestimonialSection = styled.section`
  padding: 5rem 0;
  background-color: ${theme.colors.white};
  overflow: hidden;
`;

const SectionContent = styled.div`
  max-width: ${theme.grid.containerWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  text-align: center;
`;

const SectionTitle = styled(motion.h2)`
  margin-bottom: ${theme.spacing.xxl};
  color: ${theme.colors.secondary};
  position: relative;
  display: inline-block;
  
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

const CarouselContainer = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 800px;
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: ${theme.colors.primary};
  color: ${theme.colors.secondary};
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: ${theme.shadows.medium};
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: ${theme.shadows.gold};
  }
  
  &.prev {
    left: -20px;
  }
  
  &.next {
    right: -20px;
  }
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const TestimonialCard = styled(motion.div)`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.medium};
  text-align: left;
  z-index: 1;
  margin: 0;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
`;

const TestimonialQuote = styled.p`
  font-size: ${theme.fontSizes.medium};
  color: ${theme.colors.secondary};
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.7;
  position: relative;
  padding-left: ${theme.spacing.lg};
  
  &:before {
    content: '"';
    position: absolute;
    left: 0;
    top: 0;
    font-size: 4rem;
    line-height: 1;
    color: ${theme.colors.primary};
    opacity: 0.3;
    font-family: serif;
  }
`;

const ClientInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ClientImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: ${theme.spacing.md};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border: 2px solid ${theme.colors.primary};
`;

const ClientDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ClientName = styled.h4`
  font-weight: ${theme.fontWeights.semiBold};
  margin-bottom: 5px;
`;

const ClientPosition = styled.p`
  font-size: ${theme.fontSizes.small};
  color: ${theme.colors.gray.dark};
`;

const BackgroundImage = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  filter: blur(5px);
  border-radius: ${theme.borderRadius.medium};
`;

const StarsContainer = styled(motion.div)`
  display: flex;
  margin-bottom: ${theme.spacing.md};
`;

const Star = styled.div`
  color: ${theme.colors.primary};
  font-size: 20px;
  margin-right: 2px;
`;

const DotIndicators = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${theme.spacing.xl};
`;

const Dot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props['data-active'] === 'true' ? theme.colors.primary : theme.colors.gray.light};
  border: none;
  margin: 0 6px;
  cursor: pointer;
  transition: background-color ${theme.transitions.default};
  
  &:hover {
    background-color: ${props => props['data-active'] === 'true' ? theme.colors.primary : theme.colors.gray.medium};
  }
`;

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Testimonial data
  const testimonials = [
    {
      quote: "Investing in gold trading gave me consistent returns and financial stability. A safe choice I trust for my family's future",
      name: "Deepa Ramesh",
      position: "Cochin",
      image: "/images/financial-consultation.webp",
      rating: 5
    },
    {
      quote: "Gold has always been close to our culture, but digital trading opened new opportunities for me with steady monthly profits.",
      name: "Vishnu Prasad",
      position: "Bangalore",
      image: "/images/business-meeting-uae.webp",
      rating: 5
    },
    {
      quote: "With transparent systems and reliable support, gold trading has become my most secure and rewarding investment option.",
      name: "Marina Joseph",
      position: "Pune",
      image: "/images/professionals-consulting.webp",
      rating: 5
    },
    {
      quote: "I appreciate the balance of high returns and safety. Gold trading gave me both growth and peace of mind.",
      name: "Nithya",
      position: "Hyderabad",
      image: "/images/meeting-uae.webp",
      rating: 5
    }
  ];
  
  // Animation variants
  const cardVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      position: 'absolute'
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'absolute',
      zIndex: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      position: 'absolute'
    })
  };
  
  const bgImageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 0.1 },
    exit: { opacity: 0 }
  };
  
  const starsVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const starVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 10
      }
    }
  };
  
  // Navigate to next testimonial
  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  // Navigate to previous testimonial
  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  // Navigate to specific testimonial by index
  const goToTestimonial = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };
  
  // Auto-play testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);
  
  return (
    <TestimonialSection ref={ref}>
      <SectionContent>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Testimonials
        </SectionTitle>
        
        <CarouselContainer>
          <CarouselButton className="prev" onClick={prevTestimonial}>
            &#8592;
          </CarouselButton>
          
          <div style={{ position: 'relative', height: '400px' }}>
            <AnimatePresence custom={direction} initial={false}>
              <TestimonialCard
                key={currentIndex}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                style={{ position: 'absolute', width: '100%' }}
              >
                <BackgroundImage 
                  src={testimonials[currentIndex].image}
                  variants={bgImageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                />
                
                <StarsContainer
                  variants={starsVariants}
                  initial="initial"
                  animate="animate"
                >
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} variants={starVariants}>★</Star>
                  ))}
                  {[...Array(5 - testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i + testimonials[currentIndex].rating} style={{ color: theme.colors.gray.light }}>★</Star>
                  ))}
                </StarsContainer>
                
                <TestimonialQuote>
                  {testimonials[currentIndex].quote}
                </TestimonialQuote>
                
                <ClientInfo>
                  <ClientImage src={testimonials[currentIndex].image} />
                  <ClientDetails>
                    <ClientName>{testimonials[currentIndex].name}</ClientName>
                    <ClientPosition>{testimonials[currentIndex].position}</ClientPosition>
                  </ClientDetails>
                </ClientInfo>
              </TestimonialCard>
            </AnimatePresence>
          </div>
          
          <CarouselButton className="next" onClick={nextTestimonial}>
            &#8594;
          </CarouselButton>
        </CarouselContainer>
        
        <DotIndicators>
          {testimonials.map((_, index) => (
            <Dot 
              key={index}
              data-active={(index === currentIndex).toString()}
              onClick={() => goToTestimonial(index)}
            />
          ))}
        </DotIndicators>
      </SectionContent>
    </TestimonialSection>
  );
};

export default TestimonialCarousel;