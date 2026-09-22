'use client';

import React, { useState } from 'react';
import { Check, Loader2, Heart, Lock } from 'lucide-react';
import { submitRsvp, submitRsvpAsync } from '@/lib/store';

interface RsvpSectionProps {
  invitationId: string;
  defaultGuestName?: string;
  isDark?: boolean;
  isVideoMotion?: boolean;
  isEventPassed?: boolean;
  thankYouMessage?: string;
  coupleNames?: string;
}

export function RsvpSection({
  invitationId,
  defaultGuestName = '',
  isDark: propIsDark,
  isVideoMotion,
  isEventPassed = false,
  thankYouMessage,
  coupleNames,
}: RsvpSectionProps) {
  const isDark = propIsDark || isVideoMotion;
  const [guestName, setGuestName] = useState(defaultGuestName);
  const [status, setStatus] = useState<'ATTENDING' | 'NOT_ATTENDING' | 'TENTATIVE'>('ATTENDING');
  const [pax, setPax] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitRsvpAsync(invitationId, guestName, status, status === 'NOT_ATTENDING' ? 0 : pax, notes);
      setIsSubmitted(true);
    } catch (err) {
      console.warn('RSVP submit error, falling back locally:', err);
      submitRsvp(invitationId, guestName, status, status === 'NOT_ATTENDING' ? 0 : pax, notes);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEventPassed) {
    return (
      <section
        className={`py-20 px-6 ${
          isVideoMotion ? 'bg-transparent text-white' : isDark ? 'bg-[#121212] text-[#F5F3EF]' : 'bg-white text-[#111111]'
        }`}
      >
        <div className="max-w-xl mx-auto">
          <div
            className={`p-8 sm:p-12 border text-center relative overflow-hidden transition-all ${
              isVideoMotion
                ? 'border-white/20 bg-white/5 backdrop-blur-md text-white'
                : isDark
                ? 'border-neutral-800 bg-[#171717] text-[#F5F3EF]'
                : 'border-neutral-200 bg-[#FDFBF7] text-[#111111] shadow-sm'
            }`}
          >
            {/* Subtle aesthetic icon */}
            <div className="w-12 h-12 mx-auto rounded-full border border-current/20 flex items-center justify-center mb-6">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
            </div>

            <p className="text-[10px] uppercase tracking-ultra opacity-60 mb-2">
              KARTU UCAPAN TERIMA KASIH
            </p>

            <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider mb-4">
              Terima Kasih Atas Doa & Restu
            </h2>

            <div className={`w-12 h-[1px] mx-auto mb-6 ${isVideoMotion ? 'bg-[#E5C378]/50' : 'bg-current opacity-20'}`} />

            <div className="text-xs sm:text-sm font-light leading-relaxed max-w-lg mx-auto opacity-80 whitespace-pre-line space-y-4">
              {thankYouMessage ? (
                <p>{thankYouMessage}</p>
              ) : (
                <p>
                  Rasa syukur yang tak terhingga kami haturkan atas kehadiran, doa restu, serta cinta kasih yang tulus dari segenap keluarga, sahabat, dan rekan sekalian.
                  <br /><br />
                  Kehadiran serta doa restu Anda telah menyempurnakan hari bahagia kami dan mengawali lembaran baru hidup kami dengan penuh berkah.
                </p>
              )}
            </div>

            {coupleNames && (
              <div className="mt-8 pt-6 border-t border-current/10">
                <p className="font-serif text-lg tracking-widest uppercase">
                  {coupleNames}
                </p>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">
                  DENGAN RASA SYUKUR & CINTA
                </p>
              </div>
            )}

            <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-current/15 text-[10px] uppercase tracking-wider opacity-60 bg-current/5">
              <Lock className="w-3 h-3" />
              <span>Konfirmasi Kehadiran (RSVP) Telah Ditutup</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 px-6 ${isVideoMotion ? 'bg-transparent text-white' : isDark ? 'bg-[#121212] text-[#F5F3EF]' : 'bg-white text-[#111111]'}`}>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <p className={`text-[10px] uppercase tracking-ultra ${isVideoMotion ? 'text-[#E5C378]' : 'text-neutral-400'}`}>
            CONFIRMATION
          </p>
          <h2 className={`font-serif text-3xl sm:text-4xl uppercase tracking-wider mt-2 ${isVideoMotion ? 'text-white drop-shadow-md' : ''}`}>
            Konfirmasi Kehadiran
          </h2>
          <p className={`text-xs mt-2 font-light ${isVideoMotion ? 'text-white/80' : 'text-neutral-400'}`}>
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir.
          </p>
          <div className={`w-12 h-[1px] mx-auto mt-4 ${isVideoMotion ? 'bg-[#E5C378]/50' : isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
        </div>

        {isSubmitted ? (
          <div
            className={`p-8 border text-center transition-all animate-fade-in ${
              isDark ? 'border-neutral-800 bg-[#171717]' : 'border-neutral-200 bg-[#F8F7F3]'
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <Check className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl uppercase tracking-wide">
              Terima Kasih
            </h3>
            <p className="text-xs text-neutral-400 mt-2">
              Konfirmasi kehadiran Anda atas nama <strong>{guestName}</strong> telah berhasil tersimpan.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-6 text-[11px] uppercase tracking-widest text-neutral-400 underline hover:text-neutral-600"
            >
              Ubah Konfirmasi
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-neutral-400 mb-2">
                Nama Tamu
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className={`w-full px-4 py-3 text-xs sm:text-sm border outline-none transition-colors ${
                  isDark
                    ? 'bg-[#171717] border-neutral-800 text-white focus:border-neutral-500'
                    : 'bg-white border-neutral-300 text-[#111111] focus:border-black'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-neutral-400 mb-2">
                Kehadiran
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('ATTENDING')}
                  className={`py-3 text-[11px] uppercase tracking-widest border transition-all ${
                    status === 'ATTENDING'
                      ? isDark
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-white border-black'
                      : isDark
                      ? 'border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      : 'border-neutral-300 text-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  Hadir
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('NOT_ATTENDING')}
                  className={`py-3 text-[11px] uppercase tracking-widest border transition-all ${
                    status === 'NOT_ATTENDING'
                      ? isDark
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-white border-black'
                      : isDark
                      ? 'border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      : 'border-neutral-300 text-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  Tidak Hadir
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('TENTATIVE')}
                  className={`py-3 text-[11px] uppercase tracking-widest border transition-all ${
                    status === 'TENTATIVE'
                      ? isDark
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-white border-black'
                      : isDark
                      ? 'border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      : 'border-neutral-300 text-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  Masih Ragu
                </button>
              </div>
            </div>

            {status !== 'NOT_ATTENDING' && (
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-neutral-400 mb-2">
                  Jumlah Tamu Hadir
                </label>
                <select
                  value={pax}
                  onChange={(e) => setPax(Number(e.target.value))}
                  className={`w-full px-4 py-3 text-xs sm:text-sm border outline-none ${
                    isDark
                      ? 'bg-[#171717] border-neutral-800 text-white'
                      : 'bg-white border-neutral-300 text-[#111111]'
                  }`}
                >
                  <option value={1}>1 Orang</option>
                  <option value={2}>2 Orang</option>
                  <option value={3}>3 Orang</option>
                  <option value={4}>4 Orang</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-neutral-400 mb-2">
                Catatan / Pesan Khusus (Opsional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tuliskan catatan kehadiran bila ada..."
                className={`w-full px-4 py-3 text-xs sm:text-sm border outline-none resize-none transition-colors ${
                  isDark
                    ? 'bg-[#171717] border-neutral-800 text-white focus:border-neutral-500'
                    : 'bg-white border-neutral-300 text-[#111111] focus:border-black'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              } ${
                isDark
                  ? 'bg-white text-black hover:bg-neutral-200'
                  : 'bg-black text-white hover:bg-neutral-800'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengirimkan...</span>
                </>
              ) : (
                'Kirim Konfirmasi Kehadiran'
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
