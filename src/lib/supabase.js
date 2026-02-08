import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ymtzilzrbbxaduquechb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltdHppbHpyYmJ4YWR1cXVlY2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5ODA4MzQsImV4cCI6MjA1NDU1NjgzNH0.sL7pQa7vBMXEwqLpVZTBVPvvMQvBzqNwGvZxVxQdRhg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL')
}

// Helper to handle Supabase errors
export const handleSupabaseError = (error) => {
  console.error('Supabase Error:', error)
  
  if (error?.message?.includes('Failed to fetch')) {
    return 'Network error. Please check your connection.'
  }
  
  if (error?.message?.includes('JWT')) {
    return 'Session expired. Please sign in again.'
  }
  
  return error?.message || 'An unexpected error occurred'
}

// Database helpers with error handling
export const dbHelpers = {
  async getTimelines(userId) {
    try {
      const { data, error } = await supabase
        .from('timelines')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  async createTimeline(userId, timeline) {
    try {
      const { data, error } = await supabase
        .from('timelines')
        .insert([{
          user_id: userId,
          ...timeline,
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
    try {
      const { data, error } = await supabase
        .from('timelines')
        .update(updates)
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
    try {
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
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('timeline_id', timelineId)
        .order('date', { ascending: true })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) }
    }
  },

  async uploadPhoto(timelineId, file, metadata) {
    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${timelineId}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file)
      
      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName)

      // Create photo record
      const { data, error } = await supabase
        .from('photos')
        .insert([{
          timeline_id: timelineId,
          url: publicUrl,
          storage_path: fileName,
          ...metadata,
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

  async deletePhoto(id, storagePath) {
    try {
      // Delete from storage
      if (storagePath) {
        await supabase.storage
          .from('photos')
          .remove([storagePath])
      }

      // Delete from database
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
