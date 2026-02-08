import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const DemoModeContext = createContext({})

export const useDemoMode = () => {
  const context = useContext(DemoModeContext)
  if (!context) {
    throw new Error('useDemoMode must be used within DemoModeProvider')
  }
  return context
}

export const DemoModeProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('echotimeline_demo_mode') === 'true'
  })

  const [timelines, setTimelines] = useState([])
  const [photos, setPhotos] = useState([])

  // Load demo data from localStorage on mount
  useEffect(() => {
    if (isDemoMode) {
      try {
        const savedTimelines = localStorage.getItem('echotimeline_timelines')
        const savedPhotos = localStorage.getItem('echotimeline_photos')
        
        if (savedTimelines) {
          setTimelines(JSON.parse(savedTimelines))
        }
        if (savedPhotos) {
          setPhotos(JSON.parse(savedPhotos))
        }
      } catch (e) {
        console.error('Error loading demo data:', e)
      }
    }
  }, [isDemoMode])

  // Save demo data to localStorage whenever it changes
  useEffect(() => {
    if (isDemoMode) {
      try {
        localStorage.setItem('echotimeline_timelines', JSON.stringify(timelines))
        localStorage.setItem('echotimeline_photos', JSON.stringify(photos))
      } catch (e) {
        console.error('Error saving demo data:', e)
      }
    }
  }, [timelines, photos, isDemoMode])

  const enableDemoMode = useCallback(() => {
    setIsDemoMode(true)
    localStorage.setItem('echotimeline_demo_mode', 'true')
  }, [])

  const disableDemoMode = useCallback(() => {
    setIsDemoMode(false)
    localStorage.setItem('echotimeline_demo_mode', 'false')
  }, [])

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode(prev => {
      const newMode = !prev
      localStorage.setItem('echotimeline_demo_mode', String(newMode))
      return newMode
    })
  }, [])

  // Timeline operations
  const createTimeline = useCallback((name) => {
    const newTimeline = {
      id: Date.now().toString(),
      name,
      photos: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setTimelines(prev => {
      const updated = [newTimeline, ...prev]
      return updated
    })
    return newTimeline
  }, [])

  const updateTimeline = useCallback((id, updates) => {
    setTimelines(prev => {
      return prev.map(t => 
        t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
      )
    })
  }, [])

  const deleteTimeline = useCallback((id) => {
    setTimelines(prev => prev.filter(t => t.id !== id))
    setPhotos(prev => prev.filter(p => p.timeline_id !== id))
  }, [])

  const getTimeline = useCallback((id) => {
    return timelines.find(t => t.id === id)
  }, [timelines])

  // Photo operations
  const uploadPhoto = useCallback((timelineId, file, metadata = {}) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const newPhoto = {
          id: Date.now().toString(),
          timeline_id: timelineId,
          url: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type,
          created_at: new Date().toISOString(),
          ...metadata
        }
        
        setPhotos(prev => [...prev, newPhoto])
        
        // Update timeline photo count
        setTimelines(prev => 
          prev.map(t => 
            t.id === timelineId 
              ? { ...t, photos: [...(t.photos || []), newPhoto.id], photo_count: (t.photo_count || 0) + 1 }
              : t
          )
        )
        
        resolve(newPhoto)
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }, [])

  const deletePhoto = useCallback((id) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }, [])

  const getPhotosForTimeline = useCallback((timelineId) => {
    return photos.filter(p => p.timeline_id === timelineId)
  }, [photos])

  const clearDemoData = useCallback(() => {
    setTimelines([])
    setPhotos([])
    localStorage.removeItem('echotimeline_timelines')
    localStorage.removeItem('echotimeline_photos')
  }, [])

  const value = {
    isDemoMode,
    enableDemoMode,
    disableDemoMode,
    toggleDemoMode,
    timelines,
    photos,
    createTimeline,
    updateTimeline,
    deleteTimeline,
    getTimeline,
    uploadPhoto,
    deletePhoto,
    getPhotosForTimeline,
    clearDemoData
  }

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  )
}
