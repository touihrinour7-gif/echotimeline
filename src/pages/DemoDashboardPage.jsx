import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDemoMode } from '../lib/demoStorage'
import { DemoModeBadge } from '../components/DemoModeBadge'
import { Camera, Plus, Trash2, LogOut, Search } from 'lucide-react'
import toast from 'react-hot-toast'

export function DemoDashboardPage() {
  const { 
    isDemoMode, 
    timelines, 
    createTimeline, 
    deleteTimeline, 
    toggleDemoMode,
    clearAllData 
  } = useDemoMode()
  
  const [newTimelineName, setNewTimelineName] = useState('')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleCreateTimeline = async (e) => {
    e.preventDefault()
    if (!newTimelineName.trim()) return
    
    setLoading(true)
    try {
      const timeline = await createTimeline(newTimelineName.trim())
      setNewTimelineName('')
      toast.success('Timeline created!')
      navigate(`/timeline/${timeline.id}`)
    } catch (error) {
      toast.error('Failed to create timeline')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTimeline = (id, e) => {
    e.stopPropagation()
    if (confirm('Delete this timeline?')) {
      deleteTimeline(id)
      toast.success('Timeline deleted')
    }
  }

  const filteredTimelines = timelines.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <DemoModeBadge />
      
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">EchoTimeline</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              🎮 Demo Mode
            </span>
            <button
              onClick={() => {
                if (confirm('Exit demo mode?')) {
                  toggleDemoMode()
                  navigate('/')
                }
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">My Timelines</h1>
          <p className="text-muted-foreground">
            {timelines.length} timeline{timelines.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Create Timeline */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="font-bold text-lg mb-4">Create New Timeline</h2>
          <form onSubmit={handleCreateTimeline} className="flex gap-3">
            <input
              type="text"
              value={newTimelineName}
              onChange={(e) => setNewTimelineName(e.target.value)}
              placeholder="e.g., Family Reunion 2023"
              className="flex-1 px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading || !newTimelineName.trim()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create
            </button>
          </form>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search timelines..."
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Timelines Grid */}
        {timelines.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTimelines.map(timeline => (
              <div
                key={timeline.id}
                onClick={() => navigate(`/timeline/${timeline.id}`)}
                className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                {/* Cover */}
                <div className="aspect-[4/3] bg-secondary relative">
                  {timeline.cover ? (
                    <img 
                      src={timeline.cover} 
                      alt={timeline.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeleteTimeline(timeline.id, e)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold truncate">{timeline.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {timeline.photos?.length || 0} photos
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDate(timeline.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-bold text-xl mb-2">No timelines yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first timeline to get started!
            </p>
            <form onSubmit={handleCreateTimeline} className="max-w-md mx-auto flex gap-3">
              <input
                type="text"
                value={newTimelineName}
                onChange={(e) => setNewTimelineName(e.target.value)}
                placeholder="Enter timeline name..."
                className="flex-1 px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={loading || !newTimelineName.trim()}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
              >
                Create
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
