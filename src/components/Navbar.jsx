import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Logo from './Logo'
import { useThemeStore, useAuthStore } from '../store'
import { signOut } from '../lib/supabase'
import { getInitials } from '../lib/helpers'

export default function Navbar() {
  const { dark, toggleDark } = useThemeStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])
  
  const handleLogout = async () => {
    await signOut()
    navigate('/')
    setMenuOpen(false)
  }
  
  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Logo size="md" className="group-hover:scale-105 transition-transform" />
            <span className="font-display font-bold text-xl hidden sm:block">
              EchoTimeline
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/#features" 
              className="text-ink-muted hover:text-ink transition-colors"
            >
              Features
            </Link>
            <Link 
              to="/#how-it-works" 
              className="text-ink-muted hover:text-ink transition-colors"
            >
              How It Works
            </Link>
            <Link 
              to="/#pricing" 
              className="text-ink-muted hover:text-ink transition-colors"
            >
              Pricing
            </Link>
          </div>
          
          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-gold/10 transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? '☀️' : '🌙'}
            </button>
            
            {user ? (
              /* User menu */
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-gold/10 transition-colors"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white text-sm font-medium">
                      {getInitials(user.displayName)}
                    </div>
                  )}
                </button>
                
                {menuOpen && (
                  <>
                    <div 
                      className="fixed inset-0" 
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-sepia-dark rounded-xl shadow-lg border border-gold/20 py-2 animate-fade-in">
                      <div className="px-4 py-2 border-b border-gold/20">
                        <p className="font-medium text-sm truncate">
                          {user.displayName || 'User'}
                        </p>
                        <p className="text-xs text-ink-muted truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-gold/10 transition-colors"
                      >
                        📁 My Timelines
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Sign in button */
              <Link to="/auth" className="btn-primary text-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
