import * as THREE from 'three';

export interface ModelConfig {
  id: string;
  name: string;
  type: 'spaceship' | 'car' | 'robot' | 'airplane' | 'default';
  url: string;
  scale?: Vector3;
  position?: Vector3;
  rotation?: Vector3;
  materials?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

// Pre-configured 3D models from online sources
export const MODEL_CONFIGS: ModelConfig[] = [
  // Spaceship models
  {
    id: 'spaceship-1',
    name: 'Fighter Spaceship',
    type: 'spaceship',
    url: 'https://models.readyplayer.me/64e9b1a1e5b5a5a5a5a5a5a5.glb', // Placeholder URL
    scale: { x: 1, y: 1, z: 1 },
    materials: {
      primary: '#4A90E2',
      secondary: '#7ED321',
      accent: '#F5A623'
    }
  },
  {
    id: 'spaceship-2',
    name: 'Explorer Ship',
    type: 'spaceship',
    url: 'https://models.readyplayer.me/64e9b1a1e5b5a5a5a5a5a5a6.glb', // Placeholder URL
    scale: { x: 1.2, y: 1.2, z: 1.2 },
    materials: {
      primary: '#9013FE',
      secondary: '#50E3C2',
      accent: '#FF6B6B'
    }
  },
  
  // Car models
  {
    id: 'car-1',
    name: 'Sports Car',
    type: 'car',
    url: 'https://models.readyplayer.me/64e9b1a1e5b5a5a5a5a5a5a7.glb', // Placeholder URL
    scale: { x: 0.8, y: 0.8, z: 0.8 },
    materials: {
      primary: '#FF4757',
      secondary: '#2F3542',
      accent: '#FFD700'
    }
  },
  {
    id: 'car-2',
    name: 'Racing Car',
    type: 'car',
    url: 'https://models.readyplayer.me/64e9b1a1e5b5a5a5a5a5a5a8.glb', // Placeholder URL
    scale: { x: 0.9, y: 0.9, z: 0.9 },
    materials: {
      primary: '#3742FA',
      secondary: '#2ED573',
      accent: '#FFA502'
    }
  },
  
  // Robot models
  {
    id: 'robot-1',
    name: 'Combat Robot',
    type: 'robot',
    url: 'https://models.readyplayer.me/64e9b1a1e5b5a5a5a5a5a5a9.glb', // Placeholder URL
    scale: { x: 1.1, y: 1.1, z: 1.1 },
    materials: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#45B7D1'
    }
  },
  {
    id: 'robot-2',
    name: 'Utility Bot',
    type: 'robot',
    url: 'https://models.readyplayer.me/64e9b1a1e5b5a5a5a5a5a5aa.glb', // Placeholder URL
    scale: { x: 1, y: 1, z: 1 },
    materials: {
      primary: '#96CEB4',
      secondary: '#FFEAA7',
      accent: '#DDA0DD'
    }
  },
  
  // Airplane models
  {
    id: 'airplane-1',
    name: 'Fighter Jet',
    type: 'airplane',
    url: 'https://models.readyplayer.me/64e9b1a1e5b5a5a5a5a5a5ab.glb', // Placeholder URL
    scale: { x: 0.7, y: 0.7, z: 0.7 },
    materials: {
      primary: '#70A1FF',
      secondary: '#5352ED',
      accent: '#FF6348'
    }
  },
  {
    id: 'airplane-2',
    name: 'Cargo Plane',
    type: 'airplane',
    url: 'https://models.readyplayer.me/64e9b1a1e5b5a5a5a5a5a5ac.glb', // Placeholder URL
    scale: { x: 1.3, y: 1.3, z: 1.3 },
    materials: {
      primary: '#FF7675',
      secondary: '#74B9FF',
      accent: '#FDCB6E'
    }
  }
];

// Fallback models using Three.js primitives with enhanced materials
export const FALLBACK_MODELS: ModelConfig[] = [
  {
    id: 'fallback-spaceship',
    name: 'Primitive Spaceship',
    type: 'spaceship',
    url: '', // No URL - will use Three.js primitives
    scale: { x: 1, y: 1, z: 1 },
    materials: {
      primary: '#4A90E2',
      secondary: '#7ED321',
      accent: '#F5A623'
    }
  },
  {
    id: 'fallback-car',
    name: 'Primitive Car',
    type: 'car',
    url: '',
    scale: { x: 1, y: 1, z: 1 },
    materials: {
      primary: '#FF4757',
      secondary: '#2F3542',
      accent: '#FFD700'
    }
  },
  {
    id: 'fallback-robot',
    name: 'Primitive Robot',
    type: 'robot',
    url: '',
    scale: { x: 1, y: 1, z: 1 },
    materials: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#45B7D1'
    }
  },
  {
    id: 'fallback-airplane',
    name: 'Primitive Airplane',
    type: 'airplane',
    url: '',
    scale: { x: 1, y: 1, z: 1 },
    materials: {
      primary: '#70A1FF',
      secondary: '#5352ED',
      accent: '#FF6348'
    }
  }
];

class ModelService {
  private loadedModels = new Map<string, THREE.Group>();
  private loadingPromises = new Map<string, Promise<THREE.Group>>();

  /**
   * Get model configuration for a specific game type
   */
  getModelForGameType(gameType: string): ModelConfig {
    const gameTypeLower = gameType.toLowerCase();
    
    if (gameTypeLower.includes('space') || gameTypeLower.includes('spaceship')) {
      return MODEL_CONFIGS.find(m => m.type === 'spaceship') || FALLBACK_MODELS.find(m => m.type === 'spaceship')!;
    }
    
    if (gameTypeLower.includes('racing') || gameTypeLower.includes('race') || gameTypeLower.includes('car')) {
      return MODEL_CONFIGS.find(m => m.type === 'car') || FALLBACK_MODELS.find(m => m.type === 'car')!;
    }
    
    if (gameTypeLower.includes('robot') || gameTypeLower.includes('battle')) {
      return MODEL_CONFIGS.find(m => m.type === 'robot') || FALLBACK_MODELS.find(m => m.type === 'robot')!;
    }
    
    if (gameTypeLower.includes('airplane') || gameTypeLower.includes('flight')) {
      return MODEL_CONFIGS.find(m => m.type === 'airplane') || FALLBACK_MODELS.find(m => m.type === 'airplane')!;
    }
    
    // Default to spaceship for unknown types
    return MODEL_CONFIGS.find(m => m.type === 'spaceship') || FALLBACK_MODELS.find(m => m.type === 'spaceship')!;
  }

  /**
   * Load a 3D model from URL
   */
  async loadModel(config: ModelConfig): Promise<THREE.Group> {
    if (this.loadedModels.has(config.id)) {
      return this.loadedModels.get(config.id)!.clone();
    }

    if (this.loadingPromises.has(config.id)) {
      return this.loadingPromises.get(config.id)!;
    }

    const loadingPromise = this.loadModelFromUrl(config);
    this.loadingPromises.set(config.id, loadingPromise);

    try {
      const model = await loadingPromise;
      this.loadedModels.set(config.id, model);
      this.loadingPromises.delete(config.id);
      return model.clone();
    } catch (error) {
      console.warn(`Failed to load model ${config.id}, using fallback:`, error);
      this.loadingPromises.delete(config.id);
      return this.createFallbackModel(config);
    }
  }

  /**
   * Load model from URL using GLTFLoader
   */
  private async loadModelFromUrl(config: ModelConfig): Promise<THREE.Group> {
    if (!config.url) {
      return this.createFallbackModel(config);
    }

    // For now, we'll use fallback models since we don't have real URLs
    // In production, you would use GLTFLoader here:
    /*
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(config.url);
    const model = gltf.scene;
    
    // Apply transformations
    if (config.scale) {
      model.scale.set(config.scale.x, config.scale.y, config.scale.z);
    }
    
    // Apply materials if specified
    if (config.materials) {
      this.applyMaterials(model, config.materials);
    }
    
    return model;
    */
    
    return this.createFallbackModel(config);
  }

  /**
   * Create fallback model using Three.js primitives
   */
  private createFallbackModel(config: ModelConfig): THREE.Group {
    const group = new THREE.Group();
    
    switch (config.type) {
      case 'spaceship':
        group.add(this.createSpaceshipModel(config));
        break;
      case 'car':
        group.add(this.createCarModel(config));
        break;
      case 'robot':
        group.add(this.createRobotModel(config));
        break;
      case 'airplane':
        group.add(this.createAirplaneModel(config));
        break;
      default:
        group.add(this.createSpaceshipModel(config));
    }

    // Apply scale
    if (config.scale) {
      group.scale.set(config.scale.x, config.scale.y, config.scale.z);
    }

    return group;
  }

  /**
   * Create spaceship model using primitives
   */
  private createSpaceshipModel(config: ModelConfig): THREE.Group {
    const group = new THREE.Group();
    
    // Main body
    const bodyGeometry = new THREE.ConeGeometry(0.3, 1.5, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: config.materials?.primary || '#4A90E2',
      metalness: 0.8,
      roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI;
    group.add(body);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(1.2, 0.1, 0.3);
    const wingMaterial = new THREE.MeshStandardMaterial({ 
      color: config.materials?.secondary || '#7ED321',
      metalness: 0.6,
      roughness: 0.3
    });
    
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.4, 0, 0);
    group.add(leftWing);
    
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.4, 0, 0);
    group.add(rightWing);

