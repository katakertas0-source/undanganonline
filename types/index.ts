export type ServiceType = 'diy' | 'custom';

export type InvitationStatus = 
  | 'DRAFT' 
  | 'UNPAID' 
  | 'ACTIVE' 
  | 'EVENT_PASSED' 
  | 'ARCHIVED' 
  | 'EXPIRED';

export type TemplateCategory = 'Minimal' | 'Editorial' | 'Classic' | 'Modern' | 'Romantic' | 'Heritage';

export type TemplateArchetype =
  | 'editorial-garden'
  | 'modern-minimal'
  | 'dark-luxury-cinema'
  | 'romantic-cinema'
  | 'japanese-minimal'
  | 'mediterranean-summer'
  | 'cinematic-motion'
  | 'balinese-heritage';

export interface DemoCoupleMeta {
  groomName: string;
  groomNickname: string;
  brideName: string;
  brideNickname: string;
  dateStr: string;
  quote?: string;
  secondaryTitle?: string;
  secondarySubtitle?: string;
}

export interface DiyPackage {
  id: string; // e.g. 'pkg-essential', 'pkg-premium'
  name: string; // 'Essential', 'Premium'
  tier: 'essential' | 'premium';
  price: number; // 99000, 199000
  tagline: string;
  description: string;
  allowedTemplateIds: string[];
  includedFeatureCodes: string[];
  availableAddonIds: string[];
  lockedAddonIds: string[];
}

export interface Template {
  id: string; // e.g. 'aurelia-minimal', 'nocturne-dark', 'celine-editorial'
  name: string;
  slug: string;
  category: TemplateCategory;
  subtitle: string; // e.g. 'EDITORIAL GARDEN', 'MODERN MINIMAL'
  tagline: string; // e.g. 'Natural, botanical, and editorial.'
  tags: string[]; // e.g. ['BOTANICAL', 'ELEGANT', 'TIMELESS']
  colorPalette: string[]; // 4 hex color codes
  archetype: TemplateArchetype;
  sectionOrder: string[]; // e.g. ['cover', 'couple', 'events', 'gallery', ...]
  description: string;
  basePrice: number;
  coverImageUrl: string;
  coverVideoUrl?: string;
  mockupSecondaryUrl: string;
  demoCouple: DemoCoupleMeta;
  previewUrl?: string;
  theme: {
    fontSerif: string;
    fontSans: string;
    bgColor: string;
    textColor: string;
    accentColor: string;
    cardBg: string;
    borderColor: string;
    isDark?: boolean;
  };
  compatibleAddonIds: string[];
}

export interface Addon {
  id: string; // e.g. 'premium-animation', 'music-backsound'
  code: string;
  name: string;
  category: 'animation' | 'media' | 'guest' | 'feature' | 'service';
  description: string;
  defaultPrice: number;
  isRecurring?: boolean;
}

export interface CoupleProfile {
  groomName: string;
  groomNickname: string;
  groomFather: string;
  groomMother: string;
  groomBio: string;
  groomInstagram?: string;
  groomPhotoUrl: string;
  groomLabelBadge?: string;

  brideName: string;
  brideNickname: string;
  brideFather: string;
  brideMother: string;
  brideBio: string;
  brideInstagram?: string;
  bridePhotoUrl: string;
  brideLabelBadge?: string;
}

export interface EventDetail {
  id: string;
  name: string; // e.g. 'Akad Nikah', 'Resepsi Pernikahan'
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime?: string;
  timezone: string; // WIB, WITA, WIT
  venueName: string;
  address: string;
  googleMapsUrl?: string;
  orderIndex: number;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption?: string;
  aspectRatio?: '4:5' | '1:1' | '16:9';
  orderIndex: number;
  category?: 'prewedding' | 'ceremony' | 'reception' | 'documentation';
}

export interface LoveStoryItem {
  id: string;
  yearOrDate: string;
  title: string;
  story: string;
  photoUrl?: string;
  orderIndex: number;
}

