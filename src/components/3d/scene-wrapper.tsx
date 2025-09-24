"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';

interface SceneWrapperProps {
  children: React.ReactNode;
  className?: string;
  enableControls?: boolean;
}

export function SceneWrapper({ children, className = "", enableControls = false }: SceneWrapperProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          {children}
        </Suspense>
        
        {enableControls && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        )}
      </Canvas>
    </div>
  );
}