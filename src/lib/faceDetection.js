// Face detection using face-api.js (globally loaded)
// Fixed: Handle data URLs via canvas workaround

let faceapi = null
let modelsLoaded = false
let modelsLoading = false
let modelsLoadPromise = null

export const faceDetection = {
  async loadFaceAPI() {
    if (faceapi) return faceapi
    
    if (typeof window !== 'undefined' && window.faceapi) {
      faceapi = window.faceapi
      return faceapi
    }
    
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (window.faceapi) {
          clearInterval(checkInterval)
          faceapi = window.faceapi
          resolve(faceapi)
        }
      }, 100)
      
      setTimeout(() => {
        clearInterval(checkInterval)
        reject(new Error('Face-API.js failed to load from CDN'))
      }, 10000)
    })
  },

  async loadModels() {
    if (modelsLoaded) return true
    if (modelsLoadPromise) return modelsLoadPromise
    
    modelsLoadPromise = (async () => {
      try {
        const api = await this.loadFaceAPI()
        modelsLoading = true
        
        const MODEL_URL = '/models'
        
        await Promise.all([
          api.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          api.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          api.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ])
        
        modelsLoaded = true
        modelsLoading = false
        console.log('✅ Face detection models loaded successfully')
        return true
      } catch (error) {
        modelsLoading = false
        modelsLoadPromise = null
        console.error('❌ Failed to load face detection models:', error)
        return false
      }
    })()
    
    return modelsLoadPromise
  },

  // Convert data URL to Image element
  async dataURLToImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = dataUrl
    })
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
      if (!faceapi) {
        await this.loadFaceAPI()
      }
      
      if (!modelsLoaded) {
        await this.loadModels()
      }
      
      const faceClusters = []
      const threshold = 0.6
      const detectionsMap = []
      
      console.log(`Processing ${photos.length} photos for face detection...`)
      
      for (const photo of photos) {
        try {
          let imgElement = null
          
          // Handle data URLs (demo mode) or regular URLs
          if (photo.url && photo.url.startsWith('data:')) {
            // For data URLs, create from canvas
            imgElement = await this.loadImageFromDataURL(photo.url)
          } else {
            imgElement = await this.loadImageFromURL(photo.url)
          }
          
          if (!imgElement) {
            console.warn(`Could not load image ${photo.id}`)
            continue
          }
          
          // Use TinyFaceDetector for better performance
          const detections = await faceapi
            .detectAllFaces(imgElement, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 }))
            .withFaceDescriptors()
          
          if (detections.length > 0) {
            detectionsMap.push({
              photoId: photo.id,
              descriptor: detections[0].descriptor,
              url: photo.url
            })
            console.log(`✅ Detected face in photo ${photo.id}`)
          }
        } catch (e) {
          console.warn(`Could not detect faces in photo ${photo.id}:`, e.message)
        }
      }
      
      console.log(`Finished processing. Found faces in ${detectionsMap.length} photos`)
      
      if (detectionsMap.length === 0) {
        console.log('No faces detected - this may be due to:')
        console.log('- Images too small')
        console.log('- Faces too small or obscured')
        console.log('- Poor image quality')
        console.log('- CORS restrictions')
        return []
      }
      
      // Cluster faces by similarity using Euclidean distance
      for (const { photoId, descriptor } of detectionsMap) {
        let foundCluster = false
        
        for (const cluster of faceClusters) {
          const distance = faceapi.euclideanDistance(descriptor, cluster.centroid)
          
          if (distance < threshold) {
            cluster.photos.push({
              id: photoId,
              url: cluster.photos.length > 0 ? cluster.photos[0].url : null
            })
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
            photos: [{ id: photoId, url: null }]
          })
        }
      }
      
      console.log(`Created ${faceClusters.length} face clusters`)
      return faceClusters
    } catch (error) {
      console.error('❌ Face clustering error:', error)
      return []
    }
  },

  async loadImageFromDataURL(dataUrl) {
    try {
      // Convert data URL to blob then to object URL
      const blob = await fetch(dataUrl).then(r => r.blob())
      const objectUrl = URL.createObjectURL(blob)
      
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          URL.revokeObjectURL(objectUrl)
          resolve(img)
        }
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl)
          reject(new Error('Failed to load data URL'))
        }
        img.src = objectUrl
      })
    } catch (error) {
      console.error('Data URL conversion failed:', error)
      return null
    }
  },

  async loadImageFromURL(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image URL'))
      img.src = url
    })
  },

  calculateCentroid(descriptors) {
    if (!descriptors || descriptors.length === 0) return new Float32Array(128)
    const sum = new Float32Array(128).fill(0)
    descriptors.forEach(desc => {
      for (let i = 0; i < 128 && i < desc.length; i++) {
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

// Auto-Sort using simple metadata-based sorting
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
