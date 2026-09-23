'use client';

import { Invitation, Template, Addon, Order, GuestLink, RsvpEntry, WishEntry, ServiceType, DiyPackage, OrderItem } from '@/types';
import { TEMPLATES, ADDONS, INITIAL_INVITATIONS, INITIAL_GUEST_LINKS, INITIAL_RSVPS, INITIAL_WISHES, DIY_PACKAGES } from './data/catalog';
import { idbGet, idbSet } from './idb-storage';
import { getSupabase } from './supabase/client';
import {
  invitationToDbRow,
  dbRowToInvitation,
  guestToDbRow,
  dbRowToGuest,
  rsvpToDbRow,
  dbRowToRsvp,
  wishToDbRow,
  dbRowToWish,
  orderToDbRow,
  dbRowToOrder,
} from './supabase/adapter';

const STORAGE_KEYS = {
  INVITATIONS: 'uo_invitations',
  DELETED_INVITATIONS: 'uo_deleted_invitation_ids',
  DELETED_TEMPLATES: 'uo_deleted_template_ids',
  TEMPLATE_PRICES: 'uo_template_custom_prices',
  ORDERS: 'uo_orders',
  GUESTS: 'uo_guests',
  RSVPS: 'uo_rsvps',
  WISHES: 'uo_wishes',
};

const memoryFallback: Record<string, any> = {};

// Background hydration from IndexedDB for large media assets (photos, audio) & settings
if (typeof window !== 'undefined') {
  idbGet<Invitation[]>(STORAGE_KEYS.INVITATIONS).then((idbList) => {
    if (idbList && Array.isArray(idbList) && idbList.length > 0) {
      memoryFallback[STORAGE_KEYS.INVITATIONS] = idbList;
      window.dispatchEvent(new Event('uo_store_updated'));
    }
  }).catch(() => {});

  idbGet<Record<string, number>>(STORAGE_KEYS.TEMPLATE_PRICES).then((prices) => {
    if (prices && typeof prices === 'object' && Object.keys(prices).length > 0) {
      memoryFallback[STORAGE_KEYS.TEMPLATE_PRICES] = prices;
      window.dispatchEvent(new Event('uo_store_updated'));
    }
  }).catch(() => {});
}

function safeGetStorage<T>(key: string, fallback: T): T {
  if (memoryFallback[key] !== undefined) {
    return memoryFallback[key];
  }
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    const item = window.localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      memoryFallback[key] = parsed;
      return parsed;
    }
  } catch (e) {
    console.warn(`[Storage] Warning reading ${key} from storage:`, e);
  }
  return fallback;
}

function tryToRecoverQuota<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined') return;

    // Clear disposable caches first to free up immediate space
    window.localStorage.removeItem(STORAGE_KEYS.WISHES);
    window.localStorage.removeItem(STORAGE_KEYS.GUESTS);
    window.localStorage.removeItem(STORAGE_KEYS.ORDERS);

    // If key is INVITATIONS, save a sanitized lightweight version in localStorage
    if (key === STORAGE_KEYS.INVITATIONS && Array.isArray(value)) {
      window.localStorage.removeItem(key);

      const lightweight = (value as Invitation[]).map((inv) => {
        return {
          ...inv,
          // Strip heavy audio data URL from localStorage copy (IndexedDB & memory hold full audio)
          musicUrl:
            inv.musicUrl && inv.musicUrl.startsWith('data:') && inv.musicUrl.length > 30000
              ? undefined
              : inv.musicUrl,
          // Strip oversized cover image if needed from localStorage copy
          coverImageUrl:
            inv.coverImageUrl && inv.coverImageUrl.startsWith('data:') && inv.coverImageUrl.length > 100000
              ? 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop'
              : inv.coverImageUrl,
          gallery: (inv.gallery || []).map((g) => ({
            ...g,
            imageUrl:
              g.imageUrl && g.imageUrl.startsWith('data:') && g.imageUrl.length > 100000
                ? 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop'
                : g.imageUrl,
          })),
        };
      });

      window.localStorage.setItem(key, JSON.stringify(lightweight));
      window.dispatchEvent(new Event('uo_store_updated'));
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('uo_store_updated'));
  } catch {
    // Suppress console.error so Next.js doesn't pop up QuotaExceededError modal
    // Complete state is already preserved safely in memoryFallback & IndexedDB
    console.warn(`[Storage] State safely preserved in memory & IndexedDB (localStorage quota full).`);
  }
}

function safeSetStorage<T>(key: string, value: T): void {
  // Always update in-memory cache so runtime is instantaneous and never lost
  memoryFallback[key] = value;

  if (typeof window === 'undefined') {
    return;
  }

  // Persist to IndexedDB asynchronously (no 5MB quota limit)
  idbSet(key, value).catch(() => {});

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('uo_store_updated'));
  } catch (e: any) {
    const isQuota =
      e?.name === 'QuotaExceededError' ||
      e?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      e?.code === 22 ||
      e?.code === 1014;

    if (isQuota) {
      tryToRecoverQuota(key, value);
    } else {
      console.warn(`[Storage] Warning writing ${key} to storage:`, e);
    }
  }
}

export function getCustomTemplatePrices(): Record<string, number> {
  return safeGetStorage<Record<string, number>>(STORAGE_KEYS.TEMPLATE_PRICES, {});
}

export function getAllTemplates(): Template[] {
  const deletedTemplateIds = safeGetStorage<string[]>(STORAGE_KEYS.DELETED_TEMPLATES, []);
  const customPrices = getCustomTemplatePrices();
  return TEMPLATES.filter((t) => !deletedTemplateIds.includes(t.id) && !deletedTemplateIds.includes(t.slug)).map((t) => {
    const custom = customPrices[t.id] ?? customPrices[t.slug];
    return custom !== undefined ? { ...t, basePrice: custom } : t;
  });
}

export function getAllTemplatesWithStatus(): Array<Template & { isDeleted: boolean; isCustomPrice?: boolean; defaultBasePrice?: number }> {
  const deletedTemplateIds = safeGetStorage<string[]>(STORAGE_KEYS.DELETED_TEMPLATES, []);
  const customPrices = getCustomTemplatePrices();
  return TEMPLATES.map((t) => {
    const custom = customPrices[t.id] ?? customPrices[t.slug];
    const isCustomPrice = custom !== undefined;
    const effectivePrice = custom !== undefined ? custom : t.basePrice;
    return {
      ...t,
      basePrice: effectivePrice,
      defaultBasePrice: t.basePrice,
      isCustomPrice,
      isDeleted: deletedTemplateIds.includes(t.id) || deletedTemplateIds.includes(t.slug),
    };
  });
}

export function updateTemplatePrice(idOrSlug: string, newPrice: number): void {
  const prices = { ...getCustomTemplatePrices() };
  const target = TEMPLATES.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
  const targetId = target ? target.id : idOrSlug;
  const targetSlug = target ? target.slug : idOrSlug;

  const validPrice = Math.max(0, Math.round(Number(newPrice) || 0));
  prices[targetId] = validPrice;
  prices[targetSlug] = validPrice;

  safeSetStorage(STORAGE_KEYS.TEMPLATE_PRICES, prices);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('uo_store_updated'));
  }
}

export function resetTemplatePrice(idOrSlug: string): void {
  const prices = { ...getCustomTemplatePrices() };
  const target = TEMPLATES.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
  const targetId = target ? target.id : idOrSlug;
  const targetSlug = target ? target.slug : idOrSlug;

  delete prices[targetId];
  delete prices[targetSlug];
  delete prices[idOrSlug];

  safeSetStorage(STORAGE_KEYS.TEMPLATE_PRICES, prices);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('uo_store_updated'));
  }
}

export function deleteTemplate(idOrSlug: string): void {
  const deleted = safeGetStorage<string[]>(STORAGE_KEYS.DELETED_TEMPLATES, []);
  const target = TEMPLATES.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
  const targetId = target ? target.id : idOrSlug;
  const targetSlug = target ? target.slug : idOrSlug;

  if (!deleted.includes(targetId)) deleted.push(targetId);
  if (!deleted.includes(targetSlug)) deleted.push(targetSlug);

  safeSetStorage(STORAGE_KEYS.DELETED_TEMPLATES, deleted);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('uo_store_updated'));
  }
}

export function restoreTemplate(idOrSlug: string): void {
  const deleted = safeGetStorage<string[]>(STORAGE_KEYS.DELETED_TEMPLATES, []);
  const target = TEMPLATES.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
  const targetId = target ? target.id : idOrSlug;
  const targetSlug = target ? target.slug : idOrSlug;

  const updated = deleted.filter((id) => id !== targetId && id !== targetSlug && id !== idOrSlug);
  safeSetStorage(STORAGE_KEYS.DELETED_TEMPLATES, updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('uo_store_updated'));
  }
}

export function getTemplateById(id: string): Template | undefined {
  const active = getAllTemplates().find((t) => t.id === id || t.slug === id);
  if (active) return active;
  const original = TEMPLATES.find((t) => t.id === id || t.slug === id);
  if (!original) return undefined;
  const customPrices = getCustomTemplatePrices();
  const custom = customPrices[original.id] ?? customPrices[original.slug];
  return custom !== undefined ? { ...original, basePrice: custom } : original;
}

export function getAllPackages(): DiyPackage[] {
  return DIY_PACKAGES;
}

export function getPackageById(packageId?: string): DiyPackage {
  const found = DIY_PACKAGES.find((p) => p.id === packageId);
  return found || DIY_PACKAGES[0];
}

export function getTemplatesForPackage(packageId?: string): Template[] {
  const pkg = getPackageById(packageId);
  const activeTemplates = getAllTemplates();
  return activeTemplates.filter((t) => pkg.allowedTemplateIds.includes(t.id));
}

export function getAllAddons(): Addon[] {
  return ADDONS;
}

export function getAddonById(id: string): Addon | undefined {
  return ADDONS.find((a) => a.id === id);
}

export function getSampleInvitationForTemplate(templateId: string): Invitation {
  const tmpl = TEMPLATES.find((t) => t.id === templateId || t.slug === templateId);
  const targetId = tmpl ? tmpl.id : templateId;

  const match = INITIAL_INVITATIONS.find(
    (i) => i.templateId === targetId || i.id === targetId || i.slug === targetId
  );
  if (match) return JSON.parse(JSON.stringify(match));
  return JSON.parse(JSON.stringify(INITIAL_INVITATIONS[0]));
}

export function getAllInvitations(): Invitation[] {
  const deletedIds = safeGetStorage<string[]>(STORAGE_KEYS.DELETED_INVITATIONS, []);
  const stored = safeGetStorage<Invitation[]>(STORAGE_KEYS.INVITATIONS, INITIAL_INVITATIONS);
  
  // Make sure deleted invitations are never revived
  const filteredStored = stored.filter((i) => !deletedIds.includes(i.id) && !deletedIds.includes(i.slug));
  const merged = [...filteredStored];

  for (const init of INITIAL_INVITATIONS) {
    if (deletedIds.includes(init.id) || deletedIds.includes(init.slug)) continue;
    const existingIdx = merged.findIndex((i) => i.id === init.id || i.templateId === init.templateId);
    if (existingIdx === -1) {
      merged.push(init);
    } else {
      if (['inv-julian-nadia', 'inv-celine', 'inv-nocturne', 'inv-maya-adrian', 'inv-clara', 'inv-sora', 'inv-roma', 'inv-elodie', 'inv-mahadewi-bali', 'inv-bali-heritage'].includes(merged[existingIdx].id)) {
        merged[existingIdx] = {
          ...merged[existingIdx],
          ...init,
          sectionVisibility: {
            ...init.sectionVisibility,
          },
          videoUrl: init.videoUrl,
          activeAddonIds: init.activeAddonIds,
          couple: {
            ...merged[existingIdx].couple,
            ...init.couple,
          },
        };
      }
    }
  }
  return merged;
}

export async function getAllInvitationsAsync(): Promise<Invitation[]> {
  const deletedIds = safeGetStorage<string[]>(STORAGE_KEYS.DELETED_INVITATIONS, []);
  const localList = getAllInvitations();
  const supabase = getSupabase();
  if (!supabase) return localList;

  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return localList;
    const remoteList = data
      .map(dbRowToInvitation)
      .filter((r) => !deletedIds.includes(r.id) && !deletedIds.includes(r.slug));

    // Merge remote and local demo
    const merged = [...remoteList];
    for (const local of localList) {
      if (!deletedIds.includes(local.id) && !deletedIds.includes(local.slug)) {
        if (!merged.some((r) => r.id === local.id || r.slug === local.slug)) {
          merged.push(local);
        }
      }
    }
    return merged;
  } catch (err) {
    console.warn('Supabase getAllInvitationsAsync error, falling back locally:', err);
    return localList;
  }
}

