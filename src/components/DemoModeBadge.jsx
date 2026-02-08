import { useDemoMode } from '../lib/demoStorage'

export function ModeToggle({ isDemoMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex items-center gap-3 px-4 py-2 rounded-full transition-all ${
        isDemoMode 
          ? 'bg-yellow-100 border-2 border-yellow-400' 
          : 'bg-green-100 border-2 border-green-400'
      }`}
    >
      <span className={`text-sm font-medium ${isDemoMode ? 'text-yellow-800' : 'text-green-800'}`}>
        {isDemoMode ? '🎮 Demo Mode' : '☁️ Real Mode'}
      </span>
    </button>
  )
}

export function DemoModeBadge() {
  const { isDemoMode } = useDemoMode()
  
  if (!isDemoMode) return null
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-medium text-sm shadow-lg">
      🎮 Demo Mode Active
    </div>
  )
}
