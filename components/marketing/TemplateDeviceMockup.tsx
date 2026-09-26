'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, ArrowRight, Lock, Check, Film } from 'lucide-react';
import { Template } from '@/types';
import {
  BalineseGapuraIcon,
  BalineseKoriAgungCrest,
  BalineseCandiBentarFrame,
} from '@/components/ui/BalineseOrnaments';
import { BalineseStarOrnament } from '@/components/ui/BalineseStarOrnament';
import {
  JavaneseMentulIcon,
  JavaneseFloralDivider,
  JavaneseGununganSilhouette,
  JavaneseMorningBreezeShadows,
  JavaneseCarvedArchTop,
  JavaneseCarvedArchBottom,
} from '@/components/ui/JavaneseOrnaments';

interface TemplateDeviceMockupProps {
  template: Template;
  isSelectable?: boolean;
  isSelected?: boolean;
  isAllowed?: boolean;
  onSelect?: () => void;
  showActions?: boolean;
}

export function TemplateDeviceMockup({
  template,
  isSelectable = false,
  isSelected = false,
  isAllowed = true,
  onSelect,
  showActions = true,
}: TemplateDeviceMockupProps) {
  const isDark = template.theme.isDark;
  const archetype = template.archetype || 'editorial-garden';

  const demo = template.demoCouple || {
    groomName: 'Julian Pratama',
    groomNickname: 'Julian',
    brideName: 'Nadia Salsabila',
    brideNickname: 'Nadia',
    dateStr: '24 . 10 . 2026',
    quote: 'A love story designed to be remembered.',
    secondaryTitle: 'OUR STORY',
    secondarySubtitle: 'From the beginning to forever',
  };

  const secondaryImage =
    template.mockupSecondaryUrl ||
    template.coverImageUrl;

  // --------------------------------------------------------------------------
  // RENDER PHONE 1 (Front Phone - Authentic Archetype Cover)
  // --------------------------------------------------------------------------
  const renderFrontCover = () => {
    // 0. Cinematic Motion (ÉLODIE) - Living Video Background
    if (archetype === 'cinematic-motion') {
      return (
        <div className="relative px-2.5 sm:px-3 pt-3 sm:pt-3.5 pb-2 sm:pb-3 flex flex-col justify-between h-[calc(100%-24px)] text-center overflow-hidden text-[#F8F6F0]">
          {/* Looping video canvas with reliable poster image fallback */}
          <div className="absolute inset-0 z-0 bg-[#161311]">
            <img
              src={template.coverImageUrl}
              alt={template.name}
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
            />
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={template.coverImageUrl}
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.9] contrast-[1.05]"
            >
              <source src={template.coverVideoUrl || '/videos/elodie-bg.mp4'} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
          </div>

          <div className="relative z-10 pt-0.5">
            <div className="text-[6.5px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium">
              <span>THE WEDDING</span>
            </div>
            <h4 className="font-serif font-light text-xs sm:text-sm uppercase tracking-wider text-white mt-0.5 line-clamp-1 drop-shadow-sm">
              {demo.groomNickname} <span className="italic font-normal text-[#D4AF37]">&amp;</span> {demo.brideNickname}
            </h4>
            <p className="text-[6.5px] sm:text-[7px] tracking-[0.2em] text-[#D4AF37] font-mono mt-0.5">
              {demo.dateStr}
            </p>
          </div>

          {/* Centerpiece: Framed Couple Cover Photo with Glassmorphism */}
          <div className="relative z-10 my-0.5 sm:my-1 mx-auto w-full max-w-[115px] sm:max-w-[135px] p-1 sm:p-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/30 shadow-md">
            <div className="w-full aspect-[3/4] rounded-md overflow-hidden border border-white/20 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={template.coverImageUrl}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>
          </div>

          <div className="relative z-10 space-y-0.5">
            <p className="font-serif italic text-[6.5px] sm:text-[7.5px] text-white/90 line-clamp-1 px-1">
              &ldquo;{demo.quote}&rdquo;
            </p>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center gap-1 px-3 sm:px-3.5 py-1 rounded-full text-[6.5px] sm:text-[7.5px] uppercase tracking-widest bg-[#D4AF37] text-black font-semibold shadow-sm">
              <span>Buka Undangan</span>
              <span className="text-[6.5px]">→</span>
            </div>
          </div>
        </div>
      );
    }

    // 1. Romantic Cinema (CLARA) - Arched Architectural Window
    if (archetype === 'romantic-cinema') {
      return (
        <div className="px-2.5 sm:px-3 pt-3 sm:pt-3.5 pb-2 sm:pb-3 flex flex-col justify-between h-[calc(100%-24px)] text-center bg-[#FAF7F2] text-[#3D342E]">
          <div className="pt-0.5">
            <div className="text-[6.5px] uppercase tracking-[0.25em] text-[#9B8070] font-medium">
              <span>THE WEDDING</span>
            </div>
            <h4 className="font-serif font-bold text-xs sm:text-sm uppercase tracking-wider text-[#2E241E] mt-0.5 line-clamp-1">
              {demo.groomNickname} &amp; {demo.brideNickname}
            </h4>
            <p className="text-[6.5px] sm:text-[7px] tracking-[0.2em] text-[#9B8070] font-sans">
              {demo.dateStr}
            </p>
          </div>

          {/* Arched Architectural Window */}
          <div className="my-0.5 sm:my-1 mx-auto w-full max-w-[115px] sm:max-w-[135px] p-1 sm:p-1.5 bg-white/90 rounded-t-[55px] rounded-b-sm border border-[#D4C3B3]/70 shadow-sm">
            <div className="w-full aspect-[3/4] rounded-t-[50px] rounded-b-xs overflow-hidden border border-[#D4C3B3]/40 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={template.coverImageUrl}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D342E]/25 via-transparent to-transparent" />
            </div>
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <p className="font-serif italic text-[6.5px] sm:text-[7.5px] text-[#7D6B5D] line-clamp-1 px-1">
              &ldquo;{demo.quote}&rdquo;
            </p>
            <div className="inline-flex items-center justify-center gap-1 px-3 sm:px-3.5 py-1 rounded-full text-[6.5px] sm:text-[7.5px] uppercase tracking-widest bg-[#3D342E] text-white shadow-sm">
              <span>Buka Undangan</span>
              <span className="text-[6.5px]">→</span>
            </div>
          </div>
        </div>
      );
    }

    // 2. Modern Minimal (CÉLINE) - High Fashion Magazine
    if (archetype === 'modern-minimal') {
      return (
        <div className="px-2.5 sm:px-3 pt-3 sm:pt-3.5 pb-2 sm:pb-3 flex flex-col justify-between h-[calc(100%-24px)] text-center bg-[#FAF9F6] text-[#111111]">
          <div>
            <div className="flex justify-between items-center border-b border-black/15 pb-0.5 text-[6px] sm:text-[6.5px] uppercase tracking-[0.2em] text-neutral-500">
              <span>ISSUE N° 26</span>
              <span>EDITORIAL</span>
            </div>
            <h4 className="font-serif font-light text-xs sm:text-sm uppercase tracking-tight text-black mt-0.5 line-clamp-1">
              {demo.groomNickname} <span className="italic font-normal text-neutral-400">&amp;</span> {demo.brideNickname}
            </h4>
            <p className="text-[6.5px] uppercase tracking-[0.22em] text-neutral-400 mt-0.5">
              {demo.dateStr}
            </p>
          </div>

          <div className="my-0.5 sm:my-1 mx-auto w-full max-w-[115px] sm:max-w-[135px] aspect-[4/5] border border-black/20 bg-neutral-100 shadow-sm relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={template.coverImageUrl}
              alt={template.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-white/80" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-white/80" />
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <p className="font-sans text-[6.5px] sm:text-[7px] uppercase tracking-wider text-neutral-500 line-clamp-1">
              {demo.quote}
            </p>
            <div className="inline-flex items-center justify-center gap-1 px-3 sm:px-3.5 py-1 text-[6.5px] sm:text-[7px] uppercase tracking-widest bg-black text-white shadow-sm">
              <span>BUKA UNDANGAN</span>
              <span className="text-[6.5px]">→</span>
            </div>
          </div>
        </div>
      );
    }

    // 3. Dark Luxury Cinema (NOCTURNE) - Berlin Dark Cinema
    if (archetype === 'dark-luxury-cinema') {
      return (
        <div className="px-2.5 sm:px-3 pt-3 sm:pt-3.5 pb-2 sm:pb-3 flex flex-col justify-between h-[calc(100%-24px)] text-center bg-[#0A0A0A] text-[#F5F3EF]">
          <div className="pt-0.5">
            <div className="flex items-center justify-center gap-1 text-[6px] sm:text-[6.5px] uppercase tracking-[0.25em] text-[#C4B59D]">
              <Film className="w-1.5 h-1.5 text-[#C4B59D]" />
              <span>SCENE 01 · PREMIERE</span>
            </div>
            <h4 className="font-serif font-medium text-xs sm:text-sm uppercase tracking-widest text-[#F5F3EF] mt-0.5 line-clamp-1">
              {demo.groomNickname} &amp; {demo.brideNickname}
            </h4>
            <p className="text-[6.5px] tracking-[0.2em] text-[#C4B59D] uppercase font-mono mt-0.5">
              {demo.dateStr}
            </p>
          </div>

          <div className="my-0.5 sm:my-1 mx-auto w-full max-w-[115px] sm:max-w-[135px] aspect-[4/5] border border-[#C4B59D]/35 shadow-md relative overflow-hidden bg-neutral-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={template.coverImageUrl}
              alt={template.name}
              className="w-full h-full object-cover filter contrast-[1.1] brightness-[0.95] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
            <p className="absolute bottom-1 left-1.5 right-1.5 font-serif italic text-[6.5px] text-[#C4B59D]">
              &ldquo;A night to remember&rdquo;
            </p>
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <div className="inline-flex items-center justify-center gap-1 px-3 sm:px-3.5 py-1 text-[6.5px] sm:text-[7px] uppercase tracking-widest bg-[#C4B59D] text-black font-semibold shadow-sm">
              <span>BUKA UNDANGAN</span>
              <span className="text-[6.5px]">→</span>
            </div>
          </div>
        </div>
      );
    }

    // 4. Japanese Minimal (SORA) - Zen Wabi-Sabi
    if (archetype === 'japanese-minimal') {
      return (
        <div className="relative px-2.5 sm:px-3 pt-3 sm:pt-3.5 pb-2 sm:pb-3 flex flex-col justify-between h-[calc(100%-24px)] text-center bg-[#F6F4F0] text-[#232220]">
          <div className="absolute top-1 right-2 text-neutral-300 font-serif text-xs tracking-widest select-none">
            永遠
          </div>
          <div className="pt-0.5">
            <p className="text-[6px] sm:text-[6.5px] uppercase tracking-[0.3em] text-neutral-400">
              SORA · 空
            </p>
            <h4 className="font-serif font-light text-xs sm:text-sm uppercase tracking-widest text-[#232220] mt-0.5 line-clamp-1">
              {demo.groomNickname} &amp; {demo.brideNickname}
            </h4>
            <p className="text-[6.5px] tracking-[0.2em] text-neutral-500 font-mono mt-0.5">
              {demo.dateStr}
            </p>
          </div>

          <div className="my-0.5 sm:my-1 mx-auto w-full max-w-[110px] sm:max-w-[130px] p-1 bg-white border border-neutral-300/70 shadow-xs">
            <div className="w-full aspect-[3/4] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={template.coverImageUrl}
                alt={template.name}
                className="w-full h-full object-cover grayscale-[15%] transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <p className="font-serif italic text-[6.5px] sm:text-[7px] text-neutral-500 line-clamp-1">
              &ldquo;{demo.quote}&rdquo;
            </p>
            <div className="inline-flex items-center justify-center gap-1 px-3 sm:px-3.5 py-1 text-[6.5px] sm:text-[7px] uppercase tracking-widest border border-neutral-800 text-neutral-900 bg-white/70 shadow-xs">
              <span>Buka Undangan</span>
              <span className="text-[6.5px]">→</span>
            </div>
          </div>
        </div>
      );
    }

    // 5. Mediterranean Summer (ROMA) - Amalfi Riviera Postcard
    if (archetype === 'mediterranean-summer') {
      return (
        <div className="px-2.5 sm:px-3 pt-3 sm:pt-3.5 pb-2 sm:pb-3 flex flex-col justify-between h-[calc(100%-24px)] text-center bg-[#FAF6EE] text-[#2E221D]">
          <div className="pt-0.5">
            <span className="px-1.5 py-0.5 text-[6px] uppercase tracking-[0.2em] font-medium bg-[#C85A32]/10 text-[#C85A32] border border-[#C85A32]/30 rounded-2xs">
              AMALFI · 2026
            </span>
            <h4 className="font-serif font-medium text-xs sm:text-sm uppercase tracking-wider text-[#2E221D] mt-0.5 line-clamp-1">
              {demo.groomNickname} <span className="text-[#C85A32]">&amp;</span> {demo.brideNickname}
            </h4>
            <p className="text-[6.5px] tracking-[0.18em] text-[#C85A32] uppercase font-serif italic mt-0.5">
              {demo.dateStr}
            </p>
          </div>

          <div className="my-0.5 sm:my-1 mx-auto w-full max-w-[115px] sm:max-w-[135px] p-1.5 bg-white border border-[#C85A32]/25 shadow-sm rotate-[-1.5deg]">
            <div className="w-full aspect-[4/5] overflow-hidden border border-neutral-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={template.coverImageUrl}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <p className="font-serif italic text-[6.5px] sm:text-[7px] text-[#8A6756] line-clamp-1">
              &ldquo;La vita è bella bersama&rdquo;
            </p>
            <div className="inline-flex items-center justify-center gap-1 px-3 sm:px-3.5 py-1 rounded-full text-[6.5px] sm:text-[7px] uppercase tracking-widest bg-[#C85A32] text-white shadow-sm">
              <span>Buka Undangan</span>
              <span className="text-[6.5px]">→</span>
            </div>
          </div>
        </div>
      );
    }

    // 6. Balinese Heritage (MAHADEWI) - Sacred Pawiwahan & Fine Prada Gold
    if (archetype === 'balinese-heritage') {
      return (
        <div className="px-2 pt-4 sm:pt-5 pb-2 sm:pb-2.5 flex flex-col justify-between h-[calc(100%-24px)] text-center bg-[#F7F4EE] text-[#24201D] relative overflow-hidden">
          <div className="pt-1 relative z-10 flex flex-col items-center">
            <BalineseGapuraIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1 text-[#B88E4B]" />
            <div className="flex items-center justify-center gap-1 text-[5.5px] sm:text-[6px] uppercase tracking-[0.18em] text-[#8C4830] font-medium whitespace-nowrap">
              <span>OM SWASTYASTU</span>
            </div>
            <h4 className="font-serif font-normal text-xs sm:text-sm uppercase tracking-wider text-[#24201D] mt-0.5 line-clamp-1">
              {demo.groomNickname} <span className="italic font-light text-[#8C4830]">&amp;</span> {demo.brideNickname}
            </h4>
            <p className="text-[6.5px] tracking-[0.18em] text-[#8C4830] font-sans font-medium">
              {demo.dateStr}
            </p>
          </div>

          {/* Architectural Sacred Portal Frame */}
          <div className="my-0.5 mx-auto w-full max-w-[110px] sm:max-w-[130px] flex flex-col items-center">
            <div className="p-1 bg-[#FAF8F5] rounded-t-[44px] rounded-b-xs border border-[#B88E4B]/60 shadow-sm w-full">
              <div className="aspect-[3/4] w-full rounded-t-[40px] rounded-b-2xs overflow-hidden border border-[#B88E4B]/80 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={template.coverImageUrl}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-1 h-0.5 w-full rounded-full bg-[#8C4830]" />
            </div>
          </div>

          <div className="space-y-0.5 sm:space-y-1 relative z-10">
            <p className="font-serif italic text-[6.5px] sm:text-[7px] text-[#5C4D44] line-clamp-1 px-1">
              &ldquo;{demo.quote}&rdquo;
            </p>
            <div className="inline-flex items-center justify-center gap-1 px-3 sm:px-3.5 py-1 rounded-full text-[6.5px] sm:text-[7px] uppercase tracking-widest bg-[#8C4830] text-[#FAF6F0] shadow-sm">
              <span>Buka Undangan</span>
              <span className="text-[6.5px]">→</span>
            </div>
          </div>
        </div>
      );
    }

    // 7. Bali Heritage Luxury (BALI HERITAGE LUXURY) - Dark Editorial & Star Ornament
    if (archetype === 'balinese-heritage-luxury') {
      return (
        <div className="px-2 pt-4 sm:pt-5 pb-2 sm:pb-2.5 flex flex-col justify-between h-[calc(100%-24px)] text-center bg-[#0D0C0A] text-[#F3EEE5] relative overflow-hidden">
          {/* Full Cover Image with Radiant Couple Clarity & Targeted Bottom Vignette */}
          <div className="absolute inset-0 z-0">
            <img
              src={template.coverImageUrl}
              alt={template.name}
              className="w-full h-full object-cover object-top"
            />
            {/* Soft subtle top vignette only behind status & Om Swastyastu */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0D0C0A]/80 via-[#0D0C0A]/30 to-transparent pointer-events-none" />
            {/* Targeted bottom vignette: slightly raised so text is perfectly legible while faces remain bright */}
            <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#0D0C0A] via-[#0D0C0A]/90 via-45% to-transparent pointer-events-none" />
          </div>

          {/* Top Header */}
          <div className="pt-1 relative z-10 flex flex-col items-center shrink-0">
            <BalineseStarOrnament className="w-3.5 h-3.5 mb-0.5 text-[#B89A5A]" />
            <div className="text-[5.5px] uppercase tracking-[0.22em] text-[#D6C29A] font-medium">
              OM SWASTYASTU
            </div>
          </div>

          {/* Middle Spacer */}
          <div className="flex-1 w-full" />

          {/* Bottom Block */}
          <div className="space-y-0.5 relative z-10 pb-1 flex flex-col items-center shrink-0">
            <p className="text-[5.5px] uppercase tracking-[0.25em] text-[#D6C29A] font-serif drop-shadow-sm">
              PAWIWAHAN
            </p>
            <h4 className="font-serif font-normal text-[11px] uppercase tracking-wider text-[#F3EEE5] line-clamp-1 drop-shadow-sm">
              {demo.groomNickname} <span className="italic font-light text-[#D6C29A]">&amp;</span> {demo.brideNickname}
            </h4>
            <p className="text-[5.5px] tracking-[0.18em] text-[#D6C29A] font-mono drop-shadow-sm">
              {demo.dateStr}
            </p>
            <p className="font-serif italic text-[5.5px] text-[#F3EEE5]/80 line-clamp-1 px-1 pt-0.5">
              &ldquo;{demo.quote}&rdquo;
            </p>
            <div className="mt-1 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full text-[5.5px] uppercase tracking-widest bg-[#0D0C0A]/90 border border-[#B89A5A] text-[#F3EEE5] shadow-md">
              <span>Buka Undangan</span>
              <span className="text-[5px]">→</span>
            </div>
          </div>
        </div>
      );
    }

    // 8. Jawa Living Heritage (JAWA LIVING HERITAGE) — Authentic Heritage Theater Stage
    if (archetype === 'jawa-living-heritage') {
      return (
        <div className="px-1.5 pt-3 sm:pt-3.5 pb-0 flex flex-col justify-between h-[calc(100%-24px)] text-center bg-[#FAF2E6] text-[#2C1E14] relative overflow-hidden">
          {/* Top Carved Arch */}
          <div className="absolute top-0 inset-x-0 z-20 pointer-events-none">
            <JavaneseCarvedArchTop className="w-full h-6" color="#7A5A30" accentColor="#C2A468" opacity={0.95} />
          </div>

          {/* Top Header & Center Titles (Upper Half) */}
          <div className="pt-2 relative z-10 flex flex-col items-center shrink-0">
            <JavaneseMentulIcon className="w-3 h-3 mb-0.5 text-[#8A6D3B]" />
            <div className="text-[5px] uppercase tracking-[0.24em] text-[#8A6D3B] font-medium font-serif mb-0.5">
              SERAT ULEM · PAWIWAHAN
            </div>
            <p className="text-[5px] uppercase tracking-[0.26em] text-[#8A6D3B] font-serif">
              PAWIWAHAN
            </p>
            <h4 className="font-serif font-normal text-[11px] sm:text-[12px] uppercase tracking-wider text-[#2C1E14] line-clamp-1 mt-0.5">
              {demo.groomNickname} <span className="italic font-light text-[#8A6D3B]">&amp;</span> {demo.brideNickname}
            </h4>
            <p className="text-[5.5px] tracking-[0.2em] text-[#8A6D3B] font-serif mb-1">
              {demo.dateStr}
            </p>
            <div className="inline-flex items-center justify-center gap-1 px-3 py-0.5 rounded-full text-[5px] uppercase tracking-widest bg-[#2C1E14] text-[#FAF6F0] border border-[#C2A468] shadow-sm">
              <span>Buka Undangan</span>
              <span className="text-[4.5px]">→</span>
            </div>
          </div>

          {/* Heritage Theater Stage (Lower 56% - Dense & Lush) */}
          <div className="relative w-full h-[56%] pointer-events-none flex items-end justify-center overflow-hidden">
            {/* Midground Panoramic Joglo Estate */}
            <div className="absolute inset-0 w-full h-full flex justify-center items-end opacity-90">
              <img
                src="/images/jawa-joglo-panoramic.png"
                alt="Joglo"
                className="w-full h-full object-cover object-bottom"
              />
            </div>

            {/* Altar Botanical Flowers (Snug Flanking Gunungan) */}
            <div className="absolute bottom-0 left-[calc(50%-38px)] w-12 h-16 z-15 pointer-events-none jawa-sway-left">
              <img src="/images/jawa-crescent-flower.png" alt="Botanical Flowers" className="w-full h-full object-contain object-bottom-left" />
            </div>
            <div className="absolute bottom-0 right-[calc(50%-38px)] w-12 h-16 z-15 pointer-events-none jawa-sway-right scale-x-[-1]">
              <img src="/images/jawa-crescent-flower.png" alt="Botanical Flowers" className="w-full h-full object-contain object-bottom-left" />
            </div>

            {/* Corner Botanical Accents */}
            <div className="absolute bottom-0 -left-1 w-9 h-12 z-10 pointer-events-none opacity-70 jawa-sway-left">
              <img src="/images/jawa-crescent-flower.png" alt="Botanical Flowers" className="w-full h-full object-contain object-bottom-left" />
            </div>
            <div className="absolute bottom-0 -right-1 w-9 h-12 z-10 pointer-events-none opacity-70 jawa-sway-right scale-x-[-1]">
              <img src="/images/jawa-crescent-flower.png" alt="Botanical Flowers" className="w-full h-full object-contain object-bottom-left" />
            </div>

            {/* Foreground Floating Golden Gunungan */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-22 z-18 pointer-events-none jawa-gunungan-float">
              <img src="/images/jawa-gold-gunungan.png" alt="Gunungan" className="w-full h-full object-contain object-bottom filter drop-shadow-[0_2px_8px_rgba(184,134,11,0.4)]" />
            </div>

            {/* Bottom Carved Arch */}
            <div className="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
              <JavaneseCarvedArchBottom className="w-full h-5" color="#7A5A30" accentColor="#C2A468" opacity={0.95} />
            </div>
          </div>
        </div>
      );
    }

    // 9. Default / Editorial Garden (AURELIA) - Botanical Symmetry
    return (
      <div className="px-2.5 sm:px-3 pt-3 sm:pt-3.5 pb-2 sm:pb-3 flex flex-col justify-between h-[calc(100%-24px)] text-center bg-[#F8F7F3] text-[#1F1C1D]">
        <div className="pt-0.5">
          <p className="text-[6px] sm:text-[6.5px] uppercase tracking-[0.25em] text-[#4A5340] font-medium">
            BOTANICAL · ISSUE I
          </p>
          <h4 className="font-serif font-medium text-xs sm:text-sm uppercase tracking-wider text-[#2D3326] mt-0.5 line-clamp-1">
            {demo.groomNickname} <span className="italic font-light text-[#4A5340]">&amp;</span> {demo.brideNickname}
          </h4>
          <p className="text-[6.5px] sm:text-[7px] tracking-[0.18em] text-neutral-500 font-sans mt-0.5">
            {demo.dateStr}
          </p>
        </div>

        <div className="my-0.5 sm:my-1 mx-auto w-full max-w-[115px] sm:max-w-[135px] p-1.5 bg-white border border-[#4A5340]/25 rounded-xs shadow-md">
          <div className="w-full aspect-[3/4] overflow-hidden border border-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={template.coverImageUrl}
              alt={template.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="space-y-0.5 sm:space-y-1">
          <p className="font-serif italic text-[6.5px] sm:text-[7px] text-neutral-600 line-clamp-1 px-1">
            &ldquo;{demo.quote}&rdquo;
          </p>
          <div className="inline-flex items-center justify-center gap-1 px-3 sm:px-3.5 py-1 rounded-full text-[6.5px] sm:text-[7px] uppercase tracking-widest bg-[#4A5340] text-white shadow-sm">
            <span>Buka Undangan</span>
            <span className="text-[6.5px]">→</span>
          </div>
        </div>
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // RENDER PHONE 2 (Back Offset Phone - Authentic Interior Peek)
  // --------------------------------------------------------------------------
  const renderBackInterior = () => {
    // Clara: Arched couple portrait cutout
    if (archetype === 'romantic-cinema') {
      return (
        <div className="relative flex-1 overflow-hidden mt-1 bg-[#FAF7F2] text-[#3D342E] flex flex-col items-center p-3">
          <p className="text-[7px] uppercase tracking-[0.25em] text-[#9B8070] mb-1">
            OUR STORY
          </p>
          <div className="w-full max-w-[130px] aspect-[3/4] rounded-t-[50px] rounded-b-sm overflow-hidden border border-[#D4C3B3]/60 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={secondaryImage}
              alt="Clara Interior"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-2 text-center">
            <p className="font-serif text-[10px] text-[#2E241E] font-medium line-clamp-1">
              The Beginning of Forever
            </p>
            <p className="text-[6.5px] uppercase tracking-widest text-[#9B8070]">
              CHAPTER I · LOVE STORY
            </p>
          </div>
        </div>
      );
    }

    // Elodie: Living Golden Hour Romance
    if (archetype === 'cinematic-motion') {
      return (
        <div className="relative flex-1 overflow-hidden mt-1 bg-[#161311] text-[#F8F6F0] flex flex-col justify-between p-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={secondaryImage}
            alt="Elodie Interior"
            className="absolute inset-0 w-full h-full object-cover filter contrast-[1.1] brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/60" />
          <div className="relative z-10 flex justify-between items-center text-[6.5px] text-[#D4AF37] font-mono">
            <span>GOLDEN HOUR</span>
            <span>MOTION ROMANCE</span>
          </div>
          <div className="relative z-10 text-center">
            <p className="text-[6.5px] uppercase tracking-widest text-[#D4AF37] font-mono">
              PARIS · BALI · FOREVER
            </p>
            <p className="font-serif text-[9.5px] text-white font-medium mt-0.5 line-clamp-1">
              Love in Motion
            </p>
          </div>
        </div>
      );
    }

    // Nocturne: Cinematic 4K Video Player Peek
    if (archetype === 'dark-luxury-cinema') {
      return (
        <div className="relative flex-1 overflow-hidden mt-1 bg-[#0A0A0A] text-[#F5F3EF] flex flex-col justify-between p-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={secondaryImage}
            alt="Nocturne Video"
            className="absolute inset-0 w-full h-full object-cover filter contrast-[1.1] brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/60" />

          {/* Top Camera Metadata HUD */}
          <div className="relative z-10 flex justify-between items-center text-[6.5px] text-[#C4B59D] font-mono">
            <span>[4K · 24FPS]</span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> REC
            </span>
          </div>

          {/* Center Play Icon Badge */}
          <div className="relative z-10 mx-auto my-auto w-9 h-9 rounded-full bg-black/65 border border-[#C4B59D]/70 flex items-center justify-center backdrop-blur-md shadow-2xl">
            <div className="w-0 h-0 border-t-[4.5px] border-t-transparent border-b-[4.5px] border-b-transparent border-l-[7px] border-l-[#C4B59D] ml-0.5" />
          </div>

          <div className="relative z-10 text-center">
            <p className="text-[6.5px] uppercase tracking-widest text-[#C4B59D] font-mono">
              SCENE 02 · CINEMATIC TEASER
            </p>
            <p className="font-serif text-[9.5px] text-white font-medium mt-0.5 line-clamp-1">
              Watch 4K Prewedding Film
            </p>
          </div>
        </div>
      );
    }

    // Mahadewi: Balinese Sacred Rites Interior Peek
    if (archetype === 'balinese-heritage') {
      return (
        <div className="relative flex-1 overflow-hidden mt-1 bg-[#F7F4EE] text-[#24201D] flex flex-col justify-between p-2.5">
          <div className="text-center pt-1 z-10">
            <p className="text-[6.5px] uppercase tracking-[0.25em] text-[#B88E4B] font-medium">
              PURUSHA &amp; PRADANA
            </p>
            <p className="font-serif text-[9px] text-[#24201D] font-normal mt-0.5">
              Dua Jiwa Menuju Kesucian
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-[135px] aspect-[3/4] rounded-t-2xl rounded-b-xs overflow-hidden border border-[#B88E4B]/50 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={secondaryImage}
              alt="Mahadewi Interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-1.5 inset-x-0 text-center">
              <span className="text-[7px] font-serif italic text-white/90">
                Griya Tegeh · Sanur
              </span>
            </div>
          </div>
          <div className="text-center z-10 pb-0.5">
            <p className="text-[6.5px] uppercase tracking-widest text-[#8C4830] font-sans font-medium">
              DUDONAN ACARA PAWIWAHAN
            </p>
          </div>
        </div>
      );
    }

    // Bali Heritage Luxury: Ivory Editorial Interior Peek
    if (archetype === 'balinese-heritage-luxury') {
      return (
        <div className="relative flex-1 overflow-hidden mt-1 bg-[#F3EEE5] text-[#2B241E] flex flex-col justify-between p-2.5">
          <div className="text-center pt-1 z-10">
            <p className="text-[6.5px] uppercase tracking-[0.22em] text-[#2B241E] font-serif font-medium">
              TENTANG KAMI
            </p>
            <p className="font-serif italic text-[7.5px] text-[#8C6D38] mt-0.5">
              Dua Jiwa, Satu Tujuan
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-[130px] aspect-[3/4] rounded-sm overflow-hidden border border-[#2B241E]/10 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={secondaryImage}
              alt="Bali Heritage Interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2B241E]/50 via-transparent to-transparent" />
            <div className="absolute bottom-1 inset-x-0 text-center">
              <span className="text-[6.5px] font-serif italic text-white/90">
                Pawiwahan · 24 . 10 . 2026
              </span>
            </div>
          </div>
          <div className="text-center z-10 pb-0.5 flex flex-col items-center">
            <BalineseStarOrnament className="w-3.5 h-3.5 text-[#B89A5A]" />
          </div>
        </div>
      );
    }

    // Jawa Living Heritage: Dawn Ivory & Bamboo Shadows
    if (archetype === 'jawa-living-heritage') {
      return (
        <div className="relative flex-1 overflow-hidden mt-1 bg-[#FAF6F0] text-[#211A16] flex flex-col justify-between p-2.5">
          {/* Subtle Bamboo Foliage Shadow & Dawn Light */}
          <div className="absolute -top-6 -right-6 w-36 h-36 bg-[radial-gradient(circle,rgba(240,195,105,0.35)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute top-0 right-0 w-28 h-28 opacity-30 pointer-events-none">
            <JavaneseMorningBreezeShadows />
          </div>

          <div className="text-center pt-1 z-10">
            <p className="text-[6.5px] uppercase tracking-[0.24em] text-[#806947] font-serif font-medium">
              TENTANG KAMI
            </p>
            <p className="font-serif italic text-[7.5px] text-[#806947] mt-0.5">
              Dua Insan, Satu Perjalanan
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-[130px] aspect-[3/4] rounded-sm overflow-hidden border border-[#806947]/20 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={secondaryImage}
              alt="Jawa Living Interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#211A16]/50 via-transparent to-transparent" />
            <div className="absolute bottom-1 inset-x-0 text-center">
              <span className="text-[6.5px] font-serif italic text-white/90">
                Pawiwahan · 28 . 11 . 2026
              </span>
            </div>
          </div>
          <div className="text-center z-10 pb-0.5 flex flex-col items-center">
            <JavaneseFloralDivider className="w-20 h-3 text-[#B3945A]" />
          </div>
        </div>
      );
    }

    // Standard Fallback for others
    return (
      <div className="relative flex-1 overflow-hidden mt-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={secondaryImage}
          alt="Interior Peek"
          className="w-full h-full object-cover filter contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        <div className="absolute bottom-4 left-3 right-3 text-center">
          <p className="text-[8px] uppercase tracking-widest text-neutral-300">
            {demo.secondaryTitle || 'OUR STORY'}
          </p>
          <p className="font-serif text-[11px] text-white font-medium mt-0.5 line-clamp-1">
            {demo.secondarySubtitle || 'Two souls in harmony'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={isSelectable && onSelect ? onSelect : undefined}
      className={`group flex flex-col justify-between border transition-all duration-500 rounded-sm overflow-hidden bg-[#FAF9F6] text-[#111111] ${
        isSelected
          ? 'ring-2 ring-black border-black shadow-xl'
          : !isAllowed
          ? 'border-neutral-200/90 opacity-85 hover:opacity-100 hover:border-neutral-400'
          : 'border-neutral-200/80 hover:border-neutral-400 hover:shadow-xl'
      }`}
    >
      {/* Visual Mockup Stage (Dual Smartphone) */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden p-3 sm:p-6 flex items-center justify-center select-none bg-gradient-to-b from-[#F2EFEB] to-[#E9E5DE]">
        {/* Package Locked Tag if applicable */}
        {!isAllowed && (
          <div className="absolute top-3.5 left-3.5 right-3.5 z-30 flex items-center justify-between bg-black/85 text-white px-3 py-1.5 backdrop-blur-md rounded-full shadow-md">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Eksklusif Premium</span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-amber-300 font-medium">
              Tingkatkan
            </span>
          </div>
        )}

        {/* Selected Checkmark Badge */}
        {isSelected && (
          <div className="absolute top-3.5 right-3.5 z-30 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center border-2 border-white shadow-lg">
            <Check className="w-4 h-4" />
          </div>
        )}

        {/* Archetype / Category Pill Badge */}
        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5">
          <span className="px-2.5 py-1 text-[8.5px] sm:text-[9px] uppercase tracking-ultra rounded-full border backdrop-blur-md bg-white/85 text-neutral-800 border-black/10 shadow-xs">
            {template.subtitle || template.category}
          </span>
          {archetype === 'cinematic-motion' && (
            <span className="px-2 py-0.5 text-[7.5px] sm:text-[8px] uppercase tracking-wider rounded-full bg-[#D4AF37] text-black font-semibold shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              <span>LIVING VIDEO</span>
            </span>
          )}
        </div>

        {/* CENTERED DUAL-PHONE STAGE (NO OVERFLOW OR CLIPPING) */}
        <div className="relative flex items-center justify-center w-[250px] sm:w-[285px] md:w-[305px] h-[335px] sm:h-[395px] md:h-[415px]">
          {/* PHONE 2 (Back / Offset Peek Phone) */}
          <div className="absolute left-[36%] sm:left-[38%] top-2 sm:top-3.5 w-[140px] sm:w-[170px] md:w-[185px] h-[280px] sm:h-[345px] md:h-[375px] rounded-[24px] sm:rounded-[30px] md:rounded-[32px] border-[3.5px] sm:border-[4px] border-[#2A2A2E] bg-neutral-900 shadow-xl overflow-hidden transform rotate-[6deg] transition-transform duration-700 group-hover:rotate-[8deg] group-hover:translate-x-1.5 opacity-95">
            {/* Phone Speaker Pill */}
            <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-2.5 sm:h-3 bg-black rounded-full z-20 flex items-center justify-end px-1">
              <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#111122]/80" />
            </div>

            {/* Secondary Screen Content */}
            <div className="relative w-full h-full bg-neutral-900 text-white overflow-hidden flex flex-col">
              {/* Status bar */}
              <div className="pt-1.5 sm:pt-2 px-3 sm:px-4 flex justify-between items-center text-[7px] sm:text-[8px] text-neutral-400 z-10">
                <span>20:13</span>
                <div className="flex items-center gap-1">
                  <span className="text-[6.5px]">5G</span>
                  <div className="w-2.5 h-1.5 border border-neutral-400 rounded-2xs" />
                </div>
              </div>

              {/* Interior content peek */}
              {renderBackInterior()}
            </div>
          </div>

          {/* PHONE 1 (Front Cover Phone) */}
          <div
            className="relative z-10 -left-5 sm:-left-7 w-[155px] sm:w-[190px] md:w-[210px] h-[310px] sm:h-[380px] md:h-[410px] rounded-[26px] sm:rounded-[32px] md:rounded-[34px] border-[4px] sm:border-[5px] border-[#1D1D1F] shadow-2xl overflow-hidden transform -rotate-[2deg] transition-transform duration-700 group-hover:rotate-0 group-hover:scale-[1.02]"
            style={{
              backgroundColor: template.theme.bgColor || '#F8F7F3',
              color: template.theme.textColor || '#111111',
            }}
          >
            {/* Dynamic Island / Camera notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 sm:w-14 h-3 sm:h-3.5 bg-black rounded-full z-30 flex items-center justify-end px-1.5 shadow-inner">
              <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#1c2438]" />
            </div>

            {/* Status Bar */}
            <div className="pt-2 px-3.5 sm:px-4 flex justify-between items-center text-[7.5px] sm:text-[8.5px] font-medium opacity-60 z-20 relative">
              <span>20:13</span>
              <div className="flex items-center gap-1">
                <span className="text-[7px] tracking-tight">5G</span>
                <div className="w-2.5 h-1.5 border border-current rounded-2xs relative flex items-center p-0.5">
                  <div className="w-full h-full bg-current rounded-3xs" />
                </div>
              </div>
            </div>

            {/* Authentic Archetype Cover Screen Content */}
            {renderFrontCover()}
          </div>
        </div>
      </div>

      {/* Template Metadata & Action Area */}
      <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 border-t border-inherit">
        <div>
          {/* Title & Subtitle */}
          <div className="flex items-baseline justify-between mb-1.5">
            <h3 className="font-serif text-2xl uppercase tracking-wider font-medium">
              {template.name}
            </h3>
          </div>

          <p className="text-[10px] uppercase tracking-ultra text-neutral-400 font-medium mb-3">
            {template.subtitle}
          </p>

          <p className="text-xs text-neutral-500 font-light leading-relaxed mb-4 line-clamp-2">
            {template.tagline || template.description}
          </p>

          {/* Color Palette Swatches & Tags */}
          <div className="flex items-center justify-between py-3 border-y border-neutral-200/50 my-4">
            {/* 4 Circular Swatches */}
            <div className="flex items-center gap-2">
              {template.colorPalette?.map((color, i) => (
                <div
                  key={i}
                  title={color}
                  className="w-4 h-4 rounded-full border border-black/15 shadow-2xs"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Archetype Tags */}
            <div className="text-[9px] uppercase tracking-widest text-neutral-400 font-medium truncate max-w-[180px] text-right">
              {template.tags ? template.tags.join(' · ') : template.category}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="pt-2 flex items-center gap-2.5">
            <Link
              href={`/templates/${template.slug}`}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-widest border border-neutral-300 text-neutral-800 hover:bg-black hover:text-white transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </Link>

            <Link
              href={`/create?template=${template.id}#step-names`}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-all"
            >
              <span>Pilih</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
