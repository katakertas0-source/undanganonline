'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Lock, Loader2, CheckCircle2, AlertCircle, KeyRound, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { getSupabase } from '@/lib/supabase/client';
import { verifyDashboardLogin, setCurrentSession } from '@/lib/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const supabase = getSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      // 1. Check if user is logging in with Dashboard Credentials (Opsi A)
      const matchedInv = verifyDashboardLogin(identifier, password);
      if (matchedInv) {
        setCurrentSession(matchedInv.id, matchedInv.dashboardUsername || matchedInv.slug);
        setSuccessMsg(`Selamat datang, ${matchedInv.couple.groomNickname} & ${matchedInv.couple.brideNickname}! Mengalihkan ke dashboard...`);
        setTimeout(() => {
          onClose();
          window.location.href = `/dashboard?id=${matchedInv.id}`;
        }, 800);
        return;
      }

      // 2. Otherwise try Supabase auth if connected (for admin / developer)
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier.trim(),
          password,
        });

        if (!error && data.user) {
          setSuccessMsg('Berhasil masuk! Mengalihkan...');
          setTimeout(() => {
            onSuccess?.(data.user);
            onClose();
            window.location.href = '/dashboard';
          }, 800);
          return;
        }
      }

      setErrorMsg('Username atau kata sandi tidak sesuai. Silakan periksa kembali Username & Password dari halaman bukti pembayaran Anda.');
      setLoading(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#F8F7F3] border border-neutral-200 text-[#111111] shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-black transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-neutral-500 font-semibold bg-neutral-200/60 px-2.5 py-0.5 rounded-full mb-2">
            <KeyRound className="w-3 h-3 text-neutral-700" />
            <span>AKSES DASHBOARD PENGANTIN</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-wide text-neutral-900 mt-1">
            Masuk ke Dashboard
          </h3>
          <p className="text-xs text-neutral-500 font-light mt-1.5 leading-relaxed">
            Halaman ini khusus untuk pengantin yang sudah memesan undangan. Masukkan Username &amp; Password dari bukti pembayaran Anda.
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3 mb-4 text-xs bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-4 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-600 mb-1 font-medium">
              Username / ID Pengantin
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Contoh: our-wedding-xxx atau email Anda"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-neutral-300 text-neutral-900 outline-none focus:border-black transition-colors font-mono"
              />
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-600 mb-1 font-medium">
              Password Dashboard
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contoh: KITA-8821"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-neutral-300 text-neutral-900 outline-none focus:border-black transition-colors font-mono"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 font-medium cursor-pointer shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memeriksa Akses...</span>
              </>
            ) : (
              'Masuk ke Dashboard Saya'
            )}
          </button>
        </form>

        {/* Reassuring Notice for New Visitors: NO REGISTRATION NEEDED */}
        <div className="mt-6 pt-5 border-t border-neutral-200/80 bg-white/70 p-3.5 border border-neutral-200">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-left">
              <p className="text-[11px] font-medium text-neutral-800">
                Belum memesan undangan?
              </p>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-light">
                Anda <strong>tidak perlu mendaftar akun</strong> terlebih dahulu. Silakan langsung pilih template dan rancang undangan Anda secara bebas. Akun dashboard akan dibuatkan otomatis setelah pembayaran.
              </p>
              <Link
                href="/templates"
                onClick={onClose}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-900 hover:underline pt-1"
              >
                <span>Lihat Koleksi Template</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
