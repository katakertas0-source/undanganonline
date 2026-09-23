import React from 'react';

interface StarOrnamentProps {
  className?: string;
  color?: string;
  size?: number;
}

/**
 * Authentic Balinese Luxury Star Ornament (Dewata Nawa Sanga / Padma Star)
 * Meticulously drafted in vector SVG with 8 radiating lotus/spear finials,
 * central diamond core, and fine gold dot accents.
 * Used as the primary brand signature for Bali Heritage Luxury.
 */
export function BalineseStarOrnament({
  className = 'w-6 h-6',
  color = '#B89A5A',
}: StarOrnamentProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Central Solar Core */}
      <circle cx="20" cy="20" r="2.5" fill={color} />
      <circle cx="20" cy="20" r="4.5" stroke={color} strokeWidth="0.8" strokeOpacity="0.8" />

      {/* 4 Cardinal Spire Blades (North, South, East, West) */}
      {/* North */}
      <path
        d="M20 3 L22 13 L20 15 L18 13 Z"
        fill={color}
      />
      <circle cx="20" cy="1.5" r="1" fill={color} />

      {/* South */}
      <path
        d="M20 37 L22 27 L20 25 L18 27 Z"
        fill={color}
      />
      <circle cx="20" cy="38.5" r="1" fill={color} />

      {/* East */}
      <path
        d="M37 20 L27 22 L25 20 L27 18 Z"
        fill={color}
      />
      <circle cx="38.5" cy="20" r="1" fill={color} />

      {/* West */}
      <path
        d="M3 20 L13 22 L15 20 L13 18 Z"
        fill={color}
      />
      <circle cx="1.5" cy="20" r="1" fill={color} />

      {/* 4 Diagonal Petals (NE, NW, SE, SW) */}
      {/* North-East */}
      <path
        d="M32 8 L27 16 L25 15 L24 13 Z"
        fill={color}
        fillOpacity="0.85"
      />
      <circle cx="33" cy="7" r="0.8" fill={color} />

      {/* North-West */}
      <path
        d="M8 8 L13 16 L15 15 L16 13 Z"
        fill={color}
        fillOpacity="0.85"
      />
      <circle cx="7" cy="7" r="0.8" fill={color} />

      {/* South-East */}
      <path
        d="M32 32 L27 24 L25 25 L24 27 Z"
        fill={color}
        fillOpacity="0.85"
      />
      <circle cx="33" cy="33" r="0.8" fill={color} />

      {/* South-West */}
      <path
        d="M8 32 L13 24 L15 25 L16 27 Z"
        fill={color}
        fillOpacity="0.85"
      />
      <circle cx="7" cy="33" r="0.8" fill={color} />

      {/* Radiant Diamond Frame */}
      <rect
        x="16.5"
        y="16.5"
        width="7"
        height="7"
        transform="rotate(45 20 20)"
        stroke={color}
        strokeWidth="0.6"
        fill="none"
        strokeOpacity="0.7"
      />
    </svg>
  );
}
