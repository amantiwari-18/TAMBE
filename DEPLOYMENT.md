# Tambe Global - Deployment Guide

## Prerequisites
- Git installed
- GitHub account
- Domain: tambeglobal.com (optional, can use free subdomain)

---

## 1. DATABASE SETUP (MongoDB Atlas - FREE)

### Step 1: Create MongoDB Atlas Account
```bash
# Go to: https://www.mongodb.com/cloud/atlas/register
# Click "Sign Up" and create free account
```

### Step 2: Create Free Cluster
1. Choose "FREE" tier (M0)
2. Select region closest to you
3. Cluster name: `tambe-cluster`
4. Click "Create"

### Step 3: Get Connection String
1. Click "Connect"
2. Choose "Connect your application"
3. Copy connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/tambe_db
   ```
4. Save this for backend deployment!

---

## 2. BACKEND DEPLOYMENT (Render - FREE)

### Step 1: Prepare Backend for Deployment

Create `render.yaml` in project root:
```bash
cd /app
cat > render.yaml << 'EOF'
services:
  - type: web
    name: tambe-backend
    env: python
    buildCommand: cd backend && pip install -r requirements.txt
    startCommand: cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: MONGO_URL
        sync: false
      - key: DB_NAME
        value: tambe_db
      - key: ADMIN_PASSWORD
        sync: false
      - key: CORS_ORIGINS
        value: "*"
      - key: PYTHON_VERSION
        value: 3.11.0
EOF
```

### Step 2: Push to GitHub
```bash
# Initialize git (if not already)
cd /app
git init
git add .
git commit -m "Initial commit for deployment"

# Create GitHub repo and push
# Go to: https://github.com/new
# Create repo named: tambe-global
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/tambe-global.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Render
```bash
# Go to: https://render.com/
# 1. Sign up with GitHub
# 2. Click "New +" → "Web Service"
# 3. Connect your GitHub repo: tambe-global
# 4. Configure:
#    - Name: tambe-backend
#    - Root Directory: backend
#    - Environment: Python 3
#    - Build Command: pip install -r requirements.txt
#    - Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
#    - Instance Type: FREE
# 5. Add Environment Variables:
#    MONGO_URL=your_mongodb_atlas_connection_string
#    DB_NAME=tambe_db
#    ADMIN_PASSWORD=your_secure_password
#    CORS_ORIGINS=*
# 6. Click "Create Web Service"
# 7. Wait 5-10 minutes for deployment
# 8. Copy your backend URL: https://tambe-backend.onrender.com
```

---

## 3. FRONTEND DEPLOYMENT (Vercel - FREE)

### Step 1: Update Backend URL
```bash
cd /app/frontend
# Update .env with your Render backend URL
cat > .env << 'EOF'
REACT_APP_BACKEND_URL=https://tambe-backend.onrender.com
EOF
```

### Step 2: Create Vercel Configuration
```bash
cd /app
cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://tambe-backend.onrender.com/api/:path*"
    }
  ]
}
EOF
```

### Step 3: Update package.json for Vercel
```bash
cd /app/frontend
# Add build script
npm pkg set scripts.build="react-scripts build"
npm pkg set scripts.vercel-build="react-scripts build"
```

### Step 4: Commit and Push Changes
```bash
cd /app
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### Step 5: Deploy on Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd /app/frontend
vercel --prod

# Follow prompts:
# - Link to existing project? No
# - Project name: tambe-global
# - Directory: ./
# - Override settings? No
# - Deploy? Yes

# Your site will be live at: https://tambe-global.vercel.app
```

**OR Deploy via Vercel Dashboard (Easier):**
```bash
# 1. Go to: https://vercel.com/signup
# 2. Sign up with GitHub
# 3. Click "Add New" → "Project"
# 4. Import your GitHub repo: tambe-global
# 5. Configure:
#    - Framework Preset: Create React App
#    - Root Directory: frontend
#    - Build Command: yarn build
#    - Output Directory: build
#    - Install Command: yarn install
# 6. Environment Variables:
#    REACT_APP_BACKEND_URL=https://tambe-backend.onrender.com
# 7. Click "Deploy"
# 8. Wait 2-3 minutes
# 9. Your site: https://tambe-global.vercel.app
```

