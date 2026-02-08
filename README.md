# 🎞️ EchoTimeline

**Turn dusty albums into living timelines – free, private, forever.**

A beautiful, production-ready family photo timeline web app built with React, Firebase, and Tailwind CSS.

![EchoTimeline](https://img.shields.io/badge/status-beta-D4A574) ![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- **Drag & Drop Upload** — Bulk-upload hundreds of photos at once, lossless
- **EXIF Auto-Date Extraction** — Photos auto-sort chronologically by embedded date
- **Interactive Map Pins** — GPS coordinates become Leaflet/OpenStreetMap markers
- **Family Vault** — Invite members with viewer/editor roles, E2E encrypted
- **4K Video Export** — FFmpeg.wasm renders cinematic slideshows in-browser
- **PDF Book Export** — jsPDF generates beautiful chronological photo books
- **Voice Notes** — Record audio captions for each photo (placeholder ready)
- **AI Face Clusters** — Transformers.js Florence-2 face grouping (placeholder ready)
- **Dark Mode** — Persistent theme toggle with localStorage
- **PWA** — Installable with offline support via service workers
- **Micro-Interactions** — Fade-in, bounce, auto-scroll, hover effects
- **Fully Responsive** — Mobile swipe, tablet split, desktop hover layouts

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **State** | Zustand |
| **Routing** | React Router DOM v6 |
| **Icons** | Lucide React |
| **Auth** | Supabase Auth (Google OAuth + Email) |
| **Database** | PostgreSQL (Supabase) |
| **Storage** | Supabase Storage |
| **Maps** | Leaflet + OpenStreetMap (free) |
| **EXIF** | exifr |
| **Animations** | Framer Motion + CSS |
| **Export** | jsPDF + FFmpeg.wasm |
| **PWA** | vite-plugin-pwa |
| **Hosting** | Vercel (frontend) + Firebase (backend) |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash://github.com/touihrinour
git clone https7-gif/echotimeline.git
cd echotimeline
npm install
```

### 2. Supabase Setup

1. Go to [Supabase](https://supabase.com) → Create project or use existing
2. Enable **Authentication** → Sign-in methods → Google + Email
3. Go to **SQL Editor** and run the database setup (see below)
4. Create **Storage bucket** named `timelines` (make it public)
5. Copy your project config

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://ymtzilzrbbxaduquechb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Setup Database Tables

Go to **SQL Editor** in Supabase and run:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timelines table
CREATE TABLE timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cover TEXT,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timeline_id UUID REFERENCES timelines(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  name TEXT,
  date TIMESTAMP WITH TIME ZONE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can CRUD own timelines" ON timelines
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Users can CRUD photos" ON photos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM timelines WHERE id = photos.timeline_id AND owner_id = auth.uid())
  );
```

### 5. Setup Storage

1. Go to **Storage** → **New bucket**
2. **Name:** `timelines`
3. **Public:** ✅ Yes
4. **RLS:** Disable (or create policy for authenticated users)

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Set environment variables in Vercel dashboard
4. Deploy! Vercel auto-detects Vite

The `vercel.json` handles SPA routing and security headers.

---

## 📁 Project Structure

```
echotimeline/
├── public/
│   └── favicon.svg          # Film reel E logo
├── src/
│   ├── components/
│   │   ├── Logo.jsx          # Brand logo SVG
│   │   ├── Navbar.jsx        # Navigation + auth + theme toggle
│   │   ├── Footer.jsx        # Site footer
│   │   └── UI.jsx            # Modal, Toasts, PhotoCard, TimelineCard, etc.
│   ├── hooks/
│   │   └── index.js          # useAuth, useDarkMode, useInView, useFileDrop
│   ├── lib/
│   │   ├── firebase.js       # Firebase config + all DB/auth/storage helpers
│   │   ├── exif.js           # EXIF extraction + date formatting
│   │   └── helpers.js        # Utility functions
│   ├── pages/
│   │   ├── Landing.jsx       # SEO landing page with hero, features, pricing
│   │   ├── Auth.jsx          # Login + Signup (Google OAuth + email)
│   │   ├── Dashboard.jsx     # Timeline grid with search, create, delete
│   │   ├── Builder.jsx       # Drag-drop upload, grid/timeline/map views
│   │   └── Viewer.jsx        # Public timeline viewer with lightbox
│   ├── store/
│   │   └── index.js          # Zustand stores (auth, theme, timeline, UI)
│   ├── index.css             # Tailwind + custom styles + grain overlay
│   └── main.jsx              # App entry with router
├── firestore.rules           # Firestore security rules
├── storage.rules             # Storage security rules
├── vercel.json               # Vercel deployment config
├── tailwind.config.js        # Custom design system
├── vite.config.js            # Vite + PWA config
└── .env.example              # Environment template
```

---

## 🎨 Design System

| Token | Light | Dark |
|-------|-------|------|
| Background | `#F5EDE3` (old-paper beige) | `#121212` (deep black) |
| Accent | `#D4A574` (aged gold) | `#FFD700` (warm gold) |
| Text | `#2D1E12` (deep brown) | `#F5EDE3` (cream) |
| Heading Font | Playfair Display | Playfair Display |
| Body Font | Source Sans 3 | Source Sans 3 |

---

## 📋 SEO Keywords

- "digitize old photos timeline"
- "family memory app"
- "private photo chronology"

---

## 📄 License

MIT — build something beautiful for your family.
