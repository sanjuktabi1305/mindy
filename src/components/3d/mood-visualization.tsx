"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Mood } from '@/lib/types';

interface MoodVisualizationProps {
  mood: Mood;
  intensity?: number;
}

export function MoodVisualization({ mood, intensity = 1 }: MoodVisualizationProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const moodConfig = useMemo(() => {
    switch (mood) {
      case 'happy':
        return {
          color: '#FFD700',
          particles: 20,
          radius: 2,
          text: '😊',
        };
      case 'neutral':
        return {
          color: '#87CEEB',
          particles: 10,
          radius: 1.5,
          text: '😐',
        };
      case 'sad':
        return {
          color: '#4682B4',
          particles: 5,
          radius: 1,
          text: '😢',
        };
      default:
        return {
          color: '#87CEEB',
          particles: 10,
          radius: 1.5,
          text: '😐',
        };
    }
  }, [mood]);

  const particles = useMemo(() => {
    return Array.from({ length: moodConfig.particles }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.1,
    }));
  }, [moodConfig.particles]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.position.y += Math.sin(state.clock.elapsedTime + i) * 0.01;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <Text
        position={[0, 0, 0]}
        fontSize={2}
        color={moodConfig.color}
        anchorX="center"
        anchorY="middle"
      >
        {moodConfig.text}
      </Text>
      {particles.map((particle) => (
        <Sphere
          key={particle.id}
          position={particle.position}
          args={[particle.scale, 8, 8]}
        >
          <meshStandardMaterial
            color={moodConfig.color}
            transparent
            opacity={0.6 * intensity}
            emissive={moodConfig.color}
            emissiveIntensity={0.2}
          />
        </Sphere>
      ))}
    </group>
  );
}