═══════════════════════════════════════════════════════════════
  COMPLETE ECHOTIMELINE SPECIFICATION
═══════════════════════════════════════════════════════════════

## 📁 PROJECT STRUCTURE

```
echotimeline/
├── public/
│   └── favicon.svg           # Film reel E logo
├── src/
│   ├── components/
│   │   ├── Logo.jsx          # Brand logo SVG
│   │   ├── Navbar.jsx       # Navigation + auth + theme toggle
│   │   ├── Footer.jsx       # Site footer
│   │   └── UI.jsx           # Modal, Toasts, PhotoCard, TimelineCard, etc.
│   ├── hooks/
│   │   └── index.js         # useAuth, useDarkMode, useInView, useFileDrop
│   ├── lib/
│   │   ├── firebase.js       # Firebase config + all DB/auth/storage helpers
│   │   ├── exif.js          # EXIF extraction + date formatting
│   │   └── helpers.js       # Utility functions
│   ├── pages/
│   │   ├── Landing.jsx      # SEO landing page with hero, features, pricing
│   │   ├── Auth.jsx         # Login + Signup (Google OAuth + email)
│   │   ├── Dashboard.jsx    # Timeline grid with search, create, delete
│   │   ├── Builder.jsx      # Drag-drop upload, grid/timeline/map views
│   │   └── Viewer.jsx       # Public timeline viewer with lightbox
│   ├── store/
│   │   └── index.js         # Zustand stores (auth, theme, timeline, UI)
│   ├── index.css            # Tailwind + custom styles + grain overlay
│   └── main.jsx             # App entry with router
├── firestore.rules          # Firestore security rules
├── storage.rules            # Storage security rules
├── vercel.json              # Vercel deployment config
├── tailwind.config.js       # Custom design system
├── vite.config.js           # Vite + PWA config
└── .env.example            # Environment template
```

## 🎨 DESIGN SYSTEM

| Token | Light | Dark |
|-------|-------|------|
| Background | #F5EDE3 (old-paper beige) | #121212 (deep black) |
| Accent | #D4A574 (aged gold) | #FFD700 (warm gold) |
| Text | #2D1E12 (deep brown) | #F5EDE3 (cream) |
| Heading Font | Playfair Display | Playfair Display |
| Body Font | Source Sans 3 | Source Sans 3 |

## 📋 SEO KEYWORDS
- "digitize old photos timeline"
- "family memory app"
- "private photo chronology"

## TECH STACK
- React 18 + Vite
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- Zustand (state)
- React Router DOM
- Lucide React (icons)

## FEATURES
- Drag & drop upload
- EXIF auto-date extraction
- Google OAuth + email auth
- Timeline grid dashboard
- Drag-drop photo organizer
- Map view with OpenStreetMap
- Public viewer with lightbox
- Dark/light theme toggle
- PWA ready

## 📄 LICENSE
MIT — build something beautiful for your family.

═══════════════════════════════════════════════════════════════
