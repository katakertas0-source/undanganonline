import React from 'react';

interface IconProps {
  className?: string;
  color?: string;
  secondaryColor?: string;
}

/**
 * Authentic Balinese Architectural Split Gate (Candi Bentar) Icon
 * Meticulously drafted with traditional Balinese silhouette:
 * stepped tapering tiers, flame/leaf finials (aler-aler), and carved stone plinth.
 */
export function BalineseGapuraIcon({
  className = 'w-10 h-10',
  color = '#B88E4B',
  secondaryColor = '#8C4830',
}: IconProps) {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* LEFT SPLIT TOWER (Candi Bentar Kiri) */}
      <g>
        {/* Topmost Spire (Murda / Tajug) */}
        <path
          d="M58 8 L54 18 H58 Z"
          fill={color}
        />
        <circle cx="56" cy="7" r="1.5" fill={secondaryColor} />
        
        {/* Tier 1 (Tingkat Atas) */}
        <path
          d="M58 18 H49 L46 26 H58 Z"
          fill={color}
          fillOpacity="0.85"
        />
        <path d="M49 18 C46 20 44 24 46 26" stroke={secondaryColor} strokeWidth="1" />

        {/* Tier 2 (Tingkat Tengah) */}
        <path
          d="M58 28 H43 L39 39 H58 Z"
          fill={color}
          fillOpacity="0.75"
        />
        {/* Wing finial / Sayap Aler-aler */}
        <path d="M43 28 C38 31 36 36 39 39" stroke={secondaryColor} strokeWidth="1.2" />

        {/* Tier 3 (Badan Candi) */}
        <path
          d="M58 41 H36 L31 56 H58 Z"
          fill={color}
          fillOpacity="0.65"
        />
        <path d="M36 41 C30 45 28 52 31 56" stroke={secondaryColor} strokeWidth="1.2" />

        {/* Tier 4 (Tingkat Bawah & Pintu) */}
        <path
          d="M58 58 H28 L23 76 H58 Z"
          fill={color}
          fillOpacity="0.5"
        />
        <path d="M28 58 C20 63 18 72 23 76" stroke={secondaryColor} strokeWidth="1.4" />

        {/* Horizontal relief bands (Pelipit) */}
        <line x1="46" y1="26" x2="58" y2="26" stroke={secondaryColor} strokeWidth="1" />
        <line x1="39" y1="39" x2="58" y2="39" stroke={secondaryColor} strokeWidth="1" />
        <line x1="31" y1="56" x2="58" y2="56" stroke={secondaryColor} strokeWidth="1" />
        <line x1="23" y1="76" x2="58" y2="76" stroke={secondaryColor} strokeWidth="1.2" />

        {/* Base Foundation (Batur Kiri) */}
        <path
          d="M18 78 H58 V86 H16 L18 78 Z"
          fill={secondaryColor}
        />
        <rect x="14" y="86" width="44" height="4" rx="1" fill={color} />
      </g>

      {/* RIGHT SPLIT TOWER (Candi Bentar Kanan) */}
      <g>
        {/* Topmost Spire (Murda / Tajug) */}
        <path
          d="M62 8 L66 18 H62 Z"
          fill={color}
        />
        <circle cx="64" cy="7" r="1.5" fill={secondaryColor} />

        {/* Tier 1 (Tingkat Atas) */}
        <path
          d="M62 18 H71 L74 26 H62 Z"
          fill={color}
          fillOpacity="0.85"
        />
        <path d="M71 18 C74 20 76 24 74 26" stroke={secondaryColor} strokeWidth="1" />

        {/* Tier 2 (Tingkat Tengah) */}
        <path
          d="M62 28 H77 L81 39 H62 Z"
          fill={color}
          fillOpacity="0.75"
        />
        <path d="M77 28 C82 31 84 36 81 39" stroke={secondaryColor} strokeWidth="1.2" />

        {/* Tier 3 (Badan Candi) */}
        <path
          d="M62 41 H84 L89 56 H62 Z"
          fill={color}
          fillOpacity="0.65"
        />
        <path d="M84 41 C90 45 92 52 89 56" stroke={secondaryColor} strokeWidth="1.2" />

        {/* Tier 4 (Tingkat Bawah & Pintu) */}
        <path
          d="M62 58 H92 L97 76 H62 Z"
          fill={color}
          fillOpacity="0.5"
        />
        <path d="M92 58 C100 63 102 72 97 76" stroke={secondaryColor} strokeWidth="1.4" />

        {/* Horizontal relief bands (Pelipit) */}
        <line x1="62" y1="26" x2="74" y2="26" stroke={secondaryColor} strokeWidth="1" />
        <line x1="62" y1="39" x2="81" y2="39" stroke={secondaryColor} strokeWidth="1" />
        <line x1="62" y1="56" x2="89" y2="56" stroke={secondaryColor} strokeWidth="1" />
        <line x1="62" y1="76" x2="97" y2="76" stroke={secondaryColor} strokeWidth="1.2" />

        {/* Base Foundation (Batur Kanan) */}
        <path
          d="M62 78 H102 L104 86 H62 V78 Z"
          fill={secondaryColor}
        />
        <rect x="62" y="86" width="44" height="4" rx="1" fill={color} />
      </g>

      {/* Sacred Central Void & Solar Bindu (Aksen Sakral Tengah) */}
      <circle cx="60" cy="48" r="2" fill={color} />
      <line x1="60" y1="53" x2="60" y2="82" stroke={secondaryColor} strokeWidth="0.8" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

