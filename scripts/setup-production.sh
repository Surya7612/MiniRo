#!/bin/bash

# Roam Game Super App - Production Setup Script
# This script helps set up the production environment with all required API keys

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Roam Game Super App - Production Setup${NC}"
echo "=================================================="

# Check if running in production mode
if [ "$NODE_ENV" != "production" ]; then
    echo -e "${YELLOW}⚠️  Warning: NODE_ENV is not set to 'production'${NC}"
    echo -e "${YELLOW}   This script is designed for production deployment${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required tools
echo -e "${BLUE}🔍 Checking required tools...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js and npm are available${NC}"

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ is required (current: $(node -v))${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version $(node -v) is compatible${NC}"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm run install:all

# Create environment files if they don't exist
echo -e "${BLUE}🔧 Setting up environment files...${NC}"

# Backend environment
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}📝 Creating backend/.env from template...${NC}"
    cp backend/env.example backend/.env
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your production values${NC}"
else
    echo -e "${GREEN}✅ backend/.env already exists${NC}"
fi

# AI service environment
if [ ! -f "ai/.env" ]; then
    echo -e "${YELLOW}📝 Creating ai/.env from template...${NC}"
    cp ai/env.example ai/.env
    echo -e "${YELLOW}⚠️  Please edit ai/.env with your production values${NC}"
else
    echo -e "${GREEN}✅ ai/.env already exists${NC}"
fi

# Frontend environment
if [ ! -f "frontend/.env" ]; then
    echo -e "${YELLOW}📝 Creating frontend/.env from template...${NC}"
    cat > frontend/.env << EOF
# API URLs
VITE_BACKEND_URL=https://your-backend-domain.com
VITE_AI_SERVICE_URL=https://your-ai-service-domain.com
VITE_SOCKET_URL=https://your-backend-domain.com

# Feature Flags
VITE_ENABLE_AI_ASSETS=true
VITE_ENABLE_VOICE_NARRATION=true
VITE_ENABLE_ANALYTICS=true

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=
VITE_MIXPANEL_TOKEN=

# Social Sharing
VITE_SOCIAL_SHARING_ENABLED=true
VITE_QR_CODE_ENABLED=true
EOF
    echo -e "${YELLOW}⚠️  Please edit frontend/.env with your production values${NC}"
else
    echo -e "${GREEN}✅ frontend/.env already exists${NC}"
fi

# Validate environment
echo -e "${BLUE}🧪 Validating environment configuration...${NC}"
if npm run validate:env; then
    echo -e "${GREEN}✅ Environment validation passed${NC}"
else
    echo -e "${RED}❌ Environment validation failed${NC}"
    echo -e "${YELLOW}Please fix the issues above before proceeding${NC}"
    exit 1
fi

# Build the application
echo -e "${BLUE}🔨 Building application...${NC}"
npm run build:all

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build completed successfully${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Create production directories
echo -e "${BLUE}📁 Creating production directories...${NC}"
mkdir -p backend/public/assets
mkdir -p backend/public/audio
mkdir -p logs

# Set proper permissions
chmod 755 backend/public/assets
chmod 755 backend/public/audio
chmod 755 logs

echo -e "${GREEN}✅ Production directories created${NC}"

# Display next steps
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "=================================================="
echo -e "${YELLOW}1. Configure API Keys:${NC}"
echo "   - ElevenLabs: https://elevenlabs.io/"
echo "   - Replicate: https://replicate.com/"
echo "   - OpenAI: https://platform.openai.com/"
echo ""
echo -e "${YELLOW}2. Update Environment Files:${NC}"
echo "   - backend/.env (API keys, database, etc.)"
echo "   - ai/.env (OpenAI API key)"
echo "   - frontend/.env (production URLs)"
echo ""
echo -e "${YELLOW}3. Deploy to Production:${NC}"
echo "   - Use Docker: docker-compose up -d"
echo "   - Or manual deployment to your server"
echo ""
echo -e "${YELLOW}4. Test Production Setup:${NC}"
echo "   - Run: npm run validate:env"
echo "   - Test all features with real API keys"
echo ""
echo -e "${GREEN}🎉 Production setup completed!${NC}"
echo -e "${BLUE}📖 See PRODUCTION_SETUP.md for detailed instructions${NC}"
