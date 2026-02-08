import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, TimelineCard, Modal, Input, EmptyState } from '../components/UI'
import { db, signOut, onAuthChange } from '../lib/supabase'
import { useAuthStore, useUIStore } from '../store'
import { Search, Plus, Trash2 } from 'lucide-react'

export default function Dashboard() {
  const [timelines, setTimelines] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [createModal, setCreateModal] = useState(false)
  const [newTimelineName, setNewTimelineName] = useState('')
  const [creating, setCreating] = useState(false)
  
  const { user, setUser, logout } = useAuthStore()
  const { addToast } = useUIStore()
  const navigate = useNavigate()
  
  useEffect(() => {
    // Check auth state
    const unsubscribe = onAuthChange(async (authUser) => {
      if (authUser) {
        setUser({
          uid: authUser.id,
          email: authUser.email,
          displayName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
          photoURL: authUser.user_metadata?.avatar_url,
        })
      } else {
        navigate('/auth')
      }
    })
    return () => unsubscribe()
  }, [setUser, navigate])
  
  useEffect(() => {
    if (user) {
      loadTimelines()
    }
  }, [user])
  
  const loadTimelines = async () => {
    setLoading(true)
    try {
      const { data, error } = await db.getTimelines(user.uid)
      
      if (error) throw error
      
      const sortedData = (data || []).map(t => ({
        ...t,
        updatedAt: new Date(t.updated_at || t.created_at),
      }))
      setTimelines(sortedData)
    } catch (error) {
      console.error('Error loading timelines:', error)
      addToast({ type: 'error', message: 'Failed to load timelines' })
    }
    setLoading(false)
  }
  
  const createTimeline = async (e) => {
    e.preventDefault()
    if (!newTimelineName.trim()) return
    
    setCreating(true)
    try {
      const { data, error } = await db.createTimeline({
        name: newTimelineName.trim(),
        owner_id: user.uid,
        cover: null,
        count: 0,
      })
      
      if (error) throw error
      
      setTimelines([{
        id: data.id,
        name: newTimelineName.trim(),
        owner_id: user.uid,
        count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      }, ...timelines])
      
      setCreateModal(false)
      setNewTimelineName('')
      addToast({ type: 'success', message: 'Timeline created!' })
      
      // Navigate to builder
      navigate(`/builder/${data.id}`)
    } catch (error) {
      console.error('Error creating timeline:', error)
      addToast({ type: 'error', message: 'Failed to create timeline' })
    }
    setCreating(false)
  }
  
  const deleteTimeline = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this timeline?')) return
    
    try {
      await db.deleteTimeline(id)
      setTimelines(timelines.filter(t => t.id !== id))
      addToast({ type: 'success', message: 'Timeline deleted' })
    } catch (error) {
      console.error('Error deleting timeline:', error)
      addToast({ type: 'error', message: 'Failed to delete timeline' })
    }
  }
  
  const handleLogout = async () => {
    await signOut()
    logout()
    navigate('/')
  }
  
  const filteredTimelines = timelines.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">My Timelines</h1>
          <p className="text-ink-muted">
            {timelines.length} timeline{timelines.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          {/* Create button */}
          <Button onClick={() => setCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Timeline
          </Button>
        </div>
      </div>
      
      {/* Timelines Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="aspect-[4/3] bg-gold/20 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredTimelines.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTimelines.map(timeline => (
            <div key={timeline.id} className="relative group">
              <TimelineCard 
                timeline={timeline}
                onClick={() => navigate(`/builder/${timeline.id}`)}
              />
              {/* Delete button */}
              <button
                onClick={(e) => deleteTimeline(timeline.id, e)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete timeline"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📁"
          title={search ? 'No timelines found' : 'Create your first timeline'}
          description={search 
            ? 'Try a different search term.' 
            : 'Start by uploading your photos and organizing them into a timeline.'
          }
          action={
            <Button onClick={() => setCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Timeline
            </Button>
          }
        />
      )}
      
      {/* Create Modal */}
      <Modal
        open={createModal}
        onClose={() => setCreateModal(false)}
        title="Create New Timeline"
      >
        <form onSubmit={createTimeline} className="space-y-4">
          <Input
            label="Timeline Name"
            placeholder="e.g., Family Reunion 2023"
            value={newTimelineName}
            onChange={(e) => setNewTimelineName(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={creating}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
