import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useGameplayStore } from '../stores/gameplayStore';
import { useSocket } from '../hooks/useSocket';
import { GameObject, Vector3 } from '../types';
import AssetSelector from './AssetSelector';
import GameStatsCard from './GameStatsCard';
import { assetService } from '../services/assetService';
import { Image, BarChart3 } from 'lucide-react';
import * as THREE from 'three';

// Player component with physics and controls
const Player: React.FC<{ 
  position: Vector3; 
  onPositionChange: (position: Vector3) => void;
  onCollision: (objectId: string, objectType: string) => void;
}> = ({ position, onPositionChange, onCollision }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const isGroundedRef = useRef(false);
  const keysRef = useRef<Set<string>>(new Set());
  
  const { camera } = useThree();

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysRef.current.add(event.code);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Physics and movement
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const keys = keysRef.current;
    const velocity = velocityRef.current;
    const mesh = meshRef.current;

    // Gravity
    if (!isGroundedRef.current) {
      velocity.y -= 9.8 * delta;
    }

    // Movement
    const moveSpeed = 5;
    const jumpForce = 8;

    if (keys.has('KeyW') || keys.has('ArrowUp')) {
      velocity.z -= moveSpeed * delta;
    }
    if (keys.has('KeyS') || keys.has('ArrowDown')) {
      velocity.z += moveSpeed * delta;
    }
    if (keys.has('KeyA') || keys.has('ArrowLeft')) {
      velocity.x -= moveSpeed * delta;
    }
    if (keys.has('KeyD') || keys.has('ArrowRight')) {
      velocity.x += moveSpeed * delta;
    }

    // Jump
    if ((keys.has('Space') || keys.has('KeyW')) && isGroundedRef.current) {
      velocity.y = jumpForce;
      isGroundedRef.current = false;
    }

    // Apply velocity
    mesh.position.add(velocity.clone().multiplyScalar(delta));

    // Ground collision (simple)
    if (mesh.position.y <= 1) {
      mesh.position.y = 1;
      velocity.y = 0;
      isGroundedRef.current = true;
    }

    // Update position
    onPositionChange({
      x: mesh.position.x,
      y: mesh.position.y,
      z: mesh.position.z
    });

    // Update camera to follow player
    camera.position.set(
      mesh.position.x,
      mesh.position.y + 3,
      mesh.position.z + 5
    );
    camera.lookAt(mesh.position);

    // Reset velocity for next frame
    velocity.x *= 0.9; // Friction
    velocity.z *= 0.9;
  });

  return (
    <mesh ref={meshRef} position={[position.x, position.y, position.z]}>
      <capsuleGeometry args={[0.3, 1, 4, 8]} />
      <meshStandardMaterial color="#4ecdc4" />
    </mesh>
  );
};

// Game object component with collision detection
const GameObject3D: React.FC<{ 
  object: GameObject; 
  onCollision: (objectId: string, objectType: string) => void;
  playerPosition: Vector3;
}> = ({ object, onCollision, playerPosition }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;

    // Simple collision detection
    const distance = meshRef.current.position.distanceTo(
      new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z)
    );

    if (distance < 1.5) {
      onCollision(object.id, object.type);
    }
  });

  const renderObject = () => {
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
    <mesh 
      ref={meshRef}
      position={[object.position.x, object.position.y, object.position.z]}
      rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
      scale={[object.scale.x, object.scale.y, object.scale.z]}
    >
      {renderObject()}
      <meshStandardMaterial color={object.color} />
    </mesh>
  );
};

// Goal object with special behavior
const GoalObject: React.FC<{ 
  position: Vector3; 
  onReach: () => void;
  playerPosition: Vector3;
}> = ({ position, onReach, playerPosition }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Rotate the goal
    meshRef.current.rotation.y += 0.01;

    // Check if player reached goal
    const distance = meshRef.current.position.distanceTo(
      new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z)
    );

    if (distance < 2) {
      onReach();
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
    </mesh>
  );
};

