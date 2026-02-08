import * as faceapi from 'face-api.js'

let modelsLoaded = false

export const faceDetection = {
  async loadModels() {
    if (modelsLoaded) return true
    
    try {
      const MODEL_URL = '/models'
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ])
      modelsLoaded = true
      return true
    } catch (error) {
      console.error('Failed to load face detection models:', error)
      return false
    }
  },

  async detectFaces(imageElement) {
    try {
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
    try {
      const faceClusters = []
      const threshold = 0.6 // Similarity threshold

      for (const photo of photos) {
        if (!photo.faceDescriptors || photo.faceDescriptors.length === 0) continue

        for (const descriptor of photo.faceDescriptors) {
          let foundCluster = false

          // Try to find matching cluster
          for (const cluster of faceClusters) {
            const distance = faceapi.euclideanDistance(descriptor, cluster.centroid)
            
            if (distance < threshold) {
              cluster.photos.push(photo.id)
              cluster.descriptors.push(descriptor)
              // Update centroid
              cluster.centroid = this.calculateCentroid(cluster.descriptors)
              foundCluster = true
              break
            }
          }

          // Create new cluster if no match found
          if (!foundCluster) {
            faceClusters.push({
              id: `cluster_${faceClusters.length}`,
              centroid: descriptor,
              descriptors: [descriptor],
              photos: [photo.id]
            })
          }
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

  // Placeholder for Google Cloud Vision API
  async detectFacesWithGoogleVision(imageBase64, apiKey) {
    if (!apiKey) {
      console.warn('Google Cloud Vision API key not configured')
      return null
    }

    try {
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [{
              image: { content: imageBase64.split(',')[1] },
              features: [{ type: 'FACE_DETECTION', maxResults: 10 }]
            }]
          })
        }
      )

      const data = await response.json()
      return data.responses[0]?.faceAnnotations || []
    } catch (error) {
      console.error('Google Vision API error:', error)
      return null
    }
  }
}
