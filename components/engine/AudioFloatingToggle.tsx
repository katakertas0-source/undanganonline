'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioFloatingToggleProps {
  audioUrl?: string;
  isUnlocked: boolean;
  isDark?: boolean;
  forceMobile?: boolean;
}

export function AudioFloatingToggle({
  audioUrl,
  isUnlocked,
  isDark,
  forceMobile = false,
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

  return (
    <button
      onClick={togglePlay}
      aria-label={isPlaying ? 'Mute audio' : 'Play audio'}
      className={`${
        forceMobile
          ? 'fixed bottom-20 right-3.5 z-50 p-2.5'
          : 'fixed bottom-6 right-4 sm:right-6 z-50 p-2.5 sm:p-3'
      } rounded-full border transition-all duration-300 shadow-md flex items-center justify-center ${
        isDark
          ? 'bg-[#171717]/90 text-[#F5F3EF] border-[#F5F3EF]/20 hover:bg-[#171717]'
          : 'bg-white/90 text-[#111111] border-[#111111]/15 hover:bg-white'
      } backdrop-blur-sm`}
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 animate-pulse" />
      ) : (
        <VolumeX className="w-4 h-4 text-neutral-400" />
      )}
    </button>
  );
}
