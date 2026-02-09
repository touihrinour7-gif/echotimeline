import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="md" />
            <span className="font-display font-bold text-xl">EchoTimeline</span>
          </Link>
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl font-bold mb-6">
          Cookie Policy
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: February 2024
        </p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="font-bold text-xl mb-4">What Are Cookies</h2>
            <p className="mb-4">
              Cookies are small text files stored on your device when you visit our website. 
              They help us provide you with a better experience and understand how you use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold text-xl mb-4">How We Use Cookies</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly (authentication, security)</li>
              <li><strong>Preference Cookies:</strong> Remember your settings (theme, language preferences)</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-bold text-xl mb-4">Types of Cookies We Use</h2>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">1. Essential Cookies</h3>
              <p className="mb-2">
                These cookies are necessary for the website to function. They enable core functionality 
                such as page navigation, secure areas, and demo mode functionality.
              </p>
              <p className="text-sm text-muted-foreground">
                These cookies cannot be disabled as they are required for the website to work.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">2. Demo Mode Cookies</h3>
              <p className="mb-2">
                When you use Demo Mode, we store your data locally in your browser. 
                This allows you to try EchoTimeline without creating an account.
              </p>
              <p className="text-sm text-muted-foreground">
                Data stored: timelines, photos (as base64), preferences
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">3. Analytics Cookies</h3>
              <p className="mb-2">
                We may use analytics tools to understand how users interact with our website. 
                This helps us improve our services.
              </p>
              <p className="text-sm text-muted-foreground">
                Note: We don't track you across websites, and we don't sell your data.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-bold text-xl mb-4">Managing Cookies</h2>
            <p className="mb-4">
              You can control and delete cookies through your browser settings. 
              Here's how to do it in popular browsers:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
              <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Note: Disabling essential cookies may prevent certain features from working.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold text-xl mb-4">Demo Mode Data</h2>
            <p className="mb-4">
              When using Demo Mode, all your data is stored locally on your device using browser storage. 
              This data is never sent to our servers. To clear demo data:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Open browser Developer Tools (F12)</li>
              <li>Go to Application tab → Local Storage</li>
              <li>Right-click and clear all local storage</li>
              <li>Refresh the page</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="font-bold text-xl mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have questions about our cookie practices, please contact us:
            </p>
            <p>
              <strong>Email:</strong> support@echotimeline.app
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          © 2024 EchoTimeline. All rights reserved.
          <div className="mt-2 flex items-center justify-center gap-4">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
