// Face detection using face-api.js (globally loaded)
// Fixed: Better handling for data URLs and blob conversion

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

  async blobToImage(blob) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = URL.createObjectURL(blob)
    })
  },

  async dataURLtoImage(dataUrl) {
    try {
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      return await this.blobToImage(blob)
    } catch (error) {
      console.error('Failed to convert data URL to image:', error)
      return null
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
      if (!faceapi) {
        await this.loadFaceAPI()
      }
      
      if (!modelsLoaded) {
        await this.loadModels()
      }
      
      console.log(`🔍 Processing ${photos.length} photos for face detection...`)
      
      const faceClusters = []
      const threshold = 0.5  // More lenient threshold
      const detectionsMap = []
      
      // Process photos in smaller batches to avoid overwhelming
      const batchSize = 5
      for (let i = 0; i < photos.length; i += batchSize) {
        const batch = photos.slice(i, i + batchSize)
        
        for (const photo of batch) {
          try {
            let imgElement = null
            
            if (photo.url && photo.url.startsWith('data:')) {
              // Handle data URLs from localStorage
              imgElement = await this.dataURLtoImage(photo.url)
            } else {
              // Handle regular URLs
              imgElement = await this.loadImageFromURL(photo.url)
            }
            
            if (!imgElement) {
              console.warn(`⚠️ Could not load image ${photo.id}`)
              continue
            }
            
            // Detect faces with more lenient settings
            const detections = await faceapi
              .detectAllFaces(imgElement, new faceapi.TinyFaceDetectorOptions({
                inputSize: 416,
                scoreThreshold: 0.3
              }))
              .withFaceDescriptors()
            
            if (detections.length > 0) {
              detectionsMap.push({
                photoId: photo.id,
                descriptor: detections[0].descriptor,
                url: photo.url
              })
              console.log(`✅ Face detected in photo ${photo.id}`)
            }
          } catch (error) {
            console.warn(`⚠️ Error processing photo ${photo.id}:`, error.message)
          }
        }
        
        // Small delay between batches
        if (i + batchSize < photos.length) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      
      console.log(`📊 Found faces in ${detectionsMap.length} photos out of ${photos.length}`)
      
      if (detectionsMap.length === 0) {
        return []
      }
      
      // Cluster faces using Euclidean distance
      for (const { photoId, descriptor } of detectionsMap) {
        let foundCluster = false
        
        for (const cluster of faceClusters) {
          try {
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
          } catch (error) {
            console.warn('Error comparing faces:', error)
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
      
      console.log(`🎯 Created ${faceClusters.length} face cluster(s)`)
      return faceClusters
    } catch (error) {
      console.error('❌ Face clustering error:', error)
      return []
    }
  },

  async loadImageFromURL(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image'))
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
