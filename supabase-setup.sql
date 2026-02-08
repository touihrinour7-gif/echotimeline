-- EchoTimeline Database Setup Script
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. CREATE TABLES
-- =============================================

-- Create timelines table
CREATE TABLE IF NOT EXISTS timelines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  photo_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timeline_id UUID REFERENCES timelines(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT,
  title TEXT,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  face_descriptors JSONB,
  ai_categories JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_timelines_user_id ON timelines(user_id);
CREATE INDEX IF NOT EXISTS idx_photos_timeline_id ON photos(timeline_id);
CREATE INDEX IF NOT EXISTS idx_photos_date ON photos(date);

-- =============================================
-- 2. ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. CREATE RLS POLICIES FOR TIMELINES
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own timelines" ON timelines;
DROP POLICY IF EXISTS "Users can create their own timelines" ON timelines;
DROP POLICY IF EXISTS "Users can update their own timelines" ON timelines;
DROP POLICY IF EXISTS "Users can delete their own timelines" ON timelines;

-- Create new policies
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

-- =============================================
-- 4. CREATE RLS POLICIES FOR PHOTOS
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view photos from their timelines" ON photos;
DROP POLICY IF EXISTS "Users can add photos to their timelines" ON photos;
DROP POLICY IF EXISTS "Users can update photos in their timelines" ON photos;
DROP POLICY IF EXISTS "Users can delete photos from their timelines" ON photos;

-- Create new policies
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

-- =============================================
-- 5. CREATE STORAGE POLICIES
-- =============================================
-- Note: Run these AFTER creating the 'photos' bucket in Supabase Storage UI

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their photos" ON storage.objects;

-- Create storage policies
CREATE POLICY "Users can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'photos' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can view photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos');

CREATE POLICY "Users can delete their photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'photos' AND
    auth.uid() IS NOT NULL
  );

-- =============================================
-- 6. CREATE FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update photo count
CREATE OR REPLACE FUNCTION update_timeline_photo_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE timelines 
    SET photo_count = photo_count + 1,
        updated_at = NOW()
    WHERE id = NEW.timeline_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE timelines 
    SET photo_count = GREATEST(photo_count - 1, 0),
        updated_at = NOW()
    WHERE id = OLD.timeline_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_update_photo_count ON photos;

-- Create trigger
CREATE TRIGGER trigger_update_photo_count
  AFTER INSERT OR DELETE ON photos
  FOR EACH ROW
  EXECUTE FUNCTION update_timeline_photo_count();

-- =============================================
-- SETUP COMPLETE
-- =============================================

-- Verify tables were created
SELECT 'Setup complete! Tables created:' as message;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('timelines', 'photos');
