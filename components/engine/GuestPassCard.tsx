'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, ShieldCheck, Download } from 'lucide-react';
import { generateQrDataUrl } from '@/lib/qr-generator';

interface GuestPassCardProps {
  invitationId: string;
  slug: string;
  guestName: string;
  guestCategory?: string;
  isDark?: boolean;
}

export function GuestPassCard({
  invitationId,
  slug,
  guestName,
  guestCategory = 'Tamu Undangan',
  isDark = false,
}: GuestPassCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    // Generate unique verification code payload
    const verificationPayload = JSON.stringify({
      app: 'undangan-online',
      invId: invitationId,
      slug: slug,
      guest: guestName,
      t: Date.now(),
    });

    generateQrDataUrl(verificationPayload, {
      width: 300,
      color: {
        dark: '#111111',
        light: '#FFFFFF',
      },
    }).then((url) => {
      setQrDataUrl(url);
    });
  }, [invitationId, slug, guestName]);

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR_Akses_${guestName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className={`py-16 px-6 ${isDark ? 'bg-[#0E0E0E] text-[#F8F7F3]' : 'bg-[#F2EFE9] text-[#111111]'}`}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-ultra text-neutral-400">
            <QrCode className="w-3.5 h-3.5" />
            <span>DIGITAL ACCESS PASS</span>
          </div>
          <h3 className="font-serif text-2xl uppercase tracking-wider mt-1">
            Kartu Akses Resepsi
          </h3>
          <p className="text-[11px] text-neutral-400 font-light mt-1">
            Tunjukkan QR Code ini kepada panitia penerima tamu di lokasi acara.
          </p>
        </div>

        {/* Editorial Boarding Pass Style Card */}
        <div
          className={`relative border overflow-hidden shadow-xl ${
            isDark ? 'bg-[#181818] border-neutral-800' : 'bg-white border-neutral-200'
          }`}
        >
          {/* Top Decorative Header */}
          <div className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
            <div>
              <span className="text-[9px] uppercase tracking-ultra text-neutral-400 block">
                SPECIAL INVITATION
              </span>
              <span className="font-serif text-sm uppercase tracking-wider font-medium">
                ADMIT ONE
              </span>
            </div>
            <div className="text-right">
              <span className="text-[8px] uppercase tracking-ultra px-2 py-0.5 border border-white/30 text-white/90">
                {guestCategory.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 text-center">
            <span className="text-[9px] uppercase tracking-ultra text-neutral-400 block mb-1">
              GUEST OF HONOR
            </span>
            <h4 className="font-serif text-2xl sm:text-3xl uppercase tracking-wide text-[#111111]">
              {guestName}
            </h4>

            <div className="w-8 h-[1px] bg-neutral-300 mx-auto my-5" />

            {/* QR Code Container */}
            <div className="bg-white p-3 inline-block border border-neutral-200 shadow-sm rounded-none my-2">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Akses ${guestName}`}
                  className="w-44 h-44 mx-auto block"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center bg-neutral-50 text-xs text-neutral-400">
                  Menyiapkan QR Code...
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 py-1.5 px-3 max-w-xs mx-auto mt-4 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Terverifikasi Otomatis di Meja Resepsi</span>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="relative flex items-center justify-between px-2 my-1">
            <div className="w-4 h-4 rounded-full bg-[#F2EFE9] -ml-4 border-r border-neutral-200" />
            <div className="flex-1 border-t-2 border-dashed border-neutral-200 mx-2" />
            <div className="w-4 h-4 rounded-full bg-[#F2EFE9] -mr-4 border-l border-neutral-200" />
          </div>

          {/* Card Footer Actions */}
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-[10px] text-neutral-400 font-mono">
              REF: {invitationId.substring(0, 8).toUpperCase()}
            </span>
            <button
              onClick={handleDownloadQr}
              type="button"
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-black hover:underline font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Simpan QR</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
