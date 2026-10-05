import { NextRequest, NextResponse } from 'next/server';
import { TEMPLATES } from '@/lib/data/catalog';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { getAllMemoryTemplateOverrides } from '@/lib/templates/server-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('all') === 'true' || searchParams.get('include_deleted') === 'true';

    const supabase = getSupabaseAdmin();

    let dbRows: any[] = [];
    if (supabase) {
      try {
        let query = supabase.from('templates').select('*');
        if (!includeDeleted) {
          query = query.eq('is_active', true).eq('is_deleted', false);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          dbRows = data;
        }
      } catch (err) {
        console.warn('[API /api/templates] DB query error, using fallback:', err);
      }
    }

    // Merge static TEMPLATES catalog with DB status overlay and server memory cache
    const dbMap = new Map<string, any>();
    dbRows.forEach((r) => {
      dbMap.set(r.id, r);
      if (r.slug) dbMap.set(r.slug, r);
    });

    const memoryOverrides = getAllMemoryTemplateOverrides();
    memoryOverrides.forEach((m) => {
      const existing = dbMap.get(m.id) || {};
      const merged = { ...existing, ...m };
      dbMap.set(m.id, merged);
      if (m.slug) dbMap.set(m.slug, merged);
    });

    const result = TEMPLATES.map((tmpl) => {
      const dbRecord = dbMap.get(tmpl.id) || dbMap.get(tmpl.slug);
      const isDeleted = dbRecord ? Boolean(dbRecord.is_deleted) : false;
      const isActive = dbRecord ? Boolean(dbRecord.is_active) : true;
      const basePrice = dbRecord?.base_price ? Number(dbRecord.base_price) : tmpl.basePrice;

      return {
        ...tmpl,
        basePrice,
        defaultBasePrice: tmpl.basePrice,
        isDeleted: isDeleted || !isActive,
        isActive,
        deletedAt: dbRecord?.deleted_at || null,
      };
    });

    // If public request, filter out deleted and inactive templates
    const finalTemplates = includeDeleted
      ? result
      : result.filter((t) => !t.isDeleted && t.isActive);

    return NextResponse.json({
      success: true,
      count: finalTemplates.length,
      templates: finalTemplates,
    });
  } catch (err: any) {
    console.error('[API /api/templates] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
