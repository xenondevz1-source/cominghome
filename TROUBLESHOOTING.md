# Registration Troubleshooting Guide

## Quick Diagnostics

### 1. Check if Backend is Running

Open your browser console (F12) and check the Network tab when you try to register.

**What to look for:**
- Is the request going to the correct URL?
- What's the response status code?

### 2. Common Issues & Solutions

#### Issue: "Network Error" or "Failed to fetch"
**Cause:** Backend is not deployed or VITE_API_URL is wrong

**Solution:**
1. Make sure backend is deployed to Vercel
2. Check frontend environment variable:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```
3. Redeploy frontend after adding the variable

#### Issue: "CORS Error"
**Cause:** Backend doesn't allow your frontend domain

**Solution:**
Add your frontend URL to backend environment variables:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

#### Issue: "Registration failed" with no details
**Cause:** Backend error (database, email service, etc.)

**Solution:**
1. Check Vercel function logs for backend
2. Verify all environment variables are set:
   - DATABASE_URL
   - JWT_SECRET
   - EMAIL_SERVICE
   - RESEND_API_KEY (or SMTP credentials)
   - EMAIL_FROM

#### Issue: "Database connection failed"
**Cause:** DATABASE_URL is incorrect or database is not accessible

**Solution:**
1. Verify DATABASE_URL format:
   ```
   postgresql://user:password@host:port/database?sslmode=require
   ```
2. Test connection from Vercel logs
3. Make sure database allows connections from Vercel IPs

#### Issue: Email not sent
**Cause:** Email service not configured

**Solution:**
1. For Resend:
   - Verify RESEND_API_KEY is correct
   - Check EMAIL_FROM domain is verified in Resend
2. For SMTP:
   - Use App Password for Gmail (not regular password)
   - Verify SMTP settings are correct

---

## Step-by-Step Debugging

### Step 1: Test Backend Health

Open in browser:
```
https://your-backend.vercel.app/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

If this fails, backend is not deployed correctly.

### Step 2: Check Frontend API Configuration

Open browser console and type:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

Should show your backend URL. If undefined, the environment variable is not set.

### Step 3: Test Registration API Directly

Use this curl command (replace with your backend URL):
```bash
curl -X POST https://your-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'
```

**Expected responses:**

Success:
```json
{
  "message": "Registration successful. Please check your email for verification code.",
  "user": {...}
}
```

Error examples:
```json
{"error": "All fields are required"}
{"error": "Username or email already exists"}
{"error": "Registration failed"}
```

### Step 4: Check Vercel Logs

1. Go to Vercel dashboard
2. Select your backend project
3. Click "Logs" or "Functions"
4. Try to register again
5. Look for error messages in real-time logs

---

## Environment Variables Checklist

### Backend (REQUIRED):
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-random-secret
EMAIL_SERVICE=resend
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=3000
```

### Frontend (REQUIRED):
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## Testing Without Email

If you want to test registration without setting up email service, you can temporarily modify the backend:

1. Comment out email sending in `backend/src/routes/auth.ts`
2. Auto-verify users on registration
3. This is NOT recommended for production!

---

## Common Deployment Mistakes

### 1. Deploying as Monorepo
❌ Don't deploy the entire project as one
✅ Deploy frontend and backend separately

### 2. Wrong Root Directory
- Frontend: Set to `frontend`
- Backend: Set to `backend`

### 3. Missing Build Command
- Frontend: `npm run build`
- Backend: `npm run build` (if needed)

### 4. Environment Variables Not Set
- Must be set in Vercel dashboard
- Must be set for all environments (Production, Preview, Development)

### 5. Database Not Initialized
- Must run `database/schema.sql` to create tables
- Can't skip this step!

---

## Quick Test Script

Create a file `test-registration.js`:

```javascript
const API_URL = 'https://your-backend.vercel.app/api';

async function testRegistration() {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser' + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: 'test123456'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ Registration API is working!');
    } else {
      console.log('❌ Registration failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

testRegistration();
```

Run with:
```bash
node test-registration.js
```

---

## Still Not Working?

### Check These:

1. **Backend deployed?**
   - Visit: `https://your-backend.vercel.app/health`
   - Should return `{"status":"ok"}`

2. **Database connected?**
   - Check Vercel logs for database errors
   - Verify DATABASE_URL is correct

3. **CORS configured?**
   - FRONTEND_URL must match your frontend domain exactly
   - Include protocol (https://)

4. **Email service working?**
   - Test with a simple email send
   - Check Resend/SMTP dashboard for errors

5. **All environment variables set?**
   - Go to Vercel → Settings → Environment Variables
   - Verify all required variables are present

---

## Get Help

If you're still stuck, provide these details:

1. Error message from browser console
2. Network tab screenshot showing the failed request
3. Vercel function logs from backend
4. List of environment variables (without values)
5. Backend health check response

Contact: contact@extasy.asia
