// AI Auto-Sort using simple metadata-based sorting (free)
// Falls back to basic date sorting

export const autoSort = {
  sortByMetadata(photos) {
    // Simple sorting by date and location
    return [...photos].sort((a, b) => {
      // First by date
      const dateA = new Date(a.date || a.created_at)
      const dateB = new Date(b.date || b.created_at)

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB
      }

      // Then by location if available
      if (a.location && b.location && a.location !== b.location) {
        return a.location.localeCompare(b.location)
      }

      return 0
    })
  },

  groupByEvent(photos) {
    // Group photos by temporal proximity (same day = same event)
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

// Face detection using face-api.js (loaded from CDN)
// Runs entirely in the browser, 100% free!

let faceapi = null
let modelsLoaded = false

export const faceDetection = {
  async loadFaceAPI() {
    if (faceapi) return faceapi

    // Check if already loaded
    if (typeof window !== 'undefined' && window.faceapi) {
      faceapi = window.faceapi
      return faceapi
    }

    // Load face-api.js from CDN
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js'
      script.onload = async () => {
        // @ts-ignore - face-api loaded globally
        faceapi = window.faceapi
        resolve(faceapi)
      }
      script.onerror = () => reject(new Error('Failed to load face-api.js'))
      document.head.appendChild(script)
    })
  },

  async loadModels() {
    if (modelsLoaded) return true

    try {
      const api = await this.loadFaceAPI()
      const MODEL_URL = '/models'

      await Promise.all([
        api.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        api.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        api.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ])

      modelsLoaded = true
      console.log('Face detection models loaded')
      return true
    } catch (error) {
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
      if (!faceapi) {
        await this.loadFaceAPI()
      }

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
        await new Promise((resolve) => {
          img.onload = resolve
          img.onerror = resolve // Continue even if load fails
        })
        imageElements.push({ photo, img })
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
      apiLoaded: faceapi !== null && typeof faceapi !== 'undefined'
    }
  }
}
