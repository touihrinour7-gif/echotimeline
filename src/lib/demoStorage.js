// Demo mode uses localStorage for offline functionality
const STORAGE_KEYS = {
  TIMELINES: 'echotimeline_demo_timelines',
  PHOTOS: 'echotimeline_demo_photos',
  MODE: 'echotimeline_mode'
}

export const demoStorage = {
  // Mode management
  isDemoMode() {
    return localStorage.getItem(STORAGE_KEYS.MODE) === 'demo'
  },

  setMode(mode) {
    localStorage.setItem(STORAGE_KEYS.MODE, mode)
  },

  // Timeline operations
  getTimelines() {
    const data = localStorage.getItem(STORAGE_KEYS.TIMELINES)
    return data ? JSON.parse(data) : []
  },

  createTimeline(timeline) {
    const timelines = this.getTimelines()
    const newTimeline = {
      ...timeline,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    }
    timelines.push(newTimeline)
    localStorage.setItem(STORAGE_KEYS.TIMELINES, JSON.stringify(timelines))
    return newTimeline
  },

  updateTimeline(id, updates) {
    const timelines = this.getTimelines()
    const index = timelines.findIndex(t => t.id === id)
    if (index !== -1) {
      timelines[index] = { ...timelines[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.TIMELINES, JSON.stringify(timelines))
      return timelines[index]
    }
    return null
  },

  deleteTimeline(id) {
    const timelines = this.getTimelines().filter(t => t.id !== id)
    localStorage.setItem(STORAGE_KEYS.TIMELINES, JSON.stringify(timelines))
    
    // Delete associated photos
    const photos = this.getPhotos().filter(p => p.timeline_id !== id)
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos))
  },

  // Photo operations
  getPhotos(timelineId = null) {
    const data = localStorage.getItem(STORAGE_KEYS.PHOTOS)
    const photos = data ? JSON.parse(data) : []
    return timelineId ? photos.filter(p => p.timeline_id === timelineId) : photos
  },

  async uploadPhoto(timelineId, file, metadata) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const photos = this.getPhotos()
        const newPhoto = {
          ...metadata,
          id: Date.now().toString(),
          timeline_id: timelineId,
          url: e.target.result,
          created_at: new Date().toISOString()
        }
        photos.push(newPhoto)
        localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos))
        resolve(newPhoto)
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  },

  deletePhoto(id) {
    const photos = this.getPhotos().filter(p => p.id !== id)
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos))
  },

  // Clear all demo data
  clearAll() {
    localStorage.removeItem(STORAGE_KEYS.TIMELINES)
    localStorage.removeItem(STORAGE_KEYS.PHOTOS)
  }
}
