'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import {
  getInvitationBySlug,
  getInvitationBySlugAsync,
  getGuestsForInvitation,
  getGuestsForInvitationAsync,
} from '@/lib/store';
import { InvitationEngine } from '@/components/engine/InvitationEngine';
import { Invitation, GuestLink } from '@/types';

export function PersonalizedGuestClient({
  slug,
  guestSlug,
  initialInvitation = null,
  initialGuestName = undefined,
}: {
  slug: string;
  guestSlug: string;
  initialInvitation?: Invitation | null;
  initialGuestName?: string;
}) {
  const [invitation, setInvitation] = useState<Invitation | null>(initialInvitation);
  const [guests, setGuests] = useState<GuestLink[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(!initialInvitation);

  useEffect(() => {
    setMounted(true);
    // On client mount, check local storage
    const local = getInvitationBySlug(slug);
    if (local) {
      setInvitation(local);
      setGuests(getGuestsForInvitation(local.id));
      setLoading(false);
    } else if (initialInvitation) {
      setInvitation(initialInvitation);
      setGuests(getGuestsForInvitation(initialInvitation.id));
      setLoading(false);
    }

    let isMounted = true;
    getInvitationBySlugAsync(slug).then(async (res) => {
      if (!isMounted) return;
      if (res) {
        setInvitation(res);
        const remoteGuests = await getGuestsForInvitationAsync(res.id);
        if (isMounted) {
          setGuests(remoteGuests);
        }
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [slug, initialInvitation]);

  if (!mounted && !initialInvitation) {
    return (
      <div className="min-h-screen bg-[#F8F7F3] flex flex-col items-center justify-center text-[#111111] px-4">
        <div className="w-10 h-10 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin mb-4" />
        <p className="text-[11px] uppercase tracking-ultra text-neutral-400">
          Memuat Undangan Spesial...
        </p>
      </div>
    );
  }

  if (loading && !invitation) {
    return (
      <div className="min-h-screen bg-[#F8F7F3] flex flex-col items-center justify-center text-[#111111] px-4">
        <div className="w-10 h-10 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin mb-4" />
        <p className="text-[11px] uppercase tracking-ultra text-neutral-400">
          Memuat Undangan Spesial...
        </p>
      </div>
    );
  }

  if (!invitation) {
    notFound();
  }

  // Find guest in registered guest links or format cleanly from the URL slug
  const matchedGuest = guests.find(
    (g) => g.guestSlug.toLowerCase() === guestSlug.toLowerCase()
  );

  const fallbackName = guestSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const guestName = matchedGuest ? matchedGuest.guestName : (initialGuestName || fallbackName);

  return (
    <div className="w-full flex-1 flex flex-col min-h-screen">
      <InvitationEngine
        invitation={invitation}
        guestName={guestName}
      />
    </div>
  );
}
