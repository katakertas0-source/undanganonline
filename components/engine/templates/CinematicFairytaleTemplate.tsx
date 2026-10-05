'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Menu,
  X,
  Heart,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  CheckSquare,
  Gift,
  Film,
  Music,
  User,
  Image as ImageIcon,
  Share2,
  Send,
} from 'lucide-react';
import { Invitation, LoveStoryItem, EventDetail, GalleryItem, GiftAccount } from '@/types';
import { submitRsvpAsync } from '@/lib/store';
import { AudioFloatingToggle } from '@/components/engine/AudioFloatingToggle';
import {
  FairytaleWaxSeal,
  FairytaleOliveBranch,
  FairytaleFlyingBirds,
  FairytaleFloatingMotes,
  FairytaleRoseDivider,
  FairytaleEmbossedPaper,
  FairytaleForegroundFoliage,
  FairytaleRoseFrame,
} from '@/components/ui/FairytaleOrnaments';
import { FairytaleRoyalGate } from '@/components/ui/FairytaleRoyalGate';
import { extractYouTubeId } from '@/lib/media';

interface CinematicFairytaleTemplateProps {
  invitation: Invitation;
  guestName?: string;
  isPreview?: boolean;
  forceMobile?: boolean;
  initialOpen?: boolean;
  isOpenControlled?: boolean;
  onOpenStateChange?: (open: boolean) => void;
  activeSectionTarget?: string;
}

interface FairytaleScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  animation?: 'fade-up' | 'fade-scale' | 'fade-left' | 'fade-right';
}

