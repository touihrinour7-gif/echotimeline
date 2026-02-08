export default function Logo({ size = 'md', className = '' }) {
  const sizes = {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
  }
  
  const s = sizes[size] || 32
  
  return (
    <svg 
      width={s} 
      height={s} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="EchoTimeline Logo"
    >
      {/* Background circle */}
      <rect 
        x="4" 
        y="4" 
        width="56" 
        height="56" 
        rx="12" 
        fill="currentColor"
        className="text-gold"
      />
      
      {/* Film reel E */}
      <g fill="#F5EDE3">
        {/* Left vertical bar of E */}
        <rect x="14" y="16" width="8" height="32" rx="2" />
        
        {/* Top horizontal bar */}
        <rect x="14" y="16" width="28" height="8" rx="2" />
        
        {/* Middle horizontal bar */}
        <rect x="14" y="28" width="22" height="6" rx="1" />
        
        {/* Bottom horizontal bar */}
        <rect x="14" y="40" width="28" height="8" rx="2" />
      </g>
      
      {/* Film reel holes */}
      <circle cx="28" cy="12" r="3" fill="#F5EDE3" opacity="0.8"/>
      <circle cx="28" cy="52" r="3" fill="#F5EDE3" opacity="0.8"/>
    </svg>
  )
}
