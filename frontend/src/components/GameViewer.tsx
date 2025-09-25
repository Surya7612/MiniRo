import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { GameObject } from '../types';

// Simple 3D object component
const GameObject3D: React.FC<{ object: GameObject }> = ({ object }) => {
  const renderObject = () => {
    const commonProps = {
      position: [object.position.x, object.position.y, object.position.z] as [number, number, number],
      rotation: [object.rotation.x, object.rotation.y, object.rotation.z] as [number, number, number],
      scale: [object.scale.x, object.scale.y, object.scale.z] as [number, number, number],
    };

    switch (object.type) {
      case 'cube':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case 'plane':
        return <planeGeometry args={[2, 2]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh {...{
      position: [object.position.x, object.position.y, object.position.z],
      rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
      scale: [object.scale.x, object.scale.y, object.scale.z],
    }}>
      {renderObject()}
      <meshStandardMaterial color={object.color} />
    </mesh>
  );
};

// Player component
const Player3D: React.FC<{ player: any }> = ({ player }) => (
  <group position={[player.position.x, player.position.y, player.position.z]}>
    <mesh>
      <capsuleGeometry args={[0.3, 1, 4, 8]} />
      <meshStandardMaterial color={player.color} />
    </mesh>
    <Text
      position={[0, 1.5, 0]}
      fontSize={0.3}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      {player.name}
    </Text>
  </group>
);

// Loading component
const LoadingFallback: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-white text-lg">Loading 3D scene...</div>
  </div>
);

const GameViewer: React.FC = () => {
  const { currentGame } = useGameStore();

  if (!currentGame) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0"
    >
      <div className="absolute top-4 left-4 z-10 glass p-4">
        <h2 className="text-white font-bold text-xl mb-2">{currentGame.name}</h2>
        <p className="text-white/80 text-sm mb-2">{currentGame.description}</p>
        <div className="flex items-center gap-4 text-white/60 text-sm">
          <span>Players: {currentGame.players.length}</span>
          <span>Status: {currentGame.status}</span>
        </div>
      </div>

      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [5, 5, 5], fov: 60 }}
          style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff6b6b" />
          
          <Environment preset="sunset" />
          
          {/* Render game objects */}
          {currentGame.gameObjects.map((object) => (
            <GameObject3D key={object.id} object={object} />
          ))}
          
          {/* Render players */}
          {currentGame.players.map((player) => (
            <Player3D key={player.id} player={player} />
          ))}
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={20}
          />
        </Canvas>
      </Suspense>
    </motion.div>
  );
};

export default GameViewer;
