import { Order } from '@/types';
import { verifyLynkSignature, calculateLynkSignature, getLynkMerchantKey } from '../security/lynk-signature';

export interface LynkWebhookRawData {
  event?: string;
  data?: {
    message_id?: string;
    message_data?: {
      refId: string;
      items?: Array<{
        id: string;
        name?: string;
        price?: number;
        addons?: Array<{ id: string; name?: string; price?: number }>;
      }>;
      totals?: {
        totalAddon?: number;
        totalPrice?: number;
        grandTotal?: number;
      };
      customer?: {
        name?: string;
        email?: string;
        phone?: string;
      };
    };
  };
  // Flat fallback fields
  message_id?: string;
  message_data?: any;
}

export interface NormalizedLynkWebhook {
  event: string;
  messageId: string;
  refId: string;
  grandTotal: number;
  totalPrice: number;
  totalAddon: number;
  items: Array<{
    id: string;
    name?: string;
    addons?: Array<{ id: string; name?: string; price?: number }>;
  }>;
  rawPayload: any;
}

export interface CreateLynkPaymentOptions {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  returnUrl?: string;
}

export interface LynkPaymentResult {
  provider: 'lynk';
  refId: string;
  orderNumber: string;
  amount: number;
  paymentUrl: string | null;
  status: 'pending';
  requiresOfficialApiDoc: boolean;
  notes: string;
}

/**
 * Normalizes webhook payload from Lynk.id according to the specification.
 * Lynk payload structure:
 * {
 *   "event": "payment.received",
 *   "data": {
 *     "message_id": "msg_xxx",
 *     "message_data": {
 *       "refId": "UO-123456",
 *       "items": [...],
 *       "totals": {
 *         "totalAddon": 25000,
 *         "totalPrice": 199000,
 *         "grandTotal": 224000
 *       }
 *     }
 *   }
 * }
 */
export function normalizeLynkWebhook(rawPayload: any): NormalizedLynkWebhook {
  const event = rawPayload?.event || 'payment.received';

  // Extract message_id (can be in data.message_id or top-level message_id)
  const messageId =
    rawPayload?.data?.message_id ||
    rawPayload?.message_id ||
    rawPayload?.data?.message_data?.message_id ||
    '';

  // Extract message_data
  const messageData = rawPayload?.data?.message_data || rawPayload?.message_data || rawPayload?.data || {};

  const refId = String(messageData?.refId || rawPayload?.refId || messageData?.order_id || '').trim();

  // Extract totals
  const totals = messageData?.totals || rawPayload?.totals || {};
  const grandTotal = Number(totals?.grandTotal ?? messageData?.grandTotal ?? rawPayload?.amount ?? 0);
  const totalPrice = Number(totals?.totalPrice ?? messageData?.totalPrice ?? grandTotal);
  const totalAddon = Number(totals?.totalAddon ?? messageData?.totalAddon ?? 0);

  const items = Array.isArray(messageData?.items)
    ? messageData.items
    : Array.isArray(rawPayload?.items)
    ? rawPayload.items
    : [];

  return {
    event,
    messageId: String(messageId).trim(),
    refId,
    grandTotal,
    totalPrice,
    totalAddon,
    items,
    rawPayload,
  };
}

/**
 * Verifies incoming Lynk.id webhook signature.
 * Signature formula: SHA256(amount + refId + message_id + merchant_key)
 */
export function verifyLynkWebhook(
  signatureHeader: string | null | undefined,
  rawPayload: any,
  merchantKey?: string
): { isValid: boolean; normalized: NormalizedLynkWebhook; error?: string } {
  const normalized = normalizeLynkWebhook(rawPayload);

  if (!signatureHeader) {
    return {
      isValid: false,
      normalized,
      error: 'Missing X-Lynk-Signature header',
    };
  }

  if (!normalized.messageId) {
    return {
      isValid: false,
      normalized,
      error: 'Missing message_id in webhook payload',
    };
  }

  if (!normalized.refId) {
    return {
      isValid: false,
      normalized,
      error: 'Missing refId in webhook payload',
    };
  }

  const isValid = verifyLynkSignature({
    amount: normalized.grandTotal,
    refId: normalized.refId,
    messageId: normalized.messageId,
    signature: signatureHeader,
    merchantKey,
  });

  return {
    isValid,
    normalized,
    error: isValid ? undefined : 'Signature hash mismatch',
  };
}

/**
 * Creates or prepares a payment session with Lynk.id.
 *
 * NOTE: The supplied Lynk documentation defines the webhook specification and signature formula,
 * but does NOT supply the Lynk API specification for programmatic payment initiation.
 * This adapter boundary isolates the payment provider integration cleanly.
 * When official Lynk transaction creation endpoint docs are provided,
 * this function connects to that endpoint without affecting the rest of the application.
 */
export async function createLynkPayment(
  order: Order,
  options?: CreateLynkPaymentOptions
): Promise<LynkPaymentResult> {
  const baseUrl = process.env.LYNK_BASE_URL || 'https://lynk.id';
  const productId = process.env.LYNK_PRODUCT_ID || '';
  const refId = order.orderNumber || order.id;
  const amount = order.netAmount || order.totalAmount;

  // If a Lynk product/checkout URL or slug is configured in env:
  // e.g. https://lynk.id/my-store/checkout?refId=UO-123456&amount=199000
  let paymentUrl: string | null = null;
  if (productId) {
    const query = new URLSearchParams({
      refId,
      amount: String(amount),
    });
    if (options?.returnUrl) {
      query.append('returnUrl', options.returnUrl);
    }
    paymentUrl = `${baseUrl.replace(/\/+$/, '')}/${productId}?${query.toString()}`;
  }

  return {
    provider: 'lynk',
    refId,
    orderNumber: order.orderNumber,
    amount,
    paymentUrl,
    status: 'pending',
    requiresOfficialApiDoc: !paymentUrl,
    notes: paymentUrl
      ? 'Payment session mapped via LYNK_PRODUCT_ID'
      : 'Lynk transaction creation API requires official Lynk checkout endpoint documentation',
  };
}
