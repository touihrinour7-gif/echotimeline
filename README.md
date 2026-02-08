# EchoTimeline - Photo Timeline App

A modern, AI-powered photo timeline application built with React and Supabase.

## 🌟 Features

- **Timeline Management**: Create and organize multiple photo timelines
- **Photo Upload**: Upload and manage photos with metadata
- **Demo Mode**: Works offline with localStorage (no backend required)
- **Real Mode**: Full cloud integration with Supabase
- **AI Auto-Sort**: Intelligent photo organization by date and metadata
- **Face Clustering**: Group photos by detected faces (placeholder ready for AI APIs)
- **Authentication**: Email/password and Google OAuth support
- **Responsive Design**: Beautiful UI that works on all devices

## 🚀 Live Demo

Visit: [https://echotimeline.vercel.app](https://echotimeline.vercel.app)

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router v6
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/touihrinour7-gif/echotimeline.git
cd echotimeline

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Required for Real Mode
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional AI Features
VITE_GOOGLE_VISION_API_KEY=your_google_vision_api_key
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key
```

## 🗄️ Supabase Setup

### 1. Create Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create timelines table
CREATE TABLE timelines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  photo_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photos table
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timeline_id UUID REFERENCES timelines(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  title TEXT,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  face_descriptors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create policies for timelines
CREATE POLICY "Users can view their own timelines"
  ON timelines FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own timelines"
  ON timelines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own timelines"
  ON timelines FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own timelines"
  ON timelines FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for photos
CREATE POLICY "Users can view photos from their timelines"
  ON photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM timelines
      WHERE timelines.id = photos.timeline_id
      AND timelines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add photos to their timelines"
  ON photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM timelines
      WHERE timelines.id = photos.timeline_id
      AND timelines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update photos in their timelines"
  ON photos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM timelines
      WHERE timelines.id = photos.timeline_id
      AND timelines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete photos from their timelines"
  ON photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM timelines
      WHERE timelines.id = photos.timeline_id
      AND timelines.user_id = auth.uid()
    )
  );
```

### 2. Create Storage Bucket

1. Go to Storage in Supabase Dashboard
2. Create a new bucket called `photos`
3. Set it to **public**
4. Add this storage policy:

```sql
CREATE POLICY "Users can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

CREATE POLICY "Users can delete their photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Enable Google OAuth (Optional)

1. Go to Authentication → Providers
2. Enable Google provider
3. Add your Google Client ID and Secret
4. Add authorized redirect URLs

## 🎯 Usage

### Demo Mode

1. Click "Demo Mode" toggle on login page
2. Click "Continue to Dashboard"
3. All data stored in browser's localStorage
4. No authentication required
5. Perfect for testing and offline use

### Real Mode

1. Sign up with email/password or Google
2. Create timelines
3. Upload photos
4. Data synced to Supabase cloud

## 🤖 AI Features

### Auto-Sort

- Automatically organizes photos by date and location
- Groups photos from the same event
- Works without any API keys

### Face Clustering (Placeholder)

The app includes placeholder face clustering that can be activated with:

#### Option 1: face-api.js (Browser-based, Free)
- Download face detection models
- Place in `/public/models` directory
- Fully offline, no API needed

#### Option 2: Google Cloud Vision API
- Get API key: https://console.cloud.google.com/apis/credentials
- 1,000 API calls/month FREE
- Add `VITE_GOOGLE_VISION_API_KEY` to `.env`

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐛 Troubleshooting

### Photos not uploading?
- Check Supabase storage bucket is created and public
- Verify storage policies are set correctly
- Check file size limits

### Authentication not working?
- Verify `.env` variables are set
- Check Supabase project URL and anon key
- Ensure RLS policies are enabled

### Demo mode data not persisting?
- Check browser localStorage isn't disabled
- Clear cache and try again
- Don't use incognito/private mode

## 📝 Project Structure

```
echotimeline/
├── src/
│   ├── components/       # Reusable components
│   ├── contexts/         # React contexts (Auth)
│   ├── lib/             # Utilities and helpers
│   │   ├── supabase.js  # Supabase client
│   │   ├── demoStorage.js
│   │   ├── faceDetection.js
│   │   └── autoSort.js
│   ├── pages/           # Page components
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or production!

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Lucide Icons](https://lucide.dev) - Beautiful icons
- [face-api.js](https://github.com/justadudewhohacks/face-api.js) - Face detection

## 📧 Support

Having issues? Open an issue on GitHub or contact the maintainers.

---

Built with ❤️ by the EchoTimeline team
