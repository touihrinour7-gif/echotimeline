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
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="50%" stopColor="#8b5cf6"/>
          <stop offset="100%" stopColor="#ec4899"/>
        </linearGradient>
      </defs>

      {/* Background */}
      <rect
        x="0"
        y="0"
        width={s}
        height={s}
        rx={s * 0.25}
        fill="url(#logoGrad)"
      />

      {/* Timeline E shape */}
      <g stroke="white" strokeWidth={s * 0.06} strokeLinecap="round">
        {/* Vertical bar */}
        <line x1={s * 0.28} y1={s * 0.3} x2={s * 0.28} y2={s * 0.7} />
        {/* Top bar */}
        <line x1={s * 0.28} y1={s * 0.3} x2={s * 0.5} y2={s * 0.3} />
        {/* Middle bar */}
        <line x1={s * 0.28} y1={s * 0.5} x2={s * 0.42} y2={s * 0.5} />
        {/* Bottom bar extending right */}
        <line x1={s * 0.28} y1={s * 0.7} x2={s * 0.55} y2={s * 0.62} />
      </g>

      {/* Timeline dots */}
      <circle cx={s * 0.28} cy={s * 0.3} r={s * 0.05} fill="white" />
      <circle cx={s * 0.28} cy={s * 0.5} r={s * 0.04} fill="white" opacity="0.8" />
      <circle cx={s * 0.28} cy={s * 0.7} r={s * 0.05} fill="white" />
      <circle cx={s * 0.55} cy={s * 0.62} r={s * 0.04} fill="white" />

      {/* Sound wave emanation */}
      <path
        d={`M ${s * 0.65} ${s * 0.62} Q ${s * 0.78} ${s * 0.55}, ${s * 0.85} ${s * 0.5}`}
        stroke="white"
        strokeWidth={s * 0.025}
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}