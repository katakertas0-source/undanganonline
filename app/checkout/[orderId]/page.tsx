'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getOrderById, markOrderAsPaid, getInvitationById } from '@/lib/store';
import { Order, Invitation } from '@/types';
import { MinimalNav } from '@/components/marketing/MinimalNav';
import { MinimalFooter } from '@/components/marketing/MinimalFooter';
import { QrCode, CreditCard, ShieldCheck, Check, ArrowRight } from 'lucide-react';

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'BCA_VA' | 'MANDIRI_VA'>('QRIS');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const ord = getOrderById(orderId);
    if (ord) {
      setOrder(ord);
      const inv = getInvitationById(ord.invitationId);
      if (inv) setInvitation(inv);
    }
  }, [orderId]);

  if (!order || !invitation) {
    return (
      <div className="min-h-screen bg-[#F8F7F3] flex items-center justify-center text-xs text-neutral-400">
        Memuat invoice pembayaran...
      </div>
    );
  }

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      markOrderAsPaid(order.id, paymentMethod);
      router.push(`/checkout/success?orderId=${order.id}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#111111]">
      <MinimalNav />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-ultra text-neutral-400 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>SECURE CHECKOUT · AUTO-PUBLISH</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl uppercase tracking-wide">
            Penyelesaian Pembayaran
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Order #{order.orderNumber} · {invitation.title}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Payment Method & Simulation */}
          <div className="md:col-span-7 bg-white border border-neutral-200 p-8 space-y-6">
            <h3 className="font-serif text-xl uppercase tracking-wide">
              Pilih Metode Pembayaran
            </h3>

            <div className="space-y-3">
              <div
                onClick={() => setPaymentMethod('QRIS')}
                className={`p-4 border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'QRIS'
                    ? 'border-black bg-neutral-50 ring-1 ring-black'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <QrCode className="w-5 h-5 text-neutral-800" />
                  <div>
                    <p className="font-medium text-xs">QRIS (Instant Scan)</p>
                    <p className="text-[10px] text-neutral-400">BCA, Mandiri, GoPay, OVO, ShopeePay</p>
                  </div>
                </div>
                {paymentMethod === 'QRIS' && <Check className="w-4 h-4 text-black" />}
              </div>

              <div
                onClick={() => setPaymentMethod('BCA_VA')}
                className={`p-4 border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'BCA_VA'
                    ? 'border-black bg-neutral-50 ring-1 ring-black'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-neutral-800" />
                  <div>
                    <p className="font-medium text-xs">BCA Virtual Account</p>
                    <p className="text-[10px] text-neutral-400">Verifikasi otomatis 24 jam</p>
                  </div>
                </div>
                {paymentMethod === 'BCA_VA' && <Check className="w-4 h-4 text-black" />}
              </div>

              <div
                onClick={() => setPaymentMethod('MANDIRI_VA')}
                className={`p-4 border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'MANDIRI_VA'
                    ? 'border-black bg-neutral-50 ring-1 ring-black'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-neutral-800" />
                  <div>
                    <p className="font-medium text-xs">Mandiri Virtual Account</p>
                    <p className="text-[10px] text-neutral-400">Verifikasi otomatis 24 jam</p>
                  </div>
                </div>
                {paymentMethod === 'MANDIRI_VA' && <Check className="w-4 h-4 text-black" />}
              </div>
            </div>

            {/* Simulated QR Code display */}
            {paymentMethod === 'QRIS' && (
              <div className="p-6 border border-dashed border-neutral-300 bg-neutral-50 text-center rounded">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-4">
                  SIMULASI QRIS PEMBAYARAN
                </p>
                <div className="w-36 h-36 mx-auto bg-white border border-neutral-300 p-2 shadow-sm flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SIMULATED_UNDANGAN_ONLINE_PAYMENT"
                    alt="Simulated QRIS"
                    className="w-full h-full"
                  />
                </div>
                <p className="text-[11px] text-neutral-500 mt-3 font-light">
                  Klik tombol konfirmasi di samping untuk mensimulasikan pembayaran berhasil seketika.
                </p>
              </div>
            )}
          </div>

          {/* Right: Itemized Invoice Summary */}
          <div className="md:col-span-5 bg-white border border-neutral-200 p-8 space-y-6">
            <div className="border-b border-neutral-200 pb-3">
              <span className="text-xs uppercase tracking-widest text-neutral-400">
                RINGKASAN ORDER
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-neutral-800">{item.itemName}</p>
                    <p className="text-[10px] text-neutral-400 uppercase">{item.itemType}</p>
                  </div>
                  <span className="font-serif text-sm">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t-2 border-neutral-900 space-y-2">
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Subtotal</span>
                <span className="font-serif">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Diskon Promo</span>
                <span className="font-serif text-emerald-600">Rp 0</span>
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-xs uppercase tracking-widest text-neutral-900 font-medium">
                  TOTAL AKHIR
                </span>
                <span className="font-serif text-2xl font-semibold text-neutral-950">
                  Rp {order.netAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-4 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isProcessing ? (
                <span>Memproses Verifikasi...</span>
              ) : (
                <>
                  <span>Bayar & Aktifkan Undangan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-neutral-400 font-light">
              Setelah pembayaran terverifikasi, status undangan otomatis menjadi <strong>ACTIVE</strong> dan link publik langsung dapat disebar.
            </p>
          </div>
        </div>
      </main>

      <MinimalFooter />
    </div>
  );
}
