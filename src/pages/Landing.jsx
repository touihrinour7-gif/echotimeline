import { Link } from 'react-router-dom'
import { Button } from '../components/UI'
import { ArrowRight, Upload, Calendar, MapPin, Users, Shield, Video, FileText } from 'lucide-react'

export default function Landing() {
  const features = [
    {
      icon: Upload,
      title: 'Bulk Upload',
      description: 'Drag & drop hundreds of photos at once. Original quality, lossless storage.'
    },
    {
      icon: Calendar,
      title: 'Auto-Sort',
      description: 'EXIF extraction + AI sorts photos by date automatically. No manual work needed.'
    },
    {
      icon: MapPin,
      title: 'Interactive Maps',
      description: 'GPS coordinates become Leaflet/OpenStreetMap markers. See where memories happened.'
    },
    {
      icon: Video,
      title: '4K Video Export',
      description: 'Turn your timeline into a cinematic reel. FFmpeg.wasm, all in browser.'
    },
    {
      icon: FileText,
      title: 'PDF Book Export',
      description: 'Generate beautiful chronological photo books. jsPDF, printable quality.'
    },
    {
      icon: Users,
      title: 'Family Vault',
      description: 'Invite family members with viewer/editor roles. End-to-end encrypted.'
    },
  ]
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Turn dusty albums into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-dark">
              living timelines
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-ink-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Upload once, watch your family story scroll like magic. No ads, no lock-in, 
            completely private forever.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg">
                Start Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
          
          {/* Trust badges */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-ink-muted">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Private Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Free Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>AI Powered</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gold/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              Everything you need
            </h2>
            <p className="text-ink-muted max-w-2xl mx-auto">
              From simple uploads to cinematic exports, we've got you covered.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="card-hover p-6">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-ink-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-ink-muted">
              Three simple steps to preserve your memories.
            </p>
          </div>
          
          <div className="space-y-12">
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Upload your photos</h3>
                <p className="text-ink-muted">
                  Drag and drop hundreds of photos at once. We keep original quality, 
                  no compression, no loss.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">AI does the sorting</h3>
                <p className="text-ink-muted">
                  Our AI reads EXIF dates, detects locations, and automatically 
                  organizes your timeline chronologically.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Share with family</h3>
                <p className="text-ink-muted">
                  Invite family members to your private vault. Export as video, 
                  PDF, or share private links.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gold to-gold-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold mb-6">
            Ready to tell your family's story?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of families keeping memories alive.
          </p>
          <Link to="/dashboard">
            <Button variant="secondary" size="lg" className="bg-white text-gold hover:bg-white/90">
              Start Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer info */}
      <section className="py-12 px-4 text-center text-ink-muted text-sm">
        <p>Free forever for personal use. No credit card required.</p>
      </section>
    </div>
  )
}
