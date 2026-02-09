import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { dbHelpers } from '../lib/supabase'
import { demoStorage } from '../lib/demoStorage'
import { autoSort, faceDetection } from '../lib/faceDetection'
import { ArrowLeft, Upload, Trash2, Users, Sparkles, Calendar, MapPin, X, Image, Download, Upload as UploadIcon } from 'lucide-react'
import { LoadingPage, LoadingSpinner } from '../components/LoadingSpinner'
import { DemoModeBadge } from '../components/DemoModeBadge'
import toast from 'react-hot-toast'

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
  const importInputRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    loadTimelineData()
    loadFaceApi()
  }, [id, user, isDemoMode])

  const loadFaceApi = async () => {
    try {
      const status = await faceDetection.getStatus()
      
      if (status.apiLoaded) {
        // API already loaded
        setFaceApiLoaded(true)
        return
      }
      
      // Try to load the API
      await faceDetection.loadFaceAPI()
      
      // Now load the models
      const modelsLoaded = await faceDetection.loadModels()
      setFaceApiLoaded(modelsLoaded)
    } catch (error) {
      console.warn('Face API loading failed:', error.message)
      setFaceApiLoaded(false)
    }
  }

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

        // Get photos from DemoModeProvider state via demoStorage
        const timelinePhotos = demoStorage.getPhotos(id)
        setPhotos(timelinePhotos)
        setSortedPhotos(autoSort.sortByMetadata(timelinePhotos))
      } else {
        // Load from Supabase
        const { data: timelineData, error: timelineError } = await dbHelpers.getTimelines(user.id)

        if (timelineError) {
          toast.error(timelineError)
          navigate('/dashboard')
          return
        }

        const currentTimeline = timelineData?.find(t => t.id === id)

        if (!currentTimeline) {
          toast.error('Timeline not found')
          navigate('/dashboard')
          return
        }

        setTimeline(currentTimeline)

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
        // Validate file
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image`)
          continue
        }

        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 10MB)`)
          continue
        }

        // Extract basic metadata
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

      // Update state ONCE after all uploads complete
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
      e.target.value = '' // Reset file input
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
      toast.dismiss()
      toast.success('Photos sorted by date!')
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to sort photos')
    }
  }

  const handleDetectFaces = async () => {
    if (photos.length === 0) {
      toast.error('No photos to analyze')
      return
    }

    // Try to load face detection if not loaded yet
    if (!faceApiLoaded) {
      toast.loading('Loading face detection...', { id: 'face' })
      try {
        await loadFaceApi()
        
        if (!faceApiLoaded) {
          toast.dismiss()
          toast.error('Face detection failed to load. Please refresh the page.')
          return
        }
      } catch (error) {
        toast.dismiss()
        toast.error('Face detection unavailable. Check your connection.')
        return
      }
    }

    toast.loading('Detecting faces...', { id: 'face' })

      // Run face clustering
      const clusters = await faceDetection.clusterFaces(photos)

      toast.dismiss()

      if (clusters.length === 0) {
        toast.error('No faces detected in any photos')
      } else {
        setFaceClusters(clusters)
        setShowFaceClusters(true)
        toast.success(`Found ${clusters.length} face cluster${clusters.length > 1 ? 's' : ''}!`)
      }
    } catch (error) {
      toast.dismiss()
      console.error('Face detection error:', error)
      toast.error('Face detection failed. Please try again.')
    }
  }

  const handleExport = () => {
    if (photos.length === 0) {
      toast.error('No photos to export')
      return
    }

    const exportData = {
      timeline: {
        id: timeline.id,
        title: timeline.title,
        description: timeline.description,
        created_at: timeline.created_at,
        photo_count: photos.length
      },
      photos: photos.map(photo => ({
        id: photo.id,
        title: photo.title,
        description: photo.description,
        date: photo.date,
        location: photo.location,
        url: photo.url,
        created_at: photo.created_at
      })),
      exported_at: new Date().toISOString(),
      exported_from: 'EchoTimeline'
    }

    // Create and download JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `echotimeline-${timeline.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('Timeline exported successfully!')
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result)

        if (!data.photos || !Array.isArray(data.photos)) {
          toast.error('Invalid import file format')
          return
        }

        let importedCount = 0

        for (const photo of data.photos) {
          // Convert data URL back to blob-like object for demo mode
          if (isDemoMode && photo.url && photo.url.startsWith('data:')) {
            // For demo mode, we can use the data URL directly
            const newPhoto = {
              id: photo.id || Date.now().toString() + Math.random().toString(36).substring(7),
              timeline_id: id,
              url: photo.url,
              title: photo.title || 'Imported photo',
              description: photo.description || '',
              date: photo.date || new Date().toISOString(),
              location: photo.location || '',
              created_at: new Date().toISOString()
            }
            demoStorage.uploadPhoto(id, { ...newPhoto, name: newPhoto.title }, newPhoto)
            importedCount++
          }
        }

        if (importedCount > 0) {
          toast.success(`Imported ${importedCount} photo${importedCount > 1 ? 's' : ''}!`)
          loadTimelineData() // Refresh the timeline
        } else {
          toast.error('No photos could be imported')
        }
      } catch (error) {
        console.error('Import error:', error)
        toast.error('Failed to import file. Please check the format.')
      }
    }
    reader.readAsText(file)
    e.target.value = '' // Reset input
  }

  const triggerImport = () => {
    importInputRef.current?.click()
  }

  if (loading) {
    return <LoadingPage text="Loading timeline..." />
  }

  if (!timeline) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <DemoModeBadge isDemoMode={isDemoMode} onToggle={() => {}} />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{timeline.title}</h1>
                {timeline.description && (
                  <p className="text-sm text-gray-600 mt-1">{timeline.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                <Upload className="w-5 h-5" />
                <span>Upload</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <input
                ref={importInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              {photos.length > 0 && (
                <button
                  onClick={triggerImport}
                  className="cursor-pointer flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Import from backup"
                >
                  <UploadIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Import</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tools Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleAutoSort}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Auto-Sort
            </button>
            <button
              onClick={handleDetectFaces}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              title={faceApiLoaded ? 'Detect and cluster faces' : 'Click to load face detection'}
            >
              <Users className="w-4 h-4" />
              Face Clusters
            </button>
            <button
              onClick={handleExport}
              disabled={photos.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {uploading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <LoadingSpinner size="sm" text="Uploading photos..." />
          </div>
        )}

        {photos.length === 0 ? (
          <div className="text-center py-16">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No photos yet
            </h3>
            <p className="text-gray-500 mb-6">
              Upload your first photo to start building your timeline
            </p>
            <label className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
              <Upload className="w-5 h-5" />
              Upload Photos
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {photos.length} photo{photos.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={photo.url}
                      alt={photo.title || 'Photo'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletePhoto(photo)
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                      {photo.title || 'Untitled'}
                    </h4>
                    {photo.date && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(photo.date).toLocaleDateString()}
                      </p>
                    )}
                    {photo.location && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {photo.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Face Clusters Modal */}
        {showFaceClusters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Face Clusters</h2>
                <button
                  onClick={() => setShowFaceClusters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {faceClusters.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No faces detected</p>
              ) : (
                <div className="space-y-6">
                  {faceClusters.map((cluster, index) => (
                    <div key={cluster.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Person {index + 1} ({cluster.photos.length} photos)
                      </h3>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {cluster.photos.slice(0, 12).map(photoId => {
                          const photo = photos.find(p => p.id === photoId)
                          return photo ? (
                            <img
                              key={photoId}
                              src={photo.url}
                              alt="Face"
                              className="aspect-square object-cover rounded"
                              loading="lazy"
                            />
                          ) : null
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Photo Detail Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-2 bg-white rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-auto rounded-lg"
              />
              <div className="bg-white mt-4 p-4 rounded-lg">
                <h3 className="font-bold text-xl mb-2">{selectedPhoto.title || 'Untitled'}</h3>
                {selectedPhoto.description && (
                  <p className="text-gray-700 mb-2">{selectedPhoto.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {selectedPhoto.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedPhoto.date).toLocaleDateString()}
                    </span>
                  )}
                  {selectedPhoto.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedPhoto.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
