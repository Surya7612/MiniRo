# 🎮 MiniRo

**AI-native, mobile-first game engine for instant 3D multiplayer game creation**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-org/roam-game-super-app)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue)](https://www.typescriptlang.org/)

<img width="2880" height="1552" alt="image" src="https://github.com/user-attachments/assets/3cbf423e-2237-49d5-9a3e-77eb0c7017be" />

## ✨ Features

- 🤖 **AI-Powered Game Generation** - Create games from natural language prompts
- 🎨 **Dynamic Asset Generation** - AI-generated backgrounds, sprites, and textures
- 🎤 **Voice Narration** - Dynamic AI voice for game intros and events
- 🌐 **Real-time Multiplayer** - Socket.io powered multiplayer sessions
- 📱 **Mobile-First Design** - Optimized for mobile devices
- 🔄 **Viral Sharing & Remixing** - Share games and remix existing ones
- 📊 **Analytics & Tracking** - Comprehensive game analytics
- 🎯 **3D Game Engine** - Three.js powered 3D game rendering

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- API keys for AI services (see [API Keys Guide](API_KEYS_GUIDE.md))

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd MiniRo

# Install all dependencies
npm run install:all

# Setup environment files
cp backend/env.example backend/.env
cp ai/env.example ai/.env
cp frontend/env.example frontend/.env

# Configure API keys (see API_KEYS_GUIDE.md)
# Edit the .env files with your API keys

# Validate configuration
npm run validate:env

# Build the application
npm run build:all

# Start development servers
npm run dev
```

## 🏗️ Architecture

```
MiniRo/
├── frontend/          # React + Three.js frontend
├── backend/           # Node.js + Express + Socket.io backend
├── ai/               # AI service for game generation
├── scripts/          # Utility scripts
└── docs/            # Documentation
```

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Three.js + React Three Fiber
- Zustand (state management)
- Framer Motion (animations)
- Socket.io Client
- Vite (build tool)

**Backend:**
- Node.js + Express
- Socket.io (real-time communication)
- TypeScript
- Zod (validation)
- Multer (file uploads)

**AI Services:**
- OpenAI (game generation)
- ElevenLabs (voice synthesis)
- Replicate (image generation)

## 🔧 Configuration

### Required API Keys

| Service | Purpose | Cost | Required |
|---------|---------|------|----------|
| **ElevenLabs** | Voice narration | Free tier available | ✅ |
| **Replicate** | Image generation | Pay-per-use (~$0.0023/image) | ✅ |
| **OpenAI** | Game generation | Pay-per-token (~$0.03/1K tokens) | ✅ |

See [API_KEYS_GUIDE.md](API_KEYS_GUIDE.md) for detailed setup instructions.

### Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
ELEVENLABS_API_KEY=your_elevenlabs_api_key
REPLICATE_API_TOKEN=your_replicate_token
AI_SERVICE_URL=https://your-ai-service.com
```

**AI Service (`ai/.env`):**
```env
PORT=5001
NODE_ENV=production
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://your-backend.com
```

**Frontend (`frontend/.env`):**
```env
VITE_BACKEND_URL=https://your-backend.com
VITE_AI_SERVICE_URL=https://your-ai-service.com
VITE_SOCKET_URL=https://your-backend.com
```

## 🎮 Usage

### Creating a Game

1. **Enter a Game Prompt**: Describe your game idea in natural language
   ```
   "A multiplayer racing game with power-ups and obstacles in a futuristic city"
   ```

2. **AI Generation**: The system generates:
   - Game logic and rules
   - 3D objects and layout
   - Custom assets (backgrounds, sprites)
   - Voice narration

3. **Play & Share**: 
   - Play the game with friends
   - Share via QR code or link
   - Remix and modify existing games

### Game Features

- **Real-time Multiplayer**: Up to 8 players per game
- **Voice Narration**: Dynamic AI voice for game events
- **Asset Customization**: AI-generated or default assets
- **Analytics**: Track plays, shares, remixes, and engagement
- **Viral Sharing**: QR codes, social media integration

## 📊 Analytics

Track comprehensive game metrics:
- Play count and duration
- Share count and unique shares
- Remix count and engagement
- Player retention and behavior
- Asset usage and preferences

## 🚀 Deployment

### Production Setup

```bash
# Run production setup script
./scripts/setup-production.sh

# Or manually:
npm run validate:env
npm run build:all
npm start
```

### Docker Deployment

```bash
# Build and deploy with Docker
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Manual Deployment

1. **Backend**: Deploy to your Node.js hosting service
2. **AI Service**: Deploy to your AI service hosting
3. **Frontend**: Deploy `dist/` folder to your web server

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific tests
npm run test:frontend
npm run test:backend

# Validate environment
npm run validate:env
```

## 📚 Documentation

- [Production Setup Guide](PRODUCTION_SETUP.md) - Complete production deployment guide
- [API Keys Guide](API_KEYS_GUIDE.md) - API key setup and configuration
- [Architecture Overview](docs/ARCHITECTURE.md) - Technical architecture details
- [API Documentation](docs/API.md) - Backend API reference
- [Contributing Guide](CONTRIBUTING.md) - How to contribute to the project

## 🔒 Security

- Environment variables for sensitive data
- CORS configuration for production domains
- Rate limiting on all endpoints
- File upload validation and scanning
- API key rotation and monitoring

## 💰 Cost Estimation

**Monthly costs for moderate usage:**
- ElevenLabs: $5-20/month
- Replicate: $5-20/month  
- OpenAI: $10-50/month
- **Total: $20-100/month**

*Start with free tiers and scale as needed*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check the docs folder for detailed guides
- **Community**: Join our Discord for community support

## 🎯 Roadmap

- [ ] Advanced AI game generation
- [ ] More voice models and languages
- [ ] Enhanced asset generation
- [ ] Mobile app development
- [ ] Cloud deployment templates
- [ ] Advanced analytics dashboard
- [ ] Game marketplace
- [ ] Social features and leaderboards

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - React renderer for Three.js
- [ElevenLabs](https://elevenlabs.io/) - AI voice synthesis
- [Replicate](https://replicate.com/) - AI image generation
- [OpenAI](https://openai.com/) - AI game generation
- [Socket.io](https://socket.io/) - Real-time communication

---

**Built with ❤️ for the future of game creation**

*Create, play, and share amazing multiplayer games with the power of AI!* 🎮✨
