'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function MinimalFooter() {
  return (
    <footer className="bg-[#111111] text-[#F8F7F3] border-t border-neutral-800 py-20 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-6 space-y-4">
          <Link href="/" className="inline-flex items-center gap-3.5 group">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/images/logo-icon-light.png"
                alt="Kertas.Kata Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="font-serif tracking-widest text-2xl uppercase font-medium text-white">
              KERTAS.KATA
            </span>
          </Link>
          <p className="text-xs text-neutral-400 font-light max-w-md leading-relaxed">
            A design platform for creating personal, elegant, and meaningful digital invitations.
            Curated minimalism inspired by Parisian haute couture and modern architectural discipline.
          </p>
          <p className="text-[11px] uppercase tracking-ultra text-neutral-500 pt-2">
            SIMPLE · ELEGANT · EXCLUSIVE
          </p>
        </div>

        <div className="md:col-span-3 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400">NAVIGATION</p>
          <ul className="space-y-2 text-xs text-neutral-300 font-light">
            <li>
              <Link href="/templates" className="hover:text-white transition-colors">
                Template Gallery
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white transition-colors">
                DIY vs Custom Service
              </Link>
            </li>
            <li>
              <Link href="/services/custom" className="hover:text-white transition-colors">
                Made For You (Custom)
              </Link>
            </li>
            <li>
              <Link href="/create" className="hover:text-white transition-colors">
                Mulai Rancang Undangan
              </Link>
            </li>
            <li className="pt-2 border-t border-neutral-800/80">
              <Link href="/admin" className="text-neutral-400 hover:text-[#E5C378] transition-colors flex items-center gap-1.5">
                <span>Portal Master Admin</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-[#E5C378]/20 text-[#E5C378] rounded-xs font-mono">STAFF</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400">LIVE DEMO INVITATIONS</p>
          <ul className="space-y-2 text-xs text-neutral-300 font-light">
            <li>
              <Link href="/julian-nadia" className="hover:text-white transition-colors">
                Julian & Nadia (Aurelia Warm)
              </Link>
            </li>
            <li>
              <Link href="/julian-nadia/budi-santoso" className="hover:text-white transition-colors">
                Julian & Nadia (Personalized for Budi)
              </Link>
            </li>
            <li>
              <Link href="/maya-adrian" className="hover:text-white transition-colors">
                Maya & Adrian (Nocturne Berlin)
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500">
        <p>© {new Date().getFullYear()} Kertas.Kata. All rights reserved.</p>
        <p className="mt-4 sm:mt-0 tracking-widest uppercase text-[10px]">
          JAKARTA · BALI · SINGAPORE
        </p>
      </div>
    </footer>
  );
}