function FairytaleScrollReveal({
  children,
  className = '',
  delay = 0,
  yOffset = 26,
  animation = 'fade-up',
}: FairytaleScrollRevealProps) {
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
        const triggerPoint = cRect.bottom - 10;
        if (elRect.top <= triggerPoint && elRect.bottom >= cRect.top - 60) {
          setIsVisible(true);
          return true;
        }
      } else if (typeof window !== 'undefined') {
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const triggerPoint = windowHeight - 10;
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
            rootMargin: '0px 0px -10px 0px',
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

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
    switch (animation) {
      case 'fade-scale':
        return `translate3d(0, ${yOffset}px, 0) scale(0.95)`;
      case 'fade-left':
        return `translate3d(-24px, ${yOffset * 0.4}px, 0) scale(0.97)`;
      case 'fade-right':
        return `translate3d(24px, ${yOffset * 0.4}px, 0) scale(0.97)`;
      case 'fade-up':
      default:
        return `translate3d(0, ${yOffset}px, 0) scale(1)`;
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionProperty: 'opacity, transform',
        transitionDuration: '800ms',
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export function CinematicFairytaleTemplate({
  invitation,
  guestName,
  isPreview = false,
  forceMobile = false,
  initialOpen = false,
  isOpenControlled,
  onOpenStateChange,
  activeSectionTarget,
}: CinematicFairytaleTemplateProps) {
  const isControlled = typeof isOpenControlled === 'boolean';
  const [internalIsOpen, setInternalIsOpen] = useState(initialOpen);
  const isOpen = isControlled ? isOpenControlled : internalIsOpen;

  const setIsOpen = (open: boolean) => {
    setInternalIsOpen(open);
    onOpenStateChange?.(open);
  };

  const config = invitation.fairytaleConfig || {
    envelopeColor: 'sage',
    sealType: 'royal-crimson',
    instructionText: 'Buka Undangan',
    enableOpeningAnimation: true,
    zoomSpeed: 'cinematic',
    sceneStyle: 'royal-palace',
    birdsMotion: 'active',
    treesBreeze: 'gentle',
    titlePosition: 'center',
  };

  // Scene Progression Phases: 'envelope' -> 'explore' -> 'done'
  const [animationPhase, setAnimationPhase] = useState<'envelope' | 'explore' | 'done'>(
    initialOpen ? 'done' : 'envelope'
  );

  // Micro-step for envelope opening sequence
  const [animStep, setAnimStep] = useState<
    'idle' | 'pressed' | 'seal_breaking' | 'flap_open' | 'card_up' | 'zooming' | 'gate_reveal' | 'gate_opening'
  >('idle');

  // Sync with controlled isOpen state from Builder
  useEffect(() => {
    if (isControlled) {
      if (!isOpenControlled) {
        setAnimationPhase('envelope');
        setAnimStep('idle');
      } else {
        setAnimationPhase('explore');
      }
    }
  }, [isControlled, isOpenControlled]);

  // Copy states for bank accounts
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Lightbox Modal state for gallery
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState(guestName || '');
  const [rsvpStatus, setRsvpStatus] = useState<'ATTENDING' | 'NOT_ATTENDING' | 'TENTATIVE'>('ATTENDING');
  const [rsvpPax, setRsvpPax] = useState<number>(2);
  const [rsvpNotes, setRsvpNotes] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  // Wishes State
  const [wishes, setWishes] = useState(
    invitation.loveStories ? [] : []
  );
  const [newWishName, setNewWishName] = useState(guestName || '');
  const [newWishMessage, setNewWishMessage] = useState('');
  const [newWishRelation, setNewWishRelation] = useState('Sahabat');
  const [wishSubmitting, setWishSubmitting] = useState(false);
  const [localWishes, setLocalWishes] = useState<Array<{ name: string; msg: string; rel: string; time: string }>>([
    {
      name: 'Bapak Hendra Gunawan & Rekan',
      rel: 'VIP',
      msg: 'Selamat berbahagia untuk Arthur & Amanda! Semoga selalu rukun, bahagia, dan cinta kalian abadi seperti kisah dongeng terindah.',
      time: 'Baru saja',
    },
    {
      name: 'Clarissa Abigail & Partner',
      rel: 'Sahabat',
      msg: 'Happy wedding dear Amanda & Arthur! Such a breathtaking fairytale celebration! Wishing you both endless joy and prosperity!',
      time: '1 jam yang lalu',
    },
    {
      name: 'Keluarga Besar Pratama',
      rel: 'Keluarga',
      msg: 'Selamat menempuh hidup baru anak kami tercinta. Semoga senantiasa dalam berkah dan lindungan Tuhan Yang Maha Esa.',
      time: '3 jam yang lalu',
    },
  ]);

  // Mobile Bottom Navigation menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate Countdown
  useEffect(() => {
    const targetDate = new Date(invitation.eventDate || '2026-12-20T09:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [invitation.eventDate]);

  // Scroll visibility for sticky bottom dock and dynamic hero parallax
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScroll = (sy: number) => {
      setScrollOffset(sy);
      setIsScrolledPastHero(sy > 80);
    };

    const handleScroll = () => {
      const sy = window.scrollY || document.documentElement.scrollTop;
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScroll(sy);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const mobileContainer = document.getElementById('device-viewport-mobile');
    const desktopContainer = document.querySelector('[data-device-viewport="true"]');
    const onContainerScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && !ticking) {
        requestAnimationFrame(() => {
          updateScroll(target.scrollTop);
          ticking = false;
        });
        ticking = true;
      }
    };

    if (mobileContainer) mobileContainer.addEventListener('scroll', onContainerScroll, { passive: true });
    if (desktopContainer) desktopContainer.addEventListener('scroll', onContainerScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (mobileContainer) mobileContainer.removeEventListener('scroll', onContainerScroll);
      if (desktopContainer) desktopContainer.removeEventListener('scroll', onContainerScroll);
    };
  }, []);

  // Keep internal open state synced with external controlled prop
  useEffect(() => {
    if (typeof isOpenControlled === 'boolean') {
      if (isOpenControlled && animationPhase === 'envelope') {
        setAnimationPhase('explore');
      } else if (!isOpenControlled && animationPhase !== 'envelope') {
        setAnimationPhase('envelope');
      }
    }
  }, [isOpenControlled, animationPhase]);

  // Handle activeSectionTarget in builder preview
  useEffect(() => {
    if (!isPreview) return;

    if (!isOpen) {
      const container = document.getElementById('device-viewport') || document.getElementById('device-viewport-mobile');
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (isOpen && activeSectionTarget) {
      const targetMap: Record<string, string> = {
        cover: 'fairytale-cover',
        couple: 'fairytale-couple',
        events: 'fairytale-events',
        story: 'fairytale-story',
        gallery: 'fairytale-gallery',
        video: 'fairytale-video',
        gifts: 'fairytale-gifts',
        rsvp: 'fairytale-rsvp',
      };
      const elementId = targetMap[activeSectionTarget];
      if (elementId) {
        const timer = setTimeout(() => {
          const el = document.getElementById(elementId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, activeSectionTarget, isPreview]);

  // Trigger Full-Screen Envelope Opening Sequence
  const handleOpenEnvelope = () => {
    if (!config.enableOpeningAnimation) {
      setAnimationPhase('explore');
      setIsOpen(true);
      return;
    }

    // Dynamic speed factor from user settings: fast (0.65x), slow (1.4x), cinematic (1.0x)
    const speedFactor = config.zoomSpeed === 'fast' ? 0.65 : config.zoomSpeed === 'slow' ? 1.4 : 1.0;

    // Step 1: Tactile button/seal press feedback
    setAnimStep('pressed');

    // Step 2: Wax seal releases naturally with golden sparkles
    const t1 = setTimeout(() => {
      setAnimStep('seal_breaking');
    }, Math.round(180 * speedFactor));

    // Step 3: Top triangular flap opens realistically in 3D
    const t2 = setTimeout(() => {
      setAnimStep('flap_open');
    }, Math.round(550 * speedFactor));

    // Step 4: Inner invitation card emerges from inside the envelope
    const t3 = setTimeout(() => {
      setAnimStep('card_up');
    }, Math.round(1050 * speedFactor));

    // Step 5: Royal Gate Reveal - virtual camera approaches the grand palace gate
    const t4 = setTimeout(() => {
      setAnimStep('gate_reveal');
    }, Math.round(1750 * speedFactor));

    // Step 6: 3D Gate Swing Open - the ornate wrought-iron gates swing open to the sides
    const t5 = setTimeout(() => {
      setAnimStep('gate_opening');
    }, Math.round(2300 * speedFactor));

    // Step 7: Arrive in the romantic garden fountain and reveal wedding typography & floating birds
    // Cross-fade seamlessly into cover as gates swing open
    const t6 = setTimeout(() => {
      setAnimationPhase('explore');
      setIsOpen(true);
    }, Math.round(3600 * speedFactor));

    // Step 8: Completely unmount Scene 1 after smooth fade-out completes
    const t7 = setTimeout(() => {
      setAnimationPhase('done');
    }, Math.round(4800 * speedFactor));

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  };

  // Handle Copy to Clipboard
  const handleCopyAccount = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Handle RSVP Submit
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    setRsvpLoading(true);
    try {
      await submitRsvpAsync(
        invitation.id,
        rsvpName,
        rsvpStatus,
        rsvpPax,
        rsvpNotes
      );
      setRsvpSubmitted(true);
    } catch {
      setRsvpSubmitted(true);
    } finally {
      setRsvpLoading(false);
    }
  };

  // Handle Add Wish
  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishName.trim() || !newWishMessage.trim()) return;

    setWishSubmitting(true);
    setLocalWishes([
      {
        name: newWishName,
        rel: newWishRelation,
        msg: newWishMessage,
        time: 'Baru saja',
      },
      ...localWishes,
    ]);
    setNewWishMessage('');
    setWishSubmitting(false);
  };

  // Font Preset System: editorial-cormorant (default), modern-serif, clean-sans
  const fontPreset = invitation.fontPreset || 'editorial-cormorant';
  const isCleanSans = fontPreset === 'clean-sans';
  const isModernSerif = fontPreset === 'modern-serif';

  const headingFontClass = isCleanSans
    ? 'font-sans font-light tracking-[0.2em] uppercase'
    : isModernSerif
    ? 'font-serif font-medium tracking-[0.16em]'
    : 'font-serif font-normal tracking-wide';

  const titleFontClass = isCleanSans
    ? 'font-sans font-medium tracking-[0.16em]'
    : isModernSerif
    ? 'font-serif font-medium tracking-wider'
    : 'font-serif font-normal tracking-wide';

  const quoteFontClass = isCleanSans
    ? 'font-sans font-light tracking-wide not-italic'
    : 'font-serif italic';

  const serifClass = isCleanSans ? 'font-sans' : 'font-serif';
  const monoClass = isCleanSans ? 'font-sans uppercase text-[11px] font-medium tracking-widest' : 'font-mono uppercase tracking-[0.24em]';

  // Color & Theme Presets: warm-linen (default), offwhite-noir, nocturne-black
  const colorPreset = invitation.colorPreset || 'warm-linen';
  const theme = {
    'warm-linen': {
      pageBg: 'bg-[#FAF7F2]',
      pageBgHex: '#FAF7F2',
      altSectionBg: 'bg-[#F4EFE6]/60',
      textPrimary: 'text-[#2E241A]',
      textSecondary: 'text-[#7A6B5C]',
      textMuted: 'text-[#A6998C]',
      accentGold: 'text-[#C69C54]',
      accentGoldBg: 'bg-[#C69C54]',
      borderSoft: 'border-[#EADBCA]',
      borderSoftAlpha: 'border-[#EADBCA]/70',
      cardBg: 'bg-white/95',
      cardSolidBg: 'bg-white',
      inputBg: 'bg-[#FAF7F2]',
      buttonPrimary: 'bg-gradient-to-r from-[#C69C54] to-[#B88E4B] hover:from-[#B88E4B] hover:to-[#A6803C] text-white',
      badgeBg: 'bg-[#FAF4EB]',
      isDark: false,
    },
    'offwhite-noir': {
      pageBg: 'bg-[#F8F8F8]',
      pageBgHex: '#F8F8F8',
      altSectionBg: 'bg-[#F0F0F0]/70',
      textPrimary: 'text-[#141414]',
      textSecondary: 'text-[#5A5A5A]',
      textMuted: 'text-[#8A8A8A]',
      accentGold: 'text-[#333333]',
      accentGoldBg: 'bg-[#333333]',
      borderSoft: 'border-neutral-300',
      borderSoftAlpha: 'border-neutral-200',
      cardBg: 'bg-white/95',
      cardSolidBg: 'bg-white',
      inputBg: 'bg-neutral-50',
      buttonPrimary: 'bg-[#181818] hover:bg-[#333333] text-white',
      badgeBg: 'bg-neutral-100',
      isDark: false,
    },
    'nocturne-black': {
      pageBg: 'bg-[#12100E]',
      pageBgHex: '#12100E',
      altSectionBg: 'bg-[#181512]',
      textPrimary: 'text-[#F5EFEB]',
      textSecondary: 'text-[#B8AC9E]',
      textMuted: 'text-[#85796C]',
      accentGold: 'text-[#E2C285]',
      accentGoldBg: 'bg-[#E2C285]',
      borderSoft: 'border-[#C69C54]/30',
      borderSoftAlpha: 'border-[#C69C54]/20',
      cardBg: 'bg-[#1C1814]/95 text-[#F5EFEB]',
      cardSolidBg: 'bg-[#1E1915]',
      inputBg: 'bg-[#25201A] text-[#F5EFEB]',
      buttonPrimary: 'bg-gradient-to-r from-[#D4AF37] to-[#B88E4B] hover:from-[#E2C285] hover:to-[#C69C54] text-[#1A140B] font-bold',
      badgeBg: 'bg-[#2A231C]',
      isDark: true,
    },
  }[colorPreset] || {
    pageBg: 'bg-[#FAF7F2]',
    pageBgHex: '#FAF7F2',
    altSectionBg: 'bg-[#F4EFE6]/60',
    textPrimary: 'text-[#2E241A]',
    textSecondary: 'text-[#7A6B5C]',
    textMuted: 'text-[#A6998C]',
    accentGold: 'text-[#C69C54]',
    accentGoldBg: 'bg-[#C69C54]',
    borderSoft: 'border-[#EADBCA]',
    borderSoftAlpha: 'border-[#EADBCA]/70',
    cardBg: 'bg-white/95',
    cardSolidBg: 'bg-white',
    inputBg: 'bg-[#FAF7F2]',
    buttonPrimary: 'bg-gradient-to-r from-[#C69C54] to-[#B88E4B] text-white',
    badgeBg: 'bg-[#FAF4EB]',
    isDark: false,
  };

  // Envelope Color Theme mapping
  const envelopeColorMap: Record<
    string,
    { bg: string; border: string; flapBg: string; text: string; subText: string; btnBg: string; innerCardBg: string; innerBorder: string }
  > = {
    ivory: {
      bg: 'bg-[#FBF9F5]',
      border: 'border-[#EADBCA]',
      flapBg: 'bg-[#F3EDE2]',
      text: 'text-[#3E342B]',
      subText: 'text-[#7A6B5C]',
      btnBg: 'bg-[#3C3028] text-[#FBF9F5] hover:bg-[#524237]',
      innerCardBg: 'bg-[#FCFBF8]',
      innerBorder: 'border-[#C69C54]/60',
    },
    'blush-cream': {
      bg: 'bg-[#FAF0ED]',
      border: 'border-[#ECD0C8]',
      flapBg: 'bg-[#F4E2DC]',
      text: 'text-[#5C3B37]',
      subText: 'text-[#8E635F]',
      btnBg: 'bg-[#4A2E2A] text-[#FAF7F2] hover:bg-[#613D38]',
      innerCardBg: 'bg-[#FFF9F7]',
      innerBorder: 'border-[#C27E74]/60',
    },
    sage: {
      bg: 'bg-[#E5ECE1]',
      border: 'border-[#CBD7C6]',
      flapBg: 'bg-[#D8E3D5]',
      text: 'text-[#1E2C1B]',
      subText: 'text-[#3D4F3A]',
      btnBg: 'bg-[#2E3C2B] text-[#FAF7F2] hover:bg-[#3D4F39]',
      innerCardBg: 'bg-[#F6FAF4]',
      innerBorder: 'border-[#5C7559]/60',
    },
    'royal-navy': {
      bg: 'bg-[#18202F]',
      border: 'border-[#2D3C57]',
      flapBg: 'bg-[#131A26]',
      text: 'text-[#E5ECF6]',
      subText: 'text-[#A0B0C8]',
      btnBg: 'bg-[#C69C54] text-[#18202F] hover:bg-[#D4AB63]',
      innerCardBg: 'bg-[#141A26]',
      innerBorder: 'border-[#C69C54]/60',
    },
  };

  const currentEnvelopeTheme = envelopeColorMap[config.envelopeColor || 'ivory'] || envelopeColorMap.ivory;
  const isDarkEnvelope = config.envelopeColor === 'royal-navy';

  // Section Visibilities
  const vis = invitation.sectionVisibility;
  const couple = invitation.couple;
  const events = invitation.events || [];
  const gallery = invitation.gallery || [];
  const loveStories = invitation.loveStories || [];
  const gifts = invitation.gifts || [];

  // Check if events share identical venue and location
  const isSameLocation = events.length <= 1 || (
    events.length > 1 &&
    (events[0]?.venueName || '').trim().toLowerCase() === (events[1]?.venueName || '').trim().toLowerCase() &&
    (events[0]?.address || '').trim().toLowerCase() === (events[1]?.address || '').trim().toLowerCase() &&
    ((events[0]?.googleMapsUrl || '').trim() === (events[1]?.googleMapsUrl || '').trim() || !events[1]?.googleMapsUrl)
  );

  // Dynamic Height: Locked strictly to 736px inside DeviceFrame preview, 800px on desktop preview, or 100dvh on mobile
  const heroCoverHeightClass = forceMobile
    ? 'h-[736px] min-h-[736px] max-h-[736px]'
    : isPreview
    ? 'h-[800px] min-h-[800px] max-h-[800px]'
    : 'h-[100dvh] min-h-[100dvh] max-h-[100dvh]';

  return (
    <div className={`fairytale-template-wrapper relative w-full min-h-screen ${theme.pageBg} ${theme.textPrimary} font-sans selection:bg-[#EADBCA] selection:text-[#2E241A] overflow-x-hidden transition-colors duration-300`}>
      {/* Dynamic Isolated Style Rules for 3D Camera, Envelope Perspective, & Parallax Animation */}
      <style jsx global>{`
        @keyframes castleContinuousGlide {
          0% {
            transform: scale(1.0) translate3d(0, 0, 0);
          }
          100% {
            transform: scale(1.16) translate3d(0, -2.6%, 0);
          }
        }

        @keyframes heroCardRiseIn {
          0% {
            opacity: 0;
            transform: translateY(32px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1.0);
          }
        }

        @keyframes fairytaleCameraZoom {
          0% {
            transform: scale(1.25) translateY(-1.5%);
          }
          100% {
            transform: scale(1.0) translateY(0);
          }
        }

        @keyframes doveFlap {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(0.4);
          }
        }

        @keyframes songbirdFlap {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(0.45);
          }
        }

        @keyframes birdCross1 {
          0% {
            transform: translate3d(-100px, 15px, 0);
            opacity: 0;
          }
          3% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translate3d(calc(100vw + 100px), -40px, 0);
            opacity: 0;
          }
        }

        @keyframes birdCross2 {
          0% {
            transform: translate3d(-100px, 30px, 0) scale(0.85);
            opacity: 0;
          }
          4% {
            opacity: 1;
          }
          94% {
            opacity: 1;
          }
          100% {
            transform: translate3d(calc(100vw + 100px), -15px, 0) scale(0.85);
            opacity: 0;
          }
        }

        @keyframes birdCross3 {
          0% {
            transform: translate3d(calc(100vw + 90px), -10px, 0) scaleX(-1) scale(0.65);
            opacity: 0;
          }
          4% {
            opacity: 0.85;
          }
          94% {
            opacity: 0.85;
          }
          100% {
            transform: translate3d(-90px, 25px, 0) scaleX(-1) scale(0.65);
            opacity: 0;
          }
        }

        @keyframes fairyFloat {
          0%, 100% {
            transform: translateY(0) scale(0.85);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-16px) scale(1.15);
            opacity: 0.85;
          }
        }

        @keyframes gentleBreezeLeft {
          0%, 100% {
            transform: rotate(0deg) skewX(0deg);
          }
          30% {
            transform: rotate(4deg) skewX(-2deg) translateY(2px);
          }
          70% {
            transform: rotate(-2deg) skewX(1deg) translateY(-1px);
          }
        }

        @keyframes gentleBreezeRight {
          0%, 100% {
            transform: rotate(0deg) skewX(0deg);
          }
          35% {
            transform: rotate(-4deg) skewX(2deg) translateY(2px);
          }
          65% {
            transform: rotate(2deg) skewX(-1deg) translateY(-1px);
          }
        }

        @keyframes goldShineSweep {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes envelopeFlapOpen {
          0% {
            transform: rotateX(0deg);
            z-index: 30;
          }
          100% {
            transform: rotateX(180deg);
            z-index: 10;
          }
        }

        .animate-dove-flap {
          animation: doveFlap 0.45s ease-in-out infinite;
          transform-origin: center center;
        }

        .animate-songbird-flap {
          animation: songbirdFlap 0.38s ease-in-out infinite;
          transform-origin: center center;
        }

        .animate-bird-cross-1 {
          animation: birdCross1 13s linear infinite;
          will-change: transform;
        }

        .animate-bird-cross-2 {
          animation: birdCross2 15s 4.5s linear infinite;
          will-change: transform;
        }

        .animate-bird-cross-3 {
          animation: birdCross3 18s 8s linear infinite;
          will-change: transform;
        }

        .animate-bird-glide-1 {
          animation: birdCross1 13s linear infinite;
        }

        .animate-bird-glide-2 {
          animation: birdCross2 15s 4.5s linear infinite;
        }

        .animate-bird-glide-3 {
          animation: birdCross3 18s 8s linear infinite;
        }

        .animate-fairy-float {
          animation: fairyFloat 4s ease-in-out infinite;
        }

        .animate-gentle-breeze-left {
          animation: gentleBreezeLeft 6s ease-in-out infinite;
        }

        .animate-gentle-breeze-right {
          animation: gentleBreezeRight 6.5s ease-in-out infinite;
        }

        .animate-castle-video {
          animation: castleContinuousGlide 26s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite alternate;
          will-change: transform;
        }

        .animate-card-rise-in {
          animation: heroCardRiseIn 1.8s 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fountainRipple {
          0% {
            transform: scale(0.65) scaleY(0.4);
            opacity: 0.85;
          }
          50% {
            opacity: 0.55;
          }
          100% {
            transform: scale(1.65) scaleY(0.4);
            opacity: 0;
          }
        }

        @keyframes fountainSpray {
          0% {
            transform: translateY(0) scaleY(1);
            opacity: 0.75;
          }
          50% {
            transform: translateY(-8px) scaleY(1.15);
            opacity: 0.98;
          }
          100% {
            transform: translateY(0) scaleY(1);
            opacity: 0.75;
          }
        }

        @keyframes waterGlint {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.3);
          }
        }

        @keyframes fountainMist {
          0%, 100% {
            opacity: 0.35;
            transform: translateX(-6px) scale(0.95);
          }
          50% {
            opacity: 0.7;
            transform: translateX(6px) scale(1.06);
          }
        }

        .animate-fountain-ripple {
          animation: fountainRipple 3.2s cubic-bezier(0.1, 0.45, 0.1, 1) infinite;
          transform-origin: center center;
        }

        .animate-fountain-spray {
          animation: fountainSpray 2.2s ease-in-out infinite;
        }

        .animate-water-glint {
          animation: waterGlint 2s ease-in-out infinite;
        }

        .animate-fountain-mist {
          animation: fountainMist 4.5s ease-in-out infinite;
        }

        .perspective-1000 {
          perspective: 1200px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .gold-shimmer-text {
          background: linear-gradient(
            120deg,
            #B88E4B 0%,
            #EADBCA 25%,
            #C69C54 50%,
            #FFF1D4 75%,
            #B88E4B 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: goldShineSweep 5s linear infinite;
        }
      `}</style>



      {/* ========================================================================= */}
      {/* SCENE 1 — REALISTIC 3D FULL-SCREEN ENVELOPE OPENING (Frames 1 - 4) */}
      {/* ========================================================================= */}
      {animationPhase !== 'done' && (
        <section
          className={`fixed inset-0 z-50 flex items-center justify-center bg-[#18130E] overflow-hidden select-none touch-none transition-opacity duration-1000 ease-out ${
            animationPhase === 'explore' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Ambient Fairytale Palace & Garden Backdrop (Frame 1) */}
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="/images/fairytale-palace-garden.jpg"
              alt="Fairytale Castle Backdrop"
              fill
              className="object-cover object-center filter blur-[3px] scale-105 brightness-90"
              priority
            />
            <div className="absolute inset-0 bg-black/25 pointer-events-none" />
          </div>


          {/* Floating Fairy Dust Sparkles */}
          <FairytaleFloatingMotes />

          {/* Mobile Viewport / Phone Frame Container */}
          <div
            className="relative w-full h-full max-w-[430px] mx-auto flex flex-col items-center justify-between p-4 overflow-hidden z-20"
            style={{
              perspective: '1400px',
              transform:
                animStep === 'zooming' || animStep === 'gate_reveal' || animStep === 'gate_opening'
                  ? 'scale(2.6)'
                  : 'scale(1)',
              opacity:
                animStep === 'zooming' || animStep === 'gate_reveal' || animStep === 'gate_opening'
                  ? 0
                  : 1,
              transition:
                animStep === 'zooming' || animStep === 'gate_reveal' || animStep === 'gate_opening'
                  ? 'all 0.85s cubic-bezier(0.22, 1, 0.36, 1)'
                  : 'none',
              pointerEvents:
                animStep === 'gate_reveal' || animStep === 'gate_opening' ? 'none' : 'auto',
            }}
          >
            {/* The Luxury Embossed Envelope (Dynamic colors: ivory, blush-cream, sage, royal-navy) */}
            <div className={`relative my-auto w-full max-w-[340px] sm:max-w-[370px] aspect-[4/5] ${currentEnvelopeTheme.bg} rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.65)] ${currentEnvelopeTheme.border} border overflow-hidden flex flex-col justify-between transition-colors duration-500`}>
              {/* Authentic Photographic Botanical Embossed Paper Texture (Color-adaptive via grayscale) */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src="/images/fairytale-envelope-texture.jpg"
                  alt="Luxury Embossed Envelope"
                  fill
                  className={`object-cover object-center pointer-events-none transition-opacity duration-500 ${
                    isDarkEnvelope
                      ? 'mix-blend-overlay opacity-30 grayscale'
                      : 'grayscale contrast-125 mix-blend-multiply opacity-35'
                  }`}
                  priority
                />
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-500"
                  style={{
                    background:
                      config.envelopeColor === 'royal-navy'
                        ? 'radial-gradient(ellipse at 50% 45%, rgba(45,65,100,0.5) 0%, rgba(10,15,25,0.85) 100%)'
                        : config.envelopeColor === 'blush-cream'
                        ? 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.7) 0%, rgba(220,160,150,0.25) 100%)'
                        : config.envelopeColor === 'sage'
                        ? 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.6) 0%, rgba(80,110,75,0.25) 100%)'
                        : 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.7) 0%, rgba(198,156,84,0.18) 100%)',
                  }}
                />
              </div>

              {/* 2. Inner Invitation Letter Card (Slides Up out of Envelope Pocket - Frame 4) */}
              <div
                className="absolute inset-x-3.5 top-6 h-[88%] z-15 pointer-events-none flex flex-col"
                style={{
                  transform:
                    animStep === 'card_up' || animStep === 'zooming'
                      ? 'translateY(-110px) scale(1.02)'
                      : 'translateY(70px) scale(0.95)',
                  opacity: animStep === 'card_up' || animStep === 'zooming' ? 1 : 0,
                  transition: 'transform 1.05s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease',
                }}
              >
                <div className={`w-full h-full ${currentEnvelopeTheme.innerCardBg} border-2 ${currentEnvelopeTheme.innerBorder} rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] p-5 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors duration-500`}>
                  <div className="absolute inset-2 border border-[#C69C54]/25 rounded-lg pointer-events-none" />
                  <div className="relative z-10 py-6 flex flex-col items-center justify-center">
                    {/* Monogram Crest A&A */}
                    <span className={`${serifClass} italic text-3xl sm:text-4xl text-[#B88E4B] font-bold tracking-widest block drop-shadow-xs`}>
                      {couple.groomNickname?.[0] || 'A'}&amp;{couple.brideNickname?.[0] || 'A'}
                    </span>
                    <FairytaleRoseDivider className="w-24 h-4 my-2.5 mx-auto" />
                    <h3 className={`${serifClass} italic text-3xl sm:text-4xl ${currentEnvelopeTheme.text} font-normal tracking-wide mt-2`}>
                      You are Invited
                    </h3>
                    <p className={`${monoClass} text-[9.5px] uppercase tracking-[0.24em] ${currentEnvelopeTheme.subText} mt-4`}>
                      {invitation.eventDate?.replace(/-/g, ' . ') || '2026 . 12 . 20'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Top Triangular Flap with 3D Fold (Frames 1, 3, 4) */}
              <div
                className="absolute inset-x-0 top-0 h-[50%] z-30 pointer-events-none"
                style={{
                  perspective: '1400px',
                  transformOrigin: 'top center',
                }}
              >
                <div
                  className="relative w-full h-full"
                  style={{
                    transformOrigin: 'top center',
                    transformStyle: 'preserve-3d',
                    transform:
                      animStep === 'flap_open' || animStep === 'card_up' || animStep === 'zooming'
                        ? 'rotateX(180deg)'
                        : 'rotateX(0deg)',
                    transition: 'transform 0.95s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {/* Flap Outer Face with Authentic Embossed Texture & Letterpress Names (Frame 1) */}
                  <div
                    className={`absolute inset-0 overflow-hidden ${currentEnvelopeTheme.flapBg} transition-colors duration-500`}
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.4))',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <Image
                      src="/images/fairytale-envelope-texture.jpg"
                      alt="Flap Texture"
                      fill
                      className={`object-cover object-top pointer-events-none transition-opacity duration-500 ${
                        isDarkEnvelope
                          ? 'mix-blend-overlay opacity-30 grayscale'
                          : 'grayscale contrast-125 mix-blend-multiply opacity-35'
                      }`}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          isDarkEnvelope
                            ? 'linear-gradient(180deg, rgba(50,70,110,0.4) 0%, rgba(15,22,35,0.7) 100%)'
                            : 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.08) 100%)',
                      }}
                    />
                    
                    {/* Names and Date Letterpressed on Flap (Frame 1) */}
                    <div className="relative z-10 pt-7 text-center px-4">
                      <p className={`${serifClass} italic text-lg sm:text-xl ${currentEnvelopeTheme.text} tracking-wide font-normal ${isDarkEnvelope ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]' : 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]'}`}>
                        {couple.groomNickname} &amp; {couple.brideNickname}
                      </p>
                      <p className={`${monoClass} text-[9px] uppercase tracking-[0.24em] ${currentEnvelopeTheme.subText} mt-0.5 font-medium ${isDarkEnvelope ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]' : 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]'}`}>
                        {invitation.eventDate?.replace(/-/g, ' . ') || '2026 . 12 . 20'}
                      </p>
                    </div>

                    {/* Flap Crease & Highlight Lines */}
                    <svg viewBox="0 0 400 240" fill="none" className="w-full h-full absolute inset-0 pointer-events-none">
                      <path d="M0 0 L200 236 L400 0" stroke={isDarkEnvelope ? "rgba(200,220,255,0.3)" : "rgba(255,255,255,0.85)"} strokeWidth="2.5" />
                      <path d="M0 0 L200 240 L400 0" stroke={isDarkEnvelope ? "rgba(10,15,25,0.6)" : "rgba(60,50,40,0.2)"} strokeWidth="3" />
                    </svg>
                  </div>

                  {/* Flap Inner Lining (Shown when flipped up - Frame 4) */}
                  <div
                    className={`absolute inset-0 overflow-hidden ${currentEnvelopeTheme.innerCardBg} transition-colors duration-500`}
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      transform: 'rotateX(180deg)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      boxShadow: 'inset 0 0 30px rgba(198,156,84,0.15)',
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center pt-10">
                      <FairytaleRoseDivider className="w-24 h-5 opacity-40" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. 3D Wax Seal (Variants: royal-crimson, botanical-wax, monogram-gold, royal-crest) */}
              <div
                className="absolute left-1/2 top-[50%] z-40 flex flex-col items-center justify-center pointer-events-auto"
                style={{
                  transform:
                    animStep === 'pressed'
                      ? 'translate(-50%, -50%) scale(0.93)'
                      : animStep === 'seal_breaking' || animStep === 'flap_open' || animStep === 'card_up' || animStep === 'zooming'
                      ? 'translate(-50%, calc(-50% + 46px)) scale(0.88) rotate(5deg)'
                      : 'translate(-50%, -50%) scale(1)',
                  opacity:
                    animStep === 'seal_breaking' || animStep === 'flap_open' || animStep === 'card_up' || animStep === 'zooming'
                      ? 0
                      : 1,
                  transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease',
                  pointerEvents: animStep === 'idle' ? 'auto' : 'none',
                }}
              >
                <button
                  type="button"
                  onClick={handleOpenEnvelope}
                  className="group relative cursor-pointer focus:outline-none transition-transform duration-200 hover:scale-105 active:scale-95 flex flex-col items-center justify-center"
                  title={config.instructionText || 'Sentuh Segel Untuk Membuka Undangan'}
                  aria-label={config.instructionText || 'Sentuh segel lilin untuk membuka undangan'}
                >
                  <div className="relative drop-shadow-[0_18px_32px_rgba(0,0,0,0.7)] drop-shadow-[0_6px_12px_rgba(120,15,10,0.55)]">
                    <FairytaleWaxSeal
                      className="w-24 h-24 sm:w-26 sm:h-26"
                      variant={(config.sealType as any) || 'royal-crimson'}
                      monogramText={`${couple.groomNickname?.[0] || 'A'}&${couple.brideNickname?.[0] || 'A'}`}
                    />
                  </div>
                  {/* Subtle breathing aura */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#FFA8A0]/60 animate-ping opacity-30 pointer-events-none" />

                  {/* Instruction Badge right below wax seal */}
                  <div className="absolute -bottom-8 whitespace-nowrap px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/25 shadow-md flex items-center gap-1.5 pointer-events-none transition-all">
                    <Sparkles className="w-3 h-3 text-[#E2C285]" />
                    <span className="text-[9px] uppercase tracking-wider text-white font-medium">
                      {config.instructionText || 'Buka Undangan'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Lower Invitation Card Guest Name Label */}
              <div className="relative z-20 w-full pt-[54%] pb-6 px-4 flex flex-col items-center justify-center text-center pointer-events-none mt-auto">
                <div className="px-4 py-1.5 rounded-full bg-black/25 backdrop-blur-md border border-white/30 shadow-md flex flex-col items-center">
                  <span className="text-[7.5px] uppercase tracking-[0.24em] text-white/85 font-medium">
                    Kepada Yth.
                  </span>
                  <span className={`${serifClass} text-xs text-white font-semibold tracking-wide`}>
                    {guestName || 'Bapak Budi Santoso'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Screen 3D Royal Gate Opening Sequence */}
          {(animStep === 'gate_reveal' || animStep === 'gate_opening') && (
            <div className="fixed inset-0 z-50 animate-fade-in pointer-events-auto">
              <FairytaleRoyalGate
                isOpen={animStep === 'gate_opening'}
                forceMobile={forceMobile}
                onEnterGarden={() => {
                  setAnimationPhase('explore');
                  setIsOpen(true);
                }}
              />
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCENE 2 — FULL WEDDING INVITATION EXPLORATION (Scrollable Details) */}
      {/* ========================================================================= */}
      <main className="relative z-10 w-full pb-36">
        {/* HERO / COVER HERO SECTION matching reference media_1790826315205.png */}
        {/* HERO / COVER HERO SECTION matching Frame 6 of media_1790835135905.jpg */}
        <section
          id="fairytale-cover"
          className={`relative ${heroCoverHeightClass} w-full flex flex-col justify-between items-center text-center px-4 overflow-hidden`}
        >
          {/* Panoramic Backdrop - Continuous Cinematic Zoom & Realtime Scroll Parallax */}
          <div
            className="absolute inset-0 z-0 overflow-hidden"
            style={{
              transform: `translate3d(0, ${scrollOffset * 0.28}px, 0)`,
              willChange: 'transform',
            }}
          >
            <div
              className={`relative w-full h-full ${
                isOpen || animationPhase === 'explore' ? 'animate-castle-video' : 'scale-100'
              }`}
              style={{
                transform: `scale(${1 + Math.min(scrollOffset, 600) * 0.0006})`,
                transformOrigin: 'center center',
                transition: 'transform 80ms ease-out',
              }}
            >
              <Image
                src="/images/fairytale-garden-fountain.jpg"
                alt="Enchanted Fairytale Garden Fountain"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/30 pointer-events-none" />
          </div>

          {/* Animated Bird & Dust Motifs */}
          {config.birdsMotion !== 'off' && <FairytaleFlyingBirds />}
          <FairytaleFloatingMotes />

          {/* Upper Sky Floating Typography with Parallax Dissolve on Scroll */}
          <div
            className="relative z-20 mt-10 sm:mt-14 mb-auto w-full max-w-[340px] sm:max-w-md px-3 py-2 flex flex-col items-center justify-center text-center animate-card-rise-in"
            style={{
              transform: `translate3d(0, -${scrollOffset * 0.45}px, 0) scale(${Math.max(0.86, 1 - scrollOffset * 0.0005)})`,
              opacity: Math.max(0, 1 - scrollOffset / 240),
              willChange: 'transform, opacity',
            }}
          >
            <p className={`${headingFontClass} uppercase tracking-[0.32em] text-[10px] sm:text-xs text-[#F2E5D0] drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] font-semibold`}>
              {invitation.coverTitle || 'THE WEDDING OF'}
            </p>
            <h1 className={`${serifClass} text-3xl sm:text-4xl md:text-5xl font-normal text-white mt-1.5 mb-1 tracking-wide drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap`}>
              <span>{couple.groomNickname || 'Arthur'}</span>
              <span className={`italic font-light ${theme.isDark ? 'text-[#E2C285]' : 'text-[#F5D59A]'} text-2xl sm:text-3xl`}>&amp;</span>
              <span>{couple.brideNickname || 'Amanda'}</span>
            </h1>
            <p className={`${monoClass} text-xs sm:text-sm uppercase tracking-[0.28em] text-[#F0E4D0] drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] my-1 font-medium`}>
              {invitation.eventDate ? invitation.eventDate.replace(/-/g, ' · ') : '2026 · 12 · 20'}
            </p>
            <p className={`${quoteFontClass} text-xs sm:text-[13px] text-white/95 max-w-[280px] mx-auto mt-2 mb-1 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]`}>
              &ldquo;{invitation.openingQuote || 'Once in a while, right in the middle of an ordinary life, love gives us a fairytale.'}&rdquo;
            </p>
          </div>

          {/* Bottom Scroll Indicator (Fades out quickly on scroll) */}
          <div
            className="relative z-20 pb-8 sm:pb-9 flex flex-col items-center gap-1 transition-opacity pointer-events-none"
            style={{
              opacity: Math.max(0, 1 - scrollOffset / 60),
            }}
          >
            <span className={`text-[8px] sm:text-[8.5px] uppercase tracking-[0.22em] text-white/90 ${serifClass} drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]`}>
              GULIR KE BAWAH
            </span>
            <ChevronDown className="w-4 h-4 text-[#E2C285] animate-bounce drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
          </div>
        </section>

        {/* SECTION: DEDICATED ROYAL COUNTDOWN BANNER matching reference media_1790826347386.png */}
        <section
          id="fairytale-countdown"
          className={`relative z-10 w-full py-8 sm:py-12 px-4 flex flex-col items-center text-center overflow-hidden scroll-mt-14 sm:scroll-mt-20 ${theme.pageBg} transition-colors duration-500`}
        >
          {/* Background Fountain Landscape with soft gradient */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/fairytale-palace-garden.jpg"
              alt="Fairytale Fountain Landscape"
              fill
              className="object-cover object-center opacity-30"
              priority
            />
            <div className={`absolute inset-0 bg-gradient-to-b ${theme.isDark ? 'from-[#12100E]/70 via-[#12100E]/90 to-[#12100E]' : colorPreset === 'offwhite-noir' ? 'from-[#F8F8F8]/70 via-[#F8F8F8]/90 to-[#F8F8F8]' : 'from-[#FAF7F2]/70 via-[#FAF7F2]/90 to-[#FAF7F2]'}`} />
          </div>

          <FairytaleFloatingMotes />

          {/* Top Header matching Frame 7 */}
          <FairytaleScrollReveal animation="fade-up" className="relative z-10 text-center mb-4 sm:mb-5">
            <h2 className={`${serifClass} text-2xl sm:text-3xl ${theme.textPrimary} font-normal tracking-wide`}>
              {couple.groomNickname} <span className={`italic font-light ${theme.accentGold} text-xl sm:text-2xl`}>&amp;</span> {couple.brideNickname}
            </h2>
            <p className={`${monoClass} text-xs uppercase tracking-[0.24em] ${theme.textSecondary} mt-1 font-medium`}>
              {invitation.eventDate || '2026-12-20'}
            </p>
          </FairytaleScrollReveal>

          {/* Dedicated Royal Countdown Card matching Frame 7 */}
          <FairytaleScrollReveal animation="fade-scale" delay={150} className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto">
            <div className={`${theme.cardBg} backdrop-blur-md border ${theme.borderSoft} shadow-lg p-4 sm:p-6 rounded-sm text-center w-full transition-colors duration-500`}>
              <p className={`text-[9px] uppercase tracking-[0.24em] ${theme.textSecondary} font-medium mb-1`}>
                COUNTDOWN TO OUR SPECIAL DAY
              </p>
              <FairytaleRoseDivider className="w-24 h-3.5 my-1 mx-auto" />
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mt-2.5">
                <div className={`${theme.altSectionBg} p-2 sm:p-2.5 rounded-xs border ${theme.borderSoftAlpha} text-center shadow-2xs`}>
                  <span className={`${serifClass} text-xl sm:text-2xl font-medium ${theme.textPrimary} block`}>
                    {timeLeft.days}
                  </span>
                  <span className={`text-[8px] uppercase tracking-wider ${theme.textMuted}`}>HARI</span>
                </div>
                <div className={`${theme.altSectionBg} p-2 sm:p-2.5 rounded-xs border ${theme.borderSoftAlpha} text-center shadow-2xs`}>
                  <span className={`${serifClass} text-xl sm:text-2xl font-medium ${theme.textPrimary} block`}>
                    {timeLeft.hours}
                  </span>
                  <span className={`text-[8px] uppercase tracking-wider ${theme.textMuted}`}>JAM</span>
                </div>
                <div className={`${theme.altSectionBg} p-2 sm:p-2.5 rounded-xs border ${theme.borderSoftAlpha} text-center shadow-2xs`}>
                  <span className={`${serifClass} text-xl sm:text-2xl font-medium ${theme.textPrimary} block`}>
                    {timeLeft.minutes}
                  </span>
                  <span className={`text-[8px] uppercase tracking-wider ${theme.textMuted}`}>MENIT</span>
                </div>
                <div className={`${theme.altSectionBg} p-2 sm:p-2.5 rounded-xs border ${theme.borderSoftAlpha} text-center shadow-2xs`}>
                  <span className={`${serifClass} text-xl sm:text-2xl font-medium ${theme.textPrimary} block`}>
                    {timeLeft.seconds}
                  </span>
                  <span className={`text-[8px] uppercase tracking-wider ${theme.textMuted}`}>DETIK</span>
                </div>
              </div>
              <p className={`${quoteFontClass} text-[11px] sm:text-xs ${theme.textSecondary} mt-2.5`}>
                Menghitung hari menuju lembaran baru kisah cinta kami
              </p>
            </div>
          </FairytaleScrollReveal>

          {/* Holy Verse Quote below countdown */}
          <FairytaleScrollReveal animation="fade-up" delay={200} className="relative z-10 mt-6 sm:mt-8 px-4 max-w-xl mx-auto text-center">
            <p className={`text-[9.5px] uppercase tracking-[0.28em] ${theme.accentGold} font-medium ${serifClass}`}>
              UNTUK MEMULAI KISAH KAMI
            </p>
            <FairytaleRoseDivider className="w-28 h-4 my-2 mx-auto" />
            <p className={`${quoteFontClass} text-xs sm:text-sm ${theme.textSecondary} leading-relaxed max-w-lg mx-auto`}>
              &ldquo;{invitation.holyVerse || 'Two souls with but a single thought, two hearts that beat as one. Dalam kasih yang tulus dan berkah yang luhur, kami menyatukan langkah menuju kehidupan baru.'}&rdquo;
            </p>
          </FairytaleScrollReveal>
        </section>

        {/* SECTION 2: THE COUPLE PROFILES matching Frame 8 of media_1790835135905.jpg */}
        {vis.profile && (
          <section
            id="fairytale-couple"
            className={`relative scroll-mt-14 sm:scroll-mt-20 pt-8 pb-10 sm:pt-10 sm:pb-14 px-5 sm:px-8 ${theme.pageBg} border-t ${theme.borderSoftAlpha} overflow-hidden transition-colors duration-500`}
          >
            <div className="relative z-10 max-w-sm sm:max-w-xl mx-auto">
              {/* Title: MEMPELAI PERNIKAHAN matching Frame 8 */}
              <FairytaleScrollReveal animation="fade-up" className="text-center mb-6 sm:mb-8">
                <p className={`text-[10px] uppercase tracking-[0.28em] ${theme.accentGold} font-medium ${serifClass}`}>
                  MEMPELAI PERNIKAHAN
                </p>
                <FairytaleRoseDivider className="w-28 h-4 my-2 mx-auto" />
              </FairytaleScrollReveal>

              {/* Side-by-Side Arched Oval Portraits with Center & Badge */}
              <div className="flex items-start justify-center gap-2.5 sm:gap-6 px-1">
                {/* Groom (Arthur) */}
                <FairytaleScrollReveal animation="fade-left" delay={120} className="flex flex-col items-center text-center flex-1 max-w-[150px] sm:max-w-[180px]">
                  <div className={`relative aspect-[3/4] w-24 sm:w-32 rounded-full overflow-hidden border-2 ${theme.isDark ? 'border-[#E2C285]' : 'border-[#C69C54]'} shadow-md group`}>
                    <Image
                      src={couple.groomPhotoUrl || '/images/fairytale-arthur-portrait.jpg'}
                      alt={couple.groomName}
                      fill
                      unoptimized={Boolean(couple.groomPhotoUrl?.startsWith('http'))}
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <h3 className={`${serifClass} text-base sm:text-lg font-bold ${theme.textPrimary} mt-2.5 leading-snug`}>
                    {couple.groomNickname || 'Arthur'}
                  </h3>
                  <p className={`${serifClass} text-xs ${theme.textSecondary} font-medium`}>
                    {couple.groomName ? couple.groomName.replace(/^Arthur\s*/i, '') : 'Putra Santoso'}
                  </p>
                  <p className={`text-[10px] ${theme.textMuted} mt-1 leading-relaxed max-w-[130px] sm:max-w-[160px] mx-auto`}>
                    {couple.groomBio || (couple.groomFather || couple.groomMother ? `Putra pertama dari ${couple.groomFather} & ${couple.groomMother}` : 'Putra pertama dari Bapak Budi Santoso & Ibu Ratna Dewi')}
                  </p>
                  {couple.groomInstagram && (
                    <a
                      href={`https://instagram.com/${couple.groomInstagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full ${theme.badgeBg} border ${theme.borderSoft} text-[9.5px] ${theme.accentGold} hover:opacity-80 transition-colors`}
                    >
                      <span>{couple.groomInstagram}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </FairytaleScrollReveal>

                {/* Center Cursive & Sign */}
                <FairytaleScrollReveal animation="fade-scale" delay={200} className="flex flex-col items-center justify-center self-center shrink-0 -mt-14 sm:-mt-16 px-0.5">
                  <span className={`${serifClass} italic text-2xl sm:text-3xl ${theme.accentGold} select-none`}>
                    &amp;
                  </span>
                </FairytaleScrollReveal>

                {/* Bride (Amanda) */}
                <FairytaleScrollReveal animation="fade-right" delay={180} className="flex flex-col items-center text-center flex-1 max-w-[150px] sm:max-w-[180px]">
                  <div className={`relative aspect-[3/4] w-24 sm:w-32 rounded-full overflow-hidden border-2 ${theme.isDark ? 'border-[#E2C285]' : 'border-[#C69C54]'} shadow-md group`}>
                    <Image
                      src={couple.bridePhotoUrl || '/images/fairytale-amanda-portrait.jpg'}
                      alt={couple.brideName}
                      fill
                      unoptimized={Boolean(couple.bridePhotoUrl?.startsWith('http'))}
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <h3 className={`${serifClass} text-base sm:text-lg font-bold ${theme.textPrimary} mt-2.5 leading-snug`}>
                    {couple.brideNickname || 'Amanda'}
                  </h3>
                  <p className={`${serifClass} text-xs ${theme.textSecondary} font-medium`}>
                    {couple.brideName ? couple.brideName.replace(/^Amanda\s*/i, '') : 'Kirana'}
                  </p>
                  <p className={`text-[10px] ${theme.textMuted} mt-1 leading-relaxed max-w-[130px] sm:max-w-[160px] mx-auto`}>
                    {couple.brideBio || (couple.brideFather || couple.brideMother ? `Putri kedua dari ${couple.brideFather} & ${couple.brideMother}` : 'Putri kedua dari Bapak Dedi Wijaya & Ibu Sari Lestari')}
                  </p>
                  {couple.brideInstagram && (
                    <a
                      href={`https://instagram.com/${couple.brideInstagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full ${theme.badgeBg} border ${theme.borderSoft} text-[9.5px] ${theme.accentGold} hover:opacity-80 transition-colors`}
                    >
                      <span>{couple.brideInstagram}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </FairytaleScrollReveal>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: WEDDING EVENTS & SCHEDULE matching Frame 9 of media_1790835135905.jpg */}
        {vis.events && events.length > 0 && (
          <section id="fairytale-events" className={`relative scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-24 px-4 sm:px-8 ${theme.altSectionBg} border-y ${theme.borderSoft} overflow-hidden transition-colors duration-500`}>

            <div className="relative z-10 max-w-sm sm:max-w-md mx-auto">
              {/* Header matching Frame 9 */}
              <FairytaleScrollReveal animation="fade-up" className="text-center mb-10 sm:mb-14">
                <p className={`text-[11px] uppercase tracking-[0.28em] ${theme.accentGold} font-medium ${serifClass}`}>
                  DETAIL ACARA
                </p>
                <FairytaleRoseDivider className="w-28 h-4 my-2 mx-auto" />
              </FairytaleScrollReveal>

              {/* Stacked Events matching Frame 9 Editorial Style */}
              <div className="space-y-6 sm:space-y-8">
                {events.map((ev, idx) => (
                  <FairytaleScrollReveal key={ev.id || idx} animation="fade-scale" delay={idx * 140}>
                    <div className="space-y-3.5 pl-1 sm:pl-3">
                      {/* Event Title, Date, Time with Left-Aligned Gold Calendar Icon */}
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`w-10 h-10 rounded-sm ${theme.badgeBg} border ${theme.borderSoft} flex items-center justify-center shrink-0 mt-0.5 shadow-2xs`}>
                          <Calendar className={`w-5 h-5 ${theme.accentGold}`} />
                        </div>
                        <div>
                          <h3 className={`${serifClass} text-base sm:text-lg font-bold ${theme.textPrimary} uppercase tracking-wider`}>
                            {ev.name}
                          </h3>
                          <p className={`text-xs sm:text-sm ${theme.textSecondary} mt-0.5 font-medium`}>
                            {ev.date}
                          </p>
                          <p className={`text-xs ${theme.textMuted}`}>
                            {ev.startTime} {ev.endTime ? `- ${ev.endTime}` : ''} {ev.timezone}
                          </p>
                        </div>
                      </div>

                      {/* Venue & Address with Left-Aligned Gold MapPin Icon */}
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className={`w-5 h-5 ${theme.accentGold}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`${serifClass} text-sm sm:text-base font-semibold ${theme.textPrimary}`}>
                            {ev.venueName}
                          </h4>
                          <p className={`text-xs ${theme.textSecondary} mt-0.5 leading-relaxed`}>
                            {ev.address}
                          </p>
                          {/* Direct Map Route Link per Event Card */}
                          <div className="mt-2">
                            <a
                              href={ev.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((ev.venueName ? ev.venueName + ' ' : '') + (ev.address || ''))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider font-semibold ${theme.accentGold} hover:opacity-80 transition-colors underline underline-offset-2`}
                            >
                              <span>Buka Rute Maps ({ev.name})</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ornate Gold Rose Divider between events */}
                    {idx < events.length - 1 && (
                      <div className="my-7 flex items-center justify-center">
                        <FairytaleRoseDivider className="w-32 h-4 mx-auto" />
                      </div>
                    )}
                  </FairytaleScrollReveal>
                ))}
              </div>

              {/* Action Buttons for Google Maps Navigation (1 or 2 Buttons depending on location differences) */}
              <FairytaleScrollReveal animation="fade-up" delay={260} className="mt-9 max-w-sm mx-auto">
                {isSameLocation ? (
                  <a
                    href={events[0]?.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((events[0]?.venueName ? events[0]?.venueName + ' ' : '') + (events[0]?.address || ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3.5 px-6 ${theme.buttonPrimary} rounded-xs text-xs uppercase tracking-widest font-semibold shadow-md inline-flex items-center justify-center gap-2 transition-all cursor-pointer`}
                  >
                    <MapPin className="w-4 h-4 text-white" />
                    <span>LIHAT LOKASI ACARA</span>
                  </a>
                ) : (
                  <div className="flex flex-col gap-3">
                    {events.map((ev, idx) => (
                      <a
                        key={ev.id || idx}
                        href={ev.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((ev.venueName ? ev.venueName + ' ' : '') + (ev.address || ''))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-3.5 px-6 ${theme.buttonPrimary} rounded-xs text-xs uppercase tracking-widest font-semibold shadow-md inline-flex items-center justify-center gap-2 transition-all cursor-pointer`}
                      >
                        <MapPin className="w-4 h-4 text-white shrink-0" />
                        <span className="truncate">LIHAT LOKASI {ev.name?.toUpperCase() || `ACARA #${idx + 1}`}</span>
                      </a>
                    ))}
                  </div>
                )}
              </FairytaleScrollReveal>
            </div>
          </section>
        )}

        {/* SECTION 4: LOVE STORY TIMELINE matching Frame 10 of media_1790835135905.jpg */}
        {vis.story && loveStories.length > 0 && (
          <section id="fairytale-story" className={`relative scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-24 px-4 sm:px-8 ${theme.pageBg} overflow-hidden transition-colors duration-500`}>

            <div className="relative z-10 max-w-lg mx-auto">
              <FairytaleScrollReveal animation="fade-up" className="text-center mb-10 sm:mb-14">
                <p className={`text-[10px] uppercase tracking-[0.28em] ${theme.accentGold} font-medium ${serifClass}`}>
                  KISAH KAMI
                </p>
                <FairytaleRoseDivider className="w-32 h-5 my-2 mx-auto" />
              </FairytaleScrollReveal>

              {/* Vertical Timeline with Circular Photo Thumbnails matching Frame 10 */}
              <div className="relative space-y-8 pl-2 sm:pl-4">
                {/* Continuous Gold Connecting Line */}
                <div className={`absolute left-[34px] sm:left-[38px] top-6 bottom-6 w-[1.5px] ${theme.isDark ? 'bg-[#E2C285]/30' : 'bg-[#C69C54]/30'}`} />

                {loveStories.map((item, idx) => (
                  <FairytaleScrollReveal key={item.id || idx} animation="fade-up" delay={idx * 120} className="relative flex items-start gap-4 sm:gap-5 z-10">
                    {/* Circular Photo Thumbnail */}
                    <div className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 ${theme.isDark ? 'border-[#E2C285]' : 'border-[#C69C54]'} shadow-md shrink-0 ${theme.altSectionBg}`}>
                      <Image
                        src={item.photoUrl || (idx === 0 ? '/images/fairytale-couple-together.jpg' : idx === 1 ? '/images/fairytale-amanda-portrait.jpg' : '/images/fairytale-arthur-portrait.jpg')}
                        alt={item.title}
                        fill
                        unoptimized={Boolean(item.photoUrl?.startsWith('http'))}
                        className="object-cover"
                      />
                    </div>

                    {/* Milestone Details */}
                    <div className="flex-1 pt-1">
                      <span className={`${monoClass} text-xs uppercase tracking-widest ${theme.accentGold} font-bold block`}>
                        {item.yearOrDate}
                      </span>
                      <h3 className={`${serifClass} text-base sm:text-lg font-bold ${theme.textPrimary} mt-0.5`}>
                        {item.title}
                      </h3>
                      <p className={`text-xs sm:text-[13px] ${theme.textSecondary} mt-1 leading-relaxed`}>
                        {item.story}
                      </p>
                    </div>
                  </FairytaleScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5: GALLERY matching Frame 11 of media_1790835135905.jpg */}
        {vis.gallery && gallery.length > 0 && (
          <section id="fairytale-gallery" className={`relative scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-24 px-4 sm:px-8 ${theme.altSectionBg} border-t ${theme.borderSoft} overflow-hidden transition-colors duration-500`}>

            <div className="relative z-10 max-w-5xl mx-auto">
              <FairytaleScrollReveal animation="fade-up" className="text-center mb-10 sm:mb-14">
                <p className={`text-[10px] uppercase tracking-[0.28em] ${theme.accentGold} font-medium ${serifClass}`}>
                  GALERI FOTO
                </p>
                <FairytaleRoseDivider className="w-32 h-5 my-2 mx-auto" />
              </FairytaleScrollReveal>

              <div className={`grid ${forceMobile ? 'grid-cols-2 gap-2.5' : 'grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4'}`}>
                {gallery.map((photo, idx) => (
                  <FairytaleScrollReveal
                    key={photo.id || idx}
                    animation="fade-scale"
                    delay={(idx % 4) * 80}
                  >
                    <div
                      onClick={() => setLightboxIndex(idx)}
                      className={`relative aspect-[4/5] rounded-sm overflow-hidden border ${theme.borderSoft} shadow-xs cursor-pointer group`}
                    >
                      <Image
                        src={photo.imageUrl}
                        alt={photo.caption || `Gallery ${idx + 1}`}
                        fill
                        unoptimized={Boolean(photo.imageUrl?.startsWith('http'))}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white/90" />
                      </div>
                    </div>
                  </FairytaleScrollReveal>
                ))}
              </div>

              {/* Lightbox Modal */}
              {lightboxIndex !== null && gallery[lightboxIndex] && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(null)}
                    className="absolute top-4 right-4 z-50 text-white p-2 hover:bg-white/10 rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <div className="relative max-w-3xl max-h-[85vh] w-full aspect-[4/5]">
                    <Image
                      src={gallery[lightboxIndex].imageUrl}
                      alt="Enlarged"
                      fill
                      unoptimized={Boolean(gallery[lightboxIndex].imageUrl?.startsWith('http'))}
                      className="object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex((lightboxIndex + 1) % gallery.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 6: VIDEO PREWEDDING */}
        {vis.video && invitation.videoUrl && (
          <section id="fairytale-video" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-24 px-4 sm:px-8 max-w-4xl mx-auto text-center">
            <FairytaleScrollReveal animation="fade-up">
              <p className={`text-[10px] uppercase tracking-[0.28em] ${theme.accentGold} font-medium ${serifClass}`}>
                SINEMA PREWEDDING
              </p>
              <h2 className={`${serifClass} text-3xl sm:text-4xl ${theme.textPrimary} uppercase tracking-wide mt-1`}>
                Our Love Story in Motion
              </h2>
              <FairytaleRoseDivider className="w-32 h-6 my-3 mx-auto" />
            </FairytaleScrollReveal>

            <FairytaleScrollReveal animation="fade-scale" delay={180}>
              <div className={`relative w-full aspect-[16/9] rounded-sm overflow-hidden shadow-xl border ${theme.borderSoft} mt-6`}>
                {extractYouTubeId(invitation.videoUrl) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(invitation.videoUrl)}`}
                    title="Fairytale Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video src={invitation.videoUrl} controls className="w-full h-full object-cover" />
                )}
              </div>
            </FairytaleScrollReveal>
          </section>
        )}

        {/* SECTION 7: RSVP & KEHADIRAN matching Frame 12 of media_1790835135905.jpg */}
        {vis.rsvp && (
          <section id="fairytale-rsvp" className={`relative scroll-mt-20 sm:scroll-mt-24 pt-14 sm:pt-20 pb-36 px-4 sm:px-8 ${theme.pageBg} border-t ${theme.borderSoft} overflow-hidden transition-colors duration-500`}>
            <div className="relative z-10 max-w-xl mx-auto">
              <FairytaleScrollReveal animation="fade-up" className="text-center mb-8">
                <p className={`text-[10px] uppercase tracking-[0.28em] ${theme.accentGold} font-medium ${serifClass}`}>
                  KONFIRMASI KEHADIRAN
                </p>
                <FairytaleRoseDivider className="w-32 h-5 my-2 mx-auto" />
                <p className={`text-xs ${theme.textSecondary} max-w-md mx-auto leading-relaxed`}>
                  Merupakan suatu kehormatan bagi kami atas kehadiran Bapak/Ibu/Saudara/i untuk merayakan hari bahagia ini.
                </p>
              </FairytaleScrollReveal>

              <FairytaleScrollReveal animation="fade-scale" delay={150}>
                {rsvpSubmitted ? (
                  <div className={`p-8 ${theme.cardBg} border ${theme.borderSoft} shadow-sm rounded-sm text-center`}>
                    <div className={`w-12 h-12 rounded-full ${theme.altSectionBg} border ${theme.borderSoft} flex items-center justify-center ${theme.accentGold} mx-auto mb-3`}>
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className={`${serifClass} text-2xl ${theme.textPrimary}`}>
                      Terima Kasih atas Konfirmasi Anda
                    </h3>
                    <p className={`text-xs ${theme.textSecondary} mt-2`}>
                      Respon kehadiran Anda telah tercatat dengan baik dalam sistem kami.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className={`p-6 sm:p-8 ${theme.cardBg} backdrop-blur-xs border ${theme.borderSoft} shadow-md rounded-sm space-y-4 sm:space-y-5 transition-colors duration-500`}>
                    <div>
                      <label className={`block text-[11px] uppercase tracking-wider ${theme.textSecondary} font-semibold mb-1`}>
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        placeholder="Bapak Budi Santoso"
                        className={`w-full px-4 py-2.5 text-xs ${theme.inputBg} border ${theme.borderSoft} rounded-xs focus:outline-none focus:border-[#C69C54] ${theme.textPrimary}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] uppercase tracking-wider ${theme.textSecondary} font-semibold mb-1`}>
                        Konfirmasi Kehadiran
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setRsvpStatus('ATTENDING')}
                          className={`py-2 px-3 text-xs rounded-xs border text-center font-medium transition-all cursor-pointer ${
                            rsvpStatus === 'ATTENDING'
                              ? theme.isDark ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-semibold shadow-xs' : 'bg-[#3C3028] text-white border-[#3C3028] shadow-xs'
                              : `${theme.altSectionBg} ${theme.borderSoft} ${theme.textSecondary} hover:opacity-90`
                          }`}
                        >
                          Hadir
                        </button>
                        <button
                          type="button"
                          onClick={() => setRsvpStatus('NOT_ATTENDING')}
                          className={`py-2 px-3 text-xs rounded-xs border text-center font-medium transition-all cursor-pointer ${
                            rsvpStatus === 'NOT_ATTENDING'
                              ? theme.isDark ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-semibold shadow-xs' : 'bg-[#3C3028] text-white border-[#3C3028] shadow-xs'
                              : `${theme.altSectionBg} ${theme.borderSoft} ${theme.textSecondary} hover:opacity-90`
                          }`}
                        >
                          Tidak Hadir
                        </button>
                        <button
                          type="button"
                          onClick={() => setRsvpStatus('TENTATIVE')}
                          className={`py-2 px-3 text-xs rounded-xs border text-center font-medium transition-all cursor-pointer ${
                            rsvpStatus === 'TENTATIVE'
                              ? theme.isDark ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-semibold shadow-xs' : 'bg-[#3C3028] text-white border-[#3C3028] shadow-xs'
                              : `${theme.altSectionBg} ${theme.borderSoft} ${theme.textSecondary} hover:opacity-90`
                          }`}
                        >
                          Masih Ragu
                        </button>
                      </div>
                    </div>

                    {rsvpStatus === 'ATTENDING' && (
                      <div>
                        <label className={`block text-[11px] uppercase tracking-wider ${theme.textSecondary} font-semibold mb-1`}>
                          Jumlah Tamu (Pax)
                        </label>
                        <select
                          value={rsvpPax}
                          onChange={(e) => setRsvpPax(Number(e.target.value))}
                          className={`w-full px-4 py-2.5 text-xs ${theme.inputBg} border ${theme.borderSoft} rounded-xs focus:outline-none focus:border-[#C69C54] ${theme.textPrimary}`}
                        >
                          <option value={1}>1 Orang</option>
                          <option value={2}>2 Orang</option>
                          <option value={3}>3 Orang</option>
                          <option value={4}>4 Orang</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className={`block text-[11px] uppercase tracking-wider ${theme.textSecondary} font-semibold mb-1`}>
                        Pesan atau Ucapan (Opsional)
                      </label>
                      <textarea
                        rows={3}
                        value={rsvpNotes}
                        onChange={(e) => setRsvpNotes(e.target.value)}
                        placeholder="Tulis pesan atau ucapan untuk kedua mempelai..."
                        className={`w-full px-4 py-2 text-xs ${theme.inputBg} border ${theme.borderSoft} rounded-xs focus:outline-none focus:border-[#C69C54] ${theme.textPrimary}`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={rsvpLoading}
                      className={`w-full py-3.5 ${theme.buttonPrimary} text-xs uppercase tracking-widest font-semibold rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer`}
                    >
                      {rsvpLoading ? (
                        <span>Mengirim Konfirmasi...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-white" />
                          <span>KIRIM KONFIRMASI</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </FairytaleScrollReveal>
            </div>
          </section>
        )}

        {/* SECTION 8: WISHES & DO'A (GUESTBOOK) */}
        {vis.wishes && (
          <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-3xl mx-auto">
            <FairytaleScrollReveal animation="fade-up" className="text-center mb-10">
              <p className={`text-[10px] uppercase tracking-[0.28em] ${theme.accentGold} font-medium ${serifClass}`}>
                DOA &amp; RESTU
              </p>
              <h2 className={`${serifClass} text-3xl sm:text-4xl ${theme.textPrimary} uppercase tracking-wide mt-1`}>
                Wishes &amp; Blessings
              </h2>
              <FairytaleRoseDivider className="w-32 h-6 my-3 mx-auto" />
            </FairytaleScrollReveal>

            {/* Submit Wish Box */}
            <FairytaleScrollReveal animation="fade-up" delay={120}>
              <form onSubmit={handleAddWish} className={`p-6 ${theme.cardBg} border ${theme.borderSoft} rounded-sm shadow-xs mb-8 space-y-4 transition-colors duration-500`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-[10px] uppercase tracking-wider ${theme.textSecondary} font-medium mb-1`}>
                      Nama Pengirim
                    </label>
                    <input
                      type="text"
                      required
                      value={newWishName}
                      onChange={(e) => setNewWishName(e.target.value)}
                      placeholder="Nama Anda"
                      className={`w-full px-3 py-2 text-xs ${theme.inputBg} border ${theme.borderSoft} rounded-xs focus:outline-none focus:border-[#C69C54] ${theme.textPrimary}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[10px] uppercase tracking-wider ${theme.textSecondary} font-medium mb-1`}>
                      Hubungan
                    </label>
                    <select
                      value={newWishRelation}
                      onChange={(e) => setNewWishRelation(e.target.value)}
                      className={`w-full px-3 py-2 text-xs ${theme.inputBg} border ${theme.borderSoft} rounded-xs focus:outline-none focus:border-[#C69C54] ${theme.textPrimary}`}
                    >
                      <option value="Keluarga">Keluarga</option>
                      <option value="Sahabat">Sahabat</option>
                      <option value="Rekan Kerja">Rekan Kerja</option>
                      <option value="Teman Kuliah/Sekolah">Teman Kuliah/Sekolah</option>
                      <option value="VIP">Tamu VIP</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={`block text-[10px] uppercase tracking-wider ${theme.textSecondary} font-medium mb-1`}>
                    Ucapan &amp; Doa
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newWishMessage}
                    onChange={(e) => setNewWishMessage(e.target.value)}
                    placeholder="Tuliskan doa dan harapan terbaik Anda..."
                    className={`w-full px-3 py-2 text-xs ${theme.inputBg} border ${theme.borderSoft} rounded-xs focus:outline-none focus:border-[#C69C54] ${theme.textPrimary}`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={wishSubmitting}
                  className={`px-6 py-2.5 ${theme.buttonPrimary} text-xs uppercase tracking-widest font-medium rounded-xs transition-all cursor-pointer`}
                >
                  Kirim Doa Restu
                </button>
              </form>
            </FairytaleScrollReveal>

            {/* List of Wishes */}
            <FairytaleScrollReveal animation="fade-up" delay={200}>
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                {localWishes.map((w, idx) => (
                  <div key={idx} className={`p-4 ${theme.cardBg} border ${theme.borderSoftAlpha} rounded-xs shadow-2xs transition-colors duration-500`}>
                    <div className="flex items-center justify-between">
                      <span className={`${serifClass} text-sm font-medium ${theme.textPrimary}`}>{w.name}</span>
                      <span className={`text-[10px] uppercase tracking-wider ${theme.accentGold} ${theme.badgeBg} px-2 py-0.5 rounded-full border ${theme.borderSoft}`}>
                        {w.rel}
                      </span>
                    </div>
                    <p className={`${quoteFontClass} text-xs ${theme.textSecondary} mt-2 leading-relaxed`}>&ldquo;{w.msg}&rdquo;</p>
                    <span className={`text-[9px] ${theme.textMuted} mt-2 block ${monoClass}`}>{w.time}</span>
                  </div>
                ))}
              </div>
            </FairytaleScrollReveal>
          </section>
        )}

        {/* SECTION 9: WEDDING GIFT (Tanda Kasih) */}
        {vis.gifts && gifts.length > 0 && (
          <section id="fairytale-gifts" className={`scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-24 px-4 sm:px-8 ${theme.altSectionBg} border-t ${theme.borderSoft} transition-colors duration-500`}>
            <div className="max-w-xl mx-auto text-center">
              <FairytaleScrollReveal animation="fade-up">
                <p className={`text-[10px] uppercase tracking-[0.28em] ${theme.accentGold} font-medium ${serifClass}`}>
                  TANDA KASIH
                </p>
                <h2 className={`${serifClass} text-3xl sm:text-4xl ${theme.textPrimary} uppercase tracking-wide mt-1`}>
                  Wedding Gift
                </h2>
                <FairytaleRoseDivider className="w-32 h-6 my-3 mx-auto" />
                <p className={`text-xs ${theme.textSecondary} max-w-md mx-auto mb-8`}>
                  Doa restu Anda merupakan hadiah terindah bagi kami. Namun jika Anda bermaksud memberikan tanda kasih, dapat melalui rekening di bawah ini:
                </p>
              </FairytaleScrollReveal>

              <div className="space-y-4">
                {gifts.map((acc, idx) => (
                  <FairytaleScrollReveal key={acc.id || idx} animation="fade-scale" delay={idx * 120}>
                    <div
                      className={`p-6 ${theme.cardBg} border ${theme.borderSoft} shadow-sm rounded-sm text-center transition-colors duration-500`}
                    >
                      <div className={`w-8 h-8 rounded-full ${theme.altSectionBg} border ${theme.borderSoft} flex items-center justify-center ${theme.accentGold} mx-auto mb-2`}>
                        <Gift className="w-4 h-4" />
                      </div>
                      <p className={`text-xs uppercase tracking-widest ${theme.textSecondary} font-medium`}>
                        {acc.providerName}
                      </p>
                      <p className={`${monoClass} text-lg font-semibold ${theme.textPrimary} tracking-wider my-1`}>
                        {acc.accountNumber}
                      </p>
                      <p className={`text-xs ${theme.textSecondary}`}>a.n. {acc.accountHolder}</p>
                      <button
                        type="button"
                        onClick={() => handleCopyAccount(acc.accountNumber, acc.id || String(idx))}
                        className={`mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xs text-xs ${theme.altSectionBg} hover:opacity-80 ${theme.textPrimary} border ${theme.borderSoft} transition-all cursor-pointer`}
                      >
                        {copiedId === (acc.id || String(idx)) ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span>Nomor Rekening Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className={`w-3.5 h-3.5 ${theme.accentGold}`} />
                            <span>Salin Nomor Rekening</span>
                          </>
                        )}
                      </button>
                    </div>
                  </FairytaleScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CLOSING SECTION: THANK YOU & SIGNATURE */}
        <section className={`py-20 sm:py-28 pb-36 px-6 text-center ${theme.pageBg} border-t ${theme.borderSoft} relative overflow-hidden transition-colors duration-500`}>
          <div className="max-w-xl mx-auto relative z-10">
            <FairytaleScrollReveal animation="fade-up">
              <p className={`${quoteFontClass} text-lg sm:text-xl ${theme.textSecondary} leading-relaxed`}>
                &ldquo;{invitation.thankYouMessage || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi lembaran baru perjalanan cinta kami.'}&rdquo;
              </p>
              <p className={`text-xs uppercase tracking-ultra ${theme.accentGold} font-medium mt-6`}>
                KAMI YANG BERBAHAGIA
              </p>
              <h2 className={`${serifClass} text-4xl sm:text-5xl ${theme.textPrimary} font-normal tracking-wide mt-2`}>
                {couple.groomNickname} <span className={`italic font-light ${theme.accentGold}`}>&amp;</span> {couple.brideNickname}
              </h2>
              <p className={`text-[10px] uppercase tracking-widest ${theme.textMuted} mt-2`}>
                Beserta Keluarga Besar Kedua Mempelai
              </p>
            </FairytaleScrollReveal>

            {/* PLATFORM BRANDING FOOTER */}
            <FairytaleScrollReveal animation="fade-up" delay={180}>
              <div className={`mt-12 pt-8 border-t ${theme.borderSoft} w-full max-w-xs mx-auto flex flex-col items-center justify-center text-center`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-4 h-[1px] ${theme.isDark ? 'bg-[#E2C285]/50' : 'bg-[#C69C54]/50'}`} />
                  <span className={`${serifClass} tracking-[0.3em] text-[11px] uppercase font-bold ${theme.textPrimary}`}>
                    KERTAS.KATA
                  </span>
                  <div className={`w-4 h-[1px] ${theme.isDark ? 'bg-[#E2C285]/50' : 'bg-[#C69C54]/50'}`} />
                </div>
                <p className={`text-[8.5px] uppercase tracking-[0.24em] ${theme.accentGold} font-medium mb-3`}>
                  EDITORIAL DIGITAL WEDDING INVITATIONS
                </p>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xs border ${theme.borderSoft} ${theme.cardBg} hover:opacity-90 ${theme.textPrimary} text-[9.5px] uppercase tracking-widest font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer`}
                >
                  <span>Buat Undangan Digital Anda</span>
                  <ExternalLink className={`w-3 h-3 ${theme.accentGold}`} />
                </a>
              </div>
            </FairytaleScrollReveal>
          </div>
        </section>

        {/* SINGLE PERSISTENT FLOATING AUDIO TOGGLE (Only one active toggle across the entire template) */}
        {isOpen && animationPhase === 'explore' && (
          <AudioFloatingToggle
            audioUrl={invitation.musicUrl || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3'}
            isUnlocked={isOpen}
            position="bottom-right"
            isDark={true}
            forceMobile={forceMobile}
            className="!w-11 !h-11 !border-[#C69C54]/70 !bg-[#2E241A]/95 hover:!bg-[#3D3023] !text-[#E2C285] shadow-2xl backdrop-blur-md"
          />
        )}
      </main>
    </div>
  );
}
