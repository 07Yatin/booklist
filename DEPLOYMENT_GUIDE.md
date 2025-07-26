# 🚀 Deployment Guide - Environment Configuration

## 📋 Overview

The application now uses environment-based configuration, making deployment much easier. You no longer need to change hardcoded URLs throughout the codebase.

## 🔧 Configuration System

### **Configuration File: `frontend/src/config.js`**
```javascript
const config = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000',
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};
```

### **Environment Variables:**
- `REACT_APP_API_BASE_URL`: Backend API URL
- `REACT_APP_SOCKET_URL`: Socket.io connection URL
- `NODE_ENV`: Environment (development/production)

## 🌐 Deployment Options

### **Option 1: Heroku Deployment**

#### **Frontend (Vercel/Netlify):**
1. **Set Environment Variables:**
   ```bash
   # In your hosting platform dashboard
   REACT_APP_API_BASE_URL=https://your-backend-app.herokuapp.com
   REACT_APP_SOCKET_URL=https://your-backend-app.herokuapp.com
   ```

2. **Build Command:**
   ```bash
   npm run build
   ```

#### **Backend (Heroku):**
1. **Deploy to Heroku:**
   ```bash
   heroku create your-backend-app
   git push heroku main
   ```

2. **Set Environment Variables:**
   ```bash
   heroku config:set NODE_ENV=production
   ```

### **Option 2: Railway + Vercel**

#### **Backend (Railway):**
1. **Connect Repository**
2. **Set Root Directory:** `backend`
3. **Environment Variables:**
   ```bash
   NODE_ENV=production
   ```

#### **Frontend (Vercel):**
1. **Connect Repository**
2. **Set Root Directory:** `frontend`
3. **Environment Variables:**
   ```bash
   REACT_APP_API_BASE_URL=https://your-railway-app.up.railway.app
   REACT_APP_SOCKET_URL=https://your-railway-app.up.railway.app
   ```

### **Option 3: Docker Deployment**

#### **Create Dockerfile for Frontend:**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Set environment variables
ENV REACT_APP_API_BASE_URL=https://your-backend-domain.com
ENV REACT_APP_SOCKET_URL=https://your-backend-domain.com

EXPOSE 3000
CMD ["npm", "start"]
```

#### **Docker Compose:**
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_BASE_URL=http://backend:4000
      - REACT_APP_SOCKET_URL=http://backend:4000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    volumes:
      - ./backend/books.json:/app/books.json
```

## 🔄 Environment File Setup

### **Development (Local):**
```bash
# Copy development environment file
cp frontend/env.development frontend/.env.local

# Or set environment variables directly
export REACT_APP_API_BASE_URL=http://localhost:4000
export REACT_APP_SOCKET_URL=http://localhost:4000
```

### **Production:**
```bash
# Copy production environment file
cp frontend/env.production frontend/.env.production

# Edit the file with your actual URLs
REACT_APP_API_BASE_URL=https://your-backend-domain.com
REACT_APP_SOCKET_URL=https://your-backend-domain.com
```

## 🎯 Quick Deployment Steps

### **1. Prepare Backend:**
```bash
cd backend
# Deploy to your chosen platform (Heroku, Railway, etc.)
# Get the deployed URL
```

### **2. Configure Frontend:**
```bash
cd frontend
# Set environment variables with your backend URL
REACT_APP_API_BASE_URL=https://your-backend-url.com
REACT_APP_SOCKET_URL=https://your-backend-url.com
```

### **3. Deploy Frontend:**
```bash
npm run build
# Deploy build folder to your hosting platform
```

## 🔍 Verification

### **Check Configuration:**
```javascript
// In browser console
console.log('API URL:', process.env.REACT_APP_API_BASE_URL);
console.log('Socket URL:', process.env.REACT_APP_SOCKET_URL);
```

### **Test Connection:**
1. Open browser developer tools
2. Check Network tab for API calls
3. Verify Socket.io connection in Console

## 🛠 Troubleshooting

### **Common Issues:**

#### **1. CORS Errors:**
```javascript
// Backend CORS configuration
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
```

#### **2. Environment Variables Not Loading:**
- Ensure variables start with `REACT_APP_`
- Restart development server after changes
- Check for typos in variable names

#### **3. Socket.io Connection Issues:**
- Verify both URLs are the same
- Check for HTTPS/HTTP mismatches
- Ensure backend is running

## 📝 Environment File Templates

### **`.env.local` (Development):**
```env
REACT_APP_API_BASE_URL=http://localhost:4000
REACT_APP_SOCKET_URL=http://localhost:4000
```

### **`.env.production` (Production):**
```env
REACT_APP_API_BASE_URL=https://your-backend-domain.com
REACT_APP_SOCKET_URL=https://your-backend-domain.com
```

## 🎉 Benefits

✅ **No Code Changes**: Deploy without modifying source code  
✅ **Environment Specific**: Different configs for dev/prod  
✅ **Easy Updates**: Change URLs via environment variables  
✅ **Secure**: No hardcoded URLs in production  
✅ **Flexible**: Works with any hosting platform  

---

**Note**: Always test your configuration in a staging environment before deploying to production! 