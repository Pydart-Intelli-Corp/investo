'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

/**
 * A utility function that creates a styled motion component with proper ref forwarding
 * @param {string} elementType - The HTML element type ('div', 'button', 'a', etc)
 * @returns {StyledComponent} A styled motion component with ref forwarding
 */
export const createStyledMotionComponent = (elementType) => {
  // Create a motion component with the specified element type
  const MotionComponent = motion[elementType];
  
  // Return a styled component that properly forwards refs
  return styled(MotionComponent)``;
};

export default createStyledMotionComponent;