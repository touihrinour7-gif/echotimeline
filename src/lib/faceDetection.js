// Face detection using face-api.js (ES Module version)
// Properly configured for Vite

let faceapi = null
let modelsLoaded = false
let modelsLoading = false

// ES Module CDN URL
const FACEAPI_ESM_URL = 'https://unpkg.com/face-api.js@0.22.2/dist/face-api.esm.js'

export const faceDetection = {
  async loadFaceAPI() {
    // Return immediately if already loaded
    if (faceapi) return faceapi
    
    // Check if already loaded globally
    if (typeof window !== 'undefined' && window.faceapi) {
      faceapi = window.faceapi
      return faceapi
    }
    
    // Prevent multiple simultaneous loads
    if (typeof window !== 'undefined' && modelsLoading) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return faceapi
    }
    
    if (typeof window !== 'undefined') {
      modelsLoading = true
    }
    
    try {
      // Load as ES module using dynamic import
      const module = await import(FACEAPI_ESM_URL)
      
      // Get the faceapi from the module
      faceapi = module.default || module.faceapi || module
      
      if (!faceapi || typeof faceapi !== 'object') {
        throw new Error('face-api.js ES module failed to initialize')
      }
      
      modelsLoading = false
      console.log('Face-API.js ES module loaded successfully')
      return faceapi
    } catch (error) {
      modelsLoading = false
      console.error('Failed to load face-api.js ES module:', error)
      
      // Fallback: try loading from global script
      try {
        await this.loadFaceAPIFallback()
      } catch (fallbackError) {
        throw new Error('Failed to load face-api.js from all sources')
      }
    }
  },
  
  async loadFaceAPIFallback() {
    return new Promise((resolve, reject) => {
      // Clear any existing scripts to prevent duplicates
      const existingScript = document.querySelector('script[src*="face-api"]')
      if (existingScript) {
        existingScript.remove()
      }
      
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js'
      script.crossOrigin = 'anonymous'
      
      script.onload = () => {
        faceapi = window.faceapi
        if (faceapi) {
          console.log('Face-API.js loaded via fallback')
          resolve(faceapi)
        } else {
          reject(new Error('face-api.js not found on window'))
        }
      }
      
      script.onerror = () => {
        reject(new Error('Failed to load face-api.js fallback'))
      }
      
      document.head.appendChild(script)
    })
  },

  async loadModels() {
    // Return immediately if already loaded
    if (modelsLoaded) return true
    
    // Prevent multiple simultaneous loads
    if (modelsLoading) {
      await new Promise(resolve => setTimeout(resolve, 500))
      return modelsLoaded
    }
    
    try {
      const api = await this.loadFaceAPI()
      modelsLoading = true
      
      // Models are served from /models directory in public folder
      const MODEL_URL = '/models'
      
      await Promise.all([
        api.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        api.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        api.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ])
      
      modelsLoaded = true
      modelsLoading = false
      console.log('Face detection models loaded successfully')
      return true
    } catch (error) {
      modelsLoading = false
      console.error('Failed to load face detection models:', error)
      return false
    }
  },

  async detectFaces(imageElement) {
    try {
      if (!faceapi) {
        await this.loadFaceAPI()
      }
      
      if (!modelsLoaded) {
        const loaded = await this.loadModels()
        if (!loaded) return []
      }
      
      const detections = await faceapi
        .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors()
      
      return detections
    } catch (error) {
      console.error('Face detection error:', error)
      return []
    }
  },

  async clusterFaces(photos) {
    if (!photos || photos.length === 0) return []
    
    try {
      // Load face-api if needed
      if (!faceapi) {
        await this.loadFaceAPI()
      }
      
      // Load models if needed
      if (!modelsLoaded) {
        await this.loadModels()
      }
      
      const faceClusters = []
      const threshold = 0.6
      const detectionsMap = []
      
      // Create Image elements for each photo
      const imageElements = []
      for (const photo of photos) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = photo.url
        
        try {
          await new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve // Continue even if load fails
          })
          imageElements.push({ photo, img })
        } catch (e) {
          console.warn(`Could not load image ${photo.id}`)
        }
      }
      
      // Detect faces in all images
      for (const { photo, img } of imageElements) {
        try {
          const detections = await faceapi
            .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceDescriptors()
          
          if (detections.length > 0) {
            detectionsMap.push({
              photoId: photo.id,
              descriptor: detections[0].descriptor
            })
          }
        } catch (e) {
          console.warn(`Could not detect faces in photo ${photo.id}`)
        }
      }
      
      // If no faces detected, return empty clusters
      if (detectionsMap.length === 0) {
        return []
      }
      
      // Cluster faces by similarity
      for (const { photoId, descriptor } of detectionsMap) {
        let foundCluster = false
        
        for (const cluster of faceClusters) {
          const distance = faceapi.euclideanDistance(descriptor, cluster.centroid)
          
          if (distance < threshold) {
            cluster.photos.push(photoId)
            cluster.descriptors.push(descriptor)
            cluster.centroid = this.calculateCentroid(cluster.descriptors)
            foundCluster = true
            break
          }
        }
        
        if (!foundCluster) {
          faceClusters.push({
            id: `cluster_${faceClusters.length}`,
            centroid: descriptor,
            descriptors: [descriptor],
            photos: [photoId]
          })
        }
      }
      
      return faceClusters
    } catch (error) {
      console.error('Face clustering error:', error)
      return []
    }
  },

  calculateCentroid(descriptors) {
    const sum = new Float32Array(128).fill(0)
    descriptors.forEach(desc => {
      for (let i = 0; i < 128; i++) {
        sum[i] += desc[i]
      }
    })
    return sum.map(val => val / descriptors.length)
  },

  isLoaded() {
    return modelsLoaded && faceapi !== null
  },

  async getStatus() {
    return {
      loaded: modelsLoaded,
      apiLoaded: faceapi !== null && typeof faceapi !== 'undefined',
      loading: modelsLoading
    }
  }
}

// Auto-Sort using simple metadata-based sorting (free)
export const autoSort = {
  sortByMetadata(photos) {
    return [...photos].sort((a, b) => {
      const dateA = new Date(a.date || a.created_at)
      const dateB = new Date(b.date || b.created_at)
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB
      }
      
      if (a.location && b.location && a.location !== b.location) {
        return a.location.localeCompare(b.location)
      }
      
      return 0
    })
  },
  
  groupByEvent(photos) {
    const groups = []
    let currentGroup = []
    let lastDate = null
    
    const sorted = this.sortByMetadata(photos)
    
    sorted.forEach(photo => {
      const photoDate = new Date(photo.date || photo.created_at)
      photoDate.setHours(0, 0, 0, 0)
      
      if (!lastDate || photoDate.getTime() !== lastDate.getTime()) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup)
        }
        currentGroup = [photo]
        lastDate = photoDate
      } else {
        currentGroup.push(photo)
      }
    })
    
    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }
    
    return groups
  }
}
