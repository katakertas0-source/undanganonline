'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  ChevronDown,
  Menu,
  X,
  Home,
  User,
  Sparkles,
  Calendar,
  MapPin,
  Image as ImageIcon,
  CheckSquare,
  Gift,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Film,
} from 'lucide-react';
import { Invitation, LoveStoryItem, EventDetail, GalleryItem, GiftAccount } from '@/types';
import { submitRsvp, submitRsvpAsync } from '@/lib/store';
import { AudioFloatingToggle } from '@/components/engine/AudioFloatingToggle';
import { GuestPassCard } from '@/components/engine/GuestPassCard';
import { BalineseStarOrnament } from '@/components/ui/BalineseStarOrnament';
import { extractYouTubeId } from '@/lib/media';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  className?: string;
}

function Reveal({ children, delay = 0, yOffset = 30, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Detect actual ancestor scroll container
    const container =
      el.closest('#device-viewport') ||
      el.closest('#device-viewport-mobile') ||
      el.closest('[data-device-viewport]') ||
      null;

    const checkVisibility = () => {
      if (!el) return false;
      const elRect = el.getBoundingClientRect();
      if (elRect.width === 0 && elRect.height === 0) return false;

      if (container) {
        const cRect = container.getBoundingClientRect();
        // Trigger as soon as the top of the element enters the bottom of the container
        const triggerPoint = cRect.bottom - 20;
        if (elRect.top <= triggerPoint && elRect.bottom >= cRect.top - 60) {
          setIsVisible(true);
          return true;
        }
      } else if (typeof window !== 'undefined') {
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const triggerPoint = windowHeight - 20;
        if (elRect.top <= triggerPoint && elRect.bottom >= -60) {
          setIsVisible(true);
          return true;
        }
      }
      return false;
    };

    // Check after layout paint
    const rafId = requestAnimationFrame(() => {
      checkVisibility();
    });

    // Passive scroll listener: triggers smoothly when user scrolls the phone container or window
    const scrollTarget = container || (typeof window !== 'undefined' ? window : null);
    const handleScroll = () => {
      if (checkVisibility() && scrollTarget) {
        scrollTarget.removeEventListener('scroll', handleScroll);
        if (observer) observer.disconnect();
      }
    };

    if (scrollTarget) {
      scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
    }

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      try {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setIsVisible(true);
                if (scrollTarget) {
                  scrollTarget.removeEventListener('scroll', handleScroll);
                }
                observer?.unobserve(entry.target);
              }
            });
          },
          {
            root: container,
            threshold: 0.05,
            rootMargin: '0px 0px -20px 0px',
          }
        );
        observer.observe(el);
      } catch {
        // Fallback gracefully to scroll listener
      }
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (scrollTarget) {
        scrollTarget.removeEventListener('scroll', handleScroll);
      }
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionProperty: 'opacity, transform',
        transitionDuration: '800ms',
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : `translateY(${yOffset}px)`,
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

interface BaliHeritageLuxuryTemplateProps {
  invitation: Invitation;
  guestName?: string;
  isPreview?: boolean;
  forceMobile?: boolean;
  initialOpen?: boolean;
  isOpenControlled?: boolean;
  onOpenStateChange?: (open: boolean) => void;
  activeSectionTarget?: string;
}

