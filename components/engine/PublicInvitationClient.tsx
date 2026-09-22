'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { getInvitationBySlug, getInvitationBySlugAsync } from '@/lib/store';
import { InvitationEngine } from '@/components/engine/InvitationEngine';
import { Invitation } from '@/types';

export function PublicInvitationClient({
  slug,
  initialInvitation = null,
}: {
  slug: string;
  initialInvitation?: Invitation | null;
}) {
  const [invitation, setInvitation] = useState<Invitation | null>(initialInvitation);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(!initialInvitation);

  useEffect(() => {
    setMounted(true);
    // On client mount, check local storage for freshest draft/edits
    const local = getInvitationBySlug(slug);
    if (local) {
      setInvitation(local);
      setLoading(false);
    } else if (initialInvitation) {
      setInvitation(initialInvitation);
      setLoading(false);
    }

    let isMounted = true;
    getInvitationBySlugAsync(slug).then((res) => {
      if (isMounted) {
        if (res) setInvitation(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [slug, initialInvitation]);

  // If initialInvitation was not provided by SSR, render loading screen until mounted
  // to ensure server HTML and client initial hydration match identically!
  if (!mounted && !initialInvitation) {
    return (
      <div className="min-h-screen bg-[#F8F7F3] flex flex-col items-center justify-center text-[#111111] px-4">
        <div className="w-10 h-10 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin mb-4" />
        <p className="text-[11px] uppercase tracking-ultra text-neutral-400">
          Memuat Undangan Digital...
        </p>
      </div>
    );
  }

  if (loading && !invitation) {
    return (
      <div className="min-h-screen bg-[#F8F7F3] flex flex-col items-center justify-center text-[#111111] px-4">
        <div className="w-10 h-10 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin mb-4" />
        <p className="text-[11px] uppercase tracking-ultra text-neutral-400">
          Memuat Undangan Digital...
        </p>
      </div>
    );
  }

  if (!invitation) {
    notFound();
  }

  return <InvitationEngine invitation={invitation} />;
}
