'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MinimalNav } from '@/components/marketing/MinimalNav';
import { MinimalFooter } from '@/components/marketing/MinimalFooter';
import { createDraftInvitation, createOrderForInvitation } from '@/lib/store';
import { PenTool, Check, ArrowRight } from 'lucide-react';

function CustomBriefForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTier = searchParams.get('package') === 'exclusive' ? 'Exclusive' : 'Made for You';

  const [tier, setTier] = useState<'Made for You' | 'Exclusive'>(initialTier);
  const [coupleNames, setCoupleNames] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [storyConcept, setStoryConcept] = useState('');
  const [references, setReferences] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create a draft with serviceType = 'custom'
    const draft = createDraftInvitation(
      tier === 'Exclusive' ? 'nocturne-dark' : 'aurelia-minimal',
      'custom'
    );

    if (coupleNames.trim()) {
      draft.title = `Custom Project: ${coupleNames}`;
      draft.couple.groomNickname = coupleNames.split('&')[0]?.trim() || draft.couple.groomNickname;
      draft.couple.brideNickname = coupleNames.split('&')[1]?.trim() || draft.couple.brideNickname;
    }
    if (eventDate) {
      draft.eventDate = eventDate;
    }

    draft.designerNotes = `Concept: ${storyConcept}. References: ${references}`;

    // Create order with custom price
    const order = createOrderForInvitation(draft.id);
    // Adjust order price to custom package price
    const customPrice = tier === 'Exclusive' ? 799000 : 399000;
    order.items = [
      {
        id: 'item-custom-service',
        itemType: 'CUSTOM_PACKAGE',
        referenceId: tier.toLowerCase().replace(/ /g, '-'),
        itemName: `Custom Atelier: ${tier}`,
        unitPrice: customPrice,
        quantity: 1,
        subtotal: customPrice,
      },
    ];
    order.totalAmount = customPrice;
    order.netAmount = customPrice;

    setTimeout(() => {
      router.push(`/checkout/${order.id}`);
    }, 600);
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-ultra text-neutral-500 mb-2">
          <PenTool className="w-3.5 h-3.5 text-neutral-600" />
          <span>BRIEF KREATIF DESAINER</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-tight">
          Formulir Brief Proyek
        </h1>
        <p className="text-xs text-neutral-500 font-light mt-2 leading-relaxed">
          Ceritakan konsep, preferensi estetika, dan ekspektasi Anda agar desainer kami dapat merancang karya yang personal dan abadi.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 border border-neutral-200 bg-white space-y-6 shadow-sm">
        {/* Tier Selector */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
            Pilih Paket Layanan
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setTier('Made for You')}
              className={`p-4 border cursor-pointer transition-all ${
                tier === 'Made for You'
                  ? 'border-black bg-neutral-50 ring-1 ring-black'
                  : 'border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-serif font-medium text-base">Made for You</span>
                {tier === 'Made for You' && <Check className="w-4 h-4 text-black" />}
              </div>
              <p className="font-serif text-sm text-neutral-500">Rp 399.000</p>
              <p className="text-[10px] text-neutral-400 mt-1">2x Revisi · Layout Bespoke</p>
            </div>

            <div
              onClick={() => setTier('Exclusive')}
              className={`p-4 border cursor-pointer transition-all ${
                tier === 'Exclusive'
                  ? 'border-black bg-neutral-50 ring-1 ring-black'
                  : 'border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-serif font-medium text-base">Exclusive Atelier</span>
                {tier === 'Exclusive' && <Check className="w-4 h-4 text-black" />}
              </div>
              <p className="font-serif text-sm text-neutral-500">Rp 799.000</p>
              <p className="text-[10px] text-neutral-400 mt-1">Unlimited Revisi · Custom Motion</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-1.5">
            Nama Kedua Mempelai
          </label>
          <input
            type="text"
            required
            value={coupleNames}
            onChange={(e) => setCoupleNames(e.target.value)}
            placeholder="Contoh: Julian & Nadia"
            className="w-full px-4 py-3 text-xs border border-neutral-300 outline-none focus:border-black"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-1.5">
              Nomor WhatsApp Aktif
            </label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full px-4 py-3 text-xs border border-neutral-300 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-1.5">
              Estimasi Tanggal Acara
            </label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-3 text-xs border border-neutral-300 outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-1.5">
            Cerita & Konsep Visual
          </label>
          <textarea
            rows={4}
            required
            value={storyConcept}
            onChange={(e) => setStoryConcept(e.target.value)}
            placeholder="Ceritakan tentang kisah kalian, nuansa pernikahan yang diinginkan (minimalis editorial, nocturnal modern, warm linen, dll.), atau lagu yang disukai..."
            className="w-full px-4 py-3 text-xs border border-neutral-300 outline-none resize-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-1.5">
            Link Referensi / Moodboard (Pinterest, Instagram, Drive)
          </label>
          <input
            type="text"
            value={references}
            onChange={(e) => setReferences(e.target.value)}
            placeholder="https://pinterest.com/... atau link Google Drive"
            className="w-full px-4 py-3 text-xs border border-neutral-300 outline-none focus:border-black"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Menyiapkan Proyek...</span>
          ) : (
            <>
              <span>Kirim Brief & Lanjut ke Pembayaran</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </main>
  );
}

export default function CustomBriefPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#111111]">
      <MinimalNav />
      <Suspense fallback={<div className="py-24 text-center text-xs text-neutral-400">Memuat...</div>}>
        <CustomBriefForm />
      </Suspense>
      <MinimalFooter />
    </div>
  );
}
