'use client';

import React from 'react';
import { MinimalNav } from '@/components/marketing/MinimalNav';
import { MinimalFooter } from '@/components/marketing/MinimalFooter';
import { DualTrackChoice } from '@/components/marketing/DualTrackChoice';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#111111]">
      <MinimalNav />

      {/* Header */}
      <section className="py-20 px-6 sm:px-8 border-b border-neutral-200 text-center max-w-4xl mx-auto">
        <p className="text-[10px] uppercase tracking-ultra text-neutral-400 mb-2">
          TWO PATHWAYS · ONE UNIFIED ENGINE
        </p>
        <h1 className="font-serif text-4xl sm:text-6xl uppercase tracking-tight">
          Layanan & Metode Pembuatan
        </h1>
        <p className="mt-4 text-xs sm:text-sm text-neutral-500 font-light max-w-lg mx-auto leading-relaxed">
          Temukan cara terbaik menciptakan undangan digital Anda. Buat secara mandiri dalam hitungan menit, atau biarkan desainer kami merancangnya khusus untuk Anda.
        </p>
      </section>

      {/* 50 / 50 Dual Track Showcase */}
      <DualTrackChoice />

      {/* Comparison Matrix Table */}
      <section className="py-20 px-6 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl uppercase tracking-wide">
            Perbandingan Detail Layanan
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Transparansi penuh mengenai hak akses, fleksibilitas, dan dukungan teknis.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-[10px] uppercase tracking-wider text-neutral-500">
                <th className="p-4 sm:p-5">FITUR / KAPABILITAS</th>
                <th className="p-4 sm:p-5 text-center">BUAT SENDIRI (DIY)</th>
                <th className="p-4 sm:p-5 text-center bg-[#FAF7F2] text-[#8E6E45] border-l border-neutral-200 font-medium">DIBUATKAN (BESPOKE)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <tr>
                <td className="p-4 sm:p-5 font-medium">Invitation Engine & Hosting</td>
                <td className="p-4 sm:p-5 text-center text-neutral-600">Unified Engine Resmi</td>
                <td className="p-4 sm:p-5 text-center font-medium bg-[#FAF7F2]/50 border-l border-neutral-100">Unified Engine Resmi</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium">Batas Tamu & Traffic</td>
                <td className="p-4 sm:p-5 text-center text-emerald-700 font-medium">Sebar Tanpa Batas</td>
                <td className="p-4 sm:p-5 text-center text-emerald-700 font-medium bg-[#FAF7F2]/50 border-l border-neutral-100">Sebar Tanpa Batas</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium">Kustomisasi Layout</td>
                <td className="p-4 sm:p-5 text-center text-neutral-500">Preset Pilihan Template</td>
                <td className="p-4 sm:p-5 text-center font-medium text-[#1F1B18] bg-[#FAF7F2]/50 border-l border-neutral-100">Layout Bebas & Bespoke</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium">Cinematic Animation Opening</td>
                <td className="p-4 sm:p-5 text-center text-neutral-500">Preset Standard</td>
                <td className="p-4 sm:p-5 text-center font-medium text-[#1F1B18] bg-[#FAF7F2]/50 border-l border-neutral-100">Urutan Motion Khusus (Envelope Open)</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium">Dukungan Desainer & Revisi</td>
                <td className="p-4 sm:p-5 text-center text-neutral-400">— (Mandiri)</td>
                <td className="p-4 sm:p-5 text-center font-medium text-[#1F1B18] bg-[#FAF7F2]/50 border-l border-neutral-100">2x Hingga Unlimited Sesuai Paket</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium">Waktu Pengerjaan</td>
                <td className="p-4 sm:p-5 text-center text-neutral-600">Instan (10 Menit)</td>
                <td className="p-4 sm:p-5 text-center text-neutral-600 bg-[#FAF7F2]/50 border-l border-neutral-100">3 - 7 Hari Kerja</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium">Estimasi Biaya</td>
                <td className="p-4 sm:p-5 text-center font-serif text-sm">Mulai Rp 99.000</td>
                <td className="p-4 sm:p-5 text-center font-serif text-sm font-semibold text-[#8E6E45] bg-[#FAF7F2]/50 border-l border-neutral-100">Mulai Rp 399.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <MinimalFooter />
    </div>
  );
}