export interface GuestLink {
  id: string;
  guestName: string;
  guestSlug: string;
  category: 'VIP' | 'Keluarga' | 'Teman' | 'Rekan Kerja' | 'Umum';
  whatsappNumber?: string;
  hasOpened?: boolean;
  invitationSent?: boolean;
}

export interface RsvpEntry {
  id: string;
  guestName: string;
  status: 'ATTENDING' | 'NOT_ATTENDING' | 'TENTATIVE';
  pax: number;
  notes?: string;
  createdAt: string;
}

export interface WishEntry {
  id: string;
  senderName: string;
  relationship?: string;
  message: string;
  isApproved: boolean;
  createdAt: string;
}

export interface GiftAccount {
  id: string;
  type: 'BANK' | 'EWALLET' | 'QRIS' | 'PHYSICAL_ADDRESS';
  providerName: string; // BCA, Mandiri, GoPay, OVO
  accountNumber: string;
  accountHolder: string;
  qrisImageUrl?: string;
  shippingAddress?: string;
  recipientPhone?: string;
}

export interface SectionVisibility {
  cover: boolean;
  profile: boolean;
  events: boolean;
  countdown: boolean;
  gallery: boolean;
  story: boolean;
  video: boolean;
  rsvp: boolean;
  wishes: boolean;
  gifts: boolean;
  quotes: boolean;
}

export interface Invitation {
  id: string;
  userId: string;
  title: string;
  slug: string;
  serviceType: ServiceType;
  status: InvitationStatus;
  templateId: string;
  packageId?: string; // 'pkg-essential' | 'pkg-premium'
  
  // Design Presets
  fontPreset: 'editorial-cormorant' | 'modern-serif' | 'clean-sans';
  colorPreset: 'offwhite-noir' | 'warm-linen' | 'nocturne-black';
  layoutPreset: 'framed-portrait' | 'split-editorial' | 'centered-classic' | 'modern-cinematic';
  animationPreset: 'fade-minimal' | 'curtain-reveal' | 'none';
  videoOverlayOpacity?: number; // 10 - 90, default 40
  videoOverlayBlur?: number;    // 0 - 20, default 8
  videoOverlayTint?: 'noir' | 'warm-mocha' | 'midnight-navy'; // default 'noir'

  // Details
  coverTitle?: string; // e.g. "THE WEDDING CELEBRATION", "THE WEDDING OF", "WALIMATUL 'URS"
  coverImageUrl: string;
  coverVideoUrl?: string;
  openingQuote?: string;
  holyVerse?: string;
  eventDate: string; // Main date for countdown
  
  couple: CoupleProfile;
  events: EventDetail[];
  gallery: GalleryItem[];
  loveStories: LoveStoryItem[];
  gifts: GiftAccount[];
  
  // Media
  musicUrl?: string;
  musicTitle?: string;
  videoUrl?: string;

  // Configuration
  sectionVisibility: SectionVisibility;
  activeAddonIds: string[];

  // Custom Designer overrides
  customCss?: string;
  designerNotes?: string;

  // Post-Event & Memory Vault
  thankYouMessage?: string;
  documentationPhotos?: GalleryItem[];

  // Post-Payment Dashboard Credentials (Opsi A)
  dashboardUsername?: string;
  dashboardPassword?: string;

  // Metadata
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  itemType: 'PACKAGE' | 'TEMPLATE' | 'ADDON' | 'CUSTOM_PACKAGE' | 'MEMORY_RENEWAL';
  referenceId: string;
  itemName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  invitationId: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  netAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';
  paymentMethod?: string;
  paidAt?: string;
  dashboardUsername?: string;
  dashboardPassword?: string;
  createdAt: string;
}

export interface CustomBrief {
  id: string;
  invitationId: string;
  packageTier: 'Made for You' | 'Exclusive';
  storyConcept: string;
  stylePreference: string;
  referenceUrls: string[];
  clientNotes: string;
  assignedDesignerName?: string;
  status: 'SUBMITTED' | 'IN_PROGRESS' | 'DRAFT_READY' | 'REVISION_REQUESTED' | 'APPROVED' | 'COMPLETED';
  revisionCount: number;
  maxRevisions: number;
  createdAt: string;
}