---

## 4. CUSTOM DOMAIN SETUP (tambeglobal.com)

### For Vercel (Frontend):
```bash
# 1. Go to Vercel dashboard → Your project → Settings → Domains
# 2. Add domain: tambeglobal.com
# 3. Add DNS records to your domain registrar:
#    Type: A
#    Name: @
#    Value: 76.76.21.21
#
#    Type: CNAME
#    Name: www
#    Value: cname.vercel-dns.com
# 4. Wait 24-48 hours for DNS propagation
```

### For Render (Backend):
```bash
# 1. Go to Render dashboard → Your service → Settings
# 2. Add custom domain: api.tambeglobal.com
# 3. Add DNS record to your domain registrar:
#    Type: CNAME
#    Name: api
#    Value: tambe-backend.onrender.com
# 4. Update frontend .env:
#    REACT_APP_BACKEND_URL=https://api.tambeglobal.com
```

---

## 5. QUICK DEPLOY COMMANDS (All-in-One)

### Initial Setup:
```bash
# 1. Set up MongoDB Atlas (manual - see section 1)

# 2. Deploy Backend to Render
cd /app
git init
git add .
git commit -m "Deploy to Render"
git remote add origin https://github.com/YOUR_USERNAME/tambe-global.git
git push -u origin main
# Then deploy via Render dashboard (see section 2)

# 3. Deploy Frontend to Vercel
cd /app/frontend
vercel --prod
```

### Update Deployment:
```bash
# After making changes
cd /app
git add .
git commit -m "Update features"
git push origin main
# Auto-deploys on Render and Vercel!
```

---

## 6. ALTERNATIVE: Railway (Backend + Frontend + DB - All Free)

### One-Command Deploy:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy everything
cd /app
railway init
railway up

# Link domain
railway domain
```

---

## 7. ENVIRONMENT VARIABLES CHECKLIST

### Backend (Render):
```env
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/tambe_db
DB_NAME=tambe_db
ADMIN_PASSWORD=your_secure_password
CORS_ORIGINS=https://tambeglobal.com,https://www.tambeglobal.com
```

### Frontend (Vercel):
```env
REACT_APP_BACKEND_URL=https://tambe-backend.onrender.com
```

---

## 8. POST-DEPLOYMENT CHECKLIST

- [ ] Backend is live: Test https://tambe-backend.onrender.com/api/
- [ ] Frontend is live: Test https://tambe-global.vercel.app
- [ ] MongoDB connected: Check backend logs
- [ ] Admin login works: /admin/login
- [ ] Initialize hero slides: /admin/hero
- [ ] Initialize products: /admin/products
- [ ] Update WhatsApp number: /admin/settings
- [ ] Test contact form
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic on Vercel/Render)

---

## 9. TROUBLESHOOTING

### Backend not starting:
```bash
# Check Render logs
# Common issues:
# 1. Wrong Python version → Set to 3.11
# 2. Missing dependencies → Check requirements.txt
# 3. MongoDB connection → Verify MONGO_URL
```

### Frontend not loading:
```bash
# Check Vercel logs
# Common issues:
# 1. Wrong build command → Should be: react-scripts build
# 2. Wrong directory → Should be: frontend
# 3. Backend URL → Check REACT_APP_BACKEND_URL
```

### CORS errors:
```bash
# Update backend CORS_ORIGINS to include your frontend domain
```

---

## 10. COST BREAKDOWN

| Service | Free Tier | Limits |
|---------|-----------|--------|
| MongoDB Atlas | ✅ Free | 512MB storage |
| Render | ✅ Free | 750 hours/month, sleeps after 15min inactivity |
| Vercel | ✅ Free | Unlimited bandwidth, 100GB storage |
| **TOTAL** | **$0/month** | Perfect for production! |

---

## Support

If deployment fails, share the error logs and I'll help debug!

**Live URLs after deployment:**
- Frontend: https://tambe-global.vercel.app (or tambeglobal.com)
- Backend: https://tambe-backend.onrender.com
- Admin: https://tambeglobal.com/admin
