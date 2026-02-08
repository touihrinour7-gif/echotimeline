# API & Features Documentation

## Table of Contents
- [Authentication API](#authentication-api)
- [Database API](#database-api)
- [Storage API](#storage-api)
- [AI Features](#ai-features)
- [Demo Mode](#demo-mode)

## Authentication API

### Sign Up

```javascript
import { useAuth } from './contexts/AuthContext'

const { signUp } = useAuth()

// Sign up with email and password
const { data, error } = await signUp(
  'user@example.com',
  'password123',
  'Full Name'
)

if (error) {
  console.error('Sign up failed:', error)
} else {
  console.log('User created:', data.user)
}
```

### Sign In

```javascript
const { signIn } = useAuth()

const { data, error } = await signIn(
  'user@example.com',
  'password123'
)
```

### Sign In with Google

```javascript
const { signInWithGoogle } = useAuth()

const { data, error } = await signInWithGoogle()
// User will be redirected to Google OAuth flow
```

### Sign Out

```javascript
const { signOut } = useAuth()

await signOut()
```

### Get Current User

```javascript
const { user } = useAuth()

console.log(user.id)
console.log(user.email)
console.log(user.user_metadata.full_name)
```

## Database API

### Timelines

#### Get All Timelines

```javascript
import { dbHelpers } from './lib/supabase'

const { data, error } = await dbHelpers.getTimelines(userId)

// Returns: Array of timeline objects
// [{
//   id: 'uuid',
//   user_id: 'uuid',
//   title: 'My Timeline',
//   description: 'Description',
//   photo_count: 5,
//   created_at: '2024-01-01T00:00:00Z'
// }]
```

#### Create Timeline

```javascript
const { data, error } = await dbHelpers.createTimeline(userId, {
  title: 'My New Timeline',
  description: 'A timeline of my memories'
})
```

#### Update Timeline

```javascript
const { data, error } = await dbHelpers.updateTimeline(timelineId, {
  title: 'Updated Title',
  description: 'Updated description'
})
```

#### Delete Timeline

```javascript
const { error } = await dbHelpers.deleteTimeline(timelineId)
// Also deletes all associated photos
```

### Photos

#### Get Photos for Timeline

```javascript
const { data, error } = await dbHelpers.getPhotos(timelineId)

// Returns: Array of photo objects
// [{
//   id: 'uuid',
//   timeline_id: 'uuid',
//   url: 'https://...',
//   storage_path: 'timeline-id/photo.jpg',
//   title: 'Photo title',
//   description: 'Photo description',
//   date: '2024-01-01T00:00:00Z',
//   location: 'Paris, France',
//   created_at: '2024-01-01T00:00:00Z'
// }]
```

#### Upload Photo

```javascript
const file = event.target.files[0]
const metadata = {
  title: 'My Photo',
  description: 'A beautiful sunset',
  date: new Date().toISOString(),
  location: 'Paris, France'
}

const { data, error } = await dbHelpers.uploadPhoto(
  timelineId,
  file,
  metadata
)
```

#### Delete Photo

```javascript
const { error } = await dbHelpers.deletePhoto(photoId, storagePath)
// Removes both database record and storage file
```

## Storage API

### Upload File to Storage

```javascript
import { supabase } from './lib/supabase'

const file = event.target.files[0]
const fileName = `${timelineId}/${Date.now()}.jpg`

const { data, error } = await supabase.storage
  .from('photos')
  .upload(fileName, file)
```

### Get Public URL

```javascript
const { data } = supabase.storage
  .from('photos')
  .getPublicUrl(fileName)

console.log(data.publicUrl)
```

### Delete File from Storage

```javascript
const { error } = await supabase.storage
  .from('photos')
  .remove([fileName])
```

### List Files

```javascript
const { data, error } = await supabase.storage
  .from('photos')
  .list(timelineId)

// Returns array of file objects
```

## AI Features

### Auto-Sort Photos

```javascript
import { autoSort } from './lib/autoSort'

// Sort by metadata (date, location)
const sorted = autoSort.sortByMetadata(photos)

// Sort with AI (requires Hugging Face API key)
const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY
const intelligentlySorted = await autoSort.sortPhotos(photos, apiKey)

// Group by events (same day)
const grouped = autoSort.groupByEvent(photos)
```

### Face Detection

```javascript
import { faceDetection } from './lib/faceDetection'

// Load models (face-api.js)
await faceDetection.loadModels()

// Detect faces in image
const imageElement = document.getElementById('photo')
const faces = await faceDetection.detectFaces(imageElement)

// Cluster faces across photos
const clusters = await faceDetection.clusterFaces(photos)
// Returns: [{
//   id: 'cluster_1',
//   centroid: Float32Array,
//   photos: ['photo-id-1', 'photo-id-2']
// }]
```

### Google Cloud Vision API

```javascript
// Detect faces with Google Vision API
const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY
const faces = await faceDetection.detectFacesWithGoogleVision(
  imageBase64,
  apiKey
)

// Returns Google Vision API response
// {
//   faceAnnotations: [{
//     boundingPoly: { vertices: [...] },
//     fdBoundingPoly: { vertices: [...] },
//     landmarks: [...],
//     rollAngle: 0.5,
//     panAngle: -0.2,
//     tiltAngle: 0.1,
//     detectionConfidence: 0.99,
//     landmarkingConfidence: 0.95,
//     joyLikelihood: 'VERY_LIKELY',
//     sorrowLikelihood: 'VERY_UNLIKELY',
//     angerLikelihood: 'VERY_UNLIKELY',
//     surpriseLikelihood: 'UNLIKELY',
//     underExposedLikelihood: 'VERY_UNLIKELY',
//     blurredLikelihood: 'VERY_UNLIKELY',
//     headwearLikelihood: 'VERY_UNLIKELY'
//   }]
// }
```

## Demo Mode

### Enable Demo Mode

```javascript
import { demoStorage } from './lib/demoStorage'

// Set to demo mode
demoStorage.setMode('demo')

// Check if demo mode is active
const isDemo = demoStorage.isDemoMode()
```

### Demo Mode Operations

```javascript
// Create timeline (stored in localStorage)
const timeline = demoStorage.createTimeline({
  title: 'My Timeline',
  description: 'Demo timeline',
  user_id: 'demo-user'
})

// Get all timelines
const timelines = demoStorage.getTimelines()

// Upload photo
const file = event.target.files[0]
const photo = await demoStorage.uploadPhoto(timelineId, file, {
  title: 'Photo',
  date: new Date().toISOString()
})

// Get photos
const photos = demoStorage.getPhotos(timelineId)

// Delete timeline
demoStorage.deleteTimeline(timelineId)

// Delete photo
demoStorage.deletePhoto(photoId)

// Clear all demo data
demoStorage.clearAll()
```

## Error Handling

All API calls return `{ data, error }` format:

```javascript
const { data, error } = await dbHelpers.getTimelines(userId)

if (error) {
  // Handle error
  console.error(error)
  toast.error(error)
} else {
  // Use data
  setTimelines(data)
}
```

### Common Error Types

```javascript
// Network error
{
  error: 'Network error. Please check your connection.'
}

// Authentication error
{
  error: 'Session expired. Please sign in again.'
}

// Permission error
{
  error: 'You do not have permission to perform this action.'
}

// Validation error
{
  error: 'Invalid input. Please check your data.'
}
```

## Hooks

### useAuth Hook

```javascript
import { useAuth } from './contexts/AuthContext'

function MyComponent() {
  const {
    user,           // Current user object or null
    loading,        // Boolean: true while checking session
    isDemoMode,     // Boolean: true if in demo mode
    toggleDemoMode, // Function: switch between modes
    signUp,         // Function: sign up with email/password
    signIn,         // Function: sign in
    signInWithGoogle, // Function: Google OAuth
    signOut         // Function: sign out
  } = useAuth()
  
  // Use in component
}
```

## React Components

### LoadingSpinner

```javascript
import { LoadingSpinner } from './components/LoadingSpinner'

<LoadingSpinner size="md" text="Loading..." />
// Sizes: sm, md, lg, xl
```

### LoadingPage

```javascript
import { LoadingPage } from './components/LoadingSpinner'

<LoadingPage text="Loading your data..." />
```

### DemoModeBadge

```javascript
import { DemoModeBadge } from './components/DemoModeBadge'

<DemoModeBadge isDemoMode={isDemoMode} onToggle={toggleDemoMode} />
```

### ErrorBoundary

```javascript
import { ErrorBoundary } from './components/ErrorBoundary'

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## Utilities

### Handle Supabase Errors

```javascript
import { handleSupabaseError } from './lib/supabase'

try {
  // Supabase operation
} catch (error) {
  const userMessage = handleSupabaseError(error)
  toast.error(userMessage)
}
```

### Check Supabase Configuration

```javascript
import { isSupabaseConfigured } from './lib/supabase'

if (isSupabaseConfigured()) {
  // Use real mode
} else {
  // Fall back to demo mode
}
```

## Best Practices

### Always Check for Errors

```javascript
const { data, error } = await dbHelpers.getTimelines(userId)
if (error) {
  toast.error(error)
  return
}
// Use data safely
```

### Show Loading States

```javascript
const [loading, setLoading] = useState(false)

const handleAction = async () => {
  setLoading(true)
  try {
    await someAsyncOperation()
  } finally {
    setLoading(false)
  }
}
```

### Provide User Feedback

```javascript
import toast from 'react-hot-toast'

const handleDelete = async () => {
  try {
    await deleteItem()
    toast.success('Item deleted successfully')
  } catch (error) {
    toast.error('Failed to delete item')
  }
}
```

### Clean Up on Unmount

```javascript
useEffect(() => {
  const subscription = supabase.auth.onAuthStateChange(callback)
  
  return () => {
    subscription.unsubscribe()
  }
}, [])
```

## Performance Tips

### Lazy Load Images

```javascript
<img 
  src={photo.url} 
  loading="lazy"
  alt={photo.title}
/>
```

### Memoize Expensive Calculations

```javascript
import { useMemo } from 'react'

const sortedPhotos = useMemo(
  () => autoSort.sortByMetadata(photos),
  [photos]
)
```

### Debounce Search

```javascript
import { useState, useEffect } from 'react'

const [searchTerm, setSearchTerm] = useState('')
const [debouncedTerm, setDebouncedTerm] = useState('')

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedTerm(searchTerm)
  }, 500)
  
  return () => clearTimeout(timer)
}, [searchTerm])
```

---

For more information, check the other documentation files:
- [README.md](./README.md) - Project overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [TESTING.md](./TESTING.md) - Testing guide
