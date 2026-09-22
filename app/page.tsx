'use client';

import React from 'react';
import Link from 'next/link';
import { MinimalNav } from '@/components/marketing/MinimalNav';
import { HeroSection } from '@/components/marketing/HeroSection';
import { DualTrackChoice } from '@/components/marketing/DualTrackChoice';
import { TemplateGrid } from '@/components/marketing/TemplateGrid';
import { MinimalFooter } from '@/components/marketing/MinimalFooter';
import { ShieldCheck, Volume2, Smartphone, Globe, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8F7F3] text-[#111111]">
      <MinimalNav />

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Dual-Track Choice: Make It Yourself vs Made For You */}
      <DualTrackChoice />

      {/* 3. Curated Template Showcase */}
      <TemplateGrid />

      {/* 4. Editorial Value Statement */}
      <section className="py-24 px-6 sm:px-8 bg-white border-y border-neutral-200/80">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-ultra text-neutral-400">
            OUR PHILOSOPHY
          </p>
          <blockquote className="font-serif text-3xl sm:text-5xl font-light text-neutral-900 leading-tight uppercase tracking-tight mt-6">
            &ldquo;Luxury is not about excess ornamentation.<br />
            It is about the confidence of clean lines, intentional whitespace, and timeless typography.&rdquo;
          </blockquote>
          <div className="w-12 h-[1px] bg-neutral-300 mx-auto mt-8 mb-4" />
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            THE KERTAS.KATA STANDARD
          </p>
        </div>
      </section>


      {/* 6. Feature Highlights */}
      <section className="py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-ultra text-neutral-400">
            TECHNICAL EXCELLENCE
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl uppercase tracking-tight text-[#111111] mt-2">
            Crafted For Flawless Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="p-8 border border-neutral-200 bg-white/70">
            <Smartphone className="w-6 h-6 text-neutral-800 mb-4" />
            <h4 className="font-serif text-xl uppercase mb-2">Mobile First</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              95% tamu membuka undangan melalui smartphone. Setiap layout kami dioptimalkan secara presisi untuk layar iPhone & Android.
            </p>
          </div>

          <div className="p-8 border border-neutral-200 bg-white/70">
            <Globe className="w-6 h-6 text-neutral-800 mb-4" />
            <h4 className="font-serif text-xl uppercase mb-2">Sebar Tanpa Batas</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              Tidak ada batasan jumlah tamu atau traffic link. Kirim ke ribuan tamu tanpa rasa khawatir kuota terbatas.
            </p>
          </div>

          <div className="p-8 border border-neutral-200 bg-white/70">
            <Volume2 className="w-6 h-6 text-neutral-800 mb-4" />
            <h4 className="font-serif text-xl uppercase mb-2">Audio Architecture</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              Menghormati kebijakan browser modern dengan unlock audio cerdas saat cover dibuka, lengkap dengan floating mute toggle.
            </p>
          </div>

          <div className="p-8 border border-neutral-200 bg-white/70">
            <ShieldCheck className="w-6 h-6 text-neutral-800 mb-4" />
            <h4 className="font-serif text-xl uppercase mb-2">Preview Sebelum Bayar</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              Kustomisasi seluruh konten secara utuh dan lihat preview langsung. Pembayaran hanya dilakukan jika Anda sudah puas.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-20 px-6 sm:px-8 bg-white border-t border-neutral-200/80">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-ultra text-neutral-400">
              QUESTIONS & ANSWERS
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-wider mt-2">
              Pertanyaan Umum
            </h2>
          </div>

          <div className="divide-y divide-neutral-200 text-xs sm:text-sm">
            <div className="py-6">
              <h4 className="font-serif text-lg font-medium text-neutral-900 mb-2">
                Apa perbedaan mendasar antara Buat Sendiri (DIY) dan Dibuatkan (Custom)?
              </h4>
              <p className="text-neutral-500 font-light leading-relaxed">
                Pada jalur DIY, Anda memilih template dan mengonfigurasi opsi yang sudah disediakan builder secara mandiri. Pada jalur Custom, tim desainer profesional kami merancang layout, urutan animasi, dan motion khusus sesuai brief dan referensi unik Anda.
              </p>
            </div>

            <div className="py-6">
              <h4 className="font-serif text-lg font-medium text-neutral-900 mb-2">
                Apakah saya bisa mencoba dan melihat preview sebelum membayar?
              </h4>
              <p className="text-neutral-500 font-light leading-relaxed">
                Tentu. Anda bebas memilih template, memasukkan nama mempelai, foto, dan event, lalu melihat tampilan mobile & desktop preview secara live tanpa biaya. Pembayaran hanya dibutuhkan ketika Anda hendak mengaktifkan URL publik.
              </p>
            </div>

            <div className="py-6">
              <h4 className="font-serif text-lg font-medium text-neutral-900 mb-2">
                Bagaimana cara membuat nama tamu personal di link?
              </h4>
              <p className="text-neutral-500 font-light leading-relaxed">
                Di Customer Dashboard, Anda cukup memasukkan nama tamu (misal: Budi Santoso), sistem akan otomatis menghasilkan URL unik <code>/julian-nadia/budi-santoso</code> dengan ucapan khusus di sampul depan, serta template pesan WhatsApp siap kirim.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Bottom Editorial CTA */}
      <section className="py-24 px-6 sm:px-8 bg-[#111111] text-[#F8F7F3] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl sm:text-6xl uppercase tracking-tight">
            Ready to tell<br />your story?
          </h2>
          <p className="mt-6 text-sm text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
            Mulai eksplorasi template pilihan atau diskusikan konsep kustom bersama tim desainer kami hari ini.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/create"
              className="w-full sm:w-auto px-8 py-4 text-xs uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-colors"
            >
              CREATE INVITATION
            </Link>
            <Link
              href="/services/custom"
              className="w-full sm:w-auto px-8 py-4 text-xs uppercase tracking-widest border border-neutral-700 text-white hover:border-white transition-colors"
            >
              CUSTOM SERVICE
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Minimal Footer */}
      <MinimalFooter />
    </main>
  );
}
