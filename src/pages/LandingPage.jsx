import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '../components/Logo'

export function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    
    // Mouse tracking for interactive background
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animated background particles
  useEffect(() => {
    if (!mounted) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const particles = []
    const particleCount = 50
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.opacity = Math.random() * 0.5 + 0.2
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }
      
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(147, 51, 234, ${this.opacity})`
        ctx.fill()
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#0f0f1a')
      gradient.addColorStop(1, '#1a1a2e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })
      
      // Draw connection lines
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(147, 51, 234, ${0.1 * (1 - distance / 150)})`
            ctx.stroke()
          }
        })
      })
      
      requestAnimationFrame(animate)
    }
    
    const animId = animate()
    
    return () => {
      cancelAnimationFrame(animId)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f0f1a]">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          style={{
            left: '10%',
            top: '20%'
          }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{
            right: '15%',
            bottom: '30%'
          }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-pink-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{
            left: '40%',
            top: '50%'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Logo size="lg" />
            </motion.div>
            <span className="font-display font-bold text-2xl text-white">EchoTimeline</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it Works', 'Pricing'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-gray-300 hover:text-white transition-colors relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="px-6 py-2 text-white hover:text-purple-300 transition-colors"
              >
                Sign In
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">Now with AI Face Detection</span>
            </motion.div>
            
            <h1 className="font-display text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Turn Memories
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Into Magic
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
              Experience the future of photo organization. AI-powered face detection, 
              stunning visualizations, and blockchain-grade security for your memories.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-medium text-lg overflow-hidden"
                >
                  <span className="relative z-10">Start Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => {
                    document.cookie = 'demo_mode=true; path=/'
                    window.location.href = '/dashboard'
                  }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-2xl font-medium text-lg border border-white/20 hover:bg-white/20 transition-all"
                >
                  Try Demo Mode
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Floating Cards */}
          <motion.div
            className="mt-20 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="absolute -top-20 left-1/4 w-64 p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl" />
                <div>
                  <p className="text-white font-medium">Summer 2024</p>
                  <p className="text-gray-400 text-sm">234 photos</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="absolute top-10 right-1/4 w-64 p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20"
              animate={{
                y: [0, 15, 0],
                rotate: [0, -3, 3, 0]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl" />
                <div>
                  <p className="text-white font-medium">Family Reunion</p>
                  <p className="text-gray-400 text-sm">156 photos</p>
                </div>
              </div>
            </motion.div>
            
            {/* Main Dashboard Preview */}
            <motion.div
              className="mx-auto w-full max-w-4xl bg-gradient-to-br from-purple-900/50 to-cyan-900/50 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="p-2 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
              </div>
              <div className="p-8 grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl border border-white/10"
                    whileHover={{ scale: 1.05, rotate: Math.random() * 10 - 5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to organize, protect, and share your memories
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🤖', title: 'AI Face Detection', desc: 'Automatically group photos by people using advanced AI' },
              { icon: '📸', title: 'Bulk Upload', desc: 'Drag & drop hundreds of photos instantly' },
              { icon: '🔒', title: 'Private Forever', desc: 'End-to-end encryption. Your data, yours alone.' },
              { icon: '🌍', title: 'Interactive Maps', desc: 'See where your memories happened on a map' },
              { icon: '👨‍👩‍👧‍👦', title: 'Family Vault', desc: 'Invite family members securely' },
              { icon: '📤', title: 'One-Click Export', desc: 'Download or share timelines instantly' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group p-8 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 hover:bg-white/10 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 py-32 px-6 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Get started in 3 simple steps
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload', desc: 'Drag & drop your photos. We accept any format.' },
              { step: '02', title: 'AI Organize', desc: 'Our AI automatically sorts and groups your photos.' },
              { step: '03', title: 'Enjoy', desc: 'Explore your timeline, share with family, travel back in time.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
                
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-400">
              Free forever for personal use
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                features: ['Unlimited timelines', 'AI auto-sort', 'Demo mode', '100MB cloud storage'],
                highlight: false
              },
              {
                name: 'Pro',
                price: '$15',
                period: '/month',
                features: ['Everything in Free', '10GB cloud storage', 'Priority support', 'Export to PDF'],
                highlight: true
              },
              {
                name: 'Business',
                price: '$99',
                period: '/month',
                features: ['Everything in Pro', 'Unlimited storage', 'API access', 'Dedicated support', 'White-label'],
                highlight: false
              }
            ].map((plan, i) => (
              <motion.div
                key={i}
                className={`relative p-8 rounded-3xl border ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-purple-500/20 to-cyan-500/20 border-purple-500/50'
                    : 'bg-white/5 border-white/10'
                } backdrop-blur-xl`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-medium text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-400">{plan.period}</span>}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-xl font-medium transition-all ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <span className="font-display font-bold text-xl text-white">EchoTimeline</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookies</Link>
              <a href="mailto:support@echotimeline.app" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2024 EchoTimeline. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