export function getInvitationById(id: string): Invitation {
  const invitations = getAllInvitations();
  const found = invitations.find((inv) => inv.id === id || inv.slug === id);
  if (found) return found;

  // Fallback: If not found, instantiate a sample template so builder never hangs
  const sample = getSampleInvitationForTemplate(id);
  const fallbackInv: Invitation = {
    ...sample,
    id,
    title: id.startsWith('inv-') ? 'The Wedding of Julian & Nadia' : sample.title,
    slug: id.startsWith('inv-') ? id.replace('inv-', '') : sample.slug,
  };
  saveInvitation(fallbackInv);
  return fallbackInv;
}

export async function getInvitationByIdAsync(id: string): Promise<Invitation> {
  // 1. Try Supabase first
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .maybeSingle();

      if (data && !error) {
        const inv = dbRowToInvitation(data);
        const list = getAllInvitations();
        const idx = list.findIndex((i) => i.id === inv.id);
        if (idx >= 0) list[idx] = inv;
        else list.unshift(inv);
        safeSetStorage(STORAGE_KEYS.INVITATIONS, list);
        return inv;
      }
    } catch (e) {
      console.warn('[Supabase] Could not fetch invitation by id:', e);
    }
  }

  // 2. Fallback to local memory / local storage
  const syncFound = getInvitationById(id);
  if (syncFound) return syncFound;

  if (typeof window !== 'undefined') {
    try {
      const idbList = await idbGet<Invitation[]>(STORAGE_KEYS.INVITATIONS);
      if (idbList && Array.isArray(idbList)) {
        const found = idbList.find((inv) => inv.id === id || inv.slug === id);
        if (found) {
          memoryFallback[STORAGE_KEYS.INVITATIONS] = idbList;
          return found;
        }
      }
    } catch (err) {
      console.warn('[Storage] Error reading idb in getInvitationByIdAsync:', err);
    }
  }

  const sample = getSampleInvitationForTemplate(id);
  const fallbackInv: Invitation = {
    ...sample,
    id,
    title: id.startsWith('inv-') ? 'The Wedding of Julian & Nadia' : sample.title,
    slug: id.startsWith('inv-') ? id.replace('inv-', '') : sample.slug,
  };
  saveInvitation(fallbackInv);
  return fallbackInv;
}

export function getInvitationBySlug(slug: string): Invitation | undefined {
  const invitations = getAllInvitations();
  return invitations.find((inv) => inv.slug === slug);
}

export async function getInvitationBySlugAsync(slug: string): Promise<Invitation | undefined> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (data && !error) {
        const inv = dbRowToInvitation(data);
        const list = getAllInvitations();
        const idx = list.findIndex((i) => i.id === inv.id);
        if (idx >= 0) list[idx] = inv;
        else list.unshift(inv);
        safeSetStorage(STORAGE_KEYS.INVITATIONS, list);
        return inv;
      }
    } catch (e) {
      console.warn('[Supabase] Could not fetch invitation by slug:', e);
    }
  }

  return getInvitationBySlug(slug);
}

export async function saveInvitationRemote(invitation: Invitation): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const row = invitationToDbRow(invitation);
    const { error } = await supabase.from('invitations').upsert(row);
    if (error) {
      console.warn('[Supabase] Failed to upsert invitation:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Error saving invitation remotely:', err);
    return false;
  }
}

export function saveInvitation(invitation: Invitation): void {
  const list = getAllInvitations();
  const index = list.findIndex((i) => i.id === invitation.id);
  const updatedInvitation = {
    ...invitation,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    list[index] = updatedInvitation;
  } else {
    list.unshift(updatedInvitation);
  }
  safeSetStorage(STORAGE_KEYS.INVITATIONS, list);

  // Background auto-sync to Supabase
  saveInvitationRemote(updatedInvitation).catch((e) => {
    console.warn('[Supabase Sync] Background save notice:', e);
  });
}

export async function deleteInvitationRemote(idOrSlug: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    await supabase.from('invitations').delete().or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
    await supabase.from('rsvps').delete().eq('invitation_id', idOrSlug);
    await supabase.from('wishes').delete().eq('invitation_id', idOrSlug);
    await supabase.from('guest_links').delete().eq('invitation_id', idOrSlug);
    return true;
  } catch (err) {
    console.warn('[Supabase] Error deleting invitation remotely:', err);
    return false;
  }
}

export function deleteInvitation(idOrSlug: string): void {
  const deletedIds = safeGetStorage<string[]>(STORAGE_KEYS.DELETED_INVITATIONS, []);
  if (!deletedIds.includes(idOrSlug)) {
    deletedIds.push(idOrSlug);
    safeSetStorage(STORAGE_KEYS.DELETED_INVITATIONS, deletedIds);
  }

  const stored = safeGetStorage<Invitation[]>(STORAGE_KEYS.INVITATIONS, INITIAL_INVITATIONS);
  const updated = stored.filter((i) => i.id !== idOrSlug && i.slug !== idOrSlug);
  safeSetStorage(STORAGE_KEYS.INVITATIONS, updated);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('uo_store_updated'));
  }

  deleteInvitationRemote(idOrSlug).catch((e) => {
    console.warn('[Supabase Sync] Remote delete notice:', e);
  });
}

export async function deleteInvitationAsync(idOrSlug: string): Promise<void> {
  deleteInvitation(idOrSlug);
}

export function clearAllTestDrafts(): number {
  const list = getAllInvitations();
  const drafts = list.filter(
    (i) => i.status === 'DRAFT' && (i.slug.startsWith('four-wedding-') || i.slug.startsWith('our-wedding-') || i.slug.startsWith('test-invitation-'))
  );
  drafts.forEach((d) => deleteInvitation(d.id));
  return drafts.length;
}

