-- ==============================================================================
-- MIGRATION: AUTHORITATIVE GLOBAL TEMPLATE MANAGEMENT FOR ADMIN/OWNER
-- Date: 2026-10-05
-- ==============================================================================

-- 1. Create templates table in public schema
CREATE TABLE IF NOT EXISTS public.templates (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  archetype TEXT NOT NULL,
  base_price INTEGER NOT NULL DEFAULT 99000,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for speedy lookups
CREATE INDEX IF NOT EXISTS idx_templates_slug ON public.templates(slug);
CREATE INDEX IF NOT EXISTS idx_templates_status ON public.templates(is_active, is_deleted);

-- 2. Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Public can read only active and non-deleted templates
DROP POLICY IF EXISTS "Public can view active templates" ON public.templates;
CREATE POLICY "Public can view active templates" ON public.templates
  FOR SELECT USING (is_active = true AND is_deleted = false);

-- Service role has unrestricted access (Admin operations)
DROP POLICY IF EXISTS "Service role full access on templates" ON public.templates;
CREATE POLICY "Service role full access on templates" ON public.templates
  FOR ALL TO service_role USING (true);

-- 3. Seed all 11 existing templates
INSERT INTO public.templates (id, slug, name, category, archetype, base_price, is_active, is_deleted) VALUES
  ('aurelia-minimal', 'aurelia', 'Aurelia', 'Editorial', 'editorial-garden', 99000, true, false),
  ('celine-editorial', 'celine', 'Céline', 'Minimal', 'modern-minimal', 99000, true, false),
  ('nocturne-dark', 'nocturne', 'Nocturne', 'Luxury', 'dark-elegance', 199000, true, false),
  ('clara-classic', 'clara', 'Clara', 'Classic', 'classic-romance', 99000, true, false),
  ('sora-zen', 'sora', 'Sora', 'Modern', 'japanese-modern', 149000, true, false),
  ('roma-summer', 'roma', 'Roma', 'Rustic', 'mediterranean-chic', 149000, true, false),
  ('elodie-motion', 'elodie', 'Élodie', 'Fashion', 'editorial-motion', 199000, true, false),
  ('mahadewi-bali', 'mahadewi', 'Mahadewi', 'Heritage', 'bali-luxury-modern', 199000, true, false),
  ('bali-heritage', 'bali-heritage', 'Niskala Bali', 'Heritage', 'bali-living-heritage', 199000, true, false),
  ('jawa-living-heritage', 'jawa-heritage', 'Surakarta Keraton', 'Heritage', 'jawa-living-heritage', 199000, true, false),
  ('cinematic-fairytale', 'fairytale', 'Fairytale Palace', 'Luxury', 'cinematic-fairytale', 199000, true, false)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  archetype = EXCLUDED.archetype,
  updated_at = timezone('utc'::text, now());
