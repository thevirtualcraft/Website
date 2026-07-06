'use client'

export type ServiceGraphicId =
  | 'webxr'
  | 'web3d'
  | 'spatial'
  | 'design'
  | 'ar'
  | 'performance'

function assertNever(value: never): never {
  throw new Error(`Unhandled ServiceGraphic id: ${String(value)}`)
}

const stroke = 'rgba(196, 181, 253, 0.9)'
const faint = 'rgba(139, 92, 246, 0.35)'

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 240 200"
      className="w-full h-full"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sg-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="sg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="100" r="72" fill="url(#sg-glow)" />
      {children}
    </svg>
  )
}

function WebXRGraphic() {
  return (
    <Frame>
      <g className="animate-float" style={{ transformOrigin: 'center' }}>
        <rect
          x="56"
          y="78"
          width="128"
          height="56"
          rx="20"
          fill="url(#sg-fill)"
          stroke={stroke}
          strokeWidth="2"
        />
        <circle cx="92" cy="106" r="15" fill="none" stroke={stroke} strokeWidth="2" />
        <circle cx="148" cy="106" r="15" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M107 106 h26" stroke={faint} strokeWidth="2" />
        <path d="M64 88 l-14 -18 M176 88 l14 -18" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      </g>
    </Frame>
  )
}

function Web3DGraphic() {
  return (
    <Frame>
      <rect x="52" y="52" width="136" height="96" rx="12" fill="url(#sg-fill)" stroke={stroke} strokeWidth="2" />
      <path d="M52 72 h136" stroke={faint} strokeWidth="2" />
      <circle cx="63" cy="62" r="3" fill={stroke} />
      <circle cx="74" cy="62" r="3" fill={faint} />
      <g className="animate-spin-slow" style={{ transformOrigin: '120px 110px' }}>
        <path
          d="M120 84 l28 16 v28 l-28 16 l-28 -16 v-28 z"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M120 84 v28 l28 16 M120 112 l-28 16" stroke={faint} strokeWidth="1.6" fill="none" />
      </g>
    </Frame>
  )
}

function SpatialGraphic() {
  return (
    <Frame>
      <rect x="86" y="66" width="68" height="68" rx="12" fill="url(#sg-fill)" stroke={stroke} strokeWidth="2" />
      <rect x="104" y="84" width="32" height="32" rx="5" fill="none" stroke={stroke} strokeWidth="2" />
      {[66, 100, 134].map((p) => (
        <g key={p}>
          <path d={`M${p} 66 v-14 M${p} 134 v14`} stroke={faint} strokeWidth="2" />
          <path d={`M86 ${p} h-14 M154 ${p} h14`} stroke={faint} strokeWidth="2" />
        </g>
      ))}
      <g className="animate-spin-slow" style={{ transformOrigin: '120px 100px' }}>
        <circle cx="120" cy="42" r="4" fill={stroke} />
        <circle cx="178" cy="140" r="4" fill={stroke} />
      </g>
    </Frame>
  )
}

function DesignGraphic() {
  return (
    <Frame>
      <g className="animate-float" style={{ transformOrigin: 'center' }}>
        <path d="M120 58 l46 26 -46 26 -46 -26 z" fill="url(#sg-fill)" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
        <path d="M120 92 l46 26 -46 26 -46 -26 z" fill="none" stroke={faint} strokeWidth="2" strokeLinejoin="round" />
        <path d="M120 122 l46 26 -46 26 -46 -26 z" fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      </g>
    </Frame>
  )
}

function ARGraphic() {
  return (
    <Frame>
      <rect x="88" y="52" width="64" height="112" rx="14" fill="url(#sg-fill)" stroke={stroke} strokeWidth="2" />
      <path d="M112 60 h16" stroke={faint} strokeWidth="3" strokeLinecap="round" />
      <g className="animate-float" style={{ transformOrigin: 'center' }}>
        <path d="M150 96 l26 15 v26 l-26 15 -26 -15 v-26 z" fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
        <path d="M150 96 v26 l26 15 M150 122 l-26 15" stroke={faint} strokeWidth="1.6" fill="none" />
      </g>
    </Frame>
  )
}

function PerformanceGraphic() {
  return (
    <Frame>
      <path d="M64 132 a56 56 0 0 1 112 0" fill="none" stroke={faint} strokeWidth="8" strokeLinecap="round" />
      <path
        d="M64 132 a56 56 0 0 1 112 0"
        fill="none"
        stroke={stroke}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="176"
        className="animate-dash"
      />
      <line x1="120" y1="132" x2="150" y2="98" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <circle cx="120" cy="132" r="7" fill="#c4b5fd" />
    </Frame>
  )
}

export function ServiceGraphic({ id }: { id: ServiceGraphicId }) {
  switch (id) {
    case 'webxr':
      return <WebXRGraphic />
    case 'web3d':
      return <Web3DGraphic />
    case 'spatial':
      return <SpatialGraphic />
    case 'design':
      return <DesignGraphic />
    case 'ar':
      return <ARGraphic />
    case 'performance':
      return <PerformanceGraphic />
    default:
      return assertNever(id)
  }
}