export function BaliHeritageLuxuryTemplate({
  invitation,
  guestName,
  isPreview = false,
  forceMobile = false,
  initialOpen = false,
  isOpenControlled,
  onOpenStateChange,
  activeSectionTarget,
}: BaliHeritageLuxuryTemplateProps) {
  const isControlled = typeof isOpenControlled === 'boolean';
  const [internalIsOpen, setInternalIsOpen] = useState(initialOpen);
  const isOpen = isControlled ? isOpenControlled : internalIsOpen;

  const setIsOpen = (open: boolean) => {
    setInternalIsOpen(open);
    onOpenStateChange?.(open);
  };

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeGiftTab, setActiveGiftTab] = useState<'BANK' | 'EWALLET'>('BANK');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState(guestName || '');
  const [rsvpStatus, setRsvpStatus] = useState<'ATTENDING' | 'NOT_ATTENDING'>('ATTENDING');
  const [rsvpPax, setRsvpPax] = useState<number>(1);
  const [rsvpNotes, setRsvpNotes] = useState('');
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);

  // Couple Data with safe fallbacks
  const couple = invitation.couple;
  const groomNickname = couple.groomNickname || 'Putu';
  const brideNickname = couple.brideNickname || 'Sinta';
  const groomName = couple.groomName || 'I Putu Wira Yasa, S.T.';
  const brideName = couple.brideName || 'Ni Kadek Sinta Dewi, B.Des';
  const groomPhoto = couple.groomPhotoUrl || invitation.coverImageUrl || '/images/bali-heritage-cover.jpg';
  const bridePhoto = couple.bridePhotoUrl || invitation.coverImageUrl || '/images/bali-heritage-secondary.jpg';
  const coverImage = invitation.coverImageUrl || '/images/bali-heritage-cover.jpg';

  // About Section Photos Carousel State
  const [currentAboutIndex, setCurrentAboutIndex] = useState(0);
  const aboutPhotos = [
    bridePhoto,
    groomPhoto,
    coverImage,
    ...(invitation.gallery?.map((g) => g.imageUrl) || []),
  ].filter(Boolean);
  const activeAboutPhoto = aboutPhotos[currentAboutIndex % (aboutPhotos.length || 1)] || bridePhoto;

  // Format date display
  const rawDate = invitation.eventDate || '2026-10-24';
  const formattedDottedDate = (() => {
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return '24 . 10 . 2026';
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day} . ${month} . ${year}`;
    } catch {
      return '24 . 10 . 2026';
    }
  })();

  const vis = invitation.sectionVisibility;

  // Living Video Background Detection
  const hasVideoBg = Boolean(invitation.coverVideoUrl) || Boolean(invitation.activeAddonIds?.includes('living-video-bg'));
  const videoSource = invitation.coverVideoUrl || '/videos/elodie-bg.mp4';

  // Font Preset System: editorial-cormorant (default), modern-serif, clean-sans
  const fontPreset = invitation.fontPreset || 'editorial-cormorant';
  const isCleanSans = fontPreset === 'clean-sans';
  const isModernSerif = fontPreset === 'modern-serif';

  const headingFontClass = isCleanSans
    ? 'font-sans font-light tracking-[0.22em]'
    : isModernSerif
    ? 'font-serif font-medium tracking-[0.18em]'
    : 'font-serif font-normal tracking-[0.14em]';

  const titleFontClass = isCleanSans
    ? 'font-sans font-medium tracking-[0.2em]'
    : isModernSerif
    ? 'font-serif font-medium tracking-wider'
    : 'font-serif font-normal tracking-wider';

  const quoteFontClass = isCleanSans
    ? 'font-sans font-light tracking-wide text-xs not-italic'
    : 'font-serif italic';

  // Color & Theme Presets: nocturne-black (default), warm-linen, offwhite-noir
  const colorPreset = invitation.colorPreset || 'nocturne-black';
  const theme = {
    'nocturne-black': {
      darkBg: 'bg-[#0D0C0A]',
      darkBgHex: '#0D0C0A',
      lightBg: 'bg-[#F3EEE5]',
      darkText: 'text-[#F3EEE5]',
      lightText: 'text-[#2B241E]',
      goldAccent: 'text-[#B89A5A]',
      goldBg: 'bg-[#B89A5A]',
      goldBorder: 'border-[#B89A5A]',
      softGoldText: 'text-[#D6C29A]',
      lightSubText: 'text-[#8C6D38]',
      cardDarkBg: 'bg-[#161412]',
      cardLightBg: 'bg-white/80',
      borderDarkAlpha: 'border-[#B89A5A]/25',
      borderLightAlpha: 'border-[#2B241E]/10',
      isDarkAudio: true,
      btnOpen: 'bg-[#0D0C0A]/90 border-[#B89A5A] text-[#F3EEE5] hover:bg-[#B89A5A] hover:text-[#0D0C0A] hover:border-[#B89A5A]',
      btnSecondary: 'border-[#2B241E]/15 text-[#2B241E] hover:bg-[#B89A5A] hover:text-[#0D0C0A] hover:border-[#B89A5A]',
      hoverGoldText: 'hover:text-[#B89A5A]',
      hoverLightText: 'hover:text-[#2B241E]',
      groupHoverGoldBg: 'group-hover:bg-[#B89A5A]',
    },
    'warm-linen': {
      darkBg: 'bg-[#1C1713]',
      darkBgHex: '#1C1713',
      lightBg: 'bg-[#FAF7F2]',
      darkText: 'text-[#F7F4EE]',
      lightText: 'text-[#362C24]',
      goldAccent: 'text-[#C4A060]',
      goldBg: 'bg-[#C4A060]',
      goldBorder: 'border-[#C4A060]',
      softGoldText: 'text-[#DEC599]',
      lightSubText: 'text-[#96743D]',
      cardDarkBg: 'bg-[#26201B]',
      cardLightBg: 'bg-white/90',
      borderDarkAlpha: 'border-[#C4A060]/25',
      borderLightAlpha: 'border-[#362C24]/10',
      isDarkAudio: true,
      btnOpen: 'bg-[#1C1713]/90 border-[#C4A060] text-[#F7F4EE] hover:bg-[#C4A060] hover:text-[#1C1713] hover:border-[#C4A060]',
      btnSecondary: 'border-[#362C24]/15 text-[#362C24] hover:bg-[#C4A060] hover:text-[#1C1713] hover:border-[#C4A060]',
      hoverGoldText: 'hover:text-[#C4A060]',
      hoverLightText: 'hover:text-[#362C24]',
      groupHoverGoldBg: 'group-hover:bg-[#C4A060]',
    },
    'offwhite-noir': {
      darkBg: 'bg-[#080808]',
      darkBgHex: '#080808',
      lightBg: 'bg-[#FFFFFF]',
      darkText: 'text-[#FFFFFF]',
      lightText: 'text-[#111111]',
      goldAccent: 'text-[#D4AF37]',
      goldBg: 'bg-[#D4AF37]',
      goldBorder: 'border-[#D4AF37]',
      softGoldText: 'text-[#E5C365]',
      lightSubText: 'text-[#735C24]',
      cardDarkBg: 'bg-[#121212]',
      cardLightBg: 'bg-[#F7F7F7]',
      borderDarkAlpha: 'border-[#D4AF37]/25',
      borderLightAlpha: 'border-[#111111]/10',
      isDarkAudio: true,
      btnOpen: 'bg-[#080808]/90 border-[#D4AF37] text-[#FFFFFF] hover:bg-[#D4AF37] hover:text-[#080808] hover:border-[#D4AF37]',
      btnSecondary: 'border-[#111111]/15 text-[#111111] hover:bg-[#D4AF37] hover:text-[#080808] hover:border-[#D4AF37]',
      hoverGoldText: 'hover:text-[#D4AF37]',
      hoverLightText: 'hover:text-[#111111]',
      groupHoverGoldBg: 'group-hover:bg-[#D4AF37]',
    },
  }[colorPreset] || {
    darkBg: 'bg-[#0D0C0A]',
    darkBgHex: '#0D0C0A',
    lightBg: 'bg-[#F3EEE5]',
    darkText: 'text-[#F3EEE5]',
    lightText: 'text-[#2B241E]',
    goldAccent: 'text-[#B89A5A]',
    goldBg: 'bg-[#B89A5A]',
    goldBorder: 'border-[#B89A5A]',
    softGoldText: 'text-[#D6C29A]',
    lightSubText: 'text-[#8C6D38]',
    cardDarkBg: 'bg-[#161412]',
    cardLightBg: 'bg-white/80',
    borderDarkAlpha: 'border-[#B89A5A]/25',
    borderLightAlpha: 'border-[#2B241E]/10',
    isDarkAudio: true,
    btnOpen: 'bg-[#0D0C0A]/90 border-[#B89A5A] text-[#F3EEE5] hover:bg-[#B89A5A] hover:text-[#0D0C0A] hover:border-[#B89A5A]',
    btnSecondary: 'border-[#2B241E]/15 text-[#2B241E] hover:bg-[#B89A5A] hover:text-[#0D0C0A] hover:border-[#B89A5A]',
    hoverGoldText: 'hover:text-[#B89A5A]',
    hoverLightText: 'hover:text-[#2B241E]',
    groupHoverGoldBg: 'group-hover:bg-[#B89A5A]',
  };

  // High-precision smooth scroll helper with native scrollIntoView and container fallback
  const performSmoothScroll = (targetId: string) => {
    setIsNavOpen(false);

    setTimeout(() => {
      // Find active container (the one that is actually visible in the DOM)
      const desktopContainer = document.getElementById('device-viewport');
      const mobileContainer = document.getElementById('device-viewport-mobile');
      const container =
        (desktopContainer && desktopContainer.clientHeight > 0 ? desktopContainer : null) ||
        (mobileContainer && mobileContainer.clientHeight > 0 ? mobileContainer : null) ||
        null;

      // Special case: Cover / Beranda
      if (targetId === 'section-cover') {
        if (container) {
          container.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      const el = document.getElementById(targetId);
      if (!el) return;

      // 1. Native scrollIntoView works seamlessly across all platforms, viewports, and scales
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // 2. Direct container scrollTo calculation for device frame
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const scale = container.offsetHeight > 0 ? containerRect.height / container.offsetHeight : 1;
        const relativeTop = (elRect.top - containerRect.top) / (scale || 1);
        const targetScroll = container.scrollTop + relativeTop - 52;
        container.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: 'smooth',
        });
      } else {
        const elRect = el.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const targetScroll = scrollTop + elRect.top - 52;
        window.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: 'smooth',
        });
      }
    }, 60);
  };

  // Auto-scroll inside preview container if activeSectionTarget changes
  const prevActiveTargetRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!isPreview) return;

    if (!isOpen) {
      const desktopContainer = document.getElementById('device-viewport');
      const mobileContainer = document.getElementById('device-viewport-mobile');
      const container = (desktopContainer && desktopContainer.clientHeight > 0 ? desktopContainer : null) || mobileContainer;
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
      prevActiveTargetRef.current = undefined;
      return;
    }

    const targetMap: Record<string, string> = {
      cover: 'section-cover',
      couple: 'section-tentang',
      events: 'section-acara',
      gallery: 'section-galeri',
      story: 'section-kisah',
      video: 'section-video',
      gifts: 'section-tanda-kasih',
      rsvp: 'section-rsvp',
    };

    // Only scroll if activeSectionTarget actually changed from outside builder tabs
    if (activeSectionTarget && activeSectionTarget !== prevActiveTargetRef.current) {
      prevActiveTargetRef.current = activeSectionTarget;
      const targetId = targetMap[activeSectionTarget];
      if (targetId) {
        const timer = setTimeout(() => {
          performSmoothScroll(targetId);
        }, 80);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, activeSectionTarget, isPreview]);

  // Handle open invitation
  const handleOpenInvitation = () => {
    setIsOpen(true);
    setTimeout(() => {
      performSmoothScroll('section-tentang');
    }, 120);
  };

  // Scroll to section from navigation drawer
  const scrollToSection = (sectionId: string) => {
    setIsNavOpen(false);
    performSmoothScroll(sectionId);
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // RSVP Submission
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || isSubmittingRsvp) return;

    setIsSubmittingRsvp(true);
    try {
      await submitRsvpAsync(
        invitation.id,
        rsvpName,
        rsvpStatus,
        rsvpStatus === 'NOT_ATTENDING' ? 0 : rsvpPax,
        rsvpNotes
      );
      setIsRsvpSubmitted(true);
    } catch (err) {
      console.warn('RSVP submit error, falling back locally:', err);
      submitRsvp(
        invitation.id,
        rsvpName,
        rsvpStatus,
        rsvpStatus === 'NOT_ATTENDING' ? 0 : rsvpPax,
        rsvpNotes
      );
      setIsRsvpSubmitted(true);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  // Lightbox keyboard controls
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight' && invitation.gallery.length > 0) {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % invitation.gallery.length : null));
      }
      if (e.key === 'ArrowLeft' && invitation.gallery.length > 0) {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + invitation.gallery.length) % invitation.gallery.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, invitation.gallery]);

  // Filter gifts by tab
  const filteredGifts = (invitation.gifts || []).filter((g) => {
    if (activeGiftTab === 'BANK') return g.type === 'BANK';
    return g.type === 'EWALLET' || g.type === 'QRIS';
  });
  const hasGifts = invitation.gifts && invitation.gifts.length > 0;
  const primaryEvent = invitation.events && invitation.events.length > 0 ? invitation.events[0] : null;

  return (
    <div
      className={`template-bali-heritage relative ${
        !isOpen
          ? isPreview
            ? 'h-full min-h-full overflow-hidden'
            : 'h-[100dvh] min-h-[100dvh] h-screen min-h-screen overflow-hidden'
          : 'min-h-screen min-h-[100dvh]'
      } w-full ${theme.darkBg} ${theme.darkText} font-sans antialiased select-none`}
    >
      {/* Background Audio Floating Indicator */}
      <AudioFloatingToggle
        audioUrl={invitation.musicUrl}
        isUnlocked={isOpen}
        isDark={theme.isDarkAudio}
        forceMobile={forceMobile}
      />

      {/* ========================================================================= */}
      {/* STICKY TOP BAR (Screen 2-9 Header Bar)                                   */}
      {/* ========================================================================= */}
      {isOpen && (
        <header className={`sticky top-0 z-40 w-full ${theme.darkBg}/90 backdrop-blur-md border-b ${theme.borderDarkAlpha} transition-all duration-300`}>
          <div className="max-w-md sm:max-w-lg mx-auto px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`${headingFontClass} text-xs uppercase ${theme.darkText}`}>
                {groomNickname}
              </span>
              <BalineseStarOrnament className={`w-3.5 h-3.5 ${theme.goldAccent}`} />
              <span className={`${headingFontClass} text-xs uppercase ${theme.darkText}`}>
                {brideNickname}
              </span>
            </div>

            <button
              onClick={() => setIsNavOpen(true)}
              aria-label="Buka Menu Navigasi"
              className={`p-1.5 ${theme.darkText} ${theme.hoverGoldText} transition-colors cursor-pointer`}
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </header>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 10: NAVIGATION MENU DRAWER OVERLAY                                */}
      {/* ========================================================================= */}
      {isNavOpen && (
        <div className={`fixed inset-0 z-50 ${theme.darkBg} ${theme.darkText} flex flex-col justify-between p-6 sm:p-8 animate-fade-in`}>
          {/* Drawer Header */}
          <div className={`flex items-center justify-between border-b ${theme.borderDarkAlpha} pb-4`}>
            <div className="flex items-center gap-2">
              <span className={`${headingFontClass} text-sm uppercase ${theme.darkText}`}>
                {groomNickname}
              </span>
              <BalineseStarOrnament className={`w-4 h-4 ${theme.goldAccent}`} />
              <span className={`${headingFontClass} text-sm uppercase ${theme.darkText}`}>
                {brideNickname}
              </span>
            </div>
            <button
              onClick={() => setIsNavOpen(false)}
              aria-label="Tutup Menu"
              className={`p-2 ${theme.darkText} ${theme.hoverGoldText} transition-colors cursor-pointer`}
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="my-auto py-6 space-y-5 max-w-xs mx-auto w-full">
            {(() => {
              const hasVideo = vis.video || Boolean(invitation.videoUrl) || invitation.activeAddonIds?.includes('video-prewedding');
              return [
                { id: 'section-cover', label: 'Beranda', icon: Home },
                { id: 'section-tentang', label: 'Tentang Kami', icon: User },
                { id: 'section-kisah', label: 'Kisah Kami', icon: Sparkles },
                ...(hasVideo ? [{ id: 'section-video', label: 'Sinematika Video', icon: Film }] : []),
                { id: 'section-acara', label: 'Rangkaian Acara', icon: Calendar },
                { id: 'section-lokasi', label: 'Lokasi', icon: MapPin },
                { id: 'section-galeri', label: 'Galeri', icon: ImageIcon },
                { id: 'section-rsvp', label: 'RSVP', icon: CheckSquare },
                { id: 'section-tanda-kasih', label: 'Tanda Kasih', icon: Gift },
              ];
            })().map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`w-full flex items-center gap-4 text-sm uppercase tracking-[0.18em] ${theme.darkText}/85 ${theme.hoverGoldText} transition-colors text-left group cursor-pointer`}
              >
                <Icon className={`w-4 h-4 ${theme.goldAccent} group-hover:scale-110 transition-transform`} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Drawer Footer */}
          <div className={`pt-6 border-t ${theme.borderDarkAlpha} text-center flex flex-col items-center`}>
            <p className={`${quoteFontClass} text-xs ${theme.softGoldText} tracking-wider mb-2`}>
              &ldquo;Dua Hati Satu Perjalanan Dalam Restu Semesta&rdquo;
            </p>
            <BalineseStarOrnament className={`w-5 h-5 ${theme.goldAccent}`} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 1: COVER & OPENING                                                 */}
      {/* ========================================================================= */}
      <section
        id="section-cover"
        className={`relative ${
          !isOpen
            ? isPreview
              ? 'h-full min-h-full'
              : 'h-[100dvh] min-h-[100dvh] h-screen min-h-screen'
            : isPreview && forceMobile
            ? 'min-h-[716px]'
            : 'min-h-[100dvh] sm:min-h-screen'
        } w-full flex flex-col justify-between items-center text-center px-4 sm:px-6 pt-12 sm:pt-14 pb-8 sm:pb-10 overflow-hidden select-none`}
      >
        {/* Full-bleed Portrait Cover Photo or Living Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {hasVideoBg ? (
            (() => {
              const youtubeId = extractYouTubeId(videoSource);
              if (youtubeId) {
                return (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&enablejsapi=1`}
                      title="Living Video Background"
                      allow="autoplay; encrypted-media"
                      className="w-[380%] h-[100%] max-w-none pointer-events-none object-cover filter brightness-[0.88] contrast-[1.05]"
                      style={{
                        minWidth: '300%',
                        minHeight: '100%',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                );
              }
              return (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={coverImage}
                  className="w-full h-full object-cover object-top"
                >
                  <source src={videoSource} type="video/mp4" />
                </video>
              );
            })()
          ) : (
            <img
              src={coverImage}
              alt={invitation.title}
              className="w-full h-full object-cover object-top"
            />
          )}

          {/* Living video ambient overlay controlled by videoOverlayOpacity */}
          {hasVideoBg && (
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{ backgroundColor: `rgba(0, 0, 0, ${(invitation.videoOverlayOpacity ?? 40) / 100})` }}
            />
          )}

          {/* Curated Vignette: Subtle at top for Om Swastyastu, crystal clear in middle for faces/crowns, targeted at bottom for text */}
          <div 
            className="absolute inset-x-0 top-0 h-20 pointer-events-none" 
            style={{
              background: `linear-gradient(to bottom, ${theme.darkBgHex}CC, ${theme.darkBgHex}33 60%, transparent)`
            }}
          />
          <div 
            className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none" 
            style={{
              background: `linear-gradient(to top, ${theme.darkBgHex} 0%, ${theme.darkBgHex}F2 30%, ${theme.darkBgHex}CC 55%, ${theme.darkBgHex}4D 80%, transparent 100%)`
            }}
          />
        </div>

        {/* Top Header: Star Ornament + Om Swastyastu */}
        <div className="relative z-10 pt-1 flex flex-col items-center shrink-0">
          <BalineseStarOrnament className={`w-5 h-5 ${theme.goldAccent} mb-1.5`} />
          <p className={`text-[9px] uppercase tracking-[0.25em] ${theme.softGoldText} font-medium`}>
            OM SWASTYASTU
          </p>
        </div>

        {/* Middle Spacer: Keeps couple's faces completely unobstructed */}
        <div className="flex-1 w-full min-h-12" />

        {/* Bottom: Pawiwahan, Couple Name, Date, Quote & Buka Undangan CTA Button */}
        <div className="relative z-10 w-full max-w-xs mx-auto flex flex-col items-center pb-2 shrink-0">
          <p className={`text-[9px] uppercase tracking-[0.3em] ${theme.softGoldText} ${isCleanSans ? 'font-sans' : 'font-serif'} font-light mb-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]`}>
            {invitation.coverTitle || 'PAWIWAHAN'}
          </p>

          <h1 className={`${headingFontClass} text-2xl sm:text-3xl uppercase leading-tight whitespace-nowrap mb-1 ${theme.darkText} drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]`}>
            {groomNickname} &amp; {brideNickname}
          </h1>

          <p className={`${isCleanSans ? 'font-mono' : 'font-serif'} text-[10px] sm:text-[11px] tracking-[0.22em] ${theme.softGoldText} drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]`}>
            {formattedDottedDate}
          </p>

          <div className={`w-8 h-[1px] ${theme.goldBg}/50 my-2`} />

          <p className={`${quoteFontClass} text-[10px] sm:text-[11px] ${theme.darkText}/85 leading-relaxed mb-3.5 whitespace-pre-line text-center`}>
            &ldquo;Dua Hati
            <br />
            Satu Perjalanan
            <br />
            Dalam Restu Semesta&rdquo;
          </p>

          {!isOpen ? (
            <button
              onClick={handleOpenInvitation}
              className={`group inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] border ${theme.btnOpen} transition-all duration-300 shadow-xl active:scale-95 cursor-pointer backdrop-blur-sm`}
            >
              <span>BUKA UNDANGAN</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1 text-[9px]">→</span>
            </button>
          ) : (
            <button
              onClick={() => scrollToSection('section-tentang')}
              className={`inline-flex items-center gap-1 text-[9px] uppercase tracking-widest ${theme.softGoldText} hover:text-white transition-colors cursor-pointer`}
            >
              <span>Scroll Ke Bawah</span>
              <ChevronDown className="w-3 h-3 animate-bounce" />
            </button>
          )}

          <div className="mt-2 opacity-60">
            <ChevronDown className={`w-3.5 h-3.5 ${theme.softGoldText} animate-pulse`} />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* UNVEILED INVITATION BODY (Rendered after Buka Undangan)                   */}
      {/* ========================================================================= */}
      {isOpen && (
        <div className="animate-fade-in transition-opacity duration-700">
          {/* ===================================================================== */}
          {/* SCREEN 2: TENTANG KAMI                                               */}
          {/* ===================================================================== */}
          {vis.profile && (
            <section
              id="section-tentang"
              className={`${theme.lightBg} ${theme.lightText} py-16 sm:py-20 px-6 transition-colors duration-500 text-center scroll-mt-14`}
            >
              <div className="max-w-md sm:max-w-lg mx-auto flex flex-col items-center">
                <Reveal delay={0}>
                  <h2 className={`${titleFontClass} text-2xl sm:text-3xl uppercase tracking-wider ${theme.lightText}`}>
                    TENTANG KAMI
                  </h2>
                  <p className={`${quoteFontClass} text-xs sm:text-sm ${theme.lightSubText} mt-1 mb-8`}>
                    Dua Jiwa, Satu Tujuan
                  </p>
                </Reveal>

                {/* Large Editorial Portrait Photo */}
                <Reveal delay={120} className="w-full flex justify-center">
                  <div className={`w-full aspect-[3/4] max-w-xs sm:max-w-sm rounded-sm overflow-hidden shadow-2xl border ${theme.borderLightAlpha} mb-6 relative bg-neutral-200`}>
                    <img
                      key={activeAboutPhoto}
                      src={activeAboutPhoto}
                      alt={`${groomNickname} & ${brideNickname}`}
                      className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                    />
                  </div>
                </Reveal>

                {/* Couple Names & Family Lineage if available */}
                {(couple.groomName || couple.brideName) && (
                  <Reveal delay={180} className="w-full flex justify-center">
                    <div className="mb-6 space-y-3 max-w-sm text-center">
                      {couple.groomName && (
                        <div>
                          <h3 className={`${titleFontClass} text-sm uppercase tracking-wider font-semibold ${theme.lightText}`}>
                            {couple.groomName}
                          </h3>
                          {(couple.groomFather || couple.groomMother) && (
                            <p className="text-[11px] text-[#7C7267] mt-0.5 font-light">
                              Putra dari {[couple.groomFather, couple.groomMother].filter(Boolean).join(' & ')}
                            </p>
                          )}
                        </div>
                      )}
                      {couple.groomName && couple.brideName && (
                        <span className={`italic font-serif text-sm ${theme.goldAccent} block`}>&amp;</span>
                      )}
                      {couple.brideName && (
                        <div>
                          <h3 className={`${titleFontClass} text-sm uppercase tracking-wider font-semibold ${theme.lightText}`}>
                            {couple.brideName}
                          </h3>
                          {(couple.brideFather || couple.brideMother) && (
                            <p className="text-[11px] text-[#7C7267] mt-0.5 font-light">
                              Putri dari {[couple.brideFather, couple.brideMother].filter(Boolean).join(' & ')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </Reveal>
                )}

                {/* Narrative Clean Paragraph */}
                <Reveal delay={220} className="w-full flex justify-center">
                  <p className={`text-xs sm:text-sm ${theme.lightText}/80 leading-relaxed max-w-sm mb-6 ${isCleanSans ? 'font-sans' : 'font-serif'}`}>
                    {invitation.openingQuote ||
                      'Kami dipertemukan oleh waktu, dipersatukan oleh cinta, dan akan melangkah bersama dalam ikatan suci Pawiwahan.'}
                  </p>
                </Reveal>

                {/* Balinese Star Ornament */}
                <Reveal delay={260}>
                  <BalineseStarOrnament className={`w-6 h-6 ${theme.goldAccent} my-4 mx-auto`} />
                </Reveal>

                {/* Carousel Pagination Controls */}
                {aboutPhotos.length > 1 && (
                  <Reveal delay={280}>
                    <div className={`flex items-center justify-center gap-4 text-xs ${isCleanSans ? 'font-mono' : 'font-serif'} ${theme.lightText}/60 pt-2`}>
                      <button
                        type="button"
                        onClick={() => setCurrentAboutIndex((prev) => (prev > 0 ? prev - 1 : aboutPhotos.length - 1))}
                        className={`${theme.hoverGoldText} transition-colors p-1 cursor-pointer`}
                        aria-label="Foto Sebelumnya"
                      >
                        ‹
                      </button>
                      <span className={`tracking-widest ${theme.lightText} font-medium`}>
                        {(currentAboutIndex % aboutPhotos.length) + 1}
                      </span>
                      <span className={`${theme.lightText}/40`}>{aboutPhotos.length}</span>
                      <button
                        type="button"
                        onClick={() => setCurrentAboutIndex((prev) => (prev + 1) % aboutPhotos.length)}
                        className={`${theme.hoverGoldText} transition-colors p-1 cursor-pointer`}
                        aria-label="Foto Selanjutnya"
                      >
                        ›
                      </button>
                    </div>
                  </Reveal>
                )}
              </div>
            </section>
          )}

          {/* ===================================================================== */}
          {/* SCREEN 3: KISAH KAMI                                                 */}
          {/* ===================================================================== */}
          {vis.story && invitation.loveStories && invitation.loveStories.length > 0 && (
            <section
              id="section-kisah"
              className={`relative ${theme.darkBg} ${theme.darkText} py-20 px-6 overflow-hidden text-center scroll-mt-14`}
            >
              {/* Subtle Misty Candi Bentar Background Silhouette */}
              <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
                <img
                  src="/images/bali-heritage-gate.jpg"
                  alt="Bali Gate Silhouette"
                  className="w-full h-full object-cover object-center filter blur-[1px]"
                />
              </div>

              <div className="relative z-10 max-w-md sm:max-w-lg mx-auto flex flex-col items-center">
                <Reveal delay={0}>
                  <h2 className={`${titleFontClass} text-2xl sm:text-3xl uppercase tracking-wider ${theme.darkText}`}>
                    KISAH KAMI
                  </h2>
                  <p className={`${quoteFontClass} text-xs sm:text-sm ${theme.softGoldText} mt-1 mb-12`}>
                    Dari Pertemuan, Menuju Selamanya
                  </p>
                </Reveal>

                {/* Vertical Timeline */}
                <div className={`relative border-l ${theme.borderDarkAlpha} ml-4 sm:ml-0 pl-6 sm:pl-8 space-y-10 text-left w-full max-w-xs sm:max-w-sm`}>
                  {invitation.loveStories.map((story, idx) => (
                    <Reveal key={story.id} delay={idx * 100} yOffset={20}>
                      <div className="relative group">
                        {/* Timeline Node Dot */}
                        <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-3 h-3 rounded-full ${theme.darkBg} border-2 ${theme.goldBorder} ${theme.groupHoverGoldBg} transition-colors`} />

                        <span className={`${isCleanSans ? 'font-mono' : 'font-serif'} text-sm tracking-widest ${theme.goldAccent} block mb-1 font-medium`}>
                          {story.yearOrDate}
                        </span>
                        <p className={`text-xs ${theme.darkText}/85 leading-relaxed font-light`}>
                          {story.story || story.title}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>

                {/* Bottom Italic Quote */}
                <Reveal delay={160} className="w-full flex justify-center">
                  <div className={`mt-14 pt-8 border-t ${theme.borderDarkAlpha} w-full max-w-xs`}>
                    <p className={`${quoteFontClass} text-xs ${theme.softGoldText}`}>
                      &ldquo;Beberapa pertemuan memang sudah ditakdirkan.&rdquo;
                    </p>
                  </div>
                </Reveal>
              </div>
            </section>
          )}

          {/* ===================================================================== */}
          {/* ADD-ON SECTION: SINEMATIKA PREWEDDING VIDEO                           */}
          {/* ===================================================================== */}
          {(vis.video || Boolean(invitation.videoUrl) || invitation.activeAddonIds?.includes('video-prewedding')) && (
            <section
              id="section-video"
              className={`relative ${theme.darkBg} ${theme.darkText} py-20 px-6 overflow-hidden text-center scroll-mt-14`}
            >
              <div className="max-w-md sm:max-w-lg mx-auto flex flex-col items-center">
                <Reveal delay={0}>
                  <BalineseStarOrnament className={`w-5 h-5 ${theme.goldAccent} mb-2.5 mx-auto`} />
                  <span className={`text-[9px] uppercase tracking-[0.3em] ${theme.softGoldText} font-medium block mb-1`}>
                    SINEMATIKA CINTA
                  </span>
                  <h2 className={`${titleFontClass} text-2xl sm:text-3xl uppercase tracking-wider ${theme.darkText} mb-2`}>
                    VIDEO PREWEDDING
                  </h2>
                  <p className={`${quoteFontClass} text-xs sm:text-sm ${theme.softGoldText} max-w-xs mb-8 mx-auto`}>
                    &ldquo;Momen Abadi Dalam Gerak, Rasa, &amp; Restu Semesta&rdquo;
                  </p>
                </Reveal>

                {/* Video Frame 16:9 with luxury gold accent & shadow */}
                <Reveal delay={140} className="w-full">
                  <div className={`w-full aspect-video rounded-sm overflow-hidden border ${theme.borderDarkAlpha} ${theme.cardDarkBg} shadow-2xl relative`}>
                    {(() => {
                      const videoSrc = invitation.videoUrl || 'https://www.youtube.com/watch?v=ScMzIvxBSi4';
                      const ytId = extractYouTubeId(videoSrc);
                      if (ytId) {
                        return (
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&playsinline=1`}
                            title="Prewedding Video Teaser"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        );
                      }
                      return (
                        <video
                          controls
                          playsInline
                          poster={bridePhoto}
                          className="w-full h-full object-cover"
                        >
                          <source src={videoSrc} type="video/mp4" />
                        </video>
                      );
                    })()}
                  </div>
                </Reveal>

                <div className={`w-12 h-[1px] ${theme.goldBg}/40 mt-8`} />
              </div>
            </section>
          )}

          {/* ===================================================================== */}
          {/* SCREEN 4: RANGKAIAN ACARA                                            */}
          {/* ===================================================================== */}
          {vis.events && invitation.events && invitation.events.length > 0 && (
            <section
              id="section-acara"
              className={`${theme.lightBg} ${theme.lightText} py-16 sm:py-20 px-6 transition-colors duration-500 text-center scroll-mt-14`}
            >
              <div className="max-w-md sm:max-w-lg mx-auto flex flex-col items-center">
                <Reveal delay={0}>
                  <h2 className={`${titleFontClass} text-2xl sm:text-3xl uppercase tracking-wider ${theme.lightText}`}>
                    RANGKAIAN
                    <br />
                    {invitation.coverTitle || 'PAWIWAHAN'}
                  </h2>

                  <BalineseStarOrnament className={`w-5 h-5 ${theme.goldAccent} my-4 mx-auto`} />
                </Reveal>

                {/* Event Cards List with Thumbnail Photos */}
                <div className="w-full space-y-6 mt-4 text-left">
                  {invitation.events.map((event, idx) => {
                    const eventThumbnails = [
                      '/images/bali-heritage-cover.jpg',
                      '/images/bali-heritage-secondary.jpg',
                      '/images/bali-heritage-gate.jpg',
                      '/images/bali-heritage-closing.jpg',
                    ];
                    const thumb = eventThumbnails[idx % eventThumbnails.length];
                    const formattedNum = String(idx + 1).padStart(2, '0');

                    return (
                      <Reveal key={event.id} delay={idx * 100} yOffset={20}>
                        <div
                          className={`flex items-center gap-4 sm:gap-5 p-3.5 ${theme.cardLightBg} rounded-md border ${theme.borderLightAlpha} shadow-sm hover:shadow-md transition-all`}
                        >
                          {/* Event Thumbnail */}
                          <div className={`w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded overflow-hidden border ${theme.borderLightAlpha} bg-neutral-200`}>
                            <img
                              src={thumb}
                              alt={event.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Event Details */}
                          <div className="flex-1 min-w-0">
                            <span className={`text-[10px] ${isCleanSans ? 'font-mono' : 'font-serif'} ${theme.goldAccent} tracking-widest block font-medium`}>
                              {formattedNum}
                            </span>
                            <h3 className={`${titleFontClass} text-base uppercase tracking-wider ${theme.lightText} font-medium leading-snug`}>
                              {event.name}
                            </h3>
                            <p className={`text-[11px] ${theme.lightSubText} tracking-widest uppercase mt-0.5 font-mono`}>
                              {event.startTime} {event.timezone || 'WITA'}
                            </p>
                            <p className={`text-xs ${theme.lightText}/75 font-light leading-relaxed mt-1 line-clamp-2`}>
                              {event.venueName} · {event.address}
                            </p>
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* ===================================================================== */}
          {/* SCREEN 5: LOKASI                                                     */}
          {/* ===================================================================== */}
          <section
            id="section-lokasi"
            className={`${theme.darkBg} ${theme.darkText} py-20 px-6 text-center scroll-mt-14`}
          >
            <div className="max-w-md sm:max-w-lg mx-auto flex flex-col items-center">
              <Reveal delay={0}>
                <h2 className={`${titleFontClass} text-2xl sm:text-3xl uppercase tracking-wider ${theme.darkText}`}>
                  LOKASI
                </h2>
                <p className={`text-xs ${theme.softGoldText} font-light max-w-xs mt-2 mb-8 mx-auto`}>
                  Kami menantikan kehadiran Anda di tempat yang penuh makna ini
                </p>
              </Reveal>

              {/* Full-width Venue Image */}
              <Reveal delay={120} className="w-full">
                <div className={`w-full aspect-[4/3] rounded-sm overflow-hidden border ${theme.borderDarkAlpha} relative shadow-2xl`}>
                  <img
                    src="/images/bali-heritage-gate.jpg"
                    alt="Venue Lokasi"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Reveal>

              {/* Floating Ivory Card */}
              <Reveal delay={180} className="w-full flex justify-center">
                <div className={`w-full max-w-sm ${theme.lightBg} ${theme.lightText} p-6 rounded-md shadow-2xl -mt-10 relative z-10 border ${theme.borderDarkAlpha} text-left flex items-start gap-4`}>
                  <div className={`p-2 rounded-full ${theme.goldBg}/15 ${theme.goldAccent} shrink-0 mt-0.5`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`${titleFontClass} text-base uppercase tracking-wider font-semibold ${theme.lightText}`}>
                      {primaryEvent?.venueName || 'The Apurva Kempinski Bali'}
                    </h4>
                    <p className={`text-xs ${theme.lightText}/75 mt-1 leading-relaxed`}>
                      {primaryEvent?.address || 'Jl. Raya Nusa Dua Selatan, Nusa Dua, Bali'}
                    </p>

                    <a
                      href={primaryEvent?.googleMapsUrl || 'https://maps.google.com/?q=The+Apurva+Kempinski+Bali'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest ${theme.lightSubText} font-semibold ${theme.hoverLightText} transition-colors mt-3`}
                    >
                      <span>LIHAT PETA</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </Reveal>

              {/* Bottom Quote */}
              <Reveal delay={220}>
                <p className={`${quoteFontClass} text-xs ${theme.softGoldText} mt-10`}>
                  &ldquo;Tempat istimewa untuk momen yang lebih istimewa.&rdquo;
                </p>
              </Reveal>
            </div>
          </section>

          {/* ===================================================================== */}
          {/* SCREEN 6: GALERI FOTO                                                */}
          {/* ===================================================================== */}
          {vis.gallery && invitation.gallery && invitation.gallery.length > 0 && (
            <section
              id="section-galeri"
              className={`${theme.lightBg} ${theme.lightText} py-16 sm:py-20 px-4 sm:px-6 transition-colors duration-500 text-center scroll-mt-14`}
            >
              <div className="max-w-md sm:max-w-lg mx-auto flex flex-col items-center">
                <Reveal delay={0}>
                  <h2 className={`${titleFontClass} text-2xl sm:text-3xl uppercase tracking-wider ${theme.lightText}`}>
                    GALERI
                  </h2>
                  <p className={`${quoteFontClass} text-xs sm:text-sm ${theme.lightSubText} mt-1 mb-8`}>
                    Cuplikan Cerita Kami
                  </p>
                </Reveal>

                {/* Editorial Masonry Grid */}
                <Reveal delay={120} className="w-full">
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {invitation.gallery.map((item, idx) => (
                      <div
                        key={item.id}
                        onClick={() => setLightboxIndex(idx)}
                        className="relative overflow-hidden rounded cursor-pointer group shadow-sm bg-neutral-200 aspect-[3/4]"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.caption || `Galeri Foto ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[10px] uppercase tracking-widest text-white bg-black/50 px-2 py-1 rounded">
                            Perbesar
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>

                {/* Button Lihat Semua Foto */}
                <Reveal delay={180}>
                  <button
                    onClick={() => setLightboxIndex(0)}
                    className={`mt-8 px-6 py-2.5 rounded-full border ${theme.btnSecondary} text-xs uppercase tracking-widest transition-all cursor-pointer`}
                  >
                    LIHAT SEMUA FOTO →
                  </button>
                </Reveal>
              </div>
            </section>
          )}

          {/* Interactive Lightbox Modal */}
          {lightboxIndex !== null && invitation.gallery[lightboxIndex] && (
            <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Tutup Galeri"
              >
                <X className="w-7 h-7" />
              </button>

              <button
                onClick={() =>
                  setLightboxIndex(
                    (prev) => (prev !== null ? (prev - 1 + invitation.gallery.length) % invitation.gallery.length : null)
                  )
                }
                className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <div className="max-w-2xl max-h-[85vh] flex flex-col items-center">
                <img
                  src={invitation.gallery[lightboxIndex].imageUrl}
                  alt={invitation.gallery[lightboxIndex].caption || 'Foto Galeri'}
                  className="max-w-full max-h-[75vh] object-contain rounded"
                />
                {invitation.gallery[lightboxIndex].caption && (
                  <p className="text-white/80 font-serif italic text-sm mt-3 text-center">
                    {invitation.gallery[lightboxIndex].caption}
                  </p>
                )}
                <span className="text-white/40 text-xs mt-1">
                  {lightboxIndex + 1} / {invitation.gallery.length}
                </span>
              </div>

              <button
                onClick={() =>
                  setLightboxIndex(
                    (prev) => (prev !== null ? (prev + 1) % invitation.gallery.length : null)
                  )
                }
                className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Selanjutnya"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SCREEN 7: RSVP (KONFIRMASI KEHADIRAN)                                */}
          {/* ===================================================================== */}
          {vis.rsvp && (
            <section
              id="section-rsvp"
              className={`${theme.darkBg} ${theme.darkText} py-20 px-6 text-center scroll-mt-14`}
            >
              <div className="max-w-md sm:max-w-lg mx-auto flex flex-col items-center">
                <Reveal delay={0}>
                  <h2 className={`${titleFontClass} text-2xl sm:text-3xl uppercase tracking-wider ${theme.darkText}`}>
                    KONFIRMASI
                    <br />
                    KEHADIRAN
                  </h2>
                  <p className={`text-xs ${theme.softGoldText} font-light max-w-xs mt-2 mb-8 leading-relaxed mx-auto`}>
                    Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.
                  </p>
                </Reveal>

                <Reveal delay={140} className="w-full flex justify-center">
                  {isRsvpSubmitted ? (
                    <div className={`w-full max-w-sm p-6 ${theme.cardDarkBg} border ${theme.goldBorder}/50 rounded text-center animate-fade-in`}>
                      <Check className={`w-10 h-10 ${theme.goldAccent} mx-auto mb-3`} />
                      <h3 className={`${titleFontClass} text-lg uppercase tracking-wider ${theme.darkText}`}>
                        Konfirmasi Terkirim
                      </h3>
                      <p className={`text-xs ${theme.softGoldText} mt-2 font-light`}>
                        Matur suksma atas konfirmasi kehadiran Anda.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="w-full max-w-sm space-y-4 text-left">
                      {/* Nama */}
                      <div>
                        <label className={`block text-[11px] uppercase tracking-widest ${theme.softGoldText} mb-1.5 font-medium`}>
                          Nama
                        </label>
                        <input
                          type="text"
                          required
                          value={rsvpName}
                          onChange={(e) => setRsvpName(e.target.value)}
                          placeholder="Nama Anda"
                          className={`w-full px-4 py-3 ${theme.cardDarkBg} border ${theme.borderDarkAlpha} rounded text-xs ${theme.darkText} focus:outline-none focus:${theme.goldBorder} transition-colors`}
                        />
                      </div>

                      {/* Jumlah Tamu */}
                      <div>
                        <label className={`block text-[11px] uppercase tracking-widest ${theme.softGoldText} mb-1.5 font-medium`}>
                          Jumlah Tamu
                        </label>
                        <select
                          value={rsvpPax}
                          onChange={(e) => setRsvpPax(Number(e.target.value))}
                          className={`w-full px-4 py-3 ${theme.cardDarkBg} border ${theme.borderDarkAlpha} rounded text-xs ${theme.darkText} focus:outline-none focus:${theme.goldBorder} transition-colors`}
                        >
                          <option value={1} className={theme.cardDarkBg}>1 Orang</option>
                          <option value={2} className={theme.cardDarkBg}>2 Orang</option>
                          <option value={3} className={theme.cardDarkBg}>3 Orang</option>
                          <option value={4} className={theme.cardDarkBg}>4 Orang</option>
                          <option value={5} className={theme.cardDarkBg}>5 Orang</option>
                        </select>
                      </div>

                      {/* Konfirmasi Kehadiran Buttons */}
                      <div>
                        <label className={`block text-[11px] uppercase tracking-widest ${theme.softGoldText} mb-1.5 font-medium`}>
                          Konfirmasi
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setRsvpStatus('ATTENDING')}
                            className={`py-3 text-xs uppercase tracking-widest rounded transition-all cursor-pointer ${
                              rsvpStatus === 'ATTENDING'
                                ? `${theme.goldBg} text-[#0D0C0A] font-semibold shadow-md`
                                : `${theme.cardDarkBg} ${theme.darkText}/70 border ${theme.borderDarkAlpha} hover:border-[#B89A5A]/60 hover:text-white`
                            }`}
                          >
                            Hadir
                          </button>
                          <button
                            type="button"
                            onClick={() => setRsvpStatus('NOT_ATTENDING')}
                            className={`py-3 text-xs uppercase tracking-widest rounded transition-all cursor-pointer ${
                              rsvpStatus === 'NOT_ATTENDING'
                                ? `${theme.goldBg} text-[#0D0C0A] font-semibold shadow-md`
                                : `${theme.cardDarkBg} ${theme.darkText}/70 border ${theme.borderDarkAlpha} hover:border-[#B89A5A]/60 hover:text-white`
                            }`}
                          >
                            Tidak Hadir
                          </button>
                        </div>
                      </div>

                      {/* Ucapan */}
                      <div>
                        <label className={`block text-[11px] uppercase tracking-widest ${theme.softGoldText} mb-1.5 font-medium`}>
                          Ucapan (Opsional)
                        </label>
                        <textarea
                          rows={3}
                          value={rsvpNotes}
                          onChange={(e) => setRsvpNotes(e.target.value)}
                          placeholder="Tulis ucapan Anda..."
                          className={`w-full px-4 py-3 ${theme.cardDarkBg} border ${theme.borderDarkAlpha} rounded text-xs ${theme.darkText} focus:outline-none focus:${theme.goldBorder} transition-colors resize-none`}
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmittingRsvp}
                        className={`w-full py-3.5 ${theme.goldBg} text-[#0D0C0A] font-semibold text-xs uppercase tracking-[0.2em] rounded hover:opacity-90 transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2`}
                      >
                        {isSubmittingRsvp ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>MENGIRIM...</span>
                          </>
                        ) : (
                          <>
                            <span>KIRIM KONFIRMASI</span>
                            <span>→</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </Reveal>
              </div>
            </section>
          )}

          {/* ===================================================================== */}
          {/* SCREEN 8: TANDA KASIH                                                */}
          {/* ===================================================================== */}
          {vis.gifts && hasGifts && (
            <section
              id="section-tanda-kasih"
              className={`${theme.lightBg} ${theme.lightText} py-16 sm:py-20 px-6 transition-colors duration-500 text-center scroll-mt-14`}
            >
              <div className="max-w-md sm:max-w-lg mx-auto flex flex-col items-center">
                <Reveal delay={0}>
                  <h2 className={`${titleFontClass} text-2xl sm:text-3xl uppercase tracking-wider ${theme.lightText}`}>
                    TANDA KASIH
                  </h2>

                  <BalineseStarOrnament className={`w-5 h-5 ${theme.goldAccent} my-3 mx-auto`} />

                  <p className={`text-xs ${theme.lightText}/80 font-light max-w-sm leading-relaxed mb-6 mx-auto`}>
                    Doa dan kehadiran Anda adalah hadiah terbaik bagi kami. Namun, apabila berkenan memberikan tanda kasih, dapat melalui:
                  </p>

                  {/* Tab Switcher */}
                  <div className={`inline-flex p-1 ${theme.lightText}/10 rounded-full mb-6`}>
                    <button
                      onClick={() => setActiveGiftTab('BANK')}
                      className={`px-5 py-1.5 rounded-full text-xs uppercase tracking-widest transition-all cursor-pointer ${
                        activeGiftTab === 'BANK'
                          ? `bg-white ${theme.lightText} font-medium shadow-sm`
                          : `${theme.lightText}/60 ${theme.hoverLightText}`
                      }`}
                    >
                      Transfer Bank
                    </button>
                    <button
                      onClick={() => setActiveGiftTab('EWALLET')}
                      className={`px-5 py-1.5 rounded-full text-xs uppercase tracking-widest transition-all cursor-pointer ${
                        activeGiftTab === 'EWALLET'
                          ? `bg-white ${theme.lightText} font-medium shadow-sm`
                          : `${theme.lightText}/60 ${theme.hoverLightText}`
                      }`}
                    >
                      E-Wallet
                    </button>
                  </div>
                </Reveal>

                {/* Gift Cards */}
                <Reveal delay={140} className="w-full flex justify-center">
                  <div className="w-full max-w-sm space-y-4">
                    {(filteredGifts.length > 0 ? filteredGifts : invitation.gifts).map((gift) => (
                      <div
                        key={gift.id}
                        className={`bg-white p-6 rounded-lg border ${theme.borderLightAlpha} shadow-sm text-center flex flex-col items-center`}
                      >
                        <span className={`text-xs uppercase tracking-widest ${titleFontClass} font-bold ${theme.lightText} mb-2 block`}>
                          {gift.providerName}
                        </span>

                        <div className="flex items-center justify-center gap-3 my-2">
                          <span className={`font-mono text-lg sm:text-xl font-bold tracking-wider ${theme.lightText}`}>
                            {gift.accountNumber}
                          </span>
                          <button
                            onClick={() => handleCopy(gift.accountNumber, gift.id)}
                            className={`p-1.5 rounded-md hover:bg-neutral-100 ${theme.lightSubText} transition-colors cursor-pointer`}
                            aria-label="Salin nomor rekening"
                          >
                            {copiedId === gift.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        <p className={`text-xs ${theme.lightText}/75 ${quoteFontClass}`}>
                          a.n. {gift.accountHolder}
                        </p>

                        <p className={`text-[10px] ${theme.lightSubText} uppercase tracking-widest mt-3 pt-3 border-t border-neutral-100 w-full font-mono`}>
                          {copiedId === gift.id ? 'Nomor rekening tersalin!' : 'Klik untuk menyalin nomor rekening'}
                        </p>
                      </div>
                    ))}
                  </div>
                </Reveal>

                <Reveal delay={200}>
                  <BalineseStarOrnament className={`w-5 h-5 ${theme.goldAccent} my-6 mx-auto`} />

                  <p className={`${quoteFontClass} text-xs ${theme.lightSubText}`}>
                    Terima kasih atas doa dan kasih sayangnya.
                  </p>
                </Reveal>
              </div>
            </section>
          )}

          {/* ===================================================================== */}
          {/* SCREEN 9: PENUTUP (CLOSING)                                          */}
          {/* ===================================================================== */}
          <section
            id="section-penutup"
            className={`relative min-h-[85vh] flex flex-col justify-end items-center text-center px-6 pb-12 pt-20 overflow-hidden ${theme.darkBg} ${theme.darkText} scroll-mt-14`}
          >
            {/* Cinematic Full-Bleed Background Photo */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/bali-heritage-closing.jpg"
                alt="Penutup Bali Heritage"
                className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A] via-[#0D0C0A]/40 to-[#0D0C0A]/80 pointer-events-none" />
            </div>

            {/* Top Empty Placeholder for Balance */}
            <div className="relative z-10 pt-4" />

            {/* Center Content: Matur Suksma & Signatures */}
            <Reveal delay={0} className="w-full flex justify-center">
              <div className="relative z-10 max-w-sm mx-auto flex flex-col items-center">
                <h2 className={`${titleFontClass} text-3xl sm:text-4xl uppercase tracking-[0.25em] ${theme.darkText}`}>
                  MATUR SUKSMA
                </h2>
                <p className={`text-xs ${theme.softGoldText} font-light max-w-xs mt-3 mb-6 leading-relaxed`}>
                  Atas doa, restu dan kehadiran Anda
                  <br />
                  Kami yang berbahagia,
                </p>

                {/* Couple Signature Names */}
                <p className={`${quoteFontClass} text-3xl sm:text-4xl ${theme.darkText} tracking-wide mb-2`}>
                  {groomNickname} &amp; {brideNickname}
                </p>

                <p className={`${isCleanSans ? 'font-mono' : 'font-serif'} text-xs tracking-[0.25em] ${theme.softGoldText} mt-1`}>
                  {formattedDottedDate}
                </p>

                <BalineseStarOrnament className={`w-6 h-6 ${theme.goldAccent} mt-6`} />
              </div>
            </Reveal>

            {/* Bottom Footer: Branding */}
            <div className="relative z-10 pt-8 border-t border-white/10 w-full max-w-xs text-center flex flex-col items-center opacity-70">
              <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
                POWERED BY KERTAS.KATA · SIMPLE. ELEGANT. EXCLUSIVE.
              </p>
            </div>
          </section>

          {/* Optional Guest Pass Card if addon active */}
          {guestName && Boolean(invitation.activeAddonIds?.includes('qr-checkin-pass')) && (
            <div className={`p-6 ${theme.darkBg}`}>
              <GuestPassCard
                invitationId={invitation.id}
                slug={invitation.slug}
                guestName={guestName}
                isDark={theme.isDarkAudio}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