export function createDraftInvitation(
  templateId: string,
  packageId: string = 'pkg-essential',
  serviceType: ServiceType = 'diy'
): Invitation {
  const template = getTemplateById(templateId) || TEMPLATES[0];
  const resolvedPackageId = template.basePrice === 199000
    ? 'pkg-premium'
    : (packageId === 'pkg-premium' && template.basePrice === 99000 ? 'pkg-essential' : (packageId || 'pkg-essential'));
  const pkg = getPackageById(resolvedPackageId);
  const id = 'inv-' + Math.random().toString(36).substring(2, 9);
  const slug = 'our-wedding-' + Math.random().toString(36).substring(2, 6);

  // Initialize active addons according to package
  const defaultAddons = pkg.tier === 'premium'
    ? ['premium-animation', 'music-backsound', 'love-story', 'rsvp-system', 'extra-gallery']
    : ['music-backsound'];

  const isMahadewi = template.id === 'mahadewi-bali';
  const isBaliHeritage = template.id === 'bali-heritage';

  const newInvitation: Invitation = {
    id,
    userId: 'user-default-1',
    title: isBaliHeritage ? 'Pawiwahan Putu & Sinta' : isMahadewi ? 'Pawiwahan Agung Rama & Gayatri' : 'The Wedding Celebration',
    slug,
    serviceType,
    status: 'DRAFT',
    packageId: pkg.id,
    templateId: template.id,
    fontPreset: 'editorial-cormorant',
    colorPreset: isBaliHeritage ? 'nocturne-black' : isMahadewi ? 'warm-linen' : template.theme.isDark ? 'nocturne-black' : 'offwhite-noir',
    layoutPreset: isBaliHeritage ? 'framed-portrait' : isMahadewi ? 'framed-portrait' : 'split-editorial',
    animationPreset: 'curtain-reveal',
    coverImageUrl: template.coverImageUrl,
    coverTitle: isBaliHeritage ? 'PAWIWAHAN' : isMahadewi ? 'PAWIWAHAN AGUNG · BALINESE HERITAGE' : undefined,
    openingQuote: isBaliHeritage
      ? 'Kami dipertemukan oleh waktu, dipersatukan oleh cinta, dan akan melangkah bersama dalam ikatan suci Pawiwahan.'
      : isMahadewi
      ? 'Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa, kami bermaksud menyelenggarakan Upacara Manusa Yadnya Pawiwahan putra-putri kami.'
      : 'A celebration of love, commitment, and new beginnings.',
    holyVerse: isBaliHeritage
      ? 'Dua Hati, Satu Perjalanan, Dalam Restu Semesta.'
      : isMahadewi
      ? 'Ihaiva stam ma vi yaustam visvam ayur vyasnutam kridantau putrair naptrbhih modamanau sve grhe. (Rg Veda X.85.42) — Wahai pasangan pengantin, semoga senantiasa bersatu dalam cinta kasih dan damai abadi.'
      : 'Two lives, two hearts, joined together in friendship, united forever in love.',
    eventDate: isBaliHeritage ? '2026-10-24' : isMahadewi ? '2026-12-18' : '2026-11-20',
    couple: isBaliHeritage
      ? {
          groomName: 'I Putu Wira Yasa, S.T.',
          groomNickname: 'Putu',
          groomFather: 'I Made Wira Wardana',
          groomMother: 'Ni Ketut Suartini',
          groomBio: 'Putra pertama dari Banjar Kaja, Denpasar.',
          groomPhotoUrl: '/images/bali-heritage-cover.jpg',
          groomInstagram: '@putrawira',
          groomLabelBadge: 'Sang Purusha',
          brideName: 'Ni Kadek Sinta Dewi, B.Des',
          brideNickname: 'Sinta',
          brideFather: 'I Wayan Sinta Guna',
          brideMother: 'Ni Made Sukarni',
          brideBio: 'Putri kedua dari Banjar Kangin, Ubud.',
          bridePhotoUrl: '/images/bali-heritage-secondary.jpg',
          brideInstagram: '@sintadewi',
          brideLabelBadge: 'Sang Pradana',
        }
      : isMahadewi
      ? {
          groomName: 'Ida Bagus Rama Putra, S.T.',
          groomNickname: 'Rama',
          groomFather: 'Ida Bagus Made Sujana',
          groomMother: 'Ida Ayu Putu Manik',
          groomBio: 'Putra pertama dari Griya Tegeh, Sanur.',
          groomPhotoUrl: '/images/rama-portrait.jpg',
          groomInstagram: '@rama.putra',
          groomLabelBadge: 'Sang Purusha',
          brideName: 'Ida Ayu Gayatri Devi, B.Des',
          brideNickname: 'Gayatri',
          brideFather: 'Ida Bagus Nyoman Semara',
          brideMother: 'Ida Ayu Made Saraswati',
          brideBio: 'Putri kedua dari Griya Gede, Ubud.',
          bridePhotoUrl: '/images/gayatri-portrait.jpg',
          brideInstagram: '@gayatridevi',
          brideLabelBadge: 'Sang Pradana',
        }
      : {
          groomName: 'Julian Pratama',
          groomNickname: 'Julian',
          groomFather: 'Bpk. Hendra Pratama',
          groomMother: 'Ibu Ratna Dewi',
          groomBio: 'Deskripsi singkat mengenai mempelai pria.',
          groomPhotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
          groomLabelBadge: '',
          brideName: 'Nadia Salsabila',
          brideNickname: 'Nadia',
          brideFather: 'Bpk. Bambang Soetanto',
          brideMother: 'Ibu Sri Rahayu',
          brideBio: 'Deskripsi singkat mengenai mempelai wanita.',
          bridePhotoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
          brideLabelBadge: '',
        },
    events: isBaliHeritage
      ? [
          {
            id: 'event-1',
            name: 'Melaspas',
            date: '2026-10-24',
            startTime: '08:00',
            endTime: '10:00',
            timezone: 'WITA',
            venueName: 'The Apurva Kempinski Bali',
            address: 'Jl. Raya Nusa Dua Selatan, Sawangan, Nusa Dua, Bali',
            googleMapsUrl: 'https://maps.google.com/?q=The+Apurva+Kempinski+Bali',
            orderIndex: 0,
          },
          {
            id: 'event-2',
            name: 'Mepamit',
            date: '2026-10-24',
            startTime: '10:00',
            endTime: '12:00',
            timezone: 'WITA',
            venueName: 'The Apurva Kempinski Bali',
            address: 'Jl. Raya Nusa Dua Selatan, Sawangan, Nusa Dua, Bali',
            googleMapsUrl: 'https://maps.google.com/?q=The+Apurva+Kempinski+Bali',
            orderIndex: 1,
          },
          {
            id: 'event-3',
            name: 'Pawiwahan',
            date: '2026-10-24',
            startTime: '13:00',
            endTime: '16:00',
            timezone: 'WITA',
            venueName: 'The Apurva Kempinski Bali',
            address: 'Jl. Raya Nusa Dua Selatan, Sawangan, Nusa Dua, Bali',
            googleMapsUrl: 'https://maps.google.com/?q=The+Apurva+Kempinski+Bali',
            orderIndex: 2,
          },
          {
            id: 'event-4',
            name: 'Resepsi',
            date: '2026-10-24',
            startTime: '18:00',
            endTime: '22:00',
            timezone: 'WITA',
            venueName: 'The Apurva Kempinski Bali',
            address: 'Jl. Raya Nusa Dua Selatan, Sawangan, Nusa Dua, Bali',
            googleMapsUrl: 'https://maps.google.com/?q=The+Apurva+Kempinski+Bali',
            orderIndex: 3,
          },
        ]
      : isMahadewi
      ? [
          {
            id: 'event-1',
            name: 'Upacara Mepamit',
            date: '2026-12-18',
            startTime: '08:00',
            endTime: '10:00',
            timezone: 'WITA',
            venueName: 'Griya Gede, Ubud',
            address: 'Jl. Raya Ubud No. 45, Gianyar, Bali',
            googleMapsUrl: 'https://maps.google.com/?q=Ubud+Bali',
            orderIndex: 0,
          },
          {
            id: 'event-2',
            name: 'Upacara Pawiwahan & Madengen-dengen',
            date: '2026-12-18',
            startTime: '10:30',
            endTime: '13:00',
            timezone: 'WITA',
            venueName: 'Griya Tegeh, Sanur',
            address: 'Jl. Danau Tamblingan No. 88, Sanur, Denpasar, Bali',
            googleMapsUrl: 'https://maps.google.com/?q=Sanur+Bali',
            orderIndex: 1,
          },
          {
            id: 'event-3',
            name: 'Resepsi & Ramah Tamah',
            date: '2026-12-18',
            startTime: '17:30',
            endTime: '21:30',
            timezone: 'WITA',
            venueName: 'The Solstice Pavilion Bali',
            address: 'Jl. Pantai Karang No. 12, Sanur, Bali',
            googleMapsUrl: 'https://maps.google.com/?q=Sanur+Bali',
            orderIndex: 2,
          },
        ]
      : [
          {
            id: 'event-1',
            name: 'Akad Nikah / Pemberkatan',
            date: '2026-11-20',
            startTime: '09:00',
            endTime: '11:00',
            timezone: 'WIB',
            venueName: 'The Conservatory',
            address: 'Jl. Sudirman No. 12, Jakarta',
            googleMapsUrl: 'https://maps.google.com',
            orderIndex: 0,
          },
          {
            id: 'event-2',
            name: 'Resepsi Pernikahan',
            date: '2026-11-20',
            startTime: '19:00',
            endTime: '21:30',
            timezone: 'WIB',
            venueName: 'The Grand Ballroom',
            address: 'Jl. Sudirman No. 12, Jakarta',
            googleMapsUrl: 'https://maps.google.com',
            orderIndex: 1,
          },
        ],
    gallery: [
      {
        id: 'gal-new-1',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
        caption: 'Our golden hour memories',
        aspectRatio: '4:5',
        orderIndex: 0,
      },
      {
        id: 'gal-new-2',
        imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
        caption: 'Sunset romance by the shore',
        aspectRatio: '1:1',
        orderIndex: 1,
      },
      {
        id: 'gal-new-3',
        imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop',
        caption: 'Intimate prewedding vows rehearsal',
        aspectRatio: '4:5',
        orderIndex: 2,
      },
      {
        id: 'gal-new-4',
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
        caption: 'Under the starlight celebration',
        aspectRatio: '16:9',
        orderIndex: 3,
      },
    ],
    loveStories: [
      {
        id: 'story-new-1',
        yearOrDate: '2022',
        title: 'Where It All Began',
        story: 'Our journey began with a simple hello that changed our lives forever.',
        orderIndex: 0,
      },
    ],
    gifts: [
      {
        id: 'gift-new-1',
        type: 'BANK',
        providerName: 'BCA (Bank Central Asia)',
        accountNumber: '1234567890',
        accountHolder: 'Nama Penerima',
      },
    ],
    musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3',
    videoUrl:
      template.archetype === 'dark-luxury-cinema' || template.archetype === 'romantic-cinema'
        ? 'https://www.youtube.com/watch?v=ScMzIvxBSi4'
        : undefined,
    sectionVisibility: {
      cover: true,
      profile: true,
      events: true,
      countdown: true,
      gallery: true,
      story: true,
      video: template.archetype === 'dark-luxury-cinema' || template.archetype === 'romantic-cinema',
      rsvp: true,
      wishes: true,
      gifts: true,
      quotes: true,
    },
    activeAddonIds:
      template.archetype === 'dark-luxury-cinema'
        ? [...defaultAddons, 'video-prewedding']
        : defaultAddons,
    viewsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveInvitation(newInvitation);
  return newInvitation;
}

export function calculateOrderPricing(
  packageIdOrTemplateId: string | undefined,
  templateIdOrAddons: string | string[],
  maybeAddonIds?: string[]
) {
  let packageId: string = 'pkg-essential';
  let templateId: string = 'aurelia-minimal';
  let activeAddonIds: string[] = [];

  if (Array.isArray(templateIdOrAddons)) {
    templateId = packageIdOrTemplateId || 'aurelia-minimal';
    activeAddonIds = templateIdOrAddons;
    packageId = 'pkg-essential';
  } else {
    packageId = packageIdOrTemplateId || 'pkg-essential';
    templateId = templateIdOrAddons || 'aurelia-minimal';
    activeAddonIds = maybeAddonIds || [];
  }

  const pkg = getPackageById(packageId);
  const template = getTemplateById(templateId) || TEMPLATES[0];
  const basePrice = template?.basePrice !== undefined ? template.basePrice : pkg.price;

  const isIncludedAddon = (addonId: string) => {
    if (addonId === 'living-video-bg' && template.archetype === 'cinematic-motion') {
      return true;
    }
    if (pkg.tier === 'premium') {
      return ['premium-animation', 'love-story', 'rsvp-system', 'extra-gallery', 'music-backsound', 'custom-guest-name'].includes(addonId);
    }
    return ['music-backsound'].includes(addonId);
  };

  const isLockedAddon = (addonId: string) => {
    return pkg.lockedAddonIds.includes(addonId);
  };

  const isAvailableAddon = (addonId: string) => {
    return pkg.availableAddonIds.includes(addonId);
  };

  // Paid addons are only those active, not included in package, and not locked
  const selectedPaidAddons = ADDONS.filter((a) => {
    if (!activeAddonIds.includes(a.id)) return false;
    if (isIncludedAddon(a.id)) return false;
    if (isLockedAddon(a.id)) return false;
    return true;
  });

  const addonsTotal = selectedPaidAddons.reduce((sum, item) => sum + item.defaultPrice, 0);
  const totalAmount = basePrice + addonsTotal;

  return {
    pkg,
    basePrice,
    packagePrice: basePrice,
    template,
    templatePrice: basePrice,
    selectedPaidAddons,
    selectedAddons: selectedPaidAddons,
    addonsTotal,
    totalAmount,
    isIncludedAddon,
    isLockedAddon,
    isAvailableAddon,
  };
}

export function createOrderForInvitation(invitationId: string): Order {
  const invitation = getInvitationById(invitationId);
  if (!invitation) throw new Error('Invitation not found');

  const { pkg, basePrice, selectedPaidAddons, totalAmount } = calculateOrderPricing(
    invitation.packageId,
    invitation.templateId,
    invitation.activeAddonIds
  );

  const orderNumber = 'UO-' + Math.floor(100000 + Math.random() * 900000);
  const items: OrderItem[] = [
    {
      id: `item-pkg-${pkg.id}`,
      itemType: 'PACKAGE',
      referenceId: pkg.id,
      itemName: `Paket ${pkg.name}`,
      unitPrice: basePrice,
      quantity: 1,
      subtotal: basePrice,
    },
    ...selectedPaidAddons.map((addon) => ({
      id: `item-addon-${addon.id}`,
      itemType: 'ADDON' as const,
      referenceId: addon.id,
      itemName: addon.name,
      unitPrice: addon.defaultPrice,
      quantity: 1,
      subtotal: addon.defaultPrice,
    })),
  ];

  const newOrder: Order = {
    id: 'ord-' + Math.random().toString(36).substring(2, 9),
    orderNumber,
    userId: invitation.userId,
    invitationId: invitation.id,
    items,
    totalAmount,
    discountAmount: 0,
    netAmount: totalAmount,
    paymentStatus: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  const orders = safeGetStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  orders.unshift(newOrder);
  safeSetStorage(STORAGE_KEYS.ORDERS, orders);

  return newOrder;
}

export function getOrderById(orderId: string): Order | undefined {
  const orders = safeGetStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
}

export function generateInvitationCredentials(invitation: Invitation): { username: string; password: string } {
  const username = invitation.dashboardUsername || invitation.slug;
  const password = invitation.dashboardPassword || `KITA-${Math.floor(1000 + Math.random() * 9000)}`;
  return { username, password };
}

export function verifyDashboardLogin(usernameOrSlug: string, password: string): Invitation | null {
  const list = getAllInvitations();
  const cleanUser = usernameOrSlug.trim().toLowerCase();
  const cleanPass = password.trim();

  const found = list.find((inv) => {
    const userMatches =
      (inv.dashboardUsername && inv.dashboardUsername.toLowerCase() === cleanUser) ||
      inv.slug.toLowerCase() === cleanUser ||
      inv.id.toLowerCase() === cleanUser;
    const passMatches =
      inv.dashboardPassword && inv.dashboardPassword.trim() === cleanPass;
    return userMatches && passMatches;
  });

  return found || null;
}

export function getCurrentSession(): { invitationId: string; username: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('uo_client_session');
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function setCurrentSession(invitationId: string, username: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('uo_client_session', JSON.stringify({ invitationId, username, loggedInAt: new Date().toISOString() }));
  window.dispatchEvent(new Event('uo_auth_changed'));
}

export function clearCurrentSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('uo_client_session');
  window.dispatchEvent(new Event('uo_auth_changed'));
}

export function markOrderAsPaid(orderId: string, paymentMethod: string = 'QRIS Instant'): Order | undefined {
  const orders = safeGetStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  const order = orders.find((o) => o.id === orderId);
  if (!order) return undefined;

  order.paymentStatus = 'PAID';
  order.paymentMethod = paymentMethod;
  order.paidAt = new Date().toISOString();

  // Auto-Publish the related invitation & assign dashboard credentials!
  const invitation = getInvitationById(order.invitationId);
  if (invitation) {
    invitation.status = 'ACTIVE';
    if (!invitation.dashboardUsername) {
      invitation.dashboardUsername = invitation.slug;
    }
    if (!invitation.dashboardPassword) {
      invitation.dashboardPassword = `KITA-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    order.dashboardUsername = invitation.dashboardUsername;
    order.dashboardPassword = invitation.dashboardPassword;
    saveInvitation(invitation);
  }

  safeSetStorage(STORAGE_KEYS.ORDERS, orders);
  return order;
}

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-demo-01',
    orderNumber: 'UO-849201',
    userId: 'usr-demo-1',
    invitationId: 'inv-aurelia-demo',
    items: [
      {
        id: 'item-1',
        itemType: 'PACKAGE',
        referenceId: 'pkg-essential',
        itemName: 'Paket Essential DIY',
        unitPrice: 99000,
        quantity: 1,
        subtotal: 99000,
      },
    ],
    totalAmount: 99000,
    discountAmount: 0,
    netAmount: 99000,
    paymentStatus: 'PAID',
    paymentMethod: 'BCA Virtual Account',
    paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-demo-02',
    orderNumber: 'UO-938102',
    userId: 'usr-demo-2',
    invitationId: 'inv-nocturne-demo',
    items: [
      {
        id: 'item-2',
        itemType: 'PACKAGE',
        referenceId: 'pkg-premium',
        itemName: 'Paket Premium All-In',
        unitPrice: 199000,
        quantity: 1,
        subtotal: 199000,
      },
      {
        id: 'item-3',
        itemType: 'ADDON',
        referenceId: 'addon-custom-domain',
        itemName: 'Kustom Subdomain Eksklusif',
        unitPrice: 49000,
        quantity: 1,
        subtotal: 49000,
      },
    ],
    totalAmount: 248000,
    discountAmount: 0,
    netAmount: 248000,
    paymentStatus: 'PAID',
    paymentMethod: 'QRIS Instant',
    paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-demo-03',
    orderNumber: 'UO-102938',
    userId: 'usr-demo-3',
    invitationId: 'inv-celine-demo',
    items: [
      {
        id: 'item-4',
        itemType: 'CUSTOM_PACKAGE',
        referenceId: 'exclusive',
        itemName: 'Custom Atelier: Exclusive Bespoke',
        unitPrice: 799000,
        quantity: 1,
        subtotal: 799000,
      },
    ],
    totalAmount: 799000,
    discountAmount: 0,
    netAmount: 799000,
    paymentStatus: 'PENDING',
    paymentMethod: 'Bank Mandiri Transfer',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

export function getAllOrders(): Order[] {
  return safeGetStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_DEMO_ORDERS);
}

export async function getAllOrdersAsync(): Promise<Order[]> {
  const localOrders = getAllOrders();
  const supabase = getSupabase();
  if (!supabase) return localOrders;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return localOrders;
    return data.map(dbRowToOrder);
  } catch (err) {
    console.warn('Supabase getAllOrdersAsync error, falling back locally:', err);
    return localOrders;
  }
}

export async function updateOrderStatusAsync(
  orderId: string,
  status: 'PAID' | 'PENDING' | 'FAILED' | 'EXPIRED',
  paymentMethod: string = 'Manual Verification'
): Promise<Order | undefined> {
  const orders = getAllOrders();
  const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return undefined;

  order.paymentStatus = status;
  order.paymentMethod = paymentMethod;
  if (status === 'PAID') {
    order.paidAt = new Date().toISOString();
  }
  safeSetStorage(STORAGE_KEYS.ORDERS, orders);

  if (status === 'PAID') {
    const inv = getInvitationById(order.invitationId);
    if (inv) {
      inv.status = 'ACTIVE';
      saveInvitation(inv);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from('orders')
        .update({
          payment_status: status,
          payment_method: paymentMethod,
          paid_at: status === 'PAID' ? new Date().toISOString() : null,
        })
        .eq('id', order.id);
    } catch (err) {
      console.warn('Supabase updateOrderStatusAsync error:', err);
    }
  }

  return order;
}

export function deleteOrder(orderId: string): void {
  const orders = getAllOrders();
  const filtered = orders.filter((o) => o.id !== orderId && o.orderNumber !== orderId);
  safeSetStorage(STORAGE_KEYS.ORDERS, filtered);
}

export async function deleteOrderAsync(orderId: string): Promise<void> {
  deleteOrder(orderId);
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('orders').delete().eq('id', orderId);
    } catch (err) {
      console.warn('Supabase deleteOrder error:', err);
    }
  }
}

export function clearAllOrders(): void {
  safeSetStorage(STORAGE_KEYS.ORDERS, []);
}

export async function clearAllOrdersAsync(): Promise<void> {
  clearAllOrders();
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('orders').delete().neq('id', 'non-existent-dummy-id');
    } catch (err) {
      console.warn('Supabase clearAllOrders error:', err);
    }
  }
}

export async function updateInvitationStatusAsync(invitationId: string, newStatus: any): Promise<void> {
  const inv = getInvitationById(invitationId);
  if (inv) {
    inv.status = newStatus;
    saveInvitation(inv);
  }
}

// Guest links
export function getGuestsForInvitation(invitationId: string): GuestLink[] {
  const record = safeGetStorage<Record<string, GuestLink[]>>(STORAGE_KEYS.GUESTS, INITIAL_GUEST_LINKS);
  return record[invitationId] || [];
}

export function addGuestLink(invitationId: string, guestName: string, category: GuestLink['category'] = 'Umum', whatsappNumber?: string): GuestLink {
  const record = safeGetStorage<Record<string, GuestLink[]>>(STORAGE_KEYS.GUESTS, INITIAL_GUEST_LINKS);
  const list = record[invitationId] || [];

  const guestSlug = guestName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newGuest: GuestLink = {
    id: 'gst-' + Math.random().toString(36).substring(2, 9),
    guestName,
    guestSlug: guestSlug || 'tamu-kehormatan',
    category,
    whatsappNumber,
    hasOpened: false,
    invitationSent: false,
  };

  list.unshift(newGuest);
  record[invitationId] = list;
  safeSetStorage(STORAGE_KEYS.GUESTS, record);

  return newGuest;
}

// RSVPs
export function getRsvpsForInvitation(invitationId: string): RsvpEntry[] {
  const record = safeGetStorage<Record<string, RsvpEntry[]>>(STORAGE_KEYS.RSVPS, INITIAL_RSVPS);
  return record[invitationId] || [];
}

export function submitRsvp(invitationId: string, guestName: string, status: RsvpEntry['status'], pax: number, notes?: string): RsvpEntry {
  const record = safeGetStorage<Record<string, RsvpEntry[]>>(STORAGE_KEYS.RSVPS, INITIAL_RSVPS);
  const list = record[invitationId] || [];

  const newRsvp: RsvpEntry = {
    id: 'rsvp-' + Math.random().toString(36).substring(2, 9),
    guestName,
    status,
    pax,
    notes,
    createdAt: new Date().toISOString(),
  };

  list.unshift(newRsvp);
  record[invitationId] = list;
  safeSetStorage(STORAGE_KEYS.RSVPS, record);

  return newRsvp;
}

// Wishes
export function getWishesForInvitation(invitationId: string): WishEntry[] {
  const record = safeGetStorage<Record<string, WishEntry[]>>(STORAGE_KEYS.WISHES, INITIAL_WISHES);
  return record[invitationId] || [];
}

export function submitWish(invitationId: string, senderName: string, message: string, relationship?: string): WishEntry {
  const record = safeGetStorage<Record<string, WishEntry[]>>(STORAGE_KEYS.WISHES, INITIAL_WISHES);
  const list = record[invitationId] || [];

  const newWish: WishEntry = {
    id: 'wish-' + Math.random().toString(36).substring(2, 9),
    senderName,
    message,
    relationship,
    isApproved: true,
    createdAt: new Date().toISOString(),
  };

  list.unshift(newWish);
  record[invitationId] = list;
  safeSetStorage(STORAGE_KEYS.WISHES, record);

  return newWish;
}

export function deleteWish(invitationId: string, wishId: string): void {
  const record = safeGetStorage<Record<string, WishEntry[]>>(STORAGE_KEYS.WISHES, INITIAL_WISHES);
  const list = record[invitationId] || [];
  record[invitationId] = list.filter((w) => w.id !== wishId);
  safeSetStorage(STORAGE_KEYS.WISHES, record);
}

export function toggleWishApproval(invitationId: string, wishId: string): void {
  const record = safeGetStorage<Record<string, WishEntry[]>>(STORAGE_KEYS.WISHES, INITIAL_WISHES);
  const list = record[invitationId] || [];
  const wish = list.find((w) => w.id === wishId);
  if (wish) {
    wish.isApproved = !wish.isApproved;
    record[invitationId] = list;
    safeSetStorage(STORAGE_KEYS.WISHES, record);
    toggleWishApprovalAsync(invitationId, wishId, wish.isApproved).catch(() => {});
  }
}

// ============================================================================
// SUPABASE ASYNC REMOTE METHODS (RSVP, Wishes, Guest Links, Orders)
// ============================================================================

// Remote RSVPs
export async function getRsvpsForInvitationAsync(invitationId: string): Promise<RsvpEntry[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false });

      if (data && !error) {
        const rsvps = data.map(dbRowToRsvp);
        const record = safeGetStorage<Record<string, RsvpEntry[]>>(STORAGE_KEYS.RSVPS, INITIAL_RSVPS);
        record[invitationId] = rsvps;
        safeSetStorage(STORAGE_KEYS.RSVPS, record);
        return rsvps;
      }
    } catch (e) {
      console.warn('[Supabase] Error fetching RSVPs:', e);
    }
  }
  return getRsvpsForInvitation(invitationId);
}

export async function submitRsvpAsync(
  invitationId: string,
  guestName: string,
  status: RsvpEntry['status'],
  pax: number,
  notes?: string
): Promise<RsvpEntry> {
  const localRsvp = submitRsvp(invitationId, guestName, status, pax, notes);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const row = rsvpToDbRow(invitationId, localRsvp);
      const { data, error } = await supabase.from('rsvps').insert(row).select().single();
      if (data && !error) {
        return dbRowToRsvp(data);
      }
    } catch (e) {
      console.warn('[Supabase] Error submitting RSVP:', e);
    }
  }
  return localRsvp;
}

// Remote Wishes
export async function getWishesForInvitationAsync(invitationId: string): Promise<WishEntry[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false });

      if (data && !error) {
        const wishes = data.map(dbRowToWish);
        const record = safeGetStorage<Record<string, WishEntry[]>>(STORAGE_KEYS.WISHES, INITIAL_WISHES);
        record[invitationId] = wishes;
        safeSetStorage(STORAGE_KEYS.WISHES, record);
        return wishes;
      }
    } catch (e) {
      console.warn('[Supabase] Error fetching wishes:', e);
    }
  }
  return getWishesForInvitation(invitationId);
}

export async function submitWishAsync(
  invitationId: string,
  senderName: string,
  message: string,
  relationship?: string
): Promise<WishEntry> {
  const localWish = submitWish(invitationId, senderName, message, relationship);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const row = wishToDbRow(invitationId, localWish);
      const { data, error } = await supabase.from('wishes').insert(row).select().single();
      if (data && !error) {
        return dbRowToWish(data);
      }
    } catch (e) {
      console.warn('[Supabase] Error submitting wish:', e);
    }
  }
  return localWish;
}

export async function deleteWishAsync(invitationId: string, wishId: string): Promise<void> {
  deleteWish(invitationId, wishId);
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('wishes').delete().eq('id', wishId);
    } catch (e) {
      console.warn('[Supabase] Error deleting wish:', e);
    }
  }
}

export async function toggleWishApprovalAsync(invitationId: string, wishId: string, nextStatus: boolean): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('wishes').update({ is_approved: nextStatus }).eq('id', wishId);
    } catch (e) {
      console.warn('[Supabase] Error toggling wish approval:', e);
    }
  }
}

// Remote Guest Links
export async function getGuestsForInvitationAsync(invitationId: string): Promise<GuestLink[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('guest_links')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false });

      if (data && !error) {
        const guests = data.map(dbRowToGuest);
        const record = safeGetStorage<Record<string, GuestLink[]>>(STORAGE_KEYS.GUESTS, INITIAL_GUEST_LINKS);
        record[invitationId] = guests;
        safeSetStorage(STORAGE_KEYS.GUESTS, record);
        return guests;
      }
    } catch (e) {
      console.warn('[Supabase] Error fetching guests:', e);
    }
  }
  return getGuestsForInvitation(invitationId);
}

export async function addGuestLinkAsync(
  invitationId: string,
  guestName: string,
  category: GuestLink['category'] = 'Umum',
  whatsappNumber?: string
): Promise<GuestLink> {
  const localGuest = addGuestLink(invitationId, guestName, category, whatsappNumber);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const row = guestToDbRow(invitationId, localGuest);
      const { data, error } = await supabase.from('guest_links').insert(row).select().single();
      if (data && !error) {
        const guestFromDb = dbRowToGuest(data);
        return guestFromDb;
      }
    } catch (e) {
      console.warn('[Supabase] Error adding guest link:', e);
    }
  }
  return localGuest;
}

export async function toggleGuestCheckInAsync(
  invitationId: string,
  guestId: string,
  hasOpened: boolean
): Promise<boolean> {
  // Update local storage
  const record = safeGetStorage<Record<string, GuestLink[]>>(STORAGE_KEYS.GUESTS, INITIAL_GUEST_LINKS);
  const list = record[invitationId] || [];
  const found = list.find((g) => g.id === guestId || g.guestSlug === guestId);
  if (found) {
    found.hasOpened = hasOpened;
    record[invitationId] = list;
    safeSetStorage(STORAGE_KEYS.GUESTS, record);
  }

  // Update Supabase
  const supabase = getSupabase();
  if (supabase) {
    try {
      const query = supabase.from('guest_links').update({ has_opened: hasOpened });
      if (guestId.includes('-') && guestId.length === 36) {
        await query.eq('id', guestId);
      } else {
        await query.eq('invitation_id', invitationId).eq('guest_slug', guestId);
      }
      return true;
    } catch (e) {
      console.warn('[Supabase] Error toggling guest checkin:', e);
    }
  }
  return true;
}

export async function deleteGuestLinkAsync(invitationId: string, guestId: string): Promise<void> {
  const record = safeGetStorage<Record<string, GuestLink[]>>(STORAGE_KEYS.GUESTS, INITIAL_GUEST_LINKS);
  const list = record[invitationId] || [];
  record[invitationId] = list.filter((g) => g.id !== guestId);
  safeSetStorage(STORAGE_KEYS.GUESTS, record);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('guest_links').delete().eq('id', guestId);
    } catch (e) {
      console.warn('[Supabase] Error deleting guest link:', e);
    }
  }
}

