-- ==============================================================================
-- UNDANGAN ONLINE - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Schema ini mencakup seluruh fitur:
-- 1. Profiles & Role Management (User, Designer, Admin)
-- 2. Invitations (Data inti, couple, events, gallery, presets, visibility)
-- 3. Guest Links (Link personal tamu & tracking kehadiran)
-- 4. RSVPs (Konfirmasi kehadiran tamu)
-- 5. Wishes (Buku tamu / ucapan & doa)
-- 6. Orders & Order Items (Transaksi & Pembayaran)
-- 7. Custom Briefs (Alur layanan "Dibuatkan Oleh Kami")
-- 8. Row Level Security (RLS) & Storage Bucket Config
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. PROFILES (Extends Supabase Auth)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'designer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger untuk sinkronisasi otomatis saat user signup di Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 3. INVITATIONS (Master Data Undangan)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.invitations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  service_type TEXT NOT NULL DEFAULT 'diy' CHECK (service_type IN ('diy', 'custom')),
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'UNPAID', 'ACTIVE', 'EVENT_PASSED', 'ARCHIVED', 'EXPIRED')),
  template_id TEXT NOT NULL,
  package_id TEXT DEFAULT 'pkg-essential',

  -- Preset Desain
  font_preset TEXT DEFAULT 'editorial-cormorant',
  color_preset TEXT DEFAULT 'offwhite-noir',
  layout_preset TEXT DEFAULT 'split-editorial',
  animation_preset TEXT DEFAULT 'fade-minimal',
  video_overlay_opacity INTEGER DEFAULT 40,
  video_overlay_blur INTEGER DEFAULT 8,
  video_overlay_tint TEXT DEFAULT 'noir',

  -- Cover & Teks Pembuka
  cover_title TEXT DEFAULT 'THE WEDDING CELEBRATION',
  cover_image_url TEXT,
  cover_video_url TEXT,
  opening_quote TEXT,
  holy_verse TEXT,
  event_date TIMESTAMPTZ,

  -- Komponen Konten (Disimpan sebagai JSONB terstruktur)
  couple JSONB NOT NULL DEFAULT '{}'::jsonb,
  events JSONB NOT NULL DEFAULT '[]'::jsonb,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  love_stories JSONB NOT NULL DEFAULT '[]'::jsonb,
  gifts JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Media Tambahan
  music_url TEXT,
  music_title TEXT,
  video_url TEXT,

  -- Pengaturan Visibilitas & Addons
  section_visibility JSONB NOT NULL DEFAULT '{
    "cover": true,
    "profile": true,
    "events": true,
    "countdown": true,
    "gallery": true,
    "story": true,
    "video": true,
    "rsvp": true,
    "wishes": true,
    "gifts": true,
    "quotes": true
  }'::jsonb,
  active_addon_ids JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Custom Designer Overrides
  custom_css TEXT,
  designer_notes TEXT,

  -- Analitik
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index untuk query super cepat berdasarkan slug undangan
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON public.invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.invitations(status);

-- ==============================================================================
-- 4. GUEST LINKS (Link Tamu Khusus / Personal)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.guest_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id TEXT NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_slug TEXT NOT NULL,
  category TEXT DEFAULT 'Umum',
  whatsapp_number TEXT,
  has_opened BOOLEAN DEFAULT false,
  invitation_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(invitation_id, guest_slug)
);

CREATE INDEX IF NOT EXISTS idx_guest_links_lookup ON public.guest_links(invitation_id, guest_slug);

-- ==============================================================================
-- 5. RSVPS (Konfirmasi Kehadiran Tamu)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id TEXT NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ATTENDING', 'NOT_ATTENDING', 'TENTATIVE')),
  pax INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_id ON public.rsvps(invitation_id);

-- ==============================================================================
-- 6. WISHES (Buku Tamu / Ucapan & Doa)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id TEXT NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  relationship TEXT,
  message TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_wishes_invitation_id ON public.wishes(invitation_id);

-- ==============================================================================
-- 7. ORDERS (Pesanan Paket & Add-ons)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invitation_id TEXT REFERENCES public.invitations(id) ON DELETE SET NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  net_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'EXPIRED')),
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);

-- ==============================================================================
-- 8. CUSTOM BRIEFS (Jalur Layanan "Dibuatkan Oleh Kami")
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.custom_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id TEXT NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  package_tier TEXT NOT NULL,
  story_concept TEXT,
  style_preference TEXT,
  reference_urls JSONB DEFAULT '[]'::jsonb,
  client_notes TEXT,
  assigned_designer_name TEXT,
  status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'IN_PROGRESS', 'DRAFT_READY', 'REVISION_REQUESTED', 'APPROVED', 'COMPLETED')),
  revision_count INTEGER DEFAULT 0,
  max_revisions INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS di semua tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_briefs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Invitations Policies
-- Publik / tamu dapat melihat undangan yang aktif atau yang memiliki slug
CREATE POLICY "Public can view active invitations" 
  ON public.invitations FOR SELECT USING (true);

-- Pemilik dapat membuat & mengedit undangannya
CREATE POLICY "Users can insert own invitations" 
  ON public.invitations FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own invitations" 
  ON public.invitations FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can delete own invitations" 
  ON public.invitations FOR DELETE USING (auth.uid() = user_id);

-- 3. Guest Links Policies
CREATE POLICY "Anyone can view guest link for invitation" 
  ON public.guest_links FOR SELECT USING (true);
CREATE POLICY "Owners can manage guest links" 
  ON public.guest_links FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invitations 
      WHERE invitations.id = guest_links.invitation_id 
      AND (invitations.user_id = auth.uid() OR invitations.user_id IS NULL)
    )
  );

-- 4. RSVPs Policies
-- Siapapun tamu bisa kirim RSVP
CREATE POLICY "Anyone can submit rsvp" 
  ON public.rsvps FOR INSERT WITH CHECK (true);
-- Pemilik undangan & tamu bisa melihat RSVP
CREATE POLICY "Anyone can view rsvps" 
  ON public.rsvps FOR SELECT USING (true);

-- 5. Wishes Policies
-- Siapapun tamu bisa kirim ucapan
CREATE POLICY "Anyone can submit wishes" 
  ON public.wishes FOR INSERT WITH CHECK (true);
-- Publik bisa melihat ucapan yang sudah diapprove
CREATE POLICY "Anyone can read approved wishes" 
  ON public.wishes FOR SELECT USING (is_approved = true);
-- Pemilik undangan bisa memoderasi (update/delete) ucapan
CREATE POLICY "Owners can moderate wishes" 
  ON public.wishes FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invitations 
      WHERE invitations.id = wishes.invitation_id 
      AND (invitations.user_id = auth.uid() OR invitations.user_id IS NULL)
    )
  );

-- 6. Orders Policies
CREATE POLICY "Users can view own orders" 
  ON public.orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can insert orders" 
  ON public.orders FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- 10. STORAGE BUCKET CONFIGURATION
-- ==============================================================================
-- Menyiapkan bucket 'invitation-assets' untuk upload foto cover, galeri, musik MP3, & QRIS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('invitation-assets', 'invitation-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan Storage agar file bisa diakses publik (Read)
CREATE POLICY "Public Access for invitation assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'invitation-assets');

-- Kebijakan Storage agar user / builder bisa upload file (Insert)
CREATE POLICY "Allow public upload for invitation assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'invitation-assets');

-- Kebijakan Storage agar user bisa update / delete file milik sendiri
CREATE POLICY "Allow update and delete for invitation assets"
ON storage.objects FOR ALL
USING (bucket_id = 'invitation-assets');
