import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDemoMode } from '../lib/demoStorage'

export function LandingPage() {
  const { enableDemoMode, isDemoMode } = useDemoMode()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: '📸',
      title: 'Bulk Upload',
      description: 'Drag & drop hundreds of photos at once. Original quality, lossless storage.'
    },
    {
      icon: '🤖',
      title: 'AI Auto-Sort',
      description: 'Photos automatically sort by date. Face clustering coming soon!'
    },
    {
      icon: '🗺️',
      title: 'Interactive Maps',
      description: 'GPS coordinates become map pins. See where memories happened.'
    },
    {
      icon: '🔒',
      title: 'Private Forever',
      description: 'Your data is yours. No ads, no tracking, no lock-in.'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Family Vault',
      description: 'Invite family members. Share memories securely.'
    },
    {
      icon: '📤',
      title: 'Export Anything',
      description: 'Download timelines, create PDFs, share links.'
    }
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">E</span>
            </div>
            <span className="font-display font-bold text-xl">EchoTimeline</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-foreground hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
            Turn dusty albums into{' '}
            <span className="text-primary">living timelines</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Upload once, watch your family story scroll like magic. 
            No ads, no lock-in, completely private forever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg hover:opacity-90 transition-opacity"
            >
              Start Free
            </Link>
            <button
              onClick={enableDemoMode}
              className="px-8 py-4 border border-border rounded-xl font-medium text-lg hover:bg-secondary transition-colors"
            >
              Try Demo Mode
            </button>
          </div>
        </div>
      </section>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="bg-primary/10 border border-primary rounded-xl p-4 text-center">
            <p className="font-medium mb-2">🎉 Demo Mode Active!</p>
            <p className="text-sm text-muted-foreground mb-3">
              You're using EchoTimeline without an account. Your data is stored locally.
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              Go to Dashboard →
            </Link>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            Everything you need
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold mb-6">
            Ready to preserve your memories?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of families keeping memories alive.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </Link>
            <button
              onClick={enableDemoMode}
              className="px-8 py-4 border border-border rounded-xl font-medium text-lg hover:bg-secondary transition-colors"
            >
              Try Demo First
            </button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free forever for personal use. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">E</span>
            </div>
            <span className="font-display font-bold">EchoTimeline</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 EchoTimeline. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
