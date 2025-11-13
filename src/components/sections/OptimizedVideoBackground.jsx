// OptimizedVideoBackground.jsx - Enhanced version with automatic optimization
'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import theme from '@/styles/theme';
import { getOptimalVideo } from '../utils/videoConfig';

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
  z-index: 3;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: ${theme.grid.containerWidth};
  padding: 0 ${theme.spacing.lg};
  position: relative;
  z-index: 4;
  color: white;
`;

const OptimizedVideoBackground = ({ 
  children, 
  videoType = 'heroVideo', // 'heroVideo' or 'secondaryVideo'
  customVideoSrc = null, // Override automatic selection
  customPosterImage = null,
  height, 
  overlay = 0.5,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  useCompressed = true // Set to false to use original videos
}) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  
  // Get optimal video configuration
  const optimalVideo = customVideoSrc ? 
    { videoSrc: customVideoSrc, posterImage: customPosterImage } : 
    getOptimalVideo(videoType, useCompressed);

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
        if (connection.effectiveType === '4g') {
          video.preload = 'metadata';
        } else if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          video.preload = 'none';
        } else {
          video.preload = 'metadata';
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
  }, [optimalVideo.videoSrc]);

  return (
    <VideoContainer 
      height={height}
      className={className}
    >
      {/* Poster image shown while video loads */}
      {optimalVideo.posterImage && (
        <PosterImage
          src={optimalVideo.posterImage}
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
        preload="none"
        disablePictureInPicture
        $videoLoaded={videoLoaded}
      >
        {/* Multiple sources for better compatibility */}
        {optimalVideo.lowQualityVideoSrc && (
          <source src={optimalVideo.lowQualityVideoSrc} type="video/mp4" media="(max-width: 768px)" />
        )}
        <source src={optimalVideo.videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </BackgroundVideo>
      
      <VideoOverlay overlay={overlay} />
      <ContentContainer>
        {children}
      </ContentContainer>
    </VideoContainer>
  );
};

export default OptimizedVideoBackground;