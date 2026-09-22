'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoSectionProps {
  videoUrl?: string;
  title?: string;
  subtitle?: string;
  isDark?: boolean;
  forceMobile?: boolean;
}

export function VideoSection({
  videoUrl,
  title = 'CINEMATIC TEASER',
  subtitle = 'A Glimpse of Our Journey',
  isDark = false,
  forceMobile = false,
}: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Helper to extract YouTube embed URL if applicable
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  };

  const fallbackEmbed = 'https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1';
  const hasRealUrl = Boolean(videoUrl && videoUrl.trim().length > 0);
  const embedUrl = hasRealUrl ? getEmbedUrl(videoUrl!) : fallbackEmbed;
  const isEmbedIframe = Boolean(embedUrl && (embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com')));

  return (
    <section
      className={`py-16 sm:py-24 px-6 transition-colors duration-500 ${
        isDark ? 'bg-[#0E0E0E] text-[#F5F3EF]' : 'bg-[#FAF8F5] text-[#111111]'
      }`}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <p className="text-[10px] uppercase tracking-ultra opacity-60 font-medium">
            {title}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-wider mt-2">
            {subtitle}
          </h2>
          <div
            className={`w-12 h-[1px] mx-auto mt-4 ${
              isDark ? 'bg-neutral-800' : 'bg-neutral-300'
            }`}
          />
        </div>

        {/* Video Player Container */}
        <div
          className={`relative aspect-[16/9] w-full rounded-sm overflow-hidden shadow-2xl border ${
            isDark ? 'border-neutral-800 bg-black' : 'border-neutral-200 bg-neutral-900'
          }`}
        >
          {isPlaying && embedUrl ? (
            isEmbedIframe ? (
              <iframe
                src={embedUrl}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={embedUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            )
          ) : (
            /* Cinematic Poster Overlay */
            <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
              {/* Poster image background */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400&auto=format&fit=crop"
                alt="Cinematic Video Poster"
                className="w-full h-full object-cover filter contrast-[1.05] brightness-90 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] group-hover:bg-black/30 transition-colors duration-500" />

              {/* Play Button & Overlay Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-3 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 aspect-square rounded-full shrink-0 border border-white/60 bg-black/55 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:border-white group-hover:bg-black/75 transition-all duration-300 shadow-2xl">
                  <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white ml-0.5 fill-white shrink-0" />
                </div>

                <div className="mt-2.5 sm:mt-4 text-center px-3 shrink-0">
                  <p className="font-serif italic text-xs sm:text-base tracking-wide text-white/95 line-clamp-1">
                    &ldquo;Every frame captures a lifetime of promises.&rdquo;
                  </p>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/70 mt-1">
                    Klik untuk memutar video prewedding
                  </p>
                </div>
              </div>

              {/* Film Grain Corner Accents */}
              <div className="absolute top-3 left-4 text-[9px] font-mono tracking-widest text-white/50">
                [4K · 24FPS]
              </div>
              <div className="absolute top-3 right-4 text-[9px] font-mono tracking-widest text-white/50">
                REC ●
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
