'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { getTemplateById } from '@/lib/store';
import { TemplateArchetype } from '@/types';

interface CountdownSectionProps {
  targetDate: string;
  isDark?: boolean;
  templateId?: string;
  archetype?: TemplateArchetype;
  isVideoMotion?: boolean;
  isEventPassed?: boolean;
}

export function CountdownSection({
  targetDate,
  isDark: propIsDark,
  templateId,
  archetype: propArchetype,
  isVideoMotion: propIsVideoMotion,
  isEventPassed: propIsEventPassed,
}: CountdownSectionProps) {
  const template = templateId ? getTemplateById(templateId) : null;
  const archetype = propArchetype || template?.archetype || 'editorial-garden';
  const isDark = propIsDark ?? template?.theme.isDark ?? false;
  const isVideoMotion = Boolean(propIsVideoMotion || template?.archetype === 'cinematic-motion');

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const isCinema = archetype === 'dark-luxury-cinema';
  const isRoma = archetype === 'mediterranean-summer';
  const isRomantic = archetype === 'romantic-cinema';
  const isZen = archetype === 'japanese-minimal';
  const isModern = archetype === 'modern-minimal';
  const isBali = archetype === 'balinese-heritage';

  const isPassed = Boolean(
    propIsEventPassed ||
    (targetDate && !isNaN(new Date(targetDate).getTime()) && +new Date(targetDate) < +new Date() - 24 * 60 * 60 * 1000)
  );

  return (
    <section
      className={`py-16 px-6 border-y transition-colors duration-500 ${
        isVideoMotion
          ? 'border-white/10 bg-transparent text-white'
          : isCinema
          ? 'border-neutral-900 bg-[#0A0A0A] text-[#F5F3EF]'
          : isBali
          ? 'border-[#B88E4B]/30 bg-[#F7F4EE] text-[#24201D]'
          : isRoma
          ? 'border-[#C85A32]/20 bg-[#F9F6F0] text-[#2E221D]'
          : isRomantic
          ? 'border-[#9B8070]/20 bg-[#FAF7F2] text-[#3D342E]'
          : isZen
          ? 'border-stone-300/40 bg-[#F6F4F0] text-[#232220]'
          : isDark
          ? 'border-neutral-900 bg-[#0C0C0C] text-[#F5F3EF]'
          : 'border-neutral-200/70 bg-[#F8F7F3] text-[#111111]'
      }`}
    >
      <div className="max-w-xl mx-auto text-center">
        <p
          className={`text-[10px] uppercase tracking-ultra mb-6 font-medium ${
            isVideoMotion
              ? 'text-[#E5C378] drop-shadow-sm'
              : isCinema
              ? 'text-[#C4B59D]'
              : isBali
              ? 'text-[#8C4830]'
              : isRoma
              ? 'text-[#C85A32]'
              : isZen
              ? 'text-stone-400'
              : 'text-neutral-400'
          }`}
        >
          {isPassed
            ? isBali
              ? 'RAHINA PAWIWAHAN SAMPUN MEMARGI ANTAR'
              : isRoma
              ? 'CELEBRAZIONE INDIMENTICABILE'
              : isZen
              ? '佳き日を終えて · CHERISHED MEMORY'
              : isCinema
              ? 'PREMIERE CELEBRATION COMPLETED'
              : 'CELEBRATION COMPLETED · MOMEN TELAH BERLANGSUNG'
            : isBali
            ? 'MENUJU HARI BAHAGIA · RAHINA PAWIWAHAN'
            : isRoma
            ? 'IL CONTO ALLA ROVESCIA'
            : isZen
            ? '時を待つ · COUNTING DOWN'
            : isCinema
            ? 'PREMIERE COUNTDOWN'
            : isModern
            ? '00 / TIMELINE INDEX'
            : 'COUNTING DOWN TO THE MOMENT'}
        </p>

        {isPassed ? (
          <div className="py-2 space-y-4 animate-fade-in">
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full border transition-all ${
                isVideoMotion
                  ? 'border-[#E5C378]/40 bg-white/5 text-[#E5C378]'
                  : isCinema
                  ? 'border-[#C4B59D]/40 bg-white/5 text-[#C4B59D]'
                  : isBali
                  ? 'border-[#8C4830]/30 bg-[#8C4830]/5 text-[#8C4830]'
                  : isRoma
                  ? 'border-[#C85A32]/30 bg-[#C85A32]/5 text-[#C85A32]'
                  : 'border-neutral-300 bg-black/5 text-neutral-800'
              }`}
            >
              <Heart className="w-5 h-5 fill-current" />
            </div>

            <h3
              className={`text-2xl sm:text-3xl font-light uppercase tracking-wide ${
                isModern ? 'font-mono' : 'font-serif'
              } ${isVideoMotion ? 'text-white drop-shadow-md' : ''}`}
            >
              Hari Bahagia Telah Berlangsung
            </h3>

            <p
              className={`text-xs sm:text-sm font-light max-w-md mx-auto leading-relaxed ${
                isVideoMotion ? 'text-white/80' : 'opacity-70'
              }`}
            >
              Rasa syukur mendalam atas doa, restu, dan cinta kasih tulus yang telah menyertai awal perjalanan suci ikrar pernikahan kami.
            </p>

            <div className="pt-2">
              <span
                className={`inline-block text-[10px] font-mono uppercase tracking-widest px-3 py-1 border rounded-full ${
                  isVideoMotion
                    ? 'border-white/20 text-white/90 bg-white/5'
                    : isDark || isCinema
                    ? 'border-neutral-800 text-neutral-400 bg-neutral-900/50'
                    : 'border-neutral-200 text-neutral-500 bg-white'
                }`}
              >
                MEMORIES RECORDED & SEALED
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 sm:gap-6">
            <div className="flex flex-col items-center">
              <span
                className={`text-3xl sm:text-5xl font-light tracking-tight ${
                  isModern ? 'font-mono' : 'font-serif'
                } ${isVideoMotion ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]' : isCinema ? 'text-[#C4B59D]' : isBali ? 'text-[#8C4830]' : ''}`}
              >
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className={`text-[10px] uppercase tracking-widest mt-2 ${isVideoMotion ? 'text-white/80' : 'opacity-60'}`}>
                HARI
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span
                className={`text-3xl sm:text-5xl font-light tracking-tight ${
                  isModern ? 'font-mono' : 'font-serif'
                } ${isVideoMotion ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]' : isCinema ? 'text-[#C4B59D]' : isBali ? 'text-[#8C4830]' : ''}`}
              >
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className={`text-[10px] uppercase tracking-widest mt-2 ${isVideoMotion ? 'text-white/80' : 'opacity-60'}`}>
                JAM
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span
                className={`text-3xl sm:text-5xl font-light tracking-tight ${
                  isModern ? 'font-mono' : 'font-serif'
                } ${isVideoMotion ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]' : isCinema ? 'text-[#C4B59D]' : isBali ? 'text-[#8C4830]' : ''}`}
              >
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className={`text-[10px] uppercase tracking-widest mt-2 ${isVideoMotion ? 'text-white/80' : 'opacity-60'}`}>
                MENIT
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span
                className={`text-3xl sm:text-5xl font-light tracking-tight ${
                  isModern ? 'font-mono' : 'font-serif'
                } ${isVideoMotion ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]' : isCinema ? 'text-[#C4B59D]' : isBali ? 'text-[#8C4830]' : ''}`}
              >
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className={`text-[10px] uppercase tracking-widest mt-2 ${isVideoMotion ? 'text-white/80' : 'opacity-60'}`}>
                DETIK
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
