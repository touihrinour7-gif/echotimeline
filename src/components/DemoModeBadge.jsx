import { Database, CloudOff } from 'lucide-react'

export const DemoModeBadge = ({ isDemoMode, onToggle }) => {
  if (!isDemoMode) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg px-4 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <CloudOff className="w-5 h-5 text-yellow-700" />
          <div>
            <p className="text-sm font-semibold text-yellow-900">Demo Mode</p>
            <p className="text-xs text-yellow-700">Data stored locally</p>
          </div>
          <button
            onClick={onToggle}
            className="ml-2 text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
          >
            Switch to Real
          </button>
        </div>
      </div>
    </div>
  )
}

export const ModeToggle = ({ isDemoMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-gray-200 hover:border-purple-400 transition-colors"
    >
      {isDemoMode ? (
        <>
          <CloudOff className="w-5 h-5 text-yellow-600" />
          <span className="text-sm font-medium">Demo Mode</span>
        </>
      ) : (
        <>
          <Database className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium">Real Mode</span>
        </>
      )}
    </button>
  )
}
