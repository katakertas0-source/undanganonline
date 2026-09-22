import { getSupabase } from './client';

const BUCKET_NAME = 'invitation-assets';

/**
 * Converts a Base64 Data URL into a standard Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Uploads a File or Blob directly to Supabase Storage bucket 'invitation-assets'
 * and returns the public CDN URL.
 */
export async function uploadAssetToSupabase(
  file: File | Blob,
  folder: 'covers' | 'couples' | 'gallery' | 'audio' | 'general' = 'general',
  customFilename?: string
): Promise<{ publicUrl: string; path: string } | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn('[Storage] Supabase client is not available for upload.');
    return null;
  }

  try {
    const ext = file.type.includes('png')
      ? 'png'
      : file.type.includes('webp')
      ? 'webp'
      : file.type.includes('audio') || file.type.includes('mp3')
      ? 'mp3'
      : 'jpg';

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const fileName = customFilename ? `${customFilename}.${ext}` : `${timestamp}-${randomStr}.${ext}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '31536000', // 1 year cache
        upsert: true,
        contentType: file.type || 'image/jpeg',
      });

    if (error) {
      console.error('[Storage] Error uploading to Supabase Storage:', error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      publicUrl: urlData.publicUrl,
      path: data.path,
    };
  } catch (err) {
    console.error('[Storage] Exception during upload:', err);
    return null;
  }
}

/**
 * Convenience helper to upload a Base64 Data URL (e.g. from canvas or ImageCropper)
 * to Supabase Storage and return the public URL.
 */
export async function uploadDataUrlToSupabase(
  dataUrl: string,
  folder: 'covers' | 'couples' | 'gallery' | 'audio' | 'general' = 'general',
  customFilename?: string
): Promise<string | null> {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    // If it's already a regular HTTP URL, return as-is
    return dataUrl;
  }

  const blob = dataUrlToBlob(dataUrl);
  const result = await uploadAssetToSupabase(blob, folder, customFilename);
  return result ? result.publicUrl : null;
}
