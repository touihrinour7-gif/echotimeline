import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { dbHelpers } from '../lib/supabase'
import { demoStorage } from '../lib/demoStorage'
import { Plus, Calendar, Image, LogOut, Trash2, Sparkles, ArrowRight, Clock } from 'lucide-react'
import { LoadingPage } from '../components/LoadingSpinner'
import { DemoModeBadge } from '../components/DemoModeBadge'
import Logo from '../components/Logo'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export const DashboardPage = () => {
  const [timelines, setTimelines] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTimelineTitle, setNewTimelineTitle] = useState('')
  const [newTimelineDescription, setNewTimelineDescription] = useState('')
  const [creating, setCreating] = useState(false)

  const { user, signOut, isDemoMode, toggleDemoMode } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    loadTimelines()
  }, [user, isDemoMode])

  const loadTimelines = async () => {
    setLoading(true)
    try {
      if (isDemoMode) {
        const data = demoStorage.getTimelines()
        setTimelines(data)
      } else {
        const { data, error } = await dbHelpers.getTimelines(user.id)
        if (error) {
          toast.error(error)
        } else {
          setTimelines(data || [])
        }
      }
    } catch (error) {
      console.error('Failed to load timelines:', error)
      toast.error('Failed to load timelines')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTimeline = async () => {
    if (!newTimelineTitle.trim()) {
      toast.error('Please enter a timeline title')
      return
    }

    setCreating(true)
    try {
      const timelineData = {
        title: newTimelineTitle.trim(),
        description: newTimelineDescription.trim(),
      }

      let newTimeline
      if (isDemoMode) {
        newTimeline = demoStorage.createTimeline({
          ...timelineData,
          user_id: 'demo-user',
        })
      } else {
        const { data, error } = await dbHelpers.createTimeline(user.id, timelineData)
        if (error) {
          toast.error(error)
          setCreating(false)
          return
        }
        newTimeline = data
      }

      toast.success('Timeline created!')
      setShowCreateModal(false)
      setNewTimelineTitle('')
      setNewTimelineDescription('')
      loadTimelines()
      navigate(`/timeline/${newTimeline.id}`)
    } catch (error) {
      console.error('Failed to create timeline:', error)
      toast.error('Failed to create timeline')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteTimeline = async (id) => {
    if (!confirm('Are you sure you want to delete this timeline? This cannot be undone.')) {
      return
    }

    try {
      if (isDemoMode) {
        demoStorage.deleteTimeline(id)
        toast.success('Timeline deleted')
      } else {
        const { error } = await dbHelpers.deleteTimeline(id)
        if (error) {
          toast.error(error)
          return
        }
        toast.success('Timeline deleted')
      }
      loadTimelines()
    } catch (error) {
      console.error('Failed to delete timeline:', error)
      toast.error('Failed to delete timeline')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return <LoadingPage text="Loading your memories..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Logo size="lg" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                EchoTimeline
              </span>
              <DemoModeBadge />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                {user?.user_metadata?.full_name || user?.email || 'Demo User'}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Your Memories,{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Beautifully Organized
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create stunning photo timelines, discover faces, and relive your best moments with AI-powered organization.
          </p>
        </motion.div>

        {/* Create Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-6 h-6" />
            <span>Create New Timeline</span>
            <Sparkles className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </motion.div>

        {/* Timelines Grid */}
        <AnimatePresence mode="wait">
          {timelines.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-3xl flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-purple-500" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Start Your First Timeline
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Upload your photos and let AI organize them by date, faces, and moments.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all border-2 border-purple-200 dark:border-purple-700"
              >
                Get Started →
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {timelines.map((timeline, index) => (
                <motion.div
                  key={timeline.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => navigate(`/timeline/${timeline.id}`)}
                  className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
                >
                  {/* Gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        whileHover={{ rotate: 15 }}
                        className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
                      >
                        <Calendar className="w-6 h-6 text-white" />
                      </motion.div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(timeline.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {timeline.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                      {timeline.description || 'No description'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Image className="w-4 h-4" />
                        <span>
                          {isDemoMode
                            ? demoStorage.getPhotos(timeline.id).length
                            : timeline.photo_count || 0} photos
                        </span>
                      </div>
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-1 text-purple-600 dark:text-purple-400 text-sm font-medium"
                      >
                        Open <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Create Timeline Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Create New Timeline
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timeline Title *
                  </label>
                  <input
                    type="text"
                    value={newTimelineTitle}
                    onChange={(e) => setNewTimelineTitle(e.target.value)}
                    placeholder="e.g., Summer Vacation 2024"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newTimelineDescription}
                    onChange={(e) => setNewTimelineDescription(e.target.value)}
                    placeholder="What's this timeline about?"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateTimeline}
                  disabled={creating}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Timeline'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DashboardPage
