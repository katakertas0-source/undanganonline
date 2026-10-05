import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { TEMPLATES } from '@/lib/data/catalog';
import {
  setMemoryTemplateOverride,
  removeMemoryTemplateOverride,
  getMemoryTemplateOverride,
} from '@/lib/templates/server-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, idOrSlug, newPrice } = body;

    if (!action || !idOrSlug) {
      return NextResponse.json(
        { success: false, error: 'action and idOrSlug are required' },
        { status: 400 }
      );
    }

    // Find template in catalog
    const template = TEMPLATES.find(
      (t) => t.id === idOrSlug || t.slug === idOrSlug
    );
    const targetId = template ? template.id : idOrSlug;
    const targetSlug = template ? template.slug : idOrSlug;
    const targetName = template ? template.name : idOrSlug;
    const targetCategory = template ? template.category : 'General';
    const targetArchetype = template ? template.archetype : 'general';
    const defaultPrice = template ? template.basePrice : 99000;

    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    if (action === 'DELETE' || action === 'DEACTIVATE') {
      // 1. In-memory cache update
      setMemoryTemplateOverride({
        id: targetId,
        slug: targetSlug,
        is_active: false,
        is_deleted: true,
        deleted_at: now,
        base_price: defaultPrice,
      });

      // 2. Supabase DB update
      if (supabase) {
        try {
          const { error } = await supabase.from('templates').upsert({
            id: targetId,
            slug: targetSlug,
            name: targetName,
            category: targetCategory,
            archetype: targetArchetype,
            base_price: defaultPrice,
            is_active: false,
            is_deleted: true,
            deleted_at: now,
            updated_at: now,
          }, { onConflict: 'id' });

          if (error) {
            console.warn('[API /api/admin/templates] Supabase soft-delete warning:', error.message);
          }
        } catch (dbErr) {
          console.warn('[API /api/admin/templates] Supabase execution error:', dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        action: 'DEACTIVATE',
        message: `Template "${targetName}" berhasil dinonaktifkan secara global dari seluruh pengunjung.`,
        templateId: targetId,
      });
    }

    if (action === 'HARD_DELETE') {
      // 1. In-memory cache update (mark deleted)
      setMemoryTemplateOverride({
        id: targetId,
        slug: targetSlug,
        is_active: false,
        is_deleted: true,
        deleted_at: now,
        base_price: defaultPrice,
      });

      // 2. Supabase DB hard delete
      if (supabase) {
        try {
          const { error } = await supabase
            .from('templates')
            .delete()
            .or(`id.eq.${targetId},slug.eq.${targetSlug}`);

          if (error) {
            console.warn('[API /api/admin/templates] Supabase hard-delete warning:', error.message);
          }
        } catch (dbErr) {
          console.warn('[API /api/admin/templates] Supabase hard delete error:', dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        action: 'HARD_DELETE',
        message: `Template "${targetName}" berhasil dihapus secara permanen dari database.`,
        templateId: targetId,
      });
    }

    if (action === 'RESTORE') {
      // 1. In-memory cache update
      setMemoryTemplateOverride({
        id: targetId,
        slug: targetSlug,
        is_active: true,
        is_deleted: false,
        deleted_at: null,
        base_price: defaultPrice,
      });

      // 2. Supabase DB update
      if (supabase) {
        try {
          const { error } = await supabase.from('templates').upsert({
            id: targetId,
            slug: targetSlug,
            name: targetName,
            category: targetCategory,
            archetype: targetArchetype,
            base_price: defaultPrice,
            is_active: true,
            is_deleted: false,
            deleted_at: null,
            updated_at: now,
          }, { onConflict: 'id' });

          if (error) {
            console.warn('[API /api/admin/templates] Supabase restore warning:', error.message);
          }
        } catch (dbErr) {
          console.warn('[API /api/admin/templates] Supabase restore error:', dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        action: 'RESTORE',
        message: `Template "${targetName}" berhasil dipulihkan dan aktif kembali di publik.`,
        templateId: targetId,
      });
    }

    if (action === 'UPDATE_PRICE') {
      const finalPrice = Math.max(0, Math.round(Number(newPrice) || 0));
      const existing = getMemoryTemplateOverride(targetId);

      setMemoryTemplateOverride({
        id: targetId,
        slug: targetSlug,
        is_active: existing?.is_active ?? true,
        is_deleted: existing?.is_deleted ?? false,
        deleted_at: existing?.deleted_at ?? null,
        base_price: finalPrice,
      });

      if (supabase) {
        try {
          const { error } = await supabase.from('templates').upsert({
            id: targetId,
            slug: targetSlug,
            name: targetName,
            category: targetCategory,
            archetype: targetArchetype,
            base_price: finalPrice,
            updated_at: now,
          }, { onConflict: 'id' });

          if (error) {
            console.warn('[API /api/admin/templates] Supabase price update warning:', error.message);
          }
        } catch (dbErr) {
          console.warn('[API /api/admin/templates] Supabase price update error:', dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        action: 'UPDATE_PRICE',
        message: `Harga template "${targetName}" berhasil diubah menjadi Rp ${finalPrice.toLocaleString('id-ID')}.`,
        templateId: targetId,
        price: finalPrice,
      });
    }

    return NextResponse.json(
      { success: false, error: `Invalid action: ${action}` },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('[API /api/admin/templates] Unhandled error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
