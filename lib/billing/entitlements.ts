import { Invitation, DiyPackage } from '@/types';
import { DIY_PACKAGES, ADDONS } from '../data/catalog';

export type FeatureKey =
  | 'premium_template'
  | 'premium_animation'
  | 'custom_music'
  | 'love_story'
  | 'video_prewedding'
  | 'living_video_bg'
  | 'extra_gallery'
  | 'rsvp_system'
  | 'custom_guest_name'
  | 'qr_checkin_pass'
  | 'custom_domain'
  | 'voice_guestbook'
  | 'extra_revision'
  | 'guest_maps'
  | 'countdown'
  | 'digital_gift';

export const ADDON_TO_FEATURE_KEY: Record<string, FeatureKey> = {
  'premium-animation': 'premium_animation',
  'music-backsound': 'custom_music',
  'love-story': 'love_story',
  'video-prewedding': 'video_prewedding',
  'living-video-bg': 'living_video_bg',
  'extra-gallery': 'extra_gallery',
  'rsvp-system': 'rsvp_system',
  'custom-guest-name': 'custom_guest_name',
  'qr-checkin-pass': 'qr_checkin_pass',
  'custom-domain': 'custom_domain',
  'voice-guestbook': 'voice_guestbook',
  'extra-revision': 'extra_revision',
};

export const FEATURE_CODE_TO_KEY: Record<string, FeatureKey> = {
  'ANIM_PREMIUM': 'premium_animation',
  'AUDIO_MUSIC': 'custom_music',
  'MEDIA_AUDIO_BASIC': 'custom_music',
  'CONTENT_STORY': 'love_story',
  'MEDIA_VIDEO': 'video_prewedding',
  'MEDIA_VIDEO_BG': 'living_video_bg',
  'CONTENT_GALLERY': 'extra_gallery',
  'CONTENT_GALLERY_EXPANDED': 'extra_gallery',
  'GUEST_RSVP': 'rsvp_system',
  'GUEST_PERSONAL_LINK': 'custom_guest_name',
  'GUEST_QR_PASS': 'qr_checkin_pass',
  'FEATURE_GIFT': 'digital_gift',
  'GUEST_MAPS': 'guest_maps',
  'CONTENT_COUNTDOWN': 'countdown',
};

/**
 * Maps an addon ID into a logical entitlement feature key.
 */
export function addonIdToFeatureKey(addonId: string): FeatureKey {
  return ADDON_TO_FEATURE_KEY[addonId] || (addonId.replace(/-/g, '_') as FeatureKey);
}

/**
 * Returns complete dictionary of enabled features for a given package and active addons.
 */
export function getEntitlements(
  subject?: { packageId?: string | null; activeAddonIds?: string[] | null } | Invitation | null
): Record<FeatureKey, boolean> {
  const result: Record<FeatureKey, boolean> = {
    premium_template: false,
    premium_animation: false,
    custom_music: true, // Included by default
    love_story: false,
    video_prewedding: false,
    living_video_bg: false,
    extra_gallery: false,
    rsvp_system: false,
    custom_guest_name: false,
    qr_checkin_pass: false,
    custom_domain: false,
    voice_guestbook: false,
    extra_revision: false,
    guest_maps: true,
    countdown: true,
    digital_gift: true,
  };

  if (!subject) return result;

  const pkgId = subject.packageId || 'pkg-essential';
  const pkg = DIY_PACKAGES.find((p) => p.id === pkgId);

  // 1. Resolve features from Package Tier
  if (pkg) {
    if (pkg.tier === 'premium') {
      result.premium_template = true;
      result.premium_animation = true;
      result.love_story = true;
      result.rsvp_system = true;
      result.extra_gallery = true;
      result.custom_guest_name = true;
    }

    if (pkg.includedFeatureCodes) {
      for (const code of pkg.includedFeatureCodes) {
        const featureKey = FEATURE_CODE_TO_KEY[code];
        if (featureKey) {
          result[featureKey] = true;
        }
      }
    }
  }

  // 2. Resolve features from Active Addons
  const activeAddonIds = subject.activeAddonIds || [];
  for (const addonId of activeAddonIds) {
    const featureKey = addonIdToFeatureKey(addonId);
    if (featureKey in result) {
      result[featureKey] = true;
    }
  }

  return result;
}

/**
 * Clean entitlement check helper:
 * Example: hasFeature(invitation, 'voice_guestbook')
 * instead of scattering package checks throughout the codebase.
 */
export function hasFeature(
  subject: { packageId?: string | null; activeAddonIds?: string[] | null } | Invitation | null,
  featureKey: FeatureKey | string
): boolean {
  const entitlements = getEntitlements(subject);
  return Boolean(entitlements[featureKey as FeatureKey]);
}

/**
 * Checks if an add-on is eligible for purchase under a given package.
 */
export function isAddonAvailableForPackage(packageId: string, addonId: string): boolean {
  const pkg = DIY_PACKAGES.find((p) => p.id === packageId);
  if (!pkg) return false;

  // If explicitly locked for this package
  if (pkg.lockedAddonIds && pkg.lockedAddonIds.includes(addonId)) {
    return false;
  }

  // If already included in the package tier, no need to purchase as an add-on
  if (pkg.tier === 'premium') {
    const includedInPremium = [
      'premium-animation',
      'love-story',
      'rsvp-system',
      'extra-gallery',
      'music-backsound',
      'custom-guest-name',
    ];
    if (includedInPremium.includes(addonId)) {
      return false; // Already included
    }
  }

  // Must be in availableAddonIds
  if (pkg.availableAddonIds && pkg.availableAddonIds.includes(addonId)) {
    return true;
  }

  // If addon exists in catalog and is not locked
  const addonExists = ADDONS.some((a) => a.id === addonId);
  return addonExists && !pkg.lockedAddonIds.includes(addonId);
}
