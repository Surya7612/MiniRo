import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { modelService, ModelConfig } from '../services/modelService';
import LoadingSpinner from './LoadingSpinner';

interface Model3DProps {
  gameType: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  animated?: boolean;
  onClick?: () => void;
}

const Model3D: React.FC<Model3DProps> = ({ 
  gameType, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  animated = true,
  onClick 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const config = modelService.getModelForGameType(gameType);
        const loadedModel = await modelService.loadModel(config);
        
        setModel(loadedModel);
      } catch (err) {
        console.error('Failed to load 3D model:', err);
        setError('Failed to load model');
        
        // Fallback to basic geometry
        const fallbackGroup = new THREE.Group();
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ 
          color: '#4A90E2',
          metalness: 0.8,
          roughness: 0.2
        });
        const mesh = new THREE.Mesh(geometry, material);
        fallbackGroup.add(mesh);
        setModel(fallbackGroup);
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, [gameType]);

  useFrame((state) => {
    if (groupRef.current && animated) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Slow rotation
      groupRef.current.rotation.y += 0.005;
    }
  });

  if (loading) {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        {/* Loading placeholder */}
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#666666" transparent opacity={0.5} />
        </mesh>
      </group>
    );
  }

  if (error || !model) {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        {/* Error placeholder */}
        <mesh onClick={onClick}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
      </group>
    );
  }

  return (
    <group 
      ref={groupRef}
      position={position} 
      rotation={rotation} 
      scale={scale}
      onClick={onClick}
    >
      <primitive object={model.clone()} />
    </group>
  );
};

export default Model3D;
