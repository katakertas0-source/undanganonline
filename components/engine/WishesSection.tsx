'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { WishEntry } from '@/types';
import { getWishesForInvitation, getWishesForInvitationAsync, submitWish, submitWishAsync } from '@/lib/store';

interface WishesSectionProps {
  invitationId: string;
  defaultSenderName?: string;
  isDark?: boolean;
  forceMobile?: boolean;
  isVideoMotion?: boolean;
}

export function WishesSection({ invitationId, defaultSenderName = '', isDark: propIsDark, forceMobile = false, isVideoMotion }: WishesSectionProps) {
  const isDark = propIsDark || isVideoMotion;
  const [wishes, setWishes] = useState<WishEntry[]>(() => {
    return getWishesForInvitation(invitationId).filter((w) => w.isApproved);
  });
  const [senderName, setSenderName] = useState(defaultSenderName);
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const loadWishes = React.useCallback(async () => {
    const list = await getWishesForInvitationAsync(invitationId);
    setWishes(list.filter((w) => w.isApproved));
  }, [invitationId]);

  useEffect(() => {
    loadWishes();
    window.addEventListener('uo_store_updated', loadWishes);
    return () => window.removeEventListener('uo_store_updated', loadWishes);
  }, [loadWishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitWishAsync(invitationId, senderName, message, relationship);
      setMessage('');
      setIsSent(true);
      setTimeout(() => setIsSent(false), 4000);
      loadWishes();
    } catch (err) {
      console.warn('Error submitting wish, saving locally:', err);
      submitWish(invitationId, senderName, message, relationship);
      setMessage('');
      setIsSent(true);
      setTimeout(() => setIsSent(false), 4000);
      loadWishes();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`py-20 px-6 ${isVideoMotion ? 'bg-transparent text-white' : isDark ? 'bg-[#0C0C0C] text-[#F5F3EF]' : 'bg-[#F8F7F3] text-[#111111]'}`}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <p className={`text-[10px] uppercase tracking-ultra ${isVideoMotion ? 'text-[#E5C378]' : 'text-neutral-400'}`}>
            WORDS OF BLESSING
          </p>
          <h2 className={`font-serif text-3xl sm:text-4xl uppercase tracking-wider mt-2 ${isVideoMotion ? 'text-white drop-shadow-md' : ''}`}>
            Ucapan & Doa
          </h2>
          <p className={`text-xs mt-2 font-light ${isVideoMotion ? 'text-white/80' : 'text-neutral-400'}`}>
            Sampaikan untaian doa dan harapan terbaik untuk kedua mempelai.
          </p>
          <div className={`w-12 h-[1px] mx-auto mt-4 ${isVideoMotion ? 'bg-[#E5C378]/50' : isDark ? 'bg-neutral-800' : 'bg-neutral-300'}`} />
        </div>

        {/* Input Form */}
        <div className={`p-5 sm:p-8 border mb-12 ${isDark ? 'bg-[#151515] border-neutral-800' : 'bg-white border-neutral-200'}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className={forceMobile ? 'space-y-3' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
                  Nama Anda
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Contoh: Sarah Wijaya"
                  className={`w-full px-3.5 py-2.5 text-xs border outline-none ${
                    isDark
                      ? 'bg-[#1E1E1E] border-neutral-700 text-white'
                      : 'bg-white border-neutral-300 text-[#111111]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
                  Hubungan (Opsional)
                </label>
                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="Contoh: Sahabat Nadia / Rekan Kantor"
                  className={`w-full px-3.5 py-2.5 text-xs border outline-none ${
                    isDark
                      ? 'bg-[#1E1E1E] border-neutral-700 text-white'
                      : 'bg-white border-neutral-300 text-[#111111]'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
                Pesan & Doa
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan ucapan dan doa tulus Anda..."
                className={`w-full px-3.5 py-2.5 text-xs border outline-none resize-none ${
                  isDark
                    ? 'bg-[#1E1E1E] border-neutral-700 text-white'
                    : 'bg-white border-neutral-300 text-[#111111]'
                }`}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {isSent && (
                <span className="text-xs text-emerald-500 flex items-center gap-1.5">
                  ✓ Pesan Anda telah terkirim!
                </span>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`ml-auto px-6 py-2.5 text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                } ${
                  isDark
                    ? 'bg-white text-black hover:bg-neutral-200'
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  'Kirim Ucapan'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Wishes List */}
        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
          {wishes.length === 0 ? (
            <p className="text-center text-xs text-neutral-400 italic py-8">
              Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
            </p>
          ) : (
            wishes.map((item) => (
              <div
                key={item.id}
                className={`p-5 border transition-all ${
                  isDark
                    ? 'bg-[#151515] border-neutral-800/80 text-neutral-300'
                    : 'bg-white border-neutral-200/70 text-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-medium text-base text-inherit">
                      {item.senderName}
                    </span>
                    {item.relationship && (
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 px-2 py-0.5 border border-neutral-400/20 rounded">
                        {item.relationship}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-light text-neutral-400">
                  {item.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
