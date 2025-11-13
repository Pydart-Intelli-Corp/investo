'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import theme from '@/styles/theme';

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const PosterImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  transition: opacity 0.3s ease-in-out;
  opacity: ${props => props.$show ? 1 : 0};
`;

const VideoContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  min-height: ${props => props.height || '100vh'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const BackgroundVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
  transition: opacity 0.5s ease-in-out;
  opacity: ${props => props.$videoLoaded ? 1 : 0};
  
  /* Ensure video loads and plays properly */
  &::-webkit-media-controls {
    display: none !important;
  }
  
  &::-webkit-media-controls-enclosure {
    display: none !important;
  }
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, ${props => props.overlay || 0.5});
  z-index: 2;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: ${theme.grid.containerWidth};
  padding: 0 ${theme.spacing.lg};
  position: relative;
  z-index: 3;
  color: white;
`;

const VideoBackground = ({ 
  children, 
  videoSrc, 
  height, 
  overlay = 0.5,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  posterImage = null, // New prop for poster image
  lowQualityVideoSrc = null // New prop for low quality version
}) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [videoLoaded, setVideoLoaded] = React.useState(false);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Set video properties for faster loading
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      
      // Preload strategy based on connection
      if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === '4g' || connection.effectiveType === 'slow-2g') {
          video.preload = 'none'; // Don't preload on slow connections
        } else {
          video.preload = 'metadata'; // Preload metadata only
        }
      }
      
      // Try to play the video
      const playVideo = async () => {
        try {
          await video.play();
          setVideoLoaded(true);
        } catch (error) {
          console.log('Video autoplay failed:', error);
        }
      };

      // Handle video events for performance
      const handleLoadStart = () => {
        setIsLoading(true);
      };

      const handleCanPlay = () => {
        setIsLoading(false);
        playVideo();
      };

      const handleLoadedData = () => {
        setIsLoading(false);
        playVideo();
      };

      const handleError = (e) => {
        console.error('Video loading error:', e);
        setIsLoading(false);
      };

      // Handle user interaction to start video if autoplay failed
      const handleUserInteraction = () => {
        if (video.paused) {
          playVideo();
        }
      };

      // Add event listeners
      video.addEventListener('loadstart', handleLoadStart);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
      
      // Add user interaction listeners as fallback
      document.addEventListener('click', handleUserInteraction, { once: true });
      document.addEventListener('touchstart', handleUserInteraction, { once: true });

      // Use Intersection Observer for lazy loading
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Start loading video when it comes into view
            if (video.readyState === 0) {
              video.load();
            }
            playVideo();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(video);

      // Cleanup
      return () => {
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
        observer.disconnect();
      };
    }
  }, [videoSrc]);

  return (
    <VideoContainer 
      height={height}
      className={className}
    >
      {/* Poster image shown while video loads */}
      {posterImage && (
        <PosterImage
          src={posterImage}
          alt="Video poster"
          $show={!videoLoaded}
        />
      )}
      
      {/* Loading spinner */}
      {isLoading && !videoLoaded && <LoadingSpinner />}
      
      {/* Main video */}
      <BackgroundVideo
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none" // Will be dynamically set based on connection
        disablePictureInPicture
        $videoLoaded={videoLoaded}
      >
        {/* Use multiple sources for better compatibility and fallback */}
        {lowQualityVideoSrc && (
          <source src={lowQualityVideoSrc} type="video/mp4" media="(max-width: 768px)" />
        )}
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </BackgroundVideo>
      
      <VideoOverlay overlay={overlay} />
      <ContentContainer>
        {children}
      </ContentContainer>
    </VideoContainer>
  );
};

export default VideoBackground;