-- ==============================================================================
-- LYNK.ID PAYMENT SYSTEM & ENTITLEMENT MIGRATION
-- ==============================================================================
-- Description:
-- 1. packages: Catalog of packages (Essential, Premium, etc.)
-- 2. addons: Catalog of add-ons mapped to feature_keys
-- 3. package_addons: Availability matrix of addons per package
-- 4. orders: Extended with subtotal, addon_total, discount, total, status, lynk_ref_id, lynk_message_id
-- 5. order_addons: Historical snapshot of addons at the time of order
-- 6. payment_webhooks: Audit and idempotency log for payment provider webhooks
-- 7. RLS policies and indexes
-- ==============================================================================

-- 1. PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'essential',
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ADDONS TABLE
CREATE TABLE IF NOT EXISTS public.addons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  feature_key TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'feature',
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PACKAGE_ADDONS MATRIX
CREATE TABLE IF NOT EXISTS public.package_addons (
  package_id TEXT NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  addon_id TEXT NOT NULL REFERENCES public.addons(id) ON DELETE CASCADE,
  price_override NUMERIC(12, 2),
  is_available BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (package_id, addon_id)
);

-- 4. EXTEND ORDERS TABLE WITH PAYMENT SPECIFIC COLUMNS
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS package_id TEXT,
  ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS addon_total NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS discount NUMERIC(12, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS lynk_ref_id TEXT,
  ADD COLUMN IF NOT EXISTS lynk_message_id TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

CREATE INDEX IF NOT EXISTS idx_orders_lynk_ref_id ON public.orders(lynk_ref_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 5. ORDER_ADDONS SNAPSHOT TABLE
CREATE TABLE IF NOT EXISTS public.order_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  addon_id TEXT NOT NULL,
  name_snapshot TEXT NOT NULL,
  price_snapshot NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_addons_order_id ON public.order_addons(order_id);

-- 6. PAYMENT_WEBHOOKS AUDIT & IDEMPOTENCY TABLE
CREATE TABLE IF NOT EXISTS public.payment_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'lynk',
  event TEXT NOT NULL,
  message_id TEXT NOT NULL UNIQUE,
  ref_id TEXT,
  signature TEXT,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_webhooks_message_id ON public.payment_webhooks(message_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_ref_id ON public.payment_webhooks(ref_id);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhooks ENABLE ROW LEVEL SECURITY;

-- Packages / Addons viewable by everyone
DROP POLICY IF EXISTS "Public can view active packages" ON public.packages;
CREATE POLICY "Public can view active packages" ON public.packages
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Public can view active addons" ON public.addons;
CREATE POLICY "Public can view active addons" ON public.addons
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Public can view package addons" ON public.package_addons;
CREATE POLICY "Public can view package addons" ON public.package_addons
  FOR SELECT USING (is_available = true);

-- Order addons viewable by order owners
DROP POLICY IF EXISTS "Users can view own order addons" ON public.order_addons;
CREATE POLICY "Users can view own order addons" ON public.order_addons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_addons.order_id
      AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    )
  );

-- Webhooks only accessible by service role
DROP POLICY IF EXISTS "Service role access for payment webhooks" ON public.payment_webhooks;
CREATE POLICY "Service role access for payment webhooks" ON public.payment_webhooks
  FOR ALL TO service_role USING (true);

-- 8. INITIAL SEED DATA
INSERT INTO public.packages (id, name, tier, price, active) VALUES
  ('pkg-essential', 'Essential', 'essential', 99000, true),
  ('pkg-premium', 'Premium', 'premium', 199000, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  price = EXCLUDED.price,
  active = EXCLUDED.active,
  updated_at = timezone('utc'::text, now());

INSERT INTO public.addons (id, name, code, feature_key, category, price, active) VALUES
  ('premium-animation', 'Premium Animation', 'ANIM_PREMIUM', 'premium_animation', 'animation', 25000, true),
  ('music-backsound', 'Atmospheric Music', 'AUDIO_MUSIC', 'custom_music', 'media', 15000, true),
  ('love-story', 'Love Story Timeline', 'CONTENT_STORY', 'love_story', 'feature', 25000, true),
  ('video-prewedding', 'Prewedding Video', 'MEDIA_VIDEO', 'video_prewedding', 'media', 35000, true),
  ('living-video-bg', 'Living Video Background', 'MEDIA_VIDEO_BG', 'living_video_bg', 'media', 45000, true),
  ('extra-gallery', 'Expanded Gallery (30+ Photos)', 'CONTENT_GALLERY', 'extra_gallery', 'feature', 20000, true),
  ('rsvp-system', 'Digital RSVP & Guest Counter', 'GUEST_RSVP', 'rsvp_system', 'guest', 25000, true),
  ('custom-guest-name', 'Custom Guest Personalization', 'GUEST_PERSONAL_LINK', 'custom_guest_name', 'guest', 35000, true),
  ('qr-checkin-pass', 'QR Code Kartu Akses Resepsi', 'GUEST_QR_PASS', 'qr_checkin_pass', 'guest', 35000, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  feature_key = EXCLUDED.feature_key,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  active = EXCLUDED.active,
  updated_at = timezone('utc'::text, now());

-- Package Addons availability seed
INSERT INTO public.package_addons (package_id, addon_id, is_available) VALUES
  ('pkg-essential', 'love-story', true),
  ('pkg-essential', 'rsvp-system', true),
  ('pkg-essential', 'custom-guest-name', true),
  ('pkg-essential', 'video-prewedding', true),
  ('pkg-essential', 'living-video-bg', true),
  ('pkg-essential', 'extra-gallery', true),
  ('pkg-essential', 'qr-checkin-pass', true),
  ('pkg-essential', 'premium-animation', false), -- locked for essential
  ('pkg-premium', 'video-prewedding', true),
  ('pkg-premium', 'living-video-bg', true),
  ('pkg-premium', 'qr-checkin-pass', true)
ON CONFLICT (package_id, addon_id) DO UPDATE SET
  is_available = EXCLUDED.is_available;
