'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Invitation } from '@/types';
import { getTemplateById } from '@/lib/store';
import { CoverSection } from './CoverSection';
import { AudioFloatingToggle } from './AudioFloatingToggle';
import { CountdownSection } from './CountdownSection';
import { CoupleSection } from './CoupleSection';
import { EventsSection } from './EventsSection';
import { GallerySection } from './GallerySection';
import { StorySection } from './StorySection';
import { VideoSection } from './VideoSection';
import { RsvpSection } from './RsvpSection';
import { WishesSection } from './WishesSection';
import { GiftSection } from './GiftSection';
import { extractYouTubeId } from '@/lib/media';
import { BalineseOrnamentalDivider } from '@/components/ui/BalineseOrnaments';
import { GuestPassCard } from './GuestPassCard';
import { DocumentationGallerySection } from './DocumentationGallerySection';
import { BaliHeritageLuxuryTemplate } from './templates/BaliHeritageLuxuryTemplate';

interface InvitationEngineProps {
  invitation: Invitation;
  guestName?: string;
  isPreview?: boolean;
  forceMobile?: boolean;
  initialOpen?: boolean;
  isOpenControlled?: boolean;
  onOpenStateChange?: (open: boolean) => void;
  activeSectionTarget?: string;
}

export function InvitationEngine({
  invitation,
  guestName,
  isPreview = false,
  forceMobile = false,
  initialOpen = false,
  isOpenControlled,
  onOpenStateChange,
  activeSectionTarget,
}: InvitationEngineProps) {
  const template = getTemplateById(invitation.templateId);

  // Dedicated Archetype Pipeline: Bali Heritage Luxury
  if (template?.archetype === 'balinese-heritage-luxury' || invitation.templateId === 'bali-heritage') {
    return (
      <BaliHeritageLuxuryTemplate
        invitation={invitation}
        guestName={guestName}
        isPreview={isPreview}
        forceMobile={forceMobile}
        initialOpen={initialOpen}
        isOpenControlled={isOpenControlled}
        onOpenStateChange={onOpenStateChange}
        activeSectionTarget={activeSectionTarget}
      />
    );
  }

  const isControlled = typeof isOpenControlled === 'boolean';
  const [internalIsOpen, setInternalIsOpen] = useState(initialOpen);
  const isOpen = isControlled ? isOpenControlled : internalIsOpen;

  const setIsOpen = (open: boolean) => {
    setInternalIsOpen(open);
    onOpenStateChange?.(open);
  };

  const isDark = template?.theme.isDark || invitation.colorPreset === 'nocturne-black';
  const vis = invitation.sectionVisibility;
  const isVideoMotionTemplate = template?.archetype === 'cinematic-motion' || Boolean(invitation.coverVideoUrl);

  // Auto-scroll when switching preview modes or tabs in builder
  useEffect(() => {
    if (!isPreview) return;

    if (!isOpen) {
      const container = document.getElementById('device-viewport') || document.getElementById('device-viewport-mobile');
      if (container) {
        container.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
      return;
    }

    if (isOpen && activeSectionTarget) {
      const targetMap: Record<string, string> = {
        cover: 'section-cover',
        couple: 'section-couple',
        events: 'section-events',
        gallery: 'section-gallery',
        story: 'section-story',
        video: 'section-video',
        gifts: 'section-gifts',
        rsvp: 'section-rsvp',
      };
      const targetId = targetMap[activeSectionTarget];
      const timer = setTimeout(() => {
        const container = document.getElementById('device-viewport') || document.getElementById('device-viewport-mobile');
        if (targetId) {
          if (targetId === 'section-cover') {
            container?.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          const el = document.getElementById(targetId);
          if (el && container) {
            const containerRect = container.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            const scale = container.offsetHeight > 0 ? containerRect.height / container.offsetHeight : 1;
            const relativeTop = (elRect.top - containerRect.top) / (scale || 1);
            container.scrollTo({ top: Math.max(0, container.scrollTop + relativeTop - 50), behavior: 'smooth' });
            return;
          }
        }
        if (container && container.scrollTop === 0) {
          container.scrollTo({
            top: 680,
            behavior: 'smooth',
          });
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeSectionTarget, isPreview]);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setTimeout(() => {
      const container = document.getElementById('device-viewport') || document.getElementById('device-viewport-mobile');
      if (container) {
        container.scrollTo({
          top: 680,
          behavior: 'smooth',
        });
      } else {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  const isDatePassed = Boolean(
    invitation.eventDate &&
    !isNaN(new Date(invitation.eventDate).getTime()) &&
    new Date(invitation.eventDate).getTime() < Date.now() - 24 * 60 * 60 * 1000
  );
  const isEventPassed = invitation.status === 'EVENT_PASSED' || isDatePassed;

  // Determine section order from template or fallback
  const rawOrder = template?.sectionOrder || [
    'countdown',
    'couple',
    'events',
    'gallery',
    'story',
    'video',
    'rsvp',
    'wishes',
    'gifts',
  ];

  // Filter out 'cover' from the body list since cover is always pinned at the top
  const orderedKeys = rawOrder.filter((key) => key !== 'cover');

  // Ensure standard sections not mentioned in custom order are appended if visible
  const allPossibleKeys = [
    'countdown',
    'couple',
    'events',
    'gallery',
    'story',
    'video',
    'rsvp',
    'wishes',
    'gifts',
  ];
  for (const k of allPossibleKeys) {
    if (!orderedKeys.includes(k)) {
      orderedKeys.push(k);
    }
  }

  // Render dynamic section by key
  const renderSection = (key: string) => {
    switch (key) {
      case 'countdown':
        return vis.countdown ? (
          <div key="countdown" id="section-countdown">
            <CountdownSection
              targetDate={invitation.eventDate}
              isDark={isDark}
              templateId={invitation.templateId}
              archetype={template?.archetype}
              isVideoMotion={isVideoMotionTemplate}
              isEventPassed={isEventPassed}
            />
          </div>
        ) : null;

      case 'couple':
      case 'profile':
        return vis.profile ? (
          <div key="couple" id="section-couple">
            <CoupleSection
              couple={invitation.couple}
              openingQuote={invitation.openingQuote}
              holyVerse={invitation.holyVerse}
              isDark={isDark}
              forceMobile={forceMobile}
              templateId={invitation.templateId}
              archetype={template?.archetype}
              isVideoMotion={isVideoMotionTemplate}
            />
          </div>
        ) : null;

      case 'events':
        return vis.events ? (
          <div key="events" id="section-events">
            <EventsSection
              events={invitation.events}
              isDark={isDark}
              forceMobile={forceMobile}
              templateId={invitation.templateId}
              archetype={template?.archetype}
              isVideoMotion={isVideoMotionTemplate}
            />
          </div>
        ) : null;

      case 'gallery':
        return (
          <React.Fragment key="gallery-fragment">
            {vis.gallery && (
              <div key="gallery" id="section-gallery">
                <GallerySection
                  gallery={invitation.gallery}
                  isDark={isDark}
                  forceMobile={forceMobile}
                  templateId={invitation.templateId}
                  isVideoMotion={isVideoMotionTemplate}
                />
              </div>
            )}
            {/* Always render Memory Vault highlights if documentation photos are present */}
            {invitation.documentationPhotos && invitation.documentationPhotos.length > 0 && (
              <div key="documentation" id="section-documentation">
                <DocumentationGallerySection
                  photos={invitation.documentationPhotos}
                  isDark={isDark}
                  forceMobile={forceMobile}
                  templateId={invitation.templateId}
                  isVideoMotion={isVideoMotionTemplate}
                />
              </div>
            )}
          </React.Fragment>
        );

      case 'story':
        return vis.story ? (
          <div key="story" id="section-story">
            <StorySection
              stories={invitation.loveStories}
              isDark={isDark}
              forceMobile={forceMobile}
              templateId={invitation.templateId}
              archetype={template?.archetype}
              isVideoMotion={isVideoMotionTemplate}
            />
          </div>
        ) : null;

      case 'video':
        return vis.video ? (
          <div key="video" id="section-video">
            <VideoSection
              videoUrl={invitation.videoUrl}
              title={
                template?.archetype === 'dark-luxury-cinema'
                  ? 'SCENE 02 · CINEMATIC TEASER'
                  : template?.archetype === 'romantic-cinema'
                  ? '35MM ROMANTIC FILM'
                  : 'CINEMATIC TEASER'
              }
              subtitle={
                template?.archetype === 'dark-luxury-cinema'
                  ? 'The Nocturne Motion Picture'
                  : template?.archetype === 'romantic-cinema'
                  ? 'Moments Captured in Motion'
                  : 'A Glimpse of Our Journey'
              }
              isDark={isDark}
              forceMobile={forceMobile}
            />
          </div>
        ) : null;

      case 'rsvp':
        return vis.rsvp ? (
          <div key="rsvp" id="section-rsvp">
            <RsvpSection
              invitationId={invitation.id}
              defaultGuestName={guestName}
              isDark={isDark}
              isVideoMotion={isVideoMotionTemplate}
              isEventPassed={isEventPassed}
              thankYouMessage={invitation.thankYouMessage}
              coupleNames={`${invitation.couple.groomNickname} & ${invitation.couple.brideNickname}`}
            />
          </div>
        ) : null;

      case 'wishes':
        return vis.wishes ? (
          <div key="wishes" id="section-wishes">
            <WishesSection
              invitationId={invitation.id}
              defaultSenderName={guestName}
              isDark={isDark}
              forceMobile={forceMobile}
              isVideoMotion={isVideoMotionTemplate}
            />
          </div>
        ) : null;

      case 'gifts':
        return vis.gifts ? (
          <div key="gifts" id="section-gifts">
            <GiftSection
              gifts={invitation.gifts}
              isDark={isDark}
              isVideoMotion={isVideoMotionTemplate}
            />
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const videoSource = invitation.coverVideoUrl || '/videos/elodie-bg.mp4';

  // Customer Customizable Living Video Overlay Settings
  const overlayOpacity = typeof invitation.videoOverlayOpacity === 'number' ? invitation.videoOverlayOpacity : 40;
  const overlayBlur = typeof invitation.videoOverlayBlur === 'number' ? invitation.videoOverlayBlur : 8;
  const overlayTint = invitation.videoOverlayTint || 'noir';

  const tintPalette: Record<string, { r: number; g: number; b: number }> = {
    'noir': { r: 10, g: 10, b: 10 },
    'warm-mocha': { r: 34, g: 20, b: 14 },
    'midnight-navy': { r: 10, g: 18, b: 32 },
  };

  const currentRgb = tintPalette[overlayTint] || tintPalette['noir'];
  const alphaOverlay = Math.min(Math.max(overlayOpacity / 100, 0.05), 0.95);
  const alphaSection = Math.min(Math.max((overlayOpacity + 10) / 100, 0.1), 0.92);
  const alphaFooter = Math.min(Math.max((overlayOpacity + 20) / 100, 0.15), 0.96);

  const dynamicCssVariables: React.CSSProperties = isVideoMotionTemplate
    ? ({
        '--video-blur': `${overlayBlur}px`,
        '--video-section-bg': `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${alphaSection})`,
        '--video-footer-bg': `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${alphaFooter})`,
      } as React.CSSProperties)
    : {};

  return (
    <div
      className={`relative min-h-full font-sans transition-colors duration-500 ${
        isVideoMotionTemplate
          ? 'video-motion-theme bg-transparent text-[#F8F6F0]'
          : isDark
          ? 'bg-[#0C0C0C] text-[#F5F3EF]'
          : 'bg-[#F8F7F3] text-[#111111]'
      }`}
      style={dynamicCssVariables}
    >
      {/* Background Audio Floating Indicator */}
      <AudioFloatingToggle
        audioUrl={invitation.musicUrl}
        isUnlocked={isOpen}
        isDark={isDark}
        forceMobile={forceMobile}
      />

      {/* Persistent Full-Page Video Background Canvas (Stays fixed across entire invitation!) */}
      {isVideoMotionTemplate && (() => {
        const youtubeId = extractYouTubeId(videoSource);
        return (
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {youtubeId ? (
              <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&enablejsapi=1`}
                  title="Background Video"
                  allow="autoplay; encrypted-media"
                  className="w-[380%] h-[100%] max-w-none pointer-events-none object-cover filter brightness-[0.88] contrast-[1.05]"
                  style={{
                    minWidth: '300%',
                    minHeight: '100%',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            ) : (
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={invitation.coverImageUrl}
                className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.05]"
              >
                <source src={videoSource} type="video/mp4" />
              </video>
            )}
            {/* Ambient Living Video Overlay - Customer Configurable Tint and Darkness */}
            <div
              className="absolute inset-0 transition-colors duration-300"
              style={{
                backgroundColor: `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${alphaOverlay})`,
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                background: `linear-gradient(to bottom, rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${Math.min(
                  alphaOverlay + 0.2,
                  0.92
                )}) 0%, transparent 40%, rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${Math.min(
                  alphaOverlay + 0.35,
                  0.96
                )}) 100%)`,
              }}
            />
          </div>
        );
      })()}

      {/* Relative container for all interactive content on top of the video */}
      <div className="relative z-10">
        {/* Hero Cover Screen */}
        <CoverSection
          invitation={invitation}
          guestName={guestName}
          isDark={isDark}
          onOpenInvitation={handleOpenInvitation}
          isOpen={isOpen}
          forceMobile={forceMobile}
        />

        {/* Invitation Body (unfolds once opened) */}
        {isOpen && (
          <div
            className={`animate-fade-in transition-opacity duration-700 ${
              isVideoMotionTemplate
                ? '[&>section]:!bg-black/40 [&>section]:backdrop-blur-md [&>section]:!border-white/10 [&_input]:!bg-white/10 [&_input]:!border-white/20 [&_input]:!text-white [&_textarea]:!bg-white/10 [&_textarea]:!border-white/20 [&_textarea]:!text-white'
                : ''
            }`}
          >
            {orderedKeys.map((sectionKey) => renderSection(sectionKey))}

            {/* Digital Guest Pass Card (QR Access Ticket) - Only rendered when qr-checkin-pass addon is active */}
            {guestName && Boolean(invitation.activeAddonIds?.includes('qr-checkin-pass')) && (
              <GuestPassCard
                invitationId={invitation.id}
                slug={invitation.slug}
                guestName={guestName}
                isDark={isDark}
              />
            )}

            {/* Minimalist Editorial Footer */}
            <footer
              className={`py-16 px-6 text-center border-t text-xs ${
                isVideoMotionTemplate
                  ? 'border-white/15 bg-black/50 backdrop-blur-md text-white/70'
                  : isDark
                  ? 'border-neutral-900 bg-[#080808] text-neutral-500'
                  : 'border-neutral-200 bg-[#F8F7F3] text-neutral-400'
              }`}
            >
              {template?.archetype === 'balinese-heritage' && (
                <div className="mb-6 flex flex-col items-center">
                  <BalineseOrnamentalDivider className="max-w-[200px] mb-3 opacity-60" />
                  <p className="text-[11px] tracking-widest text-[#B88E4B] font-serif uppercase">
                    Matur Suksma
                  </p>
                  <p className="text-[10px] tracking-widest text-neutral-400 italic mt-0.5">
                    Om Shanti Shanti Shanti Om
                  </p>
                </div>
              )}
              <p className="font-serif text-lg tracking-wider uppercase mb-1">
                {invitation.couple.groomNickname} &amp; {invitation.couple.brideNickname}
              </p>
              <div className="flex flex-col items-center justify-center gap-1.5 mt-4 pt-4 border-t border-current/10 opacity-70">
                <div className="relative w-5 h-5 opacity-80">
                  <Image
                    src="/images/logo-icon.png"
                    alt="Kertas.Kata"
                    width={20}
                    height={20}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[9px] uppercase tracking-ultra">
                  POWERED BY KERTAS.KATA · SIMPLE. ELEGANT. EXCLUSIVE.
                </p>
              </div>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
