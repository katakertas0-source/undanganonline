/**
 * WhatsApp Helper Utilities
 * Centralized contact number and message formatting for WhatsApp consultation
 */

export const WHATSAPP_CONTACT_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';

export const WHATSAPP_DEFAULT_BESPOKE_MESSAGE =
  'Halo Kertas.Kata, saya tertarik dengan layanan Made For You (Dibuatkan) untuk undangan pernikahan saya. Mohon informasi lebih lanjut.';

export function getWhatsAppBespokeUrl(customMessage?: string): string {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || WHATSAPP_CONTACT_NUMBER).replace(/[^0-9]/g, '');
  const text = encodeURIComponent(customMessage || WHATSAPP_DEFAULT_BESPOKE_MESSAGE);
  return `https://wa.me/${number}?text=${text}`;
}
