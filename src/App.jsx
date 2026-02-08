import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { TimelinePage } from './pages/TimelinePage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
import { LoadingPage } from './components/LoadingSpinner'
import { DemoModeProvider } from './lib/demoStorage'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingPage text="Loading..." />
  }

  return children
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <DemoModeProvider>
          <AuthProvider>
            <Router>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#fff',
                    color: '#363636',
                  }
                }}
              />
              
              <Routes>
                {/* Public Routes - Landing First */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                
                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/timeline/:id"
                  element={
                    <ProtectedRoute>
                      <TimelinePage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </AuthProvider>
        </DemoModeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  )
}

export default App
