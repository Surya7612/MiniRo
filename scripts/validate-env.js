#!/usr/bin/env node

/**
 * Environment Validation Script
 * Validates all required API keys and environment variables for production deployment
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function loadEnvFile(filePath) {
  if (!checkFileExists(filePath)) {
    return {};
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

function validateApiKey(key, name) {
  if (!key || key === '' || key.includes('your_') || key.includes('placeholder')) {
    return { valid: false, message: `❌ ${name} is not configured` };
  }
  
  if (key.length < 10) {
    return { valid: false, message: `❌ ${name} appears to be too short` };
  }
  
  return { valid: true, message: `✅ ${name} is configured` };
}

function validateUrl(url, name) {
  if (!url || url === '' || url.includes('your-') || url.includes('localhost')) {
    return { valid: false, message: `❌ ${name} is not configured for production` };
  }
  
  try {
    new URL(url);
    return { valid: true, message: `✅ ${name} is a valid URL` };
  } catch (error) {
    return { valid: false, message: `❌ ${name} is not a valid URL` };
  }
}

async function testApiKey(apiKey, service, testFunction) {
  if (!apiKey || apiKey.includes('your_') || apiKey.includes('placeholder')) {
    return { valid: false, message: `❌ ${service} API key not configured` };
  }
  
  try {
    const result = await testFunction(apiKey);
    return { valid: true, message: `✅ ${service} API key is valid` };
  } catch (error) {
    return { valid: false, message: `❌ ${service} API key test failed: ${error.message}` };
  }
}

async function testElevenLabsKey(apiKey) {
  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: {
      'xi-api-key': apiKey
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return true;
}

async function testReplicateKey(apiKey) {
  const response = await fetch('https://api.replicate.com/v1/account', {
    headers: {
      'Authorization': `Token ${apiKey}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return true;
}

async function testOpenAIKey(apiKey) {
  const response = await fetch('https://api.openai.com/v1/models', {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return true;
}

async function main() {
  log('\n🔍 Roam Game Super App - Environment Validation', 'bright');
  log('=' .repeat(50), 'cyan');
  
  const results = {
    backend: { valid: 0, total: 0, issues: [] },
    ai: { valid: 0, total: 0, issues: [] },
    frontend: { valid: 0, total: 0, issues: [] }
  };
  
  // Check Backend Environment
  log('\n📦 Backend Environment Validation', 'blue');
  log('-'.repeat(30), 'blue');
  
  const backendEnv = loadEnvFile(path.join(__dirname, '../backend/.env'));
  const backendEnvExample = loadEnvFile(path.join(__dirname, '../backend/env.example'));
  
  const backendChecks = [
    { key: 'PORT', name: 'Port', required: true },
    { key: 'NODE_ENV', name: 'Node Environment', required: true },
    { key: 'FRONTEND_URL', name: 'Frontend URL', required: true, isUrl: true },
    { key: 'ELEVENLABS_API_KEY', name: 'ElevenLabs API Key', required: true, isApiKey: true },
    { key: 'REPLICATE_API_TOKEN', name: 'Replicate API Token', required: true, isApiKey: true },
    { key: 'AI_SERVICE_URL', name: 'AI Service URL', required: true, isUrl: true }
  ];
  
  for (const check of backendChecks) {
    results.backend.total++;
    const value = backendEnv[check.key];
    
    if (!value && check.required) {
      results.backend.issues.push(`Missing required: ${check.name}`);
      log(`❌ ${check.name}: Not set`, 'red');
      continue;
    }
    
    if (check.isApiKey) {
      const validation = validateApiKey(value, check.name);
      if (validation.valid) {
        results.backend.valid++;
        log(validation.message, 'green');
      } else {
        results.backend.issues.push(validation.message);
        log(validation.message, 'red');
      }
    } else if (check.isUrl) {
      const validation = validateUrl(value, check.name);
      if (validation.valid) {
        results.backend.valid++;
        log(validation.message, 'green');
      } else {
        results.backend.issues.push(validation.message);
        log(validation.message, 'red');
      }
    } else {
      results.backend.valid++;
      log(`✅ ${check.name}: ${value}`, 'green');
    }
  }
  
  // Check AI Service Environment
  log('\n🤖 AI Service Environment Validation', 'blue');
  log('-'.repeat(30), 'blue');
  
  const aiEnv = loadEnvFile(path.join(__dirname, '../ai/.env'));
  
  const aiChecks = [
    { key: 'PORT', name: 'Port', required: true },
    { key: 'NODE_ENV', name: 'Node Environment', required: true },
    { key: 'OPENAI_API_KEY', name: 'OpenAI API Key', required: true, isApiKey: true },
    { key: 'FRONTEND_URL', name: 'Frontend URL', required: true, isUrl: true },
    { key: 'BACKEND_URL', name: 'Backend URL', required: true, isUrl: true }
  ];
  
  for (const check of aiChecks) {
    results.ai.total++;
    const value = aiEnv[check.key];
    
    if (!value && check.required) {
      results.ai.issues.push(`Missing required: ${check.name}`);
      log(`❌ ${check.name}: Not set`, 'red');
      continue;
    }
    
    if (check.isApiKey) {
      const validation = validateApiKey(value, check.name);
      if (validation.valid) {
        results.ai.valid++;
        log(validation.message, 'green');
      } else {
        results.ai.issues.push(validation.message);
        log(validation.message, 'red');
      }
    } else if (check.isUrl) {
      const validation = validateUrl(value, check.name);
      if (validation.valid) {
        results.ai.valid++;
        log(validation.message, 'green');
      } else {
        results.ai.issues.push(validation.message);
        log(validation.message, 'red');
      }
    } else {
      results.ai.valid++;
      log(`✅ ${check.name}: ${value}`, 'green');
    }
  }
  
  // Check Frontend Environment
  log('\n🎨 Frontend Environment Validation', 'blue');
  log('-'.repeat(30), 'blue');
  
  const frontendEnv = loadEnvFile(path.join(__dirname, '../frontend/.env'));
  
  const frontendChecks = [
    { key: 'VITE_BACKEND_URL', name: 'Backend URL', required: true, isUrl: true },
    { key: 'VITE_AI_SERVICE_URL', name: 'AI Service URL', required: true, isUrl: true },
    { key: 'VITE_SOCKET_URL', name: 'Socket URL', required: true, isUrl: true }
  ];
  
  for (const check of frontendChecks) {
    results.frontend.total++;
    const value = frontendEnv[check.key];
    
    if (!value && check.required) {
      results.frontend.issues.push(`Missing required: ${check.name}`);
      log(`❌ ${check.name}: Not set`, 'red');
      continue;
    }
    
    if (check.isUrl) {
      const validation = validateUrl(value, check.name);
      if (validation.valid) {
        results.frontend.valid++;
        log(validation.message, 'green');
      } else {
        results.frontend.issues.push(validation.message);
        log(validation.message, 'red');
      }
    } else {
      results.frontend.valid++;
      log(`✅ ${check.name}: ${value}`, 'green');
    }
  }
  
  // API Key Testing (if keys are configured)
  log('\n🧪 API Key Testing', 'magenta');
  log('-'.repeat(30), 'magenta');
  
  if (backendEnv.ELEVENLABS_API_KEY && !backendEnv.ELEVENLABS_API_KEY.includes('your_')) {
    try {
      const result = await testApiKey(backendEnv.ELEVENLABS_API_KEY, 'ElevenLabs', testElevenLabsKey);
      log(result.message, result.valid ? 'green' : 'red');
    } catch (error) {
      log(`❌ ElevenLabs API test failed: ${error.message}`, 'red');
    }
  }
  
  if (backendEnv.REPLICATE_API_TOKEN && !backendEnv.REPLICATE_API_TOKEN.includes('your_')) {
    try {
      const result = await testApiKey(backendEnv.REPLICATE_API_TOKEN, 'Replicate', testReplicateKey);
      log(result.message, result.valid ? 'green' : 'red');
    } catch (error) {
      log(`❌ Replicate API test failed: ${error.message}`, 'red');
    }
  }
  
  if (aiEnv.OPENAI_API_KEY && !aiEnv.OPENAI_API_KEY.includes('your_')) {
    try {
      const result = await testApiKey(aiEnv.OPENAI_API_KEY, 'OpenAI', testOpenAIKey);
      log(result.message, result.valid ? 'green' : 'red');
    } catch (error) {
      log(`❌ OpenAI API test failed: ${error.message}`, 'red');
    }
  }
  
  // Summary
  log('\n📊 Validation Summary', 'bright');
  log('=' .repeat(50), 'cyan');
  
  const totalValid = results.backend.valid + results.ai.valid + results.frontend.valid;
  const totalChecks = results.backend.total + results.ai.total + results.frontend.total;
  
  log(`Backend: ${results.backend.valid}/${results.backend.total} checks passed`, 
      results.backend.valid === results.backend.total ? 'green' : 'yellow');
  log(`AI Service: ${results.ai.valid}/${results.ai.total} checks passed`, 
      results.ai.valid === results.ai.total ? 'green' : 'yellow');
  log(`Frontend: ${results.frontend.valid}/${results.frontend.total} checks passed`, 
      results.frontend.valid === results.frontend.total ? 'green' : 'yellow');
  
  log(`\nOverall: ${totalValid}/${totalChecks} checks passed`, 
      totalValid === totalChecks ? 'green' : 'yellow');
  
  if (totalValid === totalChecks) {
    log('\n🎉 All environment variables are properly configured!', 'green');
    log('Your Roam Game Super App is ready for production deployment.', 'green');
  } else {
    log('\n⚠️  Some environment variables need attention:', 'yellow');
    
    [...results.backend.issues, ...results.ai.issues, ...results.frontend.issues]
      .forEach(issue => log(`  • ${issue}`, 'yellow'));
    
    log('\nPlease review the PRODUCTION_SETUP.md guide for detailed instructions.', 'cyan');
  }
  
  log('\n' + '=' .repeat(50), 'cyan');
  
  process.exit(totalValid === totalChecks ? 0 : 1);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  log(`\n❌ Unhandled error: ${error.message}`, 'red');
  process.exit(1);
});

main().catch(error => {
  log(`\n❌ Validation failed: ${error.message}`, 'red');
  process.exit(1);
});
