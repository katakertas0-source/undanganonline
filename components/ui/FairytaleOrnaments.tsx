import React from 'react';

interface OrnamentProps {
  className?: string;
  color?: string;
  secondaryColor?: string;
  opacity?: number;
}

/**
 * 1. Realistic 3D Embossed Wax Seal
 * Inspired by vintage European royal sealing wax with organic dripping rim and embossed seal.
 */
export function FairytaleWaxSeal({
  className = 'w-24 h-24',
  variant = 'royal-crimson',
  monogramText = 'A & A',
}: {
  className?: string;
  variant?: 'royal-crimson' | 'botanical-wax' | 'monogram-gold' | 'royal-crest';
  monogramText?: string;
}) {
  const isCrimson = variant === 'royal-crimson';
  const rawId = React.useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');

  const baseGradId = isCrimson ? `waxCrimsonBase_${uid}` : `waxGoldBase_${uid}`;
  const bevelGradId = isCrimson ? `waxCrimsonBevel_${uid}` : `waxGoldBevel_${uid}`;
  const highlightGradId = isCrimson ? `waxCrimsonHl_${uid}` : `waxGoldHl_${uid}`;

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_14px_28px_rgba(60,8,4,0.65)] drop-shadow-[0_4px_8px_rgba(40,4,2,0.5)]"
      >
        <defs>
          {/* Base Wax Gradient */}
          <radialGradient
            id={baseGradId}
            cx="44%"
            cy="38%"
            r="62%"
            fx="40%"
            fy="34%"
          >
            {isCrimson ? (
              <>
                <stop offset="0%" stopColor="#EB4336" />
                <stop offset="30%" stopColor="#C92116" />
                <stop offset="70%" stopColor="#96120C" />
                <stop offset="100%" stopColor="#550703" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#E2C285" />
                <stop offset="35%" stopColor="#C69C54" />
                <stop offset="70%" stopColor="#9C7232" />
                <stop offset="100%" stopColor="#6E4D1D" />
              </>
            )}
          </radialGradient>

          {/* Inner Seal Shadow for 3D Inset Effect */}
          <radialGradient
            id={bevelGradId}
            cx="50%"
            cy="46%"
            r="48%"
          >
            {isCrimson ? (
              <>
                <stop offset="75%" stopColor="#4A0603" stopOpacity="0.06" />
                <stop offset="90%" stopColor="#3B0401" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#240201" stopOpacity="0.85" />
              </>
            ) : (
              <>
                <stop offset="75%" stopColor="#5E3E12" stopOpacity="0.05" />
                <stop offset="90%" stopColor="#4A2F0A" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#2E1B04" stopOpacity="0.75" />
              </>
            )}
          </radialGradient>

          {/* Highlight Specular Arc */}
          <linearGradient id={highlightGradId} x1="0" y1="0" x2="1" y2="1">
            {isCrimson ? (
              <>
                <stop offset="0%" stopColor="#FFA69E" stopOpacity="0.85" />
                <stop offset="30%" stopColor="#FF7063" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#A8150E" stopOpacity="0" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#FFF2D6" stopOpacity="0.8" />
                <stop offset="30%" stopColor="#E5C78D" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#B38944" stopOpacity="0" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* Guaranteed 100% Solid Opaque Backing Disc so seal never becomes transparent */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill={isCrimson ? '#8B0E09' : '#B88E4B'}
        />

        {/* Outer Organic Wax Puddle with dripped wax edges */}
        <path
          d="M60 4
             C74 3, 86 8, 97 18
             C106 26, 114 38, 116 52
             C118 66, 111 81, 102 92
             C93 103, 80 113, 65 115
             C50 117, 36 112, 24 104
             C14 96, 6 83, 4 69
             C2 55, 9 41, 18 30
             C28 18, 44 5, 60 4 Z"
          fill={`url(#${baseGradId})`}
          style={{ fill: isCrimson ? '#96120C' : '#C69C54' }}
        />

        {/* Top Rim Bevel Highlight */}
        <path
          d="M32 16 C48 9, 72 9, 88 16 C98 22, 106 32, 108 44 C104 30, 92 20, 78 16 C60 11, 42 13, 32 16 Z"
          fill={`url(#${highlightGradId})`}
          opacity="0.75"
        />

        {/* Inner Stamped Circle with Solid Base */}
        <circle
          cx="60"
          cy="60"
          r="41"
          fill={`url(#${baseGradId})`}
          style={{ fill: isCrimson ? '#8F0E08' : '#C69C54' }}
          stroke={isCrimson ? '#FF887F' : '#F2DA9D'}
          strokeWidth="0.8"
          strokeOpacity="0.45"
        />
        <circle
          cx="60"
          cy="60"
          r="41"
          fill={`url(#${bevelGradId})`}
        />
        <circle
          cx="60"
          cy="60"
          r="37.5"
          fill="none"
          stroke={isCrimson ? '#FFA8A0' : '#F5DFAB'}
          strokeWidth="0.9"
          strokeDasharray="2 1.5"
          strokeOpacity="0.75"
        />

        {/* Embossed Motif Content */}
        {variant === 'royal-crimson' && (
          <g transform="translate(60,60) scale(0.9) translate(-60,-60)">
            {/* Elegant Vintage Monogram with Calligraphic Flourishes (Reference Image 5) */}
            <circle cx="60" cy="60" r="32" fill="none" stroke="#FF9C94" strokeWidth="0.6" strokeOpacity="0.4" />
            <text
              x="60"
              y="66"
              textAnchor="middle"
              fill="#FFA8A0"
              fontFamily="var(--font-cormorant), Georgia, serif"
              fontStyle="italic"
              fontSize="24"
              fontWeight="700"
              letterSpacing="1"
              style={{
                filter: 'drop-shadow(0 1px 1px rgba(70,5,3,0.9)) drop-shadow(0 -1px 0.5px rgba(255,180,170,0.5))',
              }}
            >
              {monogramText || 'A & A'}
            </text>
            {/* Small floral dots */}
            <circle cx="60" cy="40" r="1.8" fill="#FFA8A0" opacity="0.8" />
            <circle cx="60" cy="80" r="1.8" fill="#FFA8A0" opacity="0.8" />
            <path
              d="M48 68 C52 72, 68 72, 72 68"
              stroke="#FFA8A0"
              strokeWidth="0.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
          </g>
        )}

        {variant === 'botanical-wax' && (
          <g transform="translate(60,60) scale(0.85) translate(-60,-60)">
            {/* Laurel Wreath */}
            <path
              d="M38 64 C36 50, 42 36, 60 33 C78 36, 84 50, 82 64 C81 74, 73 84, 60 87 C47 84, 39 74, 38 64"
              fill="none"
              stroke="#FBE5B0"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeOpacity="0.85"
            />
            {/* Olive Leaves Left */}
            <path d="M42 45 C38 43, 36 38, 41 36 C45 37, 44 42, 42 45 Z" fill="#FCE9BD" />
            <path d="M40 54 C35 53, 34 48, 39 46 C43 47, 42 52, 40 54 Z" fill="#FCE9BD" />
            <path d="M41 64 C36 65, 34 60, 39 58 C43 58, 43 63, 41 64 Z" fill="#FCE9BD" />
            <path d="M46 73 C42 76, 39 72, 43 69 C47 68, 48 72, 46 73 Z" fill="#FCE9BD" />
            {/* Olive Leaves Right */}
            <path d="M78 45 C82 43, 84 38, 79 36 C75 37, 76 42, 78 45 Z" fill="#FCE9BD" />
            <path d="M80 54 C85 53, 86 48, 81 46 C77 47, 78 52, 80 54 Z" fill="#FCE9BD" />
            <path d="M79 64 C84 65, 86 60, 81 58 C77 58, 77 63, 79 64 Z" fill="#FCE9BD" />
            <path d="M74 73 C78 76, 81 72, 77 69 C73 68, 72 72, 74 73 Z" fill="#FCE9BD" />
            {/* Center Heart and Star */}
            <path
              d="M60 48 C57 43, 50 45, 52 52 C54 57, 60 62, 60 62 C60 62, 66 57, 68 52 C70 45, 63 43, 60 48 Z"
              fill="#FDEEC8"
              stroke="#99702E"
              strokeWidth="0.8"
            />
            <circle cx="60" cy="72" r="1.8" fill="#FDEEC8" />
          </g>
        )}

        {variant === 'monogram-gold' && (
          <g>
            <text
              x="60"
              y="66"
              textAnchor="middle"
              fill="#FDEEC8"
              fontFamily="var(--font-cormorant), Georgia, serif"
              fontSize="20"
              fontWeight="600"
              letterSpacing="2"
              className="drop-shadow-[0_1px_1px_rgba(70,40,10,0.8)]"
            >
              {monogramText || 'A & A'}
            </text>
            <circle cx="60" cy="42" r="2" fill="#FCE9BD" />
            <circle cx="60" cy="78" r="2" fill="#FCE9BD" />
          </g>
        )}

        {variant === 'royal-crest' && (
          <g transform="translate(60,60) scale(0.85) translate(-60,-60)">
            {/* Royal Crown */}
            <path
              d="M44 68 L48 50 L55 58 L60 44 L65 58 L72 50 L76 68 Z"
              fill="#FDEEC8"
              stroke="#99702E"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <circle cx="48" cy="48" r="2" fill="#FFF2D6" />
            <circle cx="60" cy="42" r="2.5" fill="#FFF2D6" />
            <circle cx="72" cy="48" r="2" fill="#FFF2D6" />
            <line x1="45" y1="71" x2="75" y2="71" stroke="#FDEEC8" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="60" cy="79" r="1.8" fill="#FDEEC8" />
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * 2. Delicate Olive Botanical Sprig Branch
 * Laid gracefully next to the wax seal, matching the user's reference image 1.
 */
export function FairytaleOliveBranch({ className = 'w-32 h-20' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} drop-shadow-[0_6px_8px_rgba(0,0,0,0.18)]`}
    >
      <defs>
        <linearGradient id="stemGrad" x1="0" y1="45" x2="160" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7E725C" />
          <stop offset="100%" stopColor="#5E533F" />
        </linearGradient>
        <linearGradient id="leafGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#96A584" />
          <stop offset="100%" stopColor="#5E6D4E" />
        </linearGradient>
        <linearGradient id="leafGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B3C4A0" />
          <stop offset="100%" stopColor="#788B68" />
        </linearGradient>
      </defs>

      {/* Main Curved Stem */}
      <path
        d="M8 82 C45 68, 92 48, 152 14"
        stroke="url(#stemGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Leaves with Natural Botanical Veins */}
      <g>
        {/* Leaf 1 */}
        <path d="M42 66 C40 52, 54 44, 62 48 C65 58, 52 68, 42 66 Z" fill="url(#leafGrad1)" opacity="0.95" />
        {/* Leaf 2 */}
        <path d="M58 58 C66 46, 78 46, 82 54 C78 64, 66 65, 58 58 Z" fill="url(#leafGrad2)" opacity="0.9" />
        {/* Leaf 3 */}
        <path d="M78 48 C78 34, 94 28, 102 34 C102 46, 88 52, 78 48 Z" fill="url(#leafGrad1)" opacity="0.95" />
        {/* Leaf 4 */}
        <path d="M96 40 C108 28, 122 30, 124 38 C118 48, 104 48, 96 40 Z" fill="url(#leafGrad2)" opacity="0.9" />
        {/* Leaf 5 */}
        <path d="M120 30 C122 18, 138 14, 145 20 C144 30, 130 36, 120 30 Z" fill="url(#leafGrad1)" opacity="0.95" />
        {/* Leaf Tip */}
        <path d="M142 20 C148 10, 158 8, 158 12 C157 18, 149 22, 142 20 Z" fill="url(#leafGrad2)" opacity="0.9" />

        {/* Small Golden Berries */}
        <circle cx="56" cy="62" r="3.2" fill="#D9BA85" stroke="#7A6038" strokeWidth="0.8" />
        <circle cx="92" cy="46" r="3.2" fill="#E2C99A" stroke="#7A6038" strokeWidth="0.8" />
        <circle cx="118" cy="34" r="2.8" fill="#D9BA85" stroke="#7A6038" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

/**
 * 3. Animated Fairytale Birds (Doves & Blue Songbirds)
 * Flapping wings with smooth CSS keyframes, crossing the sky gracefully.
 */
export function FairytaleFlyingBirds({ className = 'absolute inset-0 pointer-events-none' }: { className?: string }) {
  return (
    <div className={`overflow-hidden pointer-events-none ${className}`}>
      {/* Bird 1: Elegant white dove soaring horizontally across the upper sky */}
      <div
        className="absolute w-12 h-10 animate-bird-cross-1 top-[14%] pointer-events-none"
        style={{
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.18))',
        }}
      >
        <svg viewBox="0 0 60 50" fill="none" className="w-full h-full animate-dove-flap">
          {/* Bird Body */}
          <path
            d="M20 28 C26 24, 38 22, 48 26 C52 28, 56 30, 58 32 C54 34, 46 36, 38 35 C30 34, 22 32, 16 35 C12 37, 8 36, 6 34 C10 32, 16 30, 20 28 Z"
            fill="#FFFFFF"
            stroke="#E0DCD3"
            strokeWidth="0.8"
          />
          {/* Left Wing */}
          <path
            d="M28 26 C30 16, 38 6, 44 4 C40 10, 36 20, 34 26 Z"
            fill="#F7F5F0"
            stroke="#D6D0C2"
            strokeWidth="0.6"
          />
          {/* Right Wing */}
          <path
            d="M32 25 C36 14, 46 8, 52 8 C48 16, 42 22, 38 26 Z"
            fill="#FFFFFF"
            stroke="#D6D0C2"
            strokeWidth="0.6"
          />
          {/* Eye & Beak */}
          <circle cx="56" cy="30" r="0.9" fill="#1C1814" />
          <polygon points="57,29 60,31 57,32" fill="#D49A55" />
        </svg>
      </div>

      {/* Bird 2: Companion white dove following slightly lower across the terrace */}
      <div
        className="absolute w-10 h-8 animate-bird-cross-2 top-[24%] pointer-events-none"
        style={{
          filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.14))',
        }}
      >
        <svg viewBox="0 0 50 40" fill="none" className="w-full h-full animate-dove-flap">
          {/* Body */}
          <path
            d="M16 22 C22 18, 32 16, 40 20 C44 22, 46 24, 48 25 C45 27, 38 28, 32 27 C25 26, 18 25, 13 27 C10 29, 7 28, 5 26 C8 25, 13 23, 16 22 Z"
            fill="#FFFFFF"
            stroke="#E0DCD3"
            strokeWidth="0.6"
          />
          {/* Wing */}
          <path
            d="M24 20 C26 12, 34 6, 38 5 C35 11, 31 17, 29 21 Z"
            fill="#F7F5F0"
            stroke="#D6D0C2"
            strokeWidth="0.5"
          />
          <circle cx="46" cy="23" r="0.8" fill="#1C1814" />
          <polygon points="47,22 49,24 47,25" fill="#D49A55" />
        </svg>
      </div>

      {/* Bird 3: Distant dove soaring high in the opposite direction across the palace spires */}
      <div
        className="absolute w-8 h-7 animate-bird-cross-3 top-[9%] pointer-events-none"
        style={{
          opacity: 0.9,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))',
        }}
      >
        <svg viewBox="0 0 50 40" fill="none" className="w-full h-full animate-dove-flap">
          <path
            d="M14 22 C20 18, 30 16, 38 20 C42 22, 45 24, 47 25 C44 27, 36 28, 30 27 C23 26, 16 25, 12 27 C9 29, 6 28, 4 26 C7 25, 11 23, 14 22 Z"
            fill="#FFFFFF"
          />
          <path d="M22 20 C24 12, 32 6, 36 5 C33 11, 29 17, 27 21 Z" fill="#F0EDE4" />
          <circle cx="45" cy="23" r="0.7" fill="#1C1814" />
          <polygon points="46,22 48,24 46,25" fill="#D49A55" />
        </svg>
      </div>
    </div>
  );
}

/**
 * 4. Dreamy Floating Sparkle Motes & Light Dust
 * Creates the magical fairy dust effect in the sunbeams.
 */
export function FairytaleFloatingMotes({ className = 'absolute inset-0 pointer-events-none' }: { className?: string }) {
  const motes = [
    { top: '15%', left: '25%', size: 'w-2 h-2', delay: '0s', dur: '4s' },
    { top: '28%', left: '45%', size: 'w-1.5 h-1.5', delay: '1.2s', dur: '5s' },
    { top: '35%', left: '18%', size: 'w-2.5 h-2.5', delay: '0.6s', dur: '4.5s' },
    { top: '48%', left: '72%', size: 'w-2 h-2', delay: '2s', dur: '6s' },
    { top: '22%', left: '80%', size: 'w-1.5 h-1.5', delay: '1.8s', dur: '5.5s' },
    { top: '60%', left: '35%', size: 'w-2 h-2', delay: '0.4s', dur: '4.8s' },
    { top: '70%', left: '60%', size: 'w-2.5 h-2.5', delay: '2.5s', dur: '5.2s' },
  ];

  return (
    <div className={`overflow-hidden ${className}`}>
      {motes.map((m, idx) => (
        <div
          key={idx}
          className={`absolute ${m.size} rounded-full bg-radial from-amber-100 via-amber-200/80 to-transparent animate-fairy-float`}
          style={{
            top: m.top,
            left: m.left,
            animationDelay: m.delay,
            animationDuration: m.dur,
            boxShadow: '0 0 10px rgba(245, 215, 140, 0.8), 0 0 20px rgba(255, 240, 200, 0.4)',
          }}
        />
      ))}
    </div>
  );
}

/**
 * 5. Foreground Swaying Botanical Branches & Rose Garlands
 * Sits at top corners to create multi-plane parallax depth.
 */
export function FairytaleForegroundFoliage({ className = 'absolute inset-0 pointer-events-none z-20' }: { className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      {/* Top Left Weeping Willow & English Rose Garland */}
      <div className="absolute -top-3 -left-4 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 opacity-95 animate-gentle-breeze-left origin-top-left pointer-events-none">
        <svg viewBox="0 0 240 240" fill="none" className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="foliageStemGradLeft" x1="0" y1="0" x2="160" y2="220" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2E3C27" />
              <stop offset="60%" stopColor="#455B3B" />
              <stop offset="100%" stopColor="#638054" />
            </linearGradient>
            <linearGradient id="rosePetalGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFE0E6" />
              <stop offset="50%" stopColor="#F5A3B3" />
              <stop offset="100%" stopColor="#D96E82" />
            </linearGradient>
            <linearGradient id="rosePetalGrad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF0F3" />
              <stop offset="60%" stopColor="#F7B2C0" />
              <stop offset="100%" stopColor="#E28295" />
            </linearGradient>
            <linearGradient id="leafGradLeft" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7E9B6C" />
              <stop offset="100%" stopColor="#4A633D" />
            </linearGradient>
          </defs>

          {/* Graceful Arching Willow Vine Tendrils */}
          <path
            d="M0 0 C45 35, 75 95, 62 165 C55 200, 35 225, 28 238"
            stroke="url(#foliageStemGradLeft)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M0 25 C68 60, 115 110, 108 178 C102 212, 88 230, 82 238"
            stroke="url(#foliageStemGradLeft)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M35 0 C95 48, 155 85, 168 145 C174 180, 162 210, 155 222"
            stroke="url(#foliageStemGradLeft)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Willow Leaves with Natural Slender Silhouettes */}
          <ellipse cx="58" cy="100" rx="5.5" ry="16" transform="rotate(28 58 100)" fill="url(#leafGradLeft)" />
          <ellipse cx="66" cy="135" rx="5" ry="15" transform="rotate(22 66 135)" fill="url(#leafGradLeft)" opacity="0.95" />
          <ellipse cx="52" cy="170" rx="4.5" ry="14" transform="rotate(18 52 170)" fill="url(#leafGradLeft)" opacity="0.9" />
          <ellipse cx="106" cy="120" rx="5.5" ry="16" transform="rotate(32 106 120)" fill="url(#leafGradLeft)" />
          <ellipse cx="110" cy="155" rx="5" ry="15" transform="rotate(25 110 155)" fill="url(#leafGradLeft)" opacity="0.95" />
          <ellipse cx="152" cy="115" rx="5" ry="15" transform="rotate(35 152 115)" fill="url(#leafGradLeft)" />
          <ellipse cx="168" cy="150" rx="4.5" ry="14" transform="rotate(28 168 150)" fill="url(#leafGradLeft)" opacity="0.9" />

          {/* Hanging Fairytale English Rose Bloom 1 (Layered Petals) */}
          <g transform="translate(82, 88)">
            {/* Calyx */}
            <path d="M-6 4 C-8 8, -4 14, 0 16 C4 14, 8 8, 6 4 Z" fill="#4A633D" />
            {/* Outer Petals */}
            <circle cx="0" cy="0" r="14" fill="url(#rosePetalGrad1)" />
            <circle cx="-3" cy="-2" r="10" fill="url(#rosePetalGrad2)" opacity="0.9" />
            <circle cx="2" cy="1" r="8" fill="url(#rosePetalGrad1)" />
            {/* Inner Heart */}
            <circle cx="0" cy="0" r="5" fill="#D96E82" />
            <circle cx="-1" cy="-1" r="2.5" fill="#B34B5E" />
          </g>

          {/* Hanging Rose Bloom 2 */}
          <g transform="translate(150, 72)">
            <path d="M-5 3 C-6 7, -3 11, 0 13 C3 11, 6 7, 5 3 Z" fill="#4A633D" />
            <circle cx="0" cy="0" r="11" fill="url(#rosePetalGrad1)" />
            <circle cx="-2" cy="-1" r="8" fill="url(#rosePetalGrad2)" />
            <circle cx="1" cy="0" r="6" fill="url(#rosePetalGrad1)" />
            <circle cx="0" cy="0" r="3.5" fill="#D96E82" />
          </g>
        </svg>
      </div>

      {/* Top Right Willow & Flower Arch */}
      <div className="absolute -top-3 -right-4 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 opacity-95 animate-gentle-breeze-right origin-top-right pointer-events-none">
        <svg viewBox="0 0 240 240" fill="none" className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="foliageStemGradRight" x1="240" y1="0" x2="80" y2="220" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2E3C27" />
              <stop offset="60%" stopColor="#455B3B" />
              <stop offset="100%" stopColor="#638054" />
            </linearGradient>
            <linearGradient id="leafGradRight" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7E9B6C" />
              <stop offset="100%" stopColor="#4A633D" />
            </linearGradient>
          </defs>

          {/* Arching Tendrils Right */}
          <path
            d="M240 0 C195 35, 165 95, 178 165 C185 200, 205 225, 212 238"
            stroke="url(#foliageStemGradRight)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M240 25 C172 60, 125 110, 132 178 C138 212, 152 230, 158 238"
            stroke="url(#foliageStemGradRight)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M205 0 C145 48, 85 85, 72 145 C66 180, 78 210, 85 222"
            stroke="url(#foliageStemGradRight)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Leaves along tendrils right */}
          <ellipse cx="182" cy="100" rx="5.5" ry="16" transform="rotate(-28 182 100)" fill="url(#leafGradRight)" />
          <ellipse cx="174" cy="135" rx="5" ry="15" transform="rotate(-22 174 135)" fill="url(#leafGradRight)" opacity="0.95" />
          <ellipse cx="188" cy="170" rx="4.5" ry="14" transform="rotate(-18 188 170)" fill="url(#leafGradRight)" opacity="0.9" />
          <ellipse cx="134" cy="120" rx="5.5" ry="16" transform="rotate(-32 134 120)" fill="url(#leafGradRight)" />
          <ellipse cx="130" cy="155" rx="5" ry="15" transform="rotate(-25 130 155)" fill="url(#leafGradRight)" opacity="0.95" />
          <ellipse cx="88" cy="115" rx="5" ry="15" transform="rotate(-35 88 115)" fill="url(#leafGradRight)" />

          {/* Hanging Rose Bloom Right */}
          <g transform="translate(158, 88)">
            <path d="M-6 4 C-8 8, -4 14, 0 16 C4 14, 8 8, 6 4 Z" fill="#4A633D" />
            <circle cx="0" cy="0" r="14" fill="url(#rosePetalGrad1)" />
            <circle cx="3" cy="-2" r="10" fill="url(#rosePetalGrad2)" opacity="0.9" />
            <circle cx="-2" cy="1" r="8" fill="url(#rosePetalGrad1)" />
            <circle cx="0" cy="0" r="5" fill="#D96E82" />
            <circle cx="1" cy="-1" r="2.5" fill="#B34B5E" />
          </g>

          <g transform="translate(90, 72)">
            <path d="M-5 3 C-6 7, -3 11, 0 13 C3 11, 6 7, 5 3 Z" fill="#4A633D" />
            <circle cx="0" cy="0" r="11" fill="url(#rosePetalGrad1)" />
            <circle cx="2" cy="-1" r="8" fill="url(#rosePetalGrad2)" />
            <circle cx="-1" cy="0" r="6" fill="url(#rosePetalGrad1)" />
            <circle cx="0" cy="0" r="3.5" fill="#D96E82" />
          </g>
        </svg>
      </div>
    </div>
  );
}

/**
 * 5B. Complete Romantic Rose Floral Border Frame
 * Frames each section (Hero, Countdown, Couple, Events, Story, Gallery, RSVP) with lush pink roses, buds, and leafy foliage.
 * Exactly matches the 12-frame storyboard reference.
 */
export function FairytaleRoseFrame({
  className = 'absolute inset-0 pointer-events-none z-20',
  showTop = true,
  showBottom = true,
}: {
  className?: string;
  showTop?: boolean;
  showBottom?: boolean;
}) {
  return (
    <div className={`overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Top Rose Garland Arch */}
      {showTop && <FairytaleForegroundFoliage className="absolute inset-x-0 top-0 h-48 sm:h-64" />}

      {/* Bottom Left & Right Blooming Rose Clusters */}
      {showBottom && (
        <>
          {/* Bottom Left Rose Cluster */}
          <div className="absolute -bottom-3 -left-3 w-40 sm:w-52 h-36 sm:h-44 pointer-events-none">
            <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
              <defs>
                <linearGradient id="btmRosePetal1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFE4EA" />
                  <stop offset="50%" stopColor="#F5A3B3" />
                  <stop offset="100%" stopColor="#D96E82" />
                </linearGradient>
                <linearGradient id="btmRosePetal2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFF2F5" />
                  <stop offset="60%" stopColor="#F7B5C2" />
                  <stop offset="100%" stopColor="#E28497" />
                </linearGradient>
                <linearGradient id="btmLeafGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3C5232" />
                  <stop offset="100%" stopColor="#6C8A5B" />
                </linearGradient>
              </defs>
              {/* Leaves */}
              <ellipse cx="65" cy="110" rx="9" ry="24" transform="rotate(-40 65 110)" fill="url(#btmLeafGrad)" />
              <ellipse cx="110" cy="125" rx="8" ry="22" transform="rotate(35 110 125)" fill="url(#btmLeafGrad)" />
              <ellipse cx="40" cy="85" rx="8" ry="20" transform="rotate(-65 40 85)" fill="url(#btmLeafGrad)" />
              <ellipse cx="85" cy="75" rx="7" ry="18" transform="rotate(15 85 75)" fill="url(#btmLeafGrad)" />
              
              {/* Main Rose Bloom Left */}
              <g transform="translate(68, 118)">
                <circle cx="0" cy="0" r="22" fill="url(#btmRosePetal1)" />
                <circle cx="-3" cy="-3" r="16" fill="url(#btmRosePetal2)" />
                <circle cx="2" cy="2" r="11" fill="url(#btmRosePetal1)" />
                <circle cx="0" cy="0" r="7" fill="#D96E82" />
                <circle cx="-1" cy="-1" r="3.5" fill="#B34B5E" />
              </g>

              {/* Smaller Side Rose */}
              <g transform="translate(125, 130)">
                <circle cx="0" cy="0" r="15" fill="url(#btmRosePetal1)" />
                <circle cx="-2" cy="-2" r="10" fill="url(#btmRosePetal2)" />
                <circle cx="1" cy="1" r="7" fill="url(#btmRosePetal1)" />
                <circle cx="0" cy="0" r="4" fill="#D96E82" />
              </g>

              {/* Rosebud */}
              <g transform="translate(32, 75)">
                <path d="M0 0 C-4 -8, -1 -16, 6 -18 C13 -16, 16 -8, 12 0 Z" fill="url(#btmRosePetal1)" />
                <path d="M-2 2 C-2 -6, 2 -12, 6 -14" stroke="#4A633D" strokeWidth="1.5" />
              </g>
            </svg>
          </div>

          {/* Bottom Right Rose Cluster */}
          <div className="absolute -bottom-3 -right-3 w-40 sm:w-52 h-36 sm:h-44 pointer-events-none">
            <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
              {/* Leaves */}
              <ellipse cx="135" cy="110" rx="9" ry="24" transform="rotate(40 135 110)" fill="url(#btmLeafGrad)" />
              <ellipse cx="90" cy="125" rx="8" ry="22" transform="rotate(-35 90 125)" fill="url(#btmLeafGrad)" />
              <ellipse cx="160" cy="85" rx="8" ry="20" transform="rotate(65 160 85)" fill="url(#btmLeafGrad)" />
              <ellipse cx="115" cy="75" rx="7" ry="18" transform="rotate(-15 115 75)" fill="url(#btmLeafGrad)" />
              
              {/* Main Rose Bloom Right */}
              <g transform="translate(132, 118)">
                <circle cx="0" cy="0" r="22" fill="url(#btmRosePetal1)" />
                <circle cx="3" cy="-3" r="16" fill="url(#btmRosePetal2)" />
                <circle cx="-2" cy="2" r="11" fill="url(#btmRosePetal1)" />
                <circle cx="0" cy="0" r="7" fill="#D96E82" />
                <circle cx="1" cy="-1" r="3.5" fill="#B34B5E" />
              </g>

              {/* Smaller Side Rose */}
              <g transform="translate(75, 130)">
                <circle cx="0" cy="0" r="15" fill="url(#btmRosePetal1)" />
                <circle cx="2" cy="-2" r="10" fill="url(#btmRosePetal2)" />
                <circle cx="-1" cy="1" r="7" fill="url(#btmRosePetal1)" />
                <circle cx="0" cy="0" r="4" fill="#D96E82" />
              </g>

              {/* Rosebud Right */}
              <g transform="translate(168, 75)">
                <path d="M0 0 C4 -8, 1 -16, -6 -18 C-13 -16, -16 -8, -12 0 Z" fill="url(#btmRosePetal1)" />
                <path d="M2 2 C2 -6, -2 -12, -6 -14" stroke="#4A633D" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * 6. Romantic Rose Botanical Flourish Divider
 * Used between story sections, events, and RSVP.
 */
export function FairytaleRoseDivider({ className = 'w-48 h-8 my-6 mx-auto' }: OrnamentProps) {
  return (
    <div className={`flex items-center justify-center gap-3 select-none ${className}`}>
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#C69C54]/40 to-[#C69C54]" />
      <svg viewBox="0 0 40 20" fill="none" className="w-6 h-4 shrink-0 text-[#C69C54]">
        {/* Center Rose */}
        <circle cx="20" cy="10" r="4.5" fill="#E8A5B2" stroke="#C69C54" strokeWidth="0.8" />
        <circle cx="19.5" cy="9.5" r="2.5" fill="#D67D8F" />
        {/* Left Leaf */}
        <path d="M15 10 C11 8, 8 10, 6 12 C10 13, 14 12, 15 10 Z" fill="#7C946D" />
        {/* Right Leaf */}
        <path d="M25 10 C29 8, 32 10, 34 12 C30 13, 26 12, 25 10 Z" fill="#7C946D" />
      </svg>
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#C69C54]/40 to-[#C69C54]" />
    </div>
  );
}

/**
 * 7. Luxury Embossed Stationery Paper (Seamless Botanical Letterpress Vector)
 * Edge-to-edge luxury stationery with double-stroke 3D letterpress embossing.
 */
export function FairytaleEmbossedPaper({
  className = 'absolute inset-0',
  theme = 'sage',
}: {
  className?: string;
  theme?: 'sage' | 'ivory' | 'blush-cream' | 'royal-navy';
}) {
  const isSage = theme === 'sage';
  const isNavy = theme === 'royal-navy';
  const isBlush = theme === 'blush-cream';

  const strokeLight = isNavy ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.65)';
  const strokeDark = isNavy ? 'rgba(0,0,0,0.45)' : isSage ? 'rgba(40,58,35,0.14)' : 'rgba(80,60,40,0.12)';
  const bgGrad = isSage
    ? 'linear-gradient(145deg, #E6EFE4 0%, #D8E4D5 45%, #C8D8C4 100%)'
    : isNavy
    ? 'linear-gradient(145deg, #1A2333 0%, #131A26 50%, #0E131C 100%)'
    : isBlush
    ? 'linear-gradient(145deg, #FAF1EE 0%, #F4E4E0 50%, #E8D3CE 100%)'
    : 'linear-gradient(145deg, #FAF8F4 0%, #F5EFE6 50%, #E9DECE 100%)';

  return (
    <div
      className={`${className} overflow-hidden pointer-events-none select-none`}
      style={{ background: bgGrad }}
    >
      <svg
        className="w-full h-full opacity-90"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="botanicalPeonyPattern"
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
          >
            {/* Shadow layer for letterpress depth */}
            <g transform="translate(0.8, 1.2)" stroke={strokeDark} fill="none" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M80 60 C65 45, 50 60, 60 75 C70 90, 90 90, 100 75 C110 60, 95 45, 80 60 Z" />
              <path d="M80 50 C70 38, 90 38, 80 50" />
              <path d="M68 68 C55 64, 60 80, 72 76" />
              <path d="M92 68 C105 64, 100 80, 88 76" />
              <path d="M80 40 C60 35, 52 50, 58 65" />
              <path d="M80 40 C100 35, 108 50, 102 65" />
              <path d="M58 75 C45 85, 60 102, 78 96" />
              <path d="M102 75 C115 85, 100 102, 82 96" />
              <path d="M80 96 C80 120, 65 138, 48 150" />
              <path d="M80 96 C95 115, 112 128, 130 138" />
              <path d="M80 40 C75 20, 55 8, 38 0" />
              <path d="M80 40 C85 20, 105 8, 122 0" />
              <path d="M58 128 C45 124, 40 136, 48 140 C56 144, 62 132, 58 128 Z" />
              <path d="M102 118 C115 114, 120 126, 112 130 C104 134, 98 122, 102 118 Z" />
              <path d="M65 24 C52 20, 48 32, 58 34 C68 36, 72 26, 65 24 Z" />
              <path d="M95 24 C108 20, 112 32, 102 34 C92 36, 88 26, 95 24 Z" />
            </g>

            {/* Highlight layer for 3D embossed letterpress look */}
            <g transform="translate(-0.6, -0.8)" stroke={strokeLight} fill="none" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M80 60 C65 45, 50 60, 60 75 C70 90, 90 90, 100 75 C110 60, 95 45, 80 60 Z" />
              <path d="M80 50 C70 38, 90 38, 80 50" />
              <path d="M68 68 C55 64, 60 80, 72 76" />
              <path d="M92 68 C105 64, 100 80, 88 76" />
              <path d="M80 40 C60 35, 52 50, 58 65" />
              <path d="M80 40 C100 35, 108 50, 102 65" />
              <path d="M58 75 C45 85, 60 102, 78 96" />
              <path d="M102 75 C115 85, 100 102, 82 96" />
              <path d="M80 96 C80 120, 65 138, 48 150" />
              <path d="M80 96 C95 115, 112 128, 130 138" />
              <path d="M80 40 C75 20, 55 8, 38 0" />
              <path d="M80 40 C85 20, 105 8, 122 0" />
              <path d="M58 128 C45 124, 40 136, 48 140 C56 144, 62 132, 58 128 Z" />
              <path d="M102 118 C115 114, 120 126, 112 130 C104 134, 98 122, 102 118 Z" />
              <path d="M65 24 C52 20, 48 32, 58 34 C68 36, 72 26, 65 24 Z" />
              <path d="M95 24 C108 20, 112 32, 102 34 C92 36, 88 26, 95 24 Z" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#botanicalPeonyPattern)" />
      </svg>

      {/* Subtle organic paper sheen gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.45) 0%, rgba(0,0,0,0.06) 80%, rgba(0,0,0,0.18) 100%)',
        }}
      />
    </div>
  );
}

/**
 * 8. Cinematic Living Water Fountain Motion
 * Provides realistic animated water ripples, cascading streams, sunlit glints, and fine mist.
 */
export function FairytaleFountainWaterMotion({
  className = 'absolute inset-x-0 bottom-0 h-44 sm:h-56 pointer-events-none z-10',
}: {
  className?: string;
}) {
  return (
    <div className={`overflow-hidden select-none pointer-events-none ${className}`}>
      {/* Central Fountain Coordinates positioned over the palace garden fountain */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-2 sm:bottom-6 w-64 sm:w-84 h-36 sm:h-44 flex items-center justify-center">
        {/* Layer 1: Concentric Expanding Water Ripples in the Basin */}
        <div className="absolute bottom-2 w-48 sm:w-60 h-14 sm:h-18 flex items-center justify-center">
          <div
            className="absolute w-full h-full rounded-[100%] border border-cyan-200/60 shadow-[0_0_12px_rgba(180,230,255,0.45)] animate-fountain-ripple"
            style={{ animationDuration: '3.2s', animationIterationCount: 'infinite' }}
          />
          <div
            className="absolute w-full h-full rounded-[100%] border border-sky-100/70 shadow-[0_0_16px_rgba(200,240,255,0.55)] animate-fountain-ripple"
            style={{ animationDuration: '3.2s', animationDelay: '1.1s', animationIterationCount: 'infinite' }}
          />
          <div
            className="absolute w-full h-full rounded-[100%] border border-white/80 shadow-[0_0_8px_rgba(255,255,255,0.65)] animate-fountain-ripple"
            style={{ animationDuration: '3.2s', animationDelay: '2.2s', animationIterationCount: 'infinite' }}
          />
          {/* Subtle water caustics sheen */}
          <div className="absolute inset-0 rounded-[100%] bg-gradient-to-t from-cyan-400/15 via-sky-300/15 to-transparent animate-pulse" />
        </div>

        {/* Layer 2: Cascading Water Sheets & Dynamic Spray */}
        <svg viewBox="0 0 160 120" fill="none" className="w-36 sm:w-44 h-28 sm:h-36 absolute bottom-6 z-10">
          <defs>
            <linearGradient id="fountainWaterJet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#E0F2FE" stopOpacity="0.75" />
              <stop offset="85%" stopColor="#BAE6FD" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="fountainSprayGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Central Jet Plume with realistic flowing animation */}
          <g className="animate-fountain-spray" style={{ transformOrigin: '80px 100px' }}>
            {/* Center Spout */}
            <path
              d="M78 95 C78 45, 75 25, 80 12 C85 25, 82 45, 82 95 Z"
              fill="url(#fountainWaterJet)"
              filter="drop-shadow(0 0 4px rgba(255,255,255,0.85))"
            />
            {/* Left Arching Jet */}
            <path
              d="M79 80 C74 50, 60 40, 52 55 C54 65, 68 75, 76 85 Z"
              fill="url(#fountainWaterJet)"
              opacity="0.85"
            />
            {/* Right Arching Jet */}
            <path
              d="M81 80 C86 50, 100 40, 108 55 C106 65, 92 75, 84 85 Z"
              fill="url(#fountainWaterJet)"
              opacity="0.85"
            />
            {/* Lower Tier Cascade */}
            <path
              d="M60 88 C60 100, 100 100, 100 88 C96 93, 64 93, 60 88 Z"
              fill="url(#fountainSprayGrad)"
            />
          </g>
        </svg>

        {/* Layer 3: Sunlit Water Specular Glints / Sparkling Droplets */}
        <div className="absolute bottom-10 w-44 h-26 pointer-events-none">
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#FFF] animate-water-glint"
            style={{ animationDuration: '1.8s', animationIterationCount: 'infinite' }}
          />
          <div
            className="absolute top-8 left-[35%] w-1.5 h-1.5 rounded-full bg-sky-100 shadow-[0_0_6px_#BAE6FD] animate-water-glint"
            style={{ animationDuration: '2.2s', animationDelay: '0.6s', animationIterationCount: 'infinite' }}
          />
          <div
            className="absolute top-8 right-[35%] w-1.5 h-1.5 rounded-full bg-sky-100 shadow-[0_0_6px_#BAE6FD] animate-water-glint"
            style={{ animationDuration: '2.4s', animationDelay: '1.1s', animationIterationCount: 'infinite' }}
          />
          <div
            className="absolute bottom-4 left-[28%] w-1 h-1 rounded-full bg-white shadow-[0_0_4px_#FFF] animate-water-glint"
            style={{ animationDuration: '1.6s', animationDelay: '0.4s', animationIterationCount: 'infinite' }}
          />
          <div
            className="absolute bottom-4 right-[28%] w-1 h-1 rounded-full bg-white shadow-[0_0_4px_#FFF] animate-water-glint"
            style={{ animationDuration: '1.9s', animationDelay: '0.9s', animationIterationCount: 'infinite' }}
          />
        </div>

        {/* Layer 4: Soft Fountain Mist */}
        <div
          className="absolute -top-4 w-36 sm:w-44 h-22 rounded-full bg-radial from-white/35 via-sky-100/15 to-transparent blur-md animate-fountain-mist"
          style={{ animationDuration: '4.5s', animationIterationCount: 'infinite' }}
        />
      </div>
    </div>
  );
}

