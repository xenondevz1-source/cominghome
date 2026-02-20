# Check Your Deployment

## The Problem

Your registration is failing with **405 Method Not Allowed** because the frontend is trying to call the API on itself instead of the backend.

**Current (Wrong):**
```
Frontend: https://cominghome-kappa.vercel.app
API Call: https://cominghome-kappa.vercel.app/api/auth/register ❌
```

**Should Be:**
```
Frontend: https://cominghome-kappa.vercel.app
API Call: https://cominghome-backend.vercel.app/api/auth/register ✅
```

---

## Solution

### Step 1: Check if Backend is Deployed

Go to your Vercel dashboard and check:
- Do you have TWO projects?
  - One for frontend (cominghome-kappa)
  - One for backend (cominghome-backend or similar)

**If you only have ONE project, that's the problem!**

---

## If You Only Have Frontend Deployed:

### Deploy Backend Now:

1. Go to https://vercel.com/new
2. Import your GitHub repo: `xenondevz1-source/cominghome`
3. **IMPORTANT:** Set Root Directory to `backend`
4. Framework: Other
5. Add these environment variables:
   ```
   DATABASE_URL=your_postgresql_url
   JWT_SECRET=your_random_secret_32_chars
   EMAIL_SERVICE=resend
   RESEND_API_KEY=re_your_key
   EMAIL_FROM=noreply@yourdomain.com
   NODE_ENV=production
   FRONTEND_URL=https://cominghome-kappa.vercel.app
   ```
6. Click Deploy
7. Copy the backend URL (e.g., `https://cominghome-backend.vercel.app`)

---

## If You Have Both Deployed:

### Add VITE_API_URL to Frontend:

1. Go to your frontend project in Vercel
2. Settings → Environment Variables
3. Add:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.vercel.app/api`
4. Add for all environments
5. Go to Deployments → Redeploy

---

## Quick Test

After deploying backend, test it:

1. Open browser and go to:
   ```
   https://your-backend-url.vercel.app/health
   ```

2. Should return:
   ```json
   {"status":"ok","timestamp":"..."}
   ```

3. If that works, test registration:
   ```
   https://your-backend-url.vercel.app/api/auth/register
   ```

---

## Environment Variables Needed

### Backend Project:
```env
DATABASE_URL=postgresql://...
JWT_SECRET=random-32-char-string
EMAIL_SERVICE=resend
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://cominghome-kappa.vercel.app
NODE_ENV=production
PORT=3000
```

### Frontend Project:
```env
VITE_API_URL=https://your-backend-url.vercel.app/api
```

---

## Verify Setup

After everything is deployed:

1. ✅ Backend health check works: `https://backend-url/health`
2. ✅ Frontend loads: `https://cominghome-kappa.vercel.app`
3. ✅ Frontend has `VITE_API_URL` set
4. ✅ Backend has all environment variables
5. ✅ Database is set up with schema
6. ✅ Email service is configured

---

## Still Getting 405 Error?

Check browser console:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

If it shows `undefined`, the environment variable is not set correctly.

**Fix:**
1. Make sure variable name is exactly `VITE_API_URL` (case sensitive)
2. Make sure it's added to Production environment
3. Redeploy after adding the variable

---

## Common Mistakes

❌ Deploying entire repo as one project
✅ Deploy backend and frontend separately

❌ Setting `API_URL` instead of `VITE_API_URL`
✅ Must start with `VITE_` for Vite to expose it

❌ Not redeploying after adding env vars
✅ Always redeploy after changing environment variables

❌ Backend URL without `/api` suffix
✅ Should be: `https://backend-url.vercel.app/api`

---

## Need Help?

1. Check how many Vercel projects you have
2. Share your backend URL (if you have one)
3. Check if `VITE_API_URL` is set in frontend project
