import { createClient } from '@supabase/supabase-js'

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ymtzilzrbbxaduquechb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltdHppbHpyYmJ4YWR1cXVlY2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzkyOTksImV4cCI6MjA4NjE1NTI5OX0.qTE4WT90oEoXLWcPj1OrSC4DaKuugNOOtZ0mcT93q34'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signInWithGoogle = () => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  })
}

export const signInWithEmail = (email, password) => {
  return supabase.auth.signInWithPassword({ email, password })
}

export const signUpWithEmail = (email, password) => {
  return supabase.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: window.location.origin
    }
  })
}

export const signOut = () => {
  return supabase.auth.signOut()
}

export const onAuthChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
}

// Database helpers
export const db = {
  // Users
  async getUser(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },
  
  async createUser(user) {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single()
    return { data, error }
  },
  
  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },
  
  // Timelines
  async getTimelines(userId) {
    const { data, error } = await supabase
      .from('timelines')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },
  
  async getTimeline(id) {
    const { data, error } = await supabase
      .from('timelines')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },
  
  async createTimeline(timeline) {
    const { data, error } = await supabase
      .from('timelines')
      .insert(timeline)
      .select()
      .single()
    return { data, error }
  },
  
  async updateTimeline(id, updates) {
    const { data, error } = await supabase
      .from('timelines')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },
  
  async deleteTimeline(id) {
    const { error } = await supabase
      .from('timelines')
      .delete()
      .eq('id', id)
    return { error }
  },
  
  // Photos
  async getPhotos(timelineId) {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('timeline_id', timelineId)
      .order('date', { ascending: true, nullsFirst: false })
    return { data, error }
  },
  
  async addPhoto(photo) {
    const { data, error } = await supabase
      .from('photos')
      .insert(photo)
      .select()
      .single()
    return { data, error }
  },
  
  async deletePhoto(id) {
    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// Storage helpers
export const storage = {
  async uploadPhoto(timelineId, file) {
    const fileName = `${Date.now()}-${file.name}`
    const path = `timelines/${timelineId}/${fileName}`
    
    const { data, error } = await supabase.storage
      .from('timelines')
      .upload(path, file)
    
    if (error) return { url: null, error }
    
    const { data: urlData } = supabase.storage
      .from('timelines')
      .getPublicUrl(path)
    
    return { url: urlData.publicUrl, error: null }
  },
  
  async deletePhoto(timelineId, fileName) {
    const path = `timelines/${timelineId}/${fileName}`
    const { error } = await supabase.storage
      .from('timelines')
      .remove([path])
    return { error }
  }
}

export default supabase
