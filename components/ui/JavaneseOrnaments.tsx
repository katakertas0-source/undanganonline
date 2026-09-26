import React from 'react';

interface OrnamentProps {
  className?: string;
  color?: string;
  secondaryColor?: string;
  opacity?: number;
}

/**
 * Authentic Javanese Gunungan (Kayon) Silhouette
 * Inspired by classic Wayang Purwa Kayon:
 * Sacred Tree of Life (Pohon Hayat), mystical crown peak, and symmetrical royal foliage silhouette.
 */
export function JavaneseGununganSilhouette({
  className = 'w-24 h-36',
  color = '#B3945A',
  secondaryColor = '#806947',
  opacity = 1,
}: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 160 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="gununganGoldGrad" x1="80" y1="10" x2="80" y2="230" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="60%" stopColor={secondaryColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor="#211A16" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Main Gunungan Outer Silhouette Path */}
      <path
        d="M80 8 
           C82 18, 86 28, 92 36
           C98 44, 108 50, 114 60
           C122 72, 126 84, 132 98
           C138 112, 142 126, 140 142
           C138 158, 128 172, 122 186
           C118 196, 112 204, 104 212
           C96 220, 88 224, 80 228
           C72 224, 64 220, 56 212
           C48 204, 42 196, 38 186
           C32 172, 22 158, 20 142
           C18 126, 22 112, 28 98
           C34 84, 38 72, 46 60
           C52 50, 62 44, 68 36
           C74 28, 78 18, 80 8 Z"
        fill="url(#gununganGoldGrad)"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Tree of Life (Pohon Hayat) & Mystical Veins */}
      {/* Central Trunk / Stem */}
      <path
        d="M80 220 V38"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />

      {/* Branch Layer 1 (Lower Crown) */}
      <path
        d="M80 180 C95 174, 115 168, 124 152"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.6"
      />
      <path
        d="M80 180 C65 174, 45 168, 36 152"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.6"
      />

      {/* Branch Layer 2 (Middle Arch) */}
      <path
        d="M80 145 C98 138, 120 128, 126 106"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.65"
      />
      <path
        d="M80 145 C62 138, 40 128, 34 106"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.65"
      />

      {/* Branch Layer 3 (Upper Canopy) */}
      <path
        d="M80 110 C96 100, 110 88, 112 68"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.7"
      />
      <path
        d="M80 110 C64 100, 50 88, 48 68"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.7"
      />

      {/* Branch Layer 4 (Spire Tendrils) */}
      <path
        d="M80 75 C92 66, 98 56, 96 44"
        stroke={color}
        strokeWidth="0.8"
        strokeOpacity="0.65"
      />
      <path
        d="M80 75 C68 66, 62 56, 64 44"
        stroke={color}
        strokeWidth="0.8"
        strokeOpacity="0.65"
      />

      {/* Blumbangan / Sacred Gate Center Base */}
      <path
        d="M68 220 H92 V195 C92 188, 86 182, 80 182 C74 182, 68 188, 68 195 Z"
        fill="#211A16"
        stroke={color}
        strokeWidth="1"
        fillOpacity="0.8"
      />

      {/* Finial Jewel at the Top Peak */}
      <circle cx="80" cy="14" r="2.5" fill={color} />
      <circle cx="80" cy="22" r="1.5" fill={secondaryColor} />
    </svg>
  );
}

/**
 * Subtle Javanese Batik Kawung Pattern Generator
 * Seamless repeating SVG pattern for living background texture.
 */
