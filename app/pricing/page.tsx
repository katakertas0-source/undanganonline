'use client';

import React from 'react';
import Link from 'next/link';
import { MinimalNav } from '@/components/marketing/MinimalNav';
import { MinimalFooter } from '@/components/marketing/MinimalFooter';
import { getAllAddons } from '@/lib/store';
import { Check, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const addons = getAllAddons();

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#111111]">
      <MinimalNav />

      {/* Header */}
      <section className="py-20 px-6 sm:px-8 border-b border-neutral-200 text-center max-w-4xl mx-auto">
        <div className="inline-block px-3.5 py-1 text-[10px] uppercase tracking-ultra text-neutral-600 border border-neutral-300 rounded-full mb-2 bg-white/70">
          <span>TRANSPARENT PRICING</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl uppercase tracking-tight">
          Paket & Layanan
        </h1>
        <p className="mt-4 text-xs sm:text-sm text-neutral-500 font-light max-w-lg mx-auto leading-relaxed">
          Pilih jalur pembuatan yang paling sesuai untuk hari istimewa Anda. Mandiri dengan Interactive Builder, atau didampingi desainer profesional kami.
        </p>
      </section>

      {/* DIY Packages Grid */}
      <section className="py-20 px-6 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-ultra text-neutral-400">JALUR 01 — BUAT SENDIRI</span>
          <h2 className="font-serif text-3xl uppercase tracking-tight mt-1">Paket DIY Interactive</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Essential Card */}
          <div className="bg-white border border-neutral-200 p-8 sm:p-10 flex flex-col justify-between hover:border-neutral-400 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 border border-neutral-200 text-neutral-500">
                    STARTER
                  </span>
                  <h3 className="font-serif text-3xl uppercase tracking-wide mt-2">Essential</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-neutral-400">Mulai</span>
                  <p className="font-serif text-3xl font-medium">Rp 99.000</p>
                </div>
              </div>

              <p className="text-xs text-neutral-500 font-light leading-relaxed mb-8">
                Solusi elegan untuk pasangan yang menginginkan undangan digital ringkas, bersih, dan fungsional.
              </p>

              <div className="space-y-3 text-xs border-t border-neutral-100 pt-6">
                <div className="flex items-center gap-2 text-neutral-700">
                  <Check className="w-4 h-4 text-neutral-900 shrink-0" />
                  <span>Koleksi Template Essential (Aurelia, Céline)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Check className="w-4 h-4 text-neutral-900 shrink-0" />
                  <span>Galeri Standar (Hingga 10 Foto)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Check className="w-4 h-4 text-neutral-900 shrink-0" />
                  <span>Google Maps & Navigasi Lokasi</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Check className="w-4 h-4 text-neutral-900 shrink-0" />
                  <span>Hitung Mundur Acara (Countdown)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Check className="w-4 h-4 text-neutral-900 shrink-0" />
                  <span>Background Music (Bebas Upload Lagu Sendiri / Koleksi)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400 font-light">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400">Dukungan Add-on:</span>
                  <span>Tersedia modular di dalam Builder</span>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-neutral-100">
              <Link
                href="/create?package=pkg-essential"
                className="w-full py-3.5 text-xs uppercase tracking-widest border border-neutral-900 text-neutral-900 hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <span>PILIH ESSENTIAL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Premium Card */}
          <div className="bg-[#111111] text-white border border-neutral-800 p-8 sm:p-10 flex flex-col justify-between relative shadow-xl">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-white text-black px-3 py-1 text-[9px] uppercase tracking-widest font-semibold">
              PALING POPULER
            </div>

            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 border border-neutral-700 text-neutral-300">
                    FULL EXPERIENCE
                  </span>
                  <h3 className="font-serif text-3xl uppercase tracking-wide mt-2">Premium</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-neutral-400">Mulai</span>
                  <p className="font-serif text-3xl font-medium">Rp 199.000</p>
                </div>
              </div>

              <p className="text-xs text-neutral-400 font-light leading-relaxed mb-8">
                Seluruh kemewahan digital tanpa kompromi. Termasuk animasi sinematik, Love Story, dan konfirmasi kehadiran digital RSVP.
              </p>

              <div className="space-y-3 text-xs border-t border-neutral-800 pt-6">
                <div className="flex items-center gap-2 text-neutral-200">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Akses Semua Template (Termasuk Living Video & Nocturne)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-200">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Background Music (Bebas Upload Lagu Sendiri / Koleksi)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-200">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Premium Animation Preset (Curtain Reveal & Parallax)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-200">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Love Story Timeline Interaktif</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-200">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Sistem Digital RSVP & Buku Tamu</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-200">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Galeri Lengkap Hingga 30+ Foto</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400 font-light">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400">Add-on Opsional:</span>
                  <span>Video Prewed & Nama Tamu Personal</span>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-neutral-800">
              <Link
                href="/create?package=pkg-premium"
                className="w-full py-3.5 text-xs uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>PILIH PREMIUM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Service Overview */}
      <section className="py-20 px-6 sm:px-8 bg-white border-y border-neutral-200/80">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] uppercase tracking-ultra text-neutral-400">JALUR 02 — DIBUATKAN OLEH KAMI</span>
          <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-tight mt-2">
            Desain Kustom Eksklusif
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-neutral-500 font-light max-w-xl mx-auto leading-relaxed">
            Tidak memiliki waktu atau ingin arahan visual yang sepenuhnya unik? Serahkan data dan referensi Anda kepada tim desainer editorial kami.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 text-left">
            <div className="p-6 border border-neutral-200 bg-[#F8F7F3]">
              <span className="text-[9px] uppercase tracking-widest text-neutral-500">SERVICE TIER 01</span>
              <h3 className="font-serif text-2xl uppercase mt-1">Made For You</h3>
              <p className="font-serif text-xl font-medium mt-2">Rp 499.000</p>
              <p className="text-xs text-neutral-500 font-light mt-3 leading-relaxed">
                Kami tata seluruh foto, copywriting, dan detail acara Anda ke dalam template editorial pilihan dengan supervisi desainer langsung.
              </p>
              <Link
                href="/services/custom?tier=made-for-you"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold mt-6 text-neutral-900 hover:underline"
              >
                <span>KONSULTASI BRIEF</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-6 border border-neutral-200 bg-[#F8F7F3]">
              <span className="text-[9px] uppercase tracking-widest text-neutral-500">SERVICE TIER 02</span>
              <h3 className="font-serif text-2xl uppercase mt-1">Exclusive Bespoke</h3>
              <p className="font-serif text-xl font-medium mt-2">Rp 1.250.000</p>
              <p className="text-xs text-neutral-500 font-light mt-3 leading-relaxed">
                Desain bespoke dari awal: motion custom, skema warna khusus, tipografi eksklusif, dan asistensi 1-on-1 hingga hari H.
              </p>
              <Link
                href="/services/custom?tier=exclusive"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold mt-6 text-neutral-900 hover:underline"
              >
                <span>KONSULTASI BRIEF</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Add-on Reference Table (Information Only, non-marketing) */}
      <section className="py-24 px-6 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-ultra text-neutral-400">ARSITEKTUR MODULAR</span>
          <h2 className="font-serif text-3xl uppercase tracking-tight mt-1">
            Daftar Add-on di dalam Builder
          </h2>
          <p className="text-xs text-neutral-500 font-light mt-2 max-w-md mx-auto">
            Add-on dapat Anda pilih langsung di dalam Interactive Builder setelah memilih paket utama.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-[10px] uppercase tracking-wider text-neutral-500">
                <th className="p-4">NAMA ADD-ON</th>
                <th className="p-4">KATEGORI</th>
                <th className="p-4">DESKRIPSI LENGKAP</th>
                <th className="p-4 text-right">HARGA SATUAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {addons.map((a) => (
                <tr key={a.id} className="hover:bg-neutral-50/50">
                  <td className="p-4 font-medium text-neutral-900">{a.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider border border-neutral-200 text-neutral-500 rounded">
                      {a.category}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-500 font-light max-w-md">{a.description}</td>
                  <td className="p-4 text-right font-serif text-sm font-medium text-neutral-900">
                    +Rp {a.defaultPrice.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <MinimalFooter />
    </div>
  );
}
