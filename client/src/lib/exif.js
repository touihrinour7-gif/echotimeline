import EXIF from 'exif-js'

// Extract EXIF data from image
export const extractEXIF = (file) => {
  return new Promise((resolve) => {
    EXIF.getData(file, function() {
      const allTags = EXIF.getAllTags(this)
      
      // Extract key fields
      const dateTime = allTags.DateTimeOriginal || 
                       allTags.DateTime || 
                       allTags.DateTimeDigitized ||
                       null
      
      const make = allTags.Make || ''
      const model = allTags.Model || ''
      const gpsLatitude = allTags.GPSLatitude || null
      const gpsLongitude = allTags.GPSLongitude || null
      
      // Convert GPS coordinates to decimal
      let lat = null, lng = null
      if (gpsLatitude) {
        lat = convertDMSToDD(gpsLatitude)
      }
      if (gpsLongitude) {
        lng = convertDMSToDD(gpsLongitude)
      }
      
      resolve({
        date: dateTime ? parseEXIFDate(dateTime) : null,
        dateTimeOriginal: dateTime,
        make,
        model,
        latitude: lat,
        longitude: lng,
        width: allTags.PixelXDimension || null,
        height: allTags.PixelYDimension || null,
        orientation: allTags.Orientation || null,
        iso: allTags.ISOSpeedRatings || null,
        fNumber: allTags.FNumber ? `f/${allTags.FNumber}` : null,
        exposureTime: allTags.ExposureTime ? `1/${Math.round(1/allTags.ExposureTime)}s` : null,
        focalLength: allTags.FocalLength ? `${allTags.FocalLength}mm` : null,
      })
    })
  })
}

// Convert DMS coordinates to decimal degrees
const convertDMSToDD = (dms) => {
  if (!dms || !Array.isArray(dms)) return null
  
  const [degrees, minutes, seconds] = dms
  if (typeof degrees !== 'number' || typeof minutes !== 'number' || typeof seconds !== 'number') {
    return null
  }
  
  return degrees + (minutes / 60) + (seconds / 3600)
}

// Parse EXIF date format (YYYY:MM:DD HH:MM:SS)
const parseEXIFDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null
  
  try {
    // Handle format: "2023:12:25 14:30:00"
    const [datePart, timePart] = dateString.split(' ')
    if (!datePart || !timePart) return null
    
    const [year, month, day] = datePart.split(':').map(Number)
    const [hours, minutes, seconds] = timePart.split(':').map(Number)
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null
    
    return new Date(year, month - 1, day, hours, minutes, seconds)
  } catch (error) {
    console.warn('Failed to parse EXIF date:', dateString)
    return null
  }
}

// AI-based date estimation using Florence-2 (placeholder)
// In production, this would use the Transformers.js library
export const estimateDateWithAI = async (imageElement) => {
  // This is a placeholder for Florence-2 integration
  // In production, use: https://github.com/xenova/transformers.js
  console.log('Florence-2 AI date estimation would run here')
  return null
}

// Format date for display
export const formatDate = (date, format = 'medium') => {
  if (!date) return 'Unknown date'
  
  const d = new Date(date)
  
  const formats = {
    short: { month: 'short', day: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    time: { hour: 'numeric', minute: '2-digit' },
    full: { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }
  }
  
  return d.toLocaleDateString('en-US', formats[format] || formats.medium)
}

// Generate decade label
export const getDecadeLabel = (date) => {
  if (!date) return 'Unknown'
  
  const year = new Date(date).getFullYear()
  const decade = Math.floor(year / 10) * 10
  return `${decade}s`
}

// Group photos by year
export const groupPhotosByYear = (photos) => {
  const groups = {}
  
  photos.forEach(photo => {
    const year = photo.date ? new Date(photo.date).getFullYear() : 'unknown'
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(photo)
  })
  
  return Object.entries(groups)
    .sort(([a], [b]) => (b === 'unknown' ? -1 : Number(b)) - (a === 'unknown' ? -1 : Number(a)))
    .map(([year, photos]) => ({
      year: year === 'unknown' ? 'Unknown Year' : year,
      photos: photos.sort((a, b) => new Date(a.date) - new Date(b.date))
    }))
}
