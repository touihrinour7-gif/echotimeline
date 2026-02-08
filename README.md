# EchoTimeline 🌅

**Turn dusty albums into living timelines – free, private, forever.**

![EchoTimeline](https://via.placeholder.com/1200x630/F5EDE3/2D1E12?text=EchoTimeline)

## ✨ Features

- 📸 **Bulk Upload** - Drag & drop hundreds of photos, lossless storage
- 🤖 **AI Auto-Sort** - Florence-2 analyzes and sorts by date automatically
- 🗺️ **Map Timeline** - Interactive Leaflet map with OpenStreetMap pins
- 🎤 **Voice Captions** - Record voice notes with MediaRecorder API
- 🎬 **4K Video Export** - Cinematic reels via FFmpeg.wasm
- 📄 **PDF Yearbook** - Printable photo books via jsPDF
- 👨‍👩‍👧‍👦 **Family Vault** - Invite family, real-time collaboration
- 🌙 **Dark Mode** - Beautiful sepia/gold theme
- 📱 **Responsive** - Mobile, Tablet, Desktop optimized
- 🔒 **Private** - End-to-end encrypted, no ads, no lock-in

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account (free tier)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/echotimeline.git
cd echotimeline

# Install dependencies
npm install

# Setup Firebase
# Copy client/src/lib/firebase.js and add your config

# Start development server
npm run dev
```

### Environment Variables

Create `.env` in the client directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 🏗️ Architecture

```
echotimeline/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/        # Landing, Dashboard, Builder, Viewer
│   │   ├── components/  # Reusable UI components
│   │   ├── lib/         # Firebase, EXIF utilities
│   │   └── store/       # Zustand state management
│   └── index.html        # SEO optimized
├── server/               # Express API (coming soon)
└── shared/              # Shared types (coming soon)
```

## 🎨 Design System

### Colors

| Mode | Background | Text | Accent |
|------|-----------|------|--------|
| Light | `#F5EDE3` | `#2D1E12` | `#D4A574` |
| Dark | `#121212` | `#F5EDE3` | `#FFD700` |

### Typography

- **Display:** Playfair Display (serif) - Headings
- **Body:** Inter (sans-serif) - Body text

## 📦 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **State:** Zustand
- **Auth/DB:** Firebase (Auth, Firestore, Storage)
- **Maps:** Leaflet + OpenStreetMap
- **AI:** Florence-2 (Transformers.js)
- **Video:** FFmpeg.wasm
- **PDF:** jsPDF
- **PWA:** Vite PWA Plugin

## 🌍 Free Hosting

| Service | URL | Free Tier |
|---------|-----|-----------|
| Frontend | [Vercel](https://vercel.com) | ✅ Unlimited projects |
| Database | [Firebase](https://firebase.google.com) | ✅ 1GB Firestore, 5GB Storage |
| Maps | OpenStreetMap | ✅ Free forever |
| Domain | Vercel subdomain | ✅ echotimeline.vercel.app |

## 📱 Responsive Breakpoints

- **Mobile:** 100% height, Stories-style swipe
- **Tablet:** Split view (timeline + map)
- **Desktop:** Hover cards, full-width preview

## 🔒 Privacy

- All data encrypted at rest
- No third-party tracking
- Family vault uses E2E encryption
- Delete your data anytime

## 📄 License

MIT License - See [LICENSE](LICENSE)

## 🤝 Contributing

Contributions welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

---

**Made with ❤️ for families everywhere**
