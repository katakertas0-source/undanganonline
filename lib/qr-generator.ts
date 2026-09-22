import QRCode from 'qrcode';

/**
 * Generates an offline QR Code as a base64 Data URL (PNG)
 */
export async function generateQrDataUrl(
  text: string,
  options?: {
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }
): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: options?.width || 250,
      margin: 1,
      color: {
        dark: options?.color?.dark || '#111111',
        light: options?.color?.light || '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('[QR] Failed to generate QR Data URL:', err);
    return '';
  }
}

/**
 * Generates an offline QR Code as an SVG string
 */
export async function generateQrSvg(
  text: string,
  options?: {
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }
): Promise<string> {
  try {
    return await QRCode.toString(text, {
      type: 'svg',
      width: options?.width || 200,
      margin: 1,
      color: {
        dark: options?.color?.dark || '#111111',
        light: options?.color?.light || '#FFFFFF00', // transparent default for SVG
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('[QR] Failed to generate QR SVG:', err);
    return '';
  }
}
