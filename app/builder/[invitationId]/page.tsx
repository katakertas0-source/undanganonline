'use client';

import React, { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useRouter, useParams } from 'next/navigation';
import {
  getInvitationById,
  getInvitationByIdAsync,
  saveInvitation,
  getAllTemplates,
  getAllAddons,
  getPackageById,
  calculateOrderPricing,
  createOrderForInvitation,
} from '@/lib/store';
import { Invitation, EventDetail, GalleryItem, LoveStoryItem, GiftAccount } from '@/types';
import { InvitationEngine } from '@/components/engine/InvitationEngine';
import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { FinalBillingModal } from '@/components/builder/FinalBillingModal';
import {
  Smartphone,
  Monitor,
  Check,
  Eye,
  ArrowRight,
  Plus,
  Trash2,
  Settings,
  Heart,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  Gift,
  Layers,
  Type,
  Lock,
  Upload,
  Video,
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MapPin,
  ExternalLink,
  Crop,
  Tag,
} from 'lucide-react';
import { compressImageFile, compressImageWithDetails } from '@/lib/image-compressor';
import { ImageCropperModal } from '@/components/builder/ImageCropperModal';
import { uploadDataUrlToSupabase, uploadAssetToSupabase } from '@/lib/supabase/storage';

const AUDIO_PRESETS = [
  {
    name: 'Romantic Piano Melodies',
    genre: 'Akustik Piano Romantis',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3',
  },
  {
    name: 'Acoustic Wedding Love',
    genre: 'Gitar Akustik Hangat',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=acoustic-guitars-ambient-10850.mp3',
  },
  {
    name: 'Cinematic String Romance',
    genre: 'Orkestra & Biola Sinematik',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=wedding-piano-strings-124017.mp3',
  },
  {
    name: 'Sweet Garden Serenade',
    genre: 'Harmoni Lembut & Intim',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630d7049.mp3?filename=sweet-love-112198.mp3',
  },
];

function YouTubeIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function BuilderPage() {
  const routeParams = useParams();
  const invitationId = (routeParams?.invitationId as string) || '';
  const router = useRouter();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [activeTab, setActiveTab] = useState<
    'design' | 'couple' | 'events' | 'sections' | 'gallery' | 'story' | 'gifts' | 'addons'
  >('design');
  const [previewSection, setPreviewSection] = useState<'cover' | 'inside'>('cover');
  const [addonScrollTarget, setAddonScrollTarget] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const tabTitles: Record<string, { label: string; icon: string }> = {
    design: { label: 'Desain & Tema', icon: '🎨' },
    couple: { label: 'Data Mempelai', icon: '💑' },
    events: { label: 'Rangkaian Acara', icon: '📅' },
    gallery: { label: 'Galeri Foto', icon: '🖼️' },
    story: { label: 'Cerita Cinta', icon: '📖' },
    gifts: { label: 'Amplop Digital & Kado', icon: '🎁' },
    sections: { label: 'Atur Section', icon: '📑' },
    addons: { label: 'Add-ons & Paket', icon: '✨' },
  };
  const [cropModalState, setCropModalState] = useState<{
    isOpen: boolean;
    imageUrl: string;
    target: 'cover' | 'groom' | 'bride' | 'gallery';
    galleryIdx?: number;
    ratio: '4:5' | '1:1' | '16:9';
    title?: string;
  } | null>(null);

  const handleTabChange = (tab: 'design' | 'couple' | 'events' | 'sections' | 'gallery' | 'story' | 'gifts' | 'addons') => {
    setActiveTab(tab);
    setAddonScrollTarget(null);
    if (tab === 'design') {
      setPreviewSection('cover');
    } else {
      setPreviewSection('inside');
    }
  };

  const [sidebarAudioPlaying, setSidebarAudioPlaying] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const sidebarAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopSidebarMusic = () => {
    if (sidebarAudioRef.current) {
      sidebarAudioRef.current.pause();
      sidebarAudioRef.current = null;
    }
    setSidebarAudioPlaying(false);
  };

  const handleAudioUpload = async (file: File) => {
    if (!invitation) return;
    if (file.size > 25 * 1024 * 1024) {
      alert('Ukuran file musik maksimal 25MB agar pemutaran lancar.');
      return;
    }
    setIsUploadingAudio(true);
    stopSidebarMusic();
    try {
      const res = await uploadAssetToSupabase(file, 'audio');
      if (res?.publicUrl) {
        updateInvitationState({
          ...invitation,
          musicUrl: res.publicUrl,
          musicTitle: file.name.replace(/\.[^/.]+$/, ''),
        });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          updateInvitationState({
            ...invitation,
            musicUrl: base64,
            musicTitle: file.name.replace(/\.[^/.]+$/, ''),
          });
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Audio upload error:', err);
      alert('Gagal mengunggah file musik.');
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const toggleSidebarMusicPreview = () => {
    if (!invitation?.musicUrl) return;

    if (sidebarAudioPlaying) {
      stopSidebarMusic();
    } else {
      stopSidebarMusic();
      try {
        const audio = new Audio(invitation.musicUrl);
        audio.onended = () => setSidebarAudioPlaying(false);
        audio.onerror = () => setSidebarAudioPlaying(false);
        sidebarAudioRef.current = audio;
        audio.play().then(() => {
          setSidebarAudioPlaying(true);
        }).catch((err) => {
          console.warn('Audio playback error:', err);
          setSidebarAudioPlaying(false);
        });
      } catch (err) {
        console.warn('Audio initialization error:', err);
        setSidebarAudioPlaying(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (sidebarAudioRef.current) {
        sidebarAudioRef.current.pause();
        sidebarAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let active = true;

    // 1. Immediate sync check
    const syncInv = getInvitationById(invitationId);
    if (syncInv && active) {
      setInvitation(JSON.parse(JSON.stringify(syncInv)));
    }

    // 2. Async check (for IndexedDB hydration)
    getInvitationByIdAsync(invitationId).then((asyncInv) => {
      if (asyncInv && active) {
        setInvitation(JSON.parse(JSON.stringify(asyncInv)));
      }
    });

    // 3. Listen to store updates
    const handleStoreUpdate = () => {
      const updatedInv = getInvitationById(invitationId);
      if (updatedInv && active) {
        setInvitation(JSON.parse(JSON.stringify(updatedInv)));
      }
    };

    window.addEventListener('uo_store_updated', handleStoreUpdate);
    return () => {
      active = false;
      window.removeEventListener('uo_store_updated', handleStoreUpdate);
    };
  }, [invitationId]);

  if (!invitation) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-3">
        <div className="w-7 h-7 border-2 border-[#8C6D3B]/30 border-t-[#8C6D3B] rounded-full animate-spin" />
        <p className="font-serif text-xs uppercase tracking-widest text-[#7C756E]">
          Menyiapkan Studio Builder...
        </p>
      </div>
    );
  }

  const templates = getAllTemplates();
  const addons = getAllAddons();
  const currentTemplate = templates.find((t) => t.id === invitation.templateId) || templates[0];
  const isBaliHeritage = currentTemplate.id === 'bali-heritage' || currentTemplate.archetype === 'balinese-heritage-luxury';
  const isMahadewi = currentTemplate.id === 'mahadewi-bali' || currentTemplate.archetype === 'balinese-heritage';

  const updateInvitationState = (updated: Invitation) => {
    setInvitation(updated);
    setSaveStatus('saving');
    saveInvitation(updated);
    setTimeout(() => setSaveStatus('saved'), 400);
  };

  const handleCropSave = (croppedDataUrl: string, appliedRatio: '4:5' | '1:1' | '16:9') => {
    if (!cropModalState || !invitation) return;

    if (cropModalState.target === 'cover') {
      updateInvitationState({
        ...invitation,
        coverImageUrl: croppedDataUrl,
      });
      uploadDataUrlToSupabase(croppedDataUrl, 'covers').then((publicUrl) => {
        if (publicUrl) {
          updateInvitationState({
            ...invitation,
            coverImageUrl: publicUrl,
          });
        }
      });
    } else if (cropModalState.target === 'groom') {
      updateInvitationState({
        ...invitation,
        couple: {
          ...invitation.couple,
          groomPhotoUrl: croppedDataUrl,
        },
      });
      uploadDataUrlToSupabase(croppedDataUrl, 'couples').then((publicUrl) => {
        if (publicUrl) {
          updateInvitationState({
            ...invitation,
            couple: {
              ...invitation.couple,
              groomPhotoUrl: publicUrl,
            },
          });
        }
      });
    } else if (cropModalState.target === 'bride') {
      updateInvitationState({
        ...invitation,
        couple: {
          ...invitation.couple,
          bridePhotoUrl: croppedDataUrl,
        },
      });
      uploadDataUrlToSupabase(croppedDataUrl, 'couples').then((publicUrl) => {
        if (publicUrl) {
          updateInvitationState({
            ...invitation,
            couple: {
              ...invitation.couple,
              bridePhotoUrl: publicUrl,
            },
          });
        }
      });
    } else if (cropModalState.target === 'gallery' && cropModalState.galleryIdx !== undefined) {
      const updatedGallery = [...invitation.gallery];
      const gIdx = cropModalState.galleryIdx;
      if (updatedGallery[gIdx]) {
        updatedGallery[gIdx] = {
          ...updatedGallery[gIdx],
          imageUrl: croppedDataUrl,
          aspectRatio: appliedRatio,
        };
        updateInvitationState({
          ...invitation,
          gallery: updatedGallery,
        });

        uploadDataUrlToSupabase(croppedDataUrl, 'gallery').then((publicUrl) => {
          if (publicUrl && updatedGallery[gIdx]) {
            updatedGallery[gIdx] = {
              ...updatedGallery[gIdx],
              imageUrl: publicUrl,
            };
            updateInvitationState({
              ...invitation,
              gallery: updatedGallery,
            });
          }
        });
      }
    }

    setCropModalState(null);
  };

  // Pricing calculation based on package and selected add-ons
  const {
    pkg,
    basePrice,
    selectedPaidAddons,
    addonsTotal,
    totalAmount,
    isIncludedAddon,
    isLockedAddon,
    isAvailableAddon,
  } = calculateOrderPricing(invitation.packageId, invitation.templateId, invitation.activeAddonIds);

  // Check if guest personalization is unlocked (included in Premium or added as Add-on)
  const hasGuestPersonalization =
    invitation.packageId === 'pkg-premium' ||
    invitation.activeAddonIds.includes('custom-guest-name');

  const handleUpgradeToPremium = () => {
    const updated: Invitation = {
      ...invitation,
      packageId: 'pkg-premium',
      activeAddonIds: Array.from(
        new Set([
          ...invitation.activeAddonIds,
          'premium-animation',
          'love-story',
          'rsvp-system',
          'extra-gallery',
        ])
      ),
    };
    updateInvitationState(updated);
  };

  const handlePublishClick = () => {
    setIsBillingModalOpen(true);
  };

  const handleConfirmPublishAndPay = () => {
    setIsCreatingOrder(true);
    try {
      const order = createOrderForInvitation(invitation.id);
      router.push(`/checkout/${order.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="h-screen max-h-screen flex flex-col bg-[#F8F7F3] text-[#111111] overflow-hidden">
      {/* Top Builder Navigation Bar */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 bg-white border-b border-neutral-200 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden min-w-0">
          <Link href="/" className="flex items-center gap-2 font-serif tracking-wider sm:tracking-widest text-xs sm:text-base uppercase font-semibold shrink-0 group hover:opacity-85 transition-opacity">
            <div className="relative w-6 h-6 sm:w-7 sm:h-7 shrink-0">
              <Image
                src="/images/logo-icon.png"
                alt="Kertas.Kata"
                width={28}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="sm:hidden font-serif">K.K</span>
            <span className="hidden sm:inline font-serif tracking-widest">KERTAS.KATA</span>
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-[11px] sm:text-xs uppercase tracking-wider text-neutral-500 font-medium truncate max-w-[100px] xs:max-w-[140px] sm:max-w-xs">
            {invitation.title}
          </span>
          <span className="hidden md:inline-block text-[9px] uppercase tracking-widest px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-neutral-700 font-semibold rounded">
            PAKET {pkg.name.toUpperCase()}
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest px-1.5 sm:px-2 py-0.5 border border-neutral-200 text-neutral-400 rounded shrink-0">
            {saveStatus === 'saved' ? '✓' : '...'}
            <span className="hidden sm:inline"> {saveStatus === 'saved' ? 'Tersimpan' : 'Menyimpan...'}</span>
          </span>
        </div>

        {/* Right Action Bar with Live Pricing and Publish Button */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[9px] uppercase tracking-widest text-neutral-400">ESTIMASI TOTAL</span>
            <span className="font-serif text-base sm:text-lg leading-tight font-medium">
              Rp {totalAmount.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={handlePublishClick}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-[10px] sm:text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors font-medium shadow-sm"
          >
            <span>PUBLISH</span>
            <span className="hidden sm:inline">/ ONLINEKAN</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Split Body: Left Controls, Right Preview */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* Backdrop for Mobile Bottom Sheet */}
        {mobileSheetOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
            onClick={() => setMobileSheetOpen(false)}
          />
        )}

        {/* Left Column / Mobile Bottom Sheet Drawer */}
        <div
          className={`fixed inset-x-0 bottom-0 h-[85vh] max-h-[85dvh] bg-white rounded-t-3xl shadow-[0_-12px_45px_rgba(0,0,0,0.25)] z-50 flex flex-col overflow-hidden border-t border-neutral-200 transition-transform duration-300 ease-out lg:static lg:h-full lg:max-h-full lg:rounded-none lg:shadow-none lg:border-t-0 lg:border-r lg:w-[540px] xl:w-[580px] lg:flex lg:z-auto ${
            mobileSheetOpen
              ? 'translate-y-0'
              : 'translate-y-full lg:translate-y-0 pointer-events-none lg:pointer-events-auto'
          }`}
        >
          {/* Mobile Sheet Top Bar (Only visible on mobile) */}
          <div className="lg:hidden shrink-0 border-b border-neutral-100 bg-neutral-50/90 backdrop-blur-xs px-4 pt-2.5 pb-2.5 flex items-center justify-between relative">
            {/* Drag Handle Indicator */}
            <div className="absolute top-1.5 inset-x-0 flex justify-center pointer-events-none">
              <span className="w-10 h-1 bg-neutral-300 rounded-full" />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-base">{tabTitles[activeTab]?.icon || '⚙️'}</span>
              <div>
                <h4 className="font-serif text-sm font-semibold text-neutral-900 leading-tight">
                  {tabTitles[activeTab]?.label || 'Pengaturan Undangan'}
                </h4>
                <p className="text-[10px] text-neutral-400">
                  Perubahan langsung terlihat di preview
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileSheetOpen(false)}
              className="px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider bg-black text-white rounded-full shadow-xs hover:bg-neutral-800 transition-colors"
            >
              ✓ Selesai
            </button>
          </div>

          {/* Sub-tabs navigation */}
          <div className="flex border-b border-neutral-200 overflow-x-auto text-[11px] uppercase tracking-wider shrink-0 bg-neutral-50 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x">
            <button
              onClick={() => handleTabChange('design')}
              className={`px-4 py-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'design'
                  ? 'border-black text-black font-semibold bg-white'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Desain</span>
            </button>

            <button
              onClick={() => handleTabChange('couple')}
              className={`px-4 py-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'couple'
                  ? 'border-black text-black font-semibold bg-white'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Mempelai</span>
            </button>

            <button
              onClick={() => handleTabChange('events')}
              className={`px-4 py-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'events'
                  ? 'border-black text-black font-semibold bg-white'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Acara</span>
            </button>

            <button
              onClick={() => handleTabChange('sections')}
              className={`px-4 py-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'sections'
                  ? 'border-black text-black font-semibold bg-white'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Section</span>
            </button>

            <button
              onClick={() => handleTabChange('gallery')}
              className={`px-4 py-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'gallery'
                  ? 'border-black text-black font-semibold bg-white'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Galeri</span>
            </button>

            <button
              onClick={() => handleTabChange('story')}
              className={`px-4 py-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'story'
                  ? 'border-black text-black font-semibold bg-white'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cerita</span>
            </button>

            <button
              onClick={() => handleTabChange('gifts')}
              className={`px-4 py-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'gifts'
                  ? 'border-black text-black font-semibold bg-white'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Amplop</span>
            </button>

            <button
              onClick={() => handleTabChange('addons')}
              className={`px-4 py-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'addons'
                  ? 'border-black text-black font-semibold bg-white'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-neutral-700" />
              <span>Add-ons</span>
            </button>
          </div>

          {/* Form Content Body */}
          <div className="p-6 pb-32 space-y-8 flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y">
            {/* 1. Tab: Design & Presets */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
                    Ganti Template
                  </label>
                  <select
                    value={invitation.templateId}
                    onChange={(e) => {
                      const newTmpl = templates.find((t) => t.id === e.target.value);
                      if (!newTmpl) return;
                      const targetPkgId = newTmpl.basePrice === 199000 ? 'pkg-premium' : 'pkg-essential';
                      const isCinema = newTmpl?.archetype === 'dark-luxury-cinema' || newTmpl?.archetype === 'romantic-cinema';
                      const isMotion = newTmpl?.archetype === 'cinematic-motion';
                      const isMahadewi = newTmpl.id === 'mahadewi-bali';
                      const isBaliHeritage = newTmpl.id === 'bali-heritage';

                      // Synchronize addons with package tier
                      const updatedAddons = targetPkgId === 'pkg-premium'
                        ? Array.from(new Set([...invitation.activeAddonIds, 'premium-animation', 'love-story', 'rsvp-system', 'extra-gallery']))
                        : ['music-backsound'];

                      setPreviewSection('cover');

                      updateInvitationState({
                        ...invitation,
                        packageId: targetPkgId,
                        templateId: e.target.value,
                        activeAddonIds: updatedAddons,
                        coverImageUrl: newTmpl.coverImageUrl,
                        coverTitle: isBaliHeritage ? 'PAWIWAHAN' : isMahadewi ? 'PAWIWAHAN AGUNG · BALINESE HERITAGE' : invitation.coverTitle,
                        colorPreset: newTmpl?.theme.isDark ? 'nocturne-black' : (isMahadewi ? 'warm-linen' : 'offwhite-noir'),
                        layoutPreset: isBaliHeritage || isMahadewi ? 'framed-portrait' : invitation.layoutPreset,
                        openingQuote: isBaliHeritage && (!invitation.openingQuote || invitation.openingQuote.includes('celebration of love'))
                          ? 'Kami dipertemukan oleh waktu, dipersatukan oleh cinta, dan akan melangkah bersama dalam ikatan suci Pawiwahan.'
                          : isMahadewi && (!invitation.openingQuote || invitation.openingQuote.includes('celebration of love'))
                          ? 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa, kami bermaksud menyelenggarakan Upacara Manusa Yadnya Pawiwahan putra-putri kami.'
                          : invitation.openingQuote,
                        holyVerse: isBaliHeritage && (!invitation.holyVerse || invitation.holyVerse.includes('Two lives'))
                          ? 'Dua Hati, Satu Perjalanan, Dalam Restu Semesta.'
                          : isMahadewi && (!invitation.holyVerse || invitation.holyVerse.includes('Two lives'))
                          ? 'Ihaiva stam ma vi yaustam visvam ayur vyasnutam kridantau putrair naptrbhih modamanau sve grhe. (Rg Veda X.85.42) — Wahai pasangan pengantin, semoga senantiasa bersatu dalam cinta kasih dan damai abadi.'
                          : invitation.holyVerse,
                        couple: isBaliHeritage && (invitation.couple.groomPhotoUrl.includes('unsplash') || invitation.couple.groomName === 'Julian Pratama')
                          ? {
                              ...invitation.couple,
                              groomName: 'I Putu Wira Yasa, S.T.',
                              groomNickname: 'Putu',
                              groomPhotoUrl: '/images/bali-heritage-cover.jpg',
                              brideName: 'Ni Kadek Sinta Dewi, B.Des',
                              brideNickname: 'Sinta',
                              bridePhotoUrl: '/images/bali-heritage-secondary.jpg',
                            }
                          : isMahadewi && (invitation.couple.groomPhotoUrl.includes('unsplash') || invitation.couple.groomName === 'Julian Pratama')
                          ? {
                              ...invitation.couple,
                              groomPhotoUrl: '/images/rama-portrait.jpg',
                              bridePhotoUrl: '/images/gayatri-portrait.jpg',
                            }
                          : invitation.couple,
                        videoUrl: isCinema ? (invitation.videoUrl || 'https://www.youtube.com/watch?v=ScMzIvxBSi4') : invitation.videoUrl,
                        coverVideoUrl: isMotion ? (invitation.coverVideoUrl || '/videos/elodie-bg.mp4') : invitation.coverVideoUrl,
                        sectionVisibility: {
                          ...invitation.sectionVisibility,
                          video: isCinema ? true : (targetPkgId === 'pkg-essential' ? false : invitation.sectionVisibility.video),
                          story: targetPkgId === 'pkg-premium',
                          rsvp: targetPkgId === 'pkg-premium',
                        },
                      });
                    }}
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 outline-none bg-white font-medium"
                  >
                    {templates.map((t) => {
                      const isPremium = t.basePrice === 199000;
                      return (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.category}) — {isPremium ? 'Paket Premium (Rp 199.000)' : 'Paket Essential (Rp 99.000)'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#8C827A] mb-2 font-medium">
                    Font Preset
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['editorial-cormorant', 'modern-serif', 'clean-sans'] as const).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => updateInvitationState({ ...invitation, fontPreset: preset })}
                        className={`p-3 text-[11px] uppercase tracking-wider border text-center transition-all ${
                          invitation.fontPreset === preset
                            ? 'bg-[#2A2522] text-[#FAF8F5] border-[#2A2522] font-medium shadow-xs'
                            : 'border-[#E2DDD5] bg-white text-[#5C554E] hover:border-[#A8A196]'
                        }`}
                      >
                        {preset.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#8C827A] mb-2 font-medium">
                    Warna &amp; Tema
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['offwhite-noir', 'warm-linen', 'nocturne-black'] as const).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => updateInvitationState({ ...invitation, colorPreset: color })}
                        className={`p-3 text-[11px] uppercase tracking-wider border text-center transition-all ${
                          invitation.colorPreset === color
                            ? 'bg-[#2A2522] text-[#FAF8F5] border-[#2A2522] font-medium shadow-xs'
                            : 'border-[#E2DDD5] bg-white text-[#5C554E] hover:border-[#A8A196]'
                        }`}
                      >
                        {color.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Cover Header Text (The Wedding Celebration / Walimatul 'Urs / etc) */}
                <div className="space-y-2.5 p-3.5 bg-[#FAF7F2] border border-[#E2DDD5]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider text-[#2A2522] font-semibold flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-[#8C6D3B]" />
                      <span>Teks Header Cover (Di Atas Nama)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        updateInvitationState({
                          ...invitation,
                          coverTitle: isBaliHeritage
                            ? 'PAWIWAHAN'
                            : isMahadewi
                            ? 'PAWIWAHAN AGUNG · BALINESE HERITAGE'
                            : 'THE WEDDING CELEBRATION',
                        })
                      }
                      className="text-[10px] text-[#8C6D3B] hover:text-[#2A2522] underline underline-offset-2 cursor-pointer"
                    >
                      Reset Default
                    </button>
                  </div>
                  <input
                    type="text"
                    value={invitation.coverTitle ?? (isBaliHeritage ? 'PAWIWAHAN' : 'THE WEDDING CELEBRATION')}
                    onChange={(e) => updateInvitationState({ ...invitation, coverTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCD6CC] text-[#2A2522] uppercase tracking-wider outline-none focus:border-[#8C6D3B] font-medium"
                    placeholder="Contoh: THE WEDDING CELEBRATION, WALIMATUL 'URS, dll."
                  />
                  {/* Quick Suggestions */}
                  <div className="space-y-1 pt-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-[#8C827A] block">
                      Pilihan Cepat:
                    </span>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {[
                        ...(isBaliHeritage || isMahadewi ? ['PAWIWAHAN', 'PAWIWAHAN AGUNG'] : []),
                        'THE WEDDING CELEBRATION',
                        'THE WEDDING OF',
                        'WALIMATUL \'URS',
                        'SAVE THE DATE',
                        'PERAYAAN PERNIKAHAN',
                        'THE SACRED UNION',
                      ].map((t) => {
                        const isCurrent = (invitation.coverTitle || (isBaliHeritage ? 'PAWIWAHAN' : 'THE WEDDING CELEBRATION')) === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => updateInvitationState({ ...invitation, coverTitle: t })}
                            className={`px-2.5 py-1 text-[10px] border whitespace-nowrap transition-colors rounded-sm cursor-pointer ${
                              isCurrent
                                ? 'bg-[#2A2522] text-white border-[#2A2522] font-semibold'
                                : 'bg-white border-[#DDD5C7] text-[#5C554E] hover:border-[#A8A196]'
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Cover Photo: Direct File Upload & Visual Studio Presets (No URL input!) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs uppercase tracking-widest text-[#8C827A] font-medium">
                      Foto Cover Utama
                    </label>
                    <span className="text-[10px] text-[#8C827A]">JPG, PNG, WebP</span>
                  </div>

                  <div className="flex items-center gap-3.5 p-3.5 bg-[#FAF7F2] border border-[#E2DDD5]">
                    {/* Visual Thumbnail */}
                    <div className="w-16 h-20 bg-neutral-200 border border-[#DDD5C7] overflow-hidden shrink-0 relative shadow-xs">
                      {invitation.coverImageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={invitation.coverImageUrl}
                          alt="Cover Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Upload Actions */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#2A2522] text-[#FAF8F5] hover:bg-[#3D3834] transition-colors shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto dari Galeri</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const compressed = await compressImageFile(file);
                                if (compressed) {
                                  updateInvitationState({ ...invitation, coverImageUrl: compressed });
                                }
                              }
                            }}
                          />
                        </label>

                        {invitation.coverImageUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              setCropModalState({
                                isOpen: true,
                                imageUrl: invitation.coverImageUrl,
                                target: 'cover',
                                ratio: '4:5',
                                title: 'Crop & Atur Safe Angle Foto Cover',
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white text-[#2A2522] border border-[#DDD5C7] hover:border-[#8C6D3B] hover:text-[#8C6D3B] transition-colors shadow-xs"
                            title="Atur framing, zoom, dan posisi aman foto cover"
                          >
                            <Crop className="w-3.5 h-3.5 text-[#8C6D3B]" />
                            <span>Crop / Atur Angle</span>
                          </button>
                        )}

                        {invitation.coverImageUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              updateInvitationState({
                                ...invitation,
                                coverImageUrl:
                                  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
                              })
                            }
                            className="px-2.5 py-2 text-[11px] text-[#7C756E] hover:text-[#2A2522] border border-[#DDD5C7] bg-white hover:border-[#A8A196] transition-colors"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                      <p className="text-[10px] text-[#8C827A] leading-relaxed font-light">
                        Pilih foto mempelai dari smartphone atau laptop Anda untuk langsung ditampilkan di cover undangan.
                      </p>
                    </div>
                  </div>

                  {/* Curated Preset Sample Photos (Collapsible to keep mobile view clean) */}
                  <details className="group pt-1">
                    <summary className="text-[10px] uppercase tracking-wider text-[#8C827A] font-medium cursor-pointer flex items-center justify-between hover:text-black py-1 select-none">
                      <span>Atau Pilih Contoh Foto Studio Bawaan</span>
                      <span className="text-[9px] text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {[
                        {
                          label: 'Beach Romance',
                          url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
                        },
                        {
                          label: 'Fine Art Studio',
                          url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
                        },
                        {
                          label: 'Outdoor Sunset',
                          url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
                        },
                        {
                          label: 'Classic Black Tie',
                          url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop',
                        },
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => updateInvitationState({ ...invitation, coverImageUrl: preset.url })}
                          className={`relative aspect-[3/4] overflow-hidden border transition-all ${
                            invitation.coverImageUrl === preset.url
                              ? 'border-[#2A2522] ring-2 ring-[#2A2522]/30'
                              : 'border-[#E2DDD5] opacity-75 hover:opacity-100 hover:border-[#A8A196]'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] py-0.5 px-1 truncate text-center font-medium">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </details>
                </div>

                {/* Living Video Background: Controls (if active or cinematic-motion) OR Activation Card (if inactive) */}
                {(() => {
                  const hasVideoBg = currentTemplate.archetype === 'cinematic-motion' || invitation.activeAddonIds.includes('living-video-bg') || Boolean(invitation.coverVideoUrl);
                  
                  if (hasVideoBg) {
                    return (
                      <div className="p-5 bg-[#FAF7F2] border border-[#E2DDD5] space-y-5 rounded-none shadow-xs">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-[#EAE4DB]">
                          <div className="flex items-center gap-2">
                            <label className="text-xs uppercase tracking-wider text-[#2A2522] font-semibold flex items-center gap-2">
                              <span>Living Video Background</span>
                            </label>
                            {currentTemplate.archetype !== 'cinematic-motion' && (
                              <span className="text-[9px] uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 font-semibold">
                                Add-on Aktif (+Rp 45.000)
                              </span>
                            )}
                          </div>
                          {currentTemplate.archetype !== 'cinematic-motion' ? (
                            <button
                              type="button"
                              onClick={() => {
                                const updatedAddons = invitation.activeAddonIds.filter((id) => id !== 'living-video-bg');
                                updateInvitationState({
                                  ...invitation,
                                  activeAddonIds: updatedAddons,
                                  coverVideoUrl: undefined,
                                });
                              }}
                              className="text-[10px] text-red-600 hover:text-red-700 underline underline-offset-2 transition-colors cursor-pointer"
                            >
                              Nonaktifkan Add-on
                            </button>
                          ) : (
                            <span className="text-[9px] uppercase tracking-widest text-[#8C6D3B] bg-[#F2ECE1] border border-[#DDD4C7] px-2 py-0.5 font-medium">
                              Bawaan Template
                            </span>
                          )}
                        </div>

                    {/* Video URL */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#7C756E] uppercase tracking-wider text-[10px] font-medium flex items-center gap-1.5">
                          <YouTubeIcon className="w-3.5 h-3.5 text-red-600" />
                          <span>Link Video (YouTube atau File MP4)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => updateInvitationState({ ...invitation, coverVideoUrl: '/videos/elodie-bg.mp4' })}
                          className="text-[#8C6D3B] hover:text-[#2A2522] underline underline-offset-2 text-[10px] transition-colors"
                        >
                          Reset ke Default Video
                        </button>
                      </div>
                      <input
                        type="text"
                        value={invitation.coverVideoUrl || ''}
                        onChange={(e) => updateInvitationState({ ...invitation, coverVideoUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DCD6CC] text-[#2A2522] outline-none focus:border-[#8C6D3B] font-mono"
                        placeholder="Paste link YouTube (youtube.com/watch?v=... / youtu.be/...) atau URL .mp4"
                      />

                      {/* Quick Video Presets */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[9px] uppercase tracking-wider text-[#8C827A] w-full block">
                          Pilihan Cepat:
                        </span>
                        <button
                          type="button"
                          onClick={() => updateInvitationState({ ...invitation, coverVideoUrl: '/videos/elodie-bg.mp4' })}
                          className={`px-2 py-1 text-[10px] border transition-colors ${
                            invitation.coverVideoUrl === '/videos/elodie-bg.mp4'
                              ? 'bg-[#2A2522] text-white border-[#2A2522]'
                              : 'bg-white border-[#DDD5C7] text-[#5C554E] hover:border-[#A8A196]'
                          }`}
                        >
                          Beach Wedding (Default .MP4)
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateInvitationState({
                              ...invitation,
                              coverVideoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
                            })
                          }
                          className={`px-2 py-1 text-[10px] border transition-colors flex items-center gap-1 ${
                            invitation.coverVideoUrl === 'https://www.youtube.com/watch?v=ScMzIvxBSi4'
                              ? 'bg-[#2A2522] text-white border-[#2A2522]'
                              : 'bg-white border-[#DDD5C7] text-[#5C554E] hover:border-[#A8A196]'
                          }`}
                        >
                          <YouTubeIcon className="w-3 h-3 text-red-500" />
                          <span>Cinematic Romance (YouTube)</span>
                        </button>
                      </div>
                    </div>

                    {/* Overlay Control 1: Darkness / Opacity Slider */}
                    <div className="space-y-2 pt-2 border-t border-[#EAE4DB]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#2A2522] font-medium">Tingkat Kegelapan Overlay</span>
                        <span className="font-mono text-[#2A2522] bg-white border border-[#DDD5C7] px-2 py-0.5 text-[11px] font-medium">
                          {invitation.videoOverlayOpacity ?? 40}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={85}
                        step={5}
                        value={invitation.videoOverlayOpacity ?? 40}
                        onChange={(e) =>
                          updateInvitationState({
                            ...invitation,
                            videoOverlayOpacity: Number(e.target.value),
                          })
                        }
                        className="w-full accent-[#2A2522] cursor-pointer h-1.5 bg-[#E6E0D6] rounded-lg"
                      />
                      <div className="flex items-center justify-between text-[9px] text-[#8C827A]">
                        <span>10% (Lebih Jernih)</span>
                        <span>85% (Lebih Gelap)</span>
                      </div>

                      {/* Quick Presets for Opacity */}
                      <div className="flex gap-2 pt-1">
                        {[
                          { label: 'Jernih (20%)', val: 20 },
                          { label: 'Seimbang (40%)', val: 40 },
                          { label: 'Kontras (65%)', val: 65 },
                        ].map((p) => (
                          <button
                            key={p.val}
                            type="button"
                            onClick={() => updateInvitationState({ ...invitation, videoOverlayOpacity: p.val })}
                            className={`flex-1 py-1.5 text-[10px] border transition-colors ${
                              (invitation.videoOverlayOpacity ?? 40) === p.val
                                ? 'bg-[#2A2522] border-[#2A2522] text-[#FAF8F5] font-medium'
                                : 'bg-white border-[#DCD6CC] text-[#5C554E] hover:border-[#A8A196]'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Overlay Control 2: Glass Blur Slider */}
                    <div className="space-y-2 pt-2 border-t border-[#EAE4DB]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#2A2522] font-medium">Efek Kaca Frosted (Glass Blur)</span>
                        <span className="font-mono text-[#2A2522] bg-white border border-[#DDD5C7] px-2 py-0.5 text-[11px] font-medium">
                          {invitation.videoOverlayBlur ?? 8}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={20}
                        step={1}
                        value={invitation.videoOverlayBlur ?? 8}
                        onChange={(e) =>
                          updateInvitationState({
                            ...invitation,
                            videoOverlayBlur: Number(e.target.value),
                          })
                        }
                        className="w-full accent-[#2A2522] cursor-pointer h-1.5 bg-[#E6E0D6] rounded-lg"
                      />
                      <div className="flex items-center justify-between text-[9px] text-[#8C827A]">
                        <span>0px (Bening)</span>
                        <span>20px (Kaca Buram Kuat)</span>
                      </div>

                      {/* Quick Presets for Blur */}
                      <div className="flex gap-2 pt-1">
                        {[
                          { label: 'Bening (0px)', val: 0 },
                          { label: 'Soft (8px)', val: 8 },
                          { label: 'Frosted (16px)', val: 16 },
                        ].map((p) => (
                          <button
                            key={p.val}
                            type="button"
                            onClick={() => updateInvitationState({ ...invitation, videoOverlayBlur: p.val })}
                            className={`flex-1 py-1.5 text-[10px] border transition-colors ${
                              (invitation.videoOverlayBlur ?? 8) === p.val
                                ? 'bg-[#2A2522] border-[#2A2522] text-[#FAF8F5] font-medium'
                                : 'bg-white border-[#DCD6CC] text-[#5C554E] hover:border-[#A8A196]'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Overlay Control 3: Color Tone / Tint */}
                    <div className="space-y-2 pt-2 border-t border-[#EAE4DB]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#2A2522] font-medium">Tone Nuansa Warna</span>
                        <span className="text-[10px] text-[#7C756E] capitalize font-medium">
                          {invitation.videoOverlayTint === 'warm-mocha'
                            ? 'Warm Mocha'
                            : invitation.videoOverlayTint === 'midnight-navy'
                            ? 'Midnight Navy'
                            : 'Noir Obsidian'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          {
                            id: 'noir' as const,
                            name: 'Noir',
                            subtitle: 'Obsidian Black',
                            color: '#1A1817',
                          },
                          {
                            id: 'warm-mocha' as const,
                            name: 'Mocha',
                            subtitle: 'Warm Romance',
                            color: '#382216',
                          },
                          {
                            id: 'midnight-navy' as const,
                            name: 'Midnight',
                            subtitle: 'Deep Navy',
                            color: '#121A28',
                          },
                        ].map((t) => {
                          const isSelected = (invitation.videoOverlayTint || 'noir') === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => updateInvitationState({ ...invitation, videoOverlayTint: t.id })}
                              className={`p-2.5 text-left border transition-all flex flex-col justify-between ${
                                isSelected
                                  ? 'border-[#2A2522] bg-white shadow-xs ring-1 ring-[#2A2522]'
                                  : 'border-[#DCD6CC] bg-white/70 hover:border-[#A8A196]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0 shadow-inner"
                                  style={{ backgroundColor: t.color }}
                                />
                                <span className={`text-[11px] font-medium ${isSelected ? 'text-[#2A2522]' : 'text-[#5C554E]'}`}>
                                  {t.name}
                                </span>
                              </div>
                              <span className="text-[9px] text-[#8C827A]">{t.subtitle}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#7C756E] leading-relaxed border-t border-[#EAE4DB] pt-3 font-light">
                      ✨ Pengaturan di atas diterapkan langsung ke tampilan layar di sebelah kanan.
                    </p>
                  </div>
                    );
                  }

                  // Non-motion template without active living video addon: show compact activation card
                  return (
                    <div className="p-3 bg-[#1C1917] text-[#FAF8F5] border border-neutral-800 rounded-sm flex items-center justify-between gap-3 shadow-xs">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
                            Opsional
                          </span>
                        </div>
                        <h5 className="font-serif text-xs sm:text-sm font-medium text-white truncate">
                          Living Video Background
                        </h5>
                        <p className="text-[10px] text-neutral-400 truncate">
                          Ubah background jadi video sinematik bergerak
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updatedAddons = invitation.activeAddonIds.includes('living-video-bg')
                            ? invitation.activeAddonIds
                            : [...invitation.activeAddonIds, 'living-video-bg'];
                          updateInvitationState({
                            ...invitation,
                            activeAddonIds: updatedAddons,
                            coverVideoUrl: invitation.coverVideoUrl || '/videos/elodie-bg.mp4',
                          });
                        }}
                        className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider bg-[#C5A880] text-black hover:bg-[#D4AF37] transition-all shrink-0 rounded-xs"
                      >
                        +Rp 45.000
                      </button>
                    </div>
                  );
                })()}

                {/* 5. Music / Audio Background Controller (Available for ALL PACKAGES) */}
                <div className="p-4 bg-[#FAF7F2] border border-[#E2DDD5] space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider text-[#2A2522] font-semibold flex items-center gap-2">
                      <Music className="w-3.5 h-3.5 text-[#8C6D3B]" />
                      <span>Musik Latar Belakang (Audio)</span>
                    </label>
                    <span className="text-[9px] uppercase tracking-widest text-[#8C6D3B] bg-[#F2ECE1] border border-[#DDD4C7] px-2 py-0.5 font-medium">
                      Semua Paket
                    </span>
                  </div>

                  <p className="text-[11px] text-[#7C756E] leading-relaxed font-light">
                    Musik otomatis diputar dengan lembut saat tamu menekan tombol &ldquo;Buka Undangan&rdquo;. Anda bebas mengunggah lagu favorit atau memilih dari koleksi romantis kami.
                  </p>

                  {/* Current Music Status & Mini Preview Player */}
                  <div className="p-3 bg-white border border-[#DDD5C7] rounded-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={toggleSidebarMusicPreview}
                        disabled={!invitation.musicUrl}
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          !invitation.musicUrl
                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                            : sidebarAudioPlaying
                            ? 'bg-[#2A2522] text-[#FAF8F5] shadow-sm'
                            : 'bg-[#F4EFE6] text-[#2A2522] hover:bg-[#2A2522] hover:text-white'
                        }`}
                        title={sidebarAudioPlaying ? 'Jeda Pratinjau' : 'Dengarkan Lagu'}
                      >
                        {sidebarAudioPlaying ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 ml-0.5" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Volume2 className="w-3 h-3 text-[#8C6D3B] shrink-0" />
                          <p className="text-xs font-medium text-[#2A2522] truncate">
                            {(() => {
                              if (!invitation.musicUrl) return 'Tanpa Musik (Hening)';
                              const found = AUDIO_PRESETS.find((p) => p.url === invitation.musicUrl);
                              if (found) return found.name;
                              if (invitation.musicUrl.startsWith('data:audio')) return 'File Lagu Sendiri (Custom Upload)';
                              return 'Lagu Kustom Pasangan';
                            })()}
                          </p>
                        </div>
                        <p className="text-[10px] text-[#8C827A] truncate">
                          {invitation.musicUrl
                            ? sidebarAudioPlaying
                              ? 'Sedang memutar pratinjau audio...'
                              : 'Klik tombol play untuk tes dengar lagu'
                            : 'Musik dinonaktifkan (hening)'}
                        </p>
                      </div>
                    </div>

                    {invitation.musicUrl ? (
                      <button
                        type="button"
                        onClick={() => {
                          stopSidebarMusic();
                          updateInvitationState({ ...invitation, musicUrl: '' });
                        }}
                        className="text-[10px] text-red-600 hover:text-red-800 underline underline-offset-2 shrink-0 transition-colors"
                      >
                        Matikan Musik
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          updateInvitationState({
                            ...invitation,
                            musicUrl: AUDIO_PRESETS[0].url,
                          });
                        }}
                        className="text-[10px] text-[#8C6D3B] hover:text-[#2A2522] underline underline-offset-2 shrink-0 transition-colors"
                      >
                        Aktifkan Default
                      </button>
                    )}
                  </div>

                  {/* Upload Audio File Trigger */}
                  <div className="pt-2 border-t border-[#EAE4DB] space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#7C756E] font-medium block">
                      Pilihan 1: Upload File Lagu Sendiri
                    </span>
                    <label className={`cursor-pointer flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-medium transition-colors shadow-xs ${
                      isUploadingAudio
                        ? 'bg-neutral-400 text-white cursor-not-allowed'
                        : 'bg-[#2A2522] text-[#FAF8F5] hover:bg-black'
                    }`}>
                      <Upload className={`w-3.5 h-3.5 ${isUploadingAudio ? 'animate-bounce' : ''}`} />
                      <span>{isUploadingAudio ? 'Mengunggah ke Cloud CDN...' : 'Upload MP3 / Audio dari HP atau Laptop'}</span>
                      <input
                        type="file"
                        accept="audio/*,.mp3,.m4a,.wav,.aac"
                        disabled={isUploadingAudio}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleAudioUpload(file);
                          }
                          if (e.target) e.target.value = '';
                        }}
                      />
                    </label>
                    <p className="text-[9.5px] text-[#8C827A]">
                      File disimpan langsung ke Cloud Storage CDN (mendukung MP3, M4A, WAV hingga 25MB).
                    </p>
                  </div>

                  {/* Curated Wedding Presets */}
                  <div className="pt-2 border-t border-[#EAE4DB] space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#7C756E] font-medium block">
                      Pilihan 2: Koleksi Lagu Romantis Siap Pakai
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {AUDIO_PRESETS.map((preset) => {
                        const isCurrent = invitation.musicUrl === preset.url;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              stopSidebarMusic();
                              updateInvitationState({ ...invitation, musicUrl: preset.url });
                            }}
                            className={`p-2 text-left border transition-all flex items-center justify-between ${
                              isCurrent
                                ? 'bg-[#2A2522] text-white border-[#2A2522]'
                                : 'bg-white border-[#DDD5C7] text-[#5C554E] hover:border-[#A8A196]'
                            }`}
                          >
                            <div className="min-w-0 pr-1">
                              <p className="text-[11px] font-medium truncate">{preset.name}</p>
                              <p className={`text-[9px] truncate ${isCurrent ? 'text-neutral-300' : 'text-[#8C827A]'}`}>
                                {preset.genre}
                              </p>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
                    Kutipan Pembuka / Doa
                  </label>
                  <textarea
                    rows={3}
                    value={invitation.holyVerse || ''}
                    onChange={(e) => updateInvitationState({ ...invitation, holyVerse: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 outline-none"
                    placeholder="Tuliskan ayat suci atau kutipan pembuka..."
                  />
                </div>
              </div>
            )}

            {/* 2. Tab: Couple Details */}
            {activeTab === 'couple' && (
              <div className="space-y-6">
                <div className="p-4 border border-neutral-200 bg-neutral-50/50 space-y-4">
                  <h4 className="font-serif text-lg uppercase tracking-wide">Mempelai Pria</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={invitation.couple.groomName}
                        onChange={(e) =>
                          updateInvitationState({
                            ...invitation,
                            couple: { ...invitation.couple, groomName: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">Nama Panggilan</label>
                      <input
                        type="text"
                        value={invitation.couple.groomNickname}
                        onChange={(e) =>
                          updateInvitationState({
                            ...invitation,
                            couple: { ...invitation.couple, groomNickname: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-neutral-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">Nama Ayah</label>
                      <input
                        type="text"
                        value={invitation.couple.groomFather}
                        onChange={(e) =>
                          updateInvitationState({
                            ...invitation,
                            couple: { ...invitation.couple, groomFather: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">Nama Ibu</label>
                      <input
                        type="text"
                        value={invitation.couple.groomMother}
                        onChange={(e) =>
                          updateInvitationState({
                            ...invitation,
                            couple: { ...invitation.couple, groomMother: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-neutral-300"
                      />
                    </div>
                  </div>
                  {/* Foto Mempelai Pria - Direct Upload */}
                  <div className="pt-2 border-t border-[#EAE4DB]">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] uppercase tracking-wider text-[#2A2522] font-semibold flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#8C6D3B]" />
                        <span>Foto Mempelai Pria</span>
                      </label>
                      {invitation.couple.groomPhotoUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            updateInvitationState({
                              ...invitation,
                              couple: { ...invitation.couple, groomPhotoUrl: '' },
                            })
                          }
                          className="text-[10px] text-red-600 hover:underline"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2.5 border border-[#DDD5C7]">
                      {invitation.couple.groomPhotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={invitation.couple.groomPhotoUrl}
                          alt="Mempelai Pria"
                          className="w-12 h-14 object-cover border border-[#DDD5C7] rounded-xs shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-14 bg-[#F2EDE4] border border-dashed border-[#DDD5C7] flex items-center justify-center shrink-0 text-[#8C827A]">
                          <ImageIcon className="w-5 h-5 opacity-40" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2A2522] text-white hover:bg-black text-[11px] font-medium transition-colors shadow-xs">
                            <Upload className="w-3 h-3" />
                            <span>{invitation.couple.groomPhotoUrl ? 'Ganti Foto Pria' : 'Pilih Foto dari Galeri'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const compressed = await compressImageFile(file);
                                  if (compressed) {
                                    updateInvitationState({
                                      ...invitation,
                                      couple: { ...invitation.couple, groomPhotoUrl: compressed },
                                    });
                                  }
                                }
                              }}
                            />
                          </label>

                          {invitation.couple.groomPhotoUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setCropModalState({
                                  isOpen: true,
                                  imageUrl: invitation.couple.groomPhotoUrl,
                                  target: 'groom',
                                  ratio: '1:1',
                                  title: 'Crop & Atur Safe Angle Foto Pria',
                                })
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium bg-white text-[#2A2522] border border-[#DDD5C7] hover:border-[#8C6D3B] hover:text-[#8C6D3B] transition-colors shadow-xs"
                              title="Atur framing dan perbesaran foto pria"
                            >
                              <Crop className="w-3 h-3 text-[#8C6D3B]" />
                              <span>Crop / Atur Angle</span>
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-[#8C827A] truncate">
                          Pilih langsung dari galeri HP atau komputer, lalu atur sudutnya.
                        </p>
                      </div>
                    </div>

                    {/* Presets Groom Photo */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-wider text-[#8C827A]">Pilihan Studio:</span>
                      {[
                        { name: 'Studio 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
                        { name: 'Studio 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop' },
                        { name: 'Outdoor', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop' },
                      ].map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            updateInvitationState({
                              ...invitation,
                              couple: { ...invitation.couple, groomPhotoUrl: p.url },
                            })
                          }
                          className="px-2 py-0.5 text-[10px] border border-[#DDD5C7] bg-white hover:border-[#2A2522] text-[#5C554E]"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>

                    {/* Badge Label Foto Mempelai Pria (Opsional / Custom) */}
                    <div className="mt-4 pt-3 border-t border-[#EAE4DB] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] uppercase tracking-wider text-[#2A2522] font-semibold flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-[#8C6D3B]" />
                          <span>Badge Label Foto Pria (Opsional)</span>
                        </label>
                        {(invitation.couple.groomLabelBadge !== undefined ? invitation.couple.groomLabelBadge : (['mahadewi-bali', 'bali-heritage'].includes(invitation.templateId) ? 'Sang Purusha' : '')) && (
                          <button
                            type="button"
                            onClick={() =>
                              updateInvitationState({
                                ...invitation,
                                couple: { ...invitation.couple, groomLabelBadge: '' },
                              })
                            }
                            className="text-[10px] text-red-600 hover:underline font-medium"
                          >
                            Hapus / Sembunyikan
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={
                          invitation.couple.groomLabelBadge !== undefined
                            ? invitation.couple.groomLabelBadge
                            : (['mahadewi-bali', 'bali-heritage'].includes(invitation.templateId) ? 'Sang Purusha' : '')
                        }
                        onChange={(e) =>
                          updateInvitationState({
                            ...invitation,
                            couple: { ...invitation.couple, groomLabelBadge: e.target.value },
                          })
                        }
                        placeholder="Contoh: SANG PURUSHA (Kosongkan jika tidak ingin dimunculkan)"
                        className="w-full px-3 py-2 text-xs border border-neutral-300 placeholder:text-neutral-400 bg-white"
                      />
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[9px] uppercase tracking-wider text-[#8C827A]">Pilihan Cepat:</span>
                        {['SANG PURUSHA', 'MEMPELAI PRIA', 'THE GROOM'].map((txt) => (
                          <button
                            key={txt}
                            type="button"
                            onClick={() =>
                              updateInvitationState({
                                ...invitation,
                                couple: { ...invitation.couple, groomLabelBadge: txt },
                              })
                            }
                            className="px-2 py-0.5 text-[10px] border border-[#DDD5C7] bg-white hover:border-[#2A2522] text-[#5C554E] transition-colors"
                          >
                            {txt}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            updateInvitationState({
                              ...invitation,
                              couple: { ...invitation.couple, groomLabelBadge: '' },
                            })
                          }
                          className="px-2 py-0.5 text-[10px] border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
                        >
                          ✕ Kosongkan
                        </button>
                      </div>
                      <p className="text-[10px] text-[#8C827A] italic leading-tight">
                        * Teks badge kecil di atas foto mempelai pria. Anda bebas mengubah teks ini atau mengosongkannya agar badge tidak muncul sama sekali.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-neutral-200 bg-neutral-50/50 space-y-4">
                  <h4 className="font-serif text-lg uppercase tracking-wide">Mempelai Wanita</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={invitation.couple.brideName}
                        onChange={(e) =>
                          updateInvitationState({
                            ...invitation,
                            couple: { ...invitation.couple, brideName: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">Nama Panggilan</label>
                      <input
                        type="text"
                        value={invitation.couple.brideNickname}
                        onChange={(e) =>
                          updateInvitationState({
                            ...invitation,
                            couple: { ...invitation.couple, brideNickname: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-neutral-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">Nama Ayah</label>
                      <input
                        type="text"
                        value={invitation.couple.brideFather}
                        onChange={(e) =>
                          updateInvitationState({
                            ...invitation,
                            couple: { ...invitation.couple, brideFather: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">Nama Ibu</label>
                      <input
                        type="text"
                        value={invitation.couple.brideMother}
                        onChange={(e) =>
                          updateInvitationState({
                            ...invitation,
                            couple: { ...invitation.couple, brideMother: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-neutral-300"
                      />
                    </div>
                  </div>

                  {/* Foto Mempelai Wanita - Direct Upload */}
                  <div className="pt-2 border-t border-[#EAE4DB]">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] uppercase tracking-wider text-[#2A2522] font-semibold flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#8C6D3B]" />
                        <span>Foto Mempelai Wanita</span>
                      </label>
                      {invitation.couple.bridePhotoUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            updateInvitationState({
                              ...invitation,
                              couple: { ...invitation.couple, bridePhotoUrl: '' },
                            })
                          }
                          className="text-[10px] text-red-600 hover:underline"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2.5 border border-[#DDD5C7]">
                      {invitation.couple.bridePhotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={invitation.couple.bridePhotoUrl}
                          alt="Mempelai Wanita"
                          className="w-12 h-14 object-cover border border-[#DDD5C7] rounded-xs shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-14 bg-[#F2EDE4] border border-dashed border-[#DDD5C7] flex items-center justify-center shrink-0 text-[#8C827A]">
                          <ImageIcon className="w-5 h-5 opacity-40" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2A2522] text-white hover:bg-black text-[11px] font-medium transition-colors shadow-xs">
                            <Upload className="w-3 h-3" />
                            <span>{invitation.couple.bridePhotoUrl ? 'Ganti Foto Wanita' : 'Pilih Foto dari Galeri'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const compressed = await compressImageFile(file);
                                  if (compressed) {
                                    updateInvitationState({
                                      ...invitation,
                                      couple: { ...invitation.couple, bridePhotoUrl: compressed },
                                    });
                                  }
                                }
                              }}
                            />
                          </label>

                          {invitation.couple.bridePhotoUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setCropModalState({
                                  isOpen: true,
                                  imageUrl: invitation.couple.bridePhotoUrl,
                                  target: 'bride',
                                  ratio: '1:1',
                                  title: 'Crop & Atur Safe Angle Foto Wanita',
                                })
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium bg-white text-[#2A2522] border border-[#DDD5C7] hover:border-[#8C6D3B] hover:text-[#8C6D3B] transition-colors shadow-xs"
                              title="Atur framing dan perbesaran foto wanita"
                            >
                              <Crop className="w-3 h-3 text-[#8C6D3B]" />
                              <span>Crop / Atur Angle</span>
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-[#8C827A] truncate">
                          Pilih langsung dari galeri HP atau komputer, lalu atur sudutnya.
                        </p>
                      </div>
                    </div>

                    {/* Presets Bride Photo */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-wider text-[#8C827A]">Pilihan Studio:</span>
                      {[
                        { name: 'Studio 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop' },
                        { name: 'Studio 2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop' },
                        { name: 'Outdoor', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop' },
                      ].map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            updateInvitationState({
                              ...invitation,
                              couple: { ...invitation.couple, bridePhotoUrl: p.url },
                            })
                          }
                          className="px-2 py-0.5 text-[10px] border border-[#DDD5C7] bg-white hover:border-[#2A2522] text-[#5C554E]"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>

                    {/* Badge Label Foto Mempelai Wanita (Opsional / Custom) */}
                    <div className="mt-4 pt-3 border-t border-[#EAE4DB] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] uppercase tracking-wider text-[#2A2522] font-semibold flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-[#8C6D3B]" />
                          <span>Badge Label Foto Wanita (Opsional)</span>
                        </label>
                        {(invitation.couple.brideLabelBadge !== undefined ? invitation.couple.brideLabelBadge : (['mahadewi-bali', 'bali-heritage'].includes(invitation.templateId) ? 'Sang Pradana' : '')) && (
                          <button
                            type="button"
                            onClick={() =>
                              updateInvitationState({
                                ...invitation,
                                couple: { ...invitation.couple, brideLabelBadge: '' },
                              })
                            }
                            className="text-[10px] text-red-600 hover:underline font-medium"
                          >
                            Hapus / Sembunyikan
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={
                          invitation.couple.brideLabelBadge !== undefined
                            ? invitation.couple.brideLabelBadge
                            : (['mahadewi-bali', 'bali-heritage'].includes(invitation.templateId) ? 'Sang Pradana' : '')
                        }
                        onChange={(e) =>
                          updateInvitationState({
                            ...invitation,
                            couple: { ...invitation.couple, brideLabelBadge: e.target.value },
                          })
                        }
                        placeholder="Contoh: SANG PRADANA (Kosongkan jika tidak ingin dimunculkan)"
                        className="w-full px-3 py-2 text-xs border border-neutral-300 placeholder:text-neutral-400 bg-white"
                      />
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[9px] uppercase tracking-wider text-[#8C827A]">Pilihan Cepat:</span>
                        {['SANG PRADANA', 'MEMPELAI WANITA', 'THE BRIDE'].map((txt) => (
                          <button
                            key={txt}
                            type="button"
                            onClick={() =>
                              updateInvitationState({
                                ...invitation,
                                couple: { ...invitation.couple, brideLabelBadge: txt },
                              })
                            }
                            className="px-2 py-0.5 text-[10px] border border-[#DDD5C7] bg-white hover:border-[#2A2522] text-[#5C554E] transition-colors"
                          >
                            {txt}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            updateInvitationState({
                              ...invitation,
                              couple: { ...invitation.couple, brideLabelBadge: '' },
                            })
                          }
                          className="px-2 py-0.5 text-[10px] border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
                        >
                          ✕ Kosongkan
                        </button>
                      </div>
                      <p className="text-[10px] text-[#8C827A] italic leading-tight">
                        * Teks badge kecil di atas foto mempelai wanita. Anda bebas mengubah teks ini atau mengosongkannya agar badge tidak muncul sama sekali.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Tab: Events Manager */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg uppercase tracking-wide">Daftar Acara</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newEvent: EventDetail = {
                        id: 'event-' + Date.now(),
                        name: 'Acara Baru',
                        date: invitation.eventDate,
                        startTime: '10:00',
                        endTime: '12:00',
                        timezone: 'WIB',
                        venueName: 'Nama Tempat',
                        address: 'Alamat Lokasi Acara',
                        googleMapsUrl: 'https://maps.google.com',
                        orderIndex: invitation.events.length,
                      };
                      updateInvitationState({
                        ...invitation,
                        events: [...invitation.events, newEvent],
                      });
                    }}
                    className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider px-3 py-1.5 border border-black hover:bg-black hover:text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Acara</span>
                  </button>
                </div>

                {invitation.events.map((ev, idx) => (
                  <div key={ev.id} className="p-4 border border-neutral-200 bg-neutral-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
                        ACARA #{idx + 1}
                      </span>
                      {invitation.events.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            updateInvitationState({
                              ...invitation,
                              events: invitation.events.filter((item) => item.id !== ev.id),
                            });
                          }}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">Nama Acara</label>
                      <input
                        type="text"
                        value={ev.name}
                        onChange={(e) => {
                          const updated = [...invitation.events];
                          updated[idx].name = e.target.value;
                          updateInvitationState({ ...invitation, events: updated });
                        }}
                        className="w-full px-3 py-2 text-xs border border-neutral-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 mb-1">Tanggal</label>
                        <input
                          type="date"
                          value={ev.date}
                          onChange={(e) => {
                            const updated = [...invitation.events];
                            updated[idx].date = e.target.value;
                            updateInvitationState({ ...invitation, events: updated });
                          }}
                          className="w-full px-3 py-2 text-xs border border-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 mb-1">Waktu Mulai</label>
                        <input
                          type="text"
                          value={ev.startTime}
                          onChange={(e) => {
                            const updated = [...invitation.events];
                            updated[idx].startTime = e.target.value;
                            updateInvitationState({ ...invitation, events: updated });
                          }}
                          className="w-full px-3 py-2 text-xs border border-neutral-300"
                          placeholder="09:00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">Nama Tempat / Gedung</label>
                      <input
                        type="text"
                        value={ev.venueName}
                        onChange={(e) => {
                          const updated = [...invitation.events];
                          updated[idx].venueName = e.target.value;
                          updateInvitationState({ ...invitation, events: updated });
                        }}
                        className="w-full px-3 py-2 text-xs border border-neutral-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">Alamat Lengkap</label>
                      <textarea
                        rows={2}
                        value={ev.address}
                        onChange={(e) => {
                          const updated = [...invitation.events];
                          updated[idx].address = e.target.value;
                          updateInvitationState({ ...invitation, events: updated });
                        }}
                        className="w-full px-3 py-2 text-xs border border-neutral-300 resize-none"
                      />
                    </div>

                    {/* Google Maps Link Field */}
                    <div className="pt-3 pb-1 border-t border-neutral-200 bg-[#FAF8F5] -mx-4 px-4 mt-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-[#8C6D3B] font-semibold flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#8C6D3B]" />
                          <span>Link Google Maps (Navigasi Tamu)</span>
                        </label>
                        {ev.googleMapsUrl ? (
                          <a
                            href={ev.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[9.5px] text-[#8C6D3B] hover:text-[#2A2522] font-medium underline underline-offset-2 flex items-center gap-1"
                          >
                            <span>Tes Buka Peta</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              (ev.venueName ? ev.venueName + ' ' : '') + (ev.address || '')
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[9.5px] text-neutral-400 hover:text-[#8C6D3B] underline underline-offset-2 flex items-center gap-1"
                          >
                            <span>Cari Lokasi di Maps</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                      <input
                        type="text"
                        value={ev.googleMapsUrl || ''}
                        onChange={(e) => {
                          const updated = [...invitation.events];
                          updated[idx].googleMapsUrl = e.target.value;
                          updateInvitationState({ ...invitation, events: updated });
                        }}
                        className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-none font-mono focus:border-[#8C6D3B] focus:bg-white outline-none bg-white transition-colors"
                        placeholder="Contoh: https://maps.app.goo.gl/... atau https://goo.gl/maps/..."
                      />
                      <p className="text-[9.5px] text-neutral-500 mt-1.5 leading-relaxed">
                        Tamu yang menekan tombol <strong>&ldquo;Google Maps&rdquo;</strong> di undangan akan langsung diarahkan ke titik navigasi GPS ini.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Tab: Section Visibility Toggles */}
            {activeTab === 'sections' && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h4 className="font-serif text-lg uppercase tracking-wide">Tampilkan / Sembunyikan Section</h4>
                  <p className="text-[11px] text-neutral-400">
                    Nonaktifkan section yang tidak ingin ditampilkan agar undangan tetap bersih dan personal.
                  </p>
                </div>

                {Object.entries(invitation.sectionVisibility).map(([key, isVisible]) => (
                  <div
                    key={key}
                    onClick={() => {
                      updateInvitationState({
                        ...invitation,
                        sectionVisibility: {
                          ...invitation.sectionVisibility,
                          [key]: !isVisible,
                        },
                      });
                    }}
                    className="p-3 border border-neutral-200 flex items-center justify-between cursor-pointer hover:border-black transition-colors"
                  >
                    <span className="text-xs uppercase tracking-wider text-neutral-800">
                      {key.toUpperCase()}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isVisible ? 'bg-black border-black text-white' : 'border-neutral-300 text-transparent'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  </div>
                ))}

                {/* Video URL Input when video section is active */}
                {invitation.sectionVisibility.video && (
                  <div className="p-4 bg-[#FAF8F5] border border-neutral-300/80 rounded-sm mt-4 space-y-2">
                    <label className="block text-xs uppercase tracking-widest text-neutral-800 font-medium">
                      URL Video Prewedding (YouTube / Vimeo)
                    </label>
                    <input
                      type="url"
                      value={invitation.videoUrl || ''}
                      onChange={(e) => updateInvitationState({ ...invitation, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=ScMzIvxBSi4"
                      className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 outline-none bg-white focus:border-black transition-colors"
                    />
                    <p className="text-[10px] text-neutral-400">
                      Mendukung link video YouTube atau Vimeo. Video akan otomatis disematkan ke dalam pemutar sinematik undangan.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 5. Tab: Gallery */}
            {activeTab === 'gallery' && (() => {
              const isPremium = invitation.packageId === 'pkg-premium';
              const hasExtraGallery = invitation.activeAddonIds.includes('extra-gallery');
              const maxPhotos = isPremium ? (hasExtraGallery ? 50 : 30) : (hasExtraGallery ? 30 : 10);
              const currentPhotosCount = invitation.gallery.length;
              const isAtQuota = currentPhotosCount >= maxPhotos;
              const remainingQuota = Math.max(0, maxPhotos - currentPhotosCount);

              const STUDIO_PREWED_PRESETS = [
                {
                  imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
                  caption: 'Quiet afternoon in Como',
                  aspectRatio: '4:5' as const,
                },
                {
                  imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
                  caption: 'Golden hour sunset silhouette',
                  aspectRatio: '1:1' as const,
                },
                {
                  imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop',
                  caption: 'Intimate prewedding vows rehearsal',
                  aspectRatio: '4:5' as const,
                },
                {
                  imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
                  caption: 'Under the starlight celebration',
                  aspectRatio: '16:9' as const,
                },
                {
                  imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop',
                  caption: 'A gentle embrace',
                  aspectRatio: '4:5' as const,
                },
                {
                  imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop',
                  caption: 'Forever smiles and joyful vows',
                  aspectRatio: '1:1' as const,
                },
              ];

              return (
                <div className="space-y-4">
                  {/* Quota Status Card */}
                  <div className="p-4 bg-white border border-[#DDD5C7] rounded-xs space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif text-sm uppercase tracking-wide text-[#2A2522] font-semibold">
                          Foto Galeri
                        </span>
                        <span className={`text-[9px] font-semibold uppercase px-2 py-0.5 tracking-wider border rounded-xs ${
                          isPremium
                            ? 'bg-[#F4EFE6] text-[#8C6D3B] border-[#DDD5C7]'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                        }`}>
                          {isPremium ? 'Paket Premium (Maks 30 Foto)' : 'Paket Essential (Maks 10 Foto)'}
                        </span>
                        {hasExtraGallery && (
                          <span className="text-[9px] font-semibold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xs">
                            + Add-on 50 Foto
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-[#2A2522]">
                        {currentPhotosCount} / {maxPhotos} Foto
                      </span>
                    </div>

                    {/* Quota Progress Bar */}
                    <div className="w-full bg-[#EFEBE4] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isAtQuota ? 'bg-amber-600' : 'bg-[#8C6D3B]'
                        }`}
                        style={{ width: `${Math.min(100, Math.round((currentPhotosCount / maxPhotos) * 100))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10.5px] text-[#7C756E]">
                      <span>
                        {isAtQuota
                          ? 'Batas kuota foto paket ini telah tercapai.'
                          : `Sisa kuota: Masih bisa tambah ${remainingQuota} foto lagi.`}
                      </span>
                      {!isPremium ? (
                        <button
                          type="button"
                          onClick={handleUpgradeToPremium}
                          className="text-[#8C6D3B] hover:text-[#2A2522] font-medium underline underline-offset-2"
                        >
                          Upgrade ke Premium (30 Foto) →
                        </button>
                      ) : !hasExtraGallery && currentPhotosCount >= 25 ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (!invitation.activeAddonIds.includes('extra-gallery')) {
                              updateInvitationState({
                                ...invitation,
                                activeAddonIds: [...invitation.activeAddonIds, 'extra-gallery'],
                              });
                            }
                          }}
                          className="text-[#8C6D3B] hover:text-[#2A2522] font-medium underline underline-offset-2"
                        >
                          Tambah Extra Gallery (+20 Foto) →
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Actions Header */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-[#7C756E]">
                      Pilih sekaligus banyak foto dari galeri HP atau laptop.
                    </p>

                    <div className="flex items-center gap-2">
                      {/* Upload Button */}
                      <label
                        className={`cursor-pointer inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider px-3.5 py-2 transition-colors shadow-xs ${
                          isAtQuota
                            ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                            : 'bg-[#2A2522] text-white hover:bg-black'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>+ Upload Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={isAtQuota}
                          className="hidden"
                          onChange={async (e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              const filesToProcess = Array.from(files).slice(0, remainingQuota);
                              if (files.length > remainingQuota) {
                                alert(`Hanya ${remainingQuota} foto yang dapat diunggah sesuai batas kuota paket (${maxPhotos} foto).`);
                              }
                              // Clear input value so selecting the same file again triggers change event
                              e.target.value = '';

                              const compressedList = await Promise.all(
                                filesToProcess.map((file) => compressImageWithDetails(file))
                              );
                              const newPhotos: GalleryItem[] = compressedList
                                .filter((res) => Boolean(res.dataUrl))
                                .map((res, index) => ({
                                  id: 'gal-' + Date.now() + '-' + index + '-' + Math.random().toString(36).substring(2, 6),
                                  imageUrl: res.dataUrl,
                                  caption: '',
                                  aspectRatio: res.aspectRatio,
                                  orderIndex: invitation.gallery.length + index,
                                }));

                              const updated = {
                                ...invitation,
                                gallery: [...invitation.gallery, ...newPhotos],
                              };
                              updateInvitationState(updated);

                              // Upload new photos to Supabase Storage in background
                              Promise.all(
                                newPhotos.map(async (photo) => {
                                  if (photo.imageUrl.startsWith('data:')) {
                                    const publicUrl = await uploadDataUrlToSupabase(photo.imageUrl, 'gallery');
                                    if (publicUrl) photo.imageUrl = publicUrl;
                                  }
                                  return photo;
                                })
                              ).then(() => {
                                updateInvitationState({
                                  ...invitation,
                                  gallery: [...invitation.gallery, ...newPhotos],
                                });
                              });
                            }
                          }}
                        />
                      </label>

                      {/* Quick Add Sample Studio Photos */}
                      {currentPhotosCount < maxPhotos && (
                        <button
                          type="button"
                          onClick={() => {
                            const availableToAdd = STUDIO_PREWED_PRESETS.filter(
                              (preset) => !invitation.gallery.some((g) => g.imageUrl === preset.imageUrl)
                            ).slice(0, remainingQuota);

                            if (availableToAdd.length === 0) {
                              const sample = STUDIO_PREWED_PRESETS[0];
                              const newPhotos: GalleryItem[] = [{
                                id: 'gal-preset-' + Date.now(),
                                imageUrl: sample.imageUrl,
                                caption: sample.caption,
                                aspectRatio: sample.aspectRatio,
                                orderIndex: invitation.gallery.length,
                              }];
                              updateInvitationState({
                                ...invitation,
                                gallery: [...invitation.gallery, ...newPhotos],
                              });
                              return;
                            }

                            const newPhotos: GalleryItem[] = availableToAdd.map((preset, index) => ({
                              id: 'gal-preset-' + Date.now() + '-' + index,
                              imageUrl: preset.imageUrl,
                              caption: preset.caption,
                              aspectRatio: preset.aspectRatio,
                              orderIndex: invitation.gallery.length + index,
                            }));

                            const updated = {
                              ...invitation,
                              gallery: [...invitation.gallery, ...newPhotos],
                            };
                            updateInvitationState(updated);
                          }}
                          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider px-3 py-2 bg-white text-[#5C554E] hover:text-[#2A2522] border border-[#DDD5C7] hover:border-[#A8A196] transition-colors"
                          title="Tambahkan foto contoh studio prewedding untuk melihat tampilan galeri"
                        >
                          <ImageIcon className="w-3 h-3 text-[#8C6D3B]" />
                          <span>+ Contoh Studio</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {invitation.gallery.length === 0 ? (
                    <div className="p-8 border border-dashed border-[#DDD5C7] text-center bg-white space-y-3">
                      <ImageIcon className="w-9 h-9 text-[#8C6D3B] mx-auto opacity-40" />
                      <div>
                        <p className="text-xs text-[#2A2522] font-medium">Belum ada foto di galeri.</p>
                        <p className="text-[10px] text-[#7C756E] mt-0.5">
                          Anda memiliki kuota hingga <strong>{maxPhotos} foto</strong> untuk {isPremium ? 'Paket Premium' : 'Paket Essential'}.
                        </p>
                      </div>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider px-4 py-2 bg-[#2A2522] text-white hover:bg-black transition-colors shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Pilih Foto Sekarang</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={async (e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              e.target.value = '';
                              const compressedList = await Promise.all(
                                Array.from(files).slice(0, maxPhotos).map((file) => compressImageWithDetails(file))
                              );
                              const newPhotos: GalleryItem[] = compressedList
                                .filter((res) => Boolean(res.dataUrl))
                                .map((res, index) => ({
                                  id: 'gal-' + Date.now() + '-' + index,
                                  imageUrl: res.dataUrl,
                                  caption: '',
                                  aspectRatio: res.aspectRatio,
                                  orderIndex: index,
                                }));
                              updateInvitationState({ ...invitation, gallery: newPhotos });
                            }
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {invitation.gallery.map((item, idx) => (
                        <div key={item.id} className="p-3.5 border border-[#DDD5C7] bg-white flex items-center gap-3.5 hover:border-[#C4B59D] transition-colors">
                          <button
                            type="button"
                            onClick={() =>
                              setCropModalState({
                                isOpen: true,
                                imageUrl: item.imageUrl,
                                target: 'gallery',
                                galleryIdx: idx,
                                ratio: item.aspectRatio || '4:5',
                                title: `Crop & Atur Sudut Foto Galeri #${idx + 1}`,
                              })
                            }
                            className="relative group shrink-0 cursor-pointer text-left"
                            title="Klik untuk crop atau atur angle foto ini"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.imageUrl}
                              alt="Thumbnail"
                              className="w-16 h-18 object-cover border border-[#DDD5C7] rounded-xs shadow-2xs group-hover:opacity-85 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xs">
                              <Crop className="w-4 h-4 text-white drop-shadow-sm" />
                            </div>
                            <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] font-mono text-center py-0.5">
                              {item.aspectRatio || '4:5'}
                            </span>
                          </button>
                          <div className="flex-1 space-y-1.5 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-medium text-[#8C6D3B]">
                                Foto #{idx + 1} <span className="text-neutral-300 font-normal">/ {maxPhotos}</span>
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCropModalState({
                                      isOpen: true,
                                      imageUrl: item.imageUrl,
                                      target: 'gallery',
                                      galleryIdx: idx,
                                      ratio: item.aspectRatio || '4:5',
                                      title: `Crop & Atur Sudut Foto Galeri #${idx + 1}`,
                                    })
                                  }
                                  className="inline-flex items-center gap-1 text-[10px] text-[#2A2522] bg-[#FAF8F5] border border-[#DDD5C7] px-2 py-0.5 rounded-xs hover:border-[#8C6D3B] hover:text-[#8C6D3B] font-medium transition-colors"
                                  title="Atur framing, zoom, dan sudut pandang aman foto ini"
                                >
                                  <Crop className="w-2.5 h-2.5 text-[#8C6D3B]" />
                                  <span>Crop / Angle</span>
                                </button>
                                <label className="cursor-pointer inline-flex items-center gap-1 text-[10px] text-[#8C6D3B] hover:text-[#2A2522] font-medium underline underline-offset-2">
                                  <Upload className="w-2.5 h-2.5" />
                                  <span>Ganti Foto</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        e.target.value = '';
                                        const compressed = await compressImageWithDetails(file);
                                        if (compressed.dataUrl) {
                                          const updated = [...invitation.gallery];
                                          updated[idx].imageUrl = compressed.dataUrl;
                                          updated[idx].aspectRatio = compressed.aspectRatio;
                                          updateInvitationState({ ...invitation, gallery: updated });
                                        }
                                      }
                                    }}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateInvitationState({
                                      ...invitation,
                                      gallery: invitation.gallery.filter((g) => g.id !== item.id),
                                    });
                                  }}
                                  className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                                  title="Hapus foto ini"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <input
                              type="text"
                              value={item.caption || ''}
                              onChange={(e) => {
                                const updated = [...invitation.gallery];
                                updated[idx].caption = e.target.value;
                                updateInvitationState({ ...invitation, gallery: updated });
                              }}
                              className="w-full px-2.5 py-1.5 text-xs border border-[#DCD6CC] bg-[#FAF8F5] text-[#2A2522] focus:bg-white outline-none focus:border-[#8C6D3B]"
                              placeholder="Caption cerita momen (opsional)"
                            />

                            {/* Aspect Ratio Pills */}
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <span className="text-[9px] uppercase tracking-wider text-[#8C827A]">Format:</span>
                              {(['4:5', '1:1', '16:9'] as const).map((ratio) => (
                                <button
                                  key={ratio}
                                  type="button"
                                  onClick={() => {
                                    const updated = [...invitation.gallery];
                                    updated[idx].aspectRatio = ratio;
                                    updateInvitationState({ ...invitation, gallery: updated });
                                  }}
                                  className={`px-2 py-0.5 text-[9px] font-mono border rounded-xs transition-colors ${
                                    (item.aspectRatio || '4:5') === ratio
                                      ? 'bg-[#2A2522] text-white border-[#2A2522]'
                                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                                  }`}
                                >
                                  {ratio === '4:5' ? 'Portrait 4:5' : ratio === '1:1' ? 'Persegi 1:1' : 'Wide 16:9'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 6. Tab: Love Story */}
            {activeTab === 'story' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif text-lg uppercase tracking-wide">Timeline Kisah Cinta</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newStory: LoveStoryItem = {
                        id: 'story-' + Date.now(),
                        yearOrDate: 'Tahun Baru',
                        title: 'Judul Cerita',
                        story: 'Tuliskan momen indah Anda...',
                        orderIndex: invitation.loveStories.length,
                      };
                      updateInvitationState({
                        ...invitation,
                        loveStories: [...invitation.loveStories, newStory],
                      });
                    }}
                    className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider px-3 py-1.5 border border-black hover:bg-black hover:text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Momen</span>
                  </button>
                </div>

                {invitation.loveStories.map((story, idx) => (
                  <div key={story.id} className="p-4 border border-neutral-200 bg-neutral-50/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={story.yearOrDate}
                        onChange={(e) => {
                          const updated = [...invitation.loveStories];
                          updated[idx].yearOrDate = e.target.value;
                          updateInvitationState({ ...invitation, loveStories: updated });
                        }}
                        placeholder="Tahun / Tanggal"
                        className="w-32 px-2 py-1 text-xs border border-neutral-300 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateInvitationState({
                            ...invitation,
                            loveStories: invitation.loveStories.filter((s) => s.id !== story.id),
                          });
                        }}
                        className="text-red-500 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={story.title}
                      onChange={(e) => {
                        const updated = [...invitation.loveStories];
                        updated[idx].title = e.target.value;
                        updateInvitationState({ ...invitation, loveStories: updated });
                      }}
                      placeholder="Judul Momen (e.g. Pertemuan Pertama)"
                      className="w-full px-2 py-1 text-xs border border-neutral-300 font-serif text-sm"
                    />

                    <textarea
                      rows={2}
                      value={story.story}
                      onChange={(e) => {
                        const updated = [...invitation.loveStories];
                        updated[idx].story = e.target.value;
                        updateInvitationState({ ...invitation, loveStories: updated });
                      }}
                      placeholder="Deskripsi cerita..."
                      className="w-full px-2 py-1 text-xs border border-neutral-300 resize-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 7. Tab: Digital Gift Accounts */}
            {activeTab === 'gifts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif text-lg uppercase tracking-wide">Amplop Digital & Rekening</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newGift: GiftAccount = {
                        id: 'gift-' + Date.now(),
                        type: 'BANK',
                        providerName: 'BCA',
                        accountNumber: '1234567890',
                        accountHolder: invitation.couple.groomNickname,
                      };
                      updateInvitationState({
                        ...invitation,
                        gifts: [...invitation.gifts, newGift],
                      });
                    }}
                    className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider px-3 py-1.5 border border-black hover:bg-black hover:text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Rekening</span>
                  </button>
                </div>

                {invitation.gifts.map((g, idx) => (
                  <div key={g.id} className="p-4 border border-neutral-200 bg-neutral-50/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <select
                        value={g.type}
                        onChange={(e) => {
                          const updated = [...invitation.gifts];
                          updated[idx].type = e.target.value as any;
                          updateInvitationState({ ...invitation, gifts: updated });
                        }}
                        className="px-2 py-1 text-xs border border-neutral-300"
                      >
                        <option value="BANK">Bank Transfer</option>
                        <option value="EWALLET">E-Wallet</option>
                        <option value="PHYSICAL_ADDRESS">Kirim Kado / Alamat</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          updateInvitationState({
                            ...invitation,
                            gifts: invitation.gifts.filter((item) => item.id !== g.id),
                          });
                        }}
                        className="text-red-500 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {g.type === 'PHYSICAL_ADDRESS' ? (
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 mb-1">Alamat Penerima</label>
                        <textarea
                          rows={2}
                          value={g.shippingAddress || ''}
                          onChange={(e) => {
                            const updated = [...invitation.gifts];
                            updated[idx].shippingAddress = e.target.value;
                            updateInvitationState({ ...invitation, gifts: updated });
                          }}
                          className="w-full px-2 py-1 text-xs border border-neutral-300 resize-none"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] uppercase text-neutral-400 mb-1">Nama Bank / Wallet</label>
                          <input
                            type="text"
                            value={g.providerName}
                            onChange={(e) => {
                              const updated = [...invitation.gifts];
                              updated[idx].providerName = e.target.value;
                              updateInvitationState({ ...invitation, gifts: updated });
                            }}
                            className="w-full px-2 py-1 text-xs border border-neutral-300"
                            placeholder="Contoh: BCA / Mandiri"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-neutral-400 mb-1">Nomor Rekening</label>
                          <input
                            type="text"
                            value={g.accountNumber}
                            onChange={(e) => {
                              const updated = [...invitation.gifts];
                              updated[idx].accountNumber = e.target.value;
                              updateInvitationState({ ...invitation, gifts: updated });
                            }}
                            className="w-full px-2 py-1 text-xs border border-neutral-300"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 8. Tab: Add-ons & Pricing */}
            {activeTab === 'addons' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-serif text-lg uppercase tracking-wide">Katalog Add-on & Fitur</h4>
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-neutral-100 border border-neutral-300 font-medium">
                      PAKET {pkg.name.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-light">
                    Ketersediaan dan harga add-on disesuaikan secara otomatis dengan paket yang Anda pilih.
                  </p>
                </div>

                {/* Realtime Order Summary Card */}
                <div className="p-4 bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-neutral-400 block">
                      HARGA PAKET ({pkg.name})
                    </span>
                    <span className="font-serif text-sm font-medium">
                      Rp {basePrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-widest text-neutral-400 block">
                      TOTAL ESTIMASI
                    </span>
                    <span className="font-serif text-lg font-bold text-neutral-900">
                      Rp {totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Upgrade to Premium Banner if currently Essential */}
                {pkg.tier === 'essential' && (
                  <div className="p-4 bg-[#111111] text-white flex items-center justify-between">
                    <div>
                      <p className="font-serif text-sm uppercase tracking-wide">Upgrade ke Paket Premium</p>
                      <p className="text-[10px] text-neutral-300 font-light mt-0.5">
                        Dapatkan Animasi Premium, Love Story, dan RSVP gratis.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleUpgradeToPremium}
                      className="px-3 py-1.5 bg-white text-black text-[10px] uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors shrink-0 ml-3"
                    >
                      Upgrade (+Rp 100.000)
                    </button>
                  </div>
                )}

                {/* Group 1: Included Features in Package */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-700 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Termasuk dalam Paket {pkg.name} (Gratis)</span>
                  </div>
                  <div className="space-y-2">
                    {addons
                      .filter((a) => isIncludedAddon(a.id))
                      .map((addon) => (
                        <div
                          key={addon.id}
                          className="p-3 border border-emerald-200/80 bg-emerald-50/40 flex items-center justify-between select-none"
                        >
                          <div>
                            <p className="font-medium text-xs text-neutral-900">{addon.name}</p>
                            <p className="text-[10px] text-neutral-500 font-light">{addon.description}</p>
                          </div>
                          <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 border border-emerald-300 bg-white text-emerald-700 font-semibold rounded shrink-0 ml-3">
                            INCLUDED
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Group 2: Available Paid Add-ons */}
                <div className="space-y-3 pt-2">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-600 font-medium">
                    <span>Add-on Tambahan Tersedia</span>
                  </div>
                  <div className="space-y-2">
                    {addons
                      .filter((a) => isAvailableAddon(a.id) && !isIncludedAddon(a.id))
                      .map((addon) => {
                        const isSelected = invitation.activeAddonIds.includes(addon.id);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => {
                              const updatedAddons = isSelected
                                ? invitation.activeAddonIds.filter((id) => id !== addon.id)
                                : [...invitation.activeAddonIds, addon.id];

                              // Synchronize live preview section visibility
                              const updatedVisibility = { ...invitation.sectionVisibility };
                              if (addon.id === 'video-prewedding') {
                                updatedVisibility.video = !isSelected;
                              } else if (addon.id === 'love-story') {
                                updatedVisibility.story = !isSelected;
                              } else if (addon.id === 'rsvp-system') {
                                updatedVisibility.rsvp = !isSelected;
                              } else if (addon.id === 'extra-gallery') {
                                updatedVisibility.gallery = true;
                              }

                              let newCoverVideoUrl = invitation.coverVideoUrl;
                              if (addon.id === 'living-video-bg') {
                                if (!isSelected) {
                                  newCoverVideoUrl = invitation.coverVideoUrl || '/videos/elodie-bg.mp4';
                                } else {
                                  if (currentTemplate.archetype !== 'cinematic-motion') {
                                    newCoverVideoUrl = undefined;
                                  }
                                }
                              }

                              // Auto-scroll preview to the corresponding section when activating
                              if (!isSelected) {
                                const addonTargetMap: Record<string, string> = {
                                  'living-video-bg': 'cover',
                                  'love-story': 'story',
                                  'video-prewedding': 'video',
                                  'extra-gallery': 'gallery',
                                  'rsvp-system': 'rsvp',
                                };
                                const target = addonTargetMap[addon.id];
                                if (target) {
                                  if (target === 'cover') {
                                    setPreviewSection('cover');
                                    setAddonScrollTarget('cover');
                                  } else {
                                    setPreviewSection('inside');
                                    setAddonScrollTarget(target);
                                  }
                                }
                              }

                              updateInvitationState({
                                ...invitation,
                                activeAddonIds: updatedAddons,
                                sectionVisibility: updatedVisibility,
                                coverVideoUrl: newCoverVideoUrl,
                              });
                            }}
                            className={`p-3.5 border cursor-pointer flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-neutral-50 border-black shadow-sm'
                                : 'border-neutral-200 hover:border-neutral-400 bg-white'
                            }`}
                          >
                            <div>
                              <p className="font-medium text-xs text-neutral-900">{addon.name}</p>
                              <p className="text-[10px] text-neutral-400 font-light">{addon.description}</p>
                            </div>
                            <div className="text-right shrink-0 ml-3">
                              <span className="font-serif text-xs font-medium text-neutral-900 block">
                                +Rp {addon.defaultPrice.toLocaleString('id-ID')}
                              </span>
                              <span
                                className={`text-[9px] uppercase tracking-wider font-semibold ${
                                  isSelected ? 'text-black' : 'text-neutral-400'
                                }`}
                              >
                                {isSelected ? '✓ Aktif' : '+ Tambah'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Group 3: Locked Add-ons (Requires Upgrade) */}
                {pkg.tier === 'essential' && pkg.lockedAddonIds.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                      <Lock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Fitur Eksklusif Paket Premium</span>
                    </div>
                    <div className="space-y-2">
                      {addons
                        .filter((a) => isLockedAddon(a.id))
                        .map((addon) => (
                          <div
                            key={addon.id}
                            className="p-3.5 border border-neutral-200 bg-neutral-50/70 opacity-90 flex items-center justify-between"
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <Lock className="w-3 h-3 text-neutral-400" />
                                <p className="font-medium text-xs text-neutral-700">{addon.name}</p>
                              </div>
                              <p className="text-[10px] text-neutral-400 font-light mt-0.5">{addon.description}</p>
                            </div>
                            <div className="text-right shrink-0 ml-3">
                              <button
                                type="button"
                                onClick={handleUpgradeToPremium}
                                className="px-2.5 py-1 text-[9px] uppercase tracking-widest border border-neutral-900 bg-neutral-900 text-white hover:bg-black transition-colors"
                              >
                                Upgrade
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Live Preview with Device Frame Switcher */}
        <div className="flex-1 min-h-0 bg-[#F5F2EB] flex flex-col overflow-hidden w-full h-full">
          {/* Top Frame Control Bar */}
          <div className="h-12 bg-white/95 backdrop-blur-sm border-b border-[#E5E0D7] px-3 sm:px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[10px] uppercase tracking-ultra text-[#8C827A] font-medium hidden md:inline">
                PREVIEW SEBELUM BAYAR
              </span>

              {/* Cover vs Isi Undangan Segmented Switcher */}
              <div className="flex items-center bg-[#ECE7DE] p-0.5 rounded-sm border border-[#DDD7CE]">
                <button
                  type="button"
                  onClick={() => setPreviewSection('cover')}
                  className={`px-3 py-1 text-[10px] uppercase tracking-widest font-medium transition-all ${
                    previewSection === 'cover'
                      ? 'bg-white text-black shadow-xs font-semibold'
                      : 'text-[#6E655E] hover:text-black'
                  }`}
                >
                  Cover
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewSection('inside')}
                  className={`px-3 py-1 text-[10px] uppercase tracking-widest font-medium transition-all ${
                    previewSection === 'inside'
                      ? 'bg-white text-black shadow-xs font-semibold'
                      : 'text-[#6E655E] hover:text-black'
                  }`}
                >
                  Isi Undangan
                </button>
              </div>
            </div>

            {/* Quick Edit button for mobile */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setMobileSheetOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider bg-white border border-[#DDD7CE] text-neutral-800 rounded font-semibold shadow-2xs hover:bg-neutral-50 transition-colors"
              >
                <span>✏️ Buka Form</span>
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 border transition-all ${
                  previewMode === 'mobile' ? 'bg-[#2A2522] text-white border-[#2A2522] shadow-xs' : 'border-[#DDD7CE] text-[#5C554E] bg-white hover:border-[#A8A196]'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 border transition-all ${
                  previewMode === 'desktop' ? 'bg-[#2A2522] text-white border-[#2A2522] shadow-xs' : 'border-[#DDD7CE] text-[#5C554E] bg-white hover:border-[#A8A196]'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile Viewport: Direct full-width fluid view on mobile screens (< lg) */}
          <div className="lg:hidden flex-1 min-h-0 w-full h-full relative overflow-hidden bg-[#FAF8F5] flex flex-col pb-16">
            <div
              id="device-viewport-mobile"
              data-device-viewport="true"
              className="w-full h-full overflow-y-auto overflow-x-hidden relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              <InvitationEngine
                key={`${invitation.id}-${invitation.templateId}-mobile`}
                invitation={invitation}
                guestName={hasGuestPersonalization ? 'Bapak Budi Santoso' : undefined}
                isPreview={true}
                forceMobile={true}
                isOpenControlled={previewSection === 'inside'}
                onOpenStateChange={(open) => setPreviewSection(open ? 'inside' : 'cover')}
                activeSectionTarget={addonScrollTarget || activeTab}
              />
            </div>
          </div>

          {/* Desktop Viewport: Scaled Device Frame on desktop screens (>= lg) */}
          <div className="hidden lg:flex flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:py-6 flex-col items-center">
            <div className="my-auto py-2 flex flex-col items-center scale-[0.88] 2xl:scale-95 origin-center transition-transform">
              {previewMode === 'mobile' ? (
                <DeviceFrame isDark={invitation.colorPreset === 'nocturne-black'}>
                  <InvitationEngine
                    key={`${invitation.id}-${invitation.templateId}-desktop`}
                    invitation={invitation}
                    guestName={hasGuestPersonalization ? 'Bapak Budi Santoso' : undefined}
                    isPreview={true}
                    forceMobile={true}
                    isOpenControlled={previewSection === 'inside'}
                    onOpenStateChange={(open) => setPreviewSection(open ? 'inside' : 'cover')}
                    activeSectionTarget={addonScrollTarget || activeTab}
                  />
                </DeviceFrame>
              ) : (
                <div
                  className={`w-full max-w-4xl h-[720px] rounded-lg overflow-y-auto shadow-2xl border relative [transform:translateZ(0)] ${
                    invitation.colorPreset === 'nocturne-black' ? 'bg-[#0C0C0C] border-neutral-800' : 'bg-[#F8F7F3] border-neutral-300'
                  }`}
                >
                  <InvitationEngine
                    key={`${invitation.id}-${invitation.templateId}-wide`}
                    invitation={invitation}
                    guestName={hasGuestPersonalization ? 'Bapak Budi Santoso' : undefined}
                    isPreview={true}
                    forceMobile={false}
                    isOpenControlled={previewSection === 'inside'}
                    onOpenStateChange={(open) => setPreviewSection(open ? 'inside' : 'cover')}
                    activeSectionTarget={addonScrollTarget || activeTab}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Dock (Always accessible at bottom of screen on mobile) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-neutral-200 py-1.5 px-2 flex items-center justify-around text-center shadow-[0_-4px_25px_rgba(0,0,0,0.08)]">
        {[
          { id: 'design', label: 'Desain', icon: Settings },
          { id: 'couple', label: 'Mempelai', icon: Heart },
          { id: 'events', label: 'Acara', icon: Calendar },
          { id: 'gallery', label: 'Galeri', icon: ImageIcon },
          { id: 'gifts', label: 'Amplop', icon: Gift },
          { id: 'addons', label: 'Fitur', icon: Layers },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && mobileSheetOpen;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                handleTabChange(item.id as any);
                setMobileSheetOpen(true);
              }}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg transition-all ${
                isActive
                  ? 'text-black font-semibold scale-105'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              <Icon className={`w-4 h-4 ${item.id === 'addons' ? 'text-amber-500' : ''}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Final Billing Editorial Modal */}
      <FinalBillingModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
        onConfirm={handleConfirmPublishAndPay}
        invitation={invitation}
        pkg={pkg}
        basePrice={basePrice}
        paidAddons={selectedPaidAddons}
        totalAmount={totalAmount}
        isProcessing={isCreatingOrder}
      />

      {/* Interactive Image Cropper Modal */}
      {cropModalState && (
        <ImageCropperModal
          isOpen={cropModalState.isOpen}
          onClose={() => setCropModalState(null)}
          imageUrl={cropModalState.imageUrl}
          initialAspectRatio={cropModalState.ratio}
          title={cropModalState.title}
          onCropComplete={handleCropSave}
        />
      )}
    </div>
  );
}
