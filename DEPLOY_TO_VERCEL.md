# Deploy to Vercel - Step by Step Guide

## Important: Deploy Frontend and Backend Separately!

This is a monorepo with two separate applications. You need to create TWO Vercel projects.

---

## Part 1: Deploy Backend First

### Step 1: Create Backend Project

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repo: `xenondevz1-source/cominghome`
4. Click "Import"

### Step 2: Configure Backend Project

**Project Name:** `cominghome-backend` (or any name you want)

**Framework Preset:** Other

**Root Directory:** Click "Edit" and select `backend`

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Step 3: Add Backend Environment Variables

Click "Environment Variables" and add these:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_random_secret_key_minimum_32_characters
EMAIL_SERVICE=resend
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://your-frontend-will-be-here.vercel.app
NODE_ENV=production
PORT=3000
```

**Important:** 
- Leave `FRONTEND_URL` empty for now, we'll update it after deploying frontend
- Make sure to add variables for ALL environments (Production, Preview, Development)

### Step 4: Deploy Backend

Click "Deploy" and wait for it to finish.

After deployment, copy your backend URL (e.g., `https://cominghome-backend.vercel.app`)

---

## Part 2: Deploy Frontend

### Step 1: Create Frontend Project

1. Go to https://vercel.com/new again
2. Click "Import Git Repository"
3. Select the SAME GitHub repo: `xenondevz1-source/cominghome`
4. Click "Import"

### Step 2: Configure Frontend Project

**Project Name:** `cominghome-frontend` (or any name you want)

**Framework Preset:** Vite

**Root Directory:** Click "Edit" and select `frontend`

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Step 3: Add Frontend Environment Variables

Click "Environment Variables" and add:

```env
VITE_API_URL=https://your-backend-url.vercel.app/api
```

Replace `your-backend-url.vercel.app` with your actual backend URL from Part 1.

**Important:** Add this for ALL environments (Production, Preview, Development)

### Step 4: Deploy Frontend

Click "Deploy" and wait for it to finish.

After deployment, copy your frontend URL (e.g., `https://cominghome-frontend.vercel.app`)

---

## Part 3: Update Backend with Frontend URL

1. Go back to your backend project in Vercel
2. Go to Settings → Environment Variables
3. Find `FRONTEND_URL` and update it with your frontend URL
4. Click "Save"
5. Go to Deployments tab
6. Click the three dots on the latest deployment
7. Click "Redeploy"

---

## Part 4: Set Up Database

You need a PostgreSQL database. Choose one:

### Option A: Vercel Postgres (Easiest)

1. Go to your backend project in Vercel
2. Click "Storage" tab
3. Click "Create Database" → "Postgres"
4. Follow the setup wizard
5. It will automatically add `DATABASE_URL` to your environment variables
6. Skip to "Initialize Database Schema" below

### Option B: Supabase (Free Tier)

1. Go to https://supabase.com
2. Create new project
3. Wait for database to be ready
4. Go to Settings → Database
5. Copy "Connection string" (URI format)
6. Replace `[YOUR-PASSWORD]` with your database password
7. Add to Vercel backend environment variables as `DATABASE_URL`

### Option C: Neon (Serverless)

1. Go to https://neon.tech
2. Create new project
3. Copy connection string
4. Add to Vercel backend environment variables as `DATABASE_URL`

### Initialize Database Schema

After setting up your database, you need to create the tables:

**Method 1: Using Supabase SQL Editor**
1. Go to SQL Editor in Supabase
2. Copy entire content from `database/schema.sql`
3. Paste and click "Run"

**Method 2: Using psql**
```bash
psql "your-database-connection-string" < database/schema.sql
```

**Method 3: Using TablePlus/DBeaver**
1. Connect to your database
2. Open `database/schema.sql`
3. Execute the SQL

---

## Part 5: Set Up Email Service

### Option A: Resend (Recommended)

1. Go to https://resend.com
2. Sign up for free account
3. Go to API Keys
4. Create new API key
5. Add to backend environment variables:
   ```
   EMAIL_SERVICE=resend
   RESEND_API_KEY=re_your_key_here
   EMAIL_FROM=noreply@yourdomain.com
   ```

