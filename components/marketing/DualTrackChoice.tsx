'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function DualTrackChoice() {
  return (
    <section className="py-20 sm:py-28 border-b border-[#EAE6DF] bg-[#F8F6F2]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Editorial Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C827A] font-medium">
            TWO PATHWAYS · DUA JALUR LAYANAN
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#1F1B18] mt-3">
            Pilih Cara Anda Menghadirkan Momen
          </h2>
          <div className="w-10 h-[1px] bg-[#D8D2C7] mx-auto mt-4 mb-4" />
          <p className="text-xs sm:text-sm text-[#6E6761] font-light leading-relaxed">
            Bangun undangan Anda secara mandiri dengan fleksibilitas penuh, atau percayakan kepada tim desainer kami untuk karya personal yang dirancang khusus.
          </p>
        </div>

        {/* Harmonious Dual Track Grid - Warm Fine-Paper Editorial Styling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-stretch">
          {/* Track 1: Make It Yourself (DIY) */}
          <div className="bg-[#FCFBF9] border border-[#E7E2DA] flex flex-col justify-between group transition-all duration-500 hover:border-[#C8C1B5] hover:shadow-lg overflow-hidden">
            <div>
              {/* Refined Fine-Art Stationery Photography */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#F2EDE5] border-b border-[#EAE4DC]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop"
                  alt="Make It Yourself - Fine Art Wedding Stationery"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-6 px-3 py-1 text-[9px] uppercase tracking-widest bg-[#FCFBF9]/90 text-[#3B3530] backdrop-blur-xs font-medium border border-[#E7E2DA]/80">
                  ATELIER DIY · MANDIRI
                </span>
              </div>

              {/* Content Body */}
              <div className="p-8 sm:p-10">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#8C827A] mb-2 font-medium">
                  JALUR 01 · KREASI MANDIRI
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-wide text-[#1F1B18]">
                  Make It Yourself
                </h3>

                <p className="mt-4 text-xs sm:text-[13px] text-[#5C554F] leading-relaxed font-light">
                  Pilih dari kurasi template editorial kami, lengkapi data mempelai &amp; rangkaian acara, dan terbitkan undangan pernikahan Anda dalam hitungan menit dengan kendali penuh.
                </p>

                {/* Editorial Details List */}
                <div className="mt-8 space-y-3 pt-6 border-t border-[#EFEBE4] text-xs text-[#5C554F] font-light">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[#A89F95] font-serif text-sm select-none">—</span>
                    <span>Akses penuh ke seluruh koleksi template editorial eksklusif</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-[#A89F95] font-serif text-sm select-none">—</span>
                    <span>Interactive builder responsif untuk preview mobile &amp; desktop seketika</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-[#A89F95] font-serif text-sm select-none">—</span>
                    <span>Katalog add-on modular transparan tanpa biaya tersembunyi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Investment & Action Bar */}
            <div className="p-8 sm:p-10 pt-6 border-t border-[#EFEBE4] bg-[#F7F4EE]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#8C827A] block font-medium">
                  ESTIMASI INVESTASI
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-serif text-2xl sm:text-3xl text-[#1F1B18]">
                    Rp 99.000
                  </span>
                  <span className="text-[11px] text-[#8C827A] font-light">/ undangan</span>
                </div>
              </div>

              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs uppercase tracking-widest bg-[#221F1D] text-[#FAF8F5] hover:bg-[#3D3834] transition-all duration-300 shadow-xs group-hover:shadow-sm"
              >
                <span>MULAI BUAT MANDIRI</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[#D8D2C7]" />
              </Link>
            </div>
          </div>

          {/* Track 2: Made For You (Custom Bespoke Atelier) */}
          <div className="bg-[#FAF7F2] border border-[#DDD6CB] flex flex-col justify-between group transition-all duration-500 hover:border-[#C4B8A6] hover:shadow-lg overflow-hidden relative">
            {/* Delicate Atelier Corner Accent */}
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
              <div className="absolute transform rotate-45 bg-[#E8E1D5] text-[#7A6B59] text-[8px] uppercase tracking-wider py-1 right-[-35px] top-[15px] w-[120px] text-center font-medium">
                BESPOKE
              </div>
            </div>

            <div>
              {/* Warm Editorial Couple Photography */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#EFE9DF] border-b border-[#EAE4DC]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
                  alt="Made For You - Bespoke Atelier Wedding"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-6 px-3 py-1 text-[9px] uppercase tracking-widest bg-[#FAF7F2]/90 text-[#7A6038] backdrop-blur-xs font-medium border border-[#D8CBB6]/80">
                  BESPOKE ATELIER · DIBUATKAN
                </span>
              </div>

              {/* Content Body */}
              <div className="p-8 sm:p-10">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#8E6E45] mb-2 font-medium">
                  JALUR 02 · KARYA PERSONAL
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-wide text-[#1F1B18]">
                  Made For You
                </h3>

                <p className="mt-4 text-xs sm:text-[13px] text-[#5C554F] leading-relaxed font-light">
                  Serahkan seluruh proses kepada desainer kami. Kami merancang layout kustom, urutan motion sinematik, dan tipografi eksklusif yang diselaraskan dengan konsep pernikahan Anda.
                </p>

                {/* Editorial Details List */}
                <div className="mt-8 space-y-3 pt-6 border-t border-[#EAE3D7] text-xs text-[#5C554F] font-light">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[#9E7D47] font-serif text-sm select-none">—</span>
                    <span>Tata letak bespoke &amp; eksplorasi visual khusus di luar template standar</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-[#9E7D47] font-serif text-sm select-none">—</span>
                    <span>Cinematic motion sequence, transisi amplop custom, &amp; kurasi musik</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-[#9E7D47] font-serif text-sm select-none">—</span>
                    <span>Konsultasi personal 1-on-1 dengan desainer, review draft, &amp; garansi revisi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Investment & Action Bar */}
            <div className="p-8 sm:p-10 pt-6 border-t border-[#EAE3D7] bg-[#F3EFE7]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#8C827A] block font-medium">
                  ESTIMASI INVESTASI
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-serif text-2xl sm:text-3xl text-[#1F1B18]">
                    Rp 399.000
                  </span>
                  <span className="text-[11px] text-[#8C827A] font-light">/ paket bespoke</span>
                </div>
              </div>

              <Link
                href="/services/custom"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs uppercase tracking-widest bg-[#221F1D] text-[#FAF8F5] hover:bg-[#3D3834] transition-all duration-300 shadow-xs group-hover:shadow-sm border border-[#C5A880]/30"
              >
                <span>KONSULTASI</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[#D4AF37]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

