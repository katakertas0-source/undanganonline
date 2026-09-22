'use client';

import React from 'react';
import { ChevronDown, Mail, Film } from 'lucide-react';
import { Invitation } from '@/types';
import { getTemplateById } from '@/lib/store';
import {
  BalineseGapuraIcon,
  BalineseKoriAgungCrest,
  BalineseCandiBentarFrame,
  BalinesePatraCorner,
} from '@/components/ui/BalineseOrnaments';

interface CoverSectionProps {
  invitation: Invitation;
  guestName?: string;
  isDark?: boolean;
  onOpenInvitation: () => void;
  isOpen: boolean;
  forceMobile?: boolean;
}

export function CoverSection({
  invitation,
  guestName,
  isDark: propIsDark,
  onOpenInvitation,
  isOpen,
  forceMobile = false,
}: CoverSectionProps) {
  const couple = invitation.couple;
  const template = getTemplateById(invitation.templateId);
  const archetype = template?.archetype || 'editorial-garden';
  const isDark = propIsDark ?? template?.theme.isDark ?? false;
  const coverImageUrl =
    invitation.coverImageUrl && invitation.coverImageUrl.trim() !== ''
      ? invitation.coverImageUrl
      : template?.coverImageUrl ||
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200';

  // Format date as "24 . 10 . 2026"
  const eventDateObj = new Date(invitation.eventDate);
  const dayStr = String(eventDateObj.getDate()).padStart(2, '0');
  const monthStr = String(eventDateObj.getMonth() + 1).padStart(2, '0');
  const yearStr = eventDateObj.getFullYear();
  const dottedDate = `${dayStr} . ${monthStr} . ${yearStr}`;

  // Month name formatting (e.g. October 24, 2026)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const writtenDate = `${monthNames[eventDateObj.getMonth()]} ${dayStr}, ${yearStr}`;

  // Responsive scaling helpers based on viewport/device mode
  const getPhotoMaxW = (extraSmall = false) => {
    if (forceMobile) {
      return extraSmall ? 'max-w-[195px]' : 'max-w-[280px]';
    }
    if (extraSmall) {
      return 'max-w-[195px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[320px] xl:max-w-[360px]';
    }
    return 'max-w-[280px] sm:max-w-[320px] md:max-w-[420px] lg:max-w-[480px] xl:max-w-[540px]';
  };

  const getTitleSize = () => {
    if (forceMobile) return 'text-3xl sm:text-4xl';
    return 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl';
  };

  const getSectionMinH = () => {
    if (forceMobile) return 'min-h-[720px]';
    return 'min-h-[100dvh] md:min-h-[820px] lg:min-h-[900px]';
  };

  const getSectionPadding = () => {
    if (forceMobile) return 'py-8 px-4';
    return 'py-8 sm:py-10 md:py-14 lg:py-16 px-4 sm:px-6 md:px-8';
  };

  // --------------------------------------------------------------------------
  // ARCHETYPE 1: ROMANTIC CINEMA / CLARA (Arched Window / Kubah Melengkung)
  // --------------------------------------------------------------------------
  if (archetype === 'romantic-cinema') {
    return (
      <section className={`relative ${getSectionMinH()} flex flex-col justify-between items-center ${getSectionPadding()} text-center select-none overflow-hidden bg-[#FAF7F2] text-[#3D342E] transition-all duration-700`}>
        {/* Decorative Top Flourish */}
        <div className="pt-2 flex flex-col items-center shrink-0">
          <div className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.35em] text-[#9B8070] font-medium">
            <span>{invitation.coverTitle || 'THE WEDDING CELEBRATION'}</span>
          </div>
          <h1 className={`font-serif ${getTitleSize()} uppercase tracking-wider text-[#2E241E] mt-2 font-medium`}>
            {couple.groomNickname} &amp; {couple.brideNickname}
          </h1>
          <p className="text-[11px] sm:text-xs md:text-sm tracking-[0.25em] md:tracking-[0.3em] text-[#9B8070] mt-1 font-sans">
            {dottedDate}
          </p>
        </div>

        {/* Distinct Feature: Arched Architectural Window Frame */}
        <div className={`w-full ${getPhotoMaxW()} mx-auto my-4 sm:my-6 md:my-8 transition-all shrink-0`}>
          <div className="relative p-2.5 md:p-3.5 bg-white/90 rounded-t-[140px] md:rounded-t-[190px] lg:rounded-t-[230px] rounded-b-lg md:rounded-b-xl border-2 border-[#D4C3B3]/60 shadow-xl md:shadow-2xl overflow-hidden">
            {/* Inner Double Arch Border */}
            <div className="relative rounded-t-[130px] md:rounded-t-[180px] lg:rounded-t-[220px] rounded-b-md md:rounded-b-lg overflow-hidden aspect-[3/4] border border-[#D4C3B3]/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImageUrl}
                alt={invitation.title}
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D342E]/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Bottom Content & Guest Card */}
        <div className="w-full max-w-sm md:max-w-md lg:max-w-xl mx-auto flex flex-col items-center pb-2 shrink-0">
          <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#7D6B5D] max-w-xs sm:max-w-sm md:max-w-md px-2 line-clamp-2">
            &ldquo;{invitation.openingQuote || template?.demoCouple?.quote || 'Two hearts, one soul, beginning their forever journey.'}&rdquo;
          </p>

          {/* Guest Badge */}
          {guestName && (
            <div className="mt-4 w-full max-w-xs sm:max-w-sm p-3 md:p-4 rounded-md bg-white/80 border border-[#D4C3B3]/70 shadow-xs backdrop-blur-xs">
              <div className="flex items-center justify-center gap-1.5 text-[8.5px] sm:text-[9.5px] uppercase tracking-widest text-[#9B8070]">
                <Mail className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span>KEPADA YTH. BAPAK/IBU/SAUDARA/I</span>
              </div>
              <p className="font-serif text-base sm:text-lg font-medium text-[#2E241E] mt-0.5">
                {guestName}
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-5 sm:mt-6">
            {!isOpen ? (
              <button
                onClick={onOpenInvitation}
                className="group relative inline-flex items-center gap-2.5 px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-full text-xs sm:text-xs md:text-sm font-sans uppercase tracking-widest bg-[#3D342E] text-white hover:bg-[#251F1B] transition-all shadow-md md:shadow-lg"
              >
                <span>Buka Undangan</span>
                <span className="text-sm font-light transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 text-[11px] md:text-xs uppercase tracking-widest text-[#9B8070] animate-bounce">
                <span>Scroll ke bawah</span>
                <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // ARCHETYPE 2: MODERN MINIMAL / CÉLINE (High-Fashion Magazine Editorial)
  // --------------------------------------------------------------------------
  if (archetype === 'modern-minimal') {
    return (
      <section className={`relative ${getSectionMinH()} flex flex-col justify-between items-center ${getSectionPadding()} text-center select-none overflow-hidden bg-[#FAF9F6] text-[#111111] transition-all duration-700`}>
        {/* Magazine Top Running Header */}
        <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl flex justify-between items-center border-b border-black/15 pb-2 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.25em] text-neutral-500 shrink-0">
          <span>SPECIAL ISSUE</span>
          <span className="font-semibold text-black">N° 26</span>
          <span>{writtenDate}</span>
        </div>

        {/* Oversized High-Fashion Title */}
        <div className="py-3 sm:py-4 shrink-0">
          <p className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.35em] text-neutral-400 font-medium">
            {invitation.coverTitle || 'WEDDING INVITATION'}
          </p>
          <h1 className={`font-serif font-light ${getTitleSize()} uppercase tracking-tighter mt-1 text-black`}>
            {couple.groomNickname} <span className="italic font-normal font-serif text-neutral-400">&amp;</span> {couple.brideNickname}
          </h1>
        </div>

        {/* Sharp High-Contrast Framed Photo */}
        <div className={`w-full ${getPhotoMaxW()} mx-auto relative group my-3 md:my-6 shrink-0`}>
          <div className="aspect-[4/5] w-full overflow-hidden border border-black/20 bg-neutral-100 shadow-xl md:shadow-2xl relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImageUrl}
              alt={invitation.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Corner Crop Marks */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/80" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/80" />
          </div>
        </div>

        {/* Bottom Details & Sleek Modern Button */}
        <div className="w-full max-w-sm md:max-w-md lg:max-w-xl mx-auto flex flex-col items-center pt-2 sm:pt-3 pb-2 shrink-0">
          {guestName && (
            <div className="mb-4 w-full max-w-xs sm:max-w-sm p-3 md:p-4 border border-neutral-300 bg-white shadow-xs">
              <span className="block text-[8px] sm:text-[9px] uppercase tracking-widest text-neutral-400">
                INVITED GUEST
              </span>
              <p className="font-sans text-sm sm:text-base font-semibold tracking-wide text-neutral-900 mt-0.5">
                {guestName}
              </p>
            </div>
          )}

          {!isOpen ? (
            <button
              onClick={onOpenInvitation}
              className="group inline-flex items-center gap-3 px-9 sm:px-11 md:px-13 py-3.5 sm:py-4 text-xs sm:text-xs md:text-sm font-sans uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-all shadow-md md:shadow-xl"
            >
              <span>BUKA UNDANGAN</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest text-neutral-400 animate-bounce">
              <span>Scroll down</span>
              <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
          )}
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // ARCHETYPE 3: DARK LUXURY CINEMA / NOCTURNE (Berlin Noir / Movie Call Sheet)
  // --------------------------------------------------------------------------
  if (archetype === 'dark-luxury-cinema') {
    return (
      <section className={`relative ${getSectionMinH()} flex flex-col justify-between items-center ${getSectionPadding()} text-center select-none overflow-hidden bg-[#0A0A0A] text-[#F5F3EF] transition-all duration-700`}>
        {/* Cinema Film Strip Header */}
        <div className="pt-1 flex items-center justify-center gap-2 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.35em] text-[#C4B59D] shrink-0">
          <Film className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#C4B59D]" />
          <span>{invitation.coverTitle || 'SCENE 01 · THE BEGINNING'}</span>
          <Film className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#C4B59D]" />
        </div>

        {/* Dramatic Cinematic Names */}
        <div className="py-2 shrink-0">
          <h1 className={`font-serif font-medium ${getTitleSize()} uppercase tracking-widest text-[#F5F3EF] drop-shadow-md`}>
            {couple.groomNickname} &amp; {couple.brideNickname}
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.3em] text-[#C4B59D] uppercase mt-2 font-mono">
            {dottedDate} · WORLD PREMIERE
          </p>
        </div>

        {/* Cinematic Widescreen/Framed Photo with Warm Vignette */}
        <div className={`w-full ${getPhotoMaxW()} mx-auto my-3 md:my-6 shrink-0`}>
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#C4B59D]/30 shadow-2xl bg-neutral-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImageUrl}
              alt={invitation.title}
              className="w-full h-full object-cover filter contrast-[1.1] brightness-[0.95] transition-transform duration-1000 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
            <div className="absolute bottom-3 left-3 right-3 text-center">
              <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#C4B59D] tracking-wide">
                &ldquo;A night to remember forever.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Call Sheet Metadata & Gold Button */}
        <div className="w-full max-w-sm md:max-w-md lg:max-w-xl mx-auto flex flex-col items-center pb-2 shrink-0">
          {guestName && (
            <div className="mb-4 w-full max-w-xs sm:max-w-sm p-3 md:p-4 rounded-xs bg-neutral-900/90 border border-[#C4B59D]/30 shadow-lg backdrop-blur-md">
              <span className="block text-[8.5px] sm:text-[9.5px] uppercase tracking-widest text-[#C4B59D]/80 font-mono">
                HONORED GUEST
              </span>
              <p className="font-serif text-base sm:text-lg font-medium text-[#F5F3EF] mt-0.5">
                {guestName}
              </p>
            </div>
          )}

          {!isOpen ? (
            <button
              onClick={onOpenInvitation}
              className="group inline-flex items-center gap-2.5 px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 text-xs sm:text-xs md:text-sm uppercase tracking-widest bg-[#C4B59D] text-black font-semibold hover:bg-white transition-all shadow-xl"
            >
              <span>BUKA UNDANGAN</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest text-[#C4B59D] animate-bounce font-mono">
              <span>Scroll to unfold</span>
              <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
          )}
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // ARCHETYPE 4: EDITORIAL GARDEN / AURELIA (Botanical Organic Symmetry)
  // --------------------------------------------------------------------------
  if (archetype === 'editorial-garden') {
    return (
      <section className={`relative ${getSectionMinH()} flex flex-col justify-between items-center ${getSectionPadding()} text-center select-none overflow-hidden bg-[#F8F7F3] text-[#1F1C1D] transition-all duration-700`}>
        {/* Botanical Motif Label */}
        <div className="pt-2 shrink-0">
          <p className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.35em] text-[#4A5340] font-medium">
            {invitation.coverTitle || 'BOTANICAL WEDDING · NO. 01'}
          </p>
          <h1 className={`font-serif font-normal ${getTitleSize()} uppercase tracking-wider text-[#2D3326] mt-1.5`}>
            {couple.groomNickname} <span className="italic font-light text-[#4A5340]">&amp;</span> {couple.brideNickname}
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.2em] md:tracking-[0.25em] text-neutral-500 mt-1 font-sans">
            {dottedDate}
          </p>
        </div>

        {/* Gallery Matte Frame with Sage Trim */}
        <div className={`w-full ${getPhotoMaxW()} mx-auto my-4 sm:my-6 md:my-8 transition-all shrink-0`}>
          <div className="p-2.5 sm:p-3 md:p-4 bg-white border border-[#4A5340]/25 rounded-xs shadow-xl md:shadow-2xl">
            <div className="relative aspect-[3/4] w-full overflow-hidden border border-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImageUrl}
                alt={invitation.title}
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Bottom Quote & Sage Green Button */}
        <div className="w-full max-w-sm md:max-w-md lg:max-w-xl mx-auto flex flex-col items-center pb-2 shrink-0">
          <p className="font-serif italic text-xs sm:text-sm md:text-base text-neutral-600 max-w-xs sm:max-w-sm md:max-w-md px-2 line-clamp-2">
            &ldquo;Two souls in harmony and botanical symmetry.&rdquo;
          </p>

          {guestName && (
            <div className="mt-3.5 mb-2 w-full max-w-xs sm:max-w-sm p-3 md:p-4 rounded-xs bg-white/90 border border-[#4A5340]/20 shadow-xs">
              <span className="block text-[8px] sm:text-[9px] uppercase tracking-widest text-[#4A5340] font-medium">
                KEPADA YTH.
              </span>
              <p className="font-serif text-base sm:text-lg font-medium text-[#2D3326] mt-0.5">
                {guestName}
              </p>
            </div>
          )}

          <div className="mt-4 sm:mt-5">
            {!isOpen ? (
              <button
                onClick={onOpenInvitation}
                className="group inline-flex items-center gap-2.5 px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-full text-xs sm:text-xs md:text-sm uppercase tracking-widest bg-[#4A5340] text-white hover:bg-[#363E2F] transition-all shadow-md md:shadow-lg"
              >
                <span>Buka Undangan</span>
                <span className="text-sm font-light transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest text-[#4A5340] animate-bounce">
                <span>Scroll ke bawah</span>
                <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // ARCHETYPE 5: JAPANESE MINIMAL / SORA (Zen Wabi-Sabi Asymmetry)
  // --------------------------------------------------------------------------
  if (archetype === 'japanese-minimal') {
    return (
      <section className={`relative ${getSectionMinH()} flex flex-col justify-between items-center ${getSectionPadding()} text-center select-none overflow-hidden bg-[#F6F4F0] text-[#232220] transition-all duration-700`}>
        {/* Vertical Kanji Watermark */}
        <div className="absolute top-10 right-6 sm:right-10 pointer-events-none select-none writing-vertical text-neutral-300/40 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.4em]">
          永遠
        </div>

        {/* Minimal Zen Typography */}
        <div className="pt-2 text-center shrink-0">
          <p className="text-[8.5px] sm:text-[9.5px] md:text-xs uppercase tracking-[0.35em] text-neutral-400">
            {invitation.coverTitle || 'SORA · 空 · WEDDING'}
          </p>
          <h1 className={`font-serif font-light ${getTitleSize()} uppercase tracking-widest text-[#232220] mt-1.5`}>
            {couple.groomNickname} &amp; {couple.brideNickname}
          </h1>
          <p className="text-[9.5px] sm:text-xs md:text-sm tracking-[0.25em] text-neutral-500 mt-1 font-mono">
            {dottedDate}
          </p>
        </div>

        {/* Delicate Wabi-Sabi Asymmetrical Photo */}
        <div className={`w-full ${getPhotoMaxW()} mx-auto my-3 md:my-6 shrink-0`}>
          <div className="relative aspect-[3/4] w-full overflow-hidden border border-neutral-300/70 bg-white p-1.5 md:p-2.5 shadow-md md:shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImageUrl}
              alt={invitation.title}
              className="w-full h-full object-cover grayscale-[15%] transition-transform duration-1000 hover:scale-105"
            />
          </div>
        </div>

        {/* Bottom Haiku & Minimal Button */}
        <div className="w-full max-w-sm md:max-w-md lg:max-w-xl mx-auto flex flex-col items-center pb-2 shrink-0">
          <p className="font-serif italic text-xs sm:text-sm md:text-base text-neutral-500">
            &ldquo;A quiet love. A bright future.&rdquo;
          </p>

          {guestName && (
            <div className="mt-3.5 mb-2 w-full max-w-xs sm:max-w-sm p-2.5 md:p-3.5 bg-white/70 border border-neutral-200 shadow-xs">
              <span className="block text-[8px] sm:text-[9px] uppercase tracking-widest text-neutral-400">
                UNDANGAN UNTUK
              </span>
              <p className="font-serif text-sm sm:text-base font-medium text-neutral-800 mt-0.5">
                {guestName}
              </p>
            </div>
          )}

          <div className="mt-4 sm:mt-5">
            {!isOpen ? (
              <button
                onClick={onOpenInvitation}
                className="group inline-flex items-center gap-2.5 px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 border border-neutral-800 text-xs sm:text-xs md:text-sm uppercase tracking-widest text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all shadow-xs"
              >
                <span>Buka Undangan</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest text-neutral-400 animate-bounce">
                <span>Lanjutkan membaca</span>
                <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // ARCHETYPE 7: CINEMATIC MOTION ROMANCE / ÉLODIE (Full-Bleed Ambient Video + Foreground Photo Cover)
  // --------------------------------------------------------------------------
  if (archetype === 'cinematic-motion') {
    return (
      <section className={`relative w-full h-full ${getSectionMinH()} flex flex-col justify-between items-center ${getSectionPadding()} text-center select-none overflow-hidden text-[#F8F6F0] transition-all duration-700`}>
        {/* Subtle Ambient Vignette Overlay for Cover Section */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/35" />

        {/* Top Header: Clean Elegant Celebration Title, Names & Date */}
        <div className="relative z-10 pt-1 flex flex-col items-center shrink-0">
          <div className="text-[8.5px] sm:text-[9.5px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.35em] text-[#D4AF37] font-medium">
            <span>{invitation.coverTitle || 'THE WEDDING CELEBRATION'}</span>
          </div>
          <h1 className={`font-serif font-light ${getTitleSize()} uppercase tracking-wider text-white mt-1.5 drop-shadow-md`}>
            {couple.groomNickname} <span className="italic font-normal text-[#D4AF37]">&amp;</span> {couple.brideNickname}
          </h1>
          <p className="text-[9px] sm:text-xs md:text-sm tracking-[0.25em] text-[#D4AF37] mt-0.5 font-mono uppercase">
            {dottedDate}
          </p>
        </div>

        {/* Centerpiece: Clean Elegant Framed Couple Photo */}
        <div className={`relative z-10 w-full ${getPhotoMaxW(true)} mx-auto my-auto py-2 shrink-0`}>
          <div className="relative p-1.5 md:p-2.5 rounded-xl md:rounded-2xl bg-white/15 backdrop-blur-md border border-white/35 shadow-2xl overflow-hidden group">
            <div className="relative aspect-[3/4] w-full rounded-lg md:rounded-xl overflow-hidden border border-white/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImageUrl}
                alt={invitation.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </div>
          </div>

          <p className="font-serif italic text-[11px] sm:text-xs md:text-sm text-white/90 max-w-[280px] md:max-w-sm mx-auto mt-2.5 px-1 drop-shadow line-clamp-1">
            &ldquo;{invitation.openingQuote || template?.demoCouple?.quote || 'In your eyes, the world slows down into poetry.'}&rdquo;
          </p>
        </div>

        {/* Bottom Content & Interactive CTA */}
        <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center pb-2 shrink-0">
          {guestName && (
            <div className="mb-3 w-full max-w-xs p-2 sm:p-2.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 shadow-lg text-center">
              <span className="block text-[8px] sm:text-[9px] uppercase tracking-widest text-[#D4AF37] font-medium">
                SPECIAL INVITATION FOR
              </span>
              <p className="font-serif text-sm sm:text-base font-normal text-white truncate mt-0.5">
                {guestName}
              </p>
            </div>
          )}

          {!isOpen ? (
            <button
              onClick={onOpenInvitation}
              className="group inline-flex items-center gap-2.5 px-8 sm:px-10 py-3 rounded-full text-xs uppercase tracking-widest bg-[#D4AF37] text-neutral-950 font-semibold hover:bg-[#c49f2e] transition-all shadow-xl active:scale-95 cursor-pointer"
            >
              <span>Buka Undangan</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] animate-bounce font-medium drop-shadow">
              <span>Scroll Ke Bawah</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          )}
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // ARCHETYPE 8: BALINESE SACRED HERITAGE / MAHADEWI (Candi Bentar & Gold Prada)
  // --------------------------------------------------------------------------
  if (archetype === 'balinese-heritage') {
    const hasVideo = Boolean(invitation.coverVideoUrl);
    return (
      <section
        className={`relative ${
          forceMobile ? 'min-h-full pt-14 pb-5 px-4' : getSectionMinH() + ' pt-16 pb-12 px-6'
        } flex flex-col justify-between items-center text-center select-none overflow-hidden ${
          hasVideo ? 'bg-transparent text-white' : 'bg-[#F7F4EE] text-[#24201D]'
        } transition-all duration-700`}
      >
        {/* Background Sacred Ambient Glow / Vignette */}
        {hasVideo ? (
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70 pointer-events-none" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#B88E4B]/15 via-transparent to-transparent pointer-events-none" />
        )}

        {/* 1. SACRED HEADER: Gapura Bali Icon + Om Swastyastu */}
        <div className="shrink-0 relative z-10 flex flex-col items-center">
          <BalineseGapuraIcon className={`w-8 h-8 ${hasVideo ? 'text-[#D4AF37]' : 'text-[#B88E4B]'} mb-1.5`} />
          
          <div className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full ${
            hasVideo
              ? 'bg-black/60 border border-[#D4AF37]/60 text-[#D4AF37]'
              : 'bg-[#B88E4B]/12 border border-[#B88E4B]/35 text-[#8C4830]'
          }`}>
            <span className="text-[7.5px] sm:text-[9px] uppercase tracking-[0.2em] font-medium whitespace-nowrap">
              OM SWASTYASTU · PAWIWAHAN AGUNG
            </span>
          </div>

          <h1
            className={`font-serif font-normal ${
              forceMobile ? 'text-2xl sm:text-3xl mt-1.5' : getTitleSize() + ' mt-2.5'
            } uppercase tracking-wider ${hasVideo ? 'text-white drop-shadow-md' : 'text-[#24201D]'} leading-tight`}
          >
            {couple.groomNickname} <span className={`italic font-light ${hasVideo ? 'text-[#D4AF37]' : 'text-[#8C4830]'}`}>&amp;</span> {couple.brideNickname}
          </h1>
          <p className={`text-[9px] sm:text-xs tracking-[0.22em] ${hasVideo ? 'text-[#D4AF37]' : 'text-[#8C4830]'} font-sans mt-0.5 font-medium`}>
            RAHINA PAWIWAHAN · {dottedDate}
          </p>
        </div>

        {/* 2. CENTERPIECE: SACRED BALINESE ARCHED PORTAL FRAME */}
        <div className="my-2 shrink-0 relative z-10 w-full flex justify-center">
          <BalineseCandiBentarFrame
            gateColor={hasVideo ? "#D4AF37" : "#B88E4B"}
            accentColor={hasVideo ? "#D4AF37" : "#8C4830"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImageUrl}
              alt={invitation.title}
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            />
          </BalineseCandiBentarFrame>
        </div>

        {/* 3. BOTTOM: SACRED SLOKA, RECIPIENT BOX & CTA BUTTON */}
        <div className="w-full max-w-xs sm:max-w-sm mx-auto flex flex-col items-center pb-1 shrink-0 relative z-10">
          <div className="text-center px-2">
            <p className={`font-serif italic text-[11px] sm:text-xs ${hasVideo ? 'text-white/90 drop-shadow' : 'text-[#5C4D44]'} leading-snug`}>
              &ldquo;Ihaiva stam ma vi yaustam&rdquo;
            </p>
            <p className={`text-[8.5px] sm:text-[9.5px] ${hasVideo ? 'text-[#D4AF37]' : 'text-[#8C4830]'} tracking-wider mt-0.5 font-sans`}>
              Semoga senantiasa bersatu dalam cinta abadi
            </p>
          </div>

          {guestName && (
            <div className={`mt-2 w-full max-w-[250px] sm:max-w-[280px] py-1.5 px-3 ${
              hasVideo
                ? 'bg-black/65 backdrop-blur-md border border-[#D4AF37]/50 text-white shadow-lg'
                : 'bg-white/95 border border-[#B88E4B]/40 shadow-xs text-[#24201D]'
            } relative rounded-xs`}>
              <span className={`block text-[7.5px] sm:text-[8px] uppercase tracking-widest ${
                hasVideo ? 'text-[#D4AF37]' : 'text-[#8C4830]'
              } font-medium`}>
                KEPADA YTH. BAPAK/IBU/SAUDARA/I
              </span>
              <p className={`font-serif text-sm sm:text-base font-medium ${
                hasVideo ? 'text-white' : 'text-[#24201D]'
              } truncate mt-0.5`}>
                {guestName}
              </p>
            </div>
          )}

          <div className="mt-2.5">
            {!isOpen ? (
              <button
                onClick={onOpenInvitation}
                className={`group inline-flex items-center gap-2 px-8 sm:px-9 py-2.5 rounded-full text-[11px] sm:text-xs uppercase tracking-[0.2em] ${
                  hasVideo
                    ? 'bg-gradient-to-r from-[#B88E4B] to-[#D4AF37] text-neutral-950 font-semibold hover:brightness-110 shadow-lg'
                    : 'bg-[#8C4830] text-[#FAF6F0] hover:bg-[#723722] shadow-md'
                } transition-all active:scale-95 cursor-pointer`}
              >
                <span>Buka Undangan</span>
                <span className="text-xs font-light transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            ) : (
              <div className={`inline-flex items-center gap-1.5 text-[9.5px] uppercase tracking-widest ${
                hasVideo ? 'text-[#D4AF37]' : 'text-[#8C4830]'
              } animate-bounce font-medium`}>
                <span>Gulir ke bawah</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // ARCHETYPE 6: MEDITERRANEAN SUMMER / ROMA (Amalfi Postcard Riviera)
  // --------------------------------------------------------------------------
  return (
    <section className={`relative ${getSectionMinH()} flex flex-col justify-between items-center ${getSectionPadding()} text-center select-none overflow-hidden bg-[#FAF6EE] text-[#2E221D] transition-all duration-700`}>
      {/* Italian Postcard Stamp Header */}
      <div className="pt-2 flex items-center justify-center gap-2 shrink-0">
        <span className="px-2.5 sm:px-3 py-0.5 text-[8.5px] sm:text-[9.5px] md:text-xs uppercase tracking-[0.25em] font-medium bg-[#C85A32]/10 text-[#C85A32] border border-[#C85A32]/30 rounded-xs">
          {invitation.coverTitle || 'AMALFI COAST · 2026'}
        </span>
      </div>

      <div className="py-2 shrink-0">
        <h1 className={`font-serif font-medium ${getTitleSize()} uppercase tracking-wider text-[#2E221D]`}>
          {couple.groomNickname} <span className="text-[#C85A32]">&amp;</span> {couple.brideNickname}
        </h1>
        <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.25em] text-[#C85A32] uppercase mt-1 font-serif italic">
          UN AMORE PER SEMPRE · {dottedDate}
        </p>
      </div>

      {/* Postcard Tilt Frame with Terracotta Accent */}
      <div className={`w-full ${getPhotoMaxW()} mx-auto my-3 md:my-6 shrink-0`}>
        <div className="p-2.5 sm:p-3 md:p-4 bg-white border border-[#C85A32]/25 shadow-xl md:shadow-2xl rotate-[-1deg] hover:rotate-0 transition-transform duration-500">
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImageUrl}
              alt={invitation.title}
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Bottom Content & Terracotta Riviera Button */}
      <div className="w-full max-w-sm md:max-w-md lg:max-w-xl mx-auto flex flex-col items-center pb-2 shrink-0">
        <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#8A6756] max-w-xs sm:max-w-sm md:max-w-md px-2 line-clamp-2">
          &ldquo;La vita è bella insieme.&rdquo;
        </p>

        {guestName && (
          <div className="mt-3.5 mb-2 w-full max-w-xs sm:max-w-sm p-3 md:p-4 bg-white border border-[#C85A32]/20 shadow-xs">
            <span className="block text-[8px] sm:text-[9px] uppercase tracking-widest text-[#C85A32] font-medium">
              INVITO SPECIALE PER
            </span>
            <p className="font-serif text-base sm:text-lg font-medium text-[#2E221D] mt-0.5">
              {guestName}
            </p>
          </div>
        )}

        <div className="mt-4 sm:mt-5">
          {!isOpen ? (
            <button
              onClick={onOpenInvitation}
              className="group inline-flex items-center gap-2.5 px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-full text-xs sm:text-xs md:text-sm uppercase tracking-widest bg-[#C85A32] text-white hover:bg-[#A94522] transition-all shadow-md md:shadow-lg"
            >
              <span>Buka Undangan</span>
              <span className="text-sm font-light transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest text-[#C85A32] animate-bounce">
              <span>Scorri verso il basso</span>
              <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
