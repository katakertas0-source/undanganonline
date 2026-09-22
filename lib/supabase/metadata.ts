import { getSupabase } from './client';
import { dbRowToInvitation } from './adapter';
import { INITIAL_INVITATIONS, TEMPLATES } from '../data/catalog';
import { Invitation } from '@/types';

export interface InvitationMetaInfo {
  title: string;
  description: string;
  groomNickname: string;
  brideNickname: string;
  coverImageUrl: string;
  eventDate: string;
  guestName?: string;
  ogImageUrl: string;
}

/**
 * Server-safe helper to retrieve full invitation object for SSR
 */
export async function getInvitationDataForServer(slug: string): Promise<Invitation | null> {
  const supabase = getSupabase();
  let invitationData: Invitation | null = null;

  if (supabase) {
    try {
      const { data } = await supabase
        .from('invitations')
        .select('*')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .maybeSingle();

      if (data) {
        invitationData = dbRowToInvitation(data);
      }
    } catch (e) {
      console.warn('[Server Invitation] Could not fetch from Supabase:', e);
    }
  }

  if (!invitationData) {
    const matchedInitial = INITIAL_INVITATIONS.find(
      (inv) => inv.slug === slug || inv.id === slug
    );
    if (matchedInitial) {
      invitationData = JSON.parse(JSON.stringify(matchedInitial));
    }
  }

  return invitationData;
}

/**
 * Server-safe helper to retrieve metadata for OpenGraph and WhatsApp crawler previews
 */
export async function getInvitationMetaInfo(
  slug: string,
  guestSlug?: string,
  origin: string = 'https://undanganonline.com'
): Promise<InvitationMetaInfo> {
  const supabase = getSupabase();
  let invitationData: any = null;
  let guestName: string | undefined = undefined;

  // 1. Check in Supabase database
  if (supabase) {
    try {
      const { data } = await supabase
        .from('invitations')
        .select('*')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .maybeSingle();

      if (data) {
        invitationData = dbRowToInvitation(data);

        // If guest slug is provided, lookup guest name in guest_links
        if (guestSlug) {
          const { data: guestData } = await supabase
            .from('guest_links')
            .select('guest_name')
            .eq('invitation_id', data.id)
            .eq('guest_slug', guestSlug)
            .maybeSingle();

          if (guestData?.guest_name) {
            guestName = guestData.guest_name;
          }
        }
      }
    } catch (e) {
      console.warn('[Metadata] Could not fetch from Supabase:', e);
    }
  }

  // 2. Fallback to initial catalog invitations / templates
  if (!invitationData) {
    const matchedInitial = INITIAL_INVITATIONS.find(
      (inv) => inv.slug === slug || inv.id === slug
    );
    if (matchedInitial) {
      invitationData = matchedInitial;
    } else {
      const matchedTemplate = TEMPLATES.find(
        (t) => t.slug === slug || t.id === slug
      );
      if (matchedTemplate) {
        invitationData = {
          title: `The Wedding of ${matchedTemplate.demoCouple.groomNickname} & ${matchedTemplate.demoCouple.brideNickname}`,
          couple: {
            groomNickname: matchedTemplate.demoCouple.groomNickname,
            brideNickname: matchedTemplate.demoCouple.brideNickname,
            groomName: matchedTemplate.demoCouple.groomName,
            brideName: matchedTemplate.demoCouple.brideName,
          },
          coverImageUrl: matchedTemplate.coverImageUrl,
          eventDate: matchedTemplate.demoCouple.dateStr,
        };
      }
    }
  }

  // Fallback guest name from slug if not in database
  if (guestSlug && !guestName) {
    guestName = guestSlug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const groom = invitationData?.couple?.groomNickname || 'Groom';
  const bride = invitationData?.couple?.brideNickname || 'Bride';
  const dateStr = invitationData?.eventDate || 'Save The Date';
  const coverUrl = invitationData?.coverImageUrl || '';

  const mainTitle = guestName
    ? `Undangan Spesial untuk ${guestName} | ${groom} & ${bride}`
    : `The Wedding of ${groom} & ${bride} | Kertas.Kata`;

  const description = guestName
    ? `Tanpa mengurangi rasa hormat, kami mengundang ${guestName} untuk menghadiri perayaan pernikahan ${groom} & ${bride}.`
    : `Kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri perayaan pernikahan ${groom} & ${bride}. Buka tautan untuk info acara lengkap dan konfirmasi kehadiran.`;

  // Build dynamic OG Image generator URL
  const ogParams = new URLSearchParams();
  ogParams.set('groom', groom);
  ogParams.set('bride', bride);
  if (guestName) ogParams.set('guest', guestName);
  if (dateStr) ogParams.set('date', dateStr);
  if (coverUrl && coverUrl.startsWith('http')) ogParams.set('cover', coverUrl);

  const ogImageUrl = `${origin}/api/og?${ogParams.toString()}`;

  return {
    title: mainTitle,
    description,
    groomNickname: groom,
    brideNickname: bride,
    coverImageUrl: coverUrl,
    eventDate: dateStr,
    guestName,
    ogImageUrl,
  };
}
