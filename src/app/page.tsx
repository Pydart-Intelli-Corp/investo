'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import loading spinner
const LoadingSpinner = dynamic(() => import('@/components/sections/LoadingSpinner'), { ssr: false });

// Import Navigation and Footer
const Navigation = dynamic(() => import('@/components/sections/Navigation'), { ssr: false });
const Footer = dynamic(() => import('@/components/sections/Footer'), { ssr: true });

// Import sections dynamically
const HeroSection = dynamic(() => import('@/components/sections/HeroSection'), { ssr: true });
const BenefitsSection = dynamic(() => import('@/components/sections/BenefitsSection'), { ssr: true });
const InvestmentOptions = dynamic(() => import('@/components/sections/InvestmentOptions'), { ssr: true });
const StatsCounter = dynamic(() => import('@/components/sections/StatsCounter'), { ssr: true });
const TestimonialCarousel = dynamic(() => import('@/components/sections/TestimonialCarousel'), { ssr: true });
const CallToActionSection = dynamic(() => import('@/components/sections/CallToActionSection'), { ssr: true });
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'), { ssr: true });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('investogold_visited');
    
    if (hasVisited) {
      // Not first visit, skip splash screen
      setIsLoading(false);
      return;
    }
    
    // First visit - show splash screen
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      // Mark as visited
      localStorage.setItem('investogold_visited', 'true');
    }, 2500); // 2.5 seconds loading time

    return () => {
      clearTimeout(loadingTimer);
    };
  }, []);

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      
      <Navigation />
      <main className="min-h-screen bg-black">
        <HeroSection />
        <BenefitsSection />
        <InvestmentOptions />
        <StatsCounter />
        <TestimonialCarousel />
        <CallToActionSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