/**
 * Balinese Kori Agung (Paduraksa) Roof Crest Emblem
 */
export function BalineseKoriAgungCrest({
  className = 'w-12 h-6',
  color = '#B88E4B',
  secondaryColor = '#8C4830',
}: IconProps) {
  return (
    <svg
      viewBox="0 0 120 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Central Spire */}
      <path d="M60 2 L63 10 H57 Z" fill={color} />
      <circle cx="60" cy="2" r="1.5" fill={secondaryColor} />
      
      {/* Side Spires */}
      <path d="M53 7 L56 14 H51 Z" fill={color} fillOpacity="0.75" />
      <path d="M67 7 L69 14 H64 Z" fill={color} fillOpacity="0.75" />

      {/* Tiered Roof Curves */}
      <path
        d="M40 18 C50 14 70 14 80 18 L78 21 C69 17 51 17 42 21 Z"
        fill={color}
      />
      <path
        d="M28 25 C45 20 75 20 92 25 L90 28 C74 23 46 23 30 28 Z"
        fill={secondaryColor}
      />

      {/* Curved Roof Wings (Sayap Kori) */}
      <path
        d="M30 25 C22 23 15 19 12 13 C14 18 19 23 26 27 Z"
        fill={color}
      />
      <path
        d="M90 25 C98 23 105 19 108 13 C106 18 101 23 94 27 Z"
        fill={color}
      />

      {/* Central Jewel */}
      <circle cx="60" cy="26" r="2.5" fill={color} stroke={secondaryColor} strokeWidth="0.8" />
    </svg>
  );
}

/**
 * Balinese Patra Punggel Floral Corner Flourish
 */
export function BalinesePatraCorner({
  className = 'w-5 h-5',
  color = '#B88E4B',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2 30 V14 C2 7.37 7.37 2 14 2 H30"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2 14 C5 14 8 12 10 9 C11 6 14 4 19 4"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="9" cy="9" r="1.5" fill={color} />
      <circle cx="3" cy="3" r="1.2" fill={color} />
    </svg>
  );
}

/**
 * Balinese Ornamental Section Divider with Lotus Emblem
 */
export function BalineseOrnamentalDivider({
  className = 'w-44 h-4 mx-auto my-2',
  color = '#B88E4B',
  secondaryColor = '#8C4830',
}: IconProps) {
  return (
    <svg
      viewBox="0 0 180 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line x1="10" y1="8" x2="70" y2="8" stroke={color} strokeWidth="0.75" strokeOpacity="0.5" />
      <line x1="110" y1="8" x2="170" y2="8" stroke={color} strokeWidth="0.75" strokeOpacity="0.5" />
      
      {/* Left motif */}
      <circle cx="70" cy="8" r="1.2" fill={color} />
      <path d="M65 5 L68 8 L65 11" stroke={color} strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Center Lotus / Diamond emblem */}
      <rect x="86" y="4" width="8" height="8" transform="rotate(45 86 4)" fill={color} fillOpacity="0.2" stroke={secondaryColor} strokeWidth="0.8" />
      <circle cx="90" cy="8" r="1.5" fill={color} />
      
      {/* Right motif */}
      <circle cx="110" cy="8" r="1.2" fill={color} />
      <path d="M115 5 L112 8 L115 11" stroke={color} strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface BalineseGatewayFrameProps {
  children: React.ReactNode;
  className?: string;
  gateColor?: string;
  accentColor?: string;
}

/**
 * Elegant Balinese Sacred Portal Frame
 * Replaces crude CSS block stairs with a refined architectural arched portal:
 * - Graceful Balinese temple arch (gerbang kori)
 * - Double hairline border in Prada Gold & Terracotta
 * - Crowned with an authentic Balinese finial/crest
 * - 100% responsive, zero clipping, universally adapts to ANY user photo
 */
export function BalineseCandiBentarFrame({
  children,
  className = '',
  gateColor = '#B88E4B',
  accentColor = '#8C4830',
}: BalineseGatewayFrameProps) {
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Architectural Top Finial (Mahkota Gapura) */}
      <div className="mb-1 flex flex-col items-center">
        <BalineseKoriAgungCrest className="w-16 h-5 text-[#B88E4B]" color={gateColor} secondaryColor={accentColor} />
      </div>

      {/* Arched Sacred Portal Frame */}
      <div
        className="relative p-2 bg-[#FAF8F5] rounded-t-[110px] sm:rounded-t-[140px] rounded-b-md shadow-md border"
        style={{ borderColor: `${gateColor}60` }}
      >
        {/* Inner Gold Hairline Frame */}
        <div
          className="relative aspect-[3/4] w-48 sm:w-56 md:w-64 rounded-t-[102px] sm:rounded-t-[132px] rounded-b-xs overflow-hidden border"
          style={{ borderColor: `${gateColor}90` }}
        >
          {children}

          {/* Sacred subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#24201D]/25 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Base stone foundation bar */}
        <div
          className="mt-1.5 h-1 w-full rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
}

