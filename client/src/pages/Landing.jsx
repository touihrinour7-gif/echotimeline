import { Link } from 'react-router-dom'
import { useThemeStore } from '../store'
import { 
  ArrowRight, 
  Upload, 
  MapPin, 
  Mic, 
  Video, 
  FileText, 
  Users, 
  Shield,
  Sparkles,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'

export default function Landing() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <div className="min-h-screen bg-sepia-50 dark:bg-midnight-100 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sepia-500 to-sepia-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">E</span>
              </div>
              <span className="text-xl font-display font-bold text-sepia-800 dark:text-sepia-100">
                EchoTimeline
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sepia-600 dark:text-sepia-300 hover:text-sepia-800 dark:hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sepia-600 dark:text-sepia-300 hover:text-sepia-800 dark:hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sepia-600 dark:text-sepia-300 hover:text-sepia-800 dark:hover:text-white transition-colors">
                Pricing
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-sepia-600 dark:text-sepia-300 hover:bg-sepia-200 dark:hover:bg-midnight-200 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              
              <Link 
                to="/login" 
                className="text-sepia-600 dark:text-sepia-300 hover:text-sepia-800 dark:hover:text-white transition-colors font-medium"
              >
                Sign In
              </Link>
              
              <Link 
                to="/dashboard"
                className="btn-primary"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-sepia-900 dark:text-sepia-50 mb-6 leading-tight">
            Turn dusty albums into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sepia-500 to-sepia-700 dark:from-midnight-gold dark:to-yellow-500">
              living timelines
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-sepia-600 dark:text-sepia-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Upload once, watch your family story scroll like magic. No ads, no lock-in, 
            completely private forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/dashboard"
              className="btn-primary text-lg px-8 py-4"
            >
              Start Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <a 
              href="#demo"
              className="btn-secondary text-lg px-8 py-4"
            >
              See Demo
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex items-center justify-center space-x-6 text-sepia-500 dark:text-sepia-400">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Private Forever</span>
            </div>
            <div className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span className="text-sm">Free Storage</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm">AI Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-sepia-100 dark:bg-midnight-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-sepia-900 dark:text-sepia-50 mb-4">
              Everything you need to tell your family's story
            </h2>
            <p className="text-lg text-sepia-600 dark:text-sepia-300 max-w-2xl mx-auto">
              From simple uploads to cinematic exports, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-sepia-100 dark:bg-midnight-300 rounded-xl flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-sepia-600 dark:text-midnight-gold" />
              </div>
              <h3 className="text-xl font-bold text-sepia-800 dark:text-sepia-100 mb-2">
                Bulk Upload
              </h3>
              <p className="text-sepia-600 dark:text-sepia-300">
                Drag and drop hundreds of photos at once. Original quality, lossless storage.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-sepia-100 dark:bg-midnight-300 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-sepia-600 dark:text-midnight-gold" />
              </div>
              <h3 className="text-xl font-bold text-sepia-800 dark:text-sepia-100 mb-2">
                AI Auto-Sort
              </h3>
              <p className="text-sepia-600 dark:text-sepia-300">
                Florence-2 AI analyzes photos and sorts them by date automatically.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-sepia-100 dark:bg-midnight-300 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-sepia-600 dark:text-midnight-gold" />
              </div>
              <h3 className="text-xl font-bold text-sepia-800 dark:text-sepia-100 mb-2">
                Map Timeline
              </h3>
              <p className="text-sepia-600 dark:text-sepia-300">
                See where memories happened. Interactive map pins sync with your timeline.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-sepia-100 dark:bg-midnight-300 rounded-xl flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-sepia-600 dark:text-midnight-gold" />
              </div>
              <h3 className="text-xl font-bold text-sepia-800 dark:text-sepia-100 mb-2">
                Voice Captions
              </h3>
              <p className="text-sepia-600 dark:text-sepia-300">
                Record voice notes for each photo. MediaRecorder API, plays inline.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-sepia-100 dark:bg-midnight-300 rounded-xl flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-sepia-600 dark:text-midnight-gold" />
              </div>
              <h3 className="text-xl font-bold text-sepia-800 dark:text-sepia-100 mb-2">
                4K Video Export
              </h3>
              <p className="text-sepia-600 dark:text-sepia-300">
                Turn your timeline into a cinematic reel. FFmpeg.wasm, all in browser.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-sepia-100 dark:bg-midnight-300 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-sepia-600 dark:text-midnight-gold" />
              </div>
              <h3 className="text-xl font-bold text-sepia-800 dark:text-sepia-100 mb-2">
                Family Vault
              </h3>
              <p className="text-sepia-600 dark:text-sepia-300">
                Invite family members. Real-time collaboration, end-to-end encrypted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-sepia-900 dark:text-sepia-50 mb-4">
              Butter on every screen
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mobile */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Smartphone className="w-12 h-12 text-sepia-500" />
              </div>
              <h3 className="text-xl font-bold text-sepia-800 dark:text-sepia-100 mb-2">
                Mobile
              </h3>
              <p className="text-sepia-600 dark:text-sepia-300">
                Vertical Stories-style swipe. Thumb-friendly buttons.
              </p>
            </div>

            {/* Tablet */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Tablet className="w-12 h-12 text-sepia-500" />
              </div>
              <h3 className="text-xl font-bold text-sepia-800 dark:text-sepia-100 mb-2">
                Tablet
              </h3>
              <p className="text-sepia-600 dark:text-sepia-300">
                Split-view timeline + map. Drag to reorganize.
              </p>
            </div>

            {/* Desktop */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Monitor className="w-12 h-12 text-sepia-500" />
              </div>
              <h3 className="text-xl font-bold text-sepia-800 dark:text-sepia-100 mb-2">
                Desktop
              </h3>
              <p className="text-sepia-600 dark:text-sepia-300">
                Hover cards pop details. Full-width preview export.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-sepia-500 to-sepia-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Ready to tell your family's story?
          </h2>
          <p className="text-xl text-sepia-100 mb-10">
            Join thousands of families keeping memories alive.
          </p>
          
          <Link 
            to="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-white text-sepia-700 rounded-xl font-bold text-lg hover:bg-sepia-50 transition-colors shadow-lg"
          >
            Start Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-sepia-900 dark:bg-midnight-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-sepia-500 to-sepia-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold">E</span>
              </div>
              <span className="text-sepia-300 font-display font-bold">
                EchoTimeline
              </span>
            </div>

            <div className="flex items-center space-x-6 text-sepia-400 text-sm">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>

          <div className="mt-8 text-center text-sepia-500 text-sm">
            © {new Date().getFullYear()} EchoTimeline. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
