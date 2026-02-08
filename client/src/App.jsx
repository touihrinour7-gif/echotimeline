import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Builder from './pages/Builder'
import Viewer from './pages/Viewer'
import NotFound from './pages/NotFound'

// Hooks
import { useThemeStore } from './store'

function App() {
  const { theme, initialize } = useThemeStore()

  useEffect(() => {
    // Initialize theme from localStorage
    initialize()
  }, [initialize])

  useEffect(() => {
    // Apply theme class to document
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])

  return (
    <BrowserRouter>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder/:timelineId" element={<Builder />} />
          <Route path="/viewer/:timelineId" element={<Viewer />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: theme === 'dark' ? '#1A1A1A' : '#F5EDE3',
              color: theme === 'dark' ? '#F5EDE3' : '#2D1E12',
            },
          }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App
