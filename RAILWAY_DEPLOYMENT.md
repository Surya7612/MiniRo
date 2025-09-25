# 🚂 Railway Deployment Guide

## **Deploying Your Roam Game Super App to Railway**

Railway requires separate deployments for each service. Here's how to deploy each component:

---

## **Method 1: Deploy Each Service Separately (Recommended)**

### **Step 1: Deploy Backend Service**

1. **Create New Railway Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `MiniRo` repository

2. **Configure Backend Deployment**
   - In Railway project settings, set:
     - **Root Directory**: `backend`
     - **Build Command**: `npm run build`
     - **Start Command**: `npm start`

3. **Set Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend.vercel.app
   AI_SERVICE_URL=https://your-ai-service.railway.app
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   REPLICATE_API_TOKEN=your_replicate_api_token_here
   AI_API_KEY=your_openai_api_key_here
   ```

4. **Deploy**
   - Railway will automatically build and deploy
   - Save the URL: `https://your-backend.railway.app`

### **Step 2: Deploy AI Service**

1. **Create Second Railway Project**
   - Create another new project
   - Connect the same GitHub repository
   - Set **Root Directory**: `ai`

2. **Set Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=5001
   FRONTEND_URL=https://your-frontend.vercel.app
   BACKEND_URL=https://your-backend.railway.app
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Deploy**
   - Save the URL: `https://your-ai-service.railway.app`

### **Step 3: Deploy Frontend to Vercel**

1. **Go to Vercel**
   - Import your GitHub repository
   - Set **Root Directory**: `frontend`

2. **Set Environment Variables**
   ```bash
   VITE_BACKEND_URL=https://your-backend.railway.app
   VITE_AI_SERVICE_URL=https://your-ai-service.railway.app
   VITE_SOCKET_URL=https://your-backend.railway.app
   ```

---

## **Method 2: Use Root Dockerfile (Alternative)**

If you want to use the root Dockerfile, you can deploy the backend service:

1. **Create Railway Project**
   - Connect your GitHub repository
   - Railway will automatically detect the root `Dockerfile`
   - This will deploy the backend service

2. **Set Environment Variables** (same as above)

---

## **Method 3: Monorepo with Railway (Advanced)**

For a more advanced setup, you can use Railway's monorepo features:

1. **Create Railway Project**
   - Connect your GitHub repository
   - In project settings, add multiple services:
     - Service 1: Backend (Root Directory: `backend`)
     - Service 2: AI Service (Root Directory: `ai`)

2. **Configure Each Service**
   - Set different environment variables for each
   - Configure different ports and health checks

---

## **Environment Variables Reference**

### **Backend Service**
```bash
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
AI_SERVICE_URL=https://your-ai-service.railway.app
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
REPLICATE_API_TOKEN=your_replicate_api_token_here
AI_API_KEY=your_openai_api_key_here
```

### **AI Service**
```bash
NODE_ENV=production
PORT=5001
FRONTEND_URL=https://your-frontend.vercel.app
BACKEND_URL=https://your-backend.railway.app
OPENAI_API_KEY=your_openai_api_key_here
```

### **Frontend (Vercel)**
```bash
VITE_BACKEND_URL=https://your-backend.railway.app
VITE_AI_SERVICE_URL=https://your-ai-service.railway.app
VITE_SOCKET_URL=https://your-backend.railway.app
```

---

## **Troubleshooting**

### **Common Issues**

1. **"Dockerfile does not exist"**
   - Make sure you set the correct Root Directory
   - Use `backend` for backend service
   - Use `ai` for AI service

2. **Build Failures**
   - Check that all dependencies are in package.json
   - Verify Node.js version compatibility
   - Check Railway build logs

3. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify API key permissions

4. **Port Issues**
   - Backend should use port 5000
   - AI service should use port 5001
   - Railway will automatically assign public URLs

### **Health Checks**

Test your deployments:
- **Backend**: `https://your-backend.railway.app/health`
- **AI Service**: `https://your-ai-service.railway.app/health`

---

## **Cost Optimization**

### **Railway Free Tier**
- $5 credit per month
- Enough for small applications
- Automatic scaling

### **Tips to Stay Free**
- Use efficient Docker images
- Optimize build times
- Monitor resource usage
- Use Railway's built-in monitoring

---

## **Next Steps After Deployment**

1. **Test All Services**
   - Verify health checks
   - Test API endpoints
   - Check Socket.io connections

2. **Update URLs**
   - Update frontend environment variables
   - Update backend with frontend URL
   - Update AI service with backend URL

3. **Monitor Performance**
   - Use Railway's built-in metrics
   - Set up alerts for downtime
   - Monitor API usage

4. **Scale as Needed**
   - Upgrade Railway plan if needed
   - Add database services
   - Implement caching

**Your Roam Game Super App is now ready for Railway deployment!** 🚂✨
