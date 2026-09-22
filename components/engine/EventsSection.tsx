'use client';

import React from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { EventDetail, TemplateArchetype } from '@/types';
import { getTemplateById } from '@/lib/store';
import { BalineseGapuraIcon, BalineseOrnamentalDivider } from '@/components/ui/BalineseOrnaments';

interface EventsSectionProps {
  events: EventDetail[];
  isDark?: boolean;
  forceMobile?: boolean;
  templateId?: string;
  archetype?: TemplateArchetype;
  isVideoMotion?: boolean;
}

export function EventsSection({
  events,
  isDark: propIsDark,
  forceMobile = false,
  templateId,
  archetype: propArchetype,
  isVideoMotion: propIsVideoMotion,
}: EventsSectionProps) {
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

  const addToCalendar = (ev: EventDetail) => {
    const startDate = `${ev.date.replace(/-/g, '')}T${ev.startTime.replace(':', '')}00`;
    const endDate = ev.endTime
      ? `${ev.date.replace(/-/g, '')}T${ev.endTime.replace(':', '')}00`
      : startDate;

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      ev.name
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      `Pernikahan di ${ev.venueName}`
    )}&location=${encodeURIComponent(ev.address)}`;

    window.open(gcalUrl, '_blank');
  };

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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 flex flex-col items-center">
          {isBali && <BalineseGapuraIcon className={`w-10 sm:w-12 h-8 sm:h-9 mb-2 ${isVideoMotion ? 'text-[#E5C378]' : 'text-[#B88E4B]'}`} />}
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
                : isZen
                ? 'text-stone-400'
                : 'text-neutral-400'
            }`}
          >
            {isBali
              ? 'DUDONAN ACARA · THE SACRED RITES'
              : isRoma
              ? 'LA FESTA · I DETTAGLI'
              : isZen
              ? '儀式 · CEREMONY TIMETABLE'
              : isCinema
              ? 'CALL SHEET · SCENES'
              : isModern
              ? '02 / THE SCHEDULE'
              : isGarden
              ? "L'ITINÉRAIRE · DETAILS"
              : 'THE ITINERARY'}
          </p>
          <h2 className={`font-serif text-3xl sm:text-4xl uppercase tracking-wider mt-2 ${
            isVideoMotion ? 'text-white drop-shadow-md' : ''
          }`}>
            {isBali ? 'Dudonan Pawiwahan' : 'Rangkaian Acara'}
          </h2>
          {isBali ? (
            <BalineseOrnamentalDivider className={`w-36 sm:w-48 h-4 my-2 ${isVideoMotion ? 'text-[#E5C378]' : 'text-[#B88E4B]'}`} />
          ) : (
            <div
              className={`w-12 h-[1px] mx-auto mt-4 ${
                isVideoMotion
                  ? 'bg-[#E5C378]/50'
                  : isCinema
                  ? 'bg-[#C4B59D]/30'
                  : isRoma
                  ? 'bg-[#C85A32]/25'
                  : isDark
                  ? 'bg-neutral-800'
                  : 'bg-neutral-300'
              }`}
            />
          )}
        </div>

        {/* Layout */}
        <div
          className={
            forceMobile
              ? 'flex flex-col gap-6 max-w-sm mx-auto w-full'
              : 'flex flex-col gap-8 max-w-xl mx-auto w-full'
          }
        >
          {events.map((ev, idx) => {
            const formattedDate = new Date(ev.date).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <div
                key={ev.id}
                className={`p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between ${
                  isCinema
                    ? 'bg-[#121212] text-[#F5F3EF] border-[#C4B59D]/30 shadow-xl'
                    : isBali
                    ? 'bg-white text-[#24201D] border-2 border-[#B88E4B]/40 shadow-xl relative'
                    : isRoma
                    ? 'bg-white text-[#2E221D] border-amber-900/15 shadow-md'
                    : isRomantic
                    ? 'bg-white text-[#3D342E] border-[#9B8070]/25 shadow-sm'
                    : isZen
                    ? 'bg-white text-[#232220] border-stone-300/60 shadow-2xs'
                    : isModern
                    ? 'bg-white text-[#111111] border-2 border-black shadow-none'
                    : isDark
                    ? 'bg-[#151515] text-[#F5F3EF] border-neutral-800 hover:border-neutral-700'
                    : 'bg-white text-[#111111] border-neutral-200/80 hover:border-neutral-400'
                }`}
              >
                {/* Traditional Corner Notches for Balinese Card */}
                {isBali && (
                  <>
                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#8C4830]" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#8C4830]" />
                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#8C4830]" />
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#8C4830]" />
                  </>
                )}
                <div>
                  {/* Category / Scene Pill */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest opacity-70">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formattedDate}</span>
                    </div>
                    <span
                      className={`text-[9px] uppercase tracking-widest px-2 py-0.5 font-medium ${
                        isCinema
                          ? 'bg-[#C4B59D]/20 text-[#C4B59D]'
                          : isBali
                          ? 'bg-[#B88E4B]/15 text-[#8C4830] border border-[#B88E4B]/30'
                          : isRoma
                          ? 'bg-amber-100 text-[#C85A32]'
                          : isModern
                          ? 'bg-black text-white font-mono'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {isCinema ? `SCENE 0${idx + 1}` : isBali ? `PARIKRAMA 0${idx + 1}` : `SESI 0${idx + 1}`}
                    </span>
                  </div>

                  <h3 className={`font-serif text-2xl tracking-wide uppercase leading-snug ${
                    isCinema || isDark ? 'text-[#F5F3EF]' : isBali ? 'text-[#24201D]' : isRoma ? 'text-[#2E221D]' : isRomantic ? 'text-[#3D342E]' : 'text-[#111111]'
                  }`}>
                    {ev.name}
                  </h3>

                  <div className={`flex items-center gap-2 text-xs mt-2.5 ${
                    isCinema || isDark ? 'text-neutral-400' : isBali ? 'text-[#8C4830]' : 'text-neutral-600'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {ev.startTime} - {ev.endTime || 'Selesai'} {ev.timezone}
                    </span>
                  </div>

                  <div
                    className={`my-5 border-t ${
                      isCinema
                        ? 'border-[#C4B59D]/20'
                        : isBali
                        ? 'border-[#B88E4B]/20'
                        : isRoma
                        ? 'border-amber-900/10'
                        : isDark
                        ? 'border-neutral-800'
                        : 'border-neutral-100'
                    }`}
                  />

                  <div className="space-y-1">
                    <h4 className={`font-serif text-base tracking-wide font-medium ${
                      isCinema || isDark ? 'text-white' : isBali ? 'text-[#24201D]' : 'text-neutral-900'
                    }`}>
                      {ev.venueName}
                    </h4>
                    <p className={`text-xs leading-relaxed font-light ${
                      isCinema || isDark ? 'text-neutral-300' : isBali ? 'text-[#5C4D44]' : 'text-neutral-600'
                    }`}>
                      {ev.address}
                    </p>
                  </div>
                </div>

                <div
                  className={`mt-6 flex gap-2.5 pt-4 border-t ${
                    isCinema
                      ? 'border-white/10'
                      : isBali
                      ? 'border-[#B88E4B]/15'
                      : 'border-neutral-100'
                  } ${forceMobile ? 'flex-col' : 'flex-col sm:flex-row'}`}
                >
                  {ev.googleMapsUrl && (
                    <a
                      href={ev.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] uppercase tracking-widest border transition-colors ${
                        isCinema
                          ? 'border-[#C4B59D]/40 text-[#C4B59D] hover:bg-[#C4B59D] hover:text-black'
                          : isBali
                          ? 'border-[#8C4830] text-[#8C4830] hover:bg-[#8C4830] hover:text-[#FAF6F0]'
                          : isRoma
                          ? 'border-[#C85A32] text-[#C85A32] hover:bg-[#C85A32] hover:text-white'
                          : isDark
                          ? 'border-neutral-700 text-neutral-300 hover:bg-white hover:text-black'
                          : 'border-neutral-300 text-neutral-800 hover:bg-black hover:text-white'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Google Maps</span>
                    </a>
                  )}

                  <button
                    onClick={() => addToCalendar(ev)}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] uppercase tracking-widest border transition-colors ${
                      isCinema
                        ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-[#C4B59D]'
                        : isBali
                        ? 'border-[#B88E4B]/40 bg-[#F7F4EE] text-[#8C4830] hover:bg-[#B88E4B]/20'
                        : isRoma
                        ? 'border-amber-200 bg-amber-50 text-[#C85A32] hover:bg-amber-100'
                        : isDark
                        ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Simpan Kalender</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
