'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
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
  Heart,
} from 'lucide-react';
import { Invitation, LoveStoryItem, EventDetail, GalleryItem, GiftAccount } from '@/types';
import { submitRsvp, submitRsvpAsync } from '@/lib/store';
import { AudioFloatingToggle } from '@/components/engine/AudioFloatingToggle';
import {
  JavaneseGununganSilhouette,
  JavaneseBatikKawungOverlay,
  JavaneseBatikParangOverlay,
  JavaneseFloralDivider,
  JavaneseJogloRoofSilhouette,
  JavaneseMentulIcon,
  JavaneseWayangShadowScreen,
  JavaneseMorningBreezeShadows,
  JavanesePendopoSilhouette,
  JavaneseLinenWeaveTexture,
  JavaneseFloatingDustMotes,
  JavaneseCarvedArchTop,
  JavaneseCarvedArchBottom,
  JavaneseMegaMendungClouds,
  JavaneseMouseScrollIndicator,
  JavaneseFallingPetals,
  JavaneseRonceanMelatiTassel,
  JavaneseRoyalSeal,
  JavaneseFlyingBirds,
} from '@/components/ui/JavaneseOrnaments';
import { extractYouTubeId } from '@/lib/media';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  className?: string;
}

function Reveal({ children, delay = 0, yOffset = 25, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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

    const rafId = requestAnimationFrame(() => {
      checkVisibility();
    });

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
        // Fallback gracefully
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

/**
 * Parallax Scroll Hook for Living Heritage Depth
 * Works universally across both full-page preview and device-viewport iframe/container.
 */
function useParallaxScroll() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let rafId: number;

    const findContainer = () => {
      if (typeof document === 'undefined') return null;
      const desktop = document.getElementById('device-viewport');
      const mobile = document.getElementById('device-viewport-mobile');
      const custom = document.querySelector('[data-device-viewport]');
      return (desktop && desktop.clientHeight > 0 ? desktop : null) ||
             (mobile && mobile.clientHeight > 0 ? mobile : null) ||
             custom ||
             null;
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const container = findContainer();
        if (container) {
          setScrollY(container.scrollTop);
        } else if (typeof window !== 'undefined') {
          setScrollY(window.scrollY || document.documentElement.scrollTop || 0);
        }
      });
    };

    const container = findContainer();
    const scrollTarget = container || (typeof window !== 'undefined' ? window : null);

    if (scrollTarget) {
      scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (scrollTarget) {
        scrollTarget.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return scrollY;
}


interface JawaLivingHeritageTemplateProps {
  invitation: Invitation;
  guestName?: string;
  isPreview?: boolean;
  forceMobile?: boolean;
  initialOpen?: boolean;
  isOpenControlled?: boolean;
  onOpenStateChange?: (open: boolean) => void;
  activeSectionTarget?: string;
}

export function JawaLivingHeritageTemplate({
  invitation,
  guestName,
  isPreview = false,
  forceMobile = false,
  initialOpen = false,
  isOpenControlled,
  onOpenStateChange,
  activeSectionTarget,
}: JawaLivingHeritageTemplateProps) {
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

  // Living Heritage Parallax Scroll Depth Tracking (strictly bounded between 10-30px)
  const scrollY = useParallaxScroll();
  const parallaxBatikY = Math.min(24, Math.max(0, scrollY * 0.035));
  const parallaxBatikX = Math.min(12, Math.max(-12, (scrollY * 0.015) % 24 - 12));
  const parallaxGununganY = Math.min(30, Math.max(0, scrollY * 0.05));
  const parallaxFogX = Math.min(20, Math.max(-20, (scrollY * 0.02) % 40 - 20));
  const parallaxFoliageY = Math.min(18, Math.max(0, scrollY * 0.025));

  // Dynamic Couple Data with safe fallbacks
  const couple = invitation.couple;
  const groomNickname = couple.groomNickname || 'Danang';
  const brideNickname = couple.brideNickname || 'Sekar';
  const groomName = couple.groomName || 'Raden Mas Danang Wicaksono, S.T.';
  const brideName = couple.brideName || 'Raden Ajeng Sekar Kinanti, M.Ds.';
  const groomPhoto = couple.groomPhotoUrl || invitation.coverImageUrl || '/images/jawa-heritage-cover.jpg';
  const bridePhoto = couple.bridePhotoUrl || '/images/jawa-heritage-secondary.jpg';
  const coverImage = invitation.coverImageUrl || '/images/jawa-heritage-cover.jpg';

  // Format date display
  const rawDate = invitation.eventDate || '2026-11-28';
  const formattedDottedDate = (() => {
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return '28 . 11 . 2026';
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day} . ${month} . ${year}`;
    } catch {
      return '28 . 11 . 2026';
    }
  })();

  const formattedFullDate = (() => {
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return 'Sabtu, 28 November 2026';
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Sabtu, 28 November 2026';
    }
  })();

  const vis = invitation.sectionVisibility;

  // Video Background support
  const hasVideoBg = Boolean(invitation.coverVideoUrl) || Boolean(invitation.activeAddonIds?.includes('living-video-bg'));
  // Dynamic Header Cover Title
  const coverTitle = invitation.coverTitle || 'PAWIWAHAN';

  // Font Preset System: editorial-cormorant (default), modern-serif, clean-sans
  const fontPreset = invitation.fontPreset || 'editorial-cormorant';
  const isCleanSans = fontPreset === 'clean-sans';
  const isModernSerif = fontPreset === 'modern-serif';

  const headingFontClass = isCleanSans
    ? 'font-sans font-light tracking-[0.2em]'
    : isModernSerif
    ? 'font-serif font-medium tracking-[0.16em]'
    : 'font-serif font-normal tracking-[0.14em]';

  const titleFontClass = isCleanSans
    ? 'font-sans font-medium tracking-[0.18em]'
    : isModernSerif
    ? 'font-serif font-medium tracking-wider'
    : 'font-serif font-normal tracking-wider';

  const quoteFontClass = isCleanSans
    ? 'font-sans font-light tracking-wide text-xs not-italic'
    : 'font-serif italic';

  const serifClass = isCleanSans ? 'font-sans' : 'font-serif';

  // Color & Theme Presets: warm-linen (default), nocturne-black, offwhite-noir
  const colorPreset = invitation.colorPreset || 'warm-linen';
  const theme = {
    'warm-linen': {
      coverBg: 'radial-gradient(ellipse at 50% 30%, #FAF2E6 0%, #F4E7D3 55%, #E8D7BF 100%)',
      coverTextDark: 'text-[#2C1E14]',
      coverAccent: 'text-[#8A6D3B]',
      coverAccentHex: '#8A6D3B',
      coverArchTopColor: '#7A5A30',
      coverArchTopAccent: '#C2A468',
      coverBtnBg: 'bg-[#2C1E14] border-[#C2A468] text-[#FAF6F0] hover:bg-[#8A6D3B]',
      coverCardBg: 'bg-[#FAF5EC]/92 border-[#C2A468]/50 shadow-[0_8px_24px_rgba(44,30,20,0.14)]',
      coverCardText: 'text-[#2C1E14]',
      coverCardSub: 'text-[#7A6046]',
      darkBg: 'bg-[#211A16]',
      darkBgHex: '#211A16',
      darkText: 'text-[#F1E9DC]',
      goldAccent: 'text-[#B3945A]',
      goldAccentHex: '#B3945A',
      headerBg: 'bg-[#211A16]/92 border-[#B3945A]/25',
      fajarBg: 'bg-[#FAF6F0]',
      fajarText: 'text-[#211A16]',
      isDarkAudio: true,
    },
    'nocturne-black': {
      coverBg: 'radial-gradient(ellipse at 50% 30%, #1A1512 0%, #120E0C 55%, #0A0807 100%)',
      coverTextDark: 'text-[#F5EFEB]',
      coverAccent: 'text-[#D4AF37]',
      coverAccentHex: '#D4AF37',
      coverArchTopColor: '#3A2E20',
      coverArchTopAccent: '#D4AF37',
      coverBtnBg: 'bg-[#0A0807] border-[#D4AF37] text-[#FAF6F0] hover:bg-[#D4AF37] hover:text-[#0A0807]',
      coverCardBg: 'bg-[#140F0C]/92 border-[#D4AF37]/50 shadow-[0_8px_24px_rgba(0,0,0,0.6)]',
      coverCardText: 'text-[#F5EFEB]',
      coverCardSub: 'text-[#D4AF37]',
      darkBg: 'bg-[#0E0B0A]',
      darkBgHex: '#0E0B0A',
      darkText: 'text-[#F5EFEB]',
      goldAccent: 'text-[#D4AF37]',
      goldAccentHex: '#D4AF37',
      headerBg: 'bg-[#0E0B0A]/92 border-[#D4AF37]/30',
      fajarBg: 'bg-[#14100E]',
      fajarText: 'text-[#FAF6F0]',
      isDarkAudio: true,
    },
    'offwhite-noir': {
      coverBg: 'radial-gradient(ellipse at 50% 30%, #FFFFFF 0%, #F7F5F0 55%, #ECE7DE 100%)',
      coverTextDark: 'text-[#181411]',
      coverAccent: 'text-[#967840]',
      coverAccentHex: '#967840',
      coverArchTopColor: '#524332',
      coverArchTopAccent: '#B89855',
      coverBtnBg: 'bg-[#181411] border-[#B89855] text-[#FFFFFF] hover:bg-[#967840]',
      coverCardBg: 'bg-[#FFFFFF]/95 border-[#B89855]/50 shadow-[0_8px_24px_rgba(0,0,0,0.08)]',
      coverCardText: 'text-[#181411]',
      coverCardSub: 'text-[#8A7555]',
      darkBg: 'bg-[#1C1714]',
      darkBgHex: '#1C1714',
      darkText: 'text-[#FAF6F0]',
      goldAccent: 'text-[#C5A463]',
      goldAccentHex: '#C5A463',
      headerBg: 'bg-[#1C1714]/92 border-[#C5A463]/25',
      fajarBg: 'bg-[#FAF8F5]',
      fajarText: 'text-[#181411]',
      isDarkAudio: true,
    },
  }[colorPreset] || {
    coverBg: 'radial-gradient(ellipse at 50% 30%, #FAF2E6 0%, #F4E7D3 55%, #E8D7BF 100%)',
    coverTextDark: 'text-[#2C1E14]',
    coverAccent: 'text-[#8A6D3B]',
    coverAccentHex: '#8A6D3B',
    coverArchTopColor: '#7A5A30',
    coverArchTopAccent: '#C2A468',
    coverBtnBg: 'bg-[#2C1E14] border-[#C2A468] text-[#FAF6F0] hover:bg-[#8A6D3B]',
    coverCardBg: 'bg-[#FAF5EC]/92 border-[#C2A468]/50 shadow-[0_8px_24px_rgba(44,30,20,0.14)]',
    coverCardText: 'text-[#2C1E14]',
    coverCardSub: 'text-[#7A6046]',
    darkBg: 'bg-[#211A16]',
    darkBgHex: '#211A16',
    darkText: 'text-[#F1E9DC]',
    goldAccent: 'text-[#B3945A]',
    goldAccentHex: '#B3945A',
    headerBg: 'bg-[#211A16]/92 border-[#B3945A]/25',
    fajarBg: 'bg-[#FAF6F0]',
    fajarText: 'text-[#211A16]',
    isDarkAudio: true,
  };

  // Smooth scroll helper
  const performSmoothScroll = (targetId: string) => {
    setIsNavOpen(false);

    setTimeout(() => {
      const desktopContainer = document.getElementById('device-viewport');
      const mobileContainer = document.getElementById('device-viewport-mobile');
      const container =
        (desktopContainer && desktopContainer.clientHeight > 0 ? desktopContainer : null) ||
        (mobileContainer && mobileContainer.clientHeight > 0 ? mobileContainer : null) ||
        null;

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

      el.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (container) {
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const scale = container.offsetHeight > 0 ? containerRect.height / container.offsetHeight : 1;
        const relativeTop = (elRect.top - containerRect.top) / (scale || 1);
        const offset = targetId === 'section-tentang' ? 0 : 44;
        const targetScroll = container.scrollTop + relativeTop - offset;
        container.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: 'smooth',
        });
      } else {
        const elRect = el.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const offset = targetId === 'section-tentang' ? 0 : 44;
        const targetScroll = scrollTop + elRect.top - offset;
        window.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: 'smooth',
        });
      }
    }, 60);
  };

  // Auto-scroll when activeSectionTarget changes in builder
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

  const scrollToSection = (sectionId: string) => {
    setIsNavOpen(false);
    performSmoothScroll(sectionId);
  };

  // Copy to clipboard helper
  const handleCopyAccount = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Submit RSVP
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    setIsSubmittingRsvp(true);
    const guestPax = rsvpStatus === 'NOT_ATTENDING' ? 0 : Number(rsvpPax);
    try {
      await submitRsvpAsync(
        invitation.id,
        rsvpName.trim(),
        rsvpStatus,
        guestPax,
        rsvpNotes.trim()
      );
      setIsRsvpSubmitted(true);
    } catch (err) {
      console.warn('RSVP async submit error, falling back locally:', err);
      submitRsvp(
        invitation.id,
        rsvpName.trim(),
        rsvpStatus,
        guestPax,
        rsvpNotes.trim()
      );
      setIsRsvpSubmitted(true);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  // Gallery keyboard handling for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight' && invitation.gallery?.length) {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % invitation.gallery.length : null));
      }
      if (e.key === 'ArrowLeft' && invitation.gallery?.length) {
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
      className={`template-jawa-living-heritage relative ${
        !isOpen
          ? isPreview
            ? 'h-full min-h-full overflow-hidden'
            : 'h-[100dvh] min-h-[100dvh] h-screen min-h-screen overflow-hidden'
          : 'min-h-screen min-h-[100dvh]'
      } w-full ${theme.darkBg} ${theme.darkText} ${serifClass} antialiased select-none`}
    >


      {/* Background Audio Floating Indicator */}
      <AudioFloatingToggle
        audioUrl={invitation.musicUrl}
        isUnlocked={isOpen}
        isDark={theme.isDarkAudio}
        forceMobile={forceMobile}
      />

      {/* ========================================================================= */}
      {/* STICKY TOP HEADER (Screen 2+ Header Bar)                                  */}
      {/* ========================================================================= */}
      {isOpen && (
        <header className={`sticky top-0 z-40 w-full ${theme.headerBg} backdrop-blur-md transition-all duration-300`}>
          <div className="max-w-md sm:max-w-lg mx-auto px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`${headingFontClass} text-xs uppercase tracking-[0.16em] ${theme.darkText}`}>
                {groomNickname}
              </span>
              <JavaneseMentulIcon className={`w-3.5 h-3.5 ${theme.goldAccent}`} />
              <span className={`${headingFontClass} text-xs uppercase tracking-[0.16em] ${theme.darkText}`}>
                {brideNickname}
              </span>
            </div>

            <button
              onClick={() => setIsNavOpen(true)}
              aria-label="Buka Menu Navigasi"
              className={`p-1.5 ${theme.darkText} hover:${theme.goldAccent} transition-colors cursor-pointer`}
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </header>
      )}

      {/* ========================================================================= */}
      {/* NAVIGATION DRAWER OVERLAY                                                 */}
      {/* ========================================================================= */}
      {isNavOpen && (
        <div className={`fixed inset-0 z-50 ${theme.darkBg} ${theme.darkText} flex flex-col justify-between p-6 sm:p-8 animate-fade-in`}>
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#B3945A]/25 pb-4">
            <div className="flex items-center gap-2">
              <span className={`${headingFontClass} text-sm uppercase tracking-[0.18em] ${theme.darkText}`}>
                {groomNickname}
              </span>
              <JavaneseMentulIcon className={`w-4 h-4 ${theme.goldAccent}`} />
              <span className={`${headingFontClass} text-sm uppercase tracking-[0.18em] ${theme.darkText}`}>
                {brideNickname}
              </span>
            </div>
            <button
              onClick={() => setIsNavOpen(false)}
              aria-label="Tutup Menu"
              className={`p-2 ${theme.darkText} hover:${theme.goldAccent} transition-colors cursor-pointer`}
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="my-auto py-6 space-y-4 max-w-xs mx-auto w-full">
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
                className={`w-full flex items-center gap-4 text-xs sm:text-sm uppercase tracking-[0.2em] ${theme.darkText}/85 hover:${theme.goldAccent} transition-colors text-left group cursor-pointer py-1.5`}
              >
                <Icon className={`w-4 h-4 ${theme.goldAccent} group-hover:scale-110 transition-transform`} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Drawer Footer */}
          <div className="pt-6 border-t border-[#B3945A]/25 text-center flex flex-col items-center">
            <p className={`${quoteFontClass} text-xs text-[#D8C9B7] tracking-wider mb-2`}>
              &ldquo;Dua insan, satu perjalanan menuju ikatan suci.&rdquo;
            </p>
            <JavaneseFloralDivider className="w-36 h-5 text-[#B3945A]" />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 1: COVER & OPENING — LIVING JAWA HERITAGE STAGE                    */}
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
        } w-full flex flex-col justify-between items-center text-center overflow-hidden select-none`}
        style={{
          background: theme.coverBg,
        }}
      >
        {/* Layer 0: Tactile Vintage Linen & Paper Weave Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
          <JavaneseLinenWeaveTexture opacity={0.08} />
        </div>

        {/* Layer 1: Top Javanese Carved Teakwood Arch Relief */}
        <div className="absolute top-0 inset-x-0 z-40 pointer-events-none drop-shadow-[0_6px_14px_rgba(61,44,30,0.3)]">
          <JavaneseCarvedArchTop className="w-full h-11 sm:h-14 md:h-16" color={theme.coverArchTopColor} accentColor={theme.coverArchTopAccent} opacity={0.95} />
        </div>

        {/* Layer 2: Traditional Mega Mendung Clouds Drifting in the Sky */}
        <div className="absolute top-5 sm:top-8 inset-x-0 z-5 pointer-events-none jawa-cloud-drift opacity-45">
          <JavaneseMegaMendungClouds className="w-full h-24 sm:h-28" color={theme.coverAccentHex} opacity={0.5} />
        </div>

        {/* Layer 3: Subtle Warm Dust / Dew Motes */}
        <JavaneseFloatingDustMotes className="inset-0 pointer-events-none z-10 opacity-70" />

        {/* ===================================================================== */}
        {/* UPPER ZONE: ROYAL TYPOGRAPHY & CALL TO ACTION (LIKE ORIGINAL LAYOUT)   */}
        {/* ===================================================================== */}
        <div className="relative z-30 w-full max-w-xl mx-auto flex flex-col items-center justify-start pt-6 sm:pt-8 px-4 shrink-0">
          {/* Subtle Royal Mentul Crest */}
          <JavaneseMentulIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${theme.coverAccent} mb-1 opacity-90 jawa-radiance-pulse`} />

          {/* Serat Ulem Heritage Title */}
          <p className={`text-[8px] sm:text-[9.5px] uppercase tracking-[0.3em] ${theme.coverAccent} ${titleFontClass} font-medium mb-1`}>
            SERAT ULEM · PAWIWAHAN
          </p>

          {/* Dynamic Header Cover Text */}
          <p className={`text-[8.5px] sm:text-[10px] uppercase tracking-[0.32em] ${theme.coverAccent} ${titleFontClass} font-semibold mt-0.5`}>
            {coverTitle}
          </p>

          {/* Couple Nicknames */}
          <h1 className={`${headingFontClass} ${forceMobile ? 'text-2xl' : 'text-2xl sm:text-4xl md:text-5xl'} uppercase leading-tight tracking-[0.14em] sm:tracking-[0.16em] ${theme.coverTextDark} drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] mt-0.5 mb-0.5`}>
            {groomNickname} <span className={`italic font-light ${theme.coverAccent}`}>&amp;</span> {brideNickname}
          </h1>

          {/* Wedding Date */}
          <p className={`${titleFontClass} text-xs sm:text-sm md:text-base tracking-[0.24em] sm:tracking-[0.26em] ${theme.coverAccent} font-medium mb-2`}>
            {formattedFullDate || formattedDottedDate}
          </p>

          {/* Guest Greeting Pill (if provided) */}
          {guestName && (
            <div className="mb-2.5 px-4 py-1 rounded-full bg-[#FAF5EC]/90 border border-[#8A6D3B]/40 shadow-xs backdrop-blur-xs">
              <p className="text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.22em] text-[#7A6046]">
                Kepada Yth: <span className={`${headingFontClass} font-semibold text-[#2C1E14] ml-1`}>{guestName}</span>
              </p>
            </div>
          )}

          {/* Call to Action Button or Mouse Scroll Indicator */}
          {!isOpen ? (
            <button
              onClick={handleOpenInvitation}
              className={`group relative inline-flex items-center gap-2.5 ${forceMobile ? 'px-6 py-2.5 text-[9.5px]' : 'px-6 sm:px-8 py-2.5 sm:py-3 text-[9.5px] sm:text-xs'} uppercase tracking-[0.22em] sm:tracking-[0.25em] ${theme.coverBtnBg} border-2 transition-all duration-300 shadow-[0_10px_24px_rgba(44,30,20,0.35)] active:scale-95 cursor-pointer z-30`}
            >
              <span className="relative z-10 font-medium tracking-widest">BUKA UNDANGAN</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 text-xs">→</span>
              <span className="absolute -inset-0.5 rounded-full bg-[#C2A468]/30 blur-sm group-hover:bg-[#C2A468]/50 transition-colors pointer-events-none" />
            </button>
          ) : (
            <div
              className="z-30 cursor-pointer pt-0.5"
              onClick={() => scrollToSection('section-tentang')}
            >
              <JavaneseMouseScrollIndicator color={theme.goldAccentHex} label="Scroll ke Bawah" />
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* MIDDLE OPEN SKY: LIVING BIRDS FLYING ACROSS HORIZON (MOTION LIVING)  */}
        {/* ===================================================================== */}
        <div className="absolute inset-x-0 top-[26%] sm:top-[28%] h-[35%] sm:h-[40%] pointer-events-none z-20 overflow-hidden">
          <JavaneseFlyingBirds color={theme.coverAccentHex} opacity={0.8} />
        </div>

        {/* ===================================================================== */}
        {/* LOWER ZONE: HERITAGE THEATER STAGE (FULL-BLEED 60% VIEWPORT HEIGHT)  */}
        {/* ===================================================================== */}
        <div className="relative w-full h-[58%] sm:h-[62%] md:h-[65%] min-h-[380px] sm:min-h-[460px] pointer-events-none flex items-end justify-center overflow-hidden shrink-0">
          {/* Layer 1: Full-Bleed Panoramic Joglo Dalem Agung Estate with Antique Banyan Trees */}
          <div className="absolute inset-0 w-full h-full flex justify-center items-end jawa-joglo-breathe">
            <img
              src="/images/jawa-joglo-panoramic.png"
              alt="Pendopo Joglo Dalem Agung"
              className="w-full h-full object-cover object-bottom filter brightness-[0.98] contrast-[1.05] drop-shadow-sm opacity-95"
            />
          </div>

          {/* Layer 2: Outer Left Corner Botanical Accent */}
          <div className="absolute bottom-0 left-0 w-24 sm:w-36 md:w-48 h-32 sm:h-44 md:h-56 z-10 pointer-events-none opacity-75 jawa-sway-left">
            <img
              src="/images/jawa-crescent-flower.png"
              alt="Corner Foliage Left"
              className="w-full h-full object-contain object-bottom-left"
            />
          </div>

          {/* Layer 3: Outer Right Corner Botanical Accent (Mirrored) */}
          <div className="absolute bottom-0 right-0 w-24 sm:w-36 md:w-48 h-32 sm:h-44 md:h-56 z-10 pointer-events-none opacity-75 jawa-sway-right scale-x-[-1]">
            <img
              src="/images/jawa-crescent-flower.png"
              alt="Corner Foliage Right"
              className="w-full h-full object-contain object-bottom-left"
            />
          </div>

          {/* Layer 4: Altar Left Floral Spray (Snug Flanking the Gunungan) */}
          <div className="absolute bottom-0 left-[calc(50%-145px)] sm:left-[calc(50%-190px)] md:left-[calc(50%-240px)] w-32 sm:w-42 md:w-52 h-40 sm:h-54 md:h-64 z-15 pointer-events-none jawa-sway-left">
            <img
              src="/images/jawa-crescent-flower.png"
              alt="Living Botanical Foliage Left"
              className="w-full h-full object-contain object-bottom-left filter drop-shadow-[0_4px_12px_rgba(44,30,20,0.22)]"
            />
          </div>

          {/* Layer 5: Altar Right Floral Spray (Snug Flanking the Gunungan - Mirrored) */}
          <div className="absolute bottom-0 right-[calc(50%-145px)] sm:right-[calc(50%-190px)] md:right-[calc(50%-240px)] w-32 sm:w-42 md:w-52 h-40 sm:h-54 md:h-64 z-15 pointer-events-none jawa-sway-right scale-x-[-1]">
            <img
              src="/images/jawa-crescent-flower.png"
              alt="Living Botanical Foliage Right"
              className="w-full h-full object-contain object-bottom-left filter drop-shadow-[0_4px_12px_rgba(44,30,20,0.22)]"
            />
          </div>

          {/* Layer 6: Foreground Center Golden Gunungan (Majestic Stately Puppet) */}
          <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 w-32 sm:w-42 md:w-52 h-44 sm:h-56 md:h-68 z-20 pointer-events-none jawa-gunungan-float">
            <img
              src="/images/jawa-gold-gunungan.png"
              alt="Living Gunungan Wayang"
              className="w-full h-full object-contain object-bottom filter drop-shadow-[0_8px_22px_rgba(184,134,11,0.45)]"
            />
          </div>

          {/* Layer 7: Bottom Javanese Carved Bas-Relief Teak Arch */}
          <div className="absolute bottom-0 inset-x-0 z-25 pointer-events-none drop-shadow-[0_-4px_12px_rgba(61,44,30,0.25)]">
            <JavaneseCarvedArchBottom className="w-full h-8 sm:h-11 md:h-14" color={theme.coverArchTopColor} accentColor={theme.coverArchTopAccent} opacity={0.95} />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCREEN 2: ABOUT US (TENTANG KAMI - JAWA PAGI / FAJAR)                     */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SCREEN 2: ABOUT US (TENTANG KAMI - PANGGUNG GEBYOK JATI UKIR PRADA)        */}
      {/* ========================================================================= */}
      {isOpen && vis.profile && (
        <section
          id="section-tentang"
          className={`relative w-full ${forceMobile ? 'py-10 px-3' : 'py-14 sm:py-20 px-3.5 sm:px-8'} ${theme.fajarBg} ${theme.fajarText} overflow-hidden`}
        >
          {/* Tactile Linen Weave Texture */}
          <div className="absolute inset-0 pointer-events-none opacity-85">
            <JavaneseLinenWeaveTexture opacity={0.06} />
          </div>

          {/* Living Falling Jasmine Petals Across Section */}
          <JavaneseFallingPetals />

          {/* Morning Sunlight Glow (Warm Amber Dawn Wash from top right) */}
          <div
            className="absolute -top-20 -right-20 w-[420px] h-[420px] pointer-events-none jawa-anim-light"
            style={{
              background: 'radial-gradient(circle, rgba(240, 195, 105, 0.45) 0%, rgba(225, 175, 80, 0.2) 45%, rgba(250, 246, 240, 0) 70%)',
            }}
          />

          {/* Clearly Visible Morning Courtyard Swaying Foliage Shadow */}
          <div
            className="absolute -top-10 -right-10 w-[130%] h-[130%] pointer-events-none jawa-anim-foliage opacity-85"
            style={{
              transform: `translateY(${parallaxFoliageY}px)`,
            }}
          >
            <JavaneseMorningBreezeShadows opacity={0.28} />
          </div>

          {/* Subtle Batik Kawung Watermark Background */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <JavaneseBatikKawungOverlay opacity={0.04} color="#806947" />
          </div>

          <div className="relative z-10 max-w-xl mx-auto">
            {/* Section Header */}
            <Reveal className="text-center mb-8 sm:mb-10">
              <JavaneseMentulIcon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto ${theme.goldAccent} mb-2 jawa-radiance-pulse`} />
              <p className={`text-[9px] sm:text-[10px] uppercase tracking-[0.3em] ${theme.goldAccent} ${titleFontClass} font-semibold mb-1`}>
                SERAT JATIDIRI · PENYANDINGAN PENGANTEN
              </p>
              <h2 className={`${headingFontClass} text-xl sm:text-3xl ${theme.fajarText} tracking-wide mb-2`}>
                Dua Insan Ing Janji Suci
              </h2>
              <JavaneseFloralDivider className="w-32 sm:w-36 h-5 mx-auto text-[#C2A468]" />
              <p className={`${quoteFontClass} text-xs text-[#7A6046] mt-2.5 max-w-md mx-auto leading-relaxed`}>
                Awit saking berkah rahmat Gusti Kang Murbeng Dumadi, lumantar tulusaning tresna, kula kekalih badhe ngleksanani upacara Pawiwahan Ageng.
              </p>
            </Reveal>

            {/* PANGGUNG PELAMINAN GEBYOK KAYU JATI UKIR PRADA (100% ROYAL JAVANESE HERITAGE) */}
            <Reveal delay={150}>
              <div className={`bg-[#241913] text-[#FAF6F0] border-2 border-[#C2A468] shadow-2xl ${forceMobile ? 'p-4' : 'p-4 sm:p-8'} relative overflow-hidden jawa-gebyok-glow rounded-sm`}>
                {/* Tactile Teak Grain & Linen Texture */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <JavaneseLinenWeaveTexture opacity={0.12} />
                </div>

                {/* Warm Amber Lamp Glow Behind Altar */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-40 jawa-anim-light"
                  style={{
                    background: 'radial-gradient(circle at 50% 30%, rgba(212, 168, 83, 0.45) 0%, rgba(138, 109, 59, 0.15) 50%, transparent 75%)',
                  }}
                />

                {/* Top Carved Gebyok Arch Relief */}
                <div className="absolute top-0 inset-x-0 pointer-events-none opacity-90 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                  <JavaneseCarvedArchTop className={`w-full ${forceMobile ? 'h-7' : 'h-8 sm:h-10'}`} color="#C2A468" accentColor="#E5C07B" opacity={0.95} />
                </div>

                {/* Corner Royal Brackets */}
                <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#C2A468] pointer-events-none" />
                <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#C2A468] pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#C2A468] pointer-events-none" />
                <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#C2A468] pointer-events-none" />

                {/* Symmetrical Couple Presentation (Proportional Stack on Mobile, 2-Cols on Desktop) */}
                <div className={`pt-5 sm:pt-6 grid ${forceMobile ? 'grid-cols-1 gap-5' : 'grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8'} relative z-10 items-start`}>
                  {/* Mempelai Pria (Sang Kakung) */}
                  <div className="flex flex-col items-center text-center relative w-full">
                    {/* Arched Photo Frame with Snug Left Roncean Melati */}
                    <div className="relative mb-3.5">
                      <div className="absolute -left-3 sm:-left-3.5 top-3.5 z-20 pointer-events-none">
                        <JavaneseRonceanMelatiTassel className="w-5 h-28 sm:h-32" />
                      </div>

                      <div className={`relative ${forceMobile ? 'w-36 h-52' : 'w-36 sm:w-44 h-52 sm:h-60'} rounded-t-[50px] overflow-hidden border-2 border-[#C2A468] p-1.5 bg-[#1A120D] shadow-2xl jawa-radiance-pulse`}>
                        <img
                          src={groomPhoto}
                          alt={groomName}
                          className="w-full h-full object-cover object-top rounded-t-[46px] hover:scale-105 transition-transform duration-700"
                        />
                        {/* Royal Palace Badge */}
                        <div className="absolute bottom-1.5 inset-x-1.5 bg-[#1A120D]/95 text-[#FAF6F0] text-[7.5px] uppercase tracking-wider text-center py-0.5 border border-[#C2A468]">
                          MEMPELAI KAKUNG · YOGYAKARTA
                        </div>
                      </div>
                    </div>

                    <span className={`text-[9.5px] uppercase tracking-[0.28em] text-[#C2A468] ${titleFontClass} font-bold mb-0.5`}>
                      SANG KAKUNG
                    </span>
                    <h3 className={`${headingFontClass} ${forceMobile ? 'text-lg' : 'text-lg sm:text-2xl'} text-[#FAF6F0] tracking-wide mb-0.5 leading-snug px-2`}>
                      {groomName}
                    </h3>
                    <p className={`${quoteFontClass} text-xs text-[#C2A468] mb-2`}>
                      ({groomNickname})
                    </p>

                    {(couple.groomFather || couple.groomMother) && (
                      <p className="text-xs text-[#D8C9B7] leading-relaxed mb-2.5 max-w-xs font-light px-2">
                        <span className="text-[8.5px] uppercase tracking-wider text-[#C2A468] block mb-0.5 font-medium">
                          Putra Kinasih Panjenenganipun:
                        </span>
                        <span className="font-serif font-normal text-[#FAF6F0]">
                          {couple.groomFather}
                          {couple.groomFather && couple.groomMother ? ' & ' : ''}
                          {couple.groomMother}
                        </span>
                      </p>
                    )}

                    {couple.groomBio && (
                      <p className="text-xs text-[#E8C872] italic leading-relaxed mb-2.5 max-w-xs font-serif px-2">
                        &ldquo;{couple.groomBio}&rdquo;
                      </p>
                    )}

                    {couple.groomInstagram && (
                      <a
                        href={`https://instagram.com/${couple.groomInstagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#C2A468] hover:text-[#FAF6F0] transition-colors border-b border-[#C2A468]/50 pb-0.5"
                      >
                        <span>{couple.groomInstagram}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Sacred Royal Center Connector (Shown when stacked in mobile / forceMobile view) */}
                  <div className={`w-full items-center justify-center gap-3 my-1 ${forceMobile ? 'flex' : 'flex md:hidden'}`}>
                    <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#C2A468]/70" />
                    <div className="w-7 h-7 rounded-full border border-[#D4AF37] bg-[#1A120D] flex items-center justify-center text-[#D4AF37] font-serif italic text-xs shadow-md jawa-radiance-pulse">
                      &amp;
                    </div>
                    <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#C2A468]/70" />
                  </div>

                  {/* Mempelai Wanita (Sang Putri) */}
                  <div className="flex flex-col items-center text-center relative w-full">
                    {/* Arched Photo Frame with Snug Right Roncean Melati */}
                    <div className="relative mb-3.5">
                      <div className="absolute -right-3 sm:-right-3.5 top-3.5 z-20 pointer-events-none">
                        <JavaneseRonceanMelatiTassel className="w-5 h-28 sm:h-32" />
                      </div>

                      <div className={`relative ${forceMobile ? 'w-36 h-52' : 'w-36 sm:w-44 h-52 sm:h-60'} rounded-t-[50px] overflow-hidden border-2 border-[#C2A468] p-1.5 bg-[#1A120D] shadow-2xl jawa-radiance-pulse`}>
                        <img
                          src={bridePhoto}
                          alt={brideName}
                          className="w-full h-full object-cover object-top rounded-t-[46px] hover:scale-105 transition-transform duration-700"
                        />
                        {/* Royal Palace Badge */}
                        <div className="absolute bottom-1.5 inset-x-1.5 bg-[#1A120D]/95 text-[#FAF6F0] text-[7.5px] uppercase tracking-wider text-center py-0.5 border border-[#C2A468]">
                          MEMPELAI PUTRI · SURAKARTA
                        </div>
                      </div>
                    </div>

                    <span className={`text-[9.5px] uppercase tracking-[0.28em] text-[#C2A468] ${titleFontClass} font-bold mb-0.5`}>
                      SANG PUTRI
                    </span>
                    <h3 className={`${headingFontClass} ${forceMobile ? 'text-lg' : 'text-lg sm:text-2xl'} text-[#FAF6F0] tracking-wide mb-0.5 leading-snug px-2`}>
                      {brideName}
                    </h3>
                    <p className={`${quoteFontClass} text-xs text-[#C2A468] mb-2`}>
                      ({brideNickname})
                    </p>

                    {(couple.brideFather || couple.brideMother) && (
                      <p className="text-xs text-[#D8C9B7] leading-relaxed mb-2.5 max-w-xs font-light px-2">
                        <span className="text-[8.5px] uppercase tracking-wider text-[#C2A468] block mb-0.5 font-medium">
                          Putri Kinasih Panjenenganipun:
                        </span>
                        <span className="font-serif font-normal text-[#FAF6F0]">
                          {couple.brideFather}
                          {couple.brideFather && couple.brideMother ? ' & ' : ''}
                          {couple.brideMother}
                        </span>
                      </p>
                    )}

                    {couple.brideBio && (
                      <p className="text-xs text-[#E8C872] italic leading-relaxed mb-2.5 max-w-xs font-serif px-2">
                        &ldquo;{couple.brideBio}&rdquo;
                      </p>
                    )}

                    {couple.brideInstagram && (
                      <a
                        href={`https://instagram.com/${couple.brideInstagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#C2A468] hover:text-[#FAF6F0] transition-colors border-b border-[#C2A468]/50 pb-0.5"
                      >
                        <span>{couple.brideInstagram}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Cultural Blessing Footer Ribbon */}
                <div className="mt-7 pt-4 border-t border-[#C2A468]/30 text-center relative z-10">
                  <div className="inline-flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rotate-45 bg-[#C2A468] jawa-diamond-pulse" />
                    <span className="text-[8px] uppercase tracking-[0.25em] text-[#C2A468] font-serif font-medium">
                      DOA PANGESTU SESAPUH KERATON
                    </span>
                    <div className="w-1.5 h-1.5 rotate-45 bg-[#C2A468] jawa-diamond-pulse" />
                  </div>
                  <p className="font-serif italic text-xs text-[#D8C9B7] max-w-md mx-auto leading-relaxed px-2">
                    &ldquo;Mugi Gusti Kang Akarya Jagad tansah paring berkah lumintu, dados pasangan ingkang runtung-runtung atut runtut dumugining kaken-kaken lan ninen-ninen.&rdquo;
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SCREEN 3: LELAKON KATRESNAN (BABAD PERJALANAN CINTA JAWA)                 */}
      {/* ========================================================================= */}
      {isOpen && vis.story && invitation.loveStories && invitation.loveStories.length > 0 && (
        <section
          id="section-kisah"
          className={`relative w-full ${forceMobile ? 'py-12 px-3' : 'py-14 sm:py-24 px-3.5 sm:px-8'} bg-[#201611] text-[#FAF6F0] overflow-hidden`}
        >
          {/* Deep Teak Wood Ambient Radial Gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 20%, #34241B 0%, #170F0B 85%)',
            }}
          />

          {/* Living Falling Jasmine Petals Across Section */}
          <JavaneseFallingPetals />

          {/* Living Batik Parang Drifting Slowly with Parallax */}
          <div 
            className="absolute inset-0 pointer-events-none jawa-anim-batik opacity-30"
            style={{
              transform: `translate3d(${-parallaxBatikX}px, ${parallaxBatikY * 0.7}px, 0)`,
            }}
          >
            <JavaneseBatikParangOverlay opacity={0.09} color="#D4AF37" />
          </div>

          {/* Golden Dust Motes */}
          <JavaneseFloatingDustMotes className="inset-0 pointer-events-none opacity-60" />

          <div className="relative z-10 max-w-xl mx-auto">
            <Reveal className="text-center mb-10 sm:mb-14">
              <JavaneseMentulIcon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-[#D4AF37] mb-2 jawa-radiance-pulse" />
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-serif font-semibold mb-1">
                BABAD LAMPAH KATRESNAN · LELAKON SUCI
              </p>
              <h2 className="font-serif text-xl sm:text-3xl uppercase tracking-wider text-[#FAF6F0] mb-2">
                Rantaman Kisah Kalbu
              </h2>
              <JavaneseFloralDivider className="w-32 sm:w-40 h-5 mx-auto text-[#C2A468]" />
              <p className="font-serif italic text-xs text-[#D8C9B7] mt-2.5 max-w-sm mx-auto leading-relaxed">
                Titi wanci lumampah, ngrajut katresnan dados satunggaling berkah suci ingkang nyawiji.
              </p>
            </Reveal>

            {/* Timeline Items with Glowing Gold Stem */}
            <div className={`relative border-l-2 border-[#C2A468]/50 ${forceMobile ? 'ml-3 pl-4 space-y-8' : 'ml-4 sm:ml-6 pl-5 sm:pl-8 space-y-10 sm:space-y-12'}`}>
              {invitation.loveStories.map((storyItem: LoveStoryItem, idx: number) => {
                const babakName =
                  idx === 0
                    ? 'PURWAKANTHI · AWAL TEPANG'
                    : idx === 1
                    ? 'TEMBUNG TRESNA · BRAYAN URIP'
                    : idx === 2
                    ? 'PRASETYA SUCI · NIKAHING TRESNA'
                    : `BABAK ${idx + 1}`;

                return (
                  <Reveal key={storyItem.id || idx} delay={idx * 120} className="relative group">
                    {/* Animated Pulsing Diamond Node */}
                    <div className={`absolute ${forceMobile ? '-left-[25px]' : '-left-[29px] sm:-left-[41px]'} top-3 w-4 h-4 rotate-45 bg-[#170F0B] border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.7)] jawa-diamond-pulse`}>
                      <div className="w-1.5 h-1.5 bg-[#D4AF37]" />
                    </div>

                    {/* Story Teak Wood Prasasti Card */}
                    <div className={`bg-[#241913] text-[#FAF6F0] border-2 border-[#C2A468]/70 ${forceMobile ? 'p-3.5' : 'p-4 sm:p-7'} shadow-[0_16px_36px_rgba(0,0,0,0.65)] relative transition-all duration-300 hover:border-[#D4AF37] jawa-gebyok-glow`}>
                      {/* Top Carved Wood Relief Inset */}
                      <div className="absolute top-0 inset-x-0 pointer-events-none opacity-40">
                        <JavaneseCarvedArchTop className="w-full h-5" color="#C2A468" accentColor="#D4AF37" />
                      </div>

                      {/* Corner Royal Brackets */}
                      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]/80" />
                      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]/80" />
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]/80" />
                      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]/80" />

                      {/* Babak Badge & Date Header */}
                      <div className="flex items-center justify-between border-b border-[#C2A468]/30 pb-2 mb-3 pt-0.5">
                        <span className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.18em] sm:tracking-[0.24em] text-[#E8C872] font-serif font-bold bg-[#382417] px-2.5 sm:px-3 py-0.5 border border-[#C2A468]/40 rounded-full">
                          {babakName}
                        </span>
                        <span className="text-[9.5px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.2em] text-[#D4AF37] font-serif font-semibold">
                          {storyItem.yearOrDate}
                        </span>
                      </div>

                      <h3 className="font-serif text-lg sm:text-2xl text-[#FAF6F0] tracking-wide mb-1.5">
                        {storyItem.title}
                      </h3>

                      <p className="text-xs text-[#D8C9B7] leading-relaxed font-light">
                        {storyItem.story}
                      </p>

                      {storyItem.photoUrl && (
                        <div className={`mt-4 w-full ${forceMobile ? 'h-40' : 'h-48 sm:h-56'} overflow-hidden border-2 border-[#C2A468]/60 shadow-lg relative group`}>
                          <img
                            src={storyItem.photoUrl}
                            alt={storyItem.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#170F0B]/60 via-transparent to-transparent pointer-events-none" />
                        </div>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3.5: SINEMATIKA PREWEDDING (VIDIO KASMARAN)                        */}
      {/* ========================================================================= */}
      {isOpen && (vis.video || Boolean(invitation.videoUrl) || invitation.activeAddonIds?.includes('video-prewedding')) && (
        <section
          id="section-video"
          className={`relative w-full ${forceMobile ? 'py-12 px-3' : 'py-14 sm:py-24 px-3.5 sm:px-8'} bg-[#1E140E] text-[#FAF6F0] overflow-hidden text-center`}
        >
          {/* Deep Teak Wood Ambient Radial Gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 25%, #301F16 0%, #150D08 90%)',
            }}
          />

          <JavaneseFallingPetals />
          <JavaneseFloatingDustMotes className="inset-0 pointer-events-none opacity-50" />

          <div className="relative z-10 max-w-xl mx-auto">
            <Reveal className="text-center mb-8 sm:mb-12">
              <Film className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-[#D4AF37] mb-2 jawa-radiance-pulse" />
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-serif font-semibold mb-1">
                SINEMATIKA KASMARAN · REKAMAN ABADI
              </p>
              <h2 className="font-serif text-xl sm:text-3xl uppercase tracking-wider text-[#FAF6F0] mb-2">
                Video Prewedding
              </h2>
              <JavaneseFloralDivider className="w-32 sm:w-40 h-5 mx-auto text-[#C2A468]" />
              <p className="font-serif italic text-xs text-[#D8C9B7] mt-2.5 max-w-sm mx-auto leading-relaxed px-2">
                &ldquo;Momen katresnan ingkang kerekam saklebeting bingkai rasa lan donga para sesepuh.&rdquo;
              </p>
            </Reveal>

            <Reveal delay={140} className="w-full">
              <div className={`w-full aspect-video rounded-sm overflow-hidden border-2 border-[#C2A468]/70 bg-[#120B07] shadow-2xl relative jawa-gebyok-glow`}>
                {/* Top Carved Arch Inset */}
                <div className="absolute top-0 inset-x-0 pointer-events-none opacity-40 z-20">
                  <JavaneseCarvedArchTop className="w-full h-5" color="#C2A468" accentColor="#D4AF37" />
                </div>

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
                        className="w-full h-full border-0 relative z-10"
                      />
                    );
                  }
                  return (
                    <video
                      controls
                      playsInline
                      poster={bridePhoto}
                      className="w-full h-full object-cover relative z-10"
                    >
                      <source src={videoSrc} type="video/mp4" />
                      Browser Panjenengan mboten nyengkuyung pemutaran video.
                    </video>
                  );
                })()}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 4: PASAMUWAN AGENG (RANGKAIAN ACARA SAKRAL ADAT JAWA)              */}
      {/* ========================================================================= */}
      {isOpen && vis.events && invitation.events && invitation.events.length > 0 && (
        <section
          id="section-acara"
          className={`relative w-full ${forceMobile ? 'py-12 px-3' : 'py-14 sm:py-24 px-3.5 sm:px-8'} bg-[#251A13] text-[#FAF6F0] overflow-hidden`}
        >
          {/* Deep Teak Wood Ambient Radial Gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 25%, #35251B 0%, #1A110B 90%)',
            }}
          />

          {/* Living Falling Jasmine Petals Across Section */}
          <JavaneseFallingPetals />

          {/* Living Gunungan Silhouette Watermark in Background */}
          <div className="absolute top-10 right-4 sm:right-10 pointer-events-none opacity-20 jawa-anim-gunungan">
            <JavaneseGununganSilhouette className={`${forceMobile ? 'w-36 h-56' : 'w-52 h-80'}`} color="#D4AF37" />
          </div>

          {/* Living Golden Dust Motes */}
          <JavaneseFloatingDustMotes className="inset-0 pointer-events-none opacity-60" />

          <div className="relative z-10 max-w-xl mx-auto">
            <Reveal className="text-center mb-10 sm:mb-14">
              <JavaneseJogloRoofSilhouette className="w-20 sm:w-24 h-10 sm:h-12 mx-auto text-[#D4AF37] mb-2 jawa-joglo-breathe" />
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-serif font-semibold mb-1">
                PRASASTI PASAMUWAN AGENG · RANGKAIAN ADAT
              </p>
              <h2 className="font-serif text-xl sm:text-3xl uppercase tracking-wider text-[#FAF6F0] mb-2">
                Tata Cara Pawiwahan
              </h2>
              <JavaneseFloralDivider className="w-32 sm:w-40 h-5 mx-auto text-[#C2A468]" />
              <p className="font-serif italic text-xs text-[#D8C9B7] mt-2.5">
                {formattedFullDate} · Sinartan Berkahing Para Sesepuh
              </p>
            </Reveal>

            {/* Events List as Royal Prasasti Inscriptions */}
            <div className="space-y-8 sm:space-y-10">
              {invitation.events.map((ev: EventDetail, idx: number) => {
                const lowerName = ev.name.toLowerCase();
                const ritualBadge =
                  lowerName.includes('ijab') || lowerName.includes('akad')
                    ? 'IJAB QOBUL · SAKRAL'
                    : lowerName.includes('resepsi')
                    ? 'PAHARGYAN PASAMUWAN AGENG'
                    : lowerName.includes('panggih')
                    ? 'UPACARA PANGGIH PENGANTEN'
                    : lowerName.includes('siraman') || lowerName.includes('midodareni')
                    ? 'RITUAL PURWAKANTHI MIDODARENI'
                    : `UPACARA SAKRAL ${idx + 1}`;

                return (
                  <Reveal key={ev.id || idx} delay={idx * 140}>
                    <div className={`relative bg-[#201611] text-[#FAF6F0] border-2 border-[#C2A468]/70 ${forceMobile ? 'p-4' : 'p-5 sm:p-8'} shadow-[0_20px_45px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-[#D4AF37] jawa-gebyok-glow`}>
                      {/* Swaying Roncean Melati Garland on Side (only on desktop non-forceMobile) */}
                      {!forceMobile && (
                        <div className="hidden sm:block absolute -right-3.5 top-8 pointer-events-none">
                          <JavaneseRonceanMelatiTassel className="w-5 h-28" />
                        </div>
                      )}

                      {/* Top Carved Arch Inset */}
                      <div className="absolute top-0 inset-x-0 pointer-events-none opacity-50">
                        <JavaneseCarvedArchTop className="w-full h-6" color="#C2A468" accentColor="#D4AF37" />
                      </div>

                      {/* Corner Royal Brackets */}
                      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]/80" />
                      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]/80" />
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]/80" />
                      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]/80" />

                      {/* Header with Traditional Ritual Badge */}
                      <div className="flex items-center justify-between border-b border-[#C2A468]/30 pb-2.5 mb-3.5 pt-1">
                        <span className="font-serif text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.24em] text-[#E8C872] font-bold bg-[#382417] px-2.5 sm:px-3 py-0.5 sm:py-1 border border-[#C2A468]/50 rounded-sm">
                          {ritualBadge}
                        </span>
                        <span className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#D4AF37] font-serif font-medium bg-[#170F0B] px-2.5 py-0.5 rounded-full border border-[#C2A468]/40">
                          {ev.timezone || 'WIB'}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h3 className="font-serif text-xl sm:text-3xl uppercase tracking-wider text-[#FAF6F0] mb-2.5">
                        {ev.name}
                      </h3>

                      {/* Time & Date */}
                      <div className="flex items-center gap-2 text-xs text-[#E8DCC8] mb-2 font-medium">
                        <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <span>
                          {ev.startTime}
                          {ev.endTime ? ` - ${ev.endTime}` : ''} {ev.timezone || 'WIB'}
                        </span>
                      </div>

                      {/* Venue & Address */}
                      <div className="flex items-start gap-2 text-xs text-[#C5B49F] mb-5 leading-relaxed">
                        <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-serif font-semibold text-[#FAF6F0] text-sm mb-0.5">{ev.venueName}</p>
                          <p className="text-[#A8947E] text-xs">{ev.address}</p>
                        </div>
                      </div>

                      {/* Google Maps Button with Royal Gold Gradient & Wax Seal Pulse */}
                      {ev.googleMapsUrl && (
                        <a
                          href={ev.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center justify-center gap-2 w-full ${forceMobile ? 'py-3 px-2 text-[9px] tracking-[0.14em]' : 'py-3.5 px-4 text-[9.5px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.24em]'} bg-gradient-to-r from-[#C2A468] via-[#D4AF37] to-[#C2A468] text-[#1E1510] border-2 border-[#FAF6F0]/40 hover:brightness-110 transition-all duration-300 font-serif font-bold cursor-pointer shadow-[0_6px_20px_rgba(212,175,55,0.35)] jawa-wax-seal`}
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#1E1510] shrink-0" />
                          <span>PUNJER LOKASI (BUKA PETA GOOGLE) →</span>
                        </a>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 5: LOCATION SPOTLIGHT (PAPAN DUNUNGING PASAMUWAN · JOGLO AGENG)    */}
      {/* ========================================================================= */}
      {isOpen && primaryEvent && (
        <section
          id="section-lokasi"
          className={`relative w-full ${forceMobile ? 'py-12 px-3.5' : 'py-16 sm:py-24 px-5 sm:px-8'} bg-[#20150F] text-[#FAF6F0] overflow-hidden`}
        >
          {/* Background Joglo Architecture Visual with breathing motion */}
          <div className="absolute inset-0 z-0 overflow-hidden opacity-35 jawa-anim-breathe">
            <img
              src="/images/jawa-heritage-joglo.jpg"
              alt="Lokasi Acara"
              className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#20150F] via-[#20150F]/85 to-[#20150F]/80" />
          </div>

          {/* Living Falling Jasmine Petals */}
          <JavaneseFallingPetals />

          {/* Living Golden Dust Motes */}
          <JavaneseFloatingDustMotes className="inset-0 pointer-events-none opacity-50" />

          <div className="relative z-10 max-w-lg mx-auto text-center">
            <Reveal>
              <JavaneseJogloRoofSilhouette className="w-20 sm:w-24 h-10 sm:h-12 mx-auto text-[#D4AF37] mb-2 sm:mb-3 jawa-joglo-breathe" />
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.34em] text-[#D4AF37] font-serif font-semibold mb-1">
                PAPAN DUNUNGING PASAMUWAN · LOKASI PERHELATAN
              </p>
              <h2 className={`font-serif ${forceMobile ? 'text-xl' : 'text-xl sm:text-3xl'} text-[#FAF6F0] tracking-wide mb-2 sm:mb-3`}>
                {primaryEvent.venueName}
              </h2>
              <JavaneseFloralDivider className="w-32 sm:w-36 h-5 mx-auto text-[#C2A468] mb-2.5 sm:mb-3" />
              <p className="text-xs text-[#D8C9B7] max-w-sm mx-auto leading-relaxed mb-6 sm:mb-7 font-light px-2">
                {primaryEvent.address}
              </p>

              {primaryEvent.googleMapsUrl && (
                <a
                  href={primaryEvent.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2.5 ${forceMobile ? 'px-5 py-3 text-[9px] tracking-[0.18em]' : 'px-8 py-3.5 text-[10px] tracking-[0.24em]'} rounded-full uppercase font-serif font-bold bg-gradient-to-r from-[#C2A468] via-[#D4AF37] to-[#C2A468] text-[#1E1510] hover:brightness-110 transition-all duration-300 shadow-[0_6px_22px_rgba(212,175,55,0.4)] cursor-pointer jawa-wax-seal`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#1E1510]" />
                  <span>PUNJER PETA GOOGLE</span>
                  <ExternalLink className="w-3 h-3 text-[#1E1510]" />
                </a>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 6: GALLERY (BAWARASA VISUAL · DOKUMENTASI PUSAKA)                   */}
      {/* ========================================================================= */}
      {isOpen && vis.gallery && invitation.gallery && invitation.gallery.length > 0 && (
        <section
          id="section-galeri"
          className={`relative w-full ${forceMobile ? 'py-12 px-3' : 'py-16 sm:py-24 px-4 sm:px-6'} bg-[#1D140F] text-[#FAF6F0] overflow-hidden`}
        >
          {/* Deep Teak Wood Ambient Radial Gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, #2F1F17 0%, #150E0A 90%)',
            }}
          />

          {/* Living Falling Jasmine Petals */}
          <JavaneseFallingPetals />

          {/* Subtle Ambient Living Parang Batik Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-25 jawa-anim-batik">
            <JavaneseBatikParangOverlay opacity={0.07} color="#D4AF37" />
          </div>

          {/* Living Golden Dust Motes */}
          <JavaneseFloatingDustMotes className="inset-0 pointer-events-none opacity-60" />

          <div className="max-w-xl mx-auto relative z-10">
            <Reveal className="text-center mb-10 sm:mb-14">
              <JavaneseMentulIcon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-[#D4AF37] mb-2 jawa-radiance-pulse" />
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.34em] text-[#D4AF37] font-serif font-semibold mb-1">
                LANGEN SWARA &amp; REKAMAN KAGUNAN · DOKUMENTASI PUSAKA
              </p>
              <h2 className="font-serif text-xl sm:text-3xl uppercase tracking-wider text-[#FAF6F0] mb-2">
                Lembaran Momen Endah
              </h2>
              <JavaneseFloralDivider className="w-32 sm:w-40 h-5 mx-auto text-[#C2A468]" />
              <p className="font-serif italic text-xs text-[#D8C9B7] mt-2.5 px-2">
                Titipan memori katresnan ingkang rinonce saklebeting bingkai kabagyan.
              </p>
            </Reveal>

            {/* Grid Gallery with Royal Gold Filigree Borders */}
            <div className={`grid grid-cols-2 ${forceMobile ? 'gap-2.5' : 'gap-3 sm:gap-5'}`}>
              {invitation.gallery.map((item: GalleryItem, idx: number) => {
                const isFull = idx === 0 || (idx + 1) % 5 === 0;
                return (
                  <Reveal
                    key={item.id || idx}
                    delay={idx * 80}
                    className={`${isFull ? (forceMobile ? 'col-span-2 h-56' : 'col-span-2 h-60 sm:h-96') : (forceMobile ? 'col-span-1 h-44' : 'col-span-1 h-48 sm:h-72')} relative group overflow-hidden border-2 border-[#C2A468]/60 cursor-pointer shadow-[0_12px_32px_rgba(0,0,0,0.6)] transition-all duration-500 hover:border-[#D4AF37] jawa-gebyok-glow`}
                  >
                    <div
                      className="w-full h-full relative"
                      onClick={() => setLightboxIndex(idx)}
                    >
                      {/* Corner Gold Brackets */}
                      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none z-10" />
                      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none z-10" />
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none z-10" />
                      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none z-10" />

                      <img
                        src={item.imageUrl}
                        alt={item.caption || `Foto Galeri ${idx + 1}`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#150E0A]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 z-10">
                        <p className="font-serif text-xs text-[#FAF6F0] tracking-wide">
                          {item.caption || `${groomNickname} & ${brideNickname}`}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Interactive Lightbox Modal */}
          {lightboxIndex !== null && invitation.gallery[lightboxIndex] && (
            <div
              className="fixed inset-0 z-50 bg-[#160F0B]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fade-in"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Close Bar */}
              <div className="flex items-center justify-between text-[#FAF6F0] z-10">
                <span className="font-serif text-xs uppercase tracking-widest text-[#C2A468]">
                  {lightboxIndex + 1} / {invitation.gallery.length}
                </span>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-2 text-[#FAF6F0] hover:text-[#C2A468] transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Main Image */}
              <div
                className="relative my-auto max-w-2xl max-h-[75vh] mx-auto w-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={invitation.gallery[lightboxIndex].imageUrl}
                  alt={invitation.gallery[lightboxIndex].caption || 'Foto Galeri'}
                  className="max-h-[75vh] w-auto max-w-full object-contain border-2 border-[#C2A468] shadow-2xl"
                />

                {/* Left Arrow */}
                <button
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev !== null ? (prev - 1 + invitation.gallery.length) % invitation.gallery.length : null
                    )
                  }
                  className="absolute left-2 sm:-left-12 p-2 rounded-full bg-[#2C1F17]/90 text-[#FAF6F0] border border-[#C2A468]/50 hover:bg-[#C2A468] hover:text-[#2C1F17] transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev !== null ? (prev + 1) % invitation.gallery.length : null
                    )
                  }
                  className="absolute right-2 sm:-right-12 p-2 rounded-full bg-[#2C1F17]/90 text-[#FAF6F0] border border-[#C2A468]/50 hover:bg-[#C2A468] hover:text-[#2C1F17] transition-all cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Caption */}
              <div className="text-center py-2 z-10" onClick={(e) => e.stopPropagation()}>
                <p className="font-serif text-xs sm:text-sm text-[#FAF6F0] tracking-wide">
                  {invitation.gallery[lightboxIndex].caption || `${groomNickname} & ${brideNickname}`}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 7: RSVP (SERAT PASRAWUNGAN · BUKU RAWUH PASAMUWAN AGENG)           */}
      {/* ========================================================================= */}
      {isOpen && vis.rsvp && (
        <section
          id="section-rsvp"
          className={`relative w-full ${forceMobile ? 'py-12 px-3' : 'py-16 sm:py-24 px-5 sm:px-8'} bg-[#1E1510] text-[#FAF6F0] overflow-hidden`}
        >
          {/* Deep Teak Wood Ambient Radial Gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 25%, #322218 0%, #160E09 85%)',
            }}
          />

          {/* Living Falling Jasmine Petals Across Section */}
          <JavaneseFallingPetals />

          {/* Living Golden Dust Motes */}
          <JavaneseFloatingDustMotes className="inset-0 pointer-events-none opacity-50" />

          <div className="relative z-10 max-w-lg mx-auto">
            <Reveal className="text-center mb-8 sm:mb-12">
              <JavaneseMentulIcon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-[#D4AF37] mb-2 jawa-radiance-pulse" />
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.34em] text-[#D4AF37] font-serif font-semibold mb-1">
                SERAT PASRAWUNGAN · BUKU RAWUH PASAMUWAN
              </p>
              <h2 className="font-serif text-xl sm:text-3xl uppercase tracking-wider text-[#FAF6F0] mb-2">
                Pawarta Rawuh &amp; Pandonga
              </h2>
              <JavaneseFloralDivider className="w-32 sm:w-40 h-5 mx-auto text-[#C2A468]" />
              <p className="text-xs text-[#D8C9B7] mt-2.5 font-light leading-relaxed px-2">
                Kula sakulawarga nyuwun sih kawelasan panjenengan kagem paring pawarta rawuh lan pandonga suci.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div className={`bg-[#241913] border-2 border-[#C2A468]/70 ${forceMobile ? 'p-4' : 'p-5 sm:p-8'} shadow-[0_20px_45px_rgba(0,0,0,0.7)] text-[#FAF6F0] relative jawa-gebyok-glow`}>
                {/* Top Carved Arch Inset */}
                <div className="absolute top-0 inset-x-0 pointer-events-none opacity-50">
                  <JavaneseCarvedArchTop className="w-full h-5 sm:h-6" color="#C2A468" accentColor="#D4AF37" />
                </div>

                {/* Corner Royal Brackets */}
                <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]/80" />
                <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]/80" />
                <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]/80" />
                <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]/80" />

                {isRsvpSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center mx-auto mb-4 text-[#D4AF37] jawa-radiance-pulse">
                      <Check className="w-7 h-7 stroke-[2]" />
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#FAF6F0] mb-2">
                      Matur Nuwun Sakalangkung
                    </h3>
                    <p className="text-xs text-[#D8C9B7] leading-relaxed max-w-xs mx-auto">
                      Pawarta rawuh saha donga pangestu panjenengan sampun katampi kanthi sae. Rawuh panjenengan minangka berkah ageng kagem calon penganten.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-4 sm:space-y-5 pt-1.5 sm:pt-2">
                    {/* Guest Name input */}
                    <div>
                      <label className="block text-[9.5px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#D4AF37] font-serif font-bold mb-1.5">
                        Asma Jangkep (Nama Lengkap)
                      </label>
                      <input
                        type="text"
                        required
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        placeholder="Serat asma jangkep panjenengan..."
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs bg-[#170F0B] border-2 border-[#C2A468]/50 text-[#FAF6F0] placeholder:text-[#8E7966] focus:outline-hidden focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    {/* Attendance status radio/buttons (proportional stack on mobile) */}
                    <div>
                      <label className="block text-[9.5px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#D4AF37] font-serif font-bold mb-1.5">
                        Pawarta Rawuh (Konfirmasi Kehadiran)
                      </label>
                      <div className={`grid ${forceMobile ? 'grid-cols-1 gap-2.5' : 'grid-cols-1 sm:grid-cols-2 gap-3'}`}>
                        <button
                          type="button"
                          onClick={() => setRsvpStatus('ATTENDING')}
                          className={`${forceMobile ? 'py-3 px-3 text-[11px]' : 'py-3.5 px-3 text-xs'} uppercase tracking-wider font-serif font-semibold border-2 transition-all cursor-pointer ${
                            rsvpStatus === 'ATTENDING'
                              ? 'bg-gradient-to-r from-[#C2A468] to-[#D4AF37] border-[#D4AF37] text-[#1E1510] font-bold shadow-md'
                              : 'bg-[#170F0B] border-[#C2A468]/40 text-[#FAF6F0] hover:border-[#D4AF37]'
                          }`}
                        >
                          Kula Badhe Rawuh (Hadir)
                        </button>
                        <button
                          type="button"
                          onClick={() => setRsvpStatus('NOT_ATTENDING')}
                          className={`${forceMobile ? 'py-3 px-3 text-[11px]' : 'py-3.5 px-3 text-xs'} uppercase tracking-wider font-serif font-semibold border-2 transition-all cursor-pointer ${
                            rsvpStatus === 'NOT_ATTENDING'
                              ? 'bg-gradient-to-r from-[#C2A468] to-[#D4AF37] border-[#D4AF37] text-[#1E1510] font-bold shadow-md'
                              : 'bg-[#170F0B] border-[#C2A468]/40 text-[#FAF6F0] hover:border-[#D4AF37]'
                          }`}
                        >
                          Nyuwun Pangapunten (Absen)
                        </button>
                      </div>
                    </div>

                    {/* Number of Pax (only if attending) */}
                    {rsvpStatus === 'ATTENDING' && (
                      <div>
                        <label className="block text-[9.5px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#D4AF37] font-serif font-bold mb-1.5">
                          Gunggung Rawuh (Jumlah Tamu)
                        </label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4].map((paxNum) => (
                            <button
                              key={paxNum}
                              type="button"
                              onClick={() => setRsvpPax(paxNum)}
                              className={`flex-1 ${forceMobile ? 'py-2 text-[11px]' : 'py-2.5 text-xs'} font-serif border-2 transition-all cursor-pointer ${
                                rsvpPax === paxNum
                                  ? 'bg-[#D4AF37] border-[#D4AF37] text-[#1E1510] font-bold shadow-sm'
                                  : 'bg-[#170F0B] border-[#C2A468]/40 text-[#FAF6F0] hover:border-[#D4AF37]'
                              }`}
                            >
                              {paxNum} Tamu
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ucapan / Notes */}
                    <div>
                      <label className="block text-[9.5px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#D4AF37] font-serif font-bold mb-1.5">
                        Donga Pangestu (Doa &amp; Ucapan)
                      </label>
                      <textarea
                        rows={3}
                        value={rsvpNotes}
                        onChange={(e) => setRsvpNotes(e.target.value)}
                        placeholder="Kintun donga pangestu kagem calon penganten..."
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs bg-[#170F0B] border-2 border-[#C2A468]/50 text-[#FAF6F0] placeholder:text-[#8E7966] focus:outline-hidden focus:border-[#D4AF37] transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button with Royal Gold & Wax Seal heartbeat */}
                    <button
                      type="submit"
                      disabled={isSubmittingRsvp}
                      className={`w-full ${forceMobile ? 'py-3.5 text-[10.5px] tracking-[0.18em]' : 'py-4 text-xs tracking-[0.24em]'} bg-gradient-to-r from-[#C2A468] via-[#D4AF37] to-[#C2A468] text-[#1E1510] border-2 border-[#FAF6F0]/40 hover:brightness-110 transition-all duration-300 uppercase font-serif font-bold shadow-[0_6px_22px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 jawa-wax-seal`}
                    >
                      {isSubmittingRsvp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#1E1510]" />
                          <span>NGINTUN SERAT...</span>
                        </>
                      ) : (
                        <span>KINTUN SERAT RAWUH →</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 8: DIGITAL GIFT (TANDA TRESNA & TALI ASIH PASAMUWAN)                 */}
      {/* ========================================================================= */}
      {isOpen && vis.gifts && hasGifts && (
        <section
          id="section-tanda-kasih"
          className={`relative w-full ${forceMobile ? 'py-12 px-3' : 'py-16 sm:py-24 px-5 sm:px-8'} bg-[#201611] text-[#FAF6F0] overflow-hidden`}
        >
          {/* Deep Teak Wood Ambient Radial Gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 25%, #34241B 0%, #160E09 85%)',
            }}
          />

          {/* Living Falling Jasmine Petals Across Section */}
          <JavaneseFallingPetals />

          {/* Living Batik Parang Texture */}
          <div className="absolute inset-0 pointer-events-none opacity-25 jawa-anim-batik">
            <JavaneseBatikParangOverlay opacity={0.07} color="#D4AF37" />
          </div>

          {/* Living Golden Dust Motes */}
          <JavaneseFloatingDustMotes className="inset-0 pointer-events-none opacity-50" />

          <div className="relative z-10 max-w-lg mx-auto">
            <Reveal className="text-center mb-8 sm:mb-12">
              <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37] mx-auto mb-2 jawa-radiance-pulse" />
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.34em] text-[#D4AF37] font-serif font-semibold mb-1">
                TANDA TRESNA &amp; TALI ASIH · PASAMUWAN
              </p>
              <h2 className="font-serif text-xl sm:text-3xl uppercase tracking-wider text-[#FAF6F0] mb-2">
                Titipan Donga &amp; Tali Asih
              </h2>
              <JavaneseFloralDivider className="w-32 sm:w-40 h-5 mx-auto text-[#C2A468]" />
              <p className="text-xs text-[#D8C9B7] mt-2.5 max-w-sm mx-auto leading-relaxed font-light px-2">
                Donga pangestu saha rawuh panjenengan sampun dados kado ingkang paling endah. Nanging bilih panjenengan badhe paring tandha tresna, saged lumantar:
              </p>
            </Reveal>

            {/* Gift Accounts List as Royal Golden Envelopes */}
            <div className="space-y-5 sm:space-y-6">
              {filteredGifts.map((gift: GiftAccount, idx: number) => {
                const isCopied = copiedId === (gift.id || String(idx));
                return (
                  <Reveal key={gift.id || idx} delay={idx * 120}>
                    <div className={`bg-[#241913] text-[#FAF6F0] border-2 border-[#C2A468]/70 ${forceMobile ? 'p-4' : 'p-5 sm:p-8'} shadow-[0_20px_45px_rgba(0,0,0,0.7)] text-center relative jawa-gebyok-glow`}>
                      {/* Top Carved Wood Relief Inset */}
                      <div className="absolute top-0 inset-x-0 pointer-events-none opacity-40">
                        <JavaneseCarvedArchTop className="w-full h-5" color="#C2A468" accentColor="#D4AF37" />
                      </div>

                      {/* Corner Royal Brackets */}
                      <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]/80" />
                      <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]/80" />
                      <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]/80" />
                      <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]/80" />

                      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#E8C872] font-serif font-bold mb-1.5 sm:mb-2 block">
                        AMPLOP ELEKTRONIK KENCANA · {gift.providerName}
                      </span>
                      <p className={`font-mono ${forceMobile ? 'text-lg tracking-wider my-2.5 py-2' : 'text-xl sm:text-2xl tracking-widest my-3 py-2.5'} text-[#FAF6F0] bg-[#170F0B] border border-[#C2A468]/40 rounded-sm select-all font-bold shadow-inner`}>
                        {gift.accountNumber}
                      </p>
                      <p className="text-xs text-[#D8C9B7] font-medium mb-4 sm:mb-5">
                        a.n. {gift.accountHolder}
                      </p>

                      <button
                        onClick={() => handleCopyAccount(gift.accountNumber, gift.id || String(idx))}
                        className={`inline-flex items-center gap-2 ${forceMobile ? 'px-5 py-2.5 text-[9.5px] tracking-[0.16em]' : 'px-8 py-3 text-[10px] tracking-[0.22em]'} uppercase border-2 transition-all cursor-pointer font-serif font-bold shadow-md jawa-wax-seal ${
                          isCopied
                            ? 'bg-[#2E6F40] border-[#4ADE80] text-white'
                            : 'bg-gradient-to-r from-[#C2A468] via-[#D4AF37] to-[#C2A468] border-[#FAF6F0]/40 text-[#1E1510] hover:brightness-110'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>NOMOR REKENING KASALIN!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#1E1510]" />
                            <span>SALIN NOMOR REKENING</span>
                          </>
                        )}
                      </button>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 9: CLOSING (MATUR NUWUN - BASA RINENGGA & LEMBAYUNG SENJA)          */}
      {/* ========================================================================= */}
      {isOpen && (
        <section className={`relative w-full ${forceMobile ? 'py-14 px-4' : 'py-20 sm:py-28 px-5 sm:px-8'} bg-[#170F0B] text-[#FAF6F0] overflow-hidden text-center`}>
          {/* Sunset Silhouette Joglo & Merapi Background */}
          <div className="absolute inset-0 z-0 overflow-hidden opacity-40 jawa-anim-breathe">
            <img
              src="/images/jawa-heritage-closing.jpg"
              alt="Matur Nuwun"
              className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#170F0B] via-[#170F0B]/85 to-[#170F0B]/70" />
          </div>

          {/* Living Falling Jasmine Petals */}
          <JavaneseFallingPetals />

          {/* Descending Golden Sunset Glow */}
          <div
            className="absolute top-10 inset-x-0 h-96 pointer-events-none jawa-anim-sunset"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(229, 137, 54, 0.35) 0%, rgba(179, 107, 52, 0.15) 50%, transparent 75%)',
            }}
          />

          {/* Twilight Evening Mist */}
          <div
            className="absolute inset-0 pointer-events-none jawa-anim-fog opacity-35"
            style={{
              background:
                'radial-gradient(ellipse at 50% 80%, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 max-w-md mx-auto">
            <Reveal>
              <JavaneseGununganSilhouette className={`${forceMobile ? 'w-18 h-28 mb-3.5' : 'w-24 h-36 mb-5'} mx-auto text-[#D4AF37] jawa-anim-gunungan`} />

              <h2 className={`font-serif ${forceMobile ? 'text-2xl tracking-[0.18em]' : 'text-2xl sm:text-4xl tracking-[0.24em]'} uppercase text-[#FAF6F0] mb-3`}>
                Matur Nuwun Sakalangkung
              </h2>

              <p className="font-serif italic text-xs sm:text-sm text-[#D8C9B7] leading-relaxed max-w-sm mx-auto mb-4">
                Awit sih katresnan, donga pangestu, saha karawuhan panjenengan sedaya ingkang paring berkah ing pirembagan ageng punika.
              </p>

              <p className="font-serif text-xs text-[#E8C872] tracking-wider mb-6">
                Mugi Gusti Kang Akarya Jagad tansah paring berkah lumintu, ayem tentrem, lan karaharjan kagem panjenengan sedaya.
              </p>

              <p className="font-serif italic text-sm text-[#D4AF37] tracking-[0.2em] font-semibold mb-6">
                Rahayu, Rahayu, Rahayu Sagung Dumadi.
              </p>

              <JavaneseFloralDivider className="w-36 h-5 mx-auto text-[#D4AF37] mb-7" />

              <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4AF37] font-semibold mb-2">
                KULA INGKANG HAMANGUN BEBRAYAN
              </p>

              <h3 className={`font-serif ${forceMobile ? 'text-2xl' : 'text-2xl sm:text-3xl'} text-[#FAF6F0] uppercase tracking-wider mb-2`}>
                {groomNickname} &amp; {brideNickname}
              </h3>

              <p className="font-serif text-xs text-[#D8C9B7] tracking-widest mb-6">
                {formattedDottedDate}
              </p>

              <p className="text-[9px] uppercase tracking-[0.3em] text-[#A8947E]">
                TRAH SURYOHADININGRATAN &amp; BROTODININGRATAN
              </p>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  );
}
