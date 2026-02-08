# EchoTimeline Deployment Guide

## Quick Start Checklist

- [ ] Supabase project created
- [ ] Database tables created
- [ ] Storage bucket configured
- [ ] Environment variables set
- [ ] Code pushed to GitHub
- [ ] Vercel deployment configured

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Wait for database to initialize

### 1.2 Run Database Setup

1. Go to SQL Editor in Supabase Dashboard
2. Copy contents of `supabase-setup.sql`
3. Paste and run the SQL
4. Verify tables were created

### 1.3 Create Storage Bucket

1. Go to Storage in Supabase Dashboard
2. Click "Create new bucket"
3. Name: `photos`
4. Set to **Public**
5. Click "Create bucket"

### 1.4 Get Credentials

1. Go to Project Settings → API
2. Copy these values:
   - Project URL
   - Anon/Public Key

## Step 2: Environment Variables

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Step 3: Local Testing

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
```

Test both Demo Mode and Real Mode:
- Demo Mode should work immediately
- Real Mode requires Supabase setup

## Step 4: Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

## Step 5: Configure Authentication

### Email/Password Auth

1. Go to Supabase → Authentication → Providers
2. Email provider is enabled by default
3. Configure email templates (optional)

### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
   - `http://localhost:5173/auth/callback` (for local dev)
6. Copy Client ID and Client Secret
7. Go to Supabase → Authentication → Providers
8. Enable Google provider
9. Paste Client ID and Secret
10. Save

## Step 6: Test Deployment

1. Visit your deployed URL
2. Test Demo Mode:
   - Should work immediately
   - Data stored in localStorage
3. Test Real Mode:
   - Sign up with email
   - Create timeline
   - Upload photo
   - Verify data in Supabase

## Step 7: Optional AI Features

### Google Cloud Vision API (Face Detection)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Vision API
3. Create API key
4. Add to Vercel environment:
   ```
   VITE_GOOGLE_VISION_API_KEY=your_api_key
   ```
5. Redeploy

### Hugging Face API (AI Auto-Sort)

1. Go to [Hugging Face](https://huggingface.co)
2. Create account
3. Get API token from Settings
4. Add to Vercel environment:
   ```
   VITE_HUGGINGFACE_API_KEY=your_token
   ```
5. Redeploy

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Connection Issues

- Verify Supabase URL and keys are correct
- Check RLS policies are enabled
- Ensure user is authenticated

### Storage Upload Fails

- Verify storage bucket exists and is public
- Check storage policies are set correctly
- Ensure file size is under limit (default 50MB)

### Demo Mode Not Working

- Check browser localStorage is enabled
- Clear cache and reload
- Don't use incognito mode

## Performance Optimization

### Enable Caching

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Optimize Images

- Use WebP format
- Compress before upload
- Set max dimensions in app

### Database Optimization

```sql
-- Add indexes for better performance
CREATE INDEX idx_photos_created_at ON photos(created_at);
CREATE INDEX idx_timelines_updated_at ON timelines(updated_at);
```

## Monitoring

### Vercel Analytics

1. Enable in Vercel Dashboard
2. Go to Analytics tab
3. Monitor performance metrics

### Supabase Logs

1. Go to Supabase Dashboard
2. Check Database → Logs
3. Check Storage → Logs
4. Monitor API usage

## Backup Strategy

### Automated Backups

Supabase provides daily backups on Pro plan.

### Manual Backup

```bash
# Export database
pg_dump -h db.YOUR_PROJECT.supabase.co -U postgres > backup.sql

# Export storage (using Supabase CLI)
supabase storage download photos --project-ref YOUR_PROJECT_ID
```

## Security Best Practices

1. **Never commit `.env` to Git**
   - Already in `.gitignore`
   - Use Vercel environment variables

2. **Enable RLS on all tables**
   - Already configured in setup script

3. **Use strong passwords**
   - Enforce in authentication settings

4. **Regular updates**
   ```bash
   npm update
   npm audit fix
   ```

5. **Monitor Supabase logs**
   - Check for suspicious activity
   - Set up alerts

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Issues](https://github.com/touihrinour7-gif/echotimeline/issues)

---

🎉 **Congratulations!** Your EchoTimeline app is now deployed and ready to use!
