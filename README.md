# Coming Home - Biolink Platform

A modern biolink platform with customizable profiles, links, badges, and templates.

## 🚀 Quick Deploy to Vercel

**Important:** This is a monorepo. Deploy frontend and backend as separate projects!

### 1. Deploy Backend
- Import repo to Vercel
- Set Root Directory: `backend`
- Add environment variables (see below)
- Deploy

### 2. Deploy Frontend
- Import repo to Vercel again
- Set Root Directory: `frontend`
- Add `VITE_API_URL` environment variable
- Deploy

📖 **Full deployment guide:** See [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md)

---

## 📋 Required Environment Variables

### Backend
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-random-secret-32-chars-minimum
EMAIL_SERVICE=resend
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## 🗄️ Database Setup

1. Create PostgreSQL database (Vercel Postgres, Supabase, or Neon)
2. Run the SQL schema:
   ```bash
   psql "your-database-url" < database/schema.sql
   ```

---

## 📧 Email Service Setup

### Option A: Resend (Recommended)
1. Sign up at https://resend.com
2. Get API key
3. Add to backend env vars

### Option B: Gmail SMTP
1. Enable 2FA on Gmail
2. Generate App Password
3. Add SMTP credentials to backend env vars

---

## 🛠️ Local Development

### Install Dependencies
```bash
npm run setup
```

### Run Development Servers
```bash
npm run dev
```

This starts:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

### Build for Production
```bash
npm run build:all
```

---

## 📁 Project Structure

```
cominghome/
├── backend/              # Express + TypeScript API
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth middleware
│   │   ├── services/    # Email services
│   │   └── server.ts    # Main server file
│   ├── package.json
│   └── vercel.json      # Backend Vercel config
│
├── frontend/            # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── utils/       # API utilities
│   │   └── App.tsx      # Main app component
│   ├── package.json
│   └── vercel.json      # Frontend Vercel config
│
├── database/
│   └── schema.sql       # PostgreSQL schema
│
└── vercel.json          # Root Vercel config
```

---

## ✨ Features

- 🔐 User authentication with email verification
- 🎨 Customizable profile themes and effects
- 🔗 Unlimited social links
- 🏆 Badge system
- 📊 Analytics dashboard
- 🎵 Music player widget
- 🖱️ Custom cursors
- 📱 Fully responsive
- 🌙 Dark mode optimized

---

## 🐛 Troubleshooting

### Registration not working?
See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Deployment issues?
See [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md)

### Setup questions?
See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 📚 Documentation

- [Deployment Guide](./DEPLOY_TO_VERCEL.md) - Step-by-step Vercel deployment
- [Setup Guide](./SETUP_GUIDE.md) - Complete setup instructions
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions

---

## 🔧 Tech Stack

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT Authentication
- Resend/SMTP for emails

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Framer Motion
- React Router

---

## 📝 License

MIT License - feel free to use for your own projects!

---

## 💬 Support

Need help? Contact: contact@extasy.asia

---

## 🎯 Quick Start Checklist

- [ ] Clone repository
- [ ] Deploy backend to Vercel
- [ ] Deploy frontend to Vercel
- [ ] Set up PostgreSQL database
- [ ] Run database schema
- [ ] Configure email service
- [ ] Add all environment variables
- [ ] Test registration flow
- [ ] Test email verification
- [ ] Test login

Done! 🎉
