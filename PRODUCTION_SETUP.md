# Production Setup Guide

## Overview

This guide covers the complete setup required to deploy the Roam Game Super App to production with all AI services and features enabled.

## Required API Keys & Services

### 1. **ElevenLabs API** (Voice Generation)
- **Purpose**: AI voice narration for games
- **Required for**: Game intros, event announcements, character voices
- **Get API Key**: https://elevenlabs.io/
- **Cost**: Free tier available, paid plans for higher usage
- **Environment Variable**: `ELEVENLABS_API_KEY`

### 2. **Replicate API** (Image Generation)
- **Purpose**: AI-generated game assets (backgrounds, sprites)
- **Required for**: Custom game assets, visual customization
- **Get API Key**: https://replicate.com/
- **Cost**: Pay-per-use model, very affordable
- **Environment Variable**: `REPLICATE_API_TOKEN`

### 3. **OpenAI API** (Game Generation)
- **Purpose**: AI-powered game logic and content generation
- **Required for**: Advanced game generation, content analysis
- **Get API Key**: https://platform.openai.com/
- **Cost**: Pay-per-token, reasonable for game generation
- **Environment Variable**: `OPENAI_API_KEY`

## Production Environment Setup

### 1. **Backend Environment Variables**

Create `backend/.env` with the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# AI Service URLs
AI_SERVICE_URL=https://your-ai-service.com
AI_API_KEY=your_openai_api_key_here

# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Replicate Configuration
REPLICATE_API_TOKEN=your_replicate_api_token_here

# Database Configuration (Production)
DATABASE_URL=postgresql://username:password@your-db-host:5432/roam_game_db

# Redis Configuration (Production)
REDIS_URL=redis://your-redis-host:6379

# Security
JWT_SECRET=your-super-secure-jwt-secret-here
SESSION_SECRET=your-super-secure-session-secret-here

# CORS Configuration
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Limits
MAX_FILE_SIZE=10485760
MAX_ASSET_SIZE=5242880

# Asset Storage
ASSETS_DIR=public/assets
ASSET_CLEANUP_DAYS=30
```

### 2. **AI Service Environment Variables**

Create `ai/.env` with the following:

```env
# AI Service Configuration
PORT=5001
NODE_ENV=production

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
DEFAULT_MODEL=gpt-4
MAX_TOKENS=2000
TEMPERATURE=0.7

# Service URLs
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://your-backend.com

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600000

# Security
API_SECRET=your-ai-service-secret-here
```

### 3. **Frontend Environment Variables**

Create `frontend/.env` with the following:

```env
# API URLs
VITE_BACKEND_URL=https://your-backend.com
VITE_AI_SERVICE_URL=https://your-ai-service.com
VITE_SOCKET_URL=https://your-backend.com

# Feature Flags
VITE_ENABLE_AI_ASSETS=true
VITE_ENABLE_VOICE_NARRATION=true
VITE_ENABLE_ANALYTICS=true

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
VITE_MIXPANEL_TOKEN=your-mixpanel-token

# Social Sharing
VITE_SOCIAL_SHARING_ENABLED=true
VITE_QR_CODE_ENABLED=true
```

## API Key Setup Instructions

### 1. **ElevenLabs Setup**

1. Go to https://elevenlabs.io/
2. Sign up for an account
3. Navigate to Profile → API Keys
4. Create a new API key
5. Copy the key and add to `ELEVENLABS_API_KEY`

**Voice Models Available:**
- `narrator-classic`: Professional narrator voice
- `character-energetic`: Energetic character voice
- `announcer-dramatic`: Dramatic announcer voice
- `guide-friendly`: Friendly guide voice

### 2. **Replicate Setup**

1. Go to https://replicate.com/
2. Sign up for an account
3. Navigate to Account → API Tokens
4. Create a new token
5. Copy the token and add to `REPLICATE_API_TOKEN`

**Available Models:**
- `stability-ai/stable-diffusion`: High-quality image generation
- `stability-ai/sdxl`: Latest Stable Diffusion XL
- `runwayml/stable-diffusion`: Alternative model

### 3. **OpenAI Setup**

1. Go to https://platform.openai.com/
2. Sign up for an account
3. Navigate to API Keys
4. Create a new secret key
5. Copy the key and add to `OPENAI_API_KEY`

**Recommended Models:**
- `gpt-4`: Best quality for game generation
- `gpt-3.5-turbo`: Faster and cheaper alternative

## Production Deployment

### 1. **Docker Deployment**

Use the provided `docker-compose.yml`:

```bash
# Build and deploy
docker-compose up -d

