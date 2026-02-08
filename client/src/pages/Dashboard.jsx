import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useThemeStore, useAuthStore } from '../store'
import { 
  Plus, 
  Search, 
  Clock, 
  MapPin, 
  Users, 
  MoreVertical,
  Trash2,
  Edit,
  Share2,
  Sun,
  Moon,
  LogOut,
  Image
} from 'lucide-react'

// Mock data for demo
const mockTimelines = [
  {
    id: '1',
    title: 'Family Reunion 2023',
    coverPhoto: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400',
    photoCount: 247,
    dateRange: 'June 2023',
    collaborators: 4,
    lastEdited: '2 days ago'
  },
  {
    id: '2',
    title: 'Kids Growing Up',
    coverPhoto: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
    photoCount: 512,
    dateRange: '2018-2023',
    collaborators: 2,
    lastEdited: '1 week ago'
  },
  {
    id: '3',
    title: 'Travel Adventures',
    coverPhoto: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
    photoCount: 189,
    dateRange: '2020-2023',
    collaborators: 1,
    lastEdited: '3 weeks ago'
  }
]

export default function Dashboard() {
  const { theme, toggleTheme } = useThemeStore()
  const { user, logout } = useAuthStore()
  const [timelines, setTimelines] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    // Load mock timelines
    setTimelines(mockTimelines)
  }, [])

  const filteredTimelines = timelines.filter(timeline =>
    timeline.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateTimeline = () => {
    // TODO: Create new timeline
    console.log('Create timeline')
  }

  return (
    <div className="min-h-screen bg-sepia-50 dark:bg-midnight-100 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sepia-500 to-sepia-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">E</span>
              </div>
              <span className="text-xl font-display font-bold text-sepia-800 dark:text-sepia-100">
                EchoTimeline
              </span>
            </Link>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sepia-400" />
                <input
                  type="text"
                  placeholder="Search timelines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-sepia-600 dark:text-sepia-300 hover:bg-sepia-200 dark:hover:bg-midnight-200 transition-colors"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-sepia-200 dark:hover:bg-midnight-200 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-sepia-400 to-sepia-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.displayName?.[0] || 'U'}
                    </span>
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-midnight-100 rounded-xl shadow-lg border border-sepia-200 dark:border-midnight-200 py-2">
                    <div className="px-4 py-2 border-b border-sepia-200 dark:border-midnight-200">
                      <p className="font-medium text-sepia-800 dark:text-sepia-100">
                        {user?.displayName || 'Demo User'}
                      </p>
                      <p className="text-sm text-sepia-500 dark:text-sepia-400">
                        {user?.email || 'demo@echotimeline.app'}
                      </p>
                    </div>
                    <button className="w-full flex items-center space-x-2 px-4 py-2 text-left text-sepia-700 dark:text-sepia-200 hover:bg-sepia-100 dark:hover:bg-midnight-200">
                      <Edit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-sepia-900 dark:text-sepia-50">
              My Timelines
            </h1>
            <p className="text-sepia-600 dark:text-sepia-400 mt-1">
              {timelines.length} timeline{timelines.length !== 1 ? 's' : ''} • {filteredTimelines.length} shown
            </p>
          </div>

          <button
            onClick={handleCreateTimeline}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Timeline
          </button>
        </div>

        {/* Timelines Grid */}
        {filteredTimelines.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTimelines.map((timeline) => (
              <Link
                key={timeline.id}
                to={`/builder/${timeline.id}`}
                className="group"
              >
                <div className="card overflow-hidden card-hover">
                  {/* Cover Photo */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={timeline.coverPhoto}
                      alt={timeline.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-sepia-800 dark:text-sepia-100 group-hover:text-sepia-600 dark:group-hover:text-midnight-gold transition-colors">
                          {timeline.title}
                        </h3>
                        <p className="text-sm text-sepia-500 dark:text-sepia-400 mt-1">
                          {timeline.dateRange}
                        </p>
                      </div>
                      
                      <button 
                        onClick={(e) => e.preventDefault()}
                        className="p-1 rounded hover:bg-sepia-100 dark:hover:bg-midnight-200"
                      >
                        <MoreVertical className="w-5 h-5 text-sepia-400" />
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 mt-4 text-sm text-sepia-500 dark:text-sepia-400">
                      <div className="flex items-center space-x-1">
                        <Image className="w-4 h-4" />
                        <span>{timeline.photoCount}</span>
                      </div>
                      {timeline.collaborators > 1 && (
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{timeline.collaborators}</span>
                        </div>
                      )}
                      <span className="ml-auto">{timeline.lastEdited}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-sepia-100 dark:bg-midnight-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Image className="w-10 h-10 text-sepia-400" />
            </div>
            <h2 className="text-2xl font-bold text-sepia-800 dark:text-sepia-100 mb-2">
              {searchQuery ? 'No timelines found' : 'Create your first timeline'}
            </h2>
            <p className="text-sepia-600 dark:text-sepia-400 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? 'Try a different search term.'
                : 'Start by uploading your photos and watch them come alive as a timeline.'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateTimeline}
                className="btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Timeline
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
