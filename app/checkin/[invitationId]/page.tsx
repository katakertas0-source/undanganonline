'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  getInvitationByIdAsync,
  getGuestsForInvitationAsync,
  toggleGuestCheckInAsync,
} from '@/lib/store';
import { Invitation, GuestLink } from '@/types';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  ArrowLeft,
  QrCode,
  ShieldCheck,
  RefreshCw,
  UserCheck,
  UserX,
  Camera,
} from 'lucide-react';
import { QrCameraScannerModal } from '@/components/checkin/QrCameraScannerModal';

export default function CheckinPage({
  params,
}: {
  params: Promise<{ invitationId: string }>;
}) {
  const { invitationId } = use(params);

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [guests, setGuests] = useState<GuestLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CHECKED_IN' | 'PENDING'>('ALL');
  const [lastCheckedInGuest, setLastCheckedInGuest] = useState<string | null>(null);
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const inv = await getInvitationByIdAsync(invitationId);
      if (inv) setInvitation(inv);
      const guestList = await getGuestsForInvitationAsync(invitationId);
      setGuests(guestList);
    } catch (err) {
      console.error('Error loading check-in data:', err);
    } finally {
      setLoading(false);
    }
  }, [invitationId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleCheckin = async (guest: GuestLink) => {
    const nextState = !guest.hasOpened;
    // Optimistic UI update
    setGuests((prev) =>
      prev.map((g) => (g.id === guest.id ? { ...g, hasOpened: nextState } : g))
    );

    if (nextState) {
      setLastCheckedInGuest(guest.guestName);
      setTimeout(() => setLastCheckedInGuest(null), 4000);
    }

    await toggleGuestCheckInAsync(invitationId, guest.id, nextState);
  };

  // Process QR from live camera scanner
  const handleProcessQrFromCamera = (payloadStr: string) => {
    try {
      let guestNameQuery = payloadStr;
      if (payloadStr.startsWith('{')) {
        const parsed = JSON.parse(payloadStr);
        if (parsed.guest) guestNameQuery = parsed.guest;
      }

      const match = guests.find(
        (g) =>
          g.guestName.toLowerCase().trim() === guestNameQuery.toLowerCase().trim() ||
          g.guestSlug.toLowerCase() === guestNameQuery.toLowerCase()
      );

      if (match) {
        if (!match.hasOpened) {
          handleToggleCheckin(match);
        }
        return {
          success: true,
          guestName: match.guestName,
          category: match.category,
        };
      } else {
        return {
          success: false,
          message: `Tamu "${guestNameQuery}" tidak terdaftar di undangan ini.`,
        };
      }
    } catch {
      return {
        success: false,
        message: 'Format QR Code tidak valid.',
      };
    }
  };

  // Quick check-in from manual input
  const handleProcessQrPayload = (payloadStr: string) => {
    try {
      let guestNameQuery = payloadStr;
      if (payloadStr.startsWith('{')) {
        const parsed = JSON.parse(payloadStr);
        if (parsed.guest) guestNameQuery = parsed.guest;
      }

      const match = guests.find(
        (g) =>
          g.guestName.toLowerCase().trim() === guestNameQuery.toLowerCase().trim() ||
          g.guestSlug.toLowerCase() === guestNameQuery.toLowerCase()
      );

      if (match) {
        handleToggleCheckin(match);
        setManualCodeInput('');
      } else {
        alert(`Tamu dengan nama "${guestNameQuery}" tidak ditemukan.`);
      }
    } catch {
      alert('Format kode QR tidak dikenali.');
    }
  };

  // Filtered list
  const filteredGuests = guests.filter((g) => {
    const matchQuery =
      g.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory = filterCategory === 'ALL' || g.category === filterCategory;
    const matchStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'CHECKED_IN' && g.hasOpened) ||
      (filterStatus === 'PENDING' && !g.hasOpened);

    return matchQuery && matchCategory && matchStatus;
  });

  const totalGuests = guests.length;
  const checkedInCount = guests.filter((g) => g.hasOpened).length;
  const pendingCount = totalGuests - checkedInCount;
  const percentage = totalGuests > 0 ? Math.round((checkedInCount / totalGuests) * 100) : 0;

  if (loading && !invitation) {
    return (
      <div className="min-h-screen bg-[#F8F7F3] flex flex-col items-center justify-center text-[#111111] p-4">
        <div className="w-8 h-8 border-2 border-neutral-300 border-t-black rounded-full animate-spin mb-3" />
        <p className="text-xs uppercase tracking-widest text-neutral-400">
          Mempersiapkan Meja Resepsi...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#111111]">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-[#F8F7F3]/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>

          <div className="text-center">
            <span className="text-[9px] uppercase tracking-ultra text-emerald-600 font-semibold block">
              ● LIVE RECEPTION DESK
            </span>
            <span className="font-serif text-sm sm:text-base uppercase tracking-wider font-medium truncate max-w-[200px] sm:max-w-md block">
              {invitation?.title || 'Buku Tamu Resepsi'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScannerModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kamera Scanner</span>
            </button>

            <button
              onClick={loadData}
              title="Refresh Data"
              className="p-2 text-neutral-500 hover:text-black transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Reception Desk Scanner Hero Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-neutral-700">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-ultra text-[#E5C378]">
              <QrCode className="w-3.5 h-3.5" />
              <span>SISTEM MEJA RESEPSI DIGITAL</span>
            </div>
            <h2 className="font-serif text-2xl uppercase tracking-wide">
              Scan Tiket Masuk / QR Pass Tamu
            </h2>
            <p className="text-xs text-neutral-300 font-light max-w-xl leading-relaxed">
              Arahkan kamera smartphone atau tablet ke kode QR pada tiket tamu (Guest Pass). Sistem secara otomatis memverifikasi identitas tamu, membunyikan bel sambutan, dan mencatat kedatangan secara real-time.
            </p>
          </div>

          <button
            onClick={() => setIsScannerModalOpen(true)}
            className="px-6 py-3.5 text-xs uppercase tracking-widest bg-[#E5C378] text-black hover:bg-[#d8b567] font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shrink-0 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Buka Kamera Scanner QR</span>
          </button>
        </div>
        {/* Alert Notification for recent check-in */}
        {lastCheckedInGuest && (
          <div className="mb-6 p-4 bg-emerald-900 text-white shadow-xl flex items-center justify-between animate-fade-in border border-emerald-700">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-ultra text-emerald-300">
                  CHECK-IN BERHASIL
                </p>
                <h4 className="font-serif text-lg uppercase tracking-wide">
                  Selamat Datang, {lastCheckedInGuest}!
                </h4>
              </div>
            </div>
            <span className="text-xs text-emerald-200">Kehadiran tercatat</span>
          </div>
        )}

        {/* Live Attendance Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-neutral-200 p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase tracking-ultra text-neutral-400">
                TOTAL TAMU TERDAFTAR
              </span>
              <p className="font-serif text-3xl font-medium mt-1">{totalGuests}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-5 flex items-center justify-between shadow-sm border-l-4 border-l-emerald-600">
            <div>
              <span className="text-[10px] uppercase tracking-ultra text-emerald-600">
                SUDAH CHECK-IN ({percentage}%)
              </span>
              <p className="font-serif text-3xl font-medium mt-1 text-emerald-700">
                {checkedInCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase tracking-ultra text-neutral-400">
                BELUM HADIR
              </span>
              <p className="font-serif text-3xl font-medium mt-1 text-neutral-600">
                {pendingCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <UserX className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Quick Check-In / Search Controls */}
        <div className="bg-white border border-neutral-200 p-5 mb-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Name */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama tamu undangan..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-neutral-300 outline-none focus:border-black transition-colors"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            </div>

            {/* Quick QR / Barcode Scanner Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (manualCodeInput.trim()) {
                  handleProcessQrPayload(manualCodeInput.trim());
                }
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={manualCodeInput}
                  onChange={(e) => setManualCodeInput(e.target.value)}
                  placeholder="Scan QR atau ketik nama tamu..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-neutral-300 outline-none focus:border-black transition-colors"
                />
                <QrCode className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors shrink-0"
              >
                Check In
              </button>
            </form>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-ultra text-neutral-400">Status:</span>
              <button
                type="button"
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1 text-[11px] uppercase tracking-wider border transition-colors ${
                  filterStatus === 'ALL'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
                }`}
              >
                Semua ({totalGuests})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('CHECKED_IN')}
                className={`px-3 py-1 text-[11px] uppercase tracking-wider border transition-colors ${
                  filterStatus === 'CHECKED_IN'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
                }`}
              >
                Sudah Hadir ({checkedInCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('PENDING')}
                className={`px-3 py-1 text-[11px] uppercase tracking-wider border transition-colors ${
                  filterStatus === 'PENDING'
                    ? 'bg-neutral-800 text-white border-neutral-800'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
                }`}
              >
                Belum Hadir ({pendingCount})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-ultra text-neutral-400">Kategori:</span>
              {['ALL', 'VIP', 'Keluarga', 'Umum'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border ${
                    filterCategory === cat
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {cat === 'ALL' ? 'Semua' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Guest Roster Table */}
        <div className="bg-white border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-neutral-200 text-neutral-400 text-[10px] uppercase tracking-ultra">
                <tr>
                  <th className="py-3 px-4">Nama Tamu</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Kontak</th>
                  <th className="py-3 px-4 text-center">Status Kehadiran</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-neutral-400">
                      Tidak ada data tamu yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => (
                    <tr
                      key={guest.id}
                      className={`hover:bg-neutral-50/60 transition-colors ${
                        guest.hasOpened ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-medium text-[#111111]">
                        <span className="text-sm font-serif uppercase tracking-wide block">
                          {guest.guestName}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          /{guest.guestSlug}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[9px] uppercase px-2 py-0.5 border ${
                            guest.category === 'VIP'
                              ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
                              : guest.category === 'Keluarga'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                          }`}
                        >
                          {guest.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-500 font-mono text-xs">
                        {guest.whatsappNumber || '-'}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {guest.hasOpened ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium text-emerald-700 bg-emerald-100/70 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>SUDAH HADIR</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider font-light text-neutral-400 bg-neutral-100 border border-neutral-200">
                            <Clock className="w-3 h-3" />
                            <span>BELUM HADIR</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleCheckin(guest)}
                          className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider border transition-all ${
                            guest.hasOpened
                              ? 'bg-white border-neutral-300 text-neutral-500 hover:text-red-600 hover:border-red-300'
                              : 'bg-black text-white border-black hover:bg-emerald-700 hover:border-emerald-700'
                          }`}
                        >
                          {guest.hasOpened ? 'Batal Hadir' : 'Check In'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Live QR Camera Scanner Modal */}
      <QrCameraScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onScan={handleProcessQrFromCamera}
      />
    </div>
  );
}
