"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingOrbProps {
  position: [number, number, number];
  color: string;
  speed?: number;
  distort?: number;
}

export function FloatingOrb({ position, color, speed = 1, distort = 0.3 }: FloatingOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const material = useMemo(() => ({
    color,
    transparent: true,
    opacity: 0.8,
    roughness: 0.1,
    metalness: 0.1,
  }), [color]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.5, 32, 32]}>
      <MeshDistortMaterial
        {...material}
        distort={distort}
        speed={2}
      />
    </Sphere>
  );
}