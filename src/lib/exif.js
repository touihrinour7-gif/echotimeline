import exifr from 'exifr'

// Extract EXIF data from image file
export async function extractEXIF(file) {
  try {
    const output = await exifr.parse(file, {
      tiff: true,
      exif: true,
      gps: true,
      interop: true,
    })
    
    // Extract key fields
    const dateTime = output?.DateTimeOriginal || 
                     output?.DateTime || 
                     output?.DateTimeDigitized ||
                     null
    
    const make = output?.Make || ''
    const model = output?.Model || ''
    
    // Convert GPS coordinates to decimal
    let lat = null, lng = null
    if (output?.latitude && output?.longitude) {
      lat = output.latitude
      lng = output.longitude
    }
    
    return {
      date: dateTime ? parseEXIFDate(dateTime) : new Date(),
      dateTimeOriginal: dateTime,
      make,
      model,
      latitude: lat,
      longitude: lng,
      width: output?.PixelXDimension || null,
      height: output?.PixelYDimension || null,
      orientation: output?.Orientation || null,
      iso: output?.ISOSpeedRatings || null,
      fNumber: output?.FNumber ? `f/${output.FNumber}` : null,
      exposureTime: output?.ExposureTime ? `1/${Math.round(1/output.ExposureTime)}s` : null,
      focalLength: output?.FocalLength ? `${output.FocalLength}mm` : null,
    }
  } catch (error) {
    console.warn('EXIF extraction failed:', error)
    return {
      date: new Date(),
      dateTimeOriginal: null,
      make: '',
      model: '',
      latitude: null,
      longitude: null,
    }
  }
}

// Parse EXIF date format (YYYY:MM:DD HH:MM:SS)
function parseEXIFDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return new Date()
  
  try {
    const [datePart, timePart] = dateString.split(' ')
    if (!datePart || !timePart) return new Date()
    
    const [year, month, day] = datePart.split(':').map(Number)
    const [hours, minutes, seconds] = timePart.split(':').map(Number)
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) return new Date()
    
    return new Date(year, month - 1, day, hours || 0, minutes || 0, seconds || 0)
  } catch (error) {
    console.warn('Failed to parse EXIF date:', dateString)
    return new Date()
  }
}

// Format date for display
export function formatDate(date, format = 'medium') {
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

// Get relative time (e.g., "2 days ago")
export function getRelativeTime(date) {
  if (!date) return ''
  
  const now = new Date()
  const d = new Date(date)
  const diff = now - d
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const weeks = Math.floor(diff / 604800000)
  const months = Math.floor(diff / 2592000000)
  const years = Math.floor(diff / 31536000000)
  
  if (years > 0) return `${years}y ago`
  if (months > 0) return `${months}mo ago`
  if (weeks > 0) return `${weeks}w ago`
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

// Generate decade label
export function getDecadeLabel(date) {
  if (!date) return 'Unknown'
  
  const year = new Date(date).getFullYear()
  const decade = Math.floor(year / 10) * 10
  return `${decade}s`
}

// Group photos by year
export function groupPhotosByYear(photos) {
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
