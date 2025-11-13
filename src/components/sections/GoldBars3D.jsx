'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import theme from '@/styles/theme';
import * as THREE from 'three';

const Section3DContainer = styled.section`
  padding: 5rem 0;
  background-color: ${theme.colors.gray.light};
  overflow: hidden;
`;

const SectionContent = styled.div`
  max-width: ${theme.grid.containerWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  text-align: center;
`;

const SectionTitle = styled.h2`
  margin-bottom: ${theme.spacing.xl};
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

const CanvasContainer = styled.div`
  height: 400px;
  margin: 2rem 0;
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  position: relative;
  
  &:hover {
    cursor: grab;
  }
  
  &:active {
    cursor: grabbing;
  }
`;

const InstructionText = styled.p`
  margin-top: ${theme.spacing.md};
  color: ${theme.colors.gray.dark};
  font-style: italic;
`;

// Gold Bar mesh component
const GoldBar = ({ position, rotation, scale, onClick, index }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + index * 0.5) * 0.002;
      
      if (hovered) {
        meshRef.current.rotation.y += 0.01;
      }
    }
  });
  
  // Create gold material
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.8,
    roughness: 0.2,
    envMapIntensity: 1,
  });
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 0.5, 0.3]} />
      <primitive object={goldMaterial} attach="material" />
    </mesh>
  );
};

// Scene setup component
const GoldBarsScene = () => {
  const { camera } = useThree();
  const groupRef = useRef();
  const [scattered, setScattered] = useState(false);
  
  // Set initial camera position
  React.useEffect(() => {
    camera.position.set(0, 0, 5);
  }, [camera]);
  
  // Rotate the entire group
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });
  
  // Handle click to scatter/gather gold bars
  const handleClick = () => {
    setScattered(!scattered);
  };
  
  // Create multiple gold bars in a stack
  const goldBars = [
    { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
    { position: [0, 0.5, 0], rotation: [0, Math.PI / 6, 0], scale: [1, 1, 1] },
    { position: [0, 1.0, 0], rotation: [0, -Math.PI / 4, 0], scale: [1, 1, 1] },
    { position: [0, 1.5, 0], rotation: [0, Math.PI / 3, 0], scale: [1, 1, 1] },
  ];
  
  // Calculate scattered positions
  const scatteredPositions = [
    { position: [-2, 0, -1], rotation: [0.5, Math.PI / 3, 0.2], scale: [1, 1, 1] },
    { position: [2, 1, 1], rotation: [-0.3, Math.PI / 4, 0.1], scale: [1, 1, 1] },
    { position: [1, -1, 2], rotation: [0.2, -Math.PI / 2, 0.4], scale: [1, 1, 1] },
    { position: [-1, 2, 0], rotation: [-0.1, Math.PI, -0.3], scale: [1, 1, 1] },
  ];
  
  return (
    <group ref={groupRef}>
      {goldBars.map((bar, index) => (
        <GoldBar
          key={index}
          position={scattered ? scatteredPositions[index].position : bar.position}
          rotation={scattered ? scatteredPositions[index].rotation : bar.rotation}
          scale={bar.scale}
          onClick={handleClick}
          index={index}
        />
      ))}
      
      {/* Add a gold coin behind the bars, visible when scattered */}
      {scattered && (
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.1, 32]} />
          <meshStandardMaterial
            color={0xffd700}
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1}
          />
        </mesh>
      )}
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
    </group>
  );
};

const GoldBars3D = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1
  });
  
  return (
    <Section3DContainer ref={ref}>
      <SectionContent>
        <SectionTitle>Physical Gold Investment</SectionTitle>
        
        <CanvasContainer>
          {inView && (
            <Canvas>
              <GoldBarsScene />
            </Canvas>
          )}
        </CanvasContainer>
        
        <InstructionText>Click on the gold bars to see them scatter and reveal a gold coin</InstructionText>
      </SectionContent>
    </Section3DContainer>
  );
};

export default GoldBars3D;