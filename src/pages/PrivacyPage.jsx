import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'

export const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          
          <p className="text-gray-600 mb-8">Last updated: February 8, 2026</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed">
                EchoTimeline collects information to provide better services to our users. We collect information in the following ways:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Account Information:</strong> When you create an account, we collect your email address and name.</li>
                <li><strong>Photos and Content:</strong> We store the photos and timelines you create using our service.</li>
                <li><strong>Usage Data:</strong> We may collect information about how you use our service to improve functionality.</li>
                <li><strong>Device Information:</strong> We collect device-specific information such as browser type and operating system.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and store your photos securely</li>
                <li>Send you important updates about our service</li>
                <li>Respond to your requests and provide customer support</li>
                <li>Protect against fraud and abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Storage and Security</h2>
              <p className="text-gray-700 leading-relaxed">
                Your photos and data are stored securely using Supabase's infrastructure with industry-standard encryption. We implement appropriate security measures to protect your information from unauthorized access, alteration, or destruction.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                <p className="text-blue-900 font-medium">Demo Mode:</p>
                <p className="text-blue-800 text-sm">When using demo mode, all data is stored locally in your browser and is not sent to our servers.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or protect rights and safety</li>
                <li>With service providers who assist in operating our platform (under strict confidentiality agreements)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights and Choices</h2>
              <p className="text-gray-700 leading-relaxed">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Access, update, or delete your personal information</li>
                <li>Export your data at any time</li>
                <li>Delete your account and all associated data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar technologies to maintain your session and improve your experience. You can control cookies through your browser settings, but disabling them may affect functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we discover that we have collected information from a child under 13, we will delete it immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about this privacy policy or our data practices, please contact us at:
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mt-4">
                <p className="text-gray-900 font-medium">Email: privacy@echotimeline.app</p>
                <p className="text-gray-700 text-sm mt-2">We will respond to your inquiry within 48 hours.</p>
              </div>
            </section>

            <section className="border-t pt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">GDPR Compliance</h2>
              <p className="text-gray-700 leading-relaxed">
                For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR). You have additional rights including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Right to data portability</li>
                <li>Right to be forgotten</li>
                <li>Right to restrict processing</li>
                <li>Right to object to processing</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