# Check logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale backend=3
```

### 2. **Manual Deployment**

#### Backend Deployment:
```bash
cd backend
npm install --production
npm run build
npm start
```

#### AI Service Deployment:
```bash
cd ai
npm install --production
npm run build
npm start
```

#### Frontend Deployment:
```bash
cd frontend
npm install
npm run build
# Deploy dist/ folder to your web server
```

### 3. **Environment Validation**

Create a validation script to check all API keys:

```bash
# Run validation
npm run validate:env
```

## Security Considerations

### 1. **API Key Security**
- Never commit API keys to version control
- Use environment variables only
- Rotate keys regularly
- Monitor API usage and costs

### 2. **Rate Limiting**
- Implement rate limiting on all endpoints
- Monitor for abuse and unusual patterns
- Set appropriate limits for each service

### 3. **CORS Configuration**
- Configure CORS for production domains only
- Remove development URLs from production

### 4. **File Upload Security**
- Validate file types and sizes
- Scan uploaded assets for malware
- Implement proper file storage security

## Monitoring & Analytics

### 1. **API Usage Monitoring**
- Monitor ElevenLabs usage and costs
- Track Replicate API calls and spending
- Monitor OpenAI token usage

### 2. **Application Monitoring**
- Set up error tracking (Sentry, Bugsnag)
- Monitor performance metrics
- Track user engagement and analytics

### 3. **Cost Management**
- Set up billing alerts for all services
- Monitor daily/monthly spending
- Implement usage quotas if needed

## Testing Production Setup

### 1. **API Key Validation**
```bash
# Test ElevenLabs
curl -X POST https://your-backend.com/api/voices/generate \
  -H "Content-Type: application/json" \
  -d '{"text": "Test voice", "voiceId": "narrator-classic"}'

# Test Replicate
curl -X POST https://your-backend.com/api/assets/generate \
  -H "Content-Type: application/json" \
  -d '{"gameId": "test", "assetType": "background", "style": "realistic"}'

# Test OpenAI
curl -X POST https://your-ai-service.com/api/generate-game \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A simple racing game"}'
```

### 2. **Feature Testing**
- Test voice generation in games
- Test asset generation and selection
- Test analytics tracking
- Test viral sharing features

## Cost Estimation

### **Monthly Costs (Estimated)**

#### ElevenLabs:
- Free tier: 10,000 characters/month
- Paid plans: $5-22/month for higher usage

#### Replicate:
- Stable Diffusion: ~$0.0023 per image
- Estimated: $5-20/month for moderate usage

#### OpenAI:
- GPT-4: ~$0.03 per 1K tokens
- Estimated: $10-50/month for game generation

#### **Total Estimated Cost: $20-100/month**

## Troubleshooting

### Common Issues:

1. **API Key Not Working**
   - Check key format and validity
   - Verify environment variable names
   - Check API service status

2. **Rate Limiting**
   - Implement exponential backoff
   - Cache responses when possible
   - Monitor usage patterns

3. **Asset Generation Failures**
   - Check Replicate API status
   - Verify image prompts
   - Implement fallback to default assets

4. **Voice Generation Issues**
   - Check ElevenLabs API status
   - Verify voice model availability
   - Test with different voice models

## Support & Resources

- **ElevenLabs Docs**: https://docs.elevenlabs.io/
- **Replicate Docs**: https://replicate.com/docs
- **OpenAI Docs**: https://platform.openai.com/docs
- **Project Issues**: Create GitHub issues for bugs
- **Community**: Join Discord for support

## Next Steps

1. Set up all required API keys
2. Configure production environment variables
3. Deploy to your chosen platform
4. Test all features with real API keys
5. Monitor usage and costs
6. Set up monitoring and alerts
7. Implement backup and recovery procedures

This setup ensures your Roam Game Super App is production-ready with all AI features fully functional!
