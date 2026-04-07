# 🏥 Health Hub Portal

An online medical laboratory test booking system with patient management, report uploads, and automated email/WhatsApp notifications.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| UI | Tailwind CSS + Radix UI + shadcn/ui |
| Backend | Express.js + TypeScript |
| Database | MongoDB + Mongoose |
| Email | Gmail OAuth2 + Nodemailer |
| WhatsApp | Twilio |
| Auth | Passport.js (session-based) |

## Project Structure

```
health-hub-portal/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── lib/
├── server/          # Express + MongoDB backend
│   ├── models/      # Mongoose models
│   ├── routes/      # API route handlers
│   ├── controllers/ # Business logic
│   ├── services/    # Cron jobs, etc.
│   ├── middleware/  # Auth, error handling
│   ├── config/      # DB connection
│   ├── mailer.ts    # Gmail email service
│   └── index.ts     # Server entry point
├── shared/          # Shared types + route definitions
├── script/          # Production build helper
├── .env.example     # Environment variable template
├── vercel.json      # Vercel frontend deployment config
├── vite.config.ts   # Vite build config
└── package.json
```

## Local Development Setup

### 1. Clone & Install

```bash
git clone https://github.com/Kishores57/health.git
cd health
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Fill in your values in `.env` (see `.env.example` for all required variables).

### 3. Run Development Server

```bash
npm run dev
```

The app runs on **http://localhost:5000** — this single command starts both frontend (Vite) and backend (Express).

### Default Admin Credentials

```
Username: admin
Password: admin
```

---

## Production Deployment

This project is designed to be split:
- **Frontend → Vercel** (serves React static site)
- **Backend → Railway** (runs Express + MongoDB API)

### Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select this repo
3. Set **Start Command**: `npm run build && npm start`
4. Add all environment variables from `.env.example`
5. Copy your Railway URL (e.g. `https://health-hub.up.railway.app`)

### Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Select this repo
3. Vercel auto-detects `vercel.json` — no extra config needed
4. Add environment variable:
   ```
   VITE_API_URL = https://your-railway-backend-url.up.railway.app
   ```
5. Deploy ✅

### Build for Production Locally

```bash
npm run build   # Bundles frontend → dist/public, backend → dist/index.cjs
npm start       # Runs production server
```

---

## Key Features

- 📅 **Book lab tests** — guest booking (no login required)
- 🔔 **Email confirmations** — Gmail OAuth2 with fasting instructions
- 📲 **WhatsApp alerts** — Twilio for fasting reminders
- 📊 **Admin dashboard** — manage bookings, update status
- 📄 **Report uploads** — admin uploads PDF → patient gets email with report
- 🔐 **Auth** — Admin and Lab Owner roles

## Available NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (frontend + backend) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run check` | TypeScript type check |

---

## Environment Variables

See [`.env.example`](.env.example) for the full list of required environment variables.
