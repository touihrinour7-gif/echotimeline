import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '../components/UI'
import { db } from '../lib/supabase'
import { extractEXIF, formatDate } from '../lib/exif'
import { ArrowLeft, Share2, Download, ChevronLeft, ChevronRight, X, Calendar, MapPin } from 'lucide-react'

export default function Viewer() {
  const { id } = useParams()
  const [timeline, setTimeline] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    loadTimeline()
  }, [id])
  
  const loadTimeline = async () => {
    setLoading(true)
    try {
      const { data, error } = await db.getTimeline(id)
      
      if (error) throw error
      
      if (data) {
        setTimeline({ id: data.id, ...data })
        
        // Load photos
        const { data: photosData, error: photosError } = await db.getPhotos(id)
        if (photosError) throw photosError
        
        // Sort photos by date
        const sortedPhotos = (photosData || []).sort((a, b) => 
          new Date(a.date) - new Date(b.date)
        )
        setPhotos(sortedPhotos)
      } else {
        console.error('Timeline not found')
      }
    } catch (error) {
      console.error('Error loading timeline:', error)
    }
    setLoading(false)
  }
  
  const openLightbox = (index) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }
  
  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }
  
  const navigateLightbox = (direction) => {
    const newIndex = currentIndex + direction
    if (newIndex >= 0 && newIndex < photos.length) {
      setCurrentIndex(newIndex)
    }
  }
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return
      
      switch (e.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowLeft':
          navigateLightbox(-1)
          break
        case 'ArrowRight':
          navigateLightbox(1)
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, currentIndex])
  
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
  
  if (!timeline) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-muted mb-4">Timeline not found</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-ink-muted hover:text-ink transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          
          <div className="text-center">
            <h1 className="font-display font-bold">{timeline.name}</h1>
            <p className="text-xs text-ink-muted">{photos.length} photos</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              addToast({ type: 'success', message: 'Link copied!' })
            }}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Timeline */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {photos.length > 0 ? (
          <div className="space-y-8">
            {photos.map((photo, index) => (
              <article key={photo.id} className="card overflow-hidden">
                {/* Photo */}
                <div className="relative">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full cursor-zoom-in"
                    onClick={() => openLightbox(index)}
                    loading="lazy"
                  />
                  
                  {/* Date overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-medium">
                      {formatDate(photo.date, 'long')}
                    </p>
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-ink-muted">
                    {photo.latitude && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {photo.latitude.toFixed(2)}, {photo.longitude?.toFixed(2)}
                      </span>
                    )}
                    {photo.metadata?.make && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {photo.metadata.make} {photo.metadata.model}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      const a = document.createElement('a')
                      a.href = photo.url
                      a.download = photo.name
                      a.click()
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-ink-muted">No photos in this timeline yet.</p>
          </div>
        )}
      </main>
      
      {/* Lightbox */}
      {lightboxOpen && photos.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>
          
          {/* Navigation */}
          {currentIndex > 0 && (
            <button
              onClick={() => navigateLightbox(-1)}
              className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}
          
          {currentIndex < photos.length - 1 && (
            <button
              onClick={() => navigateLightbox(1)}
              className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
          
          {/* Image */}
          <img
            src={photos[currentIndex].url}
            alt={photos[currentIndex].name}
            className="max-h-[85vh] max-w-[90vw] object-contain"
          />
          
          {/* Info */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white">
            <p className="font-medium">{currentIndex + 1} / {photos.length}</p>
            <p className="text-sm text-white/70">{formatDate(photos[currentIndex].date, 'full')}</p>
          </div>
        </div>
      )}
    </div>
  )
}
