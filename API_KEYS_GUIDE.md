# API Keys Setup Guide

## 🚨 **CRITICAL: Production Deployment Requires Real API Keys**

The Roam Game Super App uses several AI services that require API keys for full functionality. **Without proper API keys, the app will run in demo mode with limited features.**

## Required API Keys

### 1. **ElevenLabs API** 🎤
**Purpose**: AI voice narration for games
- **Required for**: Game intros, event announcements, character voices
- **Get API Key**: https://elevenlabs.io/
- **Cost**: Free tier (10,000 characters/month), paid plans from $5/month
- **Environment Variable**: `ELEVENLABS_API_KEY`

#### Setup Steps:
1. Go to https://elevenlabs.io/
2. Sign up for a free account
3. Navigate to Profile → API Keys
4. Create a new API key
5. Copy the key and add to `backend/.env`:
   ```env
   ELEVENLABS_API_KEY=your_actual_api_key_here
   ```

#### Voice Models Available:
- `narrator-classic`: Professional narrator voice
- `character-energetic`: Energetic character voice  
- `announcer-dramatic`: Dramatic announcer voice
- `guide-friendly`: Friendly guide voice

---

### 2. **Replicate API** 🎨
**Purpose**: AI-generated game assets (backgrounds, sprites)
- **Required for**: Custom game assets, visual customization
- **Get API Key**: https://replicate.com/
- **Cost**: Pay-per-use (~$0.0023 per image), very affordable
- **Environment Variable**: `REPLICATE_API_TOKEN`

#### Setup Steps:
1. Go to https://replicate.com/
2. Sign up for an account
3. Navigate to Account → API Tokens
4. Create a new token
5. Copy the token and add to `backend/.env`:
   ```env
   REPLICATE_API_TOKEN=your_actual_token_here
   ```

#### Available Models:
- `stability-ai/stable-diffusion`: High-quality image generation
- `stability-ai/sdxl`: Latest Stable Diffusion XL
- `runwayml/stable-diffusion`: Alternative model

---

### 3. **OpenAI API** 🤖
**Purpose**: AI-powered game logic and content generation
- **Required for**: Advanced game generation, content analysis
- **Get API Key**: https://platform.openai.com/
- **Cost**: Pay-per-token (~$0.03 per 1K tokens), reasonable for game generation
- **Environment Variable**: `OPENAI_API_KEY`

#### Setup Steps:
1. Go to https://platform.openai.com/
2. Sign up for an account
3. Navigate to API Keys
4. Create a new secret key
5. Copy the key and add to `ai/.env`:
   ```env
   OPENAI_API_KEY=your_actual_api_key_here
   ```

#### Recommended Models:
- `gpt-4`: Best quality for game generation
- `gpt-3.5-turbo`: Faster and cheaper alternative

---

## Environment Configuration

### Backend Environment (`backend/.env`)
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

# Security (Generate secure random strings)
JWT_SECRET=your-super-secure-jwt-secret-here
SESSION_SECRET=your-super-secure-session-secret-here

# CORS Configuration
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### AI Service Environment (`ai/.env`)
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
```

### Frontend Environment (`frontend/.env`)
```env
# API URLs
VITE_BACKEND_URL=https://your-backend.com
VITE_AI_SERVICE_URL=https://your-ai-service.com
VITE_SOCKET_URL=https://your-backend.com

# Feature Flags
VITE_ENABLE_AI_ASSETS=true
VITE_ENABLE_VOICE_NARRATION=true
VITE_ENABLE_ANALYTICS=true
```

---

## Cost Estimation

### **Monthly Costs (Estimated)**

| Service | Free Tier | Paid Plans | Estimated Monthly Cost |
|---------|-----------|------------|----------------------|
| **ElevenLabs** | 10,000 chars/month | $5-22/month | $5-20 |
| **Replicate** | Pay-per-use | ~$0.0023/image | $5-20 |
| **OpenAI** | Pay-per-token | ~$0.03/1K tokens | $10-50 |

### **Total Estimated Cost: $20-100/month**

*Costs depend on usage. Start with free tiers and scale as needed.*

---

## Validation & Testing

### 1. **Validate Environment**
```bash
npm run validate:env
```

### 2. **Test API Keys**
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

### 3. **Feature Testing Checklist**
- [ ] Voice generation in games
- [ ] Asset generation and selection
- [ ] Analytics tracking
- [ ] Viral sharing features
- [ ] Game remixing functionality

---

## Security Best Practices

### 🔒 **API Key Security**
- ✅ Never commit API keys to version control
- ✅ Use environment variables only
- ✅ Rotate keys regularly
- ✅ Monitor API usage and costs
- ✅ Use different keys for development/production

### 🛡️ **Production Security**
- ✅ Configure CORS for production domains only
- ✅ Implement rate limiting on all endpoints
- ✅ Set up monitoring and alerts
- ✅ Use HTTPS for all API communications
- ✅ Validate file uploads and scan for malware

---

## Troubleshooting

### Common Issues:

#### **"API Key Not Working"**
- Check key format and validity
- Verify environment variable names
- Check API service status pages
- Ensure keys are not expired

#### **"Rate Limiting"**
- Implement exponential backoff
- Cache responses when possible
- Monitor usage patterns
- Upgrade to higher tier plans if needed

#### **"Asset Generation Failures"**
- Check Replicate API status
- Verify image prompts are appropriate
- Implement fallback to default assets
- Check file size limits

#### **"Voice Generation Issues"**
- Check ElevenLabs API status
- Verify voice model availability
- Test with different voice models
- Check audio file permissions

---

## Support & Resources

### **Documentation**
- [ElevenLabs Docs](https://docs.elevenlabs.io/)
- [Replicate Docs](https://replicate.com/docs)
- [OpenAI Docs](https://platform.openai.com/docs)

### **Community Support**
- Create GitHub issues for bugs
- Join Discord for community support
- Check service status pages for outages

### **Cost Management**
- Set up billing alerts for all services
- Monitor daily/monthly spending
- Implement usage quotas if needed
- Use free tiers for development

---

## Quick Start Commands

```bash
# 1. Clone and setup
git clone <your-repo>
cd MiniRo
npm run install:all

# 2. Configure API keys
cp backend/env.example backend/.env
cp ai/env.example ai/.env
# Edit .env files with your API keys

# 3. Validate setup
npm run validate:env

# 4. Build and deploy
npm run build:all
npm start

# 5. Test production
npm run validate:env
```

---

## 🚀 **Ready for Production!**

Once you've configured all API keys and validated the environment, your Roam Game Super App will be fully functional with:

- ✅ **AI-powered asset generation** with Stable Diffusion
- ✅ **Dynamic voice narration** with ElevenLabs
- ✅ **Intelligent game generation** with OpenAI
- ✅ **Enhanced analytics** with real-time tracking
- ✅ **Viral sharing** with QR codes and social media
- ✅ **Game remixing** with comprehensive modification tools
- ✅ **Real-time multiplayer** with Socket.io

**Your AI-native game engine is ready to create amazing multiplayer experiences!** 🎮✨