### Option B: Gmail SMTP

1. Enable 2FA on Gmail
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
3. Add to backend environment variables:
   ```
   EMAIL_SERVICE=smtp
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

---

## Part 6: Generate JWT Secret

You need a secure random string for JWT_SECRET.

**Option 1: Online Generator**
- Go to https://randomkeygen.com/
- Copy a "CodeIgniter Encryption Key" (256-bit)

**Option 2: Command Line**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to backend environment variables:
```
JWT_SECRET=your-generated-secret-here
```

---

## Part 7: Redeploy Both Projects

After adding all environment variables:

1. Go to backend project → Deployments → Redeploy
2. Go to frontend project → Deployments → Redeploy

---

## Testing Your Deployment

### 1. Test Backend Health

Open in browser:
```
https://your-backend.vercel.app/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### 2. Test Frontend

Open in browser:
```
https://your-frontend.vercel.app
```

Should show your homepage.

### 3. Test Registration

1. Go to your frontend URL
2. Click "Register"
3. Fill in username, email, password
4. Click "Create Account"
5. Should redirect to verify email page
6. Check your email for 6-digit code
7. Enter code
8. Should redirect to dashboard

---

## Environment Variables Summary

### Backend (Required):
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-random-secret-minimum-32-chars
EMAIL_SERVICE=resend
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=3000
```

### Frontend (Required):
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## Troubleshooting

### Backend deployment fails
- Check build logs in Vercel
- Make sure `backend/package.json` has all dependencies
- Verify TypeScript compiles: `cd backend && npm run build`

### Frontend deployment fails
- Check build logs in Vercel
- Make sure `frontend/package.json` has all dependencies
- Verify Vite builds: `cd frontend && npm run build`

### Registration shows "Network Error"
- Check `VITE_API_URL` is set correctly in frontend
- Verify backend is deployed and `/health` endpoint works
- Check browser console for CORS errors

### "CORS Error" in browser console
- Verify `FRONTEND_URL` is set in backend environment variables
- Make sure it matches your frontend URL exactly (including https://)
- Redeploy backend after updating

### Database connection fails
- Verify `DATABASE_URL` format is correct
- Check database is running and accessible
- For Supabase: make sure you replaced `[YOUR-PASSWORD]`
- Try adding `?sslmode=require` to connection string

### Email not sent
- For Resend: verify API key is valid
- For Gmail: use App Password, not regular password
- Check backend logs for email errors
- Verify `EMAIL_FROM` domain is verified (for Resend)

### Black screen after registration
- Open browser console (F12) and check for errors
- Verify `VITE_API_URL` is set correctly
- Check Network tab to see if API calls are failing
- Make sure backend `/api/auth/verify` endpoint works

---

## Quick Checklist

Before going live, verify:

- [ ] Backend deployed and `/health` returns OK
- [ ] Frontend deployed and homepage loads
- [ ] Database created and schema initialized
- [ ] All backend environment variables set
- [ ] All frontend environment variables set
- [ ] Email service configured and working
- [ ] JWT_SECRET is secure (32+ characters)
- [ ] FRONTEND_URL matches actual frontend URL
- [ ] VITE_API_URL matches actual backend URL
- [ ] Can register new account
- [ ] Verification email received
- [ ] Can verify email with code
- [ ] Can login after verification

---

## Custom Domains (Optional)

### Add Custom Domain to Frontend

1. Go to frontend project in Vercel
2. Settings → Domains
3. Add your domain (e.g., `yourdomain.com`)
4. Follow DNS configuration instructions
5. Update `FRONTEND_URL` in backend environment variables
6. Redeploy backend

### Add Custom Domain to Backend

1. Go to backend project in Vercel
2. Settings → Domains
3. Add subdomain (e.g., `api.yourdomain.com`)
4. Follow DNS configuration instructions
5. Update `VITE_API_URL` in frontend environment variables
6. Redeploy frontend

---

## Support

If you're still having issues:

1. Check Vercel function logs for errors
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test backend `/health` endpoint
5. Test database connection

Need help? contact@extasy.asia
