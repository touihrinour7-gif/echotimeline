// AI Auto-Sort using Hugging Face Inference API (free tier)
// Falls back to simple metadata-based sorting if API not configured

export const autoSort = {
  async sortPhotos(photos, apiKey = null) {
    if (!apiKey) {
      // Fallback to metadata-based sorting
      return this.sortByMetadata(photos)
    }

    try {
      // Use Hugging Face for image classification
      const enrichedPhotos = await Promise.all(
        photos.map(photo => this.enrichPhotoMetadata(photo, apiKey))
      )

      // Sort by detected categories and dates
      return this.intelligentSort(enrichedPhotos)
    } catch (error) {
      console.error('AI sorting error:', error)
      return this.sortByMetadata(photos)
    }
  },

  async enrichPhotoMetadata(photo, apiKey) {
    try {
      // Use CLIP model for image understanding
      const response = await fetch(
        'https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: photo.url,
            parameters: {
              candidate_labels: ['indoor', 'outdoor', 'people', 'food', 'nature', 'city', 'event']
            }
          })
        }
      )

      if (!response.ok) throw new Error('API request failed')

      const result = await response.json()
      return {
        ...photo,
        aiCategories: result.labels || [],
        aiScores: result.scores || []
      }
    } catch (error) {
      return photo
    }
  },

  intelligentSort(photos) {
    // Group by AI-detected categories, then by date
    const grouped = {}
    
    photos.forEach(photo => {
      const category = photo.aiCategories?.[0] || 'uncategorized'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(photo)
    })

    // Sort each group by date
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => new Date(a.date) - new Date(b.date))
    })

    // Flatten back to array
    return Object.values(grouped).flat()
  },

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
