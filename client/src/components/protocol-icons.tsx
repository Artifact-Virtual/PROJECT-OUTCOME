// Protocol-specific SVG icons
export const MeshNetworkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
    <g stroke="currentColor" strokeWidth="1.5" fill="none">
      {/* Network nodes */}
      <circle cx="6" cy="6" r="2" fill="currentColor" opacity="0.6"/>
      <circle cx="18" cy="6" r="2" fill="currentColor" opacity="0.6"/>
      <circle cx="6" cy="18" r="2" fill="currentColor" opacity="0.6"/>
      <circle cx="18" cy="18" r="2" fill="currentColor" opacity="0.6"/>
      <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.8"/>
      
      {/* Connection lines */}
      <line x1="8" y1="6" x2="10" y2="10"/>
      <line x1="16" y1="6" x2="14" y2="10"/>
      <line x1="8" y1="18" x2="10" y2="14"/>
      <line x1="16" y1="18" x2="14" y2="14"/>
      <line x1="6" y1="8" x2="6" y2="16"/>
      <line x1="18" y1="8" x2="18" y2="16"/>
    </g>
  </svg>
);

export const SMSIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
    <g stroke="currentColor" strokeWidth="1.5" fill="none">
      {/* Phone body */}
      <rect x="6" y="2" width="12" height="20" rx="2" fill="currentColor" opacity="0.1"/>
      <rect x="6" y="2" width="12" height="20" rx="2"/>
      
      {/* Screen */}
      <rect x="8" y="5" width="8" height="10" fill="currentColor" opacity="0.2"/>
      
      {/* Signal waves */}
      <path d="M3 8c0-1 1-2 2-2" opacity="0.6"/>
      <path d="M2 12c0-2 2-4 4-4" opacity="0.4"/>
      <path d="M21 8c0-1-1-2-2-2" opacity="0.6"/>
      <path d="M22 12c0-2-2-4-4-4" opacity="0.4"/>
      
      {/* Message indicator */}
      <circle cx="12" cy="18" r="1" fill="currentColor"/>
    </g>
  </svg>
);

export const PhysicalHandshakeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
    <g stroke="currentColor" strokeWidth="1.5" fill="none">
      {/* USB device */}
      <rect x="4" y="10" width="6" height="4" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="4" y="10" width="6" height="4" rx="1"/>
      <rect x="10" y="11.5" width="2" height="1" fill="currentColor"/>
      
      {/* Arrow indicating transfer */}
      <path d="M14 12h4" markerEnd="url(#arrow)"/>
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="currentColor"/>
        </marker>
      </defs>
      
      {/* Destination device */}
      <rect x="18" y="8" width="2" height="8" fill="currentColor" opacity="0.3"/>
      <circle cx="19" cy="6" r="1" fill="currentColor"/>
    </g>
  </svg>
);

export const USBSneakernetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
    <g stroke="currentColor" strokeWidth="1.5" fill="none">
      {/* USB stick */}
      <rect x="8" y="9" width="8" height="6" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="8" y="9" width="8" height="6" rx="1"/>
      <rect x="6" y="11" width="2" height="2" fill="currentColor"/>
      
      {/* Data flow lines */}
      <path d="M4 4l4 4" opacity="0.6"/>
      <path d="M20 4l-4 4" opacity="0.6"/>
      <path d="M4 20l4-4" opacity="0.6"/>
      <path d="M20 20l-4-4" opacity="0.6"/>
      
      {/* Corner connection points */}
      <circle cx="4" cy="4" r="1" fill="currentColor" opacity="0.6"/>
      <circle cx="20" cy="4" r="1" fill="currentColor" opacity="0.6"/>
      <circle cx="4" cy="20" r="1" fill="currentColor" opacity="0.6"/>
      <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.6"/>
    </g>
  </svg>
);

export const HamRadioIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
    <g stroke="currentColor" strokeWidth="1.5" fill="none">
      {/* Radio body */}
      <rect x="4" y="12" width="16" height="8" rx="1" fill="currentColor" opacity="0.1"/>
      <rect x="4" y="12" width="16" height="8" rx="1"/>
      
      {/* Antenna */}
      <line x1="12" y1="12" x2="12" y2="4"/>
      <line x1="10" y1="6" x2="14" y2="6"/>
      <line x1="11" y1="8" x2="13" y2="8"/>
      
      {/* Signal waves */}
      <path d="M8 10c0-2 2-4 4-4s4 2 4 4" opacity="0.6"/>
      <path d="M6 8c0-3 3-6 6-6s6 3 6 6" opacity="0.4"/>
      <path d="M4 6c0-4 4-8 8-8s8 4 8 8" opacity="0.2"/>
      
      {/* Controls */}
      <circle cx="8" cy="16" r="1" fill="currentColor" opacity="0.6"/>
      <rect x="14" y="15" width="4" height="2" fill="currentColor" opacity="0.3"/>
    </g>
  </svg>
);

export const RadioBroadcastIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
    <g stroke="currentColor" strokeWidth="1.5" fill="none">
      {/* Broadcast tower */}
      <line x1="12" y1="4" x2="12" y2="20"/>
      <line x1="8" y1="8" x2="16" y2="8"/>
      <line x1="10" y1="12" x2="14" y2="12"/>
      <line x1="11" y1="16" x2="13" y2="16"/>
      
      {/* Radio waves expanding */}
      <path d="M6 12c0-3 3-6 6-6s6 3 6 6" opacity="0.7"/>
      <path d="M3 12c0-5 4-9 9-9s9 4 9 9" opacity="0.5"/>
      <path d="M1 12c0-6 5-11 11-11s11 5 11 11" opacity="0.3"/>
      
      {/* Ground plane */}
      <line x1="8" y1="20" x2="16" y2="20" strokeWidth="2"/>
    </g>
  </svg>
);

export const SatelliteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
    <g stroke="currentColor" strokeWidth="1.5" fill="none">
      {/* Satellite body */}
      <rect x="10" y="6" width="4" height="6" fill="currentColor" opacity="0.2"/>
      <rect x="10" y="6" width="4" height="6"/>
      
      {/* Solar panels */}
      <rect x="6" y="7" width="3" height="4" fill="currentColor" opacity="0.3"/>
      <rect x="15" y="7" width="3" height="4" fill="currentColor" opacity="0.3"/>
      
      {/* Antenna dish */}
      <ellipse cx="12" cy="4" rx="2" ry="1" fill="currentColor" opacity="0.4"/>
      
      {/* Communication beams */}
      <path d="M12 12l-8 8" opacity="0.6" strokeDasharray="2,2"/>
      <path d="M12 12l8 8" opacity="0.6" strokeDasharray="2,2"/>
      
      {/* Ground stations */}
      <circle cx="4" cy="20" r="1" fill="currentColor"/>
      <circle cx="20" cy="20" r="1" fill="currentColor"/>
      
      {/* Orbital path indicator */}
      <path d="M2 9c4-4 16-4 20 0" opacity="0.3" strokeDasharray="3,3"/>
    </g>
  </svg>
);

// Icon mapping for protocols
export const getProtocolIcon = (protocolId: string) => {
  switch (protocolId) {
    case "PRTCL1": return <MeshNetworkIcon />;
    case "PRTCL2": return <SMSIcon />;
    case "PRTCL3": return <PhysicalHandshakeIcon />;
    case "PRTCL4": return <USBSneakernetIcon />;
    case "PRTCL5": return <HamRadioIcon />;
    case "PRTCL6": return <RadioBroadcastIcon />;
    case "PRTCL7": return <SatelliteIcon />;
    default: return <MeshNetworkIcon />;
  }
};