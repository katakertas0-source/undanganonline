import { NextRequest, NextResponse } from 'next/server';
import {
  normalizeLynkWebhook,
  verifyLynkWebhook,
} from '@/lib/payments/lynk';
import {
  findOrderByRefId,
  isWebhookProcessed,
  recordWebhookAudit,
  markOrderPaidAuthoritative,
} from '@/lib/billing/orders';

export async function GET() {
  return NextResponse.json(
    {
      status: 'active',
      gateway: 'Lynk.id Webhook Receiver',
      message: 'Endpoint is live and ready to receive webhooks from Lynk.id',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  let rawBody: any = null;

  try {
    const signatureHeader =
      req.headers.get('x-lynk-signature') ||
      req.headers.get('X-Lynk-Signature') ||
      '';

    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Malformed JSON payload' },
        { status: 400 }
      );
    }

    // Handle test / ping events from Lynk dashboard (e.g. "Test URL" button)
    const eventName = String(rawBody?.event || rawBody?.type || '').toLowerCase();
    if (
      eventName === 'test' ||
      eventName === 'ping' ||
      eventName === 'webhook.test' ||
      rawBody?.action === 'test' ||
      rawBody?.test === true
    ) {
      console.log('[Lynk Webhook] Received Test URL ping from Lynk dashboard');
      return NextResponse.json(
        {
          success: true,
          message: 'Lynk webhook test successful. Endpoint is live.',
        },
        { status: 200 }
      );
    }

    const normalized = normalizeLynkWebhook(rawBody);
    const { messageId, refId, grandTotal, event } = normalized;

    // 1. Initial audit recording
    await recordWebhookAudit({
      provider: 'lynk',
      event,
      messageId: messageId || 'unknown-' + Date.now(),
      refId: refId || undefined,
      signature: signatureHeader || undefined,
      payload: rawBody,
      processed: false,
    });

    // 2. Validate payload essentials
    if (!messageId) {
      console.error('[Lynk Webhook] Missing message_id in payload');
      return NextResponse.json(
        { success: false, error: 'Missing message_id in webhook payload' },
        { status: 400 }
      );
    }

    if (!refId) {
      console.error('[Lynk Webhook] Missing refId in payload');
      return NextResponse.json(
        { success: false, error: 'Missing refId in webhook payload' },
        { status: 400 }
      );
    }

    // 3. Signature verification
    const { isValid, error: sigError } = verifyLynkWebhook(signatureHeader, rawBody);
    if (!isValid) {
      console.warn(`[Lynk Webhook] Signature verification failed for message_id: ${messageId}`, sigError);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Lynk signature',
          detail: sigError,
        },
        { status: 401 }
      );
    }

    // 4. Webhook Idempotency Check:
    // If Lynk retries delivery and this message_id was already processed, return 200 OK immediately
    const alreadyProcessed = await isWebhookProcessed(messageId);
    if (alreadyProcessed) {
      console.log(`[Lynk Webhook] Duplicate message_id detected (${messageId}). Returning 200 OK.`);
      return NextResponse.json(
        {
          success: true,
          status: 'already_processed',
          message: 'Webhook already processed successfully',
          messageId,
        },
        { status: 200 }
      );
    }

    // 5. Order Reconciliation:
    // Match the incoming refId to an internal order
    const order = await findOrderByRefId(refId);
    if (!order) {
      console.warn(`[Lynk Webhook] Reconciliation failed: No internal order found for refId: ${refId}`);
      return NextResponse.json(
        {
          success: false,
          error: `Order reconciliation failed: No order matches refId '${refId}'`,
        },
        { status: 404 }
      );
    }

    // 6. Check if Order is Already Paid (Order-level idempotency protection)
    if (order.paymentStatus === 'PAID' || order.status === 'paid') {
      console.log(`[Lynk Webhook] Order ${order.orderNumber} is already marked as PAID.`);
      await recordWebhookAudit({
        event,
        messageId,
        refId,
        signature: signatureHeader,
        payload: rawBody,
        processed: true,
      });

      return NextResponse.json(
        {
          success: true,
          status: 'order_already_paid',
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
        { status: 200 }
      );
    }

    // 7. Authoritative Amount Validation:
    // Compare internal order amount vs transaction amount sent by Lynk
    const internalTotal = Math.round(Number(order.totalAmount || order.total || order.netAmount));
    const lynkGrandTotal = Math.round(Number(grandTotal));

    if (internalTotal !== lynkGrandTotal) {
      console.error(
        `[Lynk Webhook] Amount validation error: Internal order total (${internalTotal}) does not match Lynk transaction grandTotal (${lynkGrandTotal}) for order ${order.orderNumber}`
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Amount mismatch: payment amount does not match internal order total',
          expected: internalTotal,
          received: lynkGrandTotal,
        },
        { status: 400 }
      );
    }

    // 8. Payment Success & Entitlement Activation:
    // Update order status to paid, link Lynk refId/messageId, and activate package & addons on invitation
    const result = await markOrderPaidAuthoritative(order.id, {
      messageId,
      lynkRefId: refId,
      paymentMethod: 'Lynk.id',
    });

    // Mark webhook as processed
    await recordWebhookAudit({
      event,
      messageId,
      refId,
      signature: signatureHeader,
      payload: rawBody,
      processed: true,
    });

    console.log(`[Lynk Webhook] Payment verified successfully for order ${order.orderNumber}. Entitlements activated.`);

    return NextResponse.json(
      {
        success: true,
        message: 'Payment verified and processed successfully',
        orderId: result.order.id,
        orderNumber: result.order.orderNumber,
        status: 'PAID',
        activatedInvitationId: result.invitation?.id,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('[Lynk Webhook] Unhandled error processing webhook:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Internal server error in webhook handler',
      },
      { status: 500 }
    );
  }
}
