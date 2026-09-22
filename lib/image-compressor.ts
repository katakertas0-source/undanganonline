/**
 * Utility to automatically compress image files on the client side before saving.
 * Scales down large camera/phone photos (e.g. 5MB-15MB) to max 1400px and compresses to JPEG (~100-180KB),
 * preventing browser localStorage QuotaExceededError while maintaining crisp HD display.
 * Also detects natural aspect ratio so images are displayed proportionally without distortion.
 */

export interface CompressedImageDetail {
  dataUrl: string;
  aspectRatio: '4:5' | '1:1' | '16:9';
  width: number;
  height: number;
}

export async function compressImageWithDetails(
  file: File,
  maxWidth = 1400,
  maxHeight = 1400,
  quality = 0.82
): Promise<CompressedImageDetail> {
  return new Promise((resolve) => {
    const defaultFallback: CompressedImageDetail = {
      dataUrl: '',
      aspectRatio: '4:5',
      width: 0,
      height: 0,
    };

    if (!file.type.startsWith('image/') || file.type.includes('svg')) {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          dataUrl: (reader.result as string) || '',
          aspectRatio: '4:5',
          width: 0,
          height: 0,
        });
      reader.onerror = () => resolve(defaultFallback);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        try {
          const naturalW = img.naturalWidth || img.width;
          const naturalH = img.naturalHeight || img.height;
          const rawRatio = naturalW / naturalH;

          // Intelligently categorize aspect ratio based on natural proportions
          let detectedRatio: '4:5' | '1:1' | '16:9' = '4:5';
          if (rawRatio >= 1.25) {
            detectedRatio = '16:9'; // Landscape / mendatar
          } else if (rawRatio >= 0.85 && rawRatio < 1.25) {
            detectedRatio = '1:1'; // Square / persegi
          } else {
            detectedRatio = '4:5'; // Portrait / tegak
          }

          let width = naturalW;
          let height = naturalH;

          // Scale maintaining exact proportional ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({
              dataUrl: (readerEvent.target?.result as string) || '',
              aspectRatio: detectedRatio,
              width,
              height,
            });
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const outputType = 'image/jpeg';
          const compressedDataUrl = canvas.toDataURL(outputType, quality);
          resolve({
            dataUrl: compressedDataUrl,
            aspectRatio: detectedRatio,
            width,
            height,
          });
        } catch {
          resolve({
            dataUrl: (readerEvent.target?.result as string) || '',
            aspectRatio: '4:5',
            width: 0,
            height: 0,
          });
        }
      };

      img.onerror = () => {
        resolve({
          dataUrl: (readerEvent.target?.result as string) || '',
          aspectRatio: '4:5',
          width: 0,
          height: 0,
        });
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => resolve(defaultFallback);
    reader.readAsDataURL(file);
  });
}

export async function compressImageFile(
  file: File,
  maxWidth = 1400,
  maxHeight = 1400,
  quality = 0.8
): Promise<string> {
  const result = await compressImageWithDetails(file, maxWidth, maxHeight, quality);
  return result.dataUrl;
}
