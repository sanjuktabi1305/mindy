"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus, Text } from '@react-three/drei';
import * as THREE from 'three';

interface ProgressRingProps {
  progress: number; // 0 to 1
  radius?: number;
  thickness?: number;
  color?: string;
  label?: string;
}

export function ProgressRing({ 
  progress, 
  radius = 1, 
  thickness = 0.1, 
  color = '#78A0D3',
  label 
}: ProgressRingProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const backgroundRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current && backgroundRingRef.current) {
      const rotation = -Math.PI / 2 + (progress * Math.PI * 2);
      ringRef.current.rotation.z = rotation;
      
      // Subtle floating animation
      const float = Math.sin(state.clock.elapsedTime) * 0.05;
      ringRef.current.position.y = float;
      backgroundRingRef.current.position.y = float;
    }
  });

  return (
    <group>
      {/* Background ring */}
      <Torus
        ref={backgroundRingRef}
        args={[radius, thickness, 16, 100]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <meshStandardMaterial
          color="#E5E7EB"
          transparent
          opacity={0.3}
        />
      </Torus>
      
      {/* Progress ring */}
      <Torus
        ref={ringRef}
        args={[radius, thickness, 16, Math.max(1, Math.floor(100 * progress))]}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Torus>
      
      {label && (
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.3}
          color={color}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {label}
        </Text>
      )}
    </group>
  );
}