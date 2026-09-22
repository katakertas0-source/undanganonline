'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-20 overflow-hidden bg-[#F8F7F3] border-b border-neutral-200/70">
      {/* Background Editorial Visual */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1800&auto=format&fit=crop"
          alt="Editorial Wedding Background"
          className="w-full h-full object-cover opacity-15 grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F7F3]/70 via-[#F8F7F3]/40 to-[#F8F7F3]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 text-[10px] uppercase tracking-ultra font-sans text-neutral-800 border border-neutral-300 rounded-full mb-8 bg-white/80 backdrop-blur-sm shadow-2xs">
          <Image
            src="/images/logo-icon.png"
            alt="Kertas.Kata"
            width={16}
            height={16}
            className="w-4 h-4 object-contain inline-block"
          />
          <span>KERTAS.KATA · EDITORIAL DIGITAL INVITATIONS</span>
        </div>

        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[1.05] text-[#111111] uppercase font-light">
          Your Story,<br />
          <span className="italic font-normal">Beautifully</span> Told.
        </h1>

        <p className="mt-8 text-sm sm:text-base md:text-lg text-neutral-600 font-light max-w-xl mx-auto leading-relaxed">
          Digital invitations designed for meaningful moments. Inspired by high-fashion editorial disciplines, stripped of unnecessary ornamentation.
        </p>

        {/* Dual CTAs */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/create"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-xs uppercase tracking-widest bg-neutral-950 text-white border border-neutral-950 hover:bg-transparent hover:text-black transition-all duration-300 shadow-sm"
          >
            <span>CREATE YOUR INVITATION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/services/custom"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-xs uppercase tracking-widest bg-white/80 text-neutral-900 border border-neutral-300 hover:border-black transition-all duration-300"
          >
            <span>HAVE US CREATE IT</span>
          </Link>
        </div>

        {/* Value Micro-Points */}
        <div className="mt-16 pt-8 border-t border-neutral-200/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-3xl mx-auto">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400">ESTETIKA</p>
            <p className="text-xs font-medium text-neutral-800 mt-1">Editorial & Minimalis</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400">JALUR LAYANAN</p>
            <p className="text-xs font-medium text-neutral-800 mt-1">DIY & Custom</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400">TAMU</p>
            <p className="text-xs font-medium text-neutral-800 mt-1">Personalized Link</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400">SEBAR</p>
            <p className="text-xs font-medium text-neutral-800 mt-1">Tanpa Batas Kuota</p>
          </div>
        </div>
      </div>
    </section>
  );
}
