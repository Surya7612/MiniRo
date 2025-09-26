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
import GameCustomizer from './GameCustomizer';
// import Model3D from './Model3D'; // Temporarily disabled to fix crashes
import { assetService } from '../services/assetService';
import { Image, BarChart3, Settings } from 'lucide-react';
import * as THREE from 'three';
// Note: Physics will be implemented with basic collision detection for now


// Player component with physics and controls
// Game-specific control handler
const useGameControls = (gameType: string, gameLogic: any) => {
  const keysRef = useRef<Set<string>>(new Set());
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysRef.current.add(event.code);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.code);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (mouseRef.current.isDown) {
        mouseRef.current.x += event.movementX * 0.002;
        mouseRef.current.y += event.movementY * 0.002;
      }
    };

    const handleMouseDown = () => {
      mouseRef.current.isDown = true;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return { keysRef, mouseRef };
};

const Player: React.FC<{ 
  position: Vector3; 
  onPositionChange: (position: Vector3) => void;
  onCollision: (objectId: string, objectType: string) => void;
  gameType: string;
  gameLogic: any;
}> = ({ position, onPositionChange, onCollision, gameType, gameLogic }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const isGroundedRef = useRef(false);
  const { keysRef, mouseRef } = useGameControls(gameType, gameLogic);
  
  const { camera } = useThree();

  // Determine game type from game name/description
  const getGameType = (gameLogic: any) => {
    const name = gameLogic.objective?.toLowerCase() || '';
    if (name.includes('tic-tac-toe') || name.includes('tic tac toe')) return 'tic-tac-toe';
    if (name.includes('racing') || name.includes('race')) return 'racing';
    if (name.includes('space') || name.includes('spaceship')) return 'space';
    if (name.includes('airplane') || name.includes('flight')) return 'airplane';
    if (name.includes('robot') || name.includes('battle')) return 'robot';
    if (name.includes('puzzle')) return 'puzzle';
    return 'adventure';
  };

  // Game-specific movement logic
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const keys = keysRef.current;
    const velocity = velocityRef.current;
    const mesh = meshRef.current;
    const currentGameType = getGameType(gameLogic);

    // Apply gravity based on game type
    const gravity = gameLogic.gravity || 1.0;
    if (!isGroundedRef.current) {
      velocity.y -= 9.8 * gravity * delta;
    }

    // Game-specific movement
    const baseSpeed = (gameLogic.playerSpeed || 1.0) * 5;
    const moveSpeed = baseSpeed;

    switch (currentGameType) {
      case 'tic-tac-toe':
        // Tic-tac-toe: Click-based, no movement
        // Just allow camera movement with mouse
        if (mouseRef.current.isDown) {
          camera.rotation.y += mouseRef.current.x;
          camera.rotation.x += mouseRef.current.y;
          mouseRef.current.x = 0;
          mouseRef.current.y = 0;
        }
        break;

      case 'racing':
        // Racing: WASD for acceleration/steering, Space for handbrake
        if (keys.has('KeyW') || keys.has('ArrowUp')) {
          velocity.z -= moveSpeed * delta;
        }
        if (keys.has('KeyS') || keys.has('ArrowDown')) {
          velocity.z += moveSpeed * 0.5 * delta; // Reverse slower
        }
        if (keys.has('KeyA') || keys.has('ArrowLeft')) {
          velocity.x -= moveSpeed * 0.7 * delta; // Steering
        }
        if (keys.has('KeyD') || keys.has('ArrowRight')) {
          velocity.x += moveSpeed * 0.7 * delta; // Steering
        }
        if (keys.has('Space')) {
          // Handbrake - reduce velocity
          velocity.multiplyScalar(0.8);
        }
        if (keys.has('ShiftLeft') || keys.has('ShiftRight')) {
          // Boost
          velocity.z *= 1.5;
        }
        break;

      case 'space':
        // Space: WASD for movement, Space to shoot, Mouse to aim
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
        if (keys.has('Space')) {
          // Shoot - could trigger shooting logic here
          console.log('Shooting!');
        }
        if (keys.has('ShiftLeft') || keys.has('ShiftRight')) {
          // Boost
          velocity.multiplyScalar(1.3);
        }
        // Mouse aiming
        if (mouseRef.current.isDown) {
          camera.rotation.y += mouseRef.current.x;
          camera.rotation.x += mouseRef.current.y;
          mouseRef.current.x = 0;
          mouseRef.current.y = 0;
        }
        break;

      case 'airplane':
        // Airplane: WASD for flight control, Mouse for pitch/yaw
        if (keys.has('KeyW') || keys.has('ArrowUp')) {
          velocity.z -= moveSpeed * delta;
          velocity.y += moveSpeed * 0.3 * delta; // Climb
        }
        if (keys.has('KeyS') || keys.has('ArrowDown')) {
          velocity.z += moveSpeed * delta;
          velocity.y -= moveSpeed * 0.3 * delta; // Dive
        }
        if (keys.has('KeyA') || keys.has('ArrowLeft')) {
          velocity.x -= moveSpeed * 0.7 * delta; // Roll left
        }
        if (keys.has('KeyD') || keys.has('ArrowRight')) {
          velocity.x += moveSpeed * 0.7 * delta; // Roll right
        }
        if (keys.has('Space')) {
          // Increase throttle
          velocity.z *= 1.2;
        }
        if (keys.has('ShiftLeft') || keys.has('ShiftRight')) {
          // Decrease throttle
          velocity.z *= 0.8;
        }
        // Mouse for pitch/yaw
        if (mouseRef.current.isDown) {
          camera.rotation.y += mouseRef.current.x;
          camera.rotation.x += mouseRef.current.y;
          mouseRef.current.x = 0;
          mouseRef.current.y = 0;
        }
        break;

      case 'robot':
        // Robot: WASD for movement, Mouse to aim, Space to attack
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
        if (keys.has('Space')) {
          // Attack
          console.log('Robot attacking!');
        }
        if (keys.has('ShiftLeft') || keys.has('ShiftRight')) {
          // Special ability
          console.log('Special ability!');
        }
        // Mouse aiming
        if (mouseRef.current.isDown) {
          camera.rotation.y += mouseRef.current.x;
          camera.rotation.x += mouseRef.current.y;
          mouseRef.current.x = 0;
          mouseRef.current.y = 0;
        }
        break;

      case 'puzzle':
        // Puzzle: WASD for movement, Space to jump, E to interact
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
        if (keys.has('Space') && isGroundedRef.current) {
          velocity.y = 8; // Jump
          isGroundedRef.current = false;
        }
        if (keys.has('KeyE')) {
          // Interact
          console.log('Interacting!');
        }
        break;

      default:
        // Default adventure game
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
        if (keys.has('Space') && isGroundedRef.current) {
          velocity.y = 8; // Jump
          isGroundedRef.current = false;
        }
        if (keys.has('ShiftLeft') || keys.has('ShiftRight')) {
          // Run
          velocity.multiplyScalar(1.5);
        }
        break;
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
    <group ref={meshRef} position={[position.x, position.y, position.z]}>
      <mesh>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
    </group>
  );
};

