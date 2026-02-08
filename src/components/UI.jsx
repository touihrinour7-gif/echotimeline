import { useEffect } from 'react'
import { useState } from 'react'
import { X } from 'lucide-react'

// Button Component
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) {
  const variants = {
    primary: 'bg-gold text-white hover:bg-gold/90 active:scale-95',
    secondary: 'border border-gold text-gold hover:bg-gold/10',
    ghost: 'text-ink hover:bg-gold/10',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4\" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

// Input Component
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-ink mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 bg-white dark:bg-white/5 
          border border-gold/20 rounded-lg 
          text-ink dark:text-ink-light 
          placeholder-ink-muted/50
          focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent
          transition-all
          ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

// Modal Component
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null
  
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  }
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal content */}
      <div 
        className={`
          relative bg-white dark:bg-sepia-dark 
          rounded-2xl shadow-2xl w-full 
          ${sizes[size]}
          max-h-[90vh] overflow-hidden
          animate-slide-up
        `}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gold/20">
            <h3 className="font-display text-xl font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gold/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Body */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  )
}

// Toast Component
export function Toast({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, 5000)
    return () => clearTimeout(timer)
  }, [toast.id, onClose])
  
  const types = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }
  
  return (
    <div 
      className={`
        ${types[toast.type] || types.info}
        text-white px-4 py-3 rounded-lg shadow-lg
        flex items-center gap-3 animate-slide-up
      `}
    >
      <span>{toast.message}</span>
      <button onClick={() => onClose(toast.id)} className="ml-auto">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Toast Container
export function ToastContainer({ toasts, onClose }) {
  if (!toasts.length) return null
  
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}

// PhotoCard Component
export function PhotoCard({ photo, onClick, selected, className = '' }) {
  return (
    <div 
      className={`
        aspect-square rounded-lg overflow-hidden cursor-pointer
        hover:scale-105 transition-transform duration-300
        ${selected ? 'ring-2 ring-gold ring-offset-2' : ''}
        ${className}
      `}
      onClick={() => onClick?.(photo)}
    >
      <img 
        src={photo.url} 
        alt="" 
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  )
}

// TimelineCard Component
export function TimelineCard({ timeline, onClick, className = '' }) {
  return (
    <div 
      className={`
        card overflow-hidden cursor-pointer card-hover
        ${className}
      `}
      onClick={() => onClick?.(timeline)}
    >
      {/* Cover image */}
      <div className="aspect-[4/3] bg-gold/20 relative overflow-hidden">
        {timeline.cover ? (
          <img 
            src={timeline.cover} 
            alt={timeline.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gold/40">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg truncate">{timeline.name}</h3>
        <div className="flex items-center gap-2 mt-1 text-sm text-ink-muted">
          <span>📷 {timeline.count || 0} photos</span>
          <span>•</span>
          <span>{timeline.updatedAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</span>
        </div>
      </div>
    </div>
  )
}

// Loading Spinner
export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }
  
  return (
    <svg 
      className={`animate-spin text-gold ${sizes[size]} ${className}`}
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4" 
        fill="none" 
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
      />
    </svg>
  )
}

// Skeleton Loader
export function Skeleton({ className = '', count = 1 }) {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div 
          key={i}
          className={`bg-gold/20 animate-pulse rounded ${className}`}
        />
      ))}
    </>
  )
}

// Empty State
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-12">
      {icon && <div className="text-4xl mb-4">{icon}</div>}
      <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-ink-muted mb-4">{description}</p>}
      {action}
    </div>
  )
}
