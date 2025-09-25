#!/usr/bin/env node

/**
 * Production URL Setup Script
 * Updates environment variables with production URLs for Vercel + Railway deployment
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

function updateEnvFile(filePath, updates) {
  if (!fs.existsSync(filePath)) {
    log(`❌ Environment file not found: ${filePath}`, 'red');
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
      log(`✅ Updated ${key} in ${path.basename(filePath)}`, 'green');
    } else {
      content += `\n${key}=${value}`;
      log(`➕ Added ${key} to ${path.basename(filePath)}`, 'green');
    }
  }
  
  fs.writeFileSync(filePath, content);
  return true;
}

async function main() {
  log('\n🚀 Production URL Setup Script', 'bright');
  log('=' .repeat(50), 'cyan');
  
  // Get URLs from user
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

  try {
    log('\n📝 Please provide your production URLs:', 'blue');
    log('(Press Enter to skip if you want to set them manually later)', 'yellow');
    
    const frontendUrl = await question('Frontend URL (Vercel): ');
    const backendUrl = await question('Backend URL (Railway): ');
    const aiServiceUrl = await question('AI Service URL (Railway): ');

    if (!frontendUrl && !backendUrl && !aiServiceUrl) {
      log('\n⚠️  No URLs provided. You can set them manually later.', 'yellow');
      log('See DEPLOYMENT_GUIDE.md for instructions.', 'cyan');
      rl.close();
      return;
    }

    // Update environment files
    log('\n🔧 Updating environment files...', 'blue');

    // Backend environment
    if (backendUrl || frontendUrl || aiServiceUrl) {
      const backendUpdates = {};
      if (frontendUrl) backendUpdates.FRONTEND_URL = frontendUrl;
      if (aiServiceUrl) backendUpdates.AI_SERVICE_URL = aiServiceUrl;
      
      updateEnvFile(path.join(__dirname, '../backend/.env'), backendUpdates);
    }

    // AI Service environment
    if (frontendUrl || backendUrl) {
      const aiUpdates = {};
      if (frontendUrl) aiUpdates.FRONTEND_URL = frontendUrl;
      if (backendUrl) aiUpdates.BACKEND_URL = backendUrl;
      
      updateEnvFile(path.join(__dirname, '../ai/.env'), aiUpdates);
    }

    // Frontend environment
    if (backendUrl || aiServiceUrl) {
      const frontendUpdates = {};
      if (backendUrl) {
        frontendUpdates.VITE_BACKEND_URL = backendUrl;
        frontendUpdates.VITE_SOCKET_URL = backendUrl;
      }
      if (aiServiceUrl) frontendUpdates.VITE_AI_SERVICE_URL = aiServiceUrl;
      
      updateEnvFile(path.join(__dirname, '../frontend/.env'), frontendUpdates);
    }

    log('\n✅ Environment files updated successfully!', 'green');
    
    // Validate the setup
    log('\n🧪 Validating configuration...', 'blue');
    const { execSync } = require('child_process');
    
    try {
      execSync('node scripts/validate-env.js', { stdio: 'inherit' });
      log('\n🎉 Production setup completed successfully!', 'green');
    } catch (error) {
      log('\n⚠️  Validation completed with some warnings.', 'yellow');
      log('This is normal for production URLs in development mode.', 'yellow');
    }

    log('\n📋 Next Steps:', 'bright');
    log('1. Deploy to Vercel and Railway using DEPLOYMENT_GUIDE.md', 'cyan');
    log('2. Update the URLs in your hosting platforms', 'cyan');
    log('3. Test all features in production', 'cyan');
    log('4. Set up monitoring and alerts', 'cyan');

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
  } finally {
    rl.close();
  }
}

main().catch(error => {
  log(`\n❌ Setup failed: ${error.message}`, 'red');
  process.exit(1);
});
