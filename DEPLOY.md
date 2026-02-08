# EchoTimeline - Complete Deployment Guide

## FREE Hosting Stack

| Service | URL | What It Does |
|---------|-----|--------------|
| **Frontend** | [Vercel](https://vercel.com) | React app hosting (FREE) |
| **Database** | [Firebase](https://firebase.google.com) | Auth + Storage + Firestore (FREE) |
| **Domain** | Vercel Subdomain | `echotimeline.vercel.app` (FREE) |
| **Maps** | OpenStreetMap | Free maps (no API key needed) |

---

## Step 1: Create GitHub Repository

### Option A: Quick Create (5 seconds)
1. Go to: https://github.com/new
2. **Repository name:** `echotimeline`
3. **Description:** Turn dusty albums into living timelines - free, private, forever
4. **Public:** ✅ Selected
5. **Add README:** ❌ OFF (we already have one)
6. Click **Create repository**

### Option B: Using Command Line
```bash
# Run this in C:\Users\aziz\.openclaw\workspace\echotimeline\
gh repo create echotimeline --public --description "Turn dusty albums into living timelines"
```

---

## Step 2: Push Your Code

After creating the repo, run these commands:

```bash
cd C:\Users\aziz\.openclaw\workspace\echotimeline
git remote add origin https://github.com/touihrinour7-gif/echotimeline.git
git branch -M main
git push -u origin main
```

---

## Step 3: Setup Firebase (FREE)

1. Go to: https://console.firebase.google.com/
2. Click **Add project**
3. **Project name:** `echotimeline`
4. Enable **Google Analytics:** ❌ (save resources)
5. Wait for Firebase to create your project
6. Enable these services:

### Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add your email to authorized domains

### Firestore Database
1. Go to **Firestore Database** → **Create database**
2. **Location:** us-central1
3. **Mode:** Start in production mode

### Storage
1. Go to **Storage** → **Get started**
2. **Rules:** Start in test mode (for development)

### Get Your Config
1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** → Click **</> (Web)**
3. **App nickname:** echotimeline
4. Click **Register app**
5. Copy these values:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=echotimeline.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=echotimeline
VITE_FIREBASE_STORAGE_BUCKET=echotimeline.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## Step 4: Deploy to Vercel (FREE)

1. Go to: https://vercel.com/new
2. Click **Import** on your `echotimeline` repo
3. **Framework Preset:** Vite
4. **Root Directory:** `client`
5. Click **Deploy**

### Add Environment Variables
After deployment starts, click **Environment Variables** and add:

| Name | Value |
|------|-------|
| VITE_FIREBASE_API_KEY | (from Firebase) |
| VITE_FIREBASE_AUTH_DOMAIN | (from Firebase) |
| VITE_FIREBASE_PROJECT_ID | (from Firebase) |
| VITE_FIREBASE_STORAGE_BUCKET | (from Firebase) |
| VITE_FIREBASE_MESSAGING_SENDER_ID | (from Firebase) |
| VITE_FIREBASE_APP_ID | (from Firebase) |

Vercel will auto-redeploy with your Firebase config!

---

## Step 5: Custom Domain (Optional - $12/year)

Want `echotimeline.app` instead of `echotimeline.vercel.app`?

1. Go to: https://porkbun.com
2. Search: `echotimeline.app`
3. **Price:** ~$12/year
4. Add to cart → Checkout

### Connect to Vercel
1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your domain: `echotimeline.app`
3. Copy the DNS records shown
4. Add them to Porkbun DNS settings

---

## Your EchoTimeline URL:

**Frontend:** https://echotimeline.vercel.app (or your custom domain)

---

## Troubleshooting

### "Firebase not configured"
- Check Vercel Environment Variables are correct
- Redeploy after adding variables

### "Auth error"
- Add domain to Firebase your Console → Authentication → Authorized domains

### "Storage permission denied"
- Update Firebase Storage rules to allow reads/writes during development

---

## Development

```bash
# Run locally
cd C:\Users\aziz\.openclaw\workspace\echotimeline
npm install
npm run dev

# Open http://localhost:3000
```

---

## Next Features to Add

- [ ] Backend API (Express + Render free tier)
- [ ] AR Overlay (WebXR)
- [ ] Face Clustering (Florence-2 AI)
- [ ] Email invitations
- [ ] Weekly nudge system
