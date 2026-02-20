# Vercel Deployment Guide

## Prerequisites
- GitHub account with your repository
- Vercel account (sign up at https://vercel.com)
- PostgreSQL database (you'll need to set this up separately)

## Step-by-Step Deployment

### 1. Import Your Project to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository: `xenondevz1-source/cominghome`
4. Click "Import"

### 2. Configure Project Settings

**Framework Preset:** Other

**Root Directory:** Leave as `.` (root)

**Build Settings:**
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/dist`
- Install Command: `npm install`

### 3. Set Environment Variables

Click on "Environment Variables" and add these variables:

#### Backend Variables:
```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_random_secret_key_here
PORT=3000
NODE_ENV=production
```

#### Email Service Variables (choose one):

**Option A - Using Resend:**
```
EMAIL_SERVICE=resend
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
```

**Option B - Using SMTP:**
```
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
```

#### Frontend Variables:
```
VITE_API_URL=https://your-backend-url.vercel.app
```

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Post-Deployment Steps

### 1. Set Up Database

You'll need a PostgreSQL database. Options:
- **Vercel Postgres** (recommended): https://vercel.com/docs/storage/vercel-postgres
- **Supabase**: https://supabase.com
- **Neon**: https://neon.tech
- **Railway**: https://railway.app

After setting up your database:
1. Get the connection string
2. Add it to Vercel environment variables as `DATABASE_URL`
3. Run your database migrations

### 2. Update API URL

After deployment, update the `VITE_API_URL` environment variable with your actual backend URL.

### 3. Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Separate Frontend and Backend Deployment (Alternative)

If you prefer to deploy frontend and backend separately:

### Frontend Only:
1. Create a new Vercel project
2. Set Root Directory to `frontend`
3. Framework: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Backend Only:
1. Create another Vercel project
2. Set Root Directory to `backend`
3. Add a `vercel.json` in the backend folder:
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

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel IPs
- Ensure database is running and accessible

### API Not Working
- Check environment variables are set correctly
- Verify CORS settings in backend
- Check function logs in Vercel dashboard

## Important Notes

- Vercel serverless functions have a 10-second execution limit on Hobby plan
- Static files are served from CDN automatically
- Environment variables need to be set for each environment (Production, Preview, Development)
- Database migrations need to be run manually or set up in CI/CD

## Support

For issues, check:
- Vercel Documentation: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions
