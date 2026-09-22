import { Invitation, RsvpEntry, WishEntry, GuestLink, Order } from '@/types';

function isValidUuid(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

/**
 * Converts a frontend TypeScript Invitation into a Supabase table row format (snake_case + JSONB).
 */
export function invitationToDbRow(inv: Invitation) {
  return {
    id: inv.id,
    user_id: isValidUuid(inv.userId) ? inv.userId : null,
    title: inv.title || 'Untitled Invitation',
    slug: inv.slug,
    service_type: inv.serviceType || 'diy',
    status: inv.status || 'DRAFT',
    template_id: inv.templateId,
    package_id: inv.packageId || 'pkg-essential',
    
    // Presets
    font_preset: inv.fontPreset || 'editorial-cormorant',
    color_preset: inv.colorPreset || 'offwhite-noir',
    layout_preset: inv.layoutPreset || 'split-editorial',
    animation_preset: inv.animationPreset || 'fade-minimal',
    video_overlay_opacity: inv.videoOverlayOpacity ?? 40,
    video_overlay_blur: inv.videoOverlayBlur ?? 8,
    video_overlay_tint: inv.videoOverlayTint || 'noir',

    // Content
    cover_title: inv.coverTitle || 'THE WEDDING CELEBRATION',
    cover_image_url: inv.coverImageUrl || '',
    cover_video_url: inv.coverVideoUrl || null,
    opening_quote: inv.openingQuote || null,
    holy_verse: inv.holyVerse || null,
    event_date: inv.eventDate ? new Date(inv.eventDate).toISOString() : null,

    // JSONB Columns
    couple: {
      ...(inv.couple || {}),
      thankYouMessage: inv.thankYouMessage || null,
      documentationPhotos: inv.documentationPhotos || [],
    },
    events: inv.events || [],
    gallery: inv.gallery || [],
    love_stories: inv.loveStories || [],
    gifts: inv.gifts || [],

    // Media
    music_url: inv.musicUrl || null,
    music_title: inv.musicTitle || null,
    video_url: inv.videoUrl || null,

    // Visibilities & Addons
    section_visibility: inv.sectionVisibility || {},
    active_addon_ids: inv.activeAddonIds || [],

    // Designer Overrides
    custom_css: inv.customCss || null,
    designer_notes: inv.designerNotes || null,
    views_count: inv.viewsCount || 0,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Converts a Supabase table row format back into the frontend TypeScript Invitation format.
 */
export function dbRowToInvitation(row: any): Invitation {
  return {
    id: row.id,
    userId: row.user_id || '',
    title: row.title || '',
    slug: row.slug,
    serviceType: row.service_type || 'diy',
    status: row.status || 'DRAFT',
    templateId: row.template_id,
    packageId: row.package_id || 'pkg-essential',

    fontPreset: row.font_preset || 'editorial-cormorant',
    colorPreset: row.color_preset || 'offwhite-noir',
    layoutPreset: row.layout_preset || 'split-editorial',
    animationPreset: row.animation_preset || 'fade-minimal',
    videoOverlayOpacity: row.video_overlay_opacity ?? 40,
    videoOverlayBlur: row.video_overlay_blur ?? 8,
    videoOverlayTint: row.video_overlay_tint || 'noir',

    coverTitle: row.cover_title || 'THE WEDDING CELEBRATION',
    coverImageUrl: row.cover_image_url || '',
    coverVideoUrl: row.cover_video_url || undefined,
    openingQuote: row.opening_quote || undefined,
    holyVerse: row.holy_verse || undefined,
    eventDate: row.event_date ? row.event_date.split('T')[0] : '',

    couple: row.couple || {},
    events: row.events || [],
    gallery: row.gallery || [],
    loveStories: row.love_stories || [],
    gifts: row.gifts || [],

    musicUrl: row.music_url || undefined,
    musicTitle: row.music_title || undefined,
    videoUrl: row.video_url || undefined,

    sectionVisibility: row.section_visibility || {
      cover: true,
      profile: true,
      events: true,
      countdown: true,
      gallery: true,
      story: true,
      video: true,
      rsvp: true,
      wishes: true,
      gifts: true,
      quotes: true,
    },
    activeAddonIds: row.active_addon_ids || [],

    customCss: row.custom_css || undefined,
    designerNotes: row.designer_notes || undefined,
    thankYouMessage: row.thank_you_message || row.couple?.thankYouMessage || undefined,
    documentationPhotos: row.documentation_photos || row.couple?.documentationPhotos || [],
    viewsCount: row.views_count || 0,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

/**
 * GuestLink Converters
 */
export function guestToDbRow(invitationId: string, guest: GuestLink) {
  return {
    id: guest.id && guest.id.includes('-') && guest.id.length === 36 ? guest.id : undefined,
    invitation_id: invitationId,
    guest_name: guest.guestName,
    guest_slug: guest.guestSlug,
    category: guest.category || 'Umum',
    whatsapp_number: guest.whatsappNumber || null,
    has_opened: guest.hasOpened || false,
    invitation_sent: guest.invitationSent || false,
  };
}

export function dbRowToGuest(row: any): GuestLink {
  return {
    id: row.id,
    guestName: row.guest_name,
    guestSlug: row.guest_slug,
    category: row.category || 'Umum',
    whatsappNumber: row.whatsapp_number || undefined,
    hasOpened: row.has_opened || false,
    invitationSent: row.invitation_sent || false,
  };
}

/**
 * RSVP Converters
 */
export function rsvpToDbRow(invitationId: string, rsvp: RsvpEntry) {
  return {
    id: rsvp.id && rsvp.id.includes('-') && rsvp.id.length === 36 ? rsvp.id : undefined,
    invitation_id: invitationId,
    guest_name: rsvp.guestName,
    status: rsvp.status,
    pax: rsvp.pax || 1,
    notes: rsvp.notes || null,
  };
}

export function dbRowToRsvp(row: any): RsvpEntry {
  return {
    id: row.id,
    guestName: row.guest_name,
    status: row.status,
    pax: row.pax,
    notes: row.notes || undefined,
    createdAt: row.created_at,
  };
}

/**
 * Wishes Converters
 */
export function wishToDbRow(invitationId: string, wish: WishEntry) {
  return {
    id: wish.id && wish.id.includes('-') && wish.id.length === 36 ? wish.id : undefined,
    invitation_id: invitationId,
    sender_name: wish.senderName,
    relationship: wish.relationship || null,
    message: wish.message,
    is_approved: wish.isApproved ?? true,
  };
}

export function dbRowToWish(row: any): WishEntry {
  return {
    id: row.id,
    senderName: row.sender_name,
    relationship: row.relationship || undefined,
    message: row.message,
    isApproved: row.is_approved,
    createdAt: row.created_at,
  };
}

/**
 * Order Converters
 */
export function orderToDbRow(order: Order) {
  return {
    id: order.id && order.id.includes('-') && order.id.length === 36 ? order.id : undefined,
    order_number: order.orderNumber,
    user_id: isValidUuid(order.userId) ? order.userId : null,
    invitation_id: order.invitationId,
    items: order.items || [],
    total_amount: order.totalAmount || 0,
    discount_amount: order.discountAmount || 0,
    net_amount: order.netAmount || 0,
    payment_status: order.paymentStatus || 'PENDING',
    payment_method: order.paymentMethod || null,
    paid_at: order.paidAt || null,
  };
}

export function dbRowToOrder(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    userId: row.user_id || '',
    invitationId: row.invitation_id || '',
    items: row.items || [],
    totalAmount: Number(row.total_amount) || 0,
    discountAmount: Number(row.discount_amount) || 0,
    netAmount: Number(row.net_amount) || 0,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method || undefined,
    paidAt: row.paid_at || undefined,
    createdAt: row.created_at,
  };
}
