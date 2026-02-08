import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { DemoModeProvider, useDemoMode } from './lib/demoStorage'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { TimelinePage } from './pages/TimelinePage'
import { LoadingPage } from './components/LoadingSpinner'
import { LandingPage } from './pages/LandingPage'
import { DemoDashboardPage } from './pages/DemoDashboardPage'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingPage />
  }

  return children
}

const AppRoutes = () => {
  const { isDemoMode } = useDemoMode()

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {isDemoMode ? <DemoDashboardPage /> : <DashboardPage />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/timeline/:id"
        element={
          <ProtectedRoute>
            {isDemoMode ? <TimelinePage /> : <TimelinePage />}
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <DemoModeProvider>
        <Router>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#363636',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <AppRoutes />
          </AuthProvider>
        </Router>
      </DemoModeProvider>
    </ErrorBoundary>
  )
}

export default App
