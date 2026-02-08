═══════════════════════════════════════════════════════════════
  CLAUDE OPUS 4 PROMPT - ECHOTIMELINE BUILD
═══════════════════════════════════════════════════════════════

COPY AND PASTE THIS EXACT PROMPT INTO CLAUDE OPUS 4:

───────────────────────────────────────────────────────────────

Build EchoTimeline from scratch - a family photo timeline web app.

## PROJECT SPECIFICATIONS

### Name & Brand
- **Name:** EchoTimeline
- **Domain:** echotimeline.app (~$12/year on Porkbun)
- **Logo:** Minimal serif "E" shaped like a film reel, warm gold (#D4A574) on soft sepia (#F5EDE3)
- **Font:** Playfair Display (headings), Inter (body) - Google Fonts, free

### Color Palette
- **Light Theme:**
  - Background: #F5EDE3 (old-paper beige)
  - Accent: #D4A574 (aged gold)
  - Text: #2D1E12 (deep brown)
- **Dark Theme:**
  - Background: #121212 (deep black)
  - Accent: #FFD700 (warm gold)
  - Text: #F5EDE3 (cream)

### Copywriting - SEO Keywords (weave into headers/alt text):
- "digitize old photos timeline"
- "family memory app"
- "private photo chronology"
- Hero: "Turn dusty albums into living timelines – free, private, forever."
- Sub: "Upload once, watch your family story scroll like magic. No ads, no lock-in."

## TECH STACK (ALL FREE)

### Frontend
- React 18
- Vite
- Tailwind CSS
- Zustand (state management)
- React Router DOM
- Lucide React (icons)

### Backend & Services (Free Tier)
- Firebase: Authentication, Storage, Firestore DB
- Maps: Leaflet + OpenStreetMap (free, no API key)
- AI: Transformers.js (Florence-2 ONNX) for in-browser date detection
- Export: FFmpeg.wasm (video), jsPDF (PDF)

### Hosting (Free Forever)
- Frontend: Vercel
- Database: Firebase Free Tier
- Domain: Vercel subdomain (echotimeline.vercel.app) or Porkbun ($12/year)

## APP STRUCTURE

### Pages Required:
1. **Landing Page** (SEO optimized)
   - Hero section with value proposition
   - Features grid
   - Pricing section (Free tier, Pro $15, Business $99)
   - Footer with legal links

2. **Sign-up/Login**
   - Google OAuth via Firebase
   - Email/password via Firebase Auth

3. **Dashboard**
   - Grid of timeline cards
   - Create new timeline button
   - Search/filter timelines

4. **Timeline Builder**
   - Drag-drop bulk upload (lossless originals)
   - Auto-sort by EXIF date + Florence-2 AI fallback
   - Leaflet map with OSM pins
   - Voice caption recorder (MediaRecorder API)
   - AR overlay toggle (WebXR - placeholder)
   - Edit/crop/delete photos

5. **Timeline Viewer**
   - Vertical scroll (Stories-style on mobile)
   - Dark mode toggle
   - Responsive breakpoints:
     * Mobile: 100% height, swipe navigation
     * Tablet: Split view (timeline + map)
     * Desktop: Hover cards with details

6. **Export Modal**
   - 4K video reel (FFmpeg.wasm)
   - Printable PDF yearbook (jsPDF)
   - Private share link

### Features:
- **EXIF auto-date extraction** - Use exif-js library
- **Face clusters** - Group photos by person (placeholder for future)
- **Family vault** - Invite via email, real-time edits, E2E encrypted
- **Weekly nudge** - "New scans? Add 'em." prompt
- **Theme switch** - Persists in localStorage
- **Micro-interactions:**
  * Photo drops fade in with soft bounce
  * Timeline auto-scrolls to new uploads
  * Lazy-load thumbnails for 4G optimization
- **PWA** - Service workers, install prompt

## CODE STRUCTURE (Monorepo)

```
echotimeline/
├── package.json          # Root workspace
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/       # All page components
│   │   ├── components/  # Reusable UI (Button, Card, Modal, etc.)
│   │   ├── lib/         # Firebase config, EXIF utils, helpers
│   │   ├── store/       # Zustand stores (auth, theme, timeline)
│   │   ├── hooks/       # Custom React hooks
│   │   └── utils/       # Utility functions
│   ├── index.html       # SEO meta tags
│   ├── vite.config.js   # PWA config
│   └── tailwind.config.js
├── server/              # Express backend (minimal, can skip for MVP)
└── shared/              # Shared types (TypeScript later)
```

## CRITICAL REQUIREMENTS

1. **SEO Meta Tags** in index.html:
   - title: "EchoTimeline | Free Family Photo Timeline"
   - description: "Digitize old photos into interactive stories—no ads, private, export reels"
   - keywords: "digitize old photos timeline, family memory app, private photo chronology"

2. **Responsive Breakpoints:**
   - Mobile (< 768px): Full-height swipe, thumb-friendly buttons
   - Tablet (768-1024px): Split view, drag to reorganize
   - Desktop (> 1024px): Hover cards, full-width preview

3. **Performance:**
   - Lazy-load images with Intersection Observer
   - Service workers for offline support
   - Optimized bundle with Vite

4. **Firebase Config:**
   - Use environment variables for all Firebase keys
   - Template: VITE_FIREBASE_* prefix

5. **Error Handling:**
   - Graceful fallbacks when services unavailable
   - Demo mode when no backend configured

## OUTPUT REQUIREMENTS

1. Create all files in a clean structure
2. Use TypeScript-ready .jsx files
3. Include comprehensive comments
4. Add ERROR_BOUNDARY component for crash protection
5. Include Loading states and skeleton screens
6. Add Toast notifications for user feedback

## GETTING STARTED

After code is generated:
1. Initialize git and push to GitHub
2. Connect to Vercel (import repo)
3. Add Firebase environment variables in Vercel
4. Deploy!

## YOUR TASK

Generate complete, production-ready code for EchoTimeline with:
- Beautiful UI matching the sepia/gold theme
- Full responsive design
- All features functional (mock data where APIs needed)
- Clean, documented code
- Ready to deploy to Vercel with Firebase

───────────────────────────────────────────────────────────────

**Copy the text above and paste it into Claude Opus 4!**

═══════════════════════════════════════════════════════════════
