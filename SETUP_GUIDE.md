# Complete Setup Guide for Registration & API

## What You Need for Registration to Work

### 1. PostgreSQL Database
You need a PostgreSQL database with all the required tables.

**Recommended Database Providers:**
- **Vercel Postgres** (easiest for Vercel deployment)
- **Supabase** (free tier, easy setup)
- **Neon** (serverless PostgreSQL)
- **Aiven** (what the project was originally built for)

### 2. Required Environment Variables

Create these environment variables in Vercel:

#### Essential Backend Variables:
```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-random-string-here

# Server
PORT=3000
NODE_ENV=production

# Frontend URL (your Vercel frontend URL)
FRONTEND_URL=https://your-app.vercel.app
```

#### Email Service (REQUIRED for registration):
Choose ONE of these options:

**Option A - Resend (Recommended):**
```env
EMAIL_SERVICE=resend
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
```

**Option B - SMTP (Gmail, etc):**
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

#### Optional - Discord OAuth:
```env
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_REDIRECT_URI=https://your-backend.vercel.app/api/auth/discord/callback
```

#### Frontend Variables:
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## Step-by-Step Setup

### Step 1: Set Up Database

#### Option A: Vercel Postgres (Easiest)

1. Go to your Vercel project dashboard
2. Click "Storage" tab
3. Click "Create Database" → "Postgres"
4. Copy the connection string
5. It will automatically add `DATABASE_URL` to your environment variables

#### Option B: Supabase (Free Tier)

1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the "Connection string" (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password

#### Option C: Neon (Serverless)

1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string from the dashboard

### Step 2: Initialize Database Schema

After getting your database, you need to create the tables:

**Method 1: Using Supabase SQL Editor**
1. Go to SQL Editor in Supabase
2. Copy the entire content from `database/schema.sql`
3. Paste and run it

**Method 2: Using psql command line**
```bash
psql "your-database-url" < database/schema.sql
```

**Method 3: Using a PostgreSQL client**
- Use TablePlus, DBeaver, or pgAdmin
- Connect to your database
- Run the SQL from `database/schema.sql`

### Step 3: Set Up Email Service

#### Option A: Resend (Recommended)

1. Go to https://resend.com
2. Sign up for free account
3. Go to API Keys
4. Create a new API key
5. Add to Vercel environment variables:
   ```
   EMAIL_SERVICE=resend
   RESEND_API_KEY=re_your_key_here
   EMAIL_FROM=noreply@yourdomain.com
   ```

#### Option B: Gmail SMTP

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security
   - 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Add to Vercel environment variables:
   ```
   EMAIL_SERVICE=smtp
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

### Step 4: Generate JWT Secret

Generate a secure random string for JWT_SECRET:

**Option 1: Online**
- Go to https://randomkeygen.com/
- Copy a "CodeIgniter Encryption Key"

**Option 2: Command line**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to Vercel:
```
JWT_SECRET=your-generated-secret-here
```

### Step 5: Configure Vercel Project

1. Go to your Vercel project settings
2. Go to "Environment Variables"
3. Add ALL the variables from Step 2
4. Make sure to add them for all environments (Production, Preview, Development)

### Step 6: Deploy Backend

You need to deploy the backend separately:

**Create `backend/vercel.json`:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ]
}
```

**Deploy backend:**
1. Create a new Vercel project for backend
2. Set Root Directory to `backend`
3. Add all backend environment variables
4. Deploy

### Step 7: Update Frontend API URL

After backend is deployed:

1. Copy your backend URL (e.g., `https://your-backend.vercel.app`)
2. Go to frontend Vercel project
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```
4. Redeploy frontend

---

## Testing Registration

### 1. Test Registration Flow:

1. Go to your frontend URL
2. Click "Register"
3. Fill in:
   - Username (1-50 characters, no spaces)
   - Email (valid email)
   - Password (minimum 6 characters)
4. Click "Register"
5. Check your email for verification code
6. Enter the 6-digit code
7. You should be logged in!

### 2. Check Database:

After registration, verify in your database:
```sql
SELECT id, username, email, uid, is_verified FROM users;
```

You should see your new user with:
- `uid = 1` (first user is automatically owner/admin)
- `is_verified = true` (after email verification)

---

## Common Issues & Solutions

### "Registration failed" error
- Check backend logs in Vercel
- Verify DATABASE_URL is correct
- Make sure all tables exist in database

### "Email not sent" error
- Verify email service credentials
- Check EMAIL_SERVICE is set correctly
- For Gmail: make sure you're using App Password, not regular password
- For Resend: verify API key is valid

### "Invalid credentials" on login
- Make sure you verified your email
- Check username/password are correct
- Verify user exists in database

### Backend not responding
- Check backend is deployed and running
- Verify VITE_API_URL in frontend matches backend URL
- Check CORS settings in backend

### Database connection failed
- Verify DATABASE_URL format is correct
- Check database is running and accessible
- For Supabase: make sure you replaced `[YOUR-PASSWORD]`
- Try connection pooling: add `?pgbouncer=true` to connection string

---

## Environment Variables Checklist

### Backend (Required):
- [ ] DATABASE_URL
- [ ] JWT_SECRET
- [ ] EMAIL_SERVICE
- [ ] RESEND_API_KEY or SMTP credentials
- [ ] EMAIL_FROM
- [ ] FRONTEND_URL
- [ ] NODE_ENV=production

### Frontend (Required):
- [ ] VITE_API_URL

### Optional:
- [ ] DISCORD_CLIENT_ID
- [ ] DISCORD_CLIENT_SECRET
- [ ] DISCORD_REDIRECT_URI

---

## Quick Start Commands

### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Database Connection:
```bash
psql "your-database-url" -c "SELECT version();"
```

### Check Tables Exist:
```bash
psql "your-database-url" -c "\dt"
```

---

## Support

If you're still having issues:

1. Check Vercel function logs for errors
2. Verify all environment variables are set
3. Test database connection
4. Check email service is working
5. Review backend/frontend console for errors

## Architecture Overview

```
Frontend (Vercel) → Backend API (Vercel) → PostgreSQL Database
                                        ↓
                                   Email Service (Resend/SMTP)
```

Registration flow:
1. User submits registration form
2. Backend validates data
3. Backend creates user in database (unverified)
4. Backend sends verification email
5. User enters code from email
6. Backend verifies code and marks user as verified
7. User is logged in with JWT token