export function JavaneseBatikKawungOverlay({
  className = 'w-full h-full',
  opacity = 0.06,
  color = '#B3945A',
}: {
  className?: string;
  opacity?: number;
  color?: string;
}) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id="jawaKawungPattern"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          {/* Central cross dot */}
          <circle cx="24" cy="24" r="1.2" fill={color} />
          <circle cx="0" cy="0" r="1.2" fill={color} />
          <circle cx="48" cy="0" r="1.2" fill={color} />
          <circle cx="0" cy="48" r="1.2" fill={color} />
          <circle cx="48" cy="48" r="1.2" fill={color} />

          {/* 4 Petals of Kawung (Ellipses rotated 45 degrees) */}
          <ellipse cx="24" cy="12" rx="6" ry="11" fill="none" stroke={color} strokeWidth="0.8" />
          <ellipse cx="24" cy="36" rx="6" ry="11" fill="none" stroke={color} strokeWidth="0.8" />
          <ellipse cx="12" cy="24" rx="11" ry="6" fill="none" stroke={color} strokeWidth="0.8" />
          <ellipse cx="36" cy="24" rx="11" ry="6" fill="none" stroke={color} strokeWidth="0.8" />

          {/* Diagonal Corner Petals */}
          <ellipse cx="0" cy="24" rx="11" ry="6" fill="none" stroke={color} strokeWidth="0.8" />
          <ellipse cx="48" cy="24" rx="11" ry="6" fill="none" stroke={color} strokeWidth="0.8" />
          <ellipse cx="24" cy="0" rx="6" ry="11" fill="none" stroke={color} strokeWidth="0.8" />
          <ellipse cx="24" cy="48" rx="6" ry="11" fill="none" stroke={color} strokeWidth="0.8" />

          {/* Inner seed dots */}
          <circle cx="24" cy="12" r="0.8" fill={color} />
          <circle cx="24" cy="36" r="0.8" fill={color} />
          <circle cx="12" cy="24" r="0.8" fill={color} />
          <circle cx="36" cy="24" r="0.8" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#jawaKawungPattern)" />
    </svg>
  );
}

/**
 * Javanese Parang Rusak Subtle Motif
 * Creates a slow fluid diagonal wave motif resembling noble batik fabric.
 */
export function JavaneseBatikParangOverlay({
  className = 'w-full h-full',
  opacity = 0.05,
  color = '#B3945A',
}: {
  className?: string;
  opacity?: number;
  color?: string;
}) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id="jawaParangPattern"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          {/* Diagonal continuous flow (Lidah Parang) */}
          <path
            d="M0 15 Q15 0, 30 15 T60 15"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.7"
          />
          <path
            d="M0 45 Q15 30, 30 45 T60 45"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.7"
          />
          {/* Mlinjon diamond accents */}
          <polygon points="15,10 18,15 15,20 12,15" fill={color} fillOpacity="0.5" />
          <polygon points="45,10 48,15 45,20 42,15" fill={color} fillOpacity="0.5" />
          <polygon points="15,40 18,45 15,50 12,45" fill={color} fillOpacity="0.5" />
          <polygon points="45,40 48,45 45,50 42,45" fill={color} fillOpacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#jawaParangPattern)" />
    </svg>
  );
}

/**
 * Javanese Royal Lung-lungan Floral Divider
 * Traditional carved teak wood motif in subtle antique gold.
 */
export function JavaneseFloralDivider({
  className = 'w-48 h-6',
  color = '#B3945A',
}: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 240 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Central Jasmine Jewel (Melati Kuncup) */}
      <circle cx="120" cy="16" r="3" fill={color} />
      <circle cx="120" cy="16" r="6" stroke={color} strokeWidth="0.8" strokeDasharray="1 2" />

      {/* Left Scroll (Sulur Kiri) */}
      <path
        d="M110 16 H80 C70 16, 62 10, 52 14 C44 18, 38 16, 30 16 H10"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Left Leaf Tendril */}
      <path
        d="M74 16 C70 12, 60 11, 56 16 C60 17, 68 18, 74 16 Z"
        fill={color}
        fillOpacity="0.6"
      />
      <circle cx="8" cy="16" r="1.5" fill={color} />

      {/* Right Scroll (Sulur Kanan) */}
      <path
        d="M130 16 H160 C170 16, 178 10, 188 14 C196 18, 202 16, 210 16 H230"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Right Leaf Tendril */}
      <path
        d="M166 16 C170 12, 180 11, 184 16 C180 17, 172 18, 166 16 Z"
        fill={color}
        fillOpacity="0.6"
      />
      <circle cx="232" cy="16" r="1.5" fill={color} />
    </svg>
  );
}

