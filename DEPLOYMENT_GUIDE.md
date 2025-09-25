# 🚀 Production Deployment Guide

## **Vercel + Railway Setup (Free Tiers)**

### **Architecture Overview**
- **Frontend**: Vercel (React + Vite)
- **Backend**: Railway (Node.js + Express + Socket.io)
- **AI Service**: Railway (OpenAI + Game Generation)
- **Database**: Railway PostgreSQL (optional)
- **Cache**: Railway Redis (optional)

---

## **Step 1: Deploy Backend to Railway**

### **1.1 Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### **1.2 Deploy Backend**
1. **Connect GitHub Repository**
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Choose the `backend` folder

2. **Set Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend.vercel.app
   AI_SERVICE_URL=https://your-ai-service.railway.app
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   REPLICATE_API_TOKEN=your_replicate_api_token_here
   AI_API_KEY=your_openai_api_key_here
   ```

3. **Get Backend URL**
   - Railway will provide: `https://your-backend.railway.app`
   - Save this URL for frontend configuration

---

## **Step 2: Deploy AI Service to Railway**

### **2.1 Create Second Railway Project**
1. Create another Railway project
2. Connect the same GitHub repository
3. Choose the `ai` folder

### **2.2 Set Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=5001
   FRONTEND_URL=https://your-frontend.vercel.app
   BACKEND_URL=https://your-backend.railway.app
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### **2.3 Get AI Service URL**
   - Railway will provide: `https://your-ai-service.railway.app`
   - Save this URL for frontend configuration

---

## **Step 3: Deploy Frontend to Vercel**

### **3.1 Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository

### **3.2 Configure Frontend**
1. **Set Root Directory**
   - In Vercel project settings
   - Set "Root Directory" to `frontend`

2. **Set Environment Variables**
   ```bash
   VITE_BACKEND_URL=https://your-backend.railway.app
   VITE_AI_SERVICE_URL=https://your-ai-service.railway.app
   VITE_SOCKET_URL=https://your-backend.railway.app
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - You'll get: `https://your-project.vercel.app`

---

## **Step 4: Update URLs and Test**

### **4.1 Update Backend Environment**
Update your Railway backend environment variables with the actual Vercel URL:
```bash
FRONTEND_URL=https://your-project.vercel.app
```

### **4.2 Update AI Service Environment**
Update your Railway AI service environment variables:
```bash
FRONTEND_URL=https://your-project.vercel.app
BACKEND_URL=https://your-backend.railway.app
```

### **4.3 Test Deployment**
1. **Health Checks**
   - Backend: `https://your-backend.railway.app/health`
   - AI Service: `https://your-ai-service.railway.app/health`

2. **Test Features**
   - Create a game
   - Test voice generation
   - Test asset generation
   - Test multiplayer functionality

---

## **Step 5: Optional Database Setup**

### **5.1 Add PostgreSQL to Railway**
1. In your Railway backend project
2. Click "New" → "Database" → "PostgreSQL"
3. Railway will automatically provide `DATABASE_URL`

### **5.2 Add Redis to Railway**
1. In your Railway backend project
2. Click "New" → "Database" → "Redis"
3. Railway will automatically provide `REDIS_URL`

---

## **Step 6: Custom Domain (Optional)**

### **6.1 Vercel Custom Domain**
1. Go to Vercel project settings
2. Add your custom domain
3. Update environment variables with new domain

### **6.2 Railway Custom Domain**
1. Go to Railway project settings
2. Add custom domain
3. Update environment variables

---

## **Environment Variables Summary**

### **Vercel (Frontend)**
```bash
VITE_BACKEND_URL=https://your-backend.railway.app
VITE_AI_SERVICE_URL=https://your-ai-service.railway.app
VITE_SOCKET_URL=https://your-backend.railway.app
```

### **Railway (Backend)**
```bash
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-project.vercel.app
AI_SERVICE_URL=https://your-ai-service.railway.app
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
REPLICATE_API_TOKEN=your_replicate_api_token_here
AI_API_KEY=your_openai_api_key_here
```

### **Railway (AI Service)**
```bash
NODE_ENV=production
PORT=5001
FRONTEND_URL=https://your-project.vercel.app
BACKEND_URL=https://your-backend.railway.app
OPENAI_API_KEY=your_openai_api_key_here
```

---

## **Cost Breakdown (Free Tiers)**

### **Vercel**
- ✅ **Free**: 100GB bandwidth/month
- ✅ **Free**: Unlimited deployments
- ✅ **Free**: Custom domains

### **Railway**
- ✅ **Free**: $5 credit/month (enough for small apps)
- ✅ **Free**: PostgreSQL database
- ✅ **Free**: Redis cache
- ✅ **Free**: Custom domains

### **Total Monthly Cost: $0** 🎉

---

## **Local Development**

### **Using Docker Compose**
```bash
# Start all services locally
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **Using npm**
```bash
# Install dependencies
npm run install:all

# Start development servers
npm run dev
```

---

## **Troubleshooting**

### **Common Issues**

1. **CORS Errors**
   - Check that `FRONTEND_URL` is set correctly in backend
   - Ensure URLs match exactly (including https/http)

2. **Socket.io Connection Issues**
   - Verify `VITE_SOCKET_URL` points to backend
   - Check Railway logs for connection errors

3. **API Key Issues**
   - Verify all API keys are set in Railway
   - Check API key permissions

4. **Build Failures**
   - Check Railway build logs
   - Verify all dependencies are in package.json

### **Monitoring**
- **Railway**: Built-in metrics and logs
- **Vercel**: Built-in analytics and performance monitoring
- **Health Checks**: Use `/health` endpoints to monitor services

---

## **Next Steps After Deployment**

1. **Test All Features**
   - Game generation
   - Voice narration
   - Asset generation
   - Multiplayer functionality
   - Analytics tracking

2. **Set Up Monitoring**
   - Configure alerts for service downtime
   - Monitor API usage and costs

3. **Optimize Performance**
   - Enable CDN for static assets
   - Optimize database queries
   - Implement caching strategies

4. **Scale as Needed**
   - Upgrade Railway plan if needed
   - Add more database connections
   - Implement load balancing

**Your Roam Game Super App is now production-ready!** 🚀
