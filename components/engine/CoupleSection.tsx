'use client';

import React from 'react';
import { CoupleProfile, TemplateArchetype } from '@/types';
import { getTemplateById } from '@/lib/store';
import {
  BalineseGapuraIcon,
  BalineseKoriAgungCrest,
  BalinesePatraCorner,
  BalineseOrnamentalDivider,
} from '@/components/ui/BalineseOrnaments';

interface CoupleSectionProps {
  couple: CoupleProfile;
  openingQuote?: string;
  holyVerse?: string;
  isDark?: boolean;
  forceMobile?: boolean;
  templateId?: string;
  archetype?: TemplateArchetype;
  isVideoMotion?: boolean;
}

export function CoupleSection({
  couple,
  openingQuote,
  holyVerse,
  isDark: propIsDark,
  forceMobile = false,
  templateId,
  archetype: propArchetype,
  isVideoMotion: propIsVideoMotion,
}: CoupleSectionProps) {
  const template = templateId ? getTemplateById(templateId) : null;
  const archetype = propArchetype || template?.archetype || 'editorial-garden';
  const isDark = propIsDark ?? template?.theme.isDark ?? false;
  const isVideoMotion = Boolean(propIsVideoMotion || template?.archetype === 'cinematic-motion');

  const isGarden = archetype === 'editorial-garden';
  const isModern = archetype === 'modern-minimal';
  const isCinema = archetype === 'dark-luxury-cinema';
  const isRomantic = archetype === 'romantic-cinema';
  const isZen = archetype === 'japanese-minimal';
  const isRoma = archetype === 'mediterranean-summer';
  const isBali = archetype === 'balinese-heritage';
  const isMotion = archetype === 'cinematic-motion';

  // Customizable Photo Badge Labels:
  // If undefined, fallback to 'Sang Purusha' / 'Sang Pradana' for Balinese archetype.
  // If user sets empty string "" (cleared/deleted/hidden), it will NOT render anything.
  const groomBadge = couple.groomLabelBadge !== undefined
    ? couple.groomLabelBadge
    : (isBali ? 'Sang Purusha' : '');

  const brideBadge = couple.brideLabelBadge !== undefined
    ? couple.brideLabelBadge
    : (isBali ? 'Sang Pradana' : '');

  const groomPhotoUrl =
    couple.groomPhotoUrl && couple.groomPhotoUrl.trim() !== ''
      ? couple.groomPhotoUrl
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800';

  const bridePhotoUrl =
    couple.bridePhotoUrl && couple.bridePhotoUrl.trim() !== ''
      ? couple.bridePhotoUrl
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800';

  return (
    <section
      id="section-couple"
      className={`transition-colors duration-500 overflow-hidden ${
        isVideoMotion
          ? forceMobile ? 'pt-8 pb-14 px-3 bg-transparent text-[#FAF8F5]' : 'pt-12 sm:pt-16 pb-20 sm:pb-24 px-4 sm:px-6 bg-transparent text-[#FAF8F5]'
          : isBali
          ? forceMobile ? 'pt-8 pb-14 px-3 bg-[#F7F4EE] text-[#24201D]' : 'pt-12 sm:pt-16 pb-20 sm:pb-24 px-4 sm:px-6 bg-[#F7F4EE] text-[#24201D]'
          : isCinema
          ? 'py-16 sm:py-24 px-6 bg-[#0A0A0A] text-[#F5F3EF]'
          : isRoma
          ? 'py-16 sm:py-24 px-6 bg-[#FAF6EE] text-[#2E221D]'
          : isRomantic
          ? 'py-16 sm:py-24 px-6 bg-[#FAF7F2] text-[#3D342E]'
          : isZen
          ? 'py-16 sm:py-24 px-6 bg-[#F6F4F0] text-[#232220]'
          : isDark
          ? 'py-16 sm:py-24 px-6 bg-[#121212] text-[#F5F3EF]'
          : 'py-16 sm:py-24 px-6 bg-white text-[#111111]'
      }`}
    >
      <div className={`max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto text-center ${forceMobile ? 'px-1' : 'px-4 sm:px-6 md:px-8'}`}>
        {/* Holy Verse / Quote with distinct archetype aesthetic */}
        {holyVerse && (
          <div className={`${forceMobile ? 'mb-6 max-w-xs' : 'mb-10 md:mb-14 max-w-xl md:max-w-2xl lg:max-w-3xl'} mx-auto px-2`}>
            <p
              className={`font-serif italic leading-relaxed font-light ${
                forceMobile ? 'text-xs sm:text-sm' : 'text-sm sm:text-base md:text-lg lg:text-xl'
              } ${
                isVideoMotion
                  ? 'text-white/95 drop-shadow-sm'
                  : isCinema
                  ? 'text-[#C4B59D]/90'
                  : isBali
                  ? 'text-[#8C4830]'
                  : isRoma
                  ? 'text-[#C85A32]'
                  : isGarden
                  ? 'text-[#4A5340]'
                  : isZen
                  ? 'text-neutral-600'
                  : 'text-neutral-500'
              }`}
            >
              &ldquo;{holyVerse}&rdquo;
            </p>
            {openingQuote && (
              <p
                className={`text-[9px] sm:text-[10px] uppercase tracking-widest mt-3 ${
                  isVideoMotion
                    ? 'text-[#E5C378] font-medium drop-shadow-xs'
                    : isCinema ? 'text-neutral-500' : isBali ? 'text-[#8C4830]/80' : 'text-neutral-400'
                }`}
              >
                — {openingQuote}
              </p>
            )}
            <div
              className={`w-10 h-[1px] mx-auto mt-4 ${
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
                  : 'bg-neutral-200'
              }`}
            />
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ARCHETYPE HEADERS */}
        {/* ------------------------------------------------------------- */}
        <div className={forceMobile ? 'mb-6' : 'mb-10 md:mb-14'}>
          {isBali && (
            <div className="flex flex-col items-center">
              <BalineseGapuraIcon className={`w-8 sm:w-10 h-7 sm:h-8 mb-1.5 ${isVideoMotion ? 'text-[#E5C378]' : 'text-[#B88E4B]'}`} />
              <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border mb-2 ${
                isVideoMotion
                  ? 'bg-black/40 border-[#E5C378]/50 text-[#E5C378]'
                  : 'bg-[#B88E4B]/15 border-[#B88E4B]/35 text-[#8C4830]'
              }`}>
                <span className="text-[7px] sm:text-[8px]">✦</span>
                <span className="text-[7.5px] sm:text-[8.5px] uppercase tracking-[0.15em] sm:tracking-[0.18em] font-medium">
                  PURUSHA &amp; PRADANA · PAWIWAHAN
                </span>
                <span className="text-[7px] sm:text-[8px]">✦</span>
              </div>
              <h2 className={`font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-widest mt-0.5 font-normal uppercase text-center ${
                isVideoMotion ? 'text-white drop-shadow-md' : 'text-[#24201D]'
              }`}>
                Sang Marabian
              </h2>
              <BalineseOrnamentalDivider className={`w-32 sm:w-44 h-3.5 my-1.5 ${isVideoMotion ? 'text-[#E5C378]' : 'text-[#B88E4B]'}`} />
            </div>
          )}

          {isMotion && (
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-[#D4AF37]/50 text-[#D4AF37] mb-2 shadow-xs">
                <span className="text-[7.5px] sm:text-[9px] uppercase tracking-[0.25em] font-medium font-sans">
                  ✦ THE COUPLE · LES MARIÉS ✦
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase text-white drop-shadow-md">
                {couple.groomNickname} <span className="italic font-light text-[#D4AF37]">&amp;</span> {couple.brideNickname}
              </h2>
            </div>
          )}

          {isGarden && (
            <div>
              <p className={`text-[10px] md:text-xs uppercase tracking-ultra font-medium ${
                isVideoMotion ? 'text-[#E5C378]' : 'text-[#4A5340]'
              }`}>
                LES MARIÉS · EDITORIAL GARDEN
              </p>
              <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider mt-2 ${
                isVideoMotion ? 'text-white drop-shadow-md' : ''
              }`}>
                Mempelai
              </h2>
            </div>
          )}

          {isModern && (
            <div>
              <p className={`text-[9px] md:text-xs uppercase tracking-[0.3em] font-mono ${
                isVideoMotion ? 'text-[#E5C378]' : 'text-neutral-400'
              }`}>
                01 / THE PROTAGONISTS
              </p>
              <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight mt-2 font-medium ${
                isVideoMotion ? 'text-white drop-shadow-md' : ''
              }`}>
                {couple.groomNickname} &amp; {couple.brideNickname}
              </h2>
            </div>
          )}

          {isCinema && (
            <div>
              <p className="text-[10px] md:text-xs uppercase tracking-ultra text-[#C4B59D] font-medium">
                CHAPTER I · THE CASTING
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-widest text-white mt-2">
                {couple.groomNickname} &amp; {couple.brideNickname}
              </h2>
            </div>
          )}

          {isRomantic && (
            <div>
              <p className={`text-[10px] md:text-xs uppercase tracking-ultra font-medium ${
                isVideoMotion ? 'text-[#E5C378]' : 'text-[#9B8070]'
              }`}>
                CHAPTER OF TWO HEARTS
              </p>
              <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide mt-2 italic ${
                isVideoMotion ? 'text-white drop-shadow-md' : 'text-[#3D342E]'
              }`}>
                Dua Jiwa, Satu Cerita
              </h2>
            </div>
          )}

          {isZen && (
            <div className="text-center sm:text-left sm:pl-4 max-w-2xl mx-auto">
              <span className={`text-[9px] md:text-xs uppercase tracking-ultra ${
                isVideoMotion ? 'text-[#E5C378]' : 'text-neutral-400'
              }`}>
                静かな契り · THE QUIET UNION
              </span>
              <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide mt-1.5 ${
                isVideoMotion ? 'text-white drop-shadow-md' : 'text-neutral-800'
              }`}>
                {couple.groomNickname} &amp; {couple.brideNickname}
              </h2>
            </div>
          )}

          {isRoma && (
            <div>
              <p className={`text-[10px] md:text-xs uppercase tracking-ultra font-semibold ${
                isVideoMotion ? 'text-[#E5C378]' : 'text-[#C85A32]'
              }`}>
                GLI SPOSI · POSITANO
              </p>
              <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider mt-2 ${
                isVideoMotion ? 'text-white drop-shadow-md' : 'text-[#2E221D]'
              }`}>
                {couple.groomNickname} &amp; {couple.brideNickname}
              </h2>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ARCHETYPE CARDS */}
        {/* ------------------------------------------------------------- */}
        {isMotion ? (
          /* ------------------------------------------------------------- */
          /* ARCHETYPE 7: CINEMATIC MOTION ROMANCE (Élodie Ambient Gold)   */
          /* ------------------------------------------------------------- */
          <div
            className={
              forceMobile
                ? 'space-y-10 max-w-[280px] mx-auto mt-4'
                : 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-start mt-8 md:mt-12'
            }
          >
            {/* Groom Card */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-full max-w-[240px] sm:max-w-[270px] md:max-w-[320px] aspect-[3/4] p-2 sm:p-2.5 bg-black/40 backdrop-blur-md border border-[#D4AF37]/40 shadow-2xl rounded-xs">
                <div className="w-full h-full overflow-hidden relative rounded-xs border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={groomPhotoUrl}
                    alt={couple.groomName}
                    className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.92] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5">
                <span className="text-xs text-[#D4AF37]">✦</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium font-sans">
                  MEMPELAI PRIA
                </span>
                <span className="text-xs text-[#D4AF37]">✦</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl tracking-wide uppercase leading-snug text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] mt-1.5">
                {couple.groomName}
              </h3>

              <div className="mt-2 space-y-0.5">
                <p className="font-serif italic text-xs md:text-sm text-[#D4AF37]">Putra dari</p>
                <p className="text-xs md:text-sm tracking-wider font-light text-white/90 drop-shadow-xs">
                  {couple.groomFather} &amp; {couple.groomMother}
                </p>
              </div>

              {couple.groomBio && (
                <p className="text-xs md:text-sm leading-relaxed mt-2.5 max-w-xs md:max-w-sm font-light text-neutral-200 drop-shadow-xs">
                  {couple.groomBio}
                </p>
              )}

              {couple.groomInstagram && (
                <a
                  href={`https://instagram.com/${couple.groomInstagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs mt-3 font-medium transition-colors text-[#D4AF37] hover:text-white drop-shadow-xs"
                >
                  <span>{couple.groomInstagram}</span>
                </a>
              )}
            </div>

            {/* Bride Card */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-full max-w-[240px] sm:max-w-[270px] md:max-w-[320px] aspect-[3/4] p-2 sm:p-2.5 bg-black/40 backdrop-blur-md border border-[#D4AF37]/40 shadow-2xl rounded-xs">
                <div className="w-full h-full overflow-hidden relative rounded-xs border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bridePhotoUrl}
                    alt={couple.brideName}
                    className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.92] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5">
                <span className="text-xs text-[#D4AF37]">✦</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium font-sans">
                  MEMPELAI WANITA
                </span>
                <span className="text-xs text-[#D4AF37]">✦</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl tracking-wide uppercase leading-snug text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] mt-1.5">
                {couple.brideName}
              </h3>

              <div className="mt-2 space-y-0.5">
                <p className="font-serif italic text-xs md:text-sm text-[#D4AF37]">Putri dari</p>
                <p className="text-xs md:text-sm tracking-wider font-light text-white/90 drop-shadow-xs">
                  {couple.brideFather} &amp; {couple.brideMother}
                </p>
              </div>

              {couple.brideBio && (
                <p className="text-xs md:text-sm leading-relaxed mt-2.5 max-w-xs md:max-w-sm font-light text-neutral-200 drop-shadow-xs">
                  {couple.brideBio}
                </p>
              )}

              {couple.brideInstagram && (
                <a
                  href={`https://instagram.com/${couple.brideInstagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs mt-3 font-medium transition-colors text-[#D4AF37] hover:text-white drop-shadow-xs"
                >
                  <span>{couple.brideInstagram}</span>
                </a>
              )}
            </div>
          </div>
        ) : isBali ? (
          <div
            className={
              forceMobile
                ? 'space-y-10 max-w-[280px] mx-auto mt-4'
                : 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-start mt-8 md:mt-12'
            }
          >
            {/* Sang Purusha (Groom) */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-full max-w-[240px] sm:max-w-[270px] md:max-w-[320px] aspect-[3/4] p-3 md:p-4 bg-white border-2 border-[#B88E4B]/40 shadow-xl md:shadow-2xl rounded-xs">
                {/* Balinese Patra Corner Flourishes */}
                <BalinesePatraCorner className="absolute -top-1.5 -left-1.5 w-5 h-5 text-[#B88E4B]" />
                <BalinesePatraCorner className="absolute -top-1.5 -right-1.5 w-5 h-5 text-[#B88E4B] -scale-x-100" />
                <BalinesePatraCorner className="absolute -bottom-1.5 -left-1.5 w-5 h-5 text-[#B88E4B] -scale-y-100" />
                <BalinesePatraCorner className="absolute -bottom-1.5 -right-1.5 w-5 h-5 text-[#B88E4B] rotate-180" />

                <div className="w-full h-full overflow-hidden relative rounded-xs border border-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={groomPhotoUrl}
                    alt={couple.groomName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  {groomBadge && groomBadge.trim() !== '' && (
                    <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none z-10">
                      <span className="inline-block px-3 py-1 bg-black/50 backdrop-blur-xs border border-[#B88E4B]/60 rounded-full text-[10px] uppercase tracking-widest text-[#F7F4EE] font-medium font-sans shadow-sm">
                        {groomBadge}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5">
                <span className={`text-xs ${isVideoMotion ? 'text-[#E5C378]' : 'text-[#B88E4B]'}`}>✦</span>
                <span className={`text-[10px] uppercase tracking-[0.25em] font-medium ${
                  isVideoMotion ? 'text-[#E5C378] drop-shadow-sm' : 'text-[#8C4830]'
                }`}>MEMPELAI PRIA</span>
                <span className={`text-xs ${isVideoMotion ? 'text-[#E5C378]' : 'text-[#B88E4B]'}`}>✦</span>
              </div>

              <h3 className={`font-serif text-xl sm:text-2xl md:text-3xl tracking-wide uppercase leading-snug mt-1.5 ${
                isVideoMotion ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]' : 'text-[#24201D]'
              }`}>
                {couple.groomName}
              </h3>

              <div className="mt-2 space-y-0.5">
                <p className={`font-serif italic text-xs md:text-sm font-medium ${
                  isVideoMotion ? 'text-[#E5C378]' : 'text-[#8C4830]'
                }`}>Putra dari</p>
                <p className={`text-xs md:text-sm tracking-wider font-light ${
                  isVideoMotion ? 'text-white/90 drop-shadow-xs' : 'text-neutral-600'
                }`}>
                  {couple.groomFather} &amp; {couple.groomMother}
                </p>
              </div>

              {couple.groomBio && (
                <p className={`text-xs md:text-sm leading-relaxed mt-3 max-w-xs md:max-w-sm font-light ${
                  isVideoMotion ? 'text-neutral-200 drop-shadow-xs' : 'text-neutral-600'
                }`}>
                  {couple.groomBio}
                </p>
              )}

              {couple.groomInstagram && (
                <a
                  href={`https://instagram.com/${couple.groomInstagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs mt-3 font-medium transition-colors ${
                    isVideoMotion ? 'text-[#E5C378] hover:text-white drop-shadow-xs' : 'text-[#8C4830] hover:text-[#723722]'
                  }`}
                >
                  <span>{couple.groomInstagram}</span>
                </a>
              )}
            </div>

            {/* Sang Pradana (Bride) */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-full max-w-[240px] sm:max-w-[270px] md:max-w-[320px] aspect-[3/4] p-3 md:p-4 bg-white border-2 border-[#B88E4B]/40 shadow-xl md:shadow-2xl rounded-xs">
                {/* Balinese Patra Corner Flourishes */}
                <BalinesePatraCorner className="absolute -top-1.5 -left-1.5 w-5 h-5 text-[#B88E4B]" />
                <BalinesePatraCorner className="absolute -top-1.5 -right-1.5 w-5 h-5 text-[#B88E4B] -scale-x-100" />
                <BalinesePatraCorner className="absolute -bottom-1.5 -left-1.5 w-5 h-5 text-[#B88E4B] -scale-y-100" />
                <BalinesePatraCorner className="absolute -bottom-1.5 -right-1.5 w-5 h-5 text-[#B88E4B] rotate-180" />

                <div className="w-full h-full overflow-hidden relative rounded-xs border border-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bridePhotoUrl}
                    alt={couple.brideName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  {brideBadge && brideBadge.trim() !== '' && (
                    <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none z-10">
                      <span className="inline-block px-3 py-1 bg-black/50 backdrop-blur-xs border border-[#B88E4B]/60 rounded-full text-[10px] uppercase tracking-widest text-[#F7F4EE] font-medium font-sans shadow-sm">
                        {brideBadge}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5">
                <span className={`text-xs ${isVideoMotion ? 'text-[#E5C378]' : 'text-[#B88E4B]'}`}>✦</span>
                <span className={`text-[10px] uppercase tracking-[0.25em] font-medium ${
                  isVideoMotion ? 'text-[#E5C378] drop-shadow-sm' : 'text-[#8C4830]'
                }`}>MEMPELAI WANITA</span>
                <span className={`text-xs ${isVideoMotion ? 'text-[#E5C378]' : 'text-[#B88E4B]'}`}>✦</span>
              </div>

              <h3 className={`font-serif text-xl sm:text-2xl md:text-3xl tracking-wide uppercase leading-snug mt-1.5 ${
                isVideoMotion ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]' : 'text-[#24201D]'
              }`}>
                {couple.brideName}
              </h3>

              <div className="mt-2 space-y-0.5">
                <p className={`font-serif italic text-xs md:text-sm font-medium ${
                  isVideoMotion ? 'text-[#E5C378]' : 'text-[#8C4830]'
                }`}>Putri dari</p>
                <p className={`text-xs md:text-sm tracking-wider font-light ${
                  isVideoMotion ? 'text-white/90 drop-shadow-xs' : 'text-neutral-600'
                }`}>
                  {couple.brideFather} &amp; {couple.brideMother}
                </p>
              </div>

              {couple.brideBio && (
                <p className={`text-xs md:text-sm leading-relaxed mt-3 max-w-xs md:max-w-sm font-light ${
                  isVideoMotion ? 'text-neutral-200 drop-shadow-xs' : 'text-neutral-600'
                }`}>
                  {couple.brideBio}
                </p>
              )}

              {couple.brideInstagram && (
                <a
                  href={`https://instagram.com/${couple.brideInstagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs mt-3 font-medium transition-colors ${
                    isVideoMotion ? 'text-[#E5C378] hover:text-white drop-shadow-xs' : 'text-[#8C4830] hover:text-[#723722]'
                  }`}
                >
                  <span>{couple.brideInstagram}</span>
                </a>
              )}
            </div>
          </div>
        ) : isRoma ? (
          <div
            className={
              forceMobile
                ? 'space-y-10 max-w-[280px] mx-auto'
                : 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-start mt-8 md:mt-12'
            }
          >
            {/* Groom Polaroid */}
            <div className="flex flex-col items-center group">
              <div className="bg-white p-3.5 pb-6 md:p-5 md:pb-8 shadow-xl border border-amber-900/10 transform rotate-[-2deg] transition-transform duration-500 hover:rotate-0 hover:scale-105 relative w-64 sm:w-72 md:w-80 lg:w-88">
                {/* Washi tape accent */}
                <div className="w-12 md:w-14 h-3.5 md:h-4 bg-amber-100/80 border border-amber-200/60 mx-auto -mt-5 mb-2 rotate-[-1deg] shadow-2xs" />
                <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={groomPhotoUrl}
                    alt={couple.groomName}
                    className="w-full h-full object-cover filter contrast-[1.05]"
                  />
                </div>
                <p className="mt-3 font-serif italic text-xs md:text-sm text-[#C85A32] text-center uppercase tracking-widest font-sans font-medium">
                  IL SPOSO · MEMPELAI PRIA
                </p>
              </div>

              <h3 className={`font-serif text-xl sm:text-2xl md:text-3xl tracking-wide uppercase mt-3.5 ${
                isVideoMotion ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]' : 'text-[#2E221D]'
              }`}>
                {couple.groomName}
              </h3>
              <p className={`text-xs md:text-sm font-serif italic mt-1 ${
                isVideoMotion ? 'text-[#E5C378]' : 'text-[#C85A32]'
              }`}>Figlio di</p>
              <p className={`text-xs md:text-sm font-light mt-0.5 ${
                isVideoMotion ? 'text-white/90 drop-shadow-xs' : 'text-neutral-600'
              }`}>
                {couple.groomFather} &amp; {couple.groomMother}
              </p>
              {couple.groomBio && (
                <p className={`text-xs md:text-sm leading-relaxed mt-3 max-w-xs md:max-w-sm font-light ${
                  isVideoMotion ? 'text-neutral-200 drop-shadow-xs' : 'text-neutral-500'
                }`}>
                  {couple.groomBio}
                </p>
              )}
            </div>

            {/* Bride Polaroid */}
            <div className="flex flex-col items-center group">
              <div className="bg-white p-3.5 pb-6 md:p-5 md:pb-8 shadow-xl border border-amber-900/10 transform rotate-[2deg] transition-transform duration-500 hover:rotate-0 hover:scale-105 relative w-64 sm:w-72 md:w-80 lg:w-88">
                {/* Washi tape accent */}
                <div className="w-12 md:w-14 h-3.5 md:h-4 bg-amber-100/80 border border-amber-200/60 mx-auto -mt-5 mb-2 rotate-[1.5deg] shadow-2xs" />
                <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bridePhotoUrl}
                    alt={couple.brideName}
                    className="w-full h-full object-cover filter contrast-[1.05]"
                  />
                </div>
                <p className="mt-3 font-serif italic text-xs md:text-sm text-[#C85A32] text-center uppercase tracking-widest font-sans font-medium">
                  LA SPOSA · MEMPELAI WANITA
                </p>
              </div>

              <h3 className={`font-serif text-xl sm:text-2xl md:text-3xl tracking-wide uppercase mt-3.5 ${
                isVideoMotion ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]' : 'text-[#2E221D]'
              }`}>
                {couple.brideName}
              </h3>
              <p className={`text-xs md:text-sm font-serif italic mt-1 ${
                isVideoMotion ? 'text-[#E5C378]' : 'text-[#C85A32]'
              }`}>Figlia di</p>
              <p className={`text-xs md:text-sm font-light mt-0.5 ${
                isVideoMotion ? 'text-white/90 drop-shadow-xs' : 'text-neutral-600'
              }`}>
                {couple.brideFather} &amp; {couple.brideMother}
              </p>
              {couple.brideBio && (
                <p className={`text-xs md:text-sm leading-relaxed mt-3 max-w-xs md:max-w-sm font-light ${
                  isVideoMotion ? 'text-neutral-200 drop-shadow-xs' : 'text-neutral-500'
                }`}>
                  {couple.brideBio}
                </p>
              )}
            </div>
          </div>
        ) : isZen ? (
          /* ------------------------------------------------------------- */
          /* ARCHETYPE 2: JAPANESE MINIMAL (Sora Zen Whitespace Layout)   */
          /* ------------------------------------------------------------- */
          <div
            className={
              forceMobile
                ? 'space-y-10 max-w-[280px] mx-auto'
                : 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-start mt-8 md:mt-12'
            }
          >
            {/* Kenji Groom */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-full max-w-[240px] sm:max-w-[270px] md:max-w-[320px] aspect-[3/4] overflow-hidden bg-stone-100 shadow-sm md:shadow-md border border-stone-300/40 rounded-xs">
                {/* Kanji stamp in corner */}
                <div className="absolute top-3 right-3 text-[11px] md:text-xs font-serif writing-vertical text-stone-500/70 z-10 select-none">
                  新郎
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={groomPhotoUrl}
                  alt={couple.groomName}
                  className="w-full h-full object-cover filter contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="mt-4 space-y-1">
                <span className={`text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-sans font-medium ${
                  isVideoMotion ? 'text-[#E5C378]' : 'text-neutral-500'
                }`}>
                  THE GROOM · 新郎
                </span>
                <h3 className={`font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide mt-1 ${
                  isVideoMotion ? 'text-white drop-shadow-md' : 'text-neutral-800'
                }`}>
                  {couple.groomName}
                </h3>
                <p className={`text-xs md:text-sm font-light pt-1 ${
                  isVideoMotion ? 'text-[#E5C378]' : 'text-neutral-500'
                }`}>
                  Son of {couple.groomFather} &amp; {couple.groomMother}
                </p>
                {couple.groomBio && (
                  <p className={`text-xs md:text-sm leading-relaxed font-light max-w-xs md:max-w-sm mx-auto pt-2 ${
                    isVideoMotion ? 'text-neutral-200 drop-shadow-xs' : 'text-neutral-500'
                  }`}>
                    {couple.groomBio}
                  </p>
                )}
              </div>
            </div>

            {/* Hana Bride */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-full max-w-[240px] sm:max-w-[270px] md:max-w-[320px] aspect-[3/4] overflow-hidden bg-stone-100 shadow-sm md:shadow-md border border-stone-300/40 rounded-xs">
                {/* Kanji stamp in corner */}
                <div className="absolute top-3 right-3 text-[11px] md:text-xs font-serif writing-vertical text-stone-500/70 z-10 select-none">
                  新婦
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bridePhotoUrl}
                  alt={couple.brideName}
                  className="w-full h-full object-cover filter contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="mt-4 space-y-1">
                <span className={`text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-sans font-medium ${
                  isVideoMotion ? 'text-[#E5C378]' : 'text-neutral-500'
                }`}>
                  THE BRIDE · 新婦
                </span>
                <h3 className={`font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide mt-1 ${
                  isVideoMotion ? 'text-white drop-shadow-md' : 'text-neutral-800'
                }`}>
                  {couple.brideName}
                </h3>
                <p className={`text-xs md:text-sm font-light pt-1 ${
                  isVideoMotion ? 'text-[#E5C378]' : 'text-neutral-500'
                }`}>
                  Daughter of {couple.brideFather} &amp; {couple.brideMother}
                </p>
                {couple.brideBio && (
                  <p className={`text-xs md:text-sm leading-relaxed font-light max-w-xs md:max-w-sm mx-auto pt-2 ${
                    isVideoMotion ? 'text-neutral-200 drop-shadow-xs' : 'text-neutral-500'
                  }`}>
                    {couple.brideBio}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : isRomantic ? (
          /* ------------------------------------------------------------- */
          /* ARCHETYPE 3: ROMANTIC CINEMA (Clara 35mm Contact Sheet)      */
          /* ------------------------------------------------------------- */
          <div
            className={
              forceMobile
                ? 'space-y-10 max-w-[280px] mx-auto'
                : 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-start mt-8 md:mt-12'
            }
          >
            {/* Groom 35mm frame */}
            <div className="flex flex-col items-center group">
              <div className="bg-neutral-900 p-3 pb-4 md:p-4 md:pb-6 shadow-xl md:shadow-2xl border border-neutral-800 text-white w-64 sm:w-72 md:w-80 lg:w-88 rounded-xs">
                <div className="flex justify-between text-[8px] md:text-[9px] font-mono text-neutral-400 mb-1.5">
                  <span>KODAK PORTRA 400</span>
                  <span>[01A] ▶</span>
                </div>
                <div className="aspect-[4/5] overflow-hidden bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={groomPhotoUrl}
                    alt={couple.groomName}
                    className="w-full h-full object-cover filter sepia-[0.1] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2.5 text-center text-[9px] md:text-[10px] uppercase tracking-widest text-[#D4AF37] font-mono">
                  FRAME 01 · THE GROOM
                </p>
              </div>

              <h3 className={`font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide uppercase mt-3.5 ${
                isVideoMotion ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]' : 'text-[#3D342E]'
              }`}>
                {couple.groomName}
              </h3>
              <p className={`text-xs md:text-sm font-serif italic mt-1 ${
                isVideoMotion ? 'text-[#E5C378]' : 'text-[#9B8070]'
              }`}>Putra tercinta dari</p>
              <p className={`text-xs md:text-sm font-light mt-0.5 ${
                isVideoMotion ? 'text-white/90 drop-shadow-xs' : 'text-neutral-600'
              }`}>
                {couple.groomFather} &amp; {couple.groomMother}
              </p>
              {couple.groomBio && (
                <p className={`text-xs md:text-sm leading-relaxed mt-2.5 max-w-xs md:max-w-sm font-light ${
                  isVideoMotion ? 'text-neutral-200 drop-shadow-xs' : 'text-neutral-500'
                }`}>
                  {couple.groomBio}
                </p>
              )}
            </div>

            {/* Bride 35mm frame */}
            <div className="flex flex-col items-center group">
              <div className="bg-neutral-900 p-3 pb-4 md:p-4 md:pb-6 shadow-xl md:shadow-2xl border border-neutral-800 text-white w-64 sm:w-72 md:w-80 lg:w-88 rounded-xs">
                <div className="flex justify-between text-[8px] md:text-[9px] font-mono text-neutral-400 mb-1.5">
                  <span>KODAK PORTRA 400</span>
                  <span>[02A] ▶</span>
                </div>
                <div className="aspect-[4/5] overflow-hidden bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bridePhotoUrl}
                    alt={couple.brideName}
                    className="w-full h-full object-cover filter sepia-[0.1] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2.5 text-center text-[9px] md:text-[10px] uppercase tracking-widest text-[#D4AF37] font-mono">
                  FRAME 02 · THE BRIDE
                </p>
              </div>

              <h3 className={`font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide uppercase mt-3.5 ${
                isVideoMotion ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]' : 'text-[#3D342E]'
              }`}>
                {couple.brideName}
              </h3>
              <p className={`text-xs md:text-sm font-serif italic mt-1 ${
                isVideoMotion ? 'text-[#E5C378]' : 'text-[#9B8070]'
              }`}>Putri tercinta dari</p>
              <p className={`text-xs md:text-sm font-light mt-0.5 ${
                isVideoMotion ? 'text-white/90 drop-shadow-xs' : 'text-neutral-600'
              }`}>
                {couple.brideFather} &amp; {couple.brideMother}
              </p>
              {couple.brideBio && (
                <p className={`text-xs md:text-sm leading-relaxed mt-2.5 max-w-xs md:max-w-sm font-light ${
                  isVideoMotion ? 'text-neutral-200 drop-shadow-xs' : 'text-neutral-500'
                }`}>
                  {couple.brideBio}
                </p>
              )}
            </div>
          </div>
        ) : isModern ? (
          /* ------------------------------------------------------------- */
          /* ARCHETYPE 4: MODERN MINIMAL (Céline Architectural Layout)    */
          /* ------------------------------------------------------------- */
          <div
            className={
              forceMobile
                ? 'space-y-10 max-w-[280px] mx-auto'
                : 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-start mt-8 md:mt-12'
            }
          >
            {/* Nathan Groom */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-full max-w-[240px] sm:max-w-[270px] md:max-w-[320px] aspect-[3/4] overflow-hidden border-2 border-black bg-white shadow-none">
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white text-[8px] md:text-[9px] font-mono uppercase tracking-widest z-10">
                  GROOM // 01
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={groomPhotoUrl}
                  alt={couple.groomName}
                  className="w-full h-full object-cover filter contrast-[1.1] transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-4 space-y-1">
                <h3 className={`font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight uppercase font-medium ${
                  isVideoMotion ? 'text-white drop-shadow-md' : ''
                }`}>
                  {couple.groomName}
                </h3>
                <p className={`text-[10px] md:text-xs font-mono uppercase tracking-wider pt-1 ${
                  isVideoMotion ? 'text-[#E5C378]' : 'text-neutral-400'
                }`}>
                  SON OF {couple.groomFather} &amp; {couple.groomMother}
                </p>
                {couple.groomBio && (
                  <p className={`text-xs md:text-sm font-light leading-relaxed max-w-xs md:max-w-sm mx-auto pt-2 ${
                    isVideoMotion ? 'text-neutral-200 drop-shadow-xs' : 'text-neutral-600'
                  }`}>
                    {couple.groomBio}
                  </p>
                )}
              </div>
            </div>

            {/* Chloe Bride */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-full max-w-[240px] sm:max-w-[270px] md:max-w-[320px] aspect-[3/4] overflow-hidden border-2 border-black bg-white shadow-none">
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white text-[8px] md:text-[9px] font-mono uppercase tracking-widest z-10">
                  BRIDE // 02
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bridePhotoUrl}
                  alt={couple.brideName}
                  className="w-full h-full object-cover filter contrast-[1.1] transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-4 space-y-1">
                <h3 className={`font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight uppercase font-medium ${
                  isVideoMotion ? 'text-white drop-shadow-md' : ''
                }`}>
                  {couple.brideName}
                </h3>
                <p className={`text-[10px] md:text-xs font-mono uppercase tracking-wider pt-1 ${
                  isVideoMotion ? 'text-[#E5C378]' : 'text-neutral-400'
                }`}>
                  DAUGHTER OF {couple.brideFather} &amp; {couple.brideMother}
                </p>
                {couple.brideBio && (
                  <p className={`text-xs md:text-sm font-light leading-relaxed max-w-xs md:max-w-sm mx-auto pt-2 ${
                    isVideoMotion ? 'text-neutral-200 drop-shadow-xs' : 'text-neutral-600'
                  }`}>
                    {couple.brideBio}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : isCinema ? (
          /* ------------------------------------------------------------- */
          /* ARCHETYPE 5: DARK LUXURY CINEMA (Nocturne Film Call Sheet)   */
          /* ------------------------------------------------------------- */
          <div
            className={
              forceMobile
                ? 'space-y-10 max-w-[280px] mx-auto'
                : 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-start mt-8 md:mt-12'
            }
          >
            {/* Adrian Groom */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-full max-w-[240px] sm:max-w-[270px] md:max-w-[320px] aspect-[3/4] overflow-hidden border border-[#C4B59D]/40 bg-neutral-950 shadow-2xl rounded-xs">
                <div className="absolute top-3 left-3 text-[8px] md:text-[9px] uppercase tracking-ultra text-[#C4B59D] z-10 bg-black/70 px-2 py-0.5">
                  ACT I · THE GROOM
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={groomPhotoUrl}
                  alt={couple.groomName}
                  className="w-full h-full object-cover filter contrast-[1.05] brightness-90 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
              </div>

              <div className="mt-4 space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wider uppercase text-white mt-1">
                  {couple.groomName}
                </h3>
                <p className="text-xs md:text-sm text-[#C4B59D] font-light pt-0.5">
                  Son of {couple.groomFather} &amp; {couple.groomMother}
                </p>
                {couple.groomBio && (
                  <p className="text-xs md:text-sm text-neutral-400 font-light leading-relaxed max-w-xs md:max-w-sm mx-auto pt-2">
                    {couple.groomBio}
                  </p>
                )}
              </div>
            </div>

            {/* Maya Bride */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-full max-w-[240px] sm:max-w-[270px] md:max-w-[320px] aspect-[3/4] overflow-hidden border border-[#C4B59D]/40 bg-neutral-950 shadow-2xl rounded-xs">
                <div className="absolute top-3 left-3 text-[8px] md:text-[9px] uppercase tracking-ultra text-[#C4B59D] z-10 bg-black/70 px-2 py-0.5">
                  ACT II · THE BRIDE
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bridePhotoUrl}
                  alt={couple.brideName}
                  className="w-full h-full object-cover filter contrast-[1.05] brightness-90 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
              </div>

              <div className="mt-4 space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wider uppercase text-white mt-1">
                  {couple.brideName}
                </h3>
                <p className="text-xs md:text-sm text-[#C4B59D] font-light pt-0.5">
                  Daughter of {couple.brideFather} &amp; {couple.brideMother}
                </p>
                {couple.brideBio && (
                  <p className="text-xs md:text-sm text-neutral-400 font-light leading-relaxed max-w-xs md:max-w-sm mx-auto pt-2">
                    {couple.brideBio}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* ARCHETYPE 6: EDITORIAL GARDEN (Aurelia Botanical Magazine)    */
          /* ------------------------------------------------------------- */
          <div
            className={
              forceMobile
                ? 'space-y-10 max-w-[280px] mx-auto'
                : 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-start mt-8 md:mt-12'
            }
          >
            {/* Julian Groom */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-full max-w-[240px] sm:max-w-[270px] md:max-w-[320px] aspect-[3/4] overflow-hidden p-2 md:p-3 bg-white border border-[#4A5340]/25 shadow-lg md:shadow-2xl rounded-xs">
                <div className="w-full h-full overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={groomPhotoUrl}
                    alt={couple.groomName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#4A5340] font-sans font-medium">
                  MEMPELAI PRIA
                </span>
              </div>

              <h3 className={`font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide uppercase leading-snug mt-1.5 ${
                isVideoMotion ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]' : ''
              }`}>
                {couple.groomName}
              </h3>

              <div className="mt-2 space-y-0.5">
                <p className={`font-serif italic text-xs md:text-sm ${
                  isVideoMotion ? 'text-[#E5C378]' : 'text-[#4A5340]'
                }`}>Putra dari</p>
                <p className={`text-xs md:text-sm tracking-wider font-light ${
                  isVideoMotion ? 'text-white/90 drop-shadow-xs' : 'text-neutral-600'
                }`}>
                  {couple.groomFather} &amp; {couple.groomMother}
                </p>
              </div>

              {couple.groomBio && (
                <p className={`text-xs md:text-sm leading-relaxed mt-2.5 max-w-xs md:max-w-sm font-light ${
                  isVideoMotion ? 'text-neutral-200 drop-shadow-xs' : 'text-neutral-500'
                }`}>
                  {couple.groomBio}
                </p>
              )}
            </div>

            {/* Nadia Bride */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-full max-w-[240px] sm:max-w-[270px] md:max-w-[320px] aspect-[3/4] overflow-hidden p-2 md:p-3 bg-white border border-[#4A5340]/25 shadow-lg md:shadow-2xl rounded-xs">
                <div className="w-full h-full overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bridePhotoUrl}
                    alt={couple.brideName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#4A5340] font-sans font-medium">
                  MEMPELAI WANITA
                </span>
              </div>

              <h3 className={`font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide uppercase leading-snug mt-1.5 ${
                isVideoMotion ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]' : ''
              }`}>
                {couple.brideName}
              </h3>

              <div className="mt-2 space-y-0.5">
                <p className={`font-serif italic text-xs md:text-sm ${
                  isVideoMotion ? 'text-[#E5C378]' : 'text-[#4A5340]'
                }`}>Putri dari</p>
                <p className={`text-xs md:text-sm tracking-wider font-light ${
                  isVideoMotion ? 'text-white/90 drop-shadow-xs' : 'text-neutral-600'
                }`}>
                  {couple.brideFather} &amp; {couple.brideMother}
                </p>
              </div>

              {couple.brideBio && (
                <p className={`text-xs md:text-sm leading-relaxed mt-2.5 max-w-xs md:max-w-sm font-light ${
                  isVideoMotion ? 'text-neutral-200 drop-shadow-xs' : 'text-neutral-500'
                }`}>
                  {couple.brideBio}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
