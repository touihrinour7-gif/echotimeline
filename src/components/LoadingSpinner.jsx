import { Loader2 } from 'lucide-react'

export const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizes[size]} animate-spin text-purple-600`} />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  )
}

export const LoadingPage = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <LoadingSpinner size="xl" text={text} />
    </div>
  )
}

export const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-200',
    card: 'bg-white/50',
    text: 'bg-gray-300 h-4 rounded'
  }

  return (
    <div className={`animate-pulse ${variants[variant]} ${className}`} />
  )
}
