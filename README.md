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
| **Auth** | Firebase Auth (Google OAuth + Email) |
| **Database** | Cloud Firestore |
| **Storage** | Firebase Storage |
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

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → Create project
2. Enable **Authentication** → Sign-in methods → Google + Email/Password
3. Create **Firestore Database** in production mode
4. Enable **Storage**
5. Copy your web app config

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc
```

### 4. Deploy Firestore Rules

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,storage
```

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
