'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Plus, ArrowRight } from 'lucide-react';
import { getAllAddons } from '@/lib/store';

export function AddonCatalogPreview() {
  const addons = getAllAddons();
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([
    'premium-animation',
    'music-backsound',
    'rsvp-system',
  ]);

  const basePrice = 99000;
  const addonsTotal = addons
    .filter((a) => selectedAddonIds.includes(a.id))
    .reduce((sum, a) => sum + a.defaultPrice, 0);

  const grandTotal = basePrice + addonsTotal;

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-24 px-6 sm:px-8 bg-[#F8F7F3] border-b border-neutral-200/70">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[10px] uppercase tracking-ultra text-neutral-400">
            TRANSPARENT & MODULAR
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl uppercase tracking-tight text-[#111111] mt-2">
            The Add-on System
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
            Hanya bayar fitur yang Anda butuhkan. Pilih template dasar, tambahkan fitur premium secara modular, dan lihat harga kalkulasi secara realtime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Addon Selector List */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addons.map((addon) => {
              const isSelected = selectedAddonIds.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`p-5 border cursor-pointer transition-all select-none flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-black shadow-sm'
                      : 'bg-white/60 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                        {addon.category}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-black text-white border-black'
                            : 'border-neutral-300 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                    <h4 className="font-serif text-lg text-neutral-900 font-medium">
                      {addon.name}
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-light mt-1 line-clamp-2">
                      {addon.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-serif">
                    <span className="text-neutral-400 font-sans text-[10px] uppercase">HARGA</span>
                    <span className="font-medium text-neutral-900">
                      +Rp {addon.defaultPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Realtime Order Simulator Card */}
          <div className="lg:col-span-5 sticky top-28 bg-white border border-neutral-200 p-8 sm:p-10 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
              <span className="text-xs uppercase tracking-widest text-neutral-400">
                SIMULASI ESTIMASI ORDER
              </span>
              <span className="text-[10px] uppercase tracking-widest bg-neutral-100 px-2.5 py-1 text-neutral-600">
                REALTIME
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <div>
                  <p className="font-medium text-neutral-900">Template Aurelia (Base)</p>
                  <p className="text-[10px] text-neutral-400">Termasuk profil, acara, maps, gallery dasar</p>
                </div>
                <span className="font-serif text-sm">Rp {basePrice.toLocaleString('id-ID')}</span>
              </div>

              {selectedAddonIds.map((id) => {
                const addon = addons.find((a) => a.id === id);
                if (!addon) return null;
                return (
                  <div key={id} className="flex justify-between items-center text-neutral-600">
                    <span>+ {addon.name}</span>
                    <span className="font-serif">Rp {addon.defaultPrice.toLocaleString('id-ID')}</span>
                  </div>
                );
              })}

              {selectedAddonIds.length === 0 && (
                <p className="text-neutral-400 italic text-[11px] py-2">
                  Tidak ada add-on tambahan yang dipilih.
                </p>
              )}
            </div>

            <div className="mt-8 pt-6 border-t-2 border-neutral-900 flex justify-between items-baseline">
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-400 block">
                  TOTAL ESTIMASI
                </span>
                <span className="text-[10px] text-neutral-400">Bayar setelah puas dengan preview</span>
              </div>
              <span className="font-serif text-3xl font-normal text-neutral-950">
                Rp {grandTotal.toLocaleString('id-ID')}
              </span>
            </div>

            <Link
              href="/create"
              className="mt-8 w-full inline-flex items-center justify-center gap-2 py-4 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors"
            >
              <span>MULAI BUAT SEKARANG</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
