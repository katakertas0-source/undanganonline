'use client';

import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Check, Copy, RefreshCw } from 'lucide-react';
import { Invitation, GuestLink } from '@/types';

interface WhatsAppTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: Invitation;
  currentTemplate: string;
  onSaveTemplate: (newTemplate: string) => void;
}

export const WA_PRESETS: Record<string, { label: string; template: string }> = {
  formal: {
    label: 'Formal & Elegan',
    template: `Kepada Yth.
{nama_tamu}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari bahagia pernikahan kami:

{nama_lengkap_mempelai}

Berikut tautan undangan digital Anda:
{link_undangan}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.

Terima kasih.
{nama_mempelai}`,
  },
  islami: {
    label: 'Islami (Walimatul \'Urs)',
    template: `Assalamu'alaikum Warahmatullahi Wabarakatuh.

Kepada Yth.
{nama_tamu}

Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

{nama_lengkap_mempelai}

Info lengkap & konfirmasi kehadiran:
{link_undangan}

Merupakan suatu kehormatan bagi kami atas kehadiran dan doa restu Anda.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.
{nama_mempelai}`,
  },
  casual: {
    label: 'Santai & Sahabat',
    template: `Halo {nama_tamu}! 👋

Kabar gembira! Kami mengundang kamu untuk ikut merayakan hari pernikahan kami:

{nama_mempelai}

Buka undangan digital spesial kamu di tautan ini:
{link_undangan}

Kehadiran dan doa restu dari kamu sangat berarti buat kami. Sampai jumpa di hari bahagia kami! ✨`,
  },
};

export function formatWhatsAppMessage(
  template: string,
  guest: GuestLink,
  invitation: Invitation,
  liveUrl: string
): string {
  const guestUrl = `${liveUrl}/${guest.guestSlug}`;
  const groomName = invitation.couple?.groomName || 'Mempelai Pria';
  const brideName = invitation.couple?.brideName || 'Mempelai Wanita';
  const groomNickname = invitation.couple?.groomNickname || 'Groom';
  const brideNickname = invitation.couple?.brideNickname || 'Bride';

  let dateFormatted = invitation.eventDate || '';
  if (invitation.eventDate) {
    try {
      dateFormatted = new Date(invitation.eventDate).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {}
  }

  return template
    .replace(/{nama_tamu}/g, guest.guestName)
    .replace(/{kategori}/g, guest.category)
    .replace(/{link_undangan}/g, guestUrl)
    .replace(/{nama_mempelai}/g, `${groomNickname} & ${brideNickname}`)
    .replace(/{nama_lengkap_mempelai}/g, `${groomName} & ${brideName}`)
    .replace(/{tanggal_acara}/g, dateFormatted);
}

export function WhatsAppTemplateModal({
  isOpen,
  onClose,
  invitation,
  currentTemplate,
  onSaveTemplate,
}: WhatsAppTemplateModalProps) {
  const [templateText, setTemplateText] = useState(currentTemplate);
  const [copiedPreview, setCopiedPreview] = useState(false);

  useEffect(() => {
    setTemplateText(currentTemplate);
  }, [currentTemplate, isOpen]);

  if (!isOpen) return null;

  const sampleGuest: GuestLink = {
    id: 'sample',
    guestName: 'Bapak Budi Santoso & Keluarga',
    guestSlug: 'bapak-budi-santoso',
    category: 'VIP',
  };

  const sampleLiveUrl = typeof window !== 'undefined' ? `${window.location.origin}/${invitation.slug}` : `https://undangan.com/${invitation.slug}`;
  const previewMessage = formatWhatsAppMessage(templateText, sampleGuest, invitation, sampleLiveUrl);

  const insertVariable = (variableTag: string) => {
    setTemplateText((prev) => prev + ` ${variableTag}`);
  };

  const handleSave = () => {
    onSaveTemplate(templateText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#F8F7F3] border border-neutral-200 text-[#111111] shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-black transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-ultra text-emerald-600 font-semibold mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WHATSAPP INVITATION MESSAGE</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-wide">
            Kustomisasi Template Pesan WhatsApp
          </h3>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Sesuaikan kata-kata pengantar yang otomatis terisi saat Anda membagikan undangan ke tamu via WhatsApp.
          </p>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Preset Buttons */}
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-neutral-400 block mb-2">
              PILIH CONTOH GAYA BAHASA:
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(WA_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTemplateText(preset.template)}
                  className="px-3 py-1.5 text-xs border border-neutral-300 bg-white hover:border-black transition-colors uppercase tracking-wider text-neutral-700"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Editor Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400">
                  DRAF PESAN
                </label>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {templateText.length} karakter
                </span>
              </div>
              <textarea
                rows={11}
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                placeholder="Tuliskan draf pesan WhatsApp..."
                className="w-full p-3.5 text-xs bg-white border border-neutral-300 text-neutral-900 font-sans outline-none focus:border-black transition-colors resize-none leading-relaxed"
              />

              {/* Dynamic Tag Injectors */}
              <div className="mt-3">
                <span className="text-[10px] uppercase tracking-ultra text-neutral-400 block mb-1.5">
                  KLIK UNTUK SISIPKAN TAG:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { tag: '{nama_tamu}', label: 'Nama Tamu' },
                    { tag: '{link_undangan}', label: 'Link Personal' },
                    { tag: '{nama_mempelai}', label: 'Nama Mempelai' },
                    { tag: '{nama_lengkap_mempelai}', label: 'Nama Lengkap' },
                    { tag: '{kategori}', label: 'Kategori Tamu' },
                    { tag: '{tanggal_acara}', label: 'Tanggal Acara' },
                  ].map((item) => (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => insertVariable(item.tag)}
                      className="px-2 py-0.5 text-[10px] font-mono bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200"
                    >
                      +{item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live WhatsApp Bubble Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400">
                  SIMULASI DI WHATSAPP
                </label>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(previewMessage);
                    setCopiedPreview(true);
                    setTimeout(() => setCopiedPreview(false), 2000);
                  }}
                  className="text-[10px] uppercase tracking-wider text-neutral-500 hover:text-black flex items-center gap-1"
                >
                  {copiedPreview ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPreview ? 'Tersalin' : 'Salin Contoh'}</span>
                </button>
              </div>

              {/* Realistic WhatsApp Chat Bubble Container */}
              <div className="p-4 bg-[#EFEAE2] border border-neutral-300 rounded-lg min-h-[300px] flex flex-col justify-end shadow-inner">
                <div className="bg-white p-3.5 rounded-lg rounded-tr-none shadow-sm max-w-sm ml-auto border border-black/5 text-xs text-neutral-800 whitespace-pre-line leading-relaxed relative">
                  {previewMessage}
                  <div className="text-[9px] text-neutral-400 text-right mt-2 flex items-center justify-end gap-1">
                    <span>10:45</span>
                    <span className="text-emerald-500 font-bold">✓✓</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1 italic text-center">
                Preview ini menggunakan data contoh: &ldquo;Bapak Budi Santoso &amp; Keluarga&rdquo;.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-neutral-200 mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors font-medium flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Simpan Template</span>
          </button>
        </div>
      </div>
    </div>
  );
}
