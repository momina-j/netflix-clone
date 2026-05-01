# 🎬 Netflix Clone

A full-featured Netflix Clone built with **Next.js 16**, **Tailwind CSS**, **NextAuth**, and the **TMDB API**.

## ✨ Features

- 🎭 Movie & TV browsing (Trending, Top Rated, Popular, Now Playing, Upcoming)
- 🔐 Authentication (demo credentials + Google OAuth)
- 🎬 Detail pages with YouTube trailer, cast, similar titles
- 🔍 Search across movies and TV shows
- ➕ My List — persisted with Zustand + localStorage
- 📱 Fully responsive mobile + desktop
- ⚡ ISR, skeleton loaders, optimized images

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env.local
```
Fill in your values in `.env.local`.

### 3. Run dev server
```bash
npm run dev
```

Open http://localhost:3000

**Demo login:** `demo@netflix.com` / `demo123`

## 🌐 Deploy to Vercel

### Via CLI
```bash
npm i -g vercel
vercel --prod
```

### Via Dashboard
1. Push to GitHub
2. Import at vercel.com → New Project
3. Add env vars in Project Settings:
   - `NEXT_PUBLIC_TMDB_API_KEY` — from themoviedb.org/settings/api
   - `NEXTAUTH_SECRET` — run: `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your Vercel URL, e.g. https://my-app.vercel.app
4. Deploy!

## 🔑 Getting TMDB API Key

1. Register free at themoviedb.org
2. Settings → API → Request API Key
3. Copy "API Key (v3 auth)"
4. Add to .env.local as `NEXT_PUBLIC_TMDB_API_KEY`

## 🛠️ Tech Stack

- **Next.js 16** — App Router, ISR, Server Components
- **TypeScript** — Full type safety
- **Tailwind CSS v4** — Styling
- **NextAuth.js** — Authentication
- **Zustand** — State management (My List)
- **TMDB API** — Movie/TV data
