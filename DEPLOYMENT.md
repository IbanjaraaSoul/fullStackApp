# 🚀 **Deployment Guide: Vercel + Render + Supabase**

## **Overview**
This guide will help you deploy your full-stack app to:
- **Frontend**: Vercel (free tier)
- **Backend**: Render (free tier)  
- **Database**: Supabase (free tier)

## **Step 1: Set Up Supabase Database**

### 1.1 Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" → "Sign up with GitHub"
3. Authorize Supabase to access your GitHub

### 1.2 Create New Project
1. Click "New Project"
2. Choose your organization
3. **Project Name**: `fullstackapp-prod`
4. **Database Password**: Create a strong password (save this!)
5. **Region**: Choose closest to your users
6. Click "Create new project"

### 1.3 Get Database Credentials
1. Go to **Settings** → **Database**
2. Copy these values:
   - **Host**: `your-project-ref.supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: (the one you created)

### 1.4 Set Up Database Schema
1. Go to **SQL Editor**
2. Run this SQL to create your users table:
```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## **Step 2: Deploy Backend to Render**

### 2.1 Create Render Account
1. Go to [https://render.com](https://render.com)
2. Click "Get Started" → "Sign up with GitHub"
3. Authorize Render to access your GitHub

### 2.2 Create Web Service
1. Click "New" → "Web Service"
2. **Connect your repository**: Select `fullStackApp`
3. **Name**: `fullstackapp-backend`
4. **Environment**: `Node`
5. **Region**: Choose closest to your users
6. **Branch**: `main`
7. **Build Command**: `npm install && npm run build`
8. **Start Command**: `npm run start:prod`
9. **Plan**: `Free`

### 2.3 Configure Environment Variables
In Render dashboard, go to **Environment** and add:
```
NODE_ENV=production
PORT=10000
DB_HOST=your-supabase-host.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password
DB_NAME=postgres
DB_SSL=true
DB_SYNCHRONIZE=false
```

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for build to complete
3. Copy your **Service URL** (e.g., `https://your-app.onrender.com`)

## **Step 3: Deploy Frontend to Vercel**

### 3.1 Create Vercel Account
1. Go to [https://vercel.com](https://vercel.com)
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub

### 3.2 Import Project
1. Click "New Project"
2. **Import Git Repository**: Select `fullStackApp`
3. **Framework Preset**: `Vite`
4. **Root Directory**: `frontend`
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. **Install Command**: `npm install`

### 3.3 Configure Environment Variables
In Vercel dashboard, go to **Settings** → **Environment Variables** and add:
```
VITE_API_BASE_URL=https://your-backend-app.onrender.com
```

### 3.4 Update Vercel Configuration
1. In your `frontend/vercel.json`, replace:
   ```json
   "destination": "https://your-backend-app.onrender.com/$1"
   ```
   with your actual Render backend URL

### 3.5 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Copy your **Vercel URL** (e.g., `https://your-app.vercel.app`)

## **Step 4: Update Frontend API Configuration**

### 4.1 Update API Base URL
In `frontend/src/services/userApi.ts`, update the base URL:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
```

### 4.2 Update Vercel Rewrites
In `frontend/vercel.json`, ensure the backend URL is correct:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-actual-backend-url.onrender.com/$1"
    }
  ]
}
```

## **Step 5: Test Your Deployment**

### 5.1 Test Backend
1. Visit your Render backend URL
2. Test the health endpoint: `https://your-backend.onrender.com/health`
3. Test user endpoints: `https://your-backend.onrender.com/users`

### 5.2 Test Frontend
1. Visit your Vercel frontend URL
2. Try creating a user
3. Check if it connects to your backend
4. Verify data is saved in Supabase

## **Step 6: Connect CI/CD (Optional)**

### 6.1 Enable Auto-Deploy
- **Render**: Automatically deploys when you push to `main`
- **Vercel**: Automatically deploys when you push to `main`

### 6.2 Update GitHub Actions
Your CI/CD pipeline will now show real deployment steps instead of placeholders.

## **🎯 Your Staging App URLs Will Be:**

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.onrender.com`
- **Database**: Supabase dashboard

## **🔧 Troubleshooting**

### Common Issues:
1. **CORS errors**: Ensure backend allows your Vercel domain
2. **Database connection**: Check Supabase credentials and SSL settings
3. **Build failures**: Verify Node.js version compatibility
4. **Environment variables**: Double-check all values are set correctly

### Support:
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Render**: [render.com/docs](https://render.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)

## **🚀 Next Steps**

1. **Follow this guide step by step**
2. **Deploy backend to Render first**
3. **Deploy frontend to Vercel second**
4. **Test your staging app**
5. **Share your live URLs with the team!**

**Your app will be live and accessible from anywhere in the world!** 🌍