    // Engine glow
    const engineGeometry = new THREE.SphereGeometry(0.2, 8, 6);
    const engineMaterial = new THREE.MeshStandardMaterial({ 
      color: config.materials?.accent || '#F5A623',
      emissive: config.materials?.accent || '#F5A623',
      emissiveIntensity: 0.5
    });
    
    const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    leftEngine.position.set(-0.3, 0.7, 0);
    group.add(leftEngine);
    
    const rightEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    rightEngine.position.set(0.3, 0.7, 0);
    group.add(rightEngine);

    return group;
  }

  /**
   * Create car model using primitives
   */
  private createCarModel(config: ModelConfig): THREE.Group {
    const group = new THREE.Group();
    
    // Main body
    const bodyGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.6);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: config.materials?.primary || '#FF4757',
      metalness: 0.9,
      roughness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.3;
    group.add(body);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 12);
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
      color: config.materials?.secondary || '#2F3542',
      metalness: 0.7,
      roughness: 0.3
    });
    
    const positions = [
      { x: -0.4, z: -0.2 },
      { x: 0.4, z: -0.2 },
      { x: -0.4, z: 0.2 },
      { x: 0.4, z: 0.2 }
    ];
    
    positions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos.x, 0.15, pos.z);
      wheel.rotation.z = Math.PI / 2;
      group.add(wheel);
    });

    // Spoiler
    const spoilerGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.05);
    const spoilerMaterial = new THREE.MeshStandardMaterial({ 
      color: config.materials?.accent || '#FFD700',
      metalness: 0.8,
      roughness: 0.2
    });
    const spoiler = new THREE.Mesh(spoilerGeometry, spoilerMaterial);
    spoiler.position.set(0, 0.6, 0);
    group.add(spoiler);

    return group;
  }

  /**
   * Create robot model using primitives
   */
  private createRobotModel(config: ModelConfig): THREE.Group {
    const group = new THREE.Group();
    
    // Head
    const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: config.materials?.primary || '#FF6B6B',
      metalness: 0.6,
      roughness: 0.4
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.8;
    group.add(head);

    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.3);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: config.materials?.secondary || '#4ECDC4',
      metalness: 0.7,
      roughness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);

    // Arms
    const armGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const armMaterial = new THREE.MeshStandardMaterial({ 
      color: config.materials?.accent || '#45B7D1',
      metalness: 0.5,
      roughness: 0.5
    });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.5, 0.2, 0);
    group.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.5, 0.2, 0);
    group.add(rightArm);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const legMaterial = new THREE.MeshStandardMaterial({ 
      color: config.materials?.secondary || '#4ECDC4',
      metalness: 0.7,
      roughness: 0.3
    });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2, -0.7, 0);
    group.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2, -0.7, 0);
    group.add(rightLeg);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 6);
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
      color: config.materials?.accent || '#45B7D1',
      emissive: config.materials?.accent || '#45B7D1',
      emissiveIntensity: 0.8
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 0.9, 0.2);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 0.9, 0.2);
    group.add(rightEye);

    return group;
  }

  /**
   * Create airplane model using primitives
   */
  private createAirplaneModel(config: ModelConfig): THREE.Group {
    const group = new THREE.Group();
    
    // Main body
    const bodyGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1.5, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: config.materials?.primary || '#70A1FF',
      metalness: 0.8,
      roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;
    group.add(body);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(2, 0.1, 0.4);
    const wingMaterial = new THREE.MeshStandardMaterial({ 
      color: config.materials?.secondary || '#5352ED',
      metalness: 0.7,
      roughness: 0.3
    });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    group.add(wings);

    // Tail
    const tailGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.3);
    const tailMaterial = new THREE.MeshStandardMaterial({ 
      color: config.materials?.accent || '#FF6348',
      metalness: 0.6,
      roughness: 0.4
    });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(0.7, 0.2, 0);
    group.add(tail);

    // Propeller
    const propGeometry = new THREE.BoxGeometry(0.05, 0.8, 0.05);
    const propMaterial = new THREE.MeshStandardMaterial({ 
      color: config.materials?.accent || '#FF6348',
      metalness: 0.8,
      roughness: 0.2
    });
    const propeller = new THREE.Mesh(propGeometry, propMaterial);
    propeller.position.set(-0.8, 0, 0);
    group.add(propeller);

    return group;
  }

  /**
   * Apply materials to a loaded model
   */
  private applyMaterials(model: THREE.Group, materials: any): void {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (materials.primary) {
          child.material.color.setHex(materials.primary.replace('#', '0x'));
        }
      }
    });
  }

  /**
   * Clear cached models
   */
  clearCache(): void {
    this.loadedModels.clear();
    this.loadingPromises.clear();
  }
}

export const modelService = new ModelService();