// Game object component with collision detection
const GameObject3D: React.FC<{ 
  object: GameObject; 
  onCollision: (objectId: string, objectType: string) => void;
  playerPosition: Vector3;
}> = ({ object, onCollision, playerPosition }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Animate collectible objects
    if (object.type === 'collectible') {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.y = object.position.y + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }

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
      case 'collectible':
        return <sphereGeometry args={[0.3, 32, 32]} />;
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
      {object.type === 'collectible' ? (
        <meshStandardMaterial 
          color={object.color} 
          emissive={object.color} 
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      ) : (
        <meshStandardMaterial color={object.color} />
      )}
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
    <div className="glass p-4 max-w-sm">
      {/* Game Info */}
      <div className="mb-4">
        <h2 className="text-white font-bold text-lg mb-2">Objective</h2>
        <p className="text-white/80 text-sm mb-2">{gameLogic.objective}</p>
        
        <div className="space-y-1 text-white/60 text-xs">
          <div>Score: {score}</div>
          {timeLeft > 0 && <div>Time: {Math.max(0, timeLeft)}s</div>}
          <div>Status: {gameStatus}</div>
        </div>
      </div>

      {/* Controls */}
      <div>
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
          className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded text-center"
        >
          <h2 className="text-green-400 font-bold text-xl mb-2">🎉 You Won!</h2>
          <p className="text-white/80 text-sm">Congratulations! You completed the objective!</p>
        </motion.div>
      )}

      {gameStatus === 'lost' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded text-center"
        >
          <h2 className="text-red-400 font-bold text-xl mb-2">💥 Game Over</h2>
          <p className="text-white/80 text-sm">Better luck next time!</p>
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
  const [showCustomizer, setShowCustomizer] = useState(false);

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
      className="fixed inset-0 w-full h-full"
    >
      {/* Game Stats Card */}
      <GameStatsCard
        analytics={currentGame.analytics}
        isVisible={showStats}
        onToggle={() => setShowStats(!showStats)}
      />

      {/* Control Buttons */}
      <div className="absolute top-4 left-4 z-40 flex gap-2">
        <motion.button
          onClick={() => setShowAssetSelector(true)}
          className="btn btn-secondary flex items-center gap-2 text-sm px-3 py-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image className="w-4 h-4" />
          Assets
        </motion.button>
        
        <motion.button
          onClick={() => setShowCustomizer(true)}
          className="btn btn-secondary flex items-center gap-2 text-sm px-3 py-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-4 h-4" />
          Customize
        </motion.button>
      </div>

      {/* Main Game Area - Full Screen */}
      <div className="absolute inset-0">
        {/* 3D Game Canvas - Full Screen */}
        <Canvas
          camera={{ position: [5, 5, 5], fov: 60 }}
          style={{ 
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            width: '100vw',
            height: '100vh',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          onCreated={({ gl }) => {
            console.log('🎮 Canvas created successfully');
            gl.setClearColor('#1e3c72', 1.0);
          }}
          onError={(error) => {
            console.error('🚨 Canvas error:', error);
          }}
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
          gameType={currentGame.name}
          gameLogic={currentGame.gameLogic}
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
              <boxGeometry args={[1, 2, 1]} />
              <meshStandardMaterial color="#00ff00" />
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

        {/* Game UI Overlay - Compact */}
        <div className="absolute top-4 right-4 z-30 pointer-events-none">
          <div className="pointer-events-auto">
            <div className="glass p-3 max-w-xs">
              {/* Compact Game Info */}
              <div className="mb-3">
                <h2 className="text-white font-bold text-sm mb-1">Objective</h2>
                <p className="text-white/80 text-xs mb-2">{currentGame.gameLogic.objective}</p>
                
                <div className="space-y-1 text-white/60 text-xs">
                  <div>Score: {score}</div>
                  {timeLeft > 0 && <div>Time: {Math.max(0, timeLeft)}s</div>}
                  <div>Status: {gameStatus}</div>
                </div>
              </div>

              {/* Compact Controls */}
              <div>
                <h3 className="text-white font-medium text-xs mb-1">Controls</h3>
                <div className="space-y-1 text-white/60 text-xs">
                  {currentGame.gameLogic.controls.slice(0, 3).map((control: string, index: number) => (
                    <div key={index}>{control}</div>
                  ))}
                </div>
              </div>

              {/* Win/Lose Message */}
              {gameStatus === 'won' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 p-2 bg-green-500/20 border border-green-500/30 rounded text-center"
                >
                  <h2 className="text-green-400 font-bold text-sm mb-1">🎉 You Won!</h2>
                  <p className="text-white/80 text-xs">Congratulations!</p>
                </motion.div>
              )}

              {gameStatus === 'lost' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded text-center"
                >
                  <h2 className="text-red-400 font-bold text-sm mb-1">💥 Game Over</h2>
                  <p className="text-white/80 text-xs">Better luck next time!</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

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

      {/* Game Customizer Modal */}
      <GameCustomizer
        isOpen={showCustomizer}
        onClose={() => setShowCustomizer(false)}
      />
    </motion.div>
  );
};

export default PlayableGame;
