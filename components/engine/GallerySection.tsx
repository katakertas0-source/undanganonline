'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { GalleryItem } from '@/types';
import { getTemplateById } from '@/lib/store';

interface GallerySectionProps {
  gallery: GalleryItem[];
  isDark?: boolean;
  forceMobile?: boolean;
  templateId?: string;
  isVideoMotion?: boolean;
}

export function GallerySection({
  gallery: rawGallery,
  isDark: propIsDark,
  forceMobile = false,
  templateId,
  isVideoMotion: propIsVideoMotion,
}: GallerySectionProps) {
  const gallery = (rawGallery || []).filter((item) => item?.imageUrl && item.imageUrl.trim() !== '');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [naturalRatios, setNaturalRatios] = useState<Record<string, number>>({});

  const template = templateId ? getTemplateById(templateId) : null;
  const archetype = template?.archetype || 'editorial-garden';
  const isDark = propIsDark ?? template?.theme.isDark ?? false;
  const isVideoMotion = Boolean(propIsVideoMotion || template?.archetype === 'cinematic-motion');

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev !== null ? (prev + 1) % gallery.length : null));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev !== null ? (prev - 1 + gallery.length) % gallery.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, gallery.length]);

  if (!gallery || gallery.length === 0) return null;

  const isCinema = archetype === 'dark-luxury-cinema';
  const isRomantic = archetype === 'romantic-cinema';
  const isZen = archetype === 'japanese-minimal';
  const isRoma = archetype === 'mediterranean-summer';
  const isBali = archetype === 'balinese-heritage';

  const selectedPhoto = selectedIndex !== null ? gallery[selectedIndex] : null;

  // Calculate effective aspect ratio based on manual choice or natural image dimensions
  const getEffectiveRatio = (item: GalleryItem): '16:9' | '1:1' | '4:5' => {
    if (item.aspectRatio) return item.aspectRatio;
    const nat = naturalRatios[item.id];
    if (nat) {
      if (nat > 1.3) return '16:9';
      if (nat < 0.85) return '4:5';
      return '1:1';
    }
    return '4:5';
  };

  const isItemLandscape = (item: GalleryItem) => getEffectiveRatio(item) === '16:9';

  const getAspectClass = (item: GalleryItem, isWide: boolean) => {
    if (isWide) return 'aspect-[16/10] sm:aspect-[16/9]';
    const ratio = getEffectiveRatio(item);
    if (ratio === '1:1') return 'aspect-square';
    if (ratio === '16:9') return 'aspect-[16/9]';
    return 'aspect-[4/5]';
  };

  return (
    <section
      className={`py-16 sm:py-24 px-6 transition-colors duration-500 ${
        isVideoMotion
          ? 'bg-transparent text-white'
          : isCinema
          ? 'bg-[#0E0E0E] text-[#F5F3EF]'
          : isBali
          ? 'bg-[#F7F4EE] text-[#24201D]'
          : isRoma
          ? 'bg-[#FAF6EE] text-[#2E221D]'
          : isRomantic
          ? 'bg-[#FAF7F2] text-[#3D342E]'
          : isZen
          ? 'bg-[#F6F4F0] text-[#232220]'
          : isDark
          ? 'bg-[#121212] text-[#F5F3EF]'
          : 'bg-[#FCFBF8] text-[#111111]'
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className={`text-center ${forceMobile ? 'mb-8' : 'mb-12 sm:mb-16'}`}>
          <p
            className={`text-[9.5px] uppercase tracking-ultra font-semibold ${
              isVideoMotion
                ? 'text-[#E5C378]'
                : isCinema
                ? 'text-[#C4B59D]'
                : isBali
                ? 'text-[#8C4830]'
                : isRoma
                ? 'text-[#C85A32]'
                : 'text-neutral-400'
            }`}
          >
            {isBali
              ? 'WIDANG FOTO · SACRED MEMORIES'
              : isRoma
              ? 'MEMORIE INDIMENTICABILI'
              : isRomantic
              ? '35MM LOVE REEL'
              : isZen
              ? '静かな記憶 · MEMORIES IN STILLNESS'
              : 'MOMENTS IN TIME'}
          </p>
          <h2
            className={`font-serif uppercase tracking-wider mt-1.5 ${
              forceMobile ? 'text-2xl' : 'text-3xl sm:text-4xl'
            } ${isVideoMotion ? 'text-white drop-shadow-md' : ''}`}
          >
            Galeri Foto
          </h2>
          <div
            className={`w-12 h-[1px] mx-auto mt-3 ${
              isVideoMotion
                ? 'bg-[#E5C378]/50'
                : isCinema
                ? 'bg-[#C4B59D]/40'
                : isBali
                ? 'bg-[#B88E4B]/40'
                : isRoma
                ? 'bg-[#C85A32]/30'
                : isDark
                ? 'bg-neutral-800'
                : 'bg-neutral-300'
            }`}
          />
        </div>

        {/* --- 1. ARCHETYPE: ROMANTIC CINEMA (35mm Vintage Film Strip) --- */}
        {isRomantic ? (
          <div className="p-4 sm:p-6 bg-[#161412] text-white rounded-xs shadow-xl border border-neutral-800">
            {/* Film sprocket strip header */}
            <div className="flex justify-between items-center pb-3 mb-4 sm:mb-6 border-b border-neutral-800 text-[8.5px] sm:text-[9px] font-mono text-neutral-400">
              <span>KODAK PORTRA 400 · 35MM</span>
              <span className="hidden sm:inline">SAFETY FILM</span>
              <span>EXP {gallery.length}</span>
            </div>

            <div
              className={`grid ${
                forceMobile
                  ? 'grid-cols-2 gap-2.5'
                  : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4'
              }`}
            >
              {gallery.map((item, idx) => {
                const landscape = isItemLandscape(item);
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`group cursor-pointer bg-black p-1.5 sm:p-2 border border-neutral-800/80 shadow-md relative hover:border-neutral-600 transition-all duration-300 ${
                      landscape ? 'col-span-2' : 'col-span-1'
                    }`}
                  >
                    <div className="flex justify-between text-[7.5px] sm:text-[8px] font-mono text-neutral-500 mb-1">
                      <span>{`[0${idx + 1}A]`}</span>
                      <span>▶</span>
                    </div>
                    <div className={`${getAspectClass(item, landscape)} overflow-hidden bg-neutral-900 relative`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.caption || `Photo ${idx + 1}`}
                        onLoad={(e) => {
                          const target = e.currentTarget;
                          if (target.naturalWidth && target.naturalHeight) {
                            const r = target.naturalWidth / target.naturalHeight;
                            setNaturalRatios((prev) => (prev[item.id] === r ? prev : { ...prev, [item.id]: r }));
                          }
                        }}
                        className="w-full h-full object-cover filter contrast-[1.05] sepia-[0.08] transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    {item.caption && (
                      <p className="mt-1.5 text-center font-serif italic text-[10px] sm:text-xs text-neutral-300 truncate px-1">
                        {item.caption}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : isRoma ? (
          /* --- 2. ARCHETYPE: MEDITERRANEAN SUMMER (Polaroid Scrapbook) --- */
          <div
            className={`grid pt-2 ${
              forceMobile
                ? 'grid-cols-2 gap-3'
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6'
            }`}
          >
            {gallery.map((item, idx) => {
              const rotations = ['rotate-[-1.5deg]', 'rotate-[1.5deg]', 'rotate-[-1deg]', 'rotate-[1deg]'];
              const rotation = rotations[idx % rotations.length];
              const landscape = isItemLandscape(item);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedIndex(idx)}
                  className={`group cursor-pointer bg-white p-2.5 sm:p-3 pb-4 sm:pb-5 shadow-sm border border-amber-900/10 transition-all duration-300 hover:shadow-xl hover:scale-[1.03] ${
                    landscape ? 'col-span-2 rotate-0' : `${rotation} col-span-1`
                  }`}
                >
                  {/* Washi tape accent on top */}
                  <div className="w-8 h-2.5 bg-amber-100/70 border border-amber-200/50 mx-auto -mt-4 mb-1.5 rotate-[-1deg] shadow-2xs" />
                  <div className={`${getAspectClass(item, landscape)} overflow-hidden bg-neutral-100`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.caption || `Photo ${idx + 1}`}
                      onLoad={(e) => {
                        const target = e.currentTarget;
                        if (target.naturalWidth && target.naturalHeight) {
                          const r = target.naturalWidth / target.naturalHeight;
                          setNaturalRatios((prev) => (prev[item.id] === r ? prev : { ...prev, [item.id]: r }));
                        }
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-2 text-center font-serif italic text-[10px] sm:text-xs text-[#2E221D] truncate px-1">
                    {item.caption || `Ricordo #${idx + 1}`}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          /* --- 3. EDITORIAL MAGAZINE & PROPORTIONAL AUTO-GRID (Default, Clara, Celine, Aurelia, Nocturne) --- */
          <div>
            <div
              className={`grid ${
                forceMobile
                  ? 'grid-cols-2 gap-2.5'
                  : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5'
              }`}
            >
              {gallery.map((item, idx) => {
                const landscape = isItemLandscape(item);
                // Span across 2 columns if landscape, or if single first hero photo in an odd set
                const isSpan2 = landscape || (idx === 0 && (gallery.length === 1 || gallery.length % 2 === 1 || gallery.length >= 5));

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`group relative overflow-hidden cursor-pointer bg-white border transition-all duration-300 hover:shadow-md ${
                      isDark
                        ? 'border-neutral-800 bg-[#161616]'
                        : isCinema
                        ? 'border-[#C4B59D]/30 bg-[#141414]'
                        : 'border-[#E5DFD5]'
                    } ${isSpan2 ? 'col-span-2' : 'col-span-1'}`}
                  >
                    <div className={`${getAspectClass(item, isSpan2)} overflow-hidden bg-neutral-100 relative`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.caption || `Photo ${idx + 1}`}
                        onLoad={(e) => {
                          const target = e.currentTarget;
                          if (target.naturalWidth && target.naturalHeight) {
                            const r = target.naturalWidth / target.naturalHeight;
                            setNaturalRatios((prev) => (prev[item.id] === r ? prev : { ...prev, [item.id]: r }));
                          }
                        }}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Number Tag in corner */}
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-[8px] font-mono text-white/90 rounded-2xs">
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      {/* Hover / Tap Caption Overlay */}
                      {item.caption && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4">
                          <p className="font-serif italic text-white text-[11px] sm:text-xs leading-tight">
                            {item.caption}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Caption Bar */}
                    {item.caption && (
                      <div className="p-2 sm:p-2.5 text-center border-t border-inherit">
                        <p
                          className={`font-serif italic text-[10px] sm:text-xs truncate ${
                            isDark || isCinema ? 'text-neutral-300' : 'text-neutral-700'
                          }`}
                        >
                          {item.caption}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* --- Fullscreen Lightbox Modal with Next / Prev Navigation --- */}
      {selectedPhoto !== null && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Top Bar: Counter & Close */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-white/70 text-xs font-mono">
            <Camera className="w-3.5 h-3.5 text-[#C4B59D]" />
            <span>
              Foto {selectedIndex + 1} / {gallery.length}
            </span>
          </div>

          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
            title="Tutup (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Prev Button */}
          {gallery.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev !== null ? (prev - 1 + gallery.length) % gallery.length : 0));
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white/80 hover:text-white bg-black/40 hover:bg-black/80 rounded-full backdrop-blur-xs transition-all z-10"
              title="Foto Sebelumnya (←)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Navigation Next Button */}
          {gallery.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev !== null ? (prev + 1) % gallery.length : 0));
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white/80 hover:text-white bg-black/40 hover:bg-black/80 rounded-full backdrop-blur-xs transition-all z-10"
              title="Foto Selanjutnya (→)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Main Photo Container */}
          <div
            className="max-w-4xl max-h-[82vh] relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.caption || 'Expanded photo'}
              className="max-w-full max-h-[75vh] object-contain rounded-xs shadow-2xl transition-all duration-300"
            />
            {selectedPhoto.caption && (
              <p className="text-center font-serif italic text-neutral-300 mt-3 text-sm sm:text-base max-w-lg px-4">
                {selectedPhoto.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
