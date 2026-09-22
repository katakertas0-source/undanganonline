'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MinimalNav } from '@/components/marketing/MinimalNav';
import { MinimalFooter } from '@/components/marketing/MinimalFooter';
import {
  getAllInvitations,
  getGuestsForInvitation,
  getGuestsForInvitationAsync,
  getRsvpsForInvitation,
  getRsvpsForInvitationAsync,
  getWishesForInvitation,
  getWishesForInvitationAsync,
  addGuestLink,
  addGuestLinkAsync,
  deleteWish,
  deleteWishAsync,
  toggleWishApproval,
  toggleWishApprovalAsync,
  saveInvitation,
  getCurrentSession,
} from '@/lib/store';
import { Invitation, GuestLink, RsvpEntry, WishEntry, GalleryItem } from '@/types';
import {
  Eye,
  Edit,
  Share2,
  Users,
  MessageSquare,
  Gift,
  Check,
  Copy,
  Plus,
  Trash2,
  ExternalLink,
  Download,
  Upload,
  QrCode,
  Heart,
  Camera,
  CheckCircle2,
} from 'lucide-react';
import { uploadAssetToSupabase } from '@/lib/supabase/storage';
import { ImportGuestsModal } from '@/components/dashboard/ImportGuestsModal';
import { exportGuestsToCsv, exportRsvpsToCsv } from '@/lib/export-csv';
import {
  WhatsAppTemplateModal,
  WA_PRESETS,
  formatWhatsAppMessage,
} from '@/components/dashboard/WhatsAppTemplateModal';

