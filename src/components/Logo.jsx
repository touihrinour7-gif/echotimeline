export default function Logo({ size = 'md', className = '' }) {
  const sizes = {
    sm: 24,
    md: 40,
    lg: 64,
    xl: 96,
  }

  const s = sizes[size] || 40

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="EchoTimeline Logo"
    >
      <defs>
        {/* Main gradient */}
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7"/>
          <stop offset="50%" stopColor="#ec4899"/>
          <stop offset="100%" stopColor="#f97316"/>
        </linearGradient>
        
        {/* Glow effect */}
        <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0"/>
        </linearGradient>
        
        {/* Shadow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={s * 0.08} result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Glow background */}
      <rect
        x="0"
        y="0"
        width={s}
        height={s}
        rx={s * 0.3}
        fill="url(#glowGrad)"
        filter="url(#glow)"
      />

      {/* Main card/frame */}
      <rect
        x={s * 0.1}
        y={s * 0.15}
        width={s * 0.8}
        height={s * 0.7}
        rx={s * 0.15}
        fill="url(#logoGrad)"
        filter="url(#glow)"
      />

      {/* Inner timeline representation */}
      {/* Vertical timeline line */}
      <line
        x1={s * 0.35}
        y1={s * 0.25}
        x2={s * 0.35}
        y2={s * 0.75}
        stroke="white"
        strokeWidth={s * 0.04}
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Timeline nodes - representing memories */}
      {/* Top node - start */}
      <circle cx={s * 0.35} cy={s * 0.3} r={s * 0.06} fill="white"/>
      
      {/* Middle node - growth */}
      <circle cx={s * 0.35} cy={s * 0.5} r={s * 0.05} fill="white" opacity="0.8"/>
      
      {/* Bottom node - present */}
      <circle cx={s * 0.35} cy={s * 0.7} r={s * 0.07} fill="white"/>

      {/* Photo/Memory frames branching off */}
      {/* Top left photo */}
      <rect
        x={s * 0.48}
        y={s * 0.22}
        width={s * 0.18}
        height={s * 0.16}
        rx={s * 0.03}
        stroke="white"
        strokeWidth={s * 0.025}
        fill="none"
        opacity="0.9"
      />
      
      {/* Middle photo */}
      <rect
        x={s * 0.55}
        y={s * 0.42}
        width={s * 0.2}
        height={s * 0.16}
        rx={s * 0.03}
        stroke="white"
        strokeWidth={s * 0.025}
        fill="none"
        opacity="0.85"
      />
      
      {/* Bottom right photo */}
      <rect
        x={s * 0.48}
        y={s * 0.6}
        width={s * 0.22}
        height={s * 0.18}
        rx={s * 0.04}
        stroke="white"
        strokeWidth={s * 0.025}
        fill="none"
        opacity="0.9"
      />

      {/* Connection lines to photos */}
      <line
        x1={s * 0.41}
        y1={s * 0.3}
        x2={s * 0.48}
        y2={s * 0.3}
        stroke="white"
        strokeWidth={s * 0.02}
        opacity="0.5"
      />
      <line
        x1={s * 0.4}
        y1={s * 0.5}
        x2={s * 0.55}
        y2={s * 0.5}
        stroke="white"
        strokeWidth={s * 0.02}
        opacity="0.5"
      />
      <line
        x1={s * 0.42}
        y1={s * 0.7}
        x2={s * 0.48}
        y2={s * 0.69}
        stroke="white"
        strokeWidth={s * 0.02}
        opacity="0.5"
      />

      {/* Sparkle effects */}
      <path
        d={`M ${s * 0.78} ${s * 0.2} L ${s * 0.82} ${s * 0.18} L ${s * 0.8} ${s * 0.26} L ${s * 0.84} ${s * 0.28} L ${s * 0.8} ${s * 0.32} L ${s * 0.78} ${s * 0.36} L ${s * 0.74} ${s * 0.32} L ${s * 0.78} ${s * 0.26} Z`}
        fill="white"
        opacity="0.8"
      />
      <path
        d={`M ${s * 0.12} ${s * 0.78} L ${s * 0.14} ${s * 0.76} L ${s * 0.13} ${s * 0.82} L ${s * 0.16} ${s * 0.83} L ${s * 0.14} ${s * 0.86} L ${s * 0.11} ${s * 0.83} L ${s * 0.12} ${s * 0.8} Z`}
        fill="white"
        opacity="0.6"
      />
    </svg>
  )
}
