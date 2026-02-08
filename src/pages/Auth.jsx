import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/UI'
import { signInWithGoogle, signUpWithEmail, signInWithEmail, db } from '../lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { useAuthStore } from '../store'
import { Mail, Lock, User } from 'lucide-react'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  
  const { setUser } = useAuthStore()
  const navigate = useNavigate()
  
  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      const { user } = await signInWithGoogle()
      
      // Create or update user document
      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          createdAt: new Date(),
        })
      }
      
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      })
      
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }
  
  const handleEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      let result
      if (isLogin) {
        result = await signInWithEmail(email, password)
      } else {
        result = await signUpWithEmail(email, password)
        if (result.user) {
          await setDoc(doc(db, 'users', result.user.uid), {
            name: name || email.split('@')[0],
            email,
            createdAt: new Date(),
          })
        }
      }
      
      const { user } = result
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: name || user.displayName,
      })
      
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-ink-muted">
              {isLogin 
                ? 'Sign in to access your timelines' 
                : 'Start preserving your family memories'}
            </p>
          </div>
          
          {/* Google Sign In */}
          <Button
            variant="secondary"
            className="w-full mb-6"
            onClick={handleGoogle}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          
          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-gold/20" />
            <span className="text-sm text-ink-muted">or</span>
            <div className="flex-1 border-t border-gold/20" />
          </div>
          
          {/* Email Form */}
          <form onSubmit={handleEmail} className="space-y-4">
            {!isLogin && (
              <Input
                label="Name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-5 h-5" />}
              />
            )}
            
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
            />
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            
            <Button type="submit" className="w-full" loading={loading}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          
          {/* Toggle */}
          <p className="text-center mt-6 text-sm text-ink-muted">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
        
        {/* Terms */}
        <p className="text-center mt-4 text-xs text-ink-muted">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-ink">Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="underline hover:text-ink">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
