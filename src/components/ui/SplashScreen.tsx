'use client';
import React from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isHidden, setIsHidden] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsHidden(true);
      setTimeout(() => onComplete(), 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <>
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .dot-1 {
          animation: bounce 1.4s infinite ease-in-out both;
          animation-delay: -0.32s;
        }
        .dot-2 {
          animation: bounce 1.4s infinite ease-in-out both;
          animation-delay: -0.16s;
        }
        .dot-3 {
          animation: bounce 1.4s infinite ease-in-out both;
          animation-delay: 0s;
        }
      `}</style>
      
      <div 
        className={`fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center z-[9999] transition-all duration-500 ease-out ${
          isHidden ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'
        }`}
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
        }}
      >
        <div className="mb-8 text-center">
          <Image 
            src="/images/logo.webp" 
            alt="Investo Gold" 
            width={120}
            height={40}
            className="mb-4 mx-auto"
            style={{
              width: '120px',
              height: 'auto',
              filter: 'drop-shadow(0 4px 8px rgba(255, 215, 0, 0.3))'
            }}
          />
          <p className="text-[#FFD700] text-[18px] font-semibold mt-2 tracking-normal">
            Trusted Gold Investment Partner
          </p>
        </div>
        
        <div className="flex gap-2 mt-6">
          <div 
            className="dot-1 w-4 h-4 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #ffd700 100%)',
              boxShadow: '0 4px 8px rgba(255, 215, 0, 0.4)'
            }}
          />
          <div 
            className="dot-2 w-4 h-4 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #ffd700 100%)',
              boxShadow: '0 4px 8px rgba(255, 215, 0, 0.4)'
            }}
          />
          <div 
            className="dot-3 w-4 h-4 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #ffd700 100%)',
              boxShadow: '0 4px 8px rgba(255, 215, 0, 0.4)'
            }}
          />
        </div>
        
        <p className="text-[#2a2a2a] text-[14px] mt-6 font-medium" style={{ letterSpacing: '0.5px' }}>
          Loading your investment opportunity...
        </p>
      </div>
    </>
  );
};

export default SplashScreen;