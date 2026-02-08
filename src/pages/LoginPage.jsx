import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Camera, Mail, Lock, User, AlertCircle, Check, Sparkles, Shield, Zap } from 'lucide-react'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ModeToggle } from '../components/DemoModeBadge'
import toast from 'react-hot-toast'

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, signUp, signInWithGoogle, isDemoMode, toggleDemoMode } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isDemoMode) {
        toast.error('Please switch to Real Mode to sign in')
        setLoading(false)
        return
      }

      let result
      if (isLogin) {
        result = await signIn(email, password)
      } else {
        if (!fullName.trim()) {
          setError('Please enter your full name')
          setLoading(false)
          return
        }
        result = await signUp(email, password, fullName)
      }

      if (result.error) {
        setError(result.error)
        toast.error(result.error)
      } else {
        if (!isLogin) {
          toast.success('Account created! Check your email to verify.')
        } else {
          toast.success('Welcome back!')
          navigate('/dashboard')
        }
      }
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      if (isDemoMode) {
        toast.error('Google sign in not available in demo mode')
        setLoading(false)
        return
      }

      const { error } = await signInWithGoogle()
      if (error) {
        setError(error)
        toast.error(error)
        setLoading(false)
      }
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
      setLoading(false)
    }
  }

  const handleDemoMode = () => {
    toggleDemoMode()
    if (!isDemoMode) {
      toast.success('Demo mode activated - Try it now!')
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EchoTimeline</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:inline">Privacy</Link>
              <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:inline">Terms</Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Marketing Copy */}
            <div className="text-center lg:text-left animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Organize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Memories</span> With AI
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Create beautiful photo timelines with intelligent face detection and auto-sorting. Relive your precious moments, organized perfectly.
              </p>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 mb-1">AI-Powered Sorting</h3>
                    <p className="text-sm text-gray-600">Automatically organize photos by date, location, and people</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 mb-1">Secure Storage</h3>
                    <p className="text-sm text-gray-600">Your photos are encrypted and safely stored in the cloud</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 mb-1">Lightning Fast</h3>
                    <p className="text-sm text-gray-600">Upload and organize thousands of photos in seconds</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 mb-1">Free to Try</h3>
                    <p className="text-sm text-gray-600">Test all features with demo mode - no signup required</p>
                  </div>
                </div>
              </div>

              {/* CTA for mobile */}
              <div className="lg:hidden mb-8">
                <button
                  onClick={handleDemoMode}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Try Demo Now - It's Free!
                </button>
              </div>
            </div>

            {/* Right Column - Auth Form */}
            <div className="animate-slide-up">
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md mx-auto lg:mx-0">
                {/* Mode Toggle */}
                <div className="mb-6 flex justify-center">
                  <ModeToggle isDemoMode={isDemoMode} onToggle={handleDemoMode} />
                </div>

                {/* Demo Mode Notice */}
                {isDemoMode && (
                  <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-gray-800 font-medium mb-2">
                      🎉 Demo Mode Active
                    </p>
                    <p className="text-xs text-gray-600">
                      Try all features without signing up. Your data stays in your browser.
                    </p>
                  </div>
                )}

                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  {isLogin ? 'Welcome Back' : 'Get Started Free'}
                </h2>
                <p className="text-gray-600 text-center mb-6">
                  {isLogin ? 'Sign in to access your timelines' : 'Create your account in seconds'}
                </p>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="John Doe"
                          disabled={isDemoMode || loading}
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="you@example.com"
                        disabled={isDemoMode || loading}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        disabled={isDemoMode || loading}
                        required
                        minLength={6}
                      />
                    </div>
                    {!isLogin && (
                      <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isDemoMode}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading || isDemoMode}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>

                {/* Toggle Login/Signup */}
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin)
                      setError('')
                    }}
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    {isLogin ? "Don't have an account? Sign up free" : 'Already have an account? Sign in'}
                  </button>
                </div>

                {/* Demo Mode CTA */}
                {isDemoMode && (
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Continue to Dashboard (Demo)
                    </button>
                  </div>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 text-center space-y-2">
                <p className="text-sm text-gray-600">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Your data is encrypted and secure
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <Link to="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
                  <span>•</span>
                  <Link to="/terms" className="hover:text-gray-700">Terms of Service</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
