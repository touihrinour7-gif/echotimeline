import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'

export const TermsPage = () => {
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
            <FileText className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          
          <p className="text-gray-600 mb-8">Last updated: February 8, 2026</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using EchoTimeline ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                EchoTimeline provides a photo timeline management platform that allows users to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Create and organize photo timelines</li>
                <li>Upload and store photos securely</li>
                <li>Use AI-powered features for photo organization</li>
                <li>Access photos from multiple devices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed">
                To use certain features of the Service, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
                <li>Not share your account with others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Content</h2>
              <p className="text-gray-700 leading-relaxed">
                You retain all rights to the content you upload to the Service. By uploading content, you grant us a license to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Store and display your content as necessary to provide the Service</li>
                <li>Process your photos using AI features (face detection, auto-sorting)</li>
                <li>Create backups for service reliability</li>
              </ul>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
                <p className="text-yellow-900 font-medium">Important:</p>
                <p className="text-yellow-800 text-sm">You are solely responsible for the content you upload. Do not upload copyrighted material you don't own or have permission to use.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Prohibited Uses</h2>
              <p className="text-gray-700 leading-relaxed">You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Upload illegal, harmful, or offensive content</li>
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to hack or disrupt the Service</li>
                <li>Use automated tools to access the Service</li>
                <li>Impersonate others or provide false information</li>
                <li>Upload viruses or malicious code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Service Availability</h2>
              <p className="text-gray-700 leading-relaxed">
                We strive to maintain high availability, but we do not guarantee uninterrupted access. The Service may be unavailable due to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Scheduled maintenance</li>
                <li>Technical issues or emergencies</li>
                <li>Third-party service disruptions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Please review our <Link to="/privacy" className="text-purple-600 hover:text-purple-700 underline">Privacy Policy</Link> to understand how we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                The Service, including its design, features, and functionality, is owned by EchoTimeline and is protected by copyright, trademark, and other intellectual property laws. You may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Copy or reproduce the Service</li>
                <li>Modify or create derivative works</li>
                <li>Reverse engineer the Service</li>
                <li>Remove any copyright or proprietary notices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to terminate or suspend your account at any time for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Extended periods of inactivity</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                You may terminate your account at any time by deleting it through your account settings. Upon termination, your data will be permanently deleted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. We do not warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>The Service will be error-free or uninterrupted</li>
                <li>Defects will be corrected</li>
                <li>The Service is free of viruses or harmful components</li>
                <li>Results from using the Service will meet your requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, EchoTimeline SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify and hold harmless EchoTimeline from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with applicable international laws, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mt-4">
                <p className="text-gray-900 font-medium">Email: legal@echotimeline.app</p>
                <p className="text-gray-900 font-medium">Support: support@echotimeline.app</p>
                <p className="text-gray-700 text-sm mt-2">Response time: Within 48 hours</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                By using EchoTimeline, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
              
              <div className="flex items-center gap-4 text-sm">
                <Link to="/privacy" className="text-purple-600 hover:text-purple-700 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/cookies" className="text-purple-600 hover:text-purple-700 transition-colors">
                  Cookies
                </Link>
                <a href="mailto:support@echotimeline.app" className="text-purple-600 hover:text-purple-700 transition-colors">
                  Contact
                </a>
              </div>
            </div>
            
            <div className="mt-6">
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
    </div>
  )
}
