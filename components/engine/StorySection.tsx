'use client';

import React from 'react';
import { LoveStoryItem, TemplateArchetype } from '@/types';
import { getTemplateById } from '@/lib/store';

interface StorySectionProps {
  stories: LoveStoryItem[];
  isDark?: boolean;
  forceMobile?: boolean;
  templateId?: string;
  archetype?: TemplateArchetype;
  isVideoMotion?: boolean;
}

export function StorySection({
  stories,
  isDark: propIsDark,
  forceMobile = false,
  templateId,
  archetype: propArchetype,
  isVideoMotion: propIsVideoMotion,
}: StorySectionProps) {
  if (!stories || stories.length === 0) return null;

  const template = templateId ? getTemplateById(templateId) : null;
  const archetype = propArchetype || template?.archetype || 'editorial-garden';
  const isDark = propIsDark ?? template?.theme.isDark ?? false;
  const isVideoMotion = Boolean(propIsVideoMotion || template?.archetype === 'cinematic-motion');

  const isCinema = archetype === 'dark-luxury-cinema';
  const isRoma = archetype === 'mediterranean-summer';
  const isRomantic = archetype === 'romantic-cinema';
  const isZen = archetype === 'japanese-minimal';
  const isModern = archetype === 'modern-minimal';
  const isGarden = archetype === 'editorial-garden';
  const isBali = archetype === 'balinese-heritage';

  return (
    <section
      className={`py-16 sm:py-24 px-6 transition-colors duration-500 ${
        isVideoMotion
          ? 'bg-transparent text-white'
          : isCinema
          ? 'bg-[#0A0A0A] text-[#F5F3EF]'
          : isBali
          ? 'bg-[#F7F4EE] text-[#24201D]'
          : isRoma
          ? 'bg-[#FAF6EE] text-[#2E221D]'
          : isRomantic
          ? 'bg-[#FAF7F2] text-[#3D342E]'
          : isZen
          ? 'bg-[#F6F4F0] text-[#232220]'
          : isDark
          ? 'bg-[#0C0C0C] text-[#F5F3EF]'
          : 'bg-[#F8F7F3] text-[#111111]'
      }`}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p
            className={`text-[10px] uppercase tracking-ultra font-medium ${
              isVideoMotion
                ? 'text-[#E5C378]'
                : isCinema
                ? 'text-[#C4B59D]'
                : isBali
                ? 'text-[#8C4830]'
                : isRoma
                ? 'text-[#C85A32]'
                : isGarden
                ? 'text-[#4A5340]'
                : isRomantic
                ? 'text-[#9B8070]'
                : 'text-neutral-400'
            }`}
          >
            {isBali
              ? 'SATUA ASMARA · THE SACRED JOURNEY'
              : isRoma
              ? 'LA NOSTRA STORIA · TRAVEL MEMORIES'
              : isCinema
              ? 'THE CHRONICLE · THREE ACTS'
              : isZen
              ? 'ふたりの歩み · JOURNEY OF TWO'
              : isModern
              ? '03 / CHRONOLOGY'
              : 'OUR JOURNEY'}
          </p>
          <h2 className={`font-serif text-3xl sm:text-4xl uppercase tracking-wider mt-2 ${
            isVideoMotion ? 'text-white drop-shadow-md' : ''
          }`}>
            {isBali ? 'Satua Asmara' : 'Kisah Cinta'}
          </h2>
          <div
            className={`w-12 h-[1px] mx-auto mt-4 ${
              isVideoMotion
                ? 'bg-[#E5C378]/50'
                : isCinema
                ? 'bg-[#C4B59D]/30'
                : isBali
                ? 'bg-[#B88E4B]/40'
                : isRoma
                ? 'bg-[#C85A32]/25'
                : isDark
                ? 'bg-neutral-800'
                : 'bg-neutral-300'
            }`}
          />
        </div>

        {/* Timeline */}
        <div
          className={`relative border-l space-y-12 ${
            isVideoMotion
              ? 'border-white/20'
              : isCinema
              ? 'border-[#C4B59D]/20'
              : isBali
              ? 'border-[#B88E4B]/35'
              : isRoma
              ? 'border-amber-900/15'
              : 'border-neutral-300/40'
          } ${forceMobile ? 'ml-4 pl-6 max-w-sm mx-auto' : 'ml-4 md:ml-28 pl-8 md:pl-10'}`}
        >
          {stories.map((story, idx) => (
            <div key={story.id} className="relative group">
              {/* Dot marker */}
              <div
                className={`absolute top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                  forceMobile ? '-left-[31px]' : '-left-[39px] md:-left-[47px]'
                } ${
                  isVideoMotion
                    ? 'border-[#E5C378] bg-black/80 shadow-[0_0_8px_rgba(229,195,120,0.5)]'
                    : isCinema
                    ? 'border-[#C4B59D] bg-[#0A0A0A]'
                    : isBali
                    ? 'border-[#8C4830] bg-[#F7F4EE]'
                    : isRoma
                    ? 'border-[#C85A32] bg-[#FAF6EE]'
                    : isDark
                    ? 'border-neutral-500 bg-[#0C0C0C]'
                    : 'border-neutral-600 bg-[#F8F7F3]'
                }`}
              />

              {/* Year / Date */}
              <span
                className={`text-[10px] uppercase tracking-widest block font-medium ${
                  isVideoMotion
                    ? 'text-[#E5C378]'
                    : isCinema
                    ? 'text-[#C4B59D]'
                    : isRoma
                    ? 'text-[#C85A32]'
                    : isModern
                    ? 'font-mono text-neutral-400'
                    : 'text-neutral-400'
                }`}
              >
                {story.yearOrDate}
              </span>

              <h3 className={`font-serif text-xl sm:text-2xl tracking-wide uppercase mt-1 leading-snug ${
                isVideoMotion ? 'text-white drop-shadow-sm' : ''
              }`}>
                {story.title}
              </h3>

              <p className={`text-xs sm:text-sm leading-relaxed mt-2.5 font-light max-w-lg ${
                isVideoMotion ? 'text-white/90 opacity-100' : 'opacity-70'
              }`}>
                {story.story}
              </p>

              {story.photoUrl && story.photoUrl.trim() !== '' && (
                <div
                  className={`mt-4 ${
                    isRoma
                      ? 'p-2.5 pb-4 bg-white shadow-md border border-amber-900/10 inline-block transform rotate-[-1deg]'
                      : isRomantic
                      ? 'p-2 bg-neutral-900 shadow-md border border-neutral-800 text-white inline-block'
                      : 'w-full sm:w-56 h-40 overflow-hidden border border-neutral-200/40'
                  }`}
                >
                  <div className="w-48 sm:w-56 h-36 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={story.photoUrl}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {isRoma && (
                    <p className="mt-2 text-center font-serif italic text-[11px] text-[#2E221D]">
                      {story.title}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
