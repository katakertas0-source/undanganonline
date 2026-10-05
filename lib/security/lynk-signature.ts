import crypto from 'crypto';

export interface SignaturePayload {
  amount: number | string;
  refId: string;
  messageId: string;
  merchantKey?: string;
}

export interface VerifySignatureParams extends SignaturePayload {
  signature: string | null | undefined;
}

/**
 * Returns the secret merchant key from server environment variables.
 * Never exposes the key to client-side code.
 */
export function getLynkMerchantKey(): string {
  if (typeof window !== 'undefined') {
    throw new Error('[Security] Lynk merchant key cannot be accessed in the browser context!');
  }
  return process.env.LYNK_MERCHANT_KEY || process.env.LYNK_WEBHOOK_SECRET || '';
}

/**
 * Generates SHA-256 signature according to Lynk.id specification:
 * SHA256(amount + refId + message_id + merchant_key)
 */
export function calculateLynkSignature({
  amount,
  refId,
  messageId,
  merchantKey,
}: SignaturePayload): string {
  const key = merchantKey || getLynkMerchantKey();
  if (!key) {
    throw new Error('[Lynk Security] LYNK_MERCHANT_KEY environment variable is not configured.');
  }

  // Normalize amount: integers as string without decimals, e.g. 199000
  const normalizedAmount = typeof amount === 'number'
    ? Math.round(amount).toString()
    : amount.trim();

  const signatureString = `${normalizedAmount}${refId.trim()}${messageId.trim()}${key.trim()}`;

  return crypto
    .createHash('sha256')
    .update(signatureString)
    .digest('hex')
    .toLowerCase();
}

/**
 * Validates the X-Lynk-Signature header from an incoming webhook.
 * Rejects invalid signatures using timingSafeEqual to guard against timing attacks.
 */
export function verifyLynkSignature({
  amount,
  refId,
  messageId,
  signature,
  merchantKey,
}: VerifySignatureParams): boolean {
  if (!signature) return false;

  const key = merchantKey || getLynkMerchantKey();
  if (!key) {
    console.error('[Lynk Security] Webhook signature verification failed: Merchant key not configured.');
    return false;
  }

  try {
    const expected = calculateLynkSignature({
      amount,
      refId,
      messageId,
      merchantKey: key,
    });

    const cleanReceived = signature.trim().toLowerCase();
    const expectedBuffer = Buffer.from(expected, 'utf8');
    const receivedBuffer = Buffer.from(cleanReceived, 'utf8');

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch (err) {
    console.error('[Lynk Security] Error verifying signature:', err);
    return false;
  }
}
