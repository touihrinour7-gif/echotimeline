import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ymtzilzrbbxaduquechb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltdHppbHpyYmJ4YWR1cXVlY2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5ODA4MzQsImV4cCI6MjA1NDU1NjgzNH0.sL7pQa7vBMXEwqLpVZTBVPvvMQvBzqNwGvZxVxQdRhg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  },
  global: {
    headers: {
      'x-application-name': 'echotimeline'
    }
  }
})

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR'))
}

export const handleSupabaseError = (error) => {
  if (!error) return null
  
  console.error('Supabase Error:', error)
  
  const errorMessage = error?.message || error?.error_description || String(error)
  
  if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
    return 'Network connection failed. Please check your internet connection.'
  }
  
  if (errorMessage.includes('JWT') || errorMessage.includes('token')) {
    return 'Your session has expired. Please sign in again.'
  }
  
  if (errorMessage.includes('Email not confirmed')) {
    return 'Please verify your email address before signing in.'
  }
  
  if (errorMessage.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please try again.'
  }
  
  if (errorMessage.includes('User already registered')) {
    return 'An account with this email already exists. Please sign in instead.'
  }
  
  if (errorMessage.includes('row-level security')) {
    return 'Permission denied. Please make sure you are signed in.'
  }
  
  return errorMessage.length > 100 ? 'An error occurred. Please try again.' : errorMessage
}

export const dbHelpers = {
  async getTimelines(userId) {
    if (!userId) return { data: null, error: 'User ID required' }
    
    try {
      const { data, error } = await supabase
        .from('timelines')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  async createTimeline(userId, timeline) {
    if (!userId) return { data: null, error: 'User ID required' }
    if (!timeline.title?.trim()) return { data: null, error: 'Title is required' }
    
    try {
      const { data, error } = await supabase
        .from('timelines')
        .insert([{
          user_id: userId,
          title: timeline.title.trim(),
          description: timeline.description?.trim() || null,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  async updateTimeline(id, updates) {
    if (!id) return { data: null, error: 'Timeline ID required' }
    
    try {
      const cleanUpdates = {}
      if (updates.title !== undefined) cleanUpdates.title = updates.title.trim()
      if (updates.description !== undefined) cleanUpdates.description = updates.description?.trim() || null
      
      const { data, error } = await supabase
        .from('timelines')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  async deleteTimeline(id) {
    if (!id) return { error: 'Timeline ID required' }
    
    try {
      // First delete all photos in this timeline
      const { data: photos } = await supabase
        .from('photos')
        .select('storage_path')
        .eq('timeline_id', id)
      
      // Delete photos from storage
      if (photos && photos.length > 0) {
        const paths = photos.map(p => p.storage_path).filter(Boolean)
        if (paths.length > 0) {
          await supabase.storage.from('photos').remove(paths)
        }
      }
      
      // Delete timeline (cascade will delete photos records)
      const { error } = await supabase
        .from('timelines')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: handleSupabaseError(error) }
    }
  },

  async getPhotos(timelineId) {
    if (!timelineId) return { data: null, error: 'Timeline ID required' }
    
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('timeline_id', timelineId)
        .order('date', { ascending: true })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  async uploadPhoto(timelineId, file, metadata) {
    if (!timelineId) return { data: null, error: 'Timeline ID required' }
    if (!file) return { data: null, error: 'File is required' }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { data: null, error: 'Only image files are allowed' }
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return { data: null, error: 'File size must be less than 10MB' }
    }
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${timelineId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName)

      const { data, error } = await supabase
        .from('photos')
        .insert([{
          timeline_id: timelineId,
          url: publicUrl,
          storage_path: fileName,
          title: metadata?.title || file.name,
          description: metadata?.description || null,
          date: metadata?.date || new Date().toISOString(),
          location: metadata?.location || null,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) {
        // Cleanup storage if database insert fails
        await supabase.storage.from('photos').remove([fileName])
        throw error
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  async deletePhoto(id, storagePath) {
    if (!id) return { error: 'Photo ID required' }
    
    try {
      if (storagePath) {
        await supabase.storage.from('photos').remove([storagePath])
      }

      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: handleSupabaseError(error) }
    }
  }
}
