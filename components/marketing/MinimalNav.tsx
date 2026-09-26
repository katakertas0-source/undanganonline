'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight, User, LogOut } from 'lucide-react';
import { getSupabase } from '@/lib/supabase/client';
import { AuthModal } from '@/components/auth/AuthModal';
import { getCurrentSession, clearCurrentSession } from '@/lib/store';

export function MinimalNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [clientSession, setClientSession] = useState<{ invitationId: string; username: string } | null>(null);

  useEffect(() => {
    // Check client session from local dashboard login
    const checkSession = () => {
      setClientSession(getCurrentSession());
    };
    checkSession();
    window.addEventListener('uo_auth_changed', checkSession);

    const supabase = getSupabase();
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) setUser(data.user);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => {
        authListener.subscription.unsubscribe();
        window.removeEventListener('uo_auth_changed', checkSession);
      };
    }

    return () => {
      window.removeEventListener('uo_auth_changed', checkSession);
    };
  }, []);

  const handleSignOut = async () => {
    clearCurrentSession();
    setClientSession(null);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F8F7F3]/90 backdrop-blur-md border-b border-neutral-200/70 transition-all">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link href="/" className="group flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/images/logo-icon.png"
                alt="Kertas.Kata Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-widest text-lg sm:text-xl uppercase font-semibold text-[#111111] leading-none">
                KERTAS.KATA
              </span>
              <span className="text-[8px] uppercase tracking-ultra text-neutral-400 font-sans mt-1">
                EDITORIAL DIGITAL INVITATIONS
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-widest text-neutral-600 font-medium">
            <Link href="/templates" className="hover:text-black transition-colors">
              Templates
            </Link>
            <Link href="/services" className="hover:text-black transition-colors">
              Services
            </Link>
            {(user || clientSession) && (
              <Link
                href={clientSession ? `/dashboard?id=${clientSession.invitationId}` : '/dashboard'}
                className="text-black font-semibold hover:underline"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right CTA & Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user || clientSession ? (
              <div className="flex items-center gap-3">
                <Link
                  href={clientSession ? `/dashboard?id=${clientSession.invitationId}` : '/dashboard'}
                  className="text-xs uppercase tracking-widest text-neutral-700 hover:text-black flex items-center gap-1.5 font-medium"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[120px]">
                    {clientSession ? clientSession.username : user?.email?.split('@')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  title="Keluar"
                  className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="text-xs uppercase tracking-widest text-neutral-700 hover:text-black px-3 py-2 transition-colors cursor-pointer"
              >
                Masuk
              </button>
            )}

            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-sans uppercase tracking-widest border border-neutral-900 bg-neutral-900 text-white hover:bg-transparent hover:text-black transition-all duration-300"
            >
              <span>Create Invitation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-800"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F8F7F3] border-b border-neutral-200 px-6 py-6 space-y-4 animate-fade-in">
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs uppercase tracking-widest py-2 text-neutral-700"
            >
              Templates
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs uppercase tracking-widest py-2 text-neutral-700"
            >
              Services (DIY vs Custom)
            </Link>
            {user && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs uppercase tracking-widest py-2 text-black font-semibold"
              >
                Dashboard
              </Link>
            )}

            <div className="pt-4 border-t border-neutral-200 space-y-3">
              {user ? (
                <div className="flex items-center justify-between py-2 text-xs text-neutral-600">
                  <span className="truncate">{user.email}</span>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-red-600 uppercase text-[10px] tracking-wider"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full text-center py-2.5 text-xs uppercase tracking-widest border border-neutral-300"
                >
                  Masuk / Daftar
                </button>
              )}

              <Link
                href="/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3 text-xs uppercase tracking-widest bg-black text-white"
              >
                Create Invitation
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
        }}
      />
    </>
  );
}
