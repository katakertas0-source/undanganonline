import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { getSupabase } from '@/lib/supabase/client';
import { dbRowToInvitation } from '@/lib/supabase/adapter';
import { INITIAL_INVITATIONS, TEMPLATES } from '@/lib/data/catalog';

export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    let { slug } = await context.params;
    // Strip trailing .jpg or .png if present
    slug = slug.replace(/\.(jpg|jpeg|png|webp)$/i, '');

    let coverUrl = '';
    const supabase = getSupabase();

    if (supabase) {
      const { data } = await supabase
        .from('invitations')
        .select('cover_image_url')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .maybeSingle();

      if (data?.cover_image_url) {
        coverUrl = data.cover_image_url;
      } else {
        // Fallback: check if slug is a guest_slug
        const { data: guestMatch } = await supabase
          .from('guest_links')
          .select('invitation_id')
          .eq('guest_slug', slug)
          .maybeSingle();

        if (guestMatch?.invitation_id) {
          const { data: parentInv } = await supabase
            .from('invitations')
            .select('cover_image_url')
            .eq('id', guestMatch.invitation_id)
            .maybeSingle();
          if (parentInv?.cover_image_url) {
            coverUrl = parentInv.cover_image_url;
          }
        }
      }
    }

    if (!coverUrl) {
      const matched = INITIAL_INVITATIONS.find((inv) => inv.slug === slug || inv.id === slug);
      if (matched?.coverImageUrl) {
        coverUrl = matched.coverImageUrl;
      } else {
        const matchedTemplate = TEMPLATES.find((t) => t.slug === slug || t.id === slug);
        if (matchedTemplate?.coverImageUrl) {
          coverUrl = matchedTemplate.coverImageUrl;
        }
      }
    }

    if (!coverUrl) {
      coverUrl = '/images/mahadewi-cover.jpg';
    }

    let inputBuffer: Buffer;

    if (coverUrl.startsWith('http://') || coverUrl.startsWith('https://')) {
      const res = await fetch(coverUrl);
      if (!res.ok) throw new Error(`Failed to fetch remote cover: ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      inputBuffer = Buffer.from(arrayBuffer);
    } else {
      // Local public image
      const cleanPath = coverUrl.startsWith('/') ? coverUrl.slice(1) : coverUrl;
      const localFilePath = path.join(process.cwd(), 'public', cleanPath);
      if (fs.existsSync(localFilePath)) {
        inputBuffer = fs.readFileSync(localFilePath);
      } else {
        // Fallback to default cover
        inputBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'images', 'mahadewi-cover.jpg'));
      }
    }

    // Resize to standard WhatsApp 1.91:1 ratio (1200x630) and compress to ~100-150KB
    const optimizedJpeg = await sharp(inputBuffer)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({
        quality: 80,
        progressive: true,
      })
      .toBuffer();

    return new NextResponse(optimizedJpeg, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': optimizedJpeg.length.toString(),
        'Cache-Control': 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[Cover Preview API] Error generating cover:', error);
    // Return empty 204 or fallback
    return new NextResponse('Internal Error', { status: 500 });
  }
}
