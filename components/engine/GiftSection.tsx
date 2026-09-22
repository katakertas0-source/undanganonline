'use client';

import React, { useState } from 'react';
import { Copy, Check, Gift } from 'lucide-react';
import { GiftAccount } from '@/types';

interface GiftSectionProps {
  gifts: GiftAccount[];
  isDark?: boolean;
  isVideoMotion?: boolean;
}

export function GiftSection({ gifts, isDark: propIsDark, isVideoMotion }: GiftSectionProps) {
  const isDark = propIsDark || isVideoMotion;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (!gifts || gifts.length === 0) return null;

  return (
    <section className={`py-20 px-6 ${isVideoMotion ? 'bg-transparent text-white' : isDark ? 'bg-[#121212] text-[#F5F3EF]' : 'bg-white text-[#111111]'}`}>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-14">
          <p className={`text-[10px] uppercase tracking-ultra ${isVideoMotion ? 'text-[#E5C378]' : 'text-neutral-400'}`}>
            WEDDING GIFT
          </p>
          <h2 className={`font-serif text-3xl sm:text-4xl uppercase tracking-wider mt-2 ${isVideoMotion ? 'text-white drop-shadow-md' : ''}`}>
            Tanda Kasih
          </h2>
          <p className={`text-xs mt-2 font-light ${isVideoMotion ? 'text-white/80' : 'text-neutral-400'}`}>
            Doa restu Anda merupakan karunia terindah bagi kami. Bagi Anda yang ingin memberikan tanda kasih secara digital:
          </p>
          <div className={`w-12 h-[1px] mx-auto mt-4 ${isVideoMotion ? 'bg-[#E5C378]/50' : isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
        </div>

        <div className="space-y-6">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              className={`p-6 sm:p-8 border transition-all ${
                isDark ? 'bg-[#181818] border-neutral-800' : 'bg-[#F8F7F3] border-neutral-200'
              }`}
            >
              {gift.type === 'PHYSICAL_ADDRESS' ? (
                <div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
                    <Gift className="w-3.5 h-3.5" />
                    <span>KIRIM KADO / PARCEL</span>
                  </div>
                  <h4 className="font-serif text-xl uppercase mb-1">
                    Penerima: {gift.accountHolder}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    {gift.shippingAddress}
                  </p>
                  {gift.recipientPhone && (
                    <p className="text-xs text-neutral-500 mb-4">
                      No. Telp: {gift.recipientPhone}
                    </p>
                  )}
                  {gift.shippingAddress && (
                    <button
                      onClick={() => handleCopy(gift.shippingAddress || '', gift.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-widest border transition-all ${
                        copiedId === gift.id
                          ? 'border-emerald-500 text-emerald-500'
                          : isDark
                          ? 'border-neutral-700 hover:border-white text-neutral-300'
                          : 'border-neutral-300 hover:border-black text-neutral-700'
                      }`}
                    >
                      {copiedId === gift.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Alamat</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider font-medium">
                      {gift.providerName}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 px-2 py-0.5 border border-neutral-300/30">
                      DIGITAL ENVELOPE
                    </span>
                  </div>

                  <div className="space-y-1 mb-4">
                    <p className="font-serif text-2xl tracking-wider font-light">
                      {gift.accountNumber}
                    </p>
                    <p className="text-xs text-neutral-400">
                      a.n. {gift.accountHolder}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(gift.accountNumber, gift.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-widest border transition-all ${
                      copiedId === gift.id
                        ? 'border-emerald-500 text-emerald-500'
                        : isDark
                        ? 'border-neutral-700 hover:border-white text-neutral-300'
                        : 'border-neutral-300 hover:border-black text-neutral-700'
                    }`}
                  >
                    {copiedId === gift.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Nomor Rekening Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin No. Rekening</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
