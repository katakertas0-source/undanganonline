'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOrderById, getInvitationById, saveInvitation, setCurrentSession } from '@/lib/store';
import { Order, Invitation } from '@/types';
import { MinimalNav } from '@/components/marketing/MinimalNav';
import { MinimalFooter } from '@/components/marketing/MinimalFooter';
import {
  Check,
  Copy,
  ExternalLink,
  ArrowRight,
  Camera,
  Share2,
  Lock,
  FileText,
  CheckCheck,
  KeyRound,
  UserCheck,
  Send,
  MessageCircle,
  HelpCircle,
  Eye,
  EyeOff,
  User,
  Users,
  Smartphone,
  ChevronRight,
} from 'lucide-react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const [order, setOrder] = useState<Order | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  
  const [copiedGuest, setCopiedGuest] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (orderId) {
      const ord = getOrderById(orderId);
      if (ord) {
        setOrder(ord);
        const inv = getInvitationById(ord.invitationId);
        if (inv) {
          // Ensure invitation has dashboard credentials
          if (!inv.dashboardUsername || !inv.dashboardPassword) {
            const username = inv.dashboardUsername || inv.slug;
            const password = inv.dashboardPassword || `KITA-${Math.floor(1000 + Math.random() * 9000)}`;
            const updated = {
              ...inv,
              dashboardUsername: username,
              dashboardPassword: password,
            };
            saveInvitation(updated);
            setInvitation(updated);
          } else {
            setInvitation(inv);
          }
        }
      }
    }
  }, [orderId]);

  if (!invitation) {
    return (
      <div className="py-28 text-center text-xs text-neutral-400">
        Memuat detail konfirmasi undangan...
      </div>
    );
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const liveUrl = `${origin}/${invitation.slug}`;
  const username = invitation.dashboardUsername || invitation.slug;
  const password = invitation.dashboardPassword || 'KITA-8821';
  const sampleGuestUrl = `${liveUrl}/budi-santoso`;

  const copyGuestLink = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopiedGuest(true);
    setTimeout(() => setCopiedGuest(false), 2500);
  };

  const copyUsername = () => {
    navigator.clipboard.writeText(username);
    setCopiedUser(true);
    setTimeout(() => setCopiedUser(false), 2500);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2500);
  };

  const handleGoToDashboard = () => {
    setCurrentSession(invitation.id, username);
    router.push(`/dashboard?id=${invitation.id}`);
  };

  const copyAllSummary = () => {
    const textSummary = `💌 BUKTI PEMBAYARAN & AKSES RESMI UNDANGAN PERNIKAHAN
Judul: ${invitation.title}
Status: AKTIF RESMI

1. 🌐 LINK UNDANGAN UNTUK TAMU UMUM:
${liveUrl}

2. 🔐 KREDENSIAL MASUK DASHBOARD PENGANTIN:
Website: ${origin} (Klik tombol "MASUK" di pojok kanan atas)
Username : ${username}
Password : ${password}

3. 👥 CARA MENGUBAH / MENAMBAH NAMA TAMU:
- Login ke website dengan Username & Password di atas
- Buka tab "Personalisasi Tamu"
- Tambahkan nama tamu & klik tombol WhatsApp untuk kirim undangan dengan nama khusus.

✨ Simpan pesan ini di Catatan HP Anda!
Powered by Kertas.Kata`;

    navigator.clipboard.writeText(textSummary);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 4000);
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 sm:py-16 text-center">
      {/* Success Badge */}
      <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-xs">
        <Check className="w-7 h-7" />
      </div>

      <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-emerald-700 font-medium mb-2 bg-emerald-50 border border-emerald-200/80 px-3 py-0.5 rounded-full">
        <Check className="w-3 h-3 text-emerald-600" />
        <span>PEMBAYARAN LUNAS · UNDANGAN RESMI AKTIF</span>
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-neutral-950 mt-2">
        {invitation.title}
      </h1>

      <p className="mt-3 text-xs sm:text-sm text-neutral-600 font-light max-w-lg mx-auto leading-relaxed">
        Selamat! Undangan digital Anda telah terbit dan siap disebarkan kepada seluruh keluarga serta tamu undangan.
      </p>

      {/* 📸 PENTING: Screenshot Banner */}
      <div className="mt-8 p-5 sm:p-6 bg-[#FFF9E8] border-2 border-[#E8CE82] rounded-sm text-left shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#F5E2A8] text-[#7A5B12] flex items-center justify-center shrink-0 mt-0.5">
            <Camera className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-sm sm:text-base uppercase tracking-wider text-[#684C0B] font-semibold flex items-center gap-2">
              <span>📸 PENTING: SILAKAN TANGKAP LAYAR (SCREENSHOT) HALAMAN INI</span>
            </h3>
            <p className="text-xs text-[#7A5B12] leading-relaxed font-light">
              Harap tangkap layar (*screenshot*) atau salin kredensial akun di bawah ke aplikasi <strong>Catatan (Notes) HP Anda</strong>. Anda akan menggunakan <strong>Username &amp; Password</strong> ini untuk login melalui tombol <strong>&ldquo;MASUK&rdquo;</strong> di website kapan pun ingin mengecek RSVP atau membuat nama tamu khusus.
            </p>
          </div>
        </div>
      </div>

      {/* Two Core Credential Cards */}
      <div className="mt-6 space-y-5 text-left">
        {/* Card 1: Public Guest Link */}
        <div className="p-6 border border-neutral-200 bg-white shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-900 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-neutral-600" />
              <span>1. TAUTAN RESMI UNDANGAN (UNTUK TAMU)</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-mono">
              Link Publik
            </span>
          </div>

          <p className="text-xs text-neutral-500 font-light mb-3">
            Sebarkan tautan publik ini kepada keluarga, sahabat, dan grup obrolan Anda.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-neutral-50 border border-neutral-200">
            <span className="font-mono text-xs text-neutral-800 truncate select-all">
              {liveUrl}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={copyGuestLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                {copiedGuest ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>

              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-neutral-300 hover:border-black text-neutral-700 hover:text-black bg-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka</span>
              </a>
            </div>
          </div>
        </div>

        {/* Card 2: Dashboard Credentials (OPSI A) */}
        <div className="p-6 border-2 border-[#111111] bg-[#FAF8F5] shadow-md">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-900 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-neutral-900" />
              <span>2. KREDENSIAL AKSES DASHBOARD PENGANTIN (OPSI A)</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 font-semibold">
              Akun Resmi Aktif
            </span>
          </div>

          <p className="text-xs text-neutral-600 font-light mb-4 leading-relaxed">
            Gunakan <strong>Username</strong> dan <strong>Password</strong> ini untuk masuk ke Dashboard pribadi Anda melalui tombol <strong>&ldquo;MASUK&rdquo;</strong> di pojok kanan atas website.
          </p>

          {/* Credentials Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {/* Username */}
            <div className="p-3.5 bg-white border border-neutral-300 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">
                  Username / ID Pengantin
                </span>
                <span className="font-mono text-sm font-semibold text-neutral-900 select-all">
                  {username}
                </span>
              </div>
              <button
                onClick={copyUsername}
                className="mt-2.5 inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-black self-start cursor-pointer"
              >
                {copiedUser ? (
                  <>
                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Username</span>
                  </>
                )}
              </button>
            </div>

            {/* Password */}
            <div className="p-3.5 bg-white border border-neutral-300 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">
                  Password Dashboard
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold tracking-wider text-neutral-950 select-all">
                    {showPassword ? password : '••••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-neutral-400 hover:text-black"
                    title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <button
                onClick={copyPassword}
                className="mt-2.5 inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-black self-start cursor-pointer"
              >
                {copiedPass ? (
                  <>
                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Password</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              onClick={handleGoToDashboard}
              className="w-full sm:flex-1 py-3 px-4 text-xs font-semibold uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Buka &amp; Masuk ke Dashboard Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Copy All Summary Button */}
      <div className="mt-5">
        <button
          onClick={copyAllSummary}
          className={`w-full py-4 px-6 text-xs uppercase tracking-widest font-medium border transition-all flex items-center justify-center gap-2.5 shadow-xs cursor-pointer ${
            copiedAll
              ? 'bg-emerald-700 text-white border-emerald-700'
              : 'bg-[#221F1D] text-[#FAF8F5] hover:bg-[#3D3834] border-[#221F1D]'
          }`}
        >
          {copiedAll ? (
            <>
              <CheckCheck className="w-4 h-4 text-emerald-300" />
              <span>Semua Kredensial &amp; Link Berhasil Disalin! Silakan Simpan di Catatan HP</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 text-[#D8D2C7]" />
              <span>Salin Semua Kredensial &amp; Rangkuman Akses (Format WA)</span>
            </>
          )}
        </button>
      </div>

      {/* 📚 TUTORIAL: CARA MENGUBAH & MENGIRIM UNDANGAN DENGAN NAMA TAMU KHUSUS */}
      <section className="mt-12 pt-10 border-t border-neutral-300/80 text-left">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 bg-black text-white rounded-xs">
            <HelpCircle className="w-4 h-4" />
          </span>
          <h2 className="font-serif text-xl sm:text-2xl uppercase tracking-wide text-neutral-900">
            Panduan Lengkap: Cara Mengubah &amp; Mengirim Undangan ke Tamu
          </h2>
        </div>
        <p className="text-xs text-neutral-500 font-light mb-8 max-w-2xl leading-relaxed">
          Ikuti 4 langkah praktis berikut untuk membuat undangan dengan nama tamu khusus (contoh: <em>Kepada Yth. Bapak Budi Santoso &amp; Keluarga</em>) dan mengirimkannya langsung via WhatsApp:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1 */}
          <div className="p-5 bg-white border border-neutral-200 shadow-xs relative">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <h3 className="font-serif text-sm uppercase tracking-wide font-semibold text-neutral-900">
                Masuk ke Dashboard Pengantin
              </h3>
            </div>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Buka website kapan saja dan klik tombol <strong>&ldquo;MASUK&rdquo;</strong> di pojok kanan atas navbar. Masukkan Username (<code>{username}</code>) dan Password (<code>{password}</code>) Anda.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 bg-white border border-neutral-200 shadow-xs relative">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <h3 className="font-serif text-sm uppercase tracking-wide font-semibold text-neutral-900">
                Buka Tab &ldquo;Personalisasi Tamu&rdquo;
              </h3>
            </div>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Di halaman dashboard, pilih tab menu <strong>&ldquo;Personalisasi Tamu&rdquo;</strong>. Anda akan melihat formulir untuk memasukkan nama tamu satu per satu atau tombol impor massal dari file Excel.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 bg-white border border-neutral-200 shadow-xs relative">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <h3 className="font-serif text-sm uppercase tracking-wide font-semibold text-neutral-900">
                Ketik Nama Tamu &amp; No. WhatsApp
              </h3>
            </div>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Ketik nama tamu (contoh: <em>Bapak Budi Santoso &amp; Keluarga</em>) dan pilih kategori tamu (VIP, Keluarga, Teman). Sistem otomatis membuat link khusus:
              <br />
              <code className="inline-block mt-1.5 p-1 bg-neutral-100 text-[11px] text-neutral-800 break-all border border-neutral-200">
                {sampleGuestUrl}
              </code>
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 bg-white border border-neutral-200 shadow-xs relative">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <h3 className="font-serif text-sm uppercase tracking-wide font-semibold text-neutral-900 flex items-center gap-1.5">
                <span>Klik &ldquo;Kirim WhatsApp&rdquo;</span>
                <MessageCircle className="w-4 h-4 text-emerald-600" />
              </h3>
            </div>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Klik ikon WhatsApp hijau di samping nama tamu. Teks undangan resmi yang sopan dan tautan khusus tamu akan otomatis terbuka di aplikasi WhatsApp Anda, siap dikirimkan! Nama tamu akan langsung tampil di sampul undangan saat dibuka.
            </p>
          </div>
        </div>

        {/* Call to action inside tutorial */}
        <div className="mt-8 p-6 bg-neutral-900 text-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-base uppercase tracking-wide">
              Siap Mengatur Daftar Tamu Anda?
            </h4>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Kelola nama tamu, cek konfirmasi kehadiran (RSVP), dan baca doa restu di dashboard sekarang.
            </p>
          </div>
          <button
            onClick={handleGoToDashboard}
            className="w-full sm:w-auto px-6 py-3 bg-white text-black hover:bg-neutral-200 text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Buka Dashboard Tamu</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Bottom Direct Action Navigation */}
      <div className="mt-12 pt-8 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleGoToDashboard}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
        >
          <span>Masuk ke Dashboard Pengantin</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <a
          href={liveUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest border border-neutral-300 hover:border-black text-neutral-800 hover:text-black bg-white transition-colors"
        >
          <span>Lihat Tampilan Undangan Live</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#111111]">
      <MinimalNav />
      <Suspense fallback={<div className="py-24 text-center text-xs text-neutral-400">Memuat rincian konfirmasi...</div>}>
        <SuccessContent />
      </Suspense>
      <MinimalFooter />
    </div>
  );
}
