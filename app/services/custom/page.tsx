'use client';

import React from 'react';
import Link from 'next/link';
import { MinimalNav } from '@/components/marketing/MinimalNav';
import { MinimalFooter } from '@/components/marketing/MinimalFooter';
import { Check, ArrowRight, PenTool } from 'lucide-react';

export default function CustomServicePage() {
  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#111111]">
      <MinimalNav />

      {/* Hero Header */}
      <section className="py-24 px-6 sm:px-8 bg-[#111111] text-[#F8F7F3] text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 text-[10px] uppercase tracking-ultra text-amber-300/90 border border-amber-300/30 rounded-full mb-6">
            <PenTool className="w-3 h-3" />
            <span>BESPOKE ATELIER SERVICE</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-white font-light">
            You Tell Us Your Story.<br />
            <span className="italic font-normal">We Design It.</span>
          </h1>

          <p className="mt-6 text-xs sm:text-sm text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
            Layanan eksklusif untuk calon mempelai yang menginginkan karya undangan digital tanpa batas template: visual editorial murni, motion sinematik, dan kurasi estetika profesional.
          </p>
        </div>
      </section>

      {/* Custom Service Process Timeline */}
      <section className="py-20 px-6 sm:px-8 max-w-6xl mx-auto border-b border-neutral-200">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-ultra text-neutral-400">
            THE ATELIER PROCESS
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-wider mt-2">
            Bagaimana Kami Mengerjakannya
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="p-6 border border-neutral-200 bg-white">
            <span className="font-serif text-3xl text-neutral-300 block mb-3">01</span>
            <h4 className="font-serif text-lg uppercase mb-1">Briefing & Story</h4>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Anda mengisi brief kreatif, menyertakan moodboard, referensi gaya, dan data lengkap acara.
            </p>
          </div>

          <div className="p-6 border border-neutral-200 bg-white">
            <span className="font-serif text-3xl text-neutral-300 block mb-3">02</span>
            <h4 className="font-serif text-lg uppercase mb-1">Desain & Motion</h4>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Tim desainer kami merancang layout khusus, transisi animasi, dan tipografi unik.
            </p>
          </div>

          <div className="p-6 border border-neutral-200 bg-white">
            <span className="font-serif text-3xl text-neutral-300 block mb-3">03</span>
            <h4 className="font-serif text-lg uppercase mb-1">Draft & Revisi</h4>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Kami membagikan link preview pribadi untuk Anda tinjau dan lakukan penyesuaian hingga sempurna.
            </p>
          </div>

          <div className="p-6 border border-neutral-200 bg-white">
            <span className="font-serif text-3xl text-neutral-300 block mb-3">04</span>
            <h4 className="font-serif text-lg uppercase mb-1">Approval & Live</h4>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Setelah disetujui, link publik diaktifkan, QR code siap diunduh, dan undangan siap disebar.
            </p>
          </div>
        </div>
      </section>

      {/* Package Tiers */}
      <section className="py-24 px-6 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-ultra text-neutral-400">
            SERVICE TIERS
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-wider mt-2">
            Pilihan Paket Dibuatkan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tier 1: Made For You */}
          <div className="p-8 sm:p-10 border border-neutral-200 bg-white flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">
                TIER 01
              </span>
              <h3 className="font-serif text-3xl uppercase tracking-wide">Made For You</h3>
              <p className="text-xs text-neutral-500 font-light mt-2 mb-6">
                Pilihan tepat bagi pasangan yang ingin tim profesional mengatur seluruh komposisi dan visual tanpa perlu menyusun sendiri di editor.
              </p>

              <div className="mb-6 pb-6 border-b border-neutral-100">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">HARGA LAYANAN</span>
                <span className="font-serif text-3xl font-medium text-neutral-900">Rp 399.000</span>
              </div>

              <ul className="space-y-3 text-xs text-neutral-600 font-light">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Desain layout personal disesuaikan dengan foto Anda</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Termasuk seluruh fitur dasar & add-on penting</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>2x putaran revisi resmi</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pengerjaan 3-5 hari kerja</span>
                </li>
              </ul>
            </div>

            <Link
              href="/custom/brief?package=made-for-you"
              className="mt-8 w-full inline-flex items-center justify-center gap-2 py-4 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors"
            >
              <span>Mulai Brief Made For You</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Tier 2: Exclusive */}
          <div className="p-8 sm:p-10 border-2 border-black bg-white flex flex-col justify-between shadow-xl relative">
            <div className="absolute -top-3.5 right-6 bg-black text-white text-[9px] uppercase tracking-widest px-3 py-1 font-medium">
              MOST BESPOKE
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">
                TIER 02
              </span>
              <h3 className="font-serif text-3xl uppercase tracking-wide">Exclusive Atelier</h3>
              <p className="text-xs text-neutral-500 font-light mt-2 mb-6">
                Karya seni digital seutuhnya. Urutan interaksi sinematik pembuka amplop, visual storytelling khusus, dan asistensi desainer intensif.
              </p>

              <div className="mb-6 pb-6 border-b border-neutral-100">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">HARGA LAYANAN</span>
                <span className="font-serif text-3xl font-medium text-neutral-900">Rp 799.000</span>
              </div>

              <ul className="space-y-3 text-xs text-neutral-600 font-light">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom motion & interactive envelope opening</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Struktur editorial bercerita (visual storytelling khusus)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Revisi prioritas tak terbatas (sesuai koridor konsep)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dedicated art director via WhatsApp</span>
                </li>
              </ul>
            </div>

            <Link
              href="/custom/brief?package=exclusive"
              className="mt-8 w-full inline-flex items-center justify-center gap-2 py-4 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors"
            >
              <span>Mulai Brief Exclusive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <MinimalFooter />
    </div>
  );
}