function DashboardContent() {
  const searchParams = useSearchParams();
  const invitationIdParam = searchParams.get('id');

  const [mounted, setMounted] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'guests' | 'rsvps' | 'wishes' | 'post_event'>('overview');

  // Related data for selected invitation
  const [guests, setGuests] = useState<GuestLink[]>([]);
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
  const [wishes, setWishes] = useState<WishEntry[]>([]);

  // Add guest form
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestCategory, setNewGuestCategory] = useState<GuestLink['category']>('Umum');
  const [newGuestWhatsapp, setNewGuestWhatsapp] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);
  const [waTemplate, setWaTemplate] = useState<string>(WA_PRESETS.formal.template);

  // Post-Event / Memory Vault state
  const [postEventEnabled, setPostEventEnabled] = useState(false);
  const [thankYouInput, setThankYouInput] = useState('');
  const [docPhotos, setDocPhotos] = useState<GalleryItem[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSavingPostEvent, setIsSavingPostEvent] = useState(false);
  const [postEventSaveMessage, setPostEventSaveMessage] = useState<string | null>(null);

  const loadData = React.useCallback(() => {
    const list = getAllInvitations();
    setInvitations(list);
    setSelectedInvitation((prev) => {
      if (invitationIdParam) {
        const match = list.find((i) => i.id === invitationIdParam || i.slug === invitationIdParam);
        if (match) return match;
      }
      const session = getCurrentSession();
      if (session?.invitationId) {
        const match = list.find((i) => i.id === session.invitationId || i.slug === session.invitationId);
        if (match) return match;
      }
      if (!prev && list.length > 0) return list[0];
      if (prev) {
        return list.find((i) => i.id === prev.id) || list[0] || null;
      }
      return null;
    });
  }, [invitationIdParam]);

  useEffect(() => {
    setMounted(true);
    loadData();
    window.addEventListener('uo_store_updated', loadData);
    return () => window.removeEventListener('uo_store_updated', loadData);
  }, [loadData]);

  const selectedInvitationId = selectedInvitation?.id;
  useEffect(() => {
    if (selectedInvitationId) {
      setGuests(getGuestsForInvitation(selectedInvitationId));
      setRsvps(getRsvpsForInvitation(selectedInvitationId));
      setWishes(getWishesForInvitation(selectedInvitationId));

      getGuestsForInvitationAsync(selectedInvitationId).then(setGuests);
      getRsvpsForInvitationAsync(selectedInvitationId).then(setRsvps);
      getWishesForInvitationAsync(selectedInvitationId).then(setWishes);
    }
  }, [selectedInvitationId]);

  const currentInv = selectedInvitation || (invitations.length > 0 ? invitations[0] : null);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const liveUrl = currentInv ? `${origin}/${currentInv.slug}` : '';

  // Load custom WhatsApp template from local storage per invitation
  useEffect(() => {
    if (currentInv?.id && typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(`uo_wa_template_${currentInv.id}`);
      if (saved) {
        setWaTemplate(saved);
      } else {
        setWaTemplate(WA_PRESETS.formal.template);
      }
    }
  }, [currentInv?.id]);

  // Synchronize Post-Event form with current invitation
  useEffect(() => {
    if (currentInv) {
      setPostEventEnabled(currentInv.status === 'EVENT_PASSED');
      setThankYouInput(currentInv.thankYouMessage || '');
      setDocPhotos(currentInv.documentationPhotos || []);
    }
  }, [currentInv?.id, currentInv?.status, currentInv?.thankYouMessage, currentInv?.documentationPhotos]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8F7F3] text-[#111111]">
        <MinimalNav />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-24 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-neutral-300 border-t-black rounded-full animate-spin mx-auto" />
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">Memuat Dashboard...</p>
          </div>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  if (invitations.length === 0 || !currentInv) {
    return (
      <div className="min-h-screen bg-[#F8F7F3] text-[#111111]">
        <MinimalNav />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="font-serif text-3xl uppercase tracking-wide">Belum Ada Undangan</h2>
          <p className="text-xs text-neutral-400 mt-2">Mulai rancang undangan digital Anda hari ini.</p>
          <Link
            href="/create"
            className="inline-block mt-6 px-6 py-3 text-xs uppercase tracking-widest bg-black text-white"
          >
            Buat Undangan Baru
          </Link>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentInv) return;

    setIsUploadingPhoto(true);
    try {
      const res = await uploadAssetToSupabase(file, 'gallery');
      if (res?.publicUrl) {
        const newPhoto: GalleryItem = {
          id: `doc-${Date.now()}`,
          imageUrl: res.publicUrl,
          caption: newPhotoCaption.trim() || undefined,
          orderIndex: docPhotos.length,
          category: 'documentation',
        };
        const updated = [...docPhotos, newPhoto];
        setDocPhotos(updated);
        setNewPhotoCaption('');
      } else {
        alert('Gagal mengunggah foto ke storage. Silakan periksa koneksi Supabase Anda.');
      }
    } catch (err) {
      console.error('Failed to upload documentation photo:', err);
      alert('Gagal mengunggah foto. Pastikan format file sesuai.');
    } finally {
      setIsUploadingPhoto(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAddPhotoByUrl = () => {
    if (!newPhotoUrl.trim()) return;
    const newPhoto: GalleryItem = {
      id: `doc-${Date.now()}`,
      imageUrl: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || undefined,
      orderIndex: docPhotos.length,
      category: 'documentation',
    };
    setDocPhotos([...docPhotos, newPhoto]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
  };

  const handleDeleteDocPhoto = (id: string) => {
    setDocPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSavePostEvent = async () => {
    if (!currentInv) return;
    setIsSavingPostEvent(true);
    try {
      const updatedInv: Invitation = {
        ...currentInv,
        status: postEventEnabled ? 'EVENT_PASSED' : (currentInv.status === 'EVENT_PASSED' ? 'ACTIVE' : currentInv.status),
        thankYouMessage: thankYouInput.trim() || undefined,
        documentationPhotos: docPhotos,
      };
      saveInvitation(updatedInv);
      setSelectedInvitation(updatedInv);
      setInvitations((prev) => prev.map((i) => (i.id === updatedInv.id ? updatedInv : i)));
      setPostEventSaveMessage('Pengaturan mode pasca-acara & memory vault berhasil disimpan!');
      setTimeout(() => setPostEventSaveMessage(null), 3500);
    } catch (err) {
      console.error('Error saving post event:', err);
    } finally {
      setIsSavingPostEvent(false);
    }
  };

  const handleSaveWaTemplate = (newTemplate: string) => {
    setWaTemplate(newTemplate);
    if (currentInv?.id && typeof window !== 'undefined') {
      window.localStorage.setItem(`uo_wa_template_${currentInv.id}`, newTemplate);
    }
  };

  // Metrics
  const attendingRsvps = rsvps.filter((r) => r.status === 'ATTENDING');
  const totalPaxAttending = attendingRsvps.reduce((sum, r) => sum + r.pax, 0);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const name = newGuestName;
    const cat = newGuestCategory;
    const wa = newGuestWhatsapp;
    setNewGuestName('');
    setNewGuestWhatsapp('');

    const newGuest = await addGuestLinkAsync(currentInv.id, name, cat, wa);
    setGuests((prev) => [newGuest, ...prev.filter((g) => g.id !== newGuest.id)]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#111111]">
      <MinimalNav />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-200 pb-8 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-ultra text-neutral-400 mb-1">
              <span>CUSTOMER HUB</span>
              <span>·</span>
              <span className="font-medium text-black">MANAGEMENT SUITE</span>
              <span>·</span>
              <Link href="/admin" className="text-amber-800 hover:text-black font-medium underline">
                Portal Master Admin →
              </Link>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl uppercase tracking-wide">
              {currentInv.title}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] uppercase tracking-widest font-medium border ${
                  currentInv.status === 'EVENT_PASSED'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                    : currentInv.status === 'ACTIVE'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                    : 'border-amber-500 bg-amber-50 text-amber-700'
                }`}
              >
                ● {currentInv.status === 'EVENT_PASSED' ? 'PASCA-ACARA' : currentInv.status}
              </span>
              <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 border border-neutral-300 bg-white font-medium text-neutral-800">
                {currentInv.packageId === 'pkg-premium' ? 'PAKET PREMIUM' : 'PAKET ESSENTIAL'}
              </span>
              <span className="text-xs text-neutral-400">
                Slug: <code>/{currentInv.slug}</code>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('post_event')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest border transition-colors ${
                currentInv.status === 'EVENT_PASSED'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                  : 'border-neutral-300 bg-white hover:border-black'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-indigo-600" />
              <span>{currentInv.status === 'EVENT_PASSED' ? 'Pasca-Acara (Aktif)' : 'Mode Pasca-Acara'}</span>
            </button>

            <Link
              href={`/checkin/${currentInv.id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest border border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-700" />
              <span>Meja Resepsi (Check-In)</span>
            </Link>

            <Link
              href={`/builder/${currentInv.id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest border border-neutral-300 bg-white hover:border-black transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Builder</span>
            </Link>

            <a
              href={`/${currentInv.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Live</span>
            </a>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-6 border border-neutral-200 bg-white">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-[10px] uppercase tracking-widest">TOTAL VIEWS</span>
              <Eye className="w-4 h-4" />
            </div>
            <p className="font-serif text-3xl sm:text-4xl font-light">
              {currentInv.viewsCount.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="p-6 border border-neutral-200 bg-white">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-[10px] uppercase tracking-widest">RSVP HADIR</span>
              <Users className="w-4 h-4" />
            </div>
            <p className="font-serif text-3xl sm:text-4xl font-light">
              {totalPaxAttending}{' '}
              <span className="text-xs font-sans text-neutral-400 font-normal">
                ({attendingRsvps.length} konfirmasi)
              </span>
            </p>
          </div>

          <div className="p-6 border border-neutral-200 bg-white">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-[10px] uppercase tracking-widest">UCAPAN & DOA</span>
              <MessageSquare className="w-4 h-4" />
            </div>
            <p className="font-serif text-3xl sm:text-4xl font-light">
              {wishes.length}
            </p>
          </div>

          <div className="p-6 border border-neutral-200 bg-white">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-[10px] uppercase tracking-widest">TAMU TERDAFTAR</span>
              <Users className="w-4 h-4" />
            </div>
            <p className="font-serif text-3xl sm:text-4xl font-light">
              {guests.length}
            </p>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-neutral-200 mb-8 overflow-x-auto text-xs uppercase tracking-widest">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 border-b-2 font-medium transition-all ${
              activeTab === 'overview'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Overview & Share
          </button>

          <button
            onClick={() => setActiveTab('guests')}
            className={`px-6 py-3 border-b-2 font-medium transition-all ${
              activeTab === 'guests'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Personalisasi Tamu ({guests.length})
          </button>

          <button
            onClick={() => setActiveTab('rsvps')}
            className={`px-6 py-3 border-b-2 font-medium transition-all ${
              activeTab === 'rsvps'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Data Kehadiran RSVP ({rsvps.length})
          </button>

          <button
            onClick={() => setActiveTab('wishes')}
            className={`px-6 py-3 border-b-2 font-medium transition-all ${
              activeTab === 'wishes'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Moderasi Ucapan ({wishes.length})
          </button>

          <button
            onClick={() => setActiveTab('post_event')}
            className={`px-6 py-3 border-b-2 font-medium transition-all flex items-center gap-2 ${
              activeTab === 'post_event'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-neutral-500" />
            <span>Pasca-Acara & Memory Vault</span>
            {currentInv.status === 'EVENT_PASSED' && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            )}
          </button>
        </div>

        {/* Tab 1: Overview & Share */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-7 bg-white border border-neutral-200 p-8 space-y-6">
              <h3 className="font-serif text-xl uppercase tracking-wide">
                Link Publik Undangan
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Gunakan link publik ini untuk dibagikan secara umum ke grup WhatsApp, media sosial, atau story.
              </p>

              <div className="p-4 bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                <span className="font-mono text-xs truncate select-all">{liveUrl}</span>
                <button
                  onClick={() => copyToClipboard(liveUrl, 'main-link')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-widest border border-neutral-300 bg-white hover:border-black"
                >
                  {copiedLink === 'main-link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink === 'main-link' ? 'Tersalin!' : 'Salin'}</span>
                </button>
              </div>

              {/* WhatsApp Share Text Template */}
              <div className="pt-4 border-t border-neutral-200 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">
                  TEMPLATES PESAN WHATSAPP SIAP SEBAR
                </span>
                <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 font-light leading-relaxed font-mono whitespace-pre-line">
                  {`Assalamu'alaikum Wr. Wb. / Salam Sejahtera,\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri pernikahan kami:\n\n${currentInv.couple.groomNickname} & ${currentInv.couple.brideNickname}\n\nInfo lengkap & konfirmasi kehadiran:\n${liveUrl}\n\nMerupakan suatu kehormatan bagi kami atas kehadiran dan doa restu Anda.\n\nTerima kasih.`}
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `Assalamu'alaikum Wr. Wb. / Salam Sejahtera,\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri pernikahan kami:\n\n${currentInv.couple.groomNickname} & ${currentInv.couple.brideNickname}\n\nInfo lengkap & konfirmasi kehadiran:\n${liveUrl}\n\nMerupakan suatu kehormatan bagi kami atas kehadiran dan doa restu Anda.\n\nTerima kasih.`,
                      'wa-template'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors"
                >
                  {copiedLink === 'wa-template' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Salin Teks WhatsApp Lengkap</span>
                </button>
              </div>
            </div>

            <div className="md:col-span-5 bg-white border border-neutral-200 p-8 text-center space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">
                QR CODE RESMI UNDANGAN
              </span>
              <div className="w-44 h-44 mx-auto p-3 border border-neutral-300 bg-white flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(liveUrl)}`}
                  alt="QR Code Undangan"
                  className="w-full h-full"
                />
              </div>
              <p className="text-[11px] text-neutral-500 font-light max-w-xs mx-auto">
                Cetak QR code ini untuk kartu souvenir fisik atau meja registrasi resepsi.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Guest Personalization */}
        {activeTab === 'guests' && (
          <div className="space-y-6">
            {/* Action Bar: Import & Export */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white border border-neutral-200 shadow-sm">
              <div>
                <h3 className="font-serif text-lg uppercase tracking-wide">
                  Manajemen Tamu Undangan ({guests.length})
                </h3>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Buat link personal dan bagikan undangan via WhatsApp ke masing-masing tamu.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsWaModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-widest border border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors font-medium"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Format Pesan WA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-widest border border-neutral-300 bg-white hover:border-black transition-colors font-medium"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Import Massal</span>
                </button>

                <button
                  type="button"
                  onClick={() => exportGuestsToCsv(currentInv.title, currentInv.slug, guests, rsvps, origin)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Excel / CSV</span>
                </button>
              </div>
            </div>

            {/* Add Guest Form */}
            <div className="p-6 border border-neutral-200 bg-white shadow-sm">
              <h3 className="font-serif text-lg uppercase tracking-wide mb-4">
                Tambah Tamu Baru (Generate Personal Link)
              </h3>
              <form onSubmit={handleAddGuest} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-5">
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Nama Tamu
                  </label>
                  <input
                    type="text"
                    required
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    placeholder="Contoh: Bapak Hendrawan & Partner"
                    className="w-full px-3 py-2 text-xs border border-neutral-300"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newGuestCategory}
                    onChange={(e) => setNewGuestCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Teman">Teman</option>
                    <option value="Rekan Kerja">Rekan Kerja</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Buat Link Personal</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Guest Table */}
            <div className="bg-white border border-neutral-200 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-[10px] uppercase tracking-wider text-neutral-400">
                    <th className="p-4">NAMA TAMU</th>
                    <th className="p-4">KATEGORI</th>
                    <th className="p-4">PERSONAL LINK</th>
                    <th className="p-4 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {guests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-neutral-400 italic">
                        Belum ada tamu khusus yang ditambahkan.
                      </td>
                    </tr>
                  ) : (
                    guests.map((g) => {
                      const guestUrl = `${liveUrl}/${g.guestSlug}`;
                      const formattedMessage = formatWhatsAppMessage(waTemplate, g, currentInv, origin);
                      const targetWaNumber = g.whatsappNumber
                        ? g.whatsappNumber.replace(/[^0-9]/g, '').replace(/^08/, '628')
                        : '';
                      const waUrl = targetWaNumber
                        ? `https://wa.me/${targetWaNumber}?text=${encodeURIComponent(formattedMessage)}`
                        : `https://wa.me/?text=${encodeURIComponent(formattedMessage)}`;

                      return (
                        <tr key={g.id} className="hover:bg-neutral-50/50">
                          <td className="p-4 font-medium text-neutral-900">
                            <span className="block">{g.guestName}</span>
                            {g.whatsappNumber && (
                              <span className="text-[10px] text-neutral-400 font-mono font-normal">
                                {g.whatsappNumber}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider border border-neutral-200 rounded">
                              {g.category}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[11px] text-neutral-500 max-w-xs truncate">
                            {guestUrl}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => copyToClipboard(guestUrl, g.id)}
                              className="px-2.5 py-1 border border-neutral-300 hover:border-black text-[10px] uppercase tracking-wider"
                            >
                              {copiedLink === g.id ? 'Tersalin' : 'Salin Link'}
                            </button>
                            <button
                              onClick={() => copyToClipboard(formattedMessage, `msg-${g.id}`)}
                              className="px-2.5 py-1 border border-neutral-300 hover:border-black text-[10px] uppercase tracking-wider"
                              title="Salin isi teks WhatsApp lengkap"
                            >
                              {copiedLink === `msg-${g.id}` ? 'Tersalin!' : 'Salin Teks WA'}
                            </button>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] uppercase tracking-wider inline-flex items-center gap-1 font-medium"
                            >
                              <span>Kirim WA</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: RSVPs */}
        {activeTab === 'rsvps' && (
          <div className="bg-white border border-neutral-200 shadow-sm">
            {/* RSVP Header & Export */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-neutral-200">
              <div>
                <h3 className="font-serif text-lg uppercase tracking-wide">
                  Konfirmasi Kehadiran Tamu ({rsvps.length})
                </h3>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Rekapitulasi status kehadiran dan porsi tamu untuk katering & WO.
                </p>
              </div>
              <button
                type="button"
                onClick={() => exportRsvpsToCsv(currentInv.title, rsvps)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-widest border border-neutral-300 bg-white hover:border-black transition-colors font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Rekap RSVP (CSV)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-[10px] uppercase tracking-wider text-neutral-400">
                  <th className="p-4">NAMA TAMU</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">JUMLAH (PAX)</th>
                  <th className="p-4">CATATAN</th>
                  <th className="p-4 text-right">WAKTU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rsvps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-400 italic">
                      Belum ada konfirmasi kehadiran dari tamu.
                    </td>
                  </tr>
                ) : (
                  rsvps.map((r) => (
                    <tr key={r.id} className="hover:bg-neutral-50/50">
                      <td className="p-4 font-medium text-neutral-900">{r.guestName}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded ${
                            r.status === 'ATTENDING'
                              ? 'bg-emerald-50 text-emerald-700'
                              : r.status === 'NOT_ATTENDING'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {r.status === 'ATTENDING' ? 'Hadir' : r.status === 'NOT_ATTENDING' ? 'Tidak Hadir' : 'Ragu-ragu'}
                        </span>
                      </td>
                      <td className="p-4">{r.pax} Orang</td>
                      <td className="p-4 text-neutral-500 max-w-sm">{r.notes || '—'}</td>
                      <td className="p-4 text-right text-neutral-400">
                        {new Date(r.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

        {/* Tab 4: Wishes Moderation */}
        {activeTab === 'wishes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg uppercase tracking-wide">
                Daftar Ucapan & Doa Masuk
              </h3>
              <span className="text-xs text-neutral-400">Total: {wishes.length} ucapan</span>
            </div>

            <div className="space-y-3">
              {wishes.length === 0 ? (
                <div className="p-8 text-center bg-white border border-neutral-200 text-neutral-400 italic">
                  Belum ada ucapan dan doa yang masuk.
                </div>
              ) : (
                wishes.map((w) => (
                  <div
                    key={w.id}
                    className="p-5 border border-neutral-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-medium text-sm text-neutral-900">
                          {w.senderName}
                        </span>
                        {w.relationship && (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 border border-neutral-200 text-neutral-500 rounded">
                            {w.relationship}
                          </span>
                        )}
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${
                            w.isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-400'
                          }`}
                        >
                          {w.isApproved ? 'Tampil' : 'Disembunyikan'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 font-light">{w.message}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={async () => {
                          toggleWishApproval(currentInv.id, w.id);
                          setWishes((prev) =>
                            prev.map((item) =>
                              item.id === w.id ? { ...item, isApproved: !w.isApproved } : item
                            )
                          );
                          await toggleWishApprovalAsync(currentInv.id, w.id, !w.isApproved);
                        }}
                        className="px-3 py-1.5 text-[11px] uppercase tracking-wider border border-neutral-300 hover:border-black"
                      >
                        {w.isApproved ? 'Sembunyikan' : 'Tampilkan'}
                      </button>
                      <button
                        onClick={async () => {
                          deleteWish(currentInv.id, w.id);
                          setWishes((prev) => prev.filter((item) => item.id !== w.id));
                          await deleteWishAsync(currentInv.id, w.id);
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-600"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Mode Pasca-Acara & Memory Vault */}
        {activeTab === 'post_event' && (
          <div className="space-y-8 animate-fade-in">
            {/* Status & Banner Card */}
            <div className="p-6 sm:p-8 bg-white border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-800 text-[10px] uppercase tracking-widest font-semibold">
                  <Camera className="w-3 h-3 text-indigo-600" />
                  <span>MODUL PASCA-ACARA & MEMORY VAULT</span>
                </div>
                <h3 className="font-serif text-2xl uppercase tracking-wide">
                  Status Mode Pasca-Acara
                </h3>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  Ketika mode ini diaktifkan, undangan otomatis beralih ke mode kenangan: formulir RSVP dikunci dan digantikan dengan <strong>Kartu Ucapan Terima Kasih</strong> resmi dari kedua mempelai, countdown diubah menjadi pengingat hari bahagia yang telah berlangsung khidmat, serta galeri <strong>Foto Dokumentasi Hari-H (Memory Vault)</strong> ditampilkan untuk dinikmati seluruh tamu.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setPostEventEnabled(!postEventEnabled)}
                  className={`px-5 py-3 text-xs uppercase tracking-widest font-medium border transition-all flex items-center gap-2 ${
                    postEventEnabled
                      ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 shadow-sm'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${postEventEnabled ? 'bg-white animate-pulse' : 'bg-neutral-300'}`} />
                  <span>{postEventEnabled ? 'Mode Pasca-Acara: AKTIF' : 'Mode Pasca-Acara: NON-AKTIF'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSavePostEvent}
                  disabled={isSavingPostEvent}
                  className="px-6 py-3 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                  {isSavingPostEvent ? (
                    <span>Menyimpan...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {postEventSaveMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{postEventSaveMessage}</span>
              </div>
            )}

            {/* Content Customization Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Thank You Letter Customizer */}
              <div className="lg:col-span-6 bg-white border border-neutral-200 p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="font-serif text-lg uppercase tracking-wide">
                    Kartu Ucapan Terima Kasih
                  </h4>
                  <p className="text-xs text-neutral-400 font-light mt-1">
                    Tulis pesan ungkapan rasa terima kasih dan syukur kepada keluarga serta para tamu undangan yang telah hadir atau mendoakan.
                  </p>
                </div>

                {/* Preset Chips */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                    PILIH DRAF CONTOH KALIMAT:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setThankYouInput(
                          "Rasa syukur yang tak terhingga kami haturkan atas kehadiran, doa restu, dan cinta kasih yang tulus dari segenap keluarga, sahabat, dan rekan sekalian.\n\nMomen bahagia ini menjadi semakin bermakna dan terpatri indah berkat kehadiran serta doa tulus Anda semua."
                        )
                      }
                      className="px-3 py-1.5 text-[11px] border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 transition-colors"
                    >
                      Formal & Hangat
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setThankYouInput(
                          "Alhamdulillah, puji syukur kami panjatkan ke hadirat Allah SWT atas terselenggaranya hari bahagia kami dengan khidmat dan lancar.\n\nJazakumullah khairan katsiran atas doa restu, ucapan, dan kehadiran Bapak/Ibu/Saudara/i sekalian. Semoga keberkahan senantiasa melimpah kepada kita semua."
                        )
                      }
                      className="px-3 py-1.5 text-[11px] border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 transition-colors"
                    >
                      Islami / Khidmat
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setThankYouInput(
                          "Terima kasih dari lubuk hati terdalam telah merayakan hari terindah ini bersama kami. Tawa, doa, dan kehadiran kalian telah menjadikan malam tersebut momen magis yang tak terlupakan selamanya."
                        )
                      }
                      className="px-3 py-1.5 text-[11px] border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 transition-colors"
                    >
                      Modern Editorial
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-neutral-400 mb-2">
                    Isi Pesan Terima Kasih
                  </label>
                  <textarea
                    rows={6}
                    value={thankYouInput}
                    onChange={(e) => setThankYouInput(e.target.value)}
                    placeholder="Tuliskan pesan terima kasih personal Anda di sini..."
                    className="w-full p-4 text-xs sm:text-sm border border-neutral-300 outline-none resize-none focus:border-black leading-relaxed font-sans"
                  />
                </div>

                {/* Live Preview Card */}
                <div className="pt-4 border-t border-neutral-200">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-3 font-medium">
                    PRATINJAU KARTU TERIMA KASIH DI UNDANGAN:
                  </span>
                  <div className="p-6 bg-[#FDFBF7] border border-neutral-200 text-center rounded-sm space-y-3">
                    <Heart className="w-5 h-5 text-rose-500 mx-auto fill-rose-500/20" />
                    <p className="font-serif text-lg uppercase tracking-wide text-neutral-900">
                      Terima Kasih Atas Doa & Restu
                    </p>
                    <p className="text-xs text-neutral-600 font-light leading-relaxed whitespace-pre-line">
                      {thankYouInput ||
                        'Rasa syukur yang tak terhingga kami haturkan atas kehadiran, doa restu, dan cinta kasih yang tulus dari keluarga, sahabat, dan kerabat sekalian.'}
                    </p>
                    <div className="pt-2 border-t border-neutral-200/60">
                      <p className="font-serif text-sm uppercase tracking-widest font-medium">
                        {currentInv.couple.groomNickname} & {currentInv.couple.brideNickname}
                      </p>
                      <p className="text-[9px] uppercase tracking-widest text-neutral-400 mt-0.5">
                        DENGAN RASA SYUKUR & CINTA
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Documentation Photos (Memory Vault) */}
              <div className="lg:col-span-6 bg-white border border-neutral-200 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-lg uppercase tracking-wide">
                      Dokumentasi Hari-H (Memory Vault)
                    </h4>
                    <p className="text-xs text-neutral-400 font-light mt-1">
                      Unggah foto-foto terbaik resepsi, akad/pemberkatan, atau momen berkesan bersama tamu ({docPhotos.length} foto).
                    </p>
                  </div>
                </div>

                {/* Upload or Add Form */}
                <div className="p-4 border border-dashed border-neutral-300 bg-neutral-50/50 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 cursor-pointer transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingPhoto ? 'Mengunggah...' : 'Upload dari Device'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingPhoto}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-neutral-400">atau masukkan URL langsung di bawah:</span>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="url"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="https://example.com/foto-hari-h.jpg"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 bg-white outline-none focus:border-black"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPhotoCaption}
                        onChange={(e) => setNewPhotoCaption(e.target.value)}
                        placeholder="Keterangan foto (opsional), cth: Akad Nikah Khidmat"
                        className="flex-1 px-3 py-2 text-xs border border-neutral-300 bg-white outline-none focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={handleAddPhotoByUrl}
                        disabled={!newPhotoUrl.trim()}
                        className="px-4 py-2 text-xs uppercase tracking-widest bg-neutral-800 text-white hover:bg-black disabled:opacity-40 transition-colors"
                      >
                        Tambah
                      </button>
                    </div>
                  </div>
                </div>

                {/* Uploaded Photos Grid */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                    DAFTAR FOTO DOKUMENTASI TERUNGGAH ({docPhotos.length}):
                  </span>

                  {docPhotos.length === 0 ? (
                    <div className="p-8 text-center border border-neutral-200 bg-neutral-50/50 rounded-sm">
                      <Camera className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                      <p className="text-xs text-neutral-500 font-medium">Belum ada foto dokumentasi hari-H</p>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Unggah foto momen resepsi atau akad untuk dinikmati para tamu setelah acara usai.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto p-1">
                      {docPhotos.map((photo, idx) => (
                        <div
                          key={photo.id || idx}
                          className="group relative border border-neutral-200 bg-white overflow-hidden shadow-xs"
                        >
                          <div className="aspect-[4/5] bg-neutral-100 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo.imageUrl}
                              alt={photo.caption || `Foto ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteDocPhoto(photo.id)}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Hapus foto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {photo.caption && (
                            <div className="p-2 border-t border-neutral-100">
                              <p className="text-[11px] text-neutral-700 truncate font-light">
                                {photo.caption}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                  <a
                    href={`/${currentInv.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-600 hover:text-black"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka Halaman Live Undangan</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleSavePostEvent}
                    disabled={isSavingPostEvent}
                    className="px-6 py-2.5 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors"
                  >
                    {isSavingPostEvent ? 'Menyimpan...' : 'Simpan Semua'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Import Guests Modal */}
      <ImportGuestsModal
        isOpen={isImportModalOpen}
        invitationId={currentInv.id}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={() => {
          getGuestsForInvitationAsync(currentInv.id).then(setGuests);
        }}
      />

      {/* WhatsApp Template Modal */}
      <WhatsAppTemplateModal
        isOpen={isWaModalOpen}
        onClose={() => setIsWaModalOpen(false)}
        invitation={currentInv}
        currentTemplate={waTemplate}
        onSaveTemplate={handleSaveWaTemplate}
      />

      <MinimalFooter />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F7F3] flex items-center justify-center text-xs text-neutral-400">
          Memuat Dashboard Pengantin...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
