import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { dbHelpers } from '../lib/supabase'
import { demoStorage } from '../lib/demoStorage'
import { Plus, Calendar, Image, LogOut, Trash2 } from 'lucide-react'
import { LoadingPage } from '../components/LoadingSpinner'
import { DemoModeBadge } from '../components/DemoModeBadge'
import toast from 'react-hot-toast'

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
        // Load from localStorage
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

  const handleCreateTimeline = async (e) => {
    e.preventDefault()
    if (!newTimelineTitle.trim()) return

    setCreating(true)
    try {
      if (isDemoMode) {
        const timeline = demoStorage.createTimeline({
          title: newTimelineTitle,
          description: newTimelineDescription,
          user_id: user.id
        })
        setTimelines(prev => [timeline, ...prev])
        toast.success('Timeline created!')
      } else {
        const { data, error } = await dbHelpers.createTimeline(user.id, {
          title: newTimelineTitle,
          description: newTimelineDescription
        })

        if (error) {
          toast.error(error)
        } else {
          setTimelines(prev => [data, ...prev])
          toast.success('Timeline created!')
        }
      }

      setShowCreateModal(false)
      setNewTimelineTitle('')
      setNewTimelineDescription('')
    } catch (error) {
      console.error('Failed to create timeline:', error)
      toast.error('Failed to create timeline')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteTimeline = async (id) => {
    if (!confirm('Are you sure you want to delete this timeline? This will also delete all photos in it.')) return

    try {
      if (isDemoMode) {
        demoStorage.deleteTimeline(id)
        setTimelines(prev => prev.filter(t => t.id !== id))
        toast.success('Timeline deleted')
      } else {
        const { error } = await dbHelpers.deleteTimeline(id)
        if (error) {
          toast.error(error)
        } else {
          setTimelines(prev => prev.filter(t => t.id !== id))
          toast.success('Timeline deleted')
        }
      }
    } catch (error) {
      console.error('Failed to delete timeline:', error)
      toast.error('Failed to delete timeline')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleDemoToggle = () => {
    toggleDemoMode()
    // Navigate to appropriate page based on new mode
    if (!isDemoMode) {
      // Switching to demo mode
      navigate('/dashboard')
    }
  }

  if (loading) {
    return <LoadingPage text="Loading your timelines..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <DemoModeBadge isDemoMode={isDemoMode} onToggle={handleDemoToggle} />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Timelines</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {user?.user_metadata?.full_name || user?.email || 'Demo User'}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Timeline Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="mb-8 flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create New Timeline
        </button>

        {/* Timelines Grid */}
        {timelines.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No timelines yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first timeline to start organizing your memories
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Your First Timeline
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timelines.map((timeline) => (
              <div
                key={timeline.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/timeline/${timeline.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Calendar className="w-8 h-8 text-purple-600" />
                    <span className="text-sm text-gray-500">
                      {new Date(timeline.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {timeline.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {timeline.description || 'No description'}
                  </p>
                </div>

                <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Image className="w-4 h-4" />
                    <span>
                      {isDemoMode
                        ? demoStorage.getPhotos(timeline.id).length
                        : timeline.photo_count || 0} photos
                      </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteTimeline(timeline.id)
                    }}
                    className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Timeline Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Create New Timeline
            </h2>
            <form onSubmit={handleCreateTimeline} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTimelineTitle}
                  onChange={(e) => setNewTimelineTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="My Timeline"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTimelineDescription}
                  onChange={(e) => setNewTimelineDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="A brief description..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewTimelineTitle('')
                    setNewTimelineDescription('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newTimelineTitle.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
