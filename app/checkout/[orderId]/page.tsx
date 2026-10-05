'use client';

import React, { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getOrderById, markOrderAsPaid, getInvitationById } from '@/lib/store';
import { Order, Invitation } from '@/types';
import { MinimalNav } from '@/components/marketing/MinimalNav';
import { MinimalFooter } from '@/components/marketing/MinimalFooter';
import {
  QrCode,
  CreditCard,
  ShieldCheck,
  Check,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'LYNK' | 'QRIS' | 'BCA_VA' | 'MANDIRI_VA'>('LYNK');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{ paymentUrl?: string | null; refId?: string } | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial Order Retrieval (from server API with local fallback)
  useEffect(() => {
    let isMounted = true;

    async function fetchOrderDetails() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.order && isMounted) {
            setOrder(data.order);
            if (data.invitation) {
              setInvitation(data.invitation);
            }
            if (data.payment) {
              setPaymentInfo(data.payment);
            }
            return;
          }
        }
      } catch {
        // Fallback to local store
      }

      const ord = getOrderById(orderId);
      if (ord && isMounted) {
        setOrder(ord);
        const inv = getInvitationById(ord.invitationId);
        if (inv) setInvitation(inv);
      }
    }

    fetchOrderDetails();

    return () => {
      isMounted = false;
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [orderId]);

  // 2. Poll server for payment confirmation (Reconciliation check)
  useEffect(() => {
    if (!order || order.paymentStatus === 'PAID' || order.status === 'paid') return;

    pollTimerRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.order?.paymentStatus === 'PAID' || data?.order?.status === 'paid') {
            setOrder(data.order);
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            // Automatic redirect upon server webhook confirmation
            router.push(`/checkout/success?orderId=${order.id}`);
          }
        }
      } catch {}
    }, 4000);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [order, router]);

  // Manual status check
  const handleCheckPaymentStatus = async () => {
    if (!order) return;
    setIsCheckingStatus(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
          if (data.order.paymentStatus === 'PAID' || data.order.status === 'paid') {
            router.push(`/checkout/success?orderId=${order.id}`);
            return;
          }
        }
      }
    } catch (e) {
      console.error('Error checking status:', e);
    } finally {
      setTimeout(() => setIsCheckingStatus(false), 600);
    }
  };

  const handlePay = () => {
    if (!order) return;
    setIsProcessing(true);

    if (paymentInfo?.paymentUrl) {
      window.open(paymentInfo.paymentUrl, '_blank');
      setIsProcessing(false);
      return;
    }

    // Direct redirection to Lynk gateway with order reference
    const refId = order.orderNumber || order.id;
    const amount = order.netAmount || order.totalAmount;
    const targetUrl = `https://lynk.id?refId=${encodeURIComponent(refId)}&amount=${amount}`;
    window.open(targetUrl, '_blank');
    setIsProcessing(false);
  };

  if (!order || !invitation) {
    return (
      <div className="min-h-screen bg-[#F8F7F3] flex items-center justify-center text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-neutral-400" />
          <span>Memuat invoice pembayaran...</span>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'PAID' || order.status === 'paid';
  const subtotal = order.subtotal ?? order.totalAmount;
  const addonTotal = order.addonTotal ?? 0;
  const discount = order.discount ?? 0;
  const total = order.total ?? order.netAmount ?? order.totalAmount;

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#111111]">
      <MinimalNav />

      <main className="max-w-4xl mx-auto px-6 py-14">
        {/* Header & Status Indicator */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-ultra text-neutral-400 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>SECURE PAYMENT · ENCRYPTED TRANSACTION</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl uppercase tracking-wide">
            Penyelesaian Pembayaran
          </h1>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Order #{order.orderNumber} · {invitation.title}
          </p>

          {/* Status Badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium border">
            {isPaid ? (
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                PEMBAYARAN BERHASIL · UNDANGAN SUDAH AKTIF
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                MENUNGGU PEMBAYARAN (PENDING)
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Lynk.id Payment Gateway (Exclusive Official Method) */}
          <div className="md:col-span-7 bg-white border border-neutral-200 p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 className="font-serif text-xl uppercase tracking-wide">
                  Metode Pembayaran
                </h3>
                <p className="text-xs text-neutral-500 font-light mt-0.5">
                  Diproses secara otomatis melalui gerbang pembayaran resmi
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                Lynk.id Gateway
              </span>
            </div>

            {/* Official Lynk.id Payment Gateway Card */}
            <div className="p-6 border-2 border-black bg-neutral-50/50 rounded-xs space-y-5 relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded bg-black text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
                    L
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-base font-medium">Lynk.id Payment Gateway</h4>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        METODE UTAMA
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-light mt-0.5">
                      Satu gerbang pembayaran untuk seluruh bank, QRIS, e-wallet, dan gerai retail.
                    </p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Supported payment channels inside Lynk.id */}
              <div className="bg-white p-4 border border-neutral-200 rounded text-xs space-y-2.5">
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                  Saluran Pembayaran yang Didukung di Lynk.id:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-700 text-xs font-light">
                  <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded">
                    <QrCode className="w-4 h-4 text-neutral-700 shrink-0" />
                    <span><strong>QRIS Instan:</strong> GoPay, OVO, Dana, ShopeePay</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded">
                    <CreditCard className="w-4 h-4 text-neutral-700 shrink-0" />
                    <span><strong>Virtual Account:</strong> BCA, Mandiri, BNI, BRI, Permata</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded">
                    <CreditCard className="w-4 h-4 text-neutral-700 shrink-0" />
                    <span><strong>Kartu Kredit / Debit:</strong> Visa, Mastercard, JCB</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded">
                    <Sparkles className="w-4 h-4 text-neutral-700 shrink-0" />
                    <span><strong>Convenience Store:</strong> Indomaret & Alfamart</span>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 italic pt-1">
                  * Anda dapat memilih salah satu saluran di atas langsung pada halaman pembayaran Lynk.id.
                </p>
              </div>

              {/* Security & Webhook Context */}
              <div className="p-4 bg-white border border-neutral-200 rounded space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verifikasi Webhook Otomatis (SHA-256)</span>
                  </div>
                  <span className="font-mono text-[11px] bg-neutral-100 px-2 py-0.5 rounded text-neutral-700 font-semibold">
                    refId: {order.orderNumber}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
                  Begitu pembayaran diselesaikan di Lynk.id, webhook server kami akan secara otomatis memverifikasi transaksi dan mengaktifkan seluruh fitur undangan Anda dalam hitungan detik.
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] border-t border-neutral-100 text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Status: <strong>Siap Menerima Sinyal Pembayaran</strong></span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCheckPaymentStatus}
                    disabled={isCheckingStatus}
                    className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold text-black hover:underline disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isCheckingStatus ? 'animate-spin' : ''}`} />
                    <span>Cek Status</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Itemized Invoice Summary */}
          <div className="md:col-span-5 bg-white border border-neutral-200 p-8 space-y-6">
            <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-neutral-400">
                RINGKASAN PESANAN
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                #{order.orderNumber}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-3 text-xs">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-neutral-800">{item.itemName}</p>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-wider">{item.itemType}</p>
                  </div>
                  <span className="font-serif text-sm">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-6 border-t-2 border-neutral-900 space-y-2">
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Subtotal Paket</span>
                <span className="font-serif">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              {addonTotal > 0 && (
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Total Add-ons</span>
                  <span className="font-serif">Rp {addonTotal.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Diskon Promo</span>
                <span className="font-serif text-emerald-600">Rp {discount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-xs uppercase tracking-widest text-neutral-900 font-medium">
                  TOTAL AKHIR
                </span>
                <span className="font-serif text-2xl font-semibold text-neutral-950">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {isPaid ? (
              <Link
                href={`/checkout/success?orderId=${order.id}`}
                className="w-full py-4 text-xs uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <span>Lihat Akses Undangan & Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-4 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 font-medium cursor-pointer shadow-md"
              >
                {isProcessing ? (
                  <span>Membuka Gerbang Lynk.id...</span>
                ) : (
                  <>
                    <span>Bayar Sekarang via Lynk.id</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}

            <p className="text-[10px] text-center text-neutral-400 font-light leading-relaxed">
              Setelah pembayaran terverifikasi oleh webhook, status undangan otomatis menjadi <strong>ACTIVE</strong> dan seluruh fitur paket serta add-ons terbuka.
            </p>
          </div>
        </div>
      </main>

      <MinimalFooter />
    </div>
  );
}