/**
 * Javanese Joglo Roof Profile Silhouette (Tumpang Sari)
 */
export function JavaneseJogloRoofSilhouette({
  className = 'w-32 h-16',
  color = '#B3945A',
  opacity = 0.8,
}: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 160 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      {/* Top Steep Roof Crown (Brunjung Joglo) */}
      <path
        d="M80 12 L96 28 H64 Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1"
      />
      <line x1="80" y1="4" x2="80" y2="12" stroke={color} strokeWidth="1.5" />
      <circle cx="80" cy="4" r="1.5" fill={color} />

      {/* Middle Tier (Penanggap) */}
      <path
        d="M60 30 H100 L118 48 H42 Z"
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="1"
      />

      {/* Lower Eaves (Panangkurat) */}
      <path
        d="M38 50 H122 L144 68 H16 Z"
        fill={color}
        fillOpacity="0.1"
        stroke={color}
        strokeWidth="1"
      />

      {/* Carved finial ridge (Umpak & Lisplang carving details) */}
      <line x1="12" y1="69" x2="148" y2="69" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

/**
 * Javanese Cunduk Mentul (Flower Sunburst) micro-icon
 */
export function JavaneseMentulIcon({
  className = 'w-4 h-4',
  color = '#B3945A',
}: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="3" fill={color} />
      <path
        d="M12 2 V6 M12 18 V22 M2 12 H6 M18 12 H22 M4.93 4.93 L7.76 7.76 M16.24 16.24 L19.07 19.07 M4.93 19.07 L7.76 16.24 M16.24 7.76 L19.07 4.93"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Javanese Wayang Shadow (Kelir Shadow Theatre)
 * Features an authentic Gunungan shadow silhouette illuminated by a warm blencong oil lamp backlight.
 */
export function JavaneseWayangShadowScreen({
  className = 'w-full h-full',
  lampIntensity = 0.65,
  shadowOpacity = 0.6,
}: {
  className?: string;
  lampIntensity?: number;
  shadowOpacity?: number;
}) {
  return (
    <div className={`relative overflow-hidden pointer-events-none ${className}`}>
      {/* Blencong Oil Lamp Warm Backlight Glow */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle 380px at 50% 55%, rgba(229, 169, 60, ${lampIntensity}) 0%, rgba(179, 148, 90, ${lampIntensity * 0.45}) 40%, transparent 75%)`,
        }}
      />

      {/* Gunungan Shadow Silhouette against the Kelir screen */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: shadowOpacity,
          transform: 'translateY(10px)',
        }}
      >
        <svg
          viewBox="0 0 200 300"
          className="w-72 h-[420px] sm:w-96 sm:h-[500px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="shadowBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            <linearGradient id="shadowGradient" x1="100" y1="20" x2="100" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B0807" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#1A1410" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#2E231C" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Gunungan Outer Shadow Contour */}
          <path
            d="M100 12 
               C103 24, 108 36, 115 46
               C123 56, 135 64, 143 76
               C153 91, 158 106, 165 124
               C173 142, 178 160, 175 180
               C172 200, 160 218, 152 236
               C147 248, 140 258, 130 268
               C120 278, 110 283, 100 288
               C90 283, 80 278, 70 268
               C60 258, 53 248, 48 236
               C40 218, 28 200, 25 180
               C22 160, 27 142, 35 124
               C42 106, 47 91, 57 76
               C65 64, 77 56, 85 46
               C92 36, 97 24, 100 12 Z"
            fill="url(#shadowGradient)"
            filter="url(#shadowBlur)"
          />

          {/* Soko guru & trunk shadow line */}
          <path
            d="M100 280 V48"
            stroke="#0B0807"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#shadowBlur)"
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * Morning Courtyard Leaves Shadow (Jawa Pagi / Fajar)
 * Soft organic shadows of tropical bamboo/frangipani foliage swaying gently in the morning breeze.
 * Enhanced opacity for distinct visibility on both desktop and mobile OLED displays.
 */
export function JavaneseMorningBreezeShadows({
  className = 'w-full h-full',
  opacity = 0.22,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      <defs>
        <filter id="foliageBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>
      </defs>

      {/* Branch & Leaves Swaying Silhouette */}
      <g filter="url(#foliageBlur)" fill="#1A1410">
        {/* Main stem curving from top right */}
        <path d="M840 -40 Q650 80, 520 220 T380 400" stroke="#1A1410" strokeWidth="10" fill="none" />

        {/* Leaf cluster 1 */}
        <path d="M680 70 C640 50, 600 80, 570 110 C620 130, 650 110, 680 70 Z" />
        <path d="M660 100 C610 90, 560 120, 530 160 C590 170, 630 140, 660 100 Z" />

        {/* Leaf cluster 2 */}
        <path d="M580 180 C530 160, 480 190, 440 240 C500 250, 550 220, 580 180 Z" />
        <path d="M550 220 C490 200, 440 240, 400 290 C460 310, 510 270, 550 220 Z" />

        {/* Fine bamboo-like leaves hanging */}
        <path d="M720 40 Q680 140, 710 220 Q730 140, 720 40 Z" />
        <path d="M690 50 Q640 160, 660 250 Q690 160, 690 50 Z" />
        <path d="M620 140 Q570 250, 600 340 Q630 250, 620 140 Z" />
        <path d="M480 200 Q430 310, 460 400 Q490 310, 480 200 Z" />
      </g>
    </svg>
  );
}

/**
 * Authentic Royal Pendopo Joglo Silhouette
 * Architectural silhouette of majestic Javanese Joglo with grand multi-tiered roof (Tumpang Sari)
 * and soko guru pillars resting on the horizon.
 */
export function JavanesePendopoSilhouette({
  className = 'w-full h-48',
  color = '#0E0B09',
  accentColor = '#B3945A',
  opacity = 0.85,
}: {
  className?: string;
  color?: string;
  accentColor?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 600 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id="pendopoGrad" x1="300" y1="0" x2="300" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} stopOpacity="0.85" />
          <stop offset="100%" stopColor={color} stopOpacity="0.98" />
        </linearGradient>
      </defs>

      {/* Main Steep Brunjung Crown (Upper Tier) */}
      <path
        d="M300 24 L348 84 H252 L300 24 Z"
        fill="url(#pendopoGrad)"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeOpacity="0.4"
      />
      {/* Finial spire peak */}
      <line x1="300" y1="8" x2="300" y2="24" stroke={accentColor} strokeWidth="2" strokeOpacity="0.6" />
      <circle cx="300" cy="8" r="2.5" fill={accentColor} />

      {/* Middle Tier (Penanggap) */}
      <path
        d="M242 86 H358 L420 144 H180 L242 86 Z"
        fill="url(#pendopoGrad)"
        stroke={accentColor}
        strokeWidth="1"
        strokeOpacity="0.3"
      />

      {/* Lower Eaves (Panangkurat Wide Canopy) */}
      <path
        d="M172 146 H428 L520 186 H80 L172 146 Z"
        fill="url(#pendopoGrad)"
        stroke={accentColor}
        strokeWidth="1"
        strokeOpacity="0.25"
      />

      {/* Carved Lisplang Ridge Line */}
      <line x1="70" y1="188" x2="530" y2="188" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.4" />

      {/* Soko Guru Pillars (Central Noble Columns) */}
      <rect x="236" y="188" width="10" height="52" fill={color} />
      <rect x="282" y="188" width="10" height="52" fill={color} />
      <rect x="308" y="188" width="10" height="52" fill={color} />
      <rect x="354" y="188" width="10" height="52" fill={color} />

      {/* Outer Supporting Pillars */}
      <rect x="140" y="188" width="8" height="52" fill={color} />
      <rect x="452" y="188" width="8" height="52" fill={color} />

      {/* Floor / Plinth Base */}
      <rect x="40" y="234" width="520" height="6" fill={color} />
    </svg>
  );
}

/**
 * Natural Linen Weave Texture
 * Adds an exquisite organic tactile luxury feel to ivory cards and heritage panels.
 */
export function JavaneseLinenWeaveTexture({
  className = 'w-full h-full',
  opacity = 0.04,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        <pattern id="linenTexture" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="none" />
          <path d="M0 2 H4 M2 0 V4" stroke="#806947" strokeWidth="0.5" strokeOpacity="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#linenTexture)" />
    </svg>
  );
}

/**
 * Subtle Javanese Gold Dust / Dew Motes (Atmospheric Candlelight motes)
 * 5 tiny particles that float slowly in the blencong / candlelight beam.
 * Motion is restrained (16-22s duration) and barely noticeable.
 */
export function JavaneseFloatingDustMotes({ className = 'inset-0 pointer-events-none' }: { className?: string }) {
  const motes = [
    { left: '22%', top: '38%', size: '3px', delay: '0s', dur: '18s', opacity: 0.35 },
    { left: '74%', top: '28%', size: '2px', delay: '3.5s', dur: '22s', opacity: 0.28 },
    { left: '46%', top: '55%', size: '3.5px', delay: '7s', dur: '20s', opacity: 0.38 },
    { left: '33%', top: '68%', size: '2.5px', delay: '11s', dur: '19s', opacity: 0.25 },
    { left: '68%', top: '75%', size: '2px', delay: '14s', dur: '24s', opacity: 0.3 },
  ];

  return (
    <div className={`absolute ${className} overflow-hidden pointer-events-none`}>
      {motes.map((m, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#E5C989] shadow-[0_0_6px_rgba(229,201,137,0.8)] jawa-anim-mote"
          style={{
            left: m.left,
            top: m.top,
            width: m.size,
            height: m.size,
            opacity: m.opacity,
            animationDelay: m.delay,
            animationDuration: m.dur,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Authentic Javanese Teakwood / Stone Carved Arch (Top Frame)
 * Inspired by Surakarta & Yogyakarta palace (Kraton) pendopo architrave reliefs.
 * Features carved floral lung-lungan filigree and central lotus crest.
 */
export function JavaneseCarvedArchTop({
  className = 'w-full',
  color = '#8A6D3B',
  accentColor = '#BFA15F',
  opacity = 0.9,
}: {
  className?: string;
  color?: string;
  accentColor?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 1200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={className}
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="carvedWoodGrad" x1="600" y1="0" x2="600" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.95" />
          <stop offset="70%" stopColor={color} stopOpacity="0.85" />
          <stop offset="100%" stopColor="#4A3525" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Top Border Band */}
      <rect x="0" y="0" width="1200" height="12" fill={color} />
      <rect x="0" y="16" width="1200" height="4" fill={accentColor} opacity="0.6" />

      {/* Main Arch Contour */}
      <path
        d="M 0 0 
           L 0 120 
           C 140 110, 260 70, 420 40 
           C 500 25, 540 22, 600 22 
           C 660 22, 700 25, 780 40 
           C 940 70, 1060 110, 1200 120 
           L 1200 0 Z"
        fill="url(#carvedWoodGrad)"
      />

      {/* Carved Scallop Fringe Details */}
      <path
        d="M 0 120 
           Q 60 135, 120 115 
           Q 180 130, 240 100 
           Q 320 110, 400 70 
           Q 480 75, 540 45 
           Q 600 50, 660 45 
           Q 720 75, 800 70 
           Q 880 110, 960 100 
           Q 1020 130, 1080 115 
           Q 1140 135, 1200 120"
        stroke={accentColor}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Central Rosette / Lotus Finial Relief */}
      <g transform="translate(600, 32)">
        <circle cx="0" cy="0" r="14" fill={color} stroke={accentColor} strokeWidth="2" />
        <circle cx="0" cy="0" r="6" fill={accentColor} />
        {/* Radiating Petals */}
        {[-60, -30, 0, 30, 60, 90, 120, 150, 180, 210, 240].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="0"
            rx="3"
            ry="11"
            fill={accentColor}
            opacity="0.75"
            transform={`rotate(${deg}) translate(0, -14)`}
          />
        ))}
      </g>

      {/* Decorative Floral Curls (Lung-lungan) */}
      <path
        d="M 360 45 C 380 35, 410 38, 430 52 C 410 50, 390 55, 370 65"
        stroke={accentColor}
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M 840 45 C 820 35, 790 38, 770 52 C 790 50, 810 55, 830 65"
        stroke={accentColor}
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M 220 75 C 240 65, 270 68, 290 82 C 270 80, 250 85, 230 95"
        stroke={accentColor}
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M 980 75 C 960 65, 930 68, 910 82 C 930 80, 950 85, 970 95"
        stroke={accentColor}
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

/**
 * Authentic Javanese Carved Bottom Relief Arch
 * Frames the bottom edge with palace relief carving.
 */
export function JavaneseCarvedArchBottom({
  className = 'w-full',
  color = '#8A6D3B',
  accentColor = '#BFA15F',
  opacity = 0.9,
}: {
  className?: string;
  color?: string;
  accentColor?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 1200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={className}
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="bottomWoodGrad" x1="600" y1="120" x2="600" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.95" />
          <stop offset="70%" stopColor={color} stopOpacity="0.85" />
          <stop offset="100%" stopColor="#4A3525" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Bottom Ground Border Band */}
      <rect x="0" y="108" width="1200" height="12" fill={color} />
      <rect x="0" y="100" width="1200" height="4" fill={accentColor} opacity="0.6" />

      {/* Main Arch Contour */}
      <path
        d="M 0 120 
           L 0 40 
           C 160 50, 320 80, 480 92 
           C 540 96, 570 98, 600 98 
           C 630 98, 660 96, 720 92 
           C 880 80, 1040 50, 1200 40 
           L 1200 120 Z"
        fill="url(#bottomWoodGrad)"
      />

      {/* Scallop Crest Line */}
      <path
        d="M 0 40 
           Q 80 30, 160 48 
           Q 260 40, 360 68 
           Q 460 62, 540 85 
           Q 600 82, 660 85 
           Q 740 62, 840 68 
           Q 940 40, 1040 48 
           Q 1120 30, 1200 40"
        stroke={accentColor}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Javanese Mega Mendung Cloud Silhouette Line Art
 * Classical Cirebon/Javanese tiered cloud patterns drifting slowly in the warm sky.
 */
export function JavaneseMegaMendungClouds({
  className = 'w-full h-32',
  color = '#BFA15F',
  opacity = 0.35,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 800 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      {/* Cloud Formation 1 (Left-Center) */}
      <path
        d="M 40 80 
           C 60 70, 80 72, 95 82 
           C 115 65, 145 66, 165 80 
           C 185 55, 230 52, 260 75 
           C 285 62, 320 68, 335 85 
           C 360 80, 380 90, 390 105 
           C 360 115, 300 115, 260 110 
           C 200 118, 140 116, 90 108 
           C 65 108, 45 98, 40 80 Z"
        stroke={color}
        strokeWidth="1.2"
        fill={color}
        fillOpacity="0.08"
      />
      {/* Inner Tier Cloud Line */}
      <path
        d="M 85 86 C 110 75, 140 76, 160 88 C 180 70, 220 68, 250 85 C 275 75, 305 80, 320 95"
        stroke={color}
        strokeWidth="0.8"
        strokeDasharray="4 2"
        fill="none"
      />

      {/* Cloud Formation 2 (Right-Center) */}
      <path
        d="M 460 70 
           C 480 58, 510 58, 530 68 
           C 555 45, 600 44, 630 65 
           C 655 52, 690 56, 710 72 
           C 730 68, 755 76, 765 92 
           C 745 104, 700 106, 660 102 
           C 600 108, 540 106, 500 98 
           C 475 96, 460 84, 460 70 Z"
        stroke={color}
        strokeWidth="1.2"
        fill={color}
        fillOpacity="0.08"
      />
      <path
        d="M 505 76 C 530 65, 570 64, 600 78 C 625 65, 660 68, 680 82"
        stroke={color}
        strokeWidth="0.8"
        strokeDasharray="4 2"
        fill="none"
      />
    </svg>
  );
}

/**
 * Minimalist Mouse Scroll Indicator with animated bouncing dot
 */
export function JavaneseMouseScrollIndicator({
  color = '#8A6D3B',
  label = 'Scroll ke Bawah',
}: {
  color?: string;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 select-none pointer-events-none">
      <div
        className="w-5 h-8 rounded-full border-2 flex items-start justify-center p-1"
        style={{ borderColor: color }}
      >
        <div
          className="w-1.5 h-2 rounded-full jawa-scroll-dot"
          style={{ backgroundColor: color }}
        />
      </div>
      {label && (
        <span
          className="text-[9px] uppercase tracking-[0.25em] font-sans font-medium opacity-70"
          style={{ color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * Living Falling Jasmine Petals (Roncean Melati Rontok Melayang)
 * Dense white and cream floral petals floating down continuously across sections
 */
export function JavaneseFallingPetals({ className = 'inset-0 pointer-events-none z-15 overflow-hidden' }: { className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      {/* Petal 1 */}
      <div className="absolute top-0 left-[8%] w-3 h-3 jawa-petal-1">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full opacity-85 filter drop-shadow-[0_2px_4px_rgba(44,30,20,0.2)]">
          <path d="M12 2C8 6 6 10 7 14C8 18 12 22 12 22C12 22 16 18 17 14C18 10 16 6 12 2Z" fill="#FFFDF8" stroke="#D4AF37" strokeWidth="0.6" />
        </svg>
      </div>

      {/* Petal 2 */}
      <div className="absolute top-0 left-[24%] w-3.5 h-3.5 jawa-petal-2">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full opacity-75 filter drop-shadow-[0_2px_4px_rgba(44,30,20,0.2)]">
          <path d="M12 2C7 7 6 11 8 15C10 19 12 22 12 22C12 22 14 19 16 15C18 11 17 7 12 2Z" fill="#FAF6EE" stroke="#C2A468" strokeWidth="0.6" />
        </svg>
      </div>

      {/* Petal 3 */}
      <div className="absolute top-0 left-[45%] w-2.5 h-2.5 jawa-petal-3">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full opacity-90 filter drop-shadow-[0_2px_4px_rgba(44,30,20,0.2)]">
          <path d="M12 2C8 6 6 10 7 14C8 18 12 22 12 22C12 22 16 18 17 14C18 10 16 6 12 2Z" fill="#FFFDF8" stroke="#D4AF37" strokeWidth="0.6" />
        </svg>
      </div>

      {/* Petal 4 */}
      <div className="absolute top-0 left-[62%] w-3 h-3 jawa-petal-1" style={{ animationDelay: '3.8s' }}>
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full opacity-80 filter drop-shadow-[0_2px_4px_rgba(44,30,20,0.2)]">
          <path d="M12 2C7 7 6 11 8 15C10 19 12 22 12 22C12 22 14 19 16 15C18 11 17 7 12 2Z" fill="#FAF6EE" stroke="#C2A468" strokeWidth="0.6" />
        </svg>
      </div>

      {/* Petal 5 */}
      <div className="absolute top-0 left-[78%] w-3.5 h-3.5 jawa-petal-2" style={{ animationDelay: '5.6s' }}>
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full opacity-85 filter drop-shadow-[0_2px_4px_rgba(44,30,20,0.2)]">
          <path d="M12 2C8 6 6 10 7 14C8 18 12 22 12 22C12 22 16 18 17 14C18 10 16 6 12 2Z" fill="#FFFDF8" stroke="#D4AF37" strokeWidth="0.6" />
        </svg>
      </div>

      {/* Petal 6 */}
      <div className="absolute top-0 left-[92%] w-2.5 h-2.5 jawa-petal-3" style={{ animationDelay: '2.1s' }}>
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full opacity-75 filter drop-shadow-[0_2px_4px_rgba(44,30,20,0.2)]">
          <path d="M12 2C7 7 6 11 8 15C10 19 12 22 12 22C12 22 14 19 16 15C18 11 17 7 12 2Z" fill="#FAF6EE" stroke="#C2A468" strokeWidth="0.6" />
        </svg>
      </div>

      {/* Petal 7 */}
      <div className="absolute top-0 left-[35%] w-3 h-3 jawa-petal-1" style={{ animationDelay: '7.2s' }}>
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full opacity-90 filter drop-shadow-[0_2px_4px_rgba(44,30,20,0.2)]">
          <path d="M12 2C8 6 6 10 7 14C8 18 12 22 12 22C12 22 16 18 17 14C18 10 16 6 12 2Z" fill="#FFFDF8" stroke="#D4AF37" strokeWidth="0.6" />
        </svg>
      </div>

      {/* Petal 8 */}
      <div className="absolute top-0 left-[85%] w-2 h-2 jawa-petal-2" style={{ animationDelay: '8.5s' }}>
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full opacity-80 filter drop-shadow-[0_2px_4px_rgba(44,30,20,0.2)]">
          <path d="M12 2C8 6 6 10 7 14C8 18 12 22 12 22C12 22 16 18 17 14C18 10 16 6 12 2Z" fill="#FAF6EE" stroke="#C2A468" strokeWidth="0.6" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Authentic Javanese Roncean Melati Tibo Dodo Garland Tassel (Garland of Jasmine buds)
 */
export function JavaneseRonceanMelatiTassel({ className = 'w-6 h-28' }: { className?: string }) {
  return (
    <div className={`relative ${className} jawa-roncean-sway pointer-events-none`}>
      <svg viewBox="0 0 24 120" fill="none" className="w-full h-full filter drop-shadow-[0_4px_8px_rgba(44,30,20,0.25)]">
        {/* Top ribbon node */}
        <circle cx="12" cy="8" r="5" fill="#FAF6EE" stroke="#C2A468" strokeWidth="1" />
        <circle cx="12" cy="8" r="2" fill="#D4AF37" />
        {/* Jasmine Garland Chain */}
        {[20, 32, 44, 56, 68, 80, 92, 104].map((y, i) => (
          <g key={i}>
            <line x1="12" y1={y - 12} x2="12" y2={y} stroke="#8A6D3B" strokeWidth="0.8" />
            <ellipse cx="12" cy={y} rx="4" ry="4.5" fill="#FFFDF8" stroke="#C2A468" strokeWidth="0.8" />
            <circle cx="12" cy={y} r="1.5" fill="#D4AF37" />
          </g>
        ))}
        {/* Bottom tassel tip */}
        <path d="M12 108 L10 118 L14 118 Z" fill="#D4AF37" />
      </svg>
    </div>
  );
}

/**
 * Royal Javanese Gold Seal Stamp (Cap Prasasti Keraton)
 */
export function JavaneseRoyalSeal({ className = 'w-10 h-10', label = 'PRASASTI' }: { className?: string; label?: string }) {
  return (
    <div className={`relative ${className} flex items-center justify-center jawa-radiance-pulse`}>
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37] opacity-60" />
      <div className="w-4/5 h-4/5 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8A6D3B] flex items-center justify-center shadow-md">
        <span className="text-[7px] font-serif font-black tracking-widest text-[#211A16] uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}
