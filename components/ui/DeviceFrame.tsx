'use client';

import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  isDark?: boolean;
}

export function DeviceFrame({ children, isDark }: DeviceFrameProps) {
  return (
    <div className="relative mx-auto select-none transition-all duration-300">
      {/* Outer iPhone Chassis with Matte Titanium Border */}
      <div className="w-[375px] max-w-full h-[760px] bg-[#18181A] p-3 rounded-[52px] shadow-[0_35px_80px_-15px_rgba(0,0,0,0.4)] border border-neutral-700/60 ring-1 ring-black/50 relative overflow-hidden flex flex-col">
        {/* Inner OLED Display Panel (Hardware Boundary - Containing Block for fixed elements) */}
        <div
          className={`relative w-full h-full rounded-[40px] overflow-hidden flex flex-col [transform:translateZ(0)] ${
            isDark ? 'bg-[#0C0C0C]' : 'bg-[#F8F7F3]'
          }`}
        >
          {/* Transparent Status Bar with Integrated Dynamic Island Floating Overlay */}
          <div className="absolute top-0 inset-x-0 h-11 z-40 flex items-center justify-between px-6 pointer-events-none select-none text-white drop-shadow-md">
            {/* Clock */}
            <span className="text-[12px] font-semibold tracking-tight w-12 drop-shadow">
              09:41
            </span>

            {/* Dynamic Island Capsule */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-neutral-800 ring-1 ring-neutral-700" />
            </div>

            {/* Status Icons */}
            <div className="flex items-center justify-end gap-1.5 text-xs w-12 drop-shadow">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Screen Scroll Viewport: Content flows 100% full-bleed from absolute top to bottom */}
          <div
            id="device-viewport"
            data-device-viewport="true"
            className="w-full h-full overflow-y-auto overflow-x-hidden relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {children}
          </div>

          {/* iOS Home Indicator Bar: Floating transparent overlay */}
          <div className="absolute bottom-0 inset-x-0 h-6 pointer-events-none z-40 flex items-end justify-center pb-1.5">
            <div className="w-32 h-1 bg-white/70 rounded-full shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
