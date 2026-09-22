'use client';

import React from 'react';
import { Invitation, DiyPackage, Addon } from '@/types';
import { X, ShieldCheck, ArrowRight } from 'lucide-react';

interface FinalBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  invitation: Invitation;
  pkg: DiyPackage;
  basePrice: number;
  paidAddons: Addon[];
  totalAmount: number;
  isProcessing?: boolean;
}

export function FinalBillingModal({
  isOpen,
  onClose,
  onConfirm,
  invitation,
  pkg,
  basePrice,
  paidAddons,
  totalAmount,
  isProcessing = false,
}: FinalBillingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Modal Card */}
      <div className="bg-[#F8F7F3] text-[#111111] border border-neutral-300 w-full max-w-lg shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-black transition-colors"
          aria-label="Tutup Ringkasan"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center pb-6 border-b border-neutral-200">
            <span className="text-[10px] uppercase tracking-ultra text-neutral-400">
              TAHAP FINAL SEBELUM LIVE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-tight mt-1">
              Ringkasan Pesanan
            </h2>
            <p className="text-xs text-neutral-500 font-light mt-2 max-w-sm mx-auto leading-relaxed">
              Periksa kembali rincian paket dan fitur tambahan untuk undangan <strong>{invitation.title}</strong>.
            </p>
          </div>

          {/* Itemized Order Breakdown */}
          <div className="py-6 space-y-4 text-xs">
            {/* 1. Base Package */}
            <div className="flex items-start justify-between pb-3 border-b border-neutral-200/80">
              <div>
                <p className="font-serif text-base uppercase tracking-wide font-medium">
                  Paket {pkg.name}
                </p>
                <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                  Template digital & konfigurasi builder interaktif
                </p>
              </div>
              <span className="font-serif text-sm font-semibold">
                Rp {basePrice.toLocaleString('id-ID')}
              </span>
            </div>

            {/* 2. Paid Add-ons */}
            {paidAddons.length > 0 ? (
              <div className="space-y-3 pt-1">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">
                  ADD-ONS TERPILIH
                </span>
                {paidAddons.map((addon) => (
                  <div key={addon.id} className="flex items-center justify-between text-neutral-700">
                    <div>
                      <p className="font-medium text-xs text-neutral-900">{addon.name}</p>
                      <p className="text-[10px] text-neutral-400 font-light">{addon.category.toUpperCase()}</p>
                    </div>
                    <span className="font-serif text-xs font-medium text-neutral-900">
                      +Rp {addon.defaultPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-2 text-[11px] text-neutral-400 font-light italic">
                Tidak ada add-on tambahan berbayar dipilih.
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-neutral-300 pt-4 mt-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest font-semibold text-neutral-900 block">
                    TOTAL
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Termasuk seluruh akses fitur dan link publik
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 py-3 text-[11px] text-neutral-500 bg-white/70 border border-neutral-200/80 mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Link publik akan langsung aktif segera setelah konfirmasi pembayaran.</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className="w-full py-4 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-500 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <span>{isProcessing ? 'Memproses Pesanan...' : 'BAYAR & ONLINEKAN'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              type="button"
              disabled={isProcessing}
              className="w-full py-3 text-xs uppercase tracking-widest border border-neutral-300 text-neutral-700 hover:bg-white hover:text-black transition-colors"
            >
              Kembali ke Editor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
