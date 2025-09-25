import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvironmentConfig {
  // Server Configuration
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  
  // AI Service Configuration
  aiServiceUrl: string;
  aiApiKey: string;
  
  // ElevenLabs Configuration
  elevenLabsApiKey: string;
  
  // Replicate Configuration
  replicateApiToken: string;
  
  // Database Configuration
  databaseUrl?: string;
  
  // Redis Configuration
  redisUrl?: string;
  
  // Security
  jwtSecret: string;
  sessionSecret: string;
  
  // CORS Configuration
  allowedOrigins: string[];
  
  // Rate Limiting
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  
  // File Upload Limits
  maxFileSize: number;
  maxAssetSize: number;
  
  // Asset Storage
  assetsDir: string;
  assetCleanupDays: number;
}

function validateRequired(key: string, value: string | undefined, service: string): string {
  if (!value || value === '' || value.includes('your_') || value.includes('placeholder')) {
    throw new Error(`❌ ${service}: ${key} is required for production deployment`);
  }
  return value;
}

function validateApiKey(key: string, value: string | undefined, service: string): string {
  const validated = validateRequired(key, value, service);
  
  if (validated.length < 10) {
    throw new Error(`❌ ${service}: ${key} appears to be too short`);
  }
  
  return validated;
}

function validateUrl(key: string, value: string | undefined, service: string): string {
  const validated = validateRequired(key, value, service);
  
  try {
    new URL(validated);
    return validated;
  } catch (error) {
    throw new Error(`❌ ${service}: ${key} is not a valid URL`);
  }
}

function getEnvironmentConfig(): EnvironmentConfig {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // Production validation - all keys must be properly configured
    return {
      port: parseInt(process.env.PORT || '5000'),
      nodeEnv: process.env.NODE_ENV || 'development',
      frontendUrl: validateUrl('FRONTEND_URL', process.env.FRONTEND_URL, 'Backend'),
      aiServiceUrl: validateUrl('AI_SERVICE_URL', process.env.AI_SERVICE_URL, 'Backend'),
      aiApiKey: validateApiKey('AI_API_KEY', process.env.AI_API_KEY, 'Backend'),
      elevenLabsApiKey: validateApiKey('ELEVENLABS_API_KEY', process.env.ELEVENLABS_API_KEY, 'Backend'),
      replicateApiToken: validateApiKey('REPLICATE_API_TOKEN', process.env.REPLICATE_API_TOKEN, 'Backend'),
      databaseUrl: process.env.DATABASE_URL,
      redisUrl: process.env.REDIS_URL,
      jwtSecret: validateRequired('JWT_SECRET', process.env.JWT_SECRET, 'Backend'),
      sessionSecret: validateRequired('SESSION_SECRET', process.env.SESSION_SECRET, 'Backend'),
      allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean),
      rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
      rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
      maxAssetSize: parseInt(process.env.MAX_ASSET_SIZE || '5242880'),
      assetsDir: process.env.ASSETS_DIR || 'public/assets',
      assetCleanupDays: parseInt(process.env.ASSET_CLEANUP_DAYS || '30')
    };
  } else {
    // Development - use defaults and mock values
    return {
      port: parseInt(process.env.PORT || '5000'),
      nodeEnv: process.env.NODE_ENV || 'development',
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:5001',
      aiApiKey: process.env.AI_API_KEY || 'mock-key-for-demo',
      elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || 'mock-key-for-demo',
      replicateApiToken: process.env.REPLICATE_API_TOKEN || 'mock-token-for-demo',
      databaseUrl: process.env.DATABASE_URL,
      redisUrl: process.env.REDIS_URL,
      jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-not-for-production',
      sessionSecret: process.env.SESSION_SECRET || 'dev-session-secret-not-for-production',
      allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',').filter(Boolean),
      rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
      rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'),
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
      maxAssetSize: parseInt(process.env.MAX_ASSET_SIZE || '5242880'),
      assetsDir: process.env.ASSETS_DIR || 'public/assets',
      assetCleanupDays: parseInt(process.env.ASSET_CLEANUP_DAYS || '30')
    };
  }
}

// Export configuration
export const config = getEnvironmentConfig();

// Export validation function for testing
export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    getEnvironmentConfig();
    return { valid: true, errors: [] };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown validation error');
    return { valid: false, errors };
  }
}

// Log configuration status
if (config.nodeEnv === 'production') {
  console.log('🚀 Production environment detected');
  console.log('✅ All required API keys and environment variables validated');
} else {
  console.log('🔧 Development environment detected');
  console.log('⚠️  Using mock API keys - configure real keys for production');
}
