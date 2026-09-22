'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getAllInvitations,
  getAllInvitationsAsync,
  getAllOrders,
  getAllOrdersAsync,
  updateOrderStatusAsync,
  updateInvitationStatusAsync,
  deleteInvitationAsync,
  deleteOrderAsync,
  clearAllOrdersAsync,
  clearAllTestDrafts,
  getGuestsForInvitation,
  getAllTemplatesWithStatus,
  deleteTemplate,
  restoreTemplate,
} from '@/lib/store';
import { Invitation, Order, Template } from '@/types';
import {
  ShieldAlert,
  Search,
  ExternalLink,
  Edit,
  QrCode,
  DollarSign,
  TrendingUp,
  Users,
  Layers,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Home,
  LayoutDashboard,
  Check,
  XCircle,
  Trash2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  X,
  RotateCcw,
  LayoutTemplate,
} from 'lucide-react';

export default function AdminPortalPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [activeTab, setActiveTab] = useState<'invitations' | 'orders' | 'custom_briefs' | 'templates'>('invitations');
  const [searchInvQuery, setSearchInvQuery] = useState('');
  const [filterInvStatus, setFilterInvStatus] = useState<string>('ALL');
  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  const [filterOrderStatus, setFilterOrderStatus] = useState<string>('ALL');
  const [statusChangeMessage, setStatusChangeMessage] = useState<string | null>(null);

  // Template Catalog Management States
  const [templatesList, setTemplatesList] = useState<Array<Template & { isDeleted: boolean }>>([]);
  const [searchTemplateQuery, setSearchTemplateQuery] = useState<string>('');
  const [filterTemplateStatus, setFilterTemplateStatus] = useState<'ALL' | 'ACTIVE' | 'DELETED'>('ALL');
  const [templateToDelete, setTemplateToDelete] = useState<(Template & { isDeleted: boolean }) | null>(null);

  // Admin Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [inputUsername, setInputUsername] = useState<string>('');
  const [inputPassword, setInputPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Change Password Modal States
  const [showChangeModal, setShowChangeModal] = useState<boolean>(false);
  const [newUsernameInput, setNewUsernameInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [changeSuccessMessage, setChangeSuccessMessage] = useState<string | null>(null);

  // Revenue Period Filter & Reset States
  const [revenuePeriod, setRevenuePeriod] = useState<'THIS_MONTH' | 'LAST_MONTH' | 'ALL_TIME'>('THIS_MONTH');
  const [showResetRevenueModal, setShowResetRevenueModal] = useState<boolean>(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const loadAdminData = React.useCallback(async () => {
    setLoading(true);
    try {
      const invList = await getAllInvitationsAsync();
      setInvitations(invList);
      const orderList = await getAllOrdersAsync();
      setOrders(orderList);
      setTemplatesList(getAllTemplatesWithStatus());
    } catch (err) {
      console.warn('Error loading admin remote data, using local:', err);
      setInvitations(getAllInvitations());
      setOrders(getAllOrders());
      setTemplatesList(getAllTemplatesWithStatus());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuthLocal = localStorage.getItem('undangan_admin_auth');
      const isAuthSession = sessionStorage.getItem('undangan_admin_auth');
      if (isAuthLocal === 'true' || isAuthSession === 'true') {
        setIsAuthenticated(true);
        loadAdminData();
      }
      setCheckingAuth(false);
    }
  }, [loadAdminData]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const validUsername = (typeof window !== 'undefined' && localStorage.getItem('custom_admin_username')) || process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
    const validPassword = (typeof window !== 'undefined' && localStorage.getItem('custom_admin_password')) || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

    if (inputUsername.trim().toLowerCase() === validUsername.toLowerCase() && inputPassword === validPassword) {
      if (rememberMe) {
        localStorage.setItem('undangan_admin_auth', 'true');
      } else {
        sessionStorage.setItem('undangan_admin_auth', 'true');
      }
      setIsAuthenticated(true);
      loadAdminData();
    } else {
      setAuthError('ID Admin atau Password salah. Akses ditolak.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('undangan_admin_auth');
    sessionStorage.removeItem('undangan_admin_auth');
    setIsAuthenticated(false);
    setInputPassword('');
  };

  const handleSaveNewCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsernameInput.trim() || !newPasswordInput.trim()) {
      return;
    }
    localStorage.setItem('custom_admin_username', newUsernameInput.trim());
    localStorage.setItem('custom_admin_password', newPasswordInput);
    setChangeSuccessMessage('Kredensial admin baru berhasil disimpan!');
    setTimeout(() => {
      setShowChangeModal(false);
      setChangeSuccessMessage(null);
    }, 1200);
  };

  // Date calculations for Monthly Revenue Tracking
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const currentMonthLabel = `${monthNames[currentMonth]} ${currentYear}`;
  const lastMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthLabel = `${monthNames[lastMonthIdx]} ${lastMonthYear}`;

  const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID');

  // Filter paid orders based on selected period
  const periodFilteredPaidOrders = paidOrders.filter((o) => {
    if (revenuePeriod === 'ALL_TIME') return true;
    const d = o.paidAt ? new Date(o.paidAt) : new Date(o.createdAt);
    if (revenuePeriod === 'THIS_MONTH') {
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    }
    if (revenuePeriod === 'LAST_MONTH') {
      return d.getFullYear() === lastMonthYear && d.getMonth() === lastMonthIdx;
    }
    return true;
  });

  const periodGrossRevenue = periodFilteredPaidOrders.reduce(
    (acc, curr) => acc + (curr.netAmount || curr.totalAmount || 0),
    0
  );

  const totalAllTimeRevenue = paidOrders.reduce(
    (acc, curr) => acc + (curr.netAmount || curr.totalAmount || 0),
    0
  );

  const pendingOrders = orders.filter((o) => o.paymentStatus === 'PENDING');
  const activeInvitationsCount = invitations.filter((i) => i.status === 'ACTIVE' || i.status === 'EVENT_PASSED').length;

  const totalRegisteredGuests = invitations.reduce((acc, inv) => {
    const list = getGuestsForInvitation(inv.id);
    return acc + list.length;
  }, 0);

  const handleClearAllOrders = async () => {
    await clearAllOrdersAsync();
    setOrders([]);
    setShowResetRevenueModal(false);
    setStatusChangeMessage('Seluruh riwayat transaksi pesanan demo berhasil direset ke Rp 0.');
    setTimeout(() => setStatusChangeMessage(null), 3000);
    loadAdminData();
  };

  const handleDeleteSingleOrder = async (order: Order) => {
    await deleteOrderAsync(order.id);
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    setOrderToDelete(null);
    setStatusChangeMessage(`Pesanan ${order.orderNumber} berhasil dihapus.`);
    setTimeout(() => setStatusChangeMessage(null), 3000);
    loadAdminData();
  };

  // Status Change Handlers
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: 'PAID' | 'PENDING' | 'EXPIRED') => {
    await updateOrderStatusAsync(orderId, nextStatus, 'Manual Admin Verification');
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus: nextStatus,
              paidAt: nextStatus === 'PAID' ? new Date().toISOString() : o.paidAt,
            }
          : o
      )
    );
    // Reload to refresh invitation status sync
    loadAdminData();
    setStatusChangeMessage(`Status pesanan ${orderId} berhasil diubah ke ${nextStatus}`);
    setTimeout(() => setStatusChangeMessage(null), 3000);
  };

  const handleUpdateInvitationStatus = async (invitationId: string, nextStatus: any) => {
    await updateInvitationStatusAsync(invitationId, nextStatus);
    setInvitations((prev) =>
      prev.map((i) => (i.id === invitationId ? { ...i, status: nextStatus } : i))
    );
    setStatusChangeMessage(`Status undangan berhasil diperbarui ke ${nextStatus}`);
    setTimeout(() => setStatusChangeMessage(null), 3000);
  };

  const handleDeleteInvitation = async (inv: Invitation) => {
    const ok = window.confirm(
      `Apakah Anda yakin ingin menghapus undangan "${inv.title}" (/${inv.slug})?\n\nTindakan ini permanen dan akan menghapus seluruh data undangan.`
    );
    if (!ok) return;

    try {
      await deleteInvitationAsync(inv.id);
      setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
      setStatusChangeMessage(`Undangan "${inv.title}" berhasil dihapus.`);
      setTimeout(() => setStatusChangeMessage(null), 3000);
    } catch (err) {
      console.error('Gagal menghapus undangan:', err);
      alert('Gagal menghapus undangan, silakan coba lagi.');
    }
  };

  const handleClearTestDrafts = async () => {
    const ok = window.confirm(
      'Bersihkan semua draf uji coba otomatis ("four-wedding-...", "test-invitation-...") yang berstatus DRAFT?\n\nUndangan resmi/aktif tidak akan terhapus.'
    );
    if (!ok) return;

    const count = clearAllTestDrafts();
    await loadAdminData();
    setStatusChangeMessage(`${count} draf uji coba berhasil dibersihkan.`);
    setTimeout(() => setStatusChangeMessage(null), 3500);
  };

  const handleDeleteTemplate = (tmpl: Template & { isDeleted: boolean }) => {
    deleteTemplate(tmpl.id);
    setTemplateToDelete(null);
    setStatusChangeMessage(`Template "${tmpl.name}" berhasil dihapus dari katalog publik.`);
    setTimeout(() => setStatusChangeMessage(null), 3000);
    loadAdminData();
  };

  const handleRestoreTemplate = (tmpl: Template & { isDeleted: boolean }) => {
    restoreTemplate(tmpl.id);
    setStatusChangeMessage(`Template "${tmpl.name}" berhasil dipulihkan ke katalog publik.`);
    setTimeout(() => setStatusChangeMessage(null), 3000);
    loadAdminData();
  };

  // Filtered templates
  const filteredTemplates = templatesList.filter((tmpl) => {
    const q = searchTemplateQuery.toLowerCase();
    const matchesSearch =
      tmpl.name.toLowerCase().includes(q) ||
      tmpl.category.toLowerCase().includes(q) ||
      tmpl.slug.toLowerCase().includes(q) ||
      (tmpl.archetype && tmpl.archetype.toLowerCase().includes(q));

    const matchesStatus =
      filterTemplateStatus === 'ALL'
        ? true
        : filterTemplateStatus === 'ACTIVE'
        ? !tmpl.isDeleted
        : tmpl.isDeleted;

    return matchesSearch && matchesStatus;
  });

  // Filtered invitations
  const filteredInvitations = invitations.filter((inv) => {
    const matchesSearch =
      inv.title.toLowerCase().includes(searchInvQuery.toLowerCase()) ||
      inv.slug.toLowerCase().includes(searchInvQuery.toLowerCase()) ||
      inv.couple.groomNickname.toLowerCase().includes(searchInvQuery.toLowerCase()) ||
      inv.couple.brideNickname.toLowerCase().includes(searchInvQuery.toLowerCase());

    const matchesStatus = filterInvStatus === 'ALL' || inv.status === filterInvStatus;
    return matchesSearch && matchesStatus;
  });

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      ord.invitationId.toLowerCase().includes(searchOrderQuery.toLowerCase());

    const matchesStatus = filterOrderStatus === 'ALL' || ord.paymentStatus === filterOrderStatus;
    return matchesSearch && matchesStatus;
  });

  // Custom project briefs
  const customProjects = invitations.filter((inv) => inv.serviceType === 'custom' || inv.designerNotes);

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center text-white">
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-neutral-400">
          <RefreshCw className="w-4 h-4 animate-spin text-[#E5C378]" />
          <span>Memverifikasi Otorisasi Sistem...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] text-[#F8F7F3] flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-[#161616] border border-neutral-800 p-8 sm:p-10 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-[#E5C378]/10 text-[#E5C378] border border-[#E5C378]/30 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <div className="inline-block px-3.5 py-1 text-[9px] uppercase tracking-ultra font-sans text-[#E5C378] border border-[#E5C378]/30 rounded-full mb-3 bg-[#E5C378]/5">
              <span>PORTAL PENGELOLA SISTEM</span>
            </div>

            <h1 className="font-serif text-3xl uppercase tracking-tight text-white font-light">
              Master Admin
            </h1>
            <p className="text-xs text-neutral-400 font-light mt-2 leading-relaxed">
              Area terbatas. Masukkan ID Admin dan Password untuk mengakses data transaksi, pesanan, dan manajemen undangan.
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3 bg-red-950/50 border border-red-800/80 text-red-200 text-xs flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5 font-medium">
                ID Admin
              </label>
              <input
                type="text"
                required
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="Masukkan ID Admin"
                className="w-full px-3.5 py-2.5 bg-[#202020] border border-neutral-700 text-white text-xs tracking-wide focus:border-[#E5C378] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5 font-medium">
                Password Admin
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Masukkan Password Admin"
                  className="w-full px-3.5 py-2.5 bg-[#202020] border border-neutral-700 text-white text-xs tracking-wide pr-10 focus:border-[#E5C378] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#E5C378] w-3.5 h-3.5 rounded"
                />
                <span className="text-[11px]">Ingat sesi di perangkat ini</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 text-xs uppercase tracking-widest bg-[#E5C378] text-black font-semibold hover:bg-[#d8b567] transition-all cursor-pointer shadow-lg mt-2"
            >
              Buka Akses Admin
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
            <Link
              href="/"
              className="text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors uppercase tracking-wider"
            >
              ← Kembali ke Beranda Utama
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#111111]">
      {/* Top Admin Luxury Navbar */}
      <header className="sticky top-0 z-40 bg-[#111111] text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 font-serif text-lg tracking-widest uppercase font-light text-neutral-100 hover:text-[#E5C378] transition-colors group">
              <div className="relative w-6 h-6 shrink-0">
                <Image
                  src="/images/logo-icon-light.png"
                  alt="Kertas.Kata"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <span>KERTAS.KATA</span>
            </Link>
            <span className="hidden sm:inline text-neutral-600">/</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#E5C378]/30 bg-[#E5C378]/10 text-[10px] uppercase tracking-ultra text-[#E5C378] font-medium">
              <ShieldCheck className="w-3 h-3" />
              <span>MASTER ADMIN PORTAL</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-300 hover:text-white px-3 py-1.5 border border-neutral-700 hover:border-neutral-500 rounded-sm transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard Klien</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-300 hover:text-white px-3 py-1.5 border border-neutral-700 hover:border-neutral-500 rounded-sm transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Web Publik</span>
            </Link>

            <button
              onClick={() => {
                const curUser = (typeof window !== 'undefined' && localStorage.getItem('custom_admin_username')) || process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
                setNewUsernameInput(curUser);
                setNewPasswordInput('');
                setShowChangeModal(true);
              }}
              title="Ganti Kredensial Admin"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-300 hover:text-white px-3 py-1.5 border border-neutral-700 hover:border-neutral-500 rounded-sm transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#E5C378]" />
              <span className="hidden sm:inline">Ganti Password</span>
            </button>

            <button
              onClick={handleAdminLogout}
              title="Keluar dari Portal Admin"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-red-400 hover:text-red-300 px-3 py-1.5 border border-red-900/60 hover:border-red-700 bg-red-950/20 rounded-sm transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>

            <button
              onClick={loadAdminData}
              title="Refresh Data"
              className="p-1.5 text-neutral-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Page Title & Status Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <div className="text-[10px] uppercase tracking-ultra text-neutral-400 mb-1">
              SAAS PLATFORM OVERVIEW · BUSINESS INTELLIGENCE
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl uppercase tracking-wide">
              Panel Kendali Master Admin
            </h1>
            <p className="text-xs text-neutral-500 font-light mt-1">
              Pantau seluruh aktivitas calon pengantin, pesanan pembayaran, dan antrean brief layanan atelier.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] uppercase tracking-widest font-semibold rounded-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>DATABASE LIVE CONNECTED</span>
            </span>
          </div>
        </div>

        {/* Status update alert toast */}
        {statusChangeMessage && (
          <div className="p-4 bg-emerald-900 text-white text-xs flex items-center justify-between border border-emerald-700 animate-fade-in shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{statusChangeMessage}</span>
            </div>
          </div>
        )}

        {/* Executive Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue Card with Monthly Period Switcher & Reset Button */}
          <div className="bg-white border border-neutral-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-[10px] uppercase tracking-ultra font-semibold">
                  {revenuePeriod === 'THIS_MONTH'
                    ? `OMZET ${currentMonthLabel.toUpperCase()}`
                    : revenuePeriod === 'LAST_MONTH'
                    ? `OMZET ${lastMonthLabel.toUpperCase()}`
                    : 'TOTAL OMZET SEMUA WAKTU'}
                </span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>

              <p className="font-serif text-3xl font-light text-[#111111]">
                {formatRupiah(periodGrossRevenue)}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="inline-block text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  {periodFilteredPaidOrders.length} Transaksi Terverifikasi
                </span>
                {revenuePeriod !== 'ALL_TIME' && (
                  <span className="text-[10px] font-mono text-neutral-400">
                    (All-Time: {formatRupiah(totalAllTimeRevenue)})
                  </span>
                )}
              </div>
            </div>

            {/* Period Switcher & Reset Action */}
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
              <select
                value={revenuePeriod}
                onChange={(e) => setRevenuePeriod(e.target.value as any)}
                className="text-[10px] uppercase tracking-wider bg-[#FAF7F2] border border-neutral-300 px-2 py-1 font-medium text-neutral-700 outline-none cursor-pointer hover:border-black transition-colors"
              >
                <option value="THIS_MONTH">Bulan Ini ({monthNames[currentMonth]})</option>
                <option value="LAST_MONTH">Bulan Lalu ({monthNames[lastMonthIdx]})</option>
                <option value="ALL_TIME">Semua Waktu</option>
              </select>

              <button
                onClick={() => setShowResetRevenueModal(true)}
                title="Reset Omzet & Hapus Transaksi Demo"
                className="text-[10px] uppercase tracking-wider text-red-600 hover:text-red-700 underline underline-offset-2 flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Omzet</span>
              </button>
            </div>
          </div>

          {/* Active Invitations */}
          <div className="bg-white border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-[10px] uppercase tracking-ultra font-semibold">TOTAL UNDANGAN DIBUAT</span>
              <Layers className="w-4 h-4 text-neutral-600" />
            </div>
            <p className="font-serif text-3xl font-light text-[#111111]">
              {invitations.length}
            </p>
            <span className="inline-block mt-2 text-[10px] font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 border border-neutral-200">
              {activeInvitationsCount} Berstatus Aktif / Selesai
            </span>
          </div>

          {/* Pending Orders */}
          <div className="bg-white border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-[10px] uppercase tracking-ultra font-semibold">PESANAN MENUNGGU BAYAR</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-serif text-3xl font-light text-amber-800">
              {pendingOrders.length}
            </p>
            <span className="inline-block mt-2 text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200">
              Perlu Verifikasi / Follow Up
            </span>
          </div>

          {/* Total Registered Guests */}
          <div className="bg-white border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-[10px] uppercase tracking-ultra font-semibold">TOTAL TAMU TERDAFTAR</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="font-serif text-3xl font-light text-[#111111]">
              {totalRegisteredGuests}
            </p>
            <span className="inline-block mt-2 text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 border border-indigo-200">
              Di Seluruh Acara Pernikahan
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 text-xs gap-2">
          <button
            onClick={() => setActiveTab('invitations')}
            className={`px-6 py-3 border-b-2 font-medium transition-all ${
              activeTab === 'invitations'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Daftar Undangan ({invitations.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 border-b-2 font-medium transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            <span>Pesanan & Transaksi ({orders.length})</span>
            {pendingOrders.length > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] bg-amber-500 text-white rounded-full">
                {pendingOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('custom_briefs')}
            className={`px-6 py-3 border-b-2 font-medium transition-all flex items-center gap-2 ${
              activeTab === 'custom_briefs'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            <span>Antrean Proyek Kustom ({customProjects.length})</span>
            {customProjects.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#E5C378]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 border-b-2 font-medium transition-all flex items-center gap-2 ${
              activeTab === 'templates'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Katalog Template ({templatesList.length})</span>
            {templatesList.filter((t) => t.isDeleted).length > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] bg-red-600 text-white rounded-full font-mono font-semibold">
                {templatesList.filter((t) => t.isDeleted).length} dihapus
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Daftar Undangan */}
        {activeTab === 'invitations' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="p-4 bg-white border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchInvQuery}
                  onChange={(e) => setSearchInvQuery(e.target.value)}
                  placeholder="Cari judul, slug, atau nama mempelai..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 outline-none focus:border-black"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                {invitations.some(
                  (i) =>
                    i.status === 'DRAFT' &&
                    (i.slug.startsWith('four-wedding-') ||
                      i.slug.startsWith('our-wedding-') ||
                      i.slug.startsWith('test-invitation-'))
                ) && (
                  <button
                    onClick={handleClearTestDrafts}
                    className="px-3 py-1.5 text-[11px] border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition-colors rounded-sm flex items-center gap-1.5 font-medium cursor-pointer"
                    title="Hapus massal draft uji coba otomatis"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    <span>
                      Bersihkan Draft Uji Coba (
                      {
                        invitations.filter(
                          (i) =>
                            i.status === 'DRAFT' &&
                            (i.slug.startsWith('four-wedding-') ||
                              i.slug.startsWith('our-wedding-') ||
                              i.slug.startsWith('test-invitation-'))
                        ).length
                      }
                      )
                    </span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400">Status:</span>
                  <select
                    value={filterInvStatus}
                    onChange={(e) => setFilterInvStatus(e.target.value)}
                    className="px-3 py-2 text-xs border border-neutral-300 bg-white outline-none focus:border-black"
                  >
                    <option value="ALL">Semua Status</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="EVENT_PASSED">EVENT_PASSED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Invitations Table */}
            <div className="bg-white border border-neutral-200 overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/70 text-[10px] uppercase tracking-widest text-neutral-500">
                    <th className="py-3 px-4">Undangan & Mempelai</th>
                    <th className="py-3 px-4">Slug & URL</th>
                    <th className="py-3 px-4">Layanan / Paket</th>
                    <th className="py-3 px-4">Tanggal Acara</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Tamu</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredInvitations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-neutral-400">
                        Tidak ada undangan yang cocok dengan kriteria filter.
                      </td>
                    </tr>
                  ) : (
                    filteredInvitations.map((inv) => {
                      const guestCount = getGuestsForInvitation(inv.id).length;
                      return (
                        <tr key={inv.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-medium">
                            <p className="font-serif text-sm uppercase tracking-wide text-neutral-900">
                              {inv.title}
                            </p>
                            <p className="text-[11px] text-neutral-500 font-light mt-0.5">
                              {inv.couple.groomNickname} & {inv.couple.brideNickname}
                            </p>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600">
                            /{inv.slug}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold border border-neutral-200 bg-neutral-50 text-neutral-800">
                              {inv.serviceType === 'custom'
                                ? 'CUSTOM ATELIER'
                                : inv.packageId === 'pkg-premium'
                                ? 'PREMIUM DIY (MANDIRI)'
                                : 'ESSENTIAL DIY (MANDIRI)'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600">
                            {inv.eventDate || '-'}
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={inv.status}
                              onChange={(e) => handleUpdateInvitationStatus(inv.id, e.target.value)}
                              className={`px-2 py-1 text-[10px] uppercase tracking-widest font-semibold border rounded-sm outline-none cursor-pointer ${
                                inv.status === 'ACTIVE'
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                  : inv.status === 'EVENT_PASSED'
                                  ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                                  : 'border-amber-300 bg-amber-50 text-amber-800'
                              }`}
                            >
                              <option value="ACTIVE">ACTIVE</option>
                              <option value="DRAFT">DRAFT</option>
                              <option value="EVENT_PASSED">EVENT_PASSED</option>
                              <option value="ARCHIVED">ARCHIVED</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-center font-mono font-medium text-neutral-700">
                            {guestCount}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`/${inv.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 border border-neutral-200 hover:border-black text-neutral-600 hover:text-black transition-colors rounded-sm"
                                title="Buka Live Undangan"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <Link
                                href={`/builder/${inv.id}`}
                                className="p-1.5 border border-neutral-200 hover:border-black text-neutral-600 hover:text-black transition-colors rounded-sm"
                                title="Buka Builder"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Link>
                              <Link
                                href={`/checkin/${inv.id}`}
                                className="p-1.5 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors rounded-sm"
                                title="Meja Resepsi Check-In"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteInvitation(inv)}
                                className="p-1.5 border border-red-200 hover:border-red-500 hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors rounded-sm cursor-pointer"
                                title={`Hapus Undangan: ${inv.title}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Pesanan & Transaksi */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="p-4 bg-white border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchOrderQuery}
                  onChange={(e) => setSearchOrderQuery(e.target.value)}
                  placeholder="Cari No. Order (misal: UO-849201)..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 outline-none focus:border-black"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400">Status:</span>
                  <select
                    value={filterOrderStatus}
                    onChange={(e) => setFilterOrderStatus(e.target.value)}
                    className="px-3 py-2 text-xs border border-neutral-300 bg-white outline-none focus:border-black"
                  >
                    <option value="ALL">Semua Status</option>
                    <option value="PAID">PAID (Lunas)</option>
                    <option value="PENDING">PENDING (Menunggu)</option>
                    <option value="EXPIRED">EXPIRED</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowResetRevenueModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] uppercase tracking-widest border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors cursor-pointer"
                  title="Hapus semua pesanan transaksi dan reset omzet ke 0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Semua Pesanan</span>
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-neutral-200 overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/70 text-[10px] uppercase tracking-widest text-neutral-500">
                    <th className="py-3 px-4">No. Order</th>
                    <th className="py-3 px-4">Item & Layanan</th>
                    <th className="py-3 px-4">Total Biaya</th>
                    <th className="py-3 px-4">Metode Bayar</th>
                    <th className="py-3 px-4">Waktu Dibuat / Lunas</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-neutral-400">
                        Belum ada data pesanan yang sesuai filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-neutral-900">
                          {order.orderNumber}
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-medium text-neutral-800">
                            {order.items.map((i) => i.itemName).join(', ') || 'Paket Undangan'}
                          </p>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            Ref Inv: {order.invitationId}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-semibold text-neutral-900">
                          {formatRupiah(order.netAmount || order.totalAmount)}
                        </td>

                        <td className="py-3.5 px-4 text-neutral-600 font-light">
                          {order.paymentMethod || 'Belum dipilih'}
                        </td>

                        <td className="py-3.5 px-4 text-neutral-500 font-mono text-[11px]">
                          <div>{new Date(order.createdAt).toLocaleDateString('id-ID')}</div>
                          {order.paidAt && (
                            <div className="text-emerald-600 text-[10px]">
                              Lunas: {new Date(order.paidAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold border ${
                              order.paymentStatus === 'PAID'
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                : 'border-amber-300 bg-amber-50 text-amber-800'
                            }`}
                          >
                            ● {order.paymentStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {order.paymentStatus !== 'PAID' ? (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'PAID')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 transition-colors rounded-sm font-semibold cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                                <span>Tandai Lunas</span>
                              </button>
                            ) : (
                              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
                                Verified
                              </span>
                            )}
                            <button
                              onClick={() => setOrderToDelete(order)}
                              className="p-1 border border-red-200 hover:border-red-500 hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors rounded-sm cursor-pointer"
                              title={`Hapus Pesanan ${order.orderNumber}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Antrean Proyek Kustom (Custom Briefs) */}
        {activeTab === 'custom_briefs' && (
          <div className="space-y-6">
            <div className="p-6 bg-white border border-neutral-200 space-y-2">
              <h3 className="font-serif text-xl uppercase tracking-wide">
                Layanan Dibuatkan Oleh Kami (Custom Atelier)
              </h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Daftar pengantin yang memesan paket eksklusif desain custom. Tim desainer dapat membuka builder undangan klien langsung dari sini untuk menyusun layout, animasi, dan audio sesuai permintaan klien.
              </p>
            </div>

            {customProjects.length === 0 ? (
              <div className="p-12 text-center bg-white border border-neutral-200 text-neutral-400 text-xs">
                Belum ada antrean proyek kustom.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customProjects.map((proj) => (
                  <div key={proj.id} className="p-6 bg-white border border-neutral-200 shadow-sm space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-block px-2 py-0.5 text-[9px] uppercase tracking-widest font-semibold border border-amber-300 bg-amber-50 text-amber-800 mb-2">
                          CUSTOM ATELIER
                        </span>
                        <h4 className="font-serif text-lg uppercase tracking-wide">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-neutral-500 font-light mt-0.5">
                          {proj.couple.groomNickname} & {proj.couple.brideNickname}
                        </p>
                      </div>

                      <span className="text-xs font-mono text-neutral-400">
                        /{proj.slug}
                      </span>
                    </div>

                    {proj.designerNotes && (
                      <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 font-light leading-relaxed">
                        <span className="text-[10px] uppercase tracking-widest font-medium text-neutral-400 block mb-1">
                          CATATAN / BRIEF KONSEP KLIEN:
                        </span>
                        <p className="whitespace-pre-line">{proj.designerNotes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs">
                      <span className="font-mono text-[11px] text-neutral-500">
                        Tanggal: {proj.eventDate || 'Belum ditentukan'}
                      </span>

                      <div className="flex items-center gap-2">
                        <a
                          href={`/${proj.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 border border-neutral-300 hover:border-black text-[10px] uppercase tracking-widest transition-colors"
                        >
                          Lihat Live
                        </a>
                        <Link
                          href={`/builder/${proj.id}`}
                          className="px-3 py-1.5 bg-black text-white hover:bg-neutral-800 text-[10px] uppercase tracking-widest transition-colors font-semibold"
                        >
                          Buka Studio Editor
                        </Link>
                        <button
                          onClick={() => handleDeleteInvitation(proj)}
                          className="p-1.5 border border-red-200 hover:border-red-500 hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors rounded-sm cursor-pointer"
                          title="Hapus Proyek Kustom"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Manajemen Katalog Template */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="p-4 bg-white border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchTemplateQuery}
                  onChange={(e) => setSearchTemplateQuery(e.target.value)}
                  placeholder="Cari nama template, kategori, atau arketipe..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 outline-none focus:border-black"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">Filter Status:</span>
                <select
                  value={filterTemplateStatus}
                  onChange={(e) => setFilterTemplateStatus(e.target.value as any)}
                  className="px-3 py-2 text-xs border border-neutral-300 bg-white outline-none focus:border-black cursor-pointer"
                >
                  <option value="ALL">Semua Template ({templatesList.length})</option>
                  <option value="ACTIVE">Aktif di Publik ({templatesList.filter((t) => !t.isDeleted).length})</option>
                  <option value="DELETED">Dihapus / Nonaktif ({templatesList.filter((t) => t.isDeleted).length})</option>
                </select>
              </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-white border border-neutral-200 shadow-sm">
                  <LayoutTemplate className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-xs text-neutral-400">Tidak ada template yang cocok dengan kriteria filter.</p>
                </div>
              ) : (
                filteredTemplates.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className={`bg-white border transition-all flex flex-col justify-between shadow-xs ${
                      tmpl.isDeleted
                        ? 'border-red-200 opacity-75 bg-neutral-50/70'
                        : 'border-neutral-200 hover:border-neutral-400 hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Cover Thumbnail */}
                      <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden border-b border-neutral-200">
                        {tmpl.coverImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={tmpl.coverImageUrl}
                            alt={tmpl.name}
                            className={`w-full h-full object-cover ${tmpl.isDeleted ? 'grayscale' : ''}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-300">
                            <LayoutTemplate className="w-8 h-8" />
                          </div>
                        )}

                        {/* Status Badge Over Image */}
                        <div className="absolute top-3 right-3">
                          {tmpl.isDeleted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold bg-red-600 text-white rounded-full shadow-sm">
                              <XCircle className="w-3 h-3" />
                              <span>Dihapus / Nonaktif</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold bg-emerald-600 text-white rounded-full shadow-sm">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Aktif di Publik</span>
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-3 bg-black/75 text-white px-2.5 py-0.5 text-[9px] uppercase tracking-ultra rounded-sm backdrop-blur-xs font-mono">
                          {tmpl.category}
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <h3 className="font-serif text-2xl uppercase tracking-wide text-neutral-900 font-normal">
                              {tmpl.name}
                            </h3>
                            <span className="text-[10px] font-mono text-neutral-400">
                              Slug: /{tmpl.slug}
                            </span>
                          </div>
                          <span className="font-mono text-xs font-semibold text-neutral-900">
                            {formatRupiah(tmpl.basePrice)}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-500 font-light line-clamp-2 leading-relaxed">
                          {tmpl.description || tmpl.tagline}
                        </p>

                        <div className="pt-2 flex flex-wrap gap-1.5">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C6D3B] bg-[#FAF7F2] border border-[#DDD5C7] px-2 py-0.5">
                            {tmpl.archetype}
                          </span>
                          {tmpl.tags?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 border-t border-neutral-100 bg-[#FAF9F6] flex items-center justify-between gap-2">
                      <Link
                        href={`/templates/${tmpl.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider border border-neutral-300 hover:border-black bg-white text-neutral-700 hover:text-black transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Live Preview</span>
                      </Link>

                      {tmpl.isDeleted ? (
                        <button
                          onClick={() => handleRestoreTemplate(tmpl)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors cursor-pointer rounded-sm"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Pulihkan</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setTemplateToDelete(tmpl)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] uppercase tracking-wider bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 font-semibold transition-colors cursor-pointer rounded-sm"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus Template</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Change Admin Password Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#181818] border border-neutral-800 p-6 sm:p-8 max-w-md w-full text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#E5C378]">
                <KeyRound className="w-4 h-4" />
                <span>Pengaturan Kredensial Admin</span>
              </div>
              <button
                onClick={() => setShowChangeModal(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {changeSuccessMessage && (
              <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{changeSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveNewCredentials} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  ID Admin Baru
                </label>
                <input
                  type="text"
                  required
                  value={newUsernameInput}
                  onChange={(e) => setNewUsernameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#252525] border border-neutral-700 text-white text-xs focus:border-[#E5C378] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  Password Admin Baru
                </label>
                <input
                  type="password"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Masukkan password baru"
                  className="w-full px-3 py-2 bg-[#252525] border border-neutral-700 text-white text-xs focus:border-[#E5C378] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('custom_admin_username');
                    localStorage.removeItem('custom_admin_password');
                    setNewUsernameInput(process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin');
                    setNewPasswordInput(process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123');
                    setChangeSuccessMessage('Kredensial direset kembali ke default (.env.local)');
                    setTimeout(() => setChangeSuccessMessage(null), 2000);
                  }}
                  className="text-[10px] text-neutral-400 hover:text-neutral-200 underline"
                >
                  Reset ke Default
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#E5C378] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#d8b567] transition-all cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Reset All Orders Confirmation Modal */}
      {showResetRevenueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#181818] border border-neutral-800 p-6 sm:p-8 max-w-md w-full text-white shadow-2xl relative">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg uppercase tracking-wide text-white font-medium">
                  Reset Omzet & Hapus Transaksi
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono">
                  Tindakan ini akan mengosongkan seluruh pesanan
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 font-light leading-relaxed mb-6">
              Apakah Anda yakin ingin mereset seluruh omzet dan menghapus semua riwayat transaksi pesanan (termasuk pesanan demo senilai <strong>Rp 347.000</strong>)? Omzet akan kembali menjadi <strong>Rp 0</strong> bersih untuk memulai pencatatan baru.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowResetRevenueModal(false)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white border border-neutral-700 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleClearAllOrders}
                className="px-5 py-2 text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors cursor-pointer shadow-md"
              >
                Ya, Reset Omzet ke Rp 0
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Order Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#181818] border border-neutral-800 p-6 sm:p-8 max-w-md w-full text-white shadow-2xl relative">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg uppercase tracking-wide text-white font-medium">
                  Hapus Pesanan
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono">
                  {orderToDelete.orderNumber}
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 font-light leading-relaxed mb-6">
              Hapus pesanan <strong>{orderToDelete.orderNumber}</strong> senilai <strong>{formatRupiah(orderToDelete.netAmount || orderToDelete.totalAmount)}</strong>? Nominal ini akan otomatis dikurangi dari total omzet.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white border border-neutral-700 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSingleOrder(orderToDelete)}
                className="px-5 py-2 text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors cursor-pointer shadow-md"
              >
                Hapus Pesanan Ini
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Template Confirmation Modal */}
      {templateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#181818] border border-neutral-800 p-6 sm:p-8 max-w-md w-full text-white shadow-2xl relative">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg uppercase tracking-wide text-white font-medium">
                  Hapus Template
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono">
                  {templateToDelete.name} (/{templateToDelete.slug})
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 font-light leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus template <strong>&quot;{templateToDelete.name}&quot;</strong>? Template ini akan langsung dihilangkan dari katalog publik (<strong>/templates</strong>), form pemesanan (<strong>/create</strong>), dan editor builder. Anda dapat memulihkannya kembali kapan saja.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setTemplateToDelete(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white border border-neutral-700 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTemplate(templateToDelete)}
                className="px-5 py-2 text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors cursor-pointer shadow-md"
              >
                Ya, Hapus Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
