'use client';

import React from 'react';
import Image from 'next/image';

interface FairytaleRoyalGateProps {
  isOpen: boolean;
  className?: string;
  forceMobile?: boolean;
  onEnterGarden?: () => void;
}

/**
 * FairytaleRoyalGate — 3D Ornate Wrought-Iron Palace Garden Gate
 * Features:
 * - Symmetrical twin wrought-iron doors with gold-leaf fleur-de-lis & baroque scrolls.
 * - Classical marble stone pillars draped in pink roses and vintage lanterns.
 * - Realistic 3D door swing physics (left door swings left, right door swings right).
 * - Reveals the romantic enchanted fountain garden beyond.
 */
export function FairytaleRoyalGate({
  isOpen,
  className = '',
  forceMobile = false,
  onEnterGarden,
}: FairytaleRoyalGateProps) {
  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Background Layer: Enchanted Garden Fountain (Uncropped True Wide View) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/fairytale-garden-fountain.jpg"
          alt="Enchanted Fairytale Garden Fountain"
          fill
          className={`object-cover object-center transition-all duration-2000 ease-out ${
            isOpen ? 'scale-100 filter blur-0 brightness-100' : 'scale-100 brightness-95 filter blur-[0.5px]'
          }`}
          priority
        />
        {/* Soft Golden Sunbeam Glow Overlay */}
        <div
          className={`absolute inset-0 bg-radial from-amber-100/30 via-transparent to-black/25 pointer-events-none transition-opacity duration-1500 ${
            isOpen ? 'opacity-80' : 'opacity-40'
          }`}
        />
      </div>

      {/* Royal Gate 3D Container */}
      <div
        className={`absolute inset-0 z-10 flex items-center justify-center transition-all duration-2000 ease-out ${
          isOpen ? 'scale-120 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Stone Arch & Pillar Framing Overlay */}
        <div
          className={`relative w-full max-w-[430px] ${
            forceMobile ? 'h-[736px] max-h-[736px] py-2.5' : 'h-[92vh] max-h-[860px]'
          } mx-auto flex flex-col justify-between pointer-events-none px-2`}
        >
          
          {/* Top Classical Arch with Pink Rose Garland & Golden Crown Crest */}
          <div className="relative w-full h-32 sm:h-36 z-20 flex flex-col items-center justify-start shrink-0">
            {/* Arch Silhouette */}
            <svg
              viewBox="0 0 400 120"
              fill="none"
              className="w-full h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
            >
              {/* Stone Arch Border */}
              <path
                d="M10 120 L10 60 C10 20, 80 5, 200 5 C320 5, 390 20, 390 60 L390 120"
                stroke="#EDE7DD"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M16 120 L16 62 C16 26, 84 11, 200 11 C316 11, 384 26, 384 62 L384 120"
                stroke="#C69C54"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Ornate Gold Crown Crest in the Arch Keystones */}
              <g transform="translate(200, 28) scale(0.9)">
                {/* Gold Shield */}
                <path
                  d="M-22 -14 C-10 -16, 10 -16, 22 -14 C20 10, 14 24, 0 32 C-14 24, -20 10, -22 -14 Z"
                  fill="#8C6D3B"
                  stroke="#E5C78D"
                  strokeWidth="1.5"
                />
                {/* Crown Spikes */}
                <path
                  d="M-15 -14 L-12 -24 L-4 -17 L0 -27 L4 -17 L12 -24 L15 -14 Z"
                  fill="#E5C78D"
                  stroke="#8C6D3B"
                  strokeWidth="0.8"
                />
                {/* Fleur-de-lis Insignia */}
                <path
                  d="M0 0 C-4 -6, -10 -4, -8 2 C-6 8, 0 16, 0 18 C0 16, 6 8, 8 2 C10 -4, 4 -6, 0 0 Z"
                  fill="#FFF2D6"
                />
              </g>

              {/* Draped Floral Rose Leaves along the Arch */}
              <path
                d="M30 65 Q90 22 170 20 Q190 20 200 20 Q210 20 230 20 Q310 22 370 65"
                stroke="#4F6D44"
                strokeWidth="3"
                strokeDasharray="6 8"
                opacity="0.8"
              />
            </svg>

            {/* Lush Pink Rose Clustered Urns atop the Pillars */}
            <div className="absolute inset-x-0 top-0 flex justify-between px-3 pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-radial from-pink-300/80 via-pink-400/40 to-transparent blur-xs flex items-center justify-center text-xs">
                🌸
              </div>
              <div className="w-16 h-16 rounded-full bg-radial from-pink-300/80 via-pink-400/40 to-transparent blur-xs flex items-center justify-center text-xs">
                🌸
              </div>
            </div>
          </div>

          {/* Center Main Gates: Left Door & Right Door (3D Swing) */}
          <div className="relative flex-1 w-full mx-auto flex items-center justify-center px-4 my-[-10px] z-10">
            {/* The Gate Portal Frame */}
            <div
              className="relative w-full h-[96%] max-h-[560px] flex items-center justify-center"
              style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
            >
              {/* LEFT GATE DOOR */}
              <div
                className="w-1/2 h-full transition-transform duration-1600 ease-in-out cursor-pointer"
                style={{
                  transformOrigin: 'left center',
                  transform: isOpen
                    ? 'perspective(1000px) rotateY(-88deg) translateZ(10px)'
                    : 'perspective(1000px) rotateY(0deg) translateZ(0px)',
                  transformStyle: 'preserve-3d',
                }}
                onClick={onEnterGarden}
              >
                <svg
                  viewBox="0 0 170 500"
                  fill="none"
                  className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
                >
                  <defs>
                    <linearGradient id="ironGradLeft" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#1E1A16" />
                      <stop offset="35%" stopColor="#3E342B" />
                      <stop offset="70%" stopColor="#25201A" />
                      <stop offset="100%" stopColor="#15120E" />
                    </linearGradient>
                    <linearGradient id="goldFiligreeLeft" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F5D59A" />
                      <stop offset="50%" stopColor="#C69C54" />
                      <stop offset="100%" stopColor="#8C6D3B" />
                    </linearGradient>
                  </defs>

                  {/* Outer Iron Border Frame */}
                  <rect
                    x="4"
                    y="10"
                    width="162"
                    height="480"
                    rx="4"
                    fill="url(#ironGradLeft)"
                    stroke="#C69C54"
                    strokeWidth="1.8"
                    opacity="0.95"
                  />
                  <rect
                    x="12"
                    y="18"
                    width="146"
                    height="464"
                    rx="2"
                    fill="none"
                    stroke="#1E1A16"
                    strokeWidth="3"
                  />

                  {/* Vertical Wrought Iron Bars */}
                  {[32, 54, 76, 98, 120, 142].map((x) => (
                    <g key={x}>
                      <line
                        x1={x}
                        y1="22"
                        x2={x}
                        y2="478"
                        stroke="url(#ironGradLeft)"
                        strokeWidth="3.2"
                      />
                      {/* Spear / Fleur-de-lis Tips on Top of Bars */}
                      <path
                        d={`M${x - 4} 34 L${x} 18 L${x + 4} 34 L${x} 28 Z`}
                        fill="url(#goldFiligreeLeft)"
                      />
                      {/* Mid Ring Accents */}
                      <circle cx={x} cy="230" r="3.5" fill="url(#goldFiligreeLeft)" />
                      <circle cx={x} cy="360" r="3.5" fill="url(#goldFiligreeLeft)" />
                    </g>
                  ))}

                  {/* Top Ornate Baroque Scrollwork */}
                  <path
                    d="M16 60 C50 30, 110 30, 154 60 C130 90, 40 90, 16 60 Z"
                    fill="none"
                    stroke="url(#goldFiligreeLeft)"
                    strokeWidth="2.2"
                  />
                  <circle cx="85" cy="55" r="10" stroke="url(#goldFiligreeLeft)" strokeWidth="1.5" />
                  <path
                    d="M85 45 C80 40, 75 42, 75 48 C75 56, 85 64, 85 64 C85 64, 95 56, 95 48 C95 42, 90 40, 85 45 Z"
                    fill="url(#goldFiligreeLeft)"
                  />

                  {/* Mid Medallion with Golden Fleur-de-lis */}
                  <g transform="translate(85, 230)">
                    <circle cx="0" cy="0" r="24" fill="#1C1814" stroke="url(#goldFiligreeLeft)" strokeWidth="2" />
                    <circle cx="0" cy="0" r="19" stroke="#C69C54" strokeWidth="1" strokeDasharray="3 3" />
                    <path
                      d="M0 -14 C-4 -6, -11 -6, -9 0 C-7 6, 0 14, 0 14 C0 14, 7 6, 9 0 C11 -6, 4 -6, 0 -14 Z"
                      fill="url(#goldFiligreeLeft)"
                    />
                  </g>

                  {/* Bottom Kick Plate with Ornate Cross Hatching */}
                  <rect
                    x="16"
                    y="390"
                    width="138"
                    height="84"
                    fill="#15120E"
                    stroke="url(#goldFiligreeLeft)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M16 390 L154 474 M154 390 L16 474"
                    stroke="url(#goldFiligreeLeft)"
                    strokeWidth="1.2"
                    opacity="0.7"
                  />
                  <circle cx="85" cy="432" r="12" fill="#25201A" stroke="url(#goldFiligreeLeft)" strokeWidth="1.5" />
                  <path
                    d="M85 423 L87 430 L94 432 L87 434 L85 441 L83 434 L76 432 L83 430 Z"
                    fill="url(#goldFiligreeLeft)"
                  />

                  {/* Left Hinge Plates */}
                  <rect x="2" y="70" width="8" height="24" rx="2" fill="#E5C78D" />
                  <rect x="2" y="240" width="8" height="24" rx="2" fill="#E5C78D" />
                  <rect x="2" y="420" width="8" height="24" rx="2" fill="#E5C78D" />

                  {/* Center Latch Plate (Right Edge) */}
                  <rect x="156" y="224" width="8" height="32" rx="2" fill="url(#goldFiligreeLeft)" />
                  <circle cx="160" cy="240" r="3" fill="#15120E" />
                </svg>
              </div>

              {/* RIGHT GATE DOOR */}
              <div
                className="w-1/2 h-full transition-transform duration-1600 ease-in-out cursor-pointer"
                style={{
                  transformOrigin: 'right center',
                  transform: isOpen
                    ? 'perspective(1000px) rotateY(88deg) translateZ(10px)'
                    : 'perspective(1000px) rotateY(0deg) translateZ(0px)',
                  transformStyle: 'preserve-3d',
                }}
                onClick={onEnterGarden}
              >
                <svg
                  viewBox="0 0 170 500"
                  fill="none"
                  className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
                >
                  <defs>
                    <linearGradient id="ironGradRight" x1="1" y1="0" x2="0" y2="0">
                      <stop offset="0%" stopColor="#1E1A16" />
                      <stop offset="35%" stopColor="#3E342B" />
                      <stop offset="70%" stopColor="#25201A" />
                      <stop offset="100%" stopColor="#15120E" />
                    </linearGradient>
                    <linearGradient id="goldFiligreeRight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F5D59A" />
                      <stop offset="50%" stopColor="#C69C54" />
                      <stop offset="100%" stopColor="#8C6D3B" />
                    </linearGradient>
                  </defs>

                  {/* Outer Iron Border Frame */}
                  <rect
                    x="4"
                    y="10"
                    width="162"
                    height="480"
                    rx="4"
                    fill="url(#ironGradRight)"
                    stroke="#C69C54"
                    strokeWidth="1.8"
                    opacity="0.95"
                  />
                  <rect
                    x="12"
                    y="18"
                    width="146"
                    height="464"
                    rx="2"
                    fill="none"
                    stroke="#1E1A16"
                    strokeWidth="3"
                  />

                  {/* Vertical Wrought Iron Bars */}
                  {[28, 50, 72, 94, 116, 138].map((x) => (
                    <g key={x}>
                      <line
                        x1={x}
                        y1="22"
                        x2={x}
                        y2="478"
                        stroke="url(#ironGradRight)"
                        strokeWidth="3.2"
                      />
                      {/* Spear / Fleur-de-lis Tips on Top of Bars */}
                      <path
                        d={`M${x - 4} 34 L${x} 18 L${x + 4} 34 L${x} 28 Z`}
                        fill="url(#goldFiligreeRight)"
                      />
                      {/* Mid Ring Accents */}
                      <circle cx={x} cy="230" r="3.5" fill="url(#goldFiligreeRight)" />
                      <circle cx={x} cy="360" r="3.5" fill="url(#goldFiligreeRight)" />
                    </g>
                  ))}

                  {/* Top Ornate Baroque Scrollwork */}
                  <path
                    d="M16 60 C60 30, 120 30, 154 60 C130 90, 40 90, 16 60 Z"
                    fill="none"
                    stroke="url(#goldFiligreeRight)"
                    strokeWidth="2.2"
                  />
                  <circle cx="85" cy="55" r="10" stroke="url(#goldFiligreeRight)" strokeWidth="1.5" />
                  <path
                    d="M85 45 C80 40, 75 42, 75 48 C75 56, 85 64, 85 64 C85 64, 95 56, 95 48 C95 42, 90 40, 85 45 Z"
                    fill="url(#goldFiligreeRight)"
                  />

                  {/* Mid Medallion with Golden Fleur-de-lis */}
                  <g transform="translate(85, 230)">
                    <circle cx="0" cy="0" r="24" fill="#1C1814" stroke="url(#goldFiligreeRight)" strokeWidth="2" />
                    <circle cx="0" cy="0" r="19" stroke="#C69C54" strokeWidth="1" strokeDasharray="3 3" />
                    <path
                      d="M0 -14 C-4 -6, -11 -6, -9 0 C-7 6, 0 14, 0 14 C0 14, 7 6, 9 0 C11 -6, 4 -6, 0 -14 Z"
                      fill="url(#goldFiligreeRight)"
                    />
                  </g>

                  {/* Bottom Kick Plate with Ornate Cross Hatching */}
                  <rect
                    x="16"
                    y="390"
                    width="138"
                    height="84"
                    fill="#15120E"
                    stroke="url(#goldFiligreeRight)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M16 390 L154 474 M154 390 L16 474"
                    stroke="url(#goldFiligreeRight)"
                    strokeWidth="1.2"
                    opacity="0.7"
                  />
                  <circle cx="85" cy="432" r="12" fill="#25201A" stroke="url(#goldFiligreeRight)" strokeWidth="1.5" />
                  <path
                    d="M85 423 L87 430 L94 432 L87 434 L85 441 L83 434 L76 432 L83 430 Z"
                    fill="url(#goldFiligreeRight)"
                  />

                  {/* Right Hinge Plates */}
                  <rect x="160" y="70" width="8" height="24" rx="2" fill="#E5C78D" />
                  <rect x="160" y="240" width="8" height="24" rx="2" fill="#E5C78D" />
                  <rect x="160" y="420" width="8" height="24" rx="2" fill="#E5C78D" />

                  {/* Center Latch Handle (Left Edge) */}
                  <rect x="6" y="224" width="8" height="32" rx="2" fill="url(#goldFiligreeRight)" />
                  <circle cx="10" cy="240" r="3" fill="#15120E" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom Stone Balustrade & Flowerbed Step */}
          <div className="relative w-full h-16 sm:h-20 z-20 flex items-center justify-between px-2 shrink-0">
            {/* Left Marble Column Base with Lantern */}
            <div className="w-16 h-full bg-gradient-to-t from-[#EDE7DD] via-[#F8F5EE] to-[#E3DACB] border border-[#C69C54]/40 rounded-t-sm shadow-md flex items-center justify-center relative">
              <span className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] text-base">
                🏮
              </span>
            </div>

            {/* Center Stone Pathway with Rose Petals */}
            <div className="flex-1 h-3 bg-gradient-to-r from-[#D8CEBF] via-[#EADBCA] to-[#D8CEBF] mx-2 rounded-xs opacity-90 shadow-inner flex items-center justify-around px-4">
              <span className="text-[9px] opacity-70">🌹</span>
              <span className="text-[8px] opacity-60">🌸</span>
              <span className="text-[9px] opacity-70">🌹</span>
            </div>

            {/* Right Marble Column Base with Lantern */}
            <div className="w-16 h-full bg-gradient-to-t from-[#EDE7DD] via-[#F8F5EE] to-[#E3DACB] border border-[#C69C54]/40 rounded-t-sm shadow-md flex items-center justify-center relative">
              <span className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] text-base">
                🏮
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