// Game UI overlay
const GameUI: React.FC<{
  gameLogic: any;
  score: number;
  timeLeft: number;
  gameStatus: string;
}> = ({ gameLogic, score, timeLeft, gameStatus }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Game Info */}
      <div className="absolute top-4 left-4 glass p-4 pointer-events-auto">
        <h2 className="text-white font-bold text-lg mb-2">Objective</h2>
        <p className="text-white/80 text-sm mb-2">{gameLogic.objective}</p>
        
        <div className="space-y-1 text-white/60 text-xs">
          <div>Score: {score}</div>
          {timeLeft > 0 && <div>Time: {Math.max(0, timeLeft)}s</div>}
          <div>Status: {gameStatus}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 glass p-4 pointer-events-auto">
        <h3 className="text-white font-medium text-sm mb-2">Controls</h3>
        <div className="space-y-1 text-white/60 text-xs">
          {gameLogic.controls.map((control: string, index: number) => (
            <div key={index}>{control}</div>
          ))}
        </div>
      </div>

      {/* Win/Lose Message */}
      {gameStatus === 'won' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="glass p-8 text-center">
            <h2 className="text-green-400 font-bold text-3xl mb-4">🎉 You Won!</h2>
            <p className="text-white/80">Congratulations! You completed the objective!</p>
          </div>
        </motion.div>
      )}

      {gameStatus === 'lost' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="glass p-8 text-center">
            <h2 className="text-red-400 font-bold text-3xl mb-4">💥 Game Over</h2>
            <p className="text-white/80">Better luck next time!</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const PlayableGame: React.FC = () => {
  const { currentGame, updateGame } = useGameStore();
  const { updatePlayerPosition, sendGameEvent } = useSocket();
  const {
    playerPosition,
    score,
    timeLeft,
    gameStatus,
    collectedItems,
    setPlayerPosition,
    setScore,
    setTimeLeft,
    setGameStatus,
    addCollectedItem,
    resetGame
  } = useGameplayStore();

  // Asset and stats state
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Initialize game state
  useEffect(() => {
    if (currentGame?.gameLogic) {
      setPlayerPosition(currentGame.gameLogic.playerStartPosition);
      setTimeLeft(currentGame.gameLogic.timeLimit || 0);
      setGameStatus('playing');
      setScore(0);
      resetGame();
    }
  }, [currentGame, setPlayerPosition, setTimeLeft, setGameStatus, setScore, resetGame]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && gameStatus === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameStatus('lost');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, gameStatus]);

  const handlePositionChange = useCallback((position: Vector3) => {
    setPlayerPosition(position);
    
    // Update server with player position
    if (currentGame) {
      updatePlayerPosition(currentGame.id, position, { x: 0, y: 0, z: 0 });
    }
  }, [currentGame, updatePlayerPosition]);

  const handleCollision = useCallback((objectId: string, objectType: string) => {
    // Handle different collision types
    if (objectType === 'collectible' && !collectedItems.has(objectId)) {
      addCollectedItem(objectId);
      setScore(score + 10);
      
      // Send game event to server
      if (currentGame) {
        sendGameEvent(currentGame.id, 'item_collect', { itemId: objectId, score: score + 10 });
      }
    }
  }, [collectedItems, addCollectedItem, score, setScore, currentGame, sendGameEvent]);

  const handleGoalReach = useCallback(() => {
    setGameStatus('won');
    updateGame({ status: 'ended' });
    
    // Send win event to server
    if (currentGame) {
      sendGameEvent(currentGame.id, 'player_win', { score, timeLeft });
    }
  }, [setGameStatus, updateGame, currentGame, sendGameEvent, score, timeLeft]);

  // Asset handling functions
  const handleSelectAsset = useCallback(async (assetId: string) => {
    if (!currentGame) return;
    
    const result = await assetService.selectAsset({
      gameId: currentGame.id,
      assetId
    });
    
    if (result.success && result.game) {
      updateGame(result.game);
    }
  }, [currentGame, updateGame]);

  const handleGenerateAsset = useCallback(async (assetType: 'background' | 'sprite', style?: string, theme?: string) => {
    if (!currentGame) return;
    
    const result = await assetService.generateAssets({
      gameId: currentGame.id,
      assetType,
      style,
      theme
    });
    
    if (result.success && result.game) {
      updateGame(result.game);
    }
  }, [currentGame, updateGame]);

  if (!currentGame?.gameLogic) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0"
    >
      {/* Game Stats Card */}
      <GameStatsCard
        analytics={currentGame.analytics}
        isVisible={showStats}
        onToggle={() => setShowStats(!showStats)}
      />

      {/* Asset Selector Button */}
      <div className="fixed top-4 left-4 z-40">
        <motion.button
          onClick={() => setShowAssetSelector(true)}
          className="btn btn-secondary flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image className="w-4 h-4" />
          Assets
        </motion.button>
      </div>

      <GameUI 
        gameLogic={currentGame.gameLogic}
        score={score}
        timeLeft={timeLeft}
        gameStatus={gameStatus}
      />

      <Canvas
        camera={{ position: [5, 5, 5], fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff6b6b" />
        
        <Environment preset="sunset" />
        
        {/* Player */}
        <Player 
          position={playerPosition}
          onPositionChange={handlePositionChange}
          onCollision={handleCollision}
        />
        
        {/* Goal */}
        <GoalObject 
          position={currentGame.gameLogic.goalPosition}
          onReach={handleGoalReach}
          playerPosition={playerPosition}
        />
        
        {/* Game Objects */}
        {currentGame.gameObjects.map((object) => (
          <GameObject3D 
            key={object.id} 
            object={object} 
            onCollision={handleCollision}
            playerPosition={playerPosition}
          />
        ))}
        
        {/* Other Players */}
        {currentGame.players.map((player) => (
          <group key={player.id} position={[player.position.x, player.position.y, player.position.z]}>
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
        ))}
      </Canvas>

      {/* Asset Selector Modal */}
      <AssetSelector
        isOpen={showAssetSelector}
        onClose={() => setShowAssetSelector(false)}
        gameId={currentGame.id}
        assets={currentGame.assets || []}
        selectedAsset={currentGame.selectedAsset}
        onSelectAsset={handleSelectAsset}
        onGenerateAsset={handleGenerateAsset}
      />
    </motion.div>
  );
};

export default PlayableGame;
