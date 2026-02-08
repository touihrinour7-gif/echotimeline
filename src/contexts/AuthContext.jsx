import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { demoStorage } from '../lib/demoStorage'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(demoStorage.isDemoMode())

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        if (isDemoMode || !isSupabaseConfigured()) {
          // Demo mode - create a fake user
          setUser({
            id: 'demo-user',
            email: 'demo@example.com',
            user_metadata: { full_name: 'Demo User' }
          })
          setLoading(false)
          return
        }

        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Session check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [isDemoMode])

  const toggleDemoMode = () => {
    const newMode = !isDemoMode
    setIsDemoMode(newMode)
    demoStorage.setMode(newMode ? 'demo' : 'real')
    
    if (newMode) {
      setUser({
        id: 'demo-user',
        email: 'demo@example.com',
        user_metadata: { full_name: 'Demo User' }
      })
    } else {
      setUser(null)
    }
  }

  const signUp = async (email, password, fullName) => {
    try {
      if (isDemoMode) {
        throw new Error('Sign up not available in demo mode')
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }

  const signIn = async (email, password) => {
    try {
      if (isDemoMode) {
        throw new Error('Sign in not available in demo mode. Switch to real mode.')
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }

  const signInWithGoogle = async () => {
    try {
      if (isDemoMode) {
        throw new Error('Google sign in not available in demo mode')
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      if (isDemoMode) {
        setUser(null)
        return { error: null }
      }

      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }

  const value = {
    user,
    loading,
    isDemoMode,
    toggleDemoMode,
    signUp,
    signIn,
    signInWithGoogle,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
