import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button, PhotoCard, Modal, Input } from '../components/UI'
import { db, storage } from '../lib/firebase'
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { extractEXIF, formatDate } from '../lib/exif'
import { useAuthStore, useUIStore } from '../store'
import { generateId } from '../lib/helpers'
import { Upload, Grid, List, Map, Play, Settings, ArrowLeft, X } from 'lucide-react'

export default function Builder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addToast } = useUIStore()
  
  const [timeline, setTimeline] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // grid, list, map
  const [dragActive, setDragActive] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [uploadProgress, setUploadProgress] = useState({})
  
  const fileInputRef = useRef()
  
  useEffect(() => {
    loadTimeline()
  }, [id])
  
  const loadTimeline = async () => {
    setLoading(true)
    try {
      const docRef = doc(db, 'timelines', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setTimeline({ id: docSnap.id, ...data })
        
        // Sort photos by date
        const sortedPhotos = (data.photos || []).sort((a, b) => 
          new Date(a.date) - new Date(b.date)
        )
        setPhotos(sortedPhotos)
      } else {
        addToast({ type: 'error', message: 'Timeline not found' })
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error loading timeline:', error)
      addToast({ type: 'error', message: 'Failed to load timeline' })
    }
    setLoading(false)
  }
  
  // Handle drag and drop
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])
  
  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length > 0) {
      await uploadFiles(files)
    }
  }, [photos])
  
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'))
    if (files.length > 0) {
      await uploadFiles(files)
    }
    e.target.value = ''
  }
  
  const uploadFiles = async (files) => {
    setUploading(true)
    
    try {
      const uploadedPhotos = []
      
      for (const file of files) {
        const photoId = generateId()
        setUploadProgress(prev => ({ ...prev, [photoId]: 0 }))
        
        try {
          // Upload to Firebase Storage
          const storagePath = `timelines/${id}/${photoId}-${file.name}`
          const storageRef = ref(storage, storagePath)
          await uploadBytes(storageRef, file)
          const url = await getDownloadURL(storageRef)
          
          // Extract EXIF data
          const exif = await extractEXIF(file)
          
          // Create photo object
          const photo = {
            id: photoId,
            url,
            name: file.name,
            date: exif.date,
            lat: exif.latitude,
            lng: exif.longitude,
            createdAt: new Date(),
            exif: {
              make: exif.make,
              model: exif.model,
              fNumber: exif.fNumber,
              exposureTime: exif.exposureTime,
              iso: exif.iso,
            }
          }
          
          uploadedPhotos.push(photo)
          setPhotos(prev => [...prev, photo])
          setUploadProgress(prev => ({ ...prev, [photoId]: 100 }))
          
        } catch (error) {
          console.error('Error uploading file:', file.name, error)
          addToast({ type: 'error', message: `Failed to upload ${file.name}` })
        }
      }
      
      // Update Firestore
      if (uploadedPhotos.length > 0) {
        const timelineRef = doc(db, 'timelines', id)
        await updateDoc(timelineRef, {
          photos: arrayUnion(...uploadedPhotos),
          updatedAt: serverTimestamp(),
          count: photos.length + uploadedPhotos.length,
        })
        
        addToast({ 
          type: 'success', 
          message: `Uploaded ${uploadedPhotos.length} photo${uploadedPhotos.length > 1 ? 's' : ''}` 
        })
      }
      
    } catch (error) {
      console.error('Error uploading files:', error)
      addToast({ type: 'error', message: 'Upload failed' })
    }
    
    setUploading(false)
    setUploadProgress({})
  }
  
  const deletePhoto = async (photoId, e) => {
    e.stopPropagation()
    if (!confirm('Delete this photo?')) return
    
    try {
      // Delete from storage
      const storageRef = ref(storage, `timelines/${id}/${photoId}`)
      try {
        await deleteObject(storageRef)
      } catch (e) {
        // File might already be deleted
      }
      
      // Update state
      setPhotos(photos.filter(p => p.id !== photoId))
      
      // Update Firestore (remove from array)
      const timelineRef = doc(db, 'timelines', id)
      const timeline = await getDoc(timelineRef)
      if (timeline.exists()) {
        const photos = timeline.data().photos || []
        const filteredPhotos = photos.filter(p => p.id !== photoId)
        await updateDoc(timelineRef, {
          photos: filteredPhotos,
          count: filteredPhotos.length,
          updatedAt: serverTimestamp(),
        })
      }
      
      addToast({ type: 'success', message: 'Photo deleted' })
      setSelectedPhoto(null)
      
    } catch (error) {
      console.error('Error deleting photo:', error)
      addToast({ type: 'error', message: 'Failed to delete photo' })
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-ink-muted">Loading timeline...</p>
        </div>
      </div>
    )
  }
  
  if (!timeline) return null
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="p-2 hover:bg-gold/10 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-display font-bold">{timeline.name}</h1>
                <p className="text-sm text-ink-muted">
                  {photos.length} photos
                </p>
              </div>
            </div>
            
            {/* Right */}
            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="flex bg-gold/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gold text-white' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-gold text-white' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded ${viewMode === 'map' ? 'bg-gold text-white' : ''}`}
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>
              
              {/* Upload button */}
              <Button onClick={() => fileInputRef.current?.click()} loading={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              
              {/* Preview button */}
              <Link to={`/viewer/${id}`}>
                <Button variant="secondary">
                  <Play className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Drop zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-12 text-center mb-8 transition-all
            ${dragActive 
              ? 'border-gold bg-gold/5 scale-[1.02]' 
              : 'border-gold/30 hover:border-gold/50'
            }
          `}
        >
          <Upload className="w-12 h-12 mx-auto text-gold/50 mb-4" />
          <p className="text-lg font-medium mb-2">
            Drag & drop photos here
          </p>
          <p className="text-ink-muted mb-4">
            or click the button below to select files
          </p>
          <Button onClick={() => fileInputRef.current?.click()} loading={uploading}>
            Select Files
          </Button>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        
        {/* Photos grid */}
        {photos.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
              : 'space-y-4'
          }>
            {photos.map((photo, index) => (
              <div 
                key={photo.id}
                className={`relative group ${viewMode === 'list' ? 'flex gap-4 card p-4' : ''}`}
              >
                <PhotoCard
                  photo={photo}
                  onClick={() => setSelectedPhoto(photo)}
                  className={viewMode === 'list' ? 'w-32 h-32 shrink-0' : ''}
                />
                
                {/* Photo info (list view) */}
                {viewMode === 'list' && (
                  <div className="flex-1 py-2">
                    <p className="font-medium truncate">{photo.name}</p>
                    <p className="text-sm text-ink-muted">{formatDate(photo.date)}</p>
                    {photo.lat && (
                      <p className="text-xs text-ink-muted">📍 {photo.lat.toFixed(2)}, {photo.lng?.toFixed(2)}</p>
                    )}
                  </div>
                )}
                
                {/* Delete button */}
                <button
                  onClick={(e) => deletePhoto(photo.id, e)}
                  className={`
                    absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg
                    opacity-0 group-hover:opacity-100 transition-opacity
                    ${viewMode === 'list' ? 'static ml-auto' : ''}
                  `}
                >
                  <X className="w-4 h-4" />
                </button>
                
                {/* Upload progress */}
                {uploadProgress[photo.id] !== undefined && uploadProgress[photo.id] < 100 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="text-white font-medium">
                      {uploadProgress[photo.id]}%
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-ink-muted">
            <p>No photos yet. Upload some to get started!</p>
          </div>
        )}
      </main>
      
      {/* Photo detail modal */}
      <Modal
        open={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        size="xl"
      >
        {selectedPhoto && (
          <div className="grid md:grid-cols-2 gap-6">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.name}
              className="w-full rounded-lg"
            />
            <div>
              <h3 className="font-bold text-lg mb-4">{selectedPhoto.name}</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-ink-muted">Date</dt>
                  <dd>{formatDate(selectedPhoto.date, 'full')}</dd>
                </div>
                {selectedPhoto.lat && (
                  <div>
                    <dt className="text-ink-muted">Location</dt>
                    <dd>{selectedPhoto.lat.toFixed(4)}, {selectedPhoto.lng?.toFixed(4)}</dd>
                  </div>
                )}
                {selectedPhoto.exif?.make && (
                  <div>
                    <dt className="text-ink-muted">Camera</dt>
                    <dd>{selectedPhoto.exif.make} {selectedPhoto.exif.model}</dd>
                  </div>
                )}
                {selectedPhoto.exif?.fNumber && (
                  <div>
                    <dt className="text-ink-muted">Settings</dt>
                    <dd>{selectedPhoto.exif.fNumber} {selectedPhoto.exif.exposureTime} ISO {selectedPhoto.exif.iso}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-6 flex gap-3">
                <Button variant="danger" onClick={(e) => deletePhoto(selectedPhoto.id, e)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
