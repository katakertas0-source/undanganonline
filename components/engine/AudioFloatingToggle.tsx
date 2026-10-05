'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioFloatingToggleProps {
  audioUrl?: string;
  isUnlocked: boolean;
  isDark?: boolean;
  forceMobile?: boolean;
  position?: 'bottom-right' | 'top-right' | 'inline';
  className?: string;
}

export function AudioFloatingToggle({
  audioUrl,
  isUnlocked,
  isDark,
  forceMobile = false,
  position = 'bottom-right',
  className = '',
}: AudioFloatingToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.loop = true;
    audioRef.current = audio;

    if (isUnlocked) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.log('Audio autoplay prevented by browser policy:', e);
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioUrl, isUnlocked]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  if (!audioUrl || !isUnlocked) return null;

  if (position === 'inline') {
    return (
      <button
        onClick={togglePlay}
        type="button"
        aria-label={isPlaying ? 'Mute audio' : 'Play audio'}
        className={`w-8 h-8 rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md shadow-md flex items-center justify-center cursor-pointer hover:bg-black/60 active:scale-95 transition-all ${className}`}
      >
        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#E2C285]" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-white/70" />
        )}
      </button>
    );
  }

  const defaultClasses =
    position === 'top-right'
      ? 'fixed top-12 sm:top-14 right-3.5 sm:right-5 z-50 p-2 sm:p-2.5 rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 flex items-center justify-center cursor-pointer ' +
        (isDark
          ? 'bg-[#171717]/85 text-[#F5F3EF] border-[#F5F3EF]/20 hover:bg-[#171717]'
          : 'bg-black/45 text-white border-white/25 hover:bg-black/65')
      : `${
          forceMobile
            ? 'fixed bottom-20 right-3.5 z-50 p-2.5'
            : 'fixed bottom-6 right-4 sm:right-6 z-50 p-2.5 sm:p-3'
        } rounded-full border transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer ${
          isDark
            ? 'bg-[#171717]/90 text-[#F5F3EF] border-[#F5F3EF]/20 hover:bg-[#171717]'
            : 'bg-white/90 text-[#111111] border-[#111111]/15 hover:bg-white'
        } backdrop-blur-sm`;

  return (
    <button
      onClick={togglePlay}
      type="button"
      aria-label={isPlaying ? 'Mute audio' : 'Play audio'}
      className={`${defaultClasses} ${className}`}
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 animate-pulse text-[#E2C285]" />
      ) : (
        <VolumeX className="w-4 h-4 text-white/70" />
      )}
    </button>
  );
}
