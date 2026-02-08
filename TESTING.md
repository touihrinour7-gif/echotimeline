# Testing & Debugging Guide

## Pre-Deployment Testing Checklist

### ✅ Demo Mode Testing

- [ ] Can toggle to Demo Mode on login page
- [ ] Can access dashboard without authentication
- [ ] Can create new timelines
- [ ] Can upload photos
- [ ] Can delete timelines
- [ ] Can delete photos
- [ ] Data persists after page refresh
- [ ] Demo Mode badge is visible
- [ ] Can switch back to Real Mode

### ✅ Real Mode Testing

#### Authentication
- [ ] Can sign up with email/password
- [ ] Receive email verification
- [ ] Can sign in with verified account
- [ ] Can sign in with Google OAuth
- [ ] Can sign out
- [ ] Session persists across page refreshes
- [ ] Redirects to login when not authenticated

#### Timeline Management
- [ ] Can create new timeline
- [ ] Timeline appears in dashboard
- [ ] Can view timeline details
- [ ] Can delete timeline
- [ ] Deleting timeline removes all photos
- [ ] Photo count updates correctly

#### Photo Management
- [ ] Can upload single photo
- [ ] Can upload multiple photos
- [ ] Photo metadata is saved
- [ ] Photos display in timeline
- [ ] Can view photo details
- [ ] Can delete individual photos
- [ ] Storage path is recorded

#### Features
- [ ] Auto-sort organizes photos by date
- [ ] Face clustering button works (shows placeholder)
- [ ] Loading states appear correctly
- [ ] Error messages display properly
- [ ] Success toasts appear
- [ ] All transitions are smooth

## Common Issues & Solutions

### Issue: "Failed to fetch" error

**Symptoms**: Network errors when trying to authenticate or load data

**Solutions**:
1. Check Supabase URL in `.env`
2. Verify internet connection
3. Check Supabase project is running
4. Verify CORS settings in Supabase

```bash
# Test connection
curl https://YOUR_PROJECT.supabase.co/rest/v1/

# Should return project info
```

### Issue: "Session expired" error

**Symptoms**: User gets logged out frequently

**Solutions**:
1. Check auth token refresh in `supabase.js`
2. Verify `autoRefreshToken: true` is set
3. Clear browser cookies and localStorage
4. Check Supabase auth settings

### Issue: Photos not uploading

**Symptoms**: Upload appears to work but photos don't show

**Solutions**:
1. Check storage bucket exists and is named `photos`
2. Verify bucket is set to public
3. Check storage policies in Supabase
4. Verify file size is under limit
5. Check browser console for errors

```sql
-- Verify storage policies
SELECT * FROM storage.buckets WHERE name = 'photos';
SELECT * FROM storage.objects WHERE bucket_id = 'photos' LIMIT 5;
```

### Issue: RLS policy errors

**Symptoms**: "new row violates row-level security policy"

**Solutions**:
1. Run the full `supabase-setup.sql` script
2. Verify user is authenticated
3. Check policy definitions match user ID

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- View policies
SELECT * FROM pg_policies 
WHERE tablename IN ('timelines', 'photos');
```

### Issue: Demo mode data not persisting

**Symptoms**: Data disappears after refresh

**Solutions**:
1. Check localStorage is enabled in browser
2. Don't use incognito/private mode
3. Check browser storage quota
4. Clear cache and try again

```javascript
// Check localStorage in browser console
console.log(localStorage.getItem('echotimeline_demo_timelines'))
console.log(localStorage.getItem('echotimeline_mode'))
```

## Debugging Tools

### Browser DevTools

```javascript
// Check Supabase connection
console.log(supabase.supabaseUrl)
console.log(supabase.supabaseKey)

// Check current user
const { data } = await supabase.auth.getUser()
console.log(data)

// Test database query
const { data, error } = await supabase
  .from('timelines')
  .select('*')
console.log({ data, error })
```

### Supabase Dashboard

1. **Database Logs**: Check SQL queries
2. **Storage Logs**: Check file uploads
3. **Auth Logs**: Check authentication attempts
4. **API Logs**: Check all API calls

### Network Tab

Monitor these requests:
- `POST /auth/v1/token` - Authentication
- `GET /rest/v1/timelines` - Fetch timelines
- `POST /rest/v1/photos` - Upload photos
- `POST /storage/v1/object/photos/` - Upload files

## Testing Scripts

### Test Database Connection

```javascript
// Add to browser console
async function testConnection() {
  const { data, error } = await supabase
    .from('timelines')
    .select('count')
  
  if (error) {
    console.error('❌ Connection failed:', error)
  } else {
    console.log('✅ Connection successful!')
  }
}
testConnection()
```

### Test Authentication

```javascript
async function testAuth() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'testpassword123'
  })
  
  console.log({ data, error })
}
```

### Test File Upload

```javascript
async function testUpload() {
  const file = new File(['test'], 'test.txt', { type: 'text/plain' })
  
  const { data, error } = await supabase.storage
    .from('photos')
    .upload('test/test.txt', file)
  
  console.log({ data, error })
  
  if (data) {
    // Clean up
    await supabase.storage
      .from('photos')
      .remove(['test/test.txt'])
  }
}
```

## Performance Testing

### Lighthouse Audit

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://your-app.vercel.app --view
```

### Load Testing

```bash
# Install k6
brew install k6  # macOS
# or download from k6.io

# Create test script (load-test.js)
# Run test
k6 run load-test.js
```

### Memory Leaks

```javascript
// Monitor memory usage
console.memory
// {
//   jsHeapSizeLimit: 2197815296,
//   totalJSHeapSize: 10000000,
//   usedJSHeapSize: 10000000
// }

// Take heap snapshot in Chrome DevTools
// Memory > Take snapshot
```

## Integration Testing

### Test Flow: Complete User Journey

1. **Sign Up**
   - Navigate to login page
   - Click "Sign Up"
   - Enter credentials
   - Verify email sent
   - Click verification link
   - Redirected to dashboard

2. **Create Timeline**
   - Click "Create New Timeline"
   - Enter title and description
   - Timeline appears in list
   - Photo count shows 0

3. **Upload Photos**
   - Click timeline
   - Upload 3 photos
   - Photos appear in grid
   - Photo count updates to 3

4. **Use Features**
   - Click "Auto-Sort"
   - Photos reorganize
   - Click "Face Clusters"
   - Modal appears with clusters

5. **Clean Up**
   - Delete photos one by one
   - Delete timeline
   - Verify deletion

## Automated Testing (Future)

### Setup Jest + React Testing Library

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

### Example Test

```javascript
import { render, screen } from '@testing-library/react'
import { LoginPage } from './pages/LoginPage'

test('renders login form', () => {
  render(<LoginPage />)
  expect(screen.getByText('EchoTimeline')).toBeInTheDocument()
  expect(screen.getByLabelText('Email')).toBeInTheDocument()
})
```

## Monitoring in Production

### Setup Sentry (Error Tracking)

```bash
npm install @sentry/react
```

```javascript
// Add to main.jsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE
})
```

### Setup Analytics

```javascript
// Add to App.jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function Analytics() {
  const location = useLocation()
  
  useEffect(() => {
    // Track page views
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname
      })
    }
  }, [location])
  
  return null
}
```

## Getting Help

If you encounter issues not covered here:

1. Check browser console for errors
2. Check Supabase logs
3. Review this guide thoroughly
4. Search GitHub issues
5. Create new issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots
   - Browser/OS info
   - Console errors

---

Happy testing! 🧪
