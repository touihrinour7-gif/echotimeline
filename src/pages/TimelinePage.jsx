import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { dbHelpers } from '../lib/supabase'
import { demoStorage } from '../lib/demoStorage'
import { autoSort, faceDetection } from '../lib/faceDetection'
import { ArrowLeft, Upload, Trash2, Users, Sparkles, Calendar, MapPin, X, Image, Download, Upload as UploadIcon, Filter, Grid, List, Heart } from 'lucide-react'
import { LoadingPage, LoadingSpinner } from '../components/LoadingSpinner'
import { DemoModeBadge } from '../components/DemoModeBadge'
import Logo from '../components/Logo'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export const TimelinePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isDemoMode } = useAuth()

  const [timeline, setTimeline] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [sortedPhotos, setSortedPhotos] = useState([])
  const [showFaceClusters, setShowFaceClusters] = useState(false)
  const [faceClusters, setFaceClusters] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [faceApiLoaded, setFaceApiLoaded] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // grid or masonry
  const [sortBy, setSortBy] = useState('date') // date, name, custom
  const importInputRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    loadTimelineData()
  }, [id, user, isDemoMode])

  const loadTimelineData = async () => {
    setLoading(true)
    try {
      if (isDemoMode) {
        const timelines = demoStorage.getTimelines()
        const currentTimeline = timelines.find(t => t.id === id)

        if (!currentTimeline) {
          toast.error('Timeline not found')
          navigate('/dashboard')
          return
        }

        setTimeline(currentTimeline)

        const timelinePhotos = demoStorage.getPhotos(id)
        setPhotos(timelinePhotos)
        setSortedPhotos(autoSort.sortByMetadata(timelinePhotos))
      } else {
        const { data: timelineData, error: timelineError } = await dbHelpers.getTimeline(id, user.id)

        if (timelineError) {
          toast.error(timelineError)
          navigate('/dashboard')
          return
        }

        setTimeline(timelineData)

        const { data: photosData, error: photosError } = await dbHelpers.getPhotos(id)

        if (photosError) {
          toast.error(photosError)
        } else {
          setPhotos(photosData || [])
          setSortedPhotos(autoSort.sortByMetadata(photosData || []))
        }
      }
    } catch (error) {
      console.error('Failed to load timeline:', error)
      toast.error('Failed to load timeline')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    let uploadedCount = 0
    const newPhotos = []

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image`)
          continue
        }

        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 10MB)`)
          continue
        }

        const metadata = {
          title: file.name,
          date: new Date().toISOString(),
          location: '',
          description: ''
        }

        if (isDemoMode) {
          const photo = await demoStorage.uploadPhoto(id, file, metadata)
          newPhotos.push(photo)
          uploadedCount++
        } else {
          const { data, error } = await dbHelpers.uploadPhoto(id, file, metadata)

          if (error) {
            toast.error(`Failed to upload ${file.name}`)
          } else {
            newPhotos.push(data)
            uploadedCount++
          }
        }
      }

      if (newPhotos.length > 0) {
        const updatedPhotos = [...photos, ...newPhotos]
        setPhotos(updatedPhotos)
        setSortedPhotos(autoSort.sortByMetadata(updatedPhotos))
        toast.success(`Uploaded ${uploadedCount} photo${uploadedCount > 1 ? 's' : ''}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDeletePhoto = async (photo) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      if (isDemoMode) {
        demoStorage.deletePhoto(photo.id)
        const newPhotos = photos.filter(p => p.id !== photo.id)
        setPhotos(newPhotos)
        setSortedPhotos(sortedPhotos.filter(p => p.id !== photo.id))
        toast.success('Photo deleted')
      } else {
        const { error } = await dbHelpers.deletePhoto(photo.id, photo.storage_path)

        if (error) {
          toast.error(error)
        } else {
          const newPhotos = photos.filter(p => p.id !== photo.id)
          setPhotos(newPhotos)
          setSortedPhotos(sortedPhotos.filter(p => p.id !== photo.id))
          toast.success('Photo deleted')
        }
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete photo')
    }
  }

  const handleAutoSort = () => {
    toast.loading('Sorting photos...', { id: 'sort' })
    try {
      const sorted = autoSort.sortByMetadata(photos)
      setSortedPhotos(sorted)
      toast.dismiss('sort')
      toast.success('Photos sorted by date!')
    } catch (error) {
      toast.dismiss('sort')
      toast.error('Failed to sort photos')
    }
  }

  const handleDetectFaces = async () => {
    if (photos.length === 0) {
      toast.error('No photos to analyze')
      return
    }

    toast.loading('Loading face detection...', { id: 'face' })
    try {
      await faceDetection.loadFaceAPI()
      await faceDetection.loadModels()
      
      toast.loading('Detecting faces...', { id: 'face' })
      
      const clusters = await faceDetection.clusterFaces(photos)

      toast.dismiss('face')

      if (clusters.length === 0) {
        toast.error('No faces detected. Try clearer photos.')
      } else {
        setFaceClusters(clusters)
        setShowFaceClusters(true)
        toast.success(`Found ${clusters.length} face cluster${clusters.length > 1 ? 's' : ''}!`)
      }
    } catch (error) {
      toast.dismiss('face')
      console.error('Face detection error:', error)
      toast.error('Face detection failed. Please try again.')
    }
  }

  if (loading) {
    return <LoadingPage text="Loading your memories..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </motion.button>
              <div className="flex items-center gap-2">
                <Logo size="md" />
                <span className="font-bold text-gray-900 dark:text-white hidden sm:block">
                  {timeline?.title || 'Timeline'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'masonry' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <DemoModeBadge />
            </div>
          </div>

          {/* Tools Bar */}
          <div className="flex items-center gap-3 py-3 overflow-x-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </motion.button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAutoSort}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>Auto-Sort</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDetectFaces}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-all whitespace-nowrap"
            >
              <Users className="w-4 h-4" />
              <span>Face Clusters</span>
            </motion.button>

            {photos.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload indicator */}
        {uploading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3"
          >
            <LoadingSpinner size="sm" text="Uploading photos..." />
            <span className="font-medium">Uploading your memories...</span>
          </motion.div>
        )}

        {/* Face Clusters Banner */}
        {showFaceClusters && faceClusters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6" />
              <div>
                <p className="font-semibold">Found {faceClusters.length} face cluster{faceClusters.length > 1 ? 's' : ''}!</p>
                <p className="text-sm opacity-90">Click on any cluster to view photos</p>
              </div>
            </div>
            <button
              onClick={() => setShowFaceClusters(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Photos Grid */}
        {sortedPhotos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-3xl flex items-center justify-center mb-6">
              <Image className="w-16 h-16 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No photos yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Upload your first photo to start building your timeline
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <Upload className="w-5 h-5" />
              Upload Photos
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Photo count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between mb-6"
            >
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">{photos.length}</span> photo{photos.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter className="w-4 h-4" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value)
                    if (e.target.value === 'date') {
                      setSortedPhotos(autoSort.sortByMetadata(photos))
                    }
                  }}
                  className="bg-transparent border-none outline-none cursor-pointer"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </motion.div>

            {/* Photos Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
                  : 'grid-cols-1 max-w-2xl mx-auto'
              }`}
            >
              {sortedPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all"
                >
                  <img
                    src={photo.url}
                    alt={photo.title || 'Photo'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletePhoto(photo)
                      }}
                      className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Info */}
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium truncate">
                      {photo.title || 'Untitled'}
                    </p>
                    <p className="text-white/70 text-xs">
                      {new Date(photo.date || photo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </main>

      {/* Photo Detail Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title || 'Photo'}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {selectedPhoto.title || 'Untitled'}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {new Date(selectedPhoto.date || selectedPhoto.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeletePhoto(selectedPhoto)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TimelinePage
