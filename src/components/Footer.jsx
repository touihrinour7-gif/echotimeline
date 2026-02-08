import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-sepia-dark text-ink-light py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Logo size="md" />
              <span className="font-display font-bold text-xl">EchoTimeline</span>
            </Link>
            <p className="text-ink-muted max-w-md">
              Turn dusty albums into living timelines. Free, private, forever. 
              Preserve your family's memories for generations.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-ink-muted">
              <li><Link to="/#features" className="hover:text-ink-light transition-colors">Features</Link></li>
              <li><Link to="/#pricing" className="hover:text-ink-light transition-colors">Pricing</Link></li>
              <li><Link to="/dashboard" className="hover:text-ink-light transition-colors">Get Started</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-ink-muted">
              <li><Link to="/privacy" className="hover:text-ink-light transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-ink-light transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-ink-light transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-ink-muted/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-muted">
            © {currentYear} EchoTimeline. All rights reserved.
          </p>
          <p className="text-sm text-ink-muted">
            Made with ❤️ for families everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}
