'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, Download } from 'lucide-react';
import { GalleryItem } from '@/types';
import { getTemplateById } from '@/lib/store';

interface DocumentationGallerySectionProps {
  photos: GalleryItem[];
  isDark?: boolean;
  forceMobile?: boolean;
  templateId?: string;
  isVideoMotion?: boolean;
}

export function DocumentationGallerySection({
  photos: rawPhotos = [],
  isDark: propIsDark,
  forceMobile = false,
  templateId,
  isVideoMotion: propIsVideoMotion,
}: DocumentationGallerySectionProps) {
  const photos = (rawPhotos || []).filter((item) => item?.imageUrl && item.imageUrl.trim() !== '');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
        setSelectedIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, photos.length]);

  if (!photos || photos.length === 0) return null;

  const isCinema = archetype === 'dark-luxury-cinema';
  const isRomantic = archetype === 'romantic-cinema';
  const isZen = archetype === 'japanese-minimal';
  const isRoma = archetype === 'mediterranean-summer';
  const isBali = archetype === 'balinese-heritage';

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <section
      id="section-documentation"
      className={`py-16 sm:py-24 px-6 border-t transition-colors duration-500 ${
        isVideoMotion
          ? 'bg-transparent text-white border-white/10'
          : isCinema
          ? 'bg-[#0A0A0A] text-[#F5F3EF] border-neutral-900'
          : isBali
          ? 'bg-[#F4F0E6] text-[#24201D] border-[#B88E4B]/20'
          : isRoma
          ? 'bg-[#F6F2EA] text-[#2E221D] border-[#C85A32]/20'
          : isRomantic
          ? 'bg-[#F7F3EE] text-[#3D342E] border-[#9B8070]/20'
          : isZen
          ? 'bg-[#F2EFE9] text-[#232220] border-stone-300/40'
          : isDark
          ? 'bg-[#0E0E0E] text-[#F5F3EF] border-neutral-900'
          : 'bg-[#F8F7F3] text-[#111111] border-neutral-200'
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`text-center ${forceMobile ? 'mb-8' : 'mb-12 sm:mb-16'}`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-current/20 text-[9px] uppercase tracking-ultra mb-3 font-medium opacity-80">
            <Camera className="w-3 h-3 text-amber-500" />
            <span>WEDDING DAY HIGHLIGHTS · MEMORY VAULT</span>
          </div>

          <h2
            className={`font-serif uppercase tracking-wider mt-1 ${
              forceMobile ? 'text-2xl' : 'text-3xl sm:text-4xl'
            } ${isVideoMotion ? 'text-white drop-shadow-md' : ''}`}
          >
            {isBali
              ? 'DOKUMENTASI PAWIWAHAN'
              : isCinema
              ? 'THE POST-PREMIERE VAULT'
              : isRoma
              ? 'RICORDI DELLA FESTA'
              : isZen
              ? '記録の記憶 · MEMORY ARCHIVE'
              : 'Dokumentasi Hari Bahagia'}
          </h2>

          <p className="text-xs sm:text-sm font-light max-w-lg mx-auto mt-3 opacity-70 leading-relaxed">
            Momen-momen kehangatan, senyuman, dan rasa syukur yang terekam indah di hari pernikahan kami.
          </p>
          <div
            className={`w-12 h-[1px] mx-auto mt-4 ${
              isVideoMotion
                ? 'bg-[#E5C378]/50'
                : isCinema
                ? 'bg-[#C4B59D]/40'
                : isBali
                ? 'bg-[#8C4830]/40'
                : 'bg-current opacity-20'
            }`}
          />
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {photos.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className="group relative cursor-pointer overflow-hidden border border-black/5 bg-black/5 aspect-[4/5] transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.caption || `Dokumentasi ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                {item.caption && (
                  <p className="text-xs font-light line-clamp-2 drop-shadow-sm">
                    {item.caption}
                  </p>
                )}
                <span className="text-[9px] uppercase tracking-widest text-white/75 mt-1">
                  Lihat Foto #{idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Controls */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : 0));
                }}
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
                }}
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Content Container */}
          <div
            className="max-w-4xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.caption || 'Dokumentasi'}
              className="max-w-full max-h-[75vh] object-contain shadow-2xl rounded-sm"
            />
            <div className="mt-4 text-center max-w-xl text-white space-y-2">
              {selectedPhoto.caption && (
                <p className="font-serif text-sm sm:text-base font-light tracking-wide">
                  {selectedPhoto.caption}
                </p>
              )}
              <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-white/60">
                <span>
                  {selectedIndex !== null ? selectedIndex + 1 : 1} / {photos.length}
                </span>
                <span>·</span>
                <a
                  href={selectedPhoto.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-1 hover:text-white transition-colors underline"
                >
                  <Download className="w-3 h-3" />
                  <span>Simpan Resolusi Penuh</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
