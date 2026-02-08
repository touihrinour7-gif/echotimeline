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
  const [isDemoMode, setIsDemoMode] = useState(() => {
    // Initialize from localStorage
    return demoStorage.isDemoMode() || !isSupabaseConfigured()
  })

  useEffect(() => {
    let subscription

    const initAuth = async () => {
      try {
        if (isDemoMode || !isSupabaseConfigured()) {
          setUser({
            id: 'demo-user',
            email: 'demo@echotimeline.app',
            user_metadata: { full_name: 'Demo User' }
          })
          setLoading(false)
          return
        }

        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
        }
        
        setUser(session?.user ?? null)
        setLoading(false)

        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event)
            setUser(session?.user ?? null)
            
            if (event === 'SIGNED_OUT') {
              setLoading(false)
            }
          }
        )

        subscription = authSubscription
      } catch (error) {
        console.error('Auth initialization error:', error)
        setLoading(false)
      }
    }

    initAuth()

    return () => {
      subscription?.unsubscribe()
    }
  }, [isDemoMode])

  const toggleDemoMode = () => {
    const newMode = !isDemoMode
    setIsDemoMode(newMode)
    demoStorage.setMode(newMode ? 'demo' : 'real')
    
    if (newMode) {
      setUser({
        id: 'demo-user',
        email: 'demo@echotimeline.app',
        user_metadata: { full_name: 'Demo User' }
      })
    } else {
      setUser(null)
    }
  }

  const signUp = async (email, password, fullName) => {
    try {
      if (isDemoMode) {
        return { data: null, error: 'Authentication not available in demo mode. Please switch to real mode.' }
      }

      if (!email || !password) {
        return { data: null, error: 'Email and password are required' }
      }

      if (password.length < 6) {
        return { data: null, error: 'Password must be at least 6 characters long' }
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName?.trim() || 'User' },
          emailRedirectTo: window.location.origin
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error: error.message || 'Failed to sign up' }
    }
  }

  const signIn = async (email, password) => {
    try {
      if (isDemoMode) {
        return { data: null, error: 'Authentication not available in demo mode. Please switch to real mode.' }
      }

      if (!email || !password) {
        return { data: null, error: 'Email and password are required' }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error: error.message || 'Failed to sign in' }
    }
  }

  const signInWithGoogle = async () => {
    try {
      if (isDemoMode) {
        return { data: null, error: 'Google sign in not available in demo mode' }
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Google sign in error:', error)
      return { data: null, error: error.message || 'Failed to sign in with Google' }
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
      
      setUser(null)
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error: error.message || 'Failed to sign out' }
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
