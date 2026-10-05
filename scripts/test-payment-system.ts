import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { calculateAuthoritativePricing, createInternalOrder, findOrderByRefId, markOrderPaidAuthoritative } from '../lib/billing/orders';
import { getEntitlements, hasFeature } from '../lib/billing/entitlements';
import { calculateLynkSignature, verifyLynkSignature } from '../lib/security/lynk-signature';
import { verifyLynkWebhook, normalizeLynkWebhook } from '../lib/payments/lynk';
import { POST as webhookHandler } from '../app/api/webhooks/lynk/route';
import { POST as createOrderHandler } from '../app/api/orders/route';
import { NextRequest } from 'next/server';

const TEST_MERCHANT_KEY = process.env.LYNK_MERCHANT_KEY || 'test_lynk_merchant_key_2026_secret';

function createMockWebhookRequest(payload: any, signature: string | null) {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  if (signature) {
    headers['x-lynk-signature'] = signature;
  }

  return new NextRequest('http://localhost:3000/api/webhooks/lynk', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
}

function createMockOrderRequest(body: any) {
  return new NextRequest('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING LYNK.ID PAYMENT & ENTITLEMENT TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // ----------------------------------------------------
  // TEST 1 — Package only
  // ----------------------------------------------------
  try {
    console.log('--- TEST 1: Package Only ---');
    const { order } = await createInternalOrder({
      packageId: 'pkg-premium',
      addonIds: [],
    });

    const signature = calculateLynkSignature({
      amount: order.totalAmount,
      refId: order.orderNumber,
      messageId: `msg_test_1_${Date.now()}`,
      merchantKey: TEST_MERCHANT_KEY,
    });

    const payload = {
      event: 'payment.received',
      data: {
        message_id: `msg_test_1_${Date.now()}`,
        message_data: {
          refId: order.orderNumber,
          totals: {
            grandTotal: order.totalAmount,
            totalPrice: order.totalAmount,
            totalAddon: 0,
          },
        },
      },
    };

    const req = createMockWebhookRequest(payload, signature);
    const res = await webhookHandler(req);
    const resJson = await res.json();

    const updatedOrder = await findOrderByRefId(order.orderNumber);
    const entitlements = getEntitlements({ packageId: updatedOrder?.packageId });

    if (
      res.status === 200 &&
      updatedOrder?.paymentStatus === 'PAID' &&
      entitlements.premium_template === true &&
      entitlements.premium_animation === true
    ) {
      console.log('✅ TEST 1 PASSED: Package only marked PAID and Premium entitlement active\n');
      passed++;
    } else {
      console.error('❌ TEST 1 FAILED:', { status: res.status, updatedOrder, entitlements });
      failed++;
    }
  } catch (e: any) {
    console.error('❌ TEST 1 EXCEPTION:', e.message);
    failed++;
  }

  // ----------------------------------------------------
  // TEST 2 — Package + multiple add-ons
  // ----------------------------------------------------
  try {
    console.log('--- TEST 2: Package + Multiple Add-ons ---');
    // Using available add-ons for premium: video-prewedding, living-video-bg, qr-checkin-pass
    const selectedAddons = ['video-prewedding', 'living-video-bg', 'qr-checkin-pass'];
    const { order } = await createInternalOrder({
      packageId: 'pkg-premium',
      addonIds: selectedAddons,
    });

    const msgId = `msg_test_2_${Date.now()}`;
    const signature = calculateLynkSignature({
      amount: order.totalAmount,
      refId: order.orderNumber,
      messageId: msgId,
      merchantKey: TEST_MERCHANT_KEY,
    });

    const payload = {
      event: 'payment.received',
      data: {
        message_id: msgId,
        message_data: {
          refId: order.orderNumber,
          totals: {
            grandTotal: order.totalAmount,
            totalPrice: order.subtotal,
            totalAddon: order.addonTotal,
          },
        },
      },
    };

    const req = createMockWebhookRequest(payload, signature);
    const res = await webhookHandler(req);
    const updatedOrder = await findOrderByRefId(order.orderNumber);
    const entitlements = getEntitlements({
      packageId: updatedOrder?.packageId,
      activeAddonIds: selectedAddons,
    });

    if (
      res.status === 200 &&
      updatedOrder?.paymentStatus === 'PAID' &&
      entitlements.video_prewedding === true &&
      entitlements.living_video_bg === true &&
      entitlements.qr_checkin_pass === true
    ) {
      console.log('✅ TEST 2 PASSED: Package + multiple add-ons marked PAID and all 3 features active\n');
      passed++;
    } else {
      console.error('❌ TEST 2 FAILED:', { status: res.status, updatedOrder, entitlements });
      failed++;
    }
  } catch (e: any) {
    console.error('❌ TEST 2 EXCEPTION:', e.message);
    failed++;
  }

  // ----------------------------------------------------
  // TEST 3 — Invalid signature
  // ----------------------------------------------------
  try {
    console.log('--- TEST 3: Invalid Signature ---');
    const { order } = await createInternalOrder({
      packageId: 'pkg-essential',
      addonIds: [],
    });

    const invalidSignature = 'invalid_sha256_hash_value_1234567890abcdef';
    const payload = {
      event: 'payment.received',
      data: {
        message_id: `msg_test_3_${Date.now()}`,
        message_data: {
          refId: order.orderNumber,
          totals: {
            grandTotal: order.totalAmount,
          },
        },
      },
    };

    const req = createMockWebhookRequest(payload, invalidSignature);
    const res = await webhookHandler(req);
    const updatedOrder = await findOrderByRefId(order.orderNumber);

    if (res.status === 401 && updatedOrder?.paymentStatus === 'PENDING') {
      console.log('✅ TEST 3 PASSED: Webhook rejected with 401, order remains pending, no entitlement\n');
      passed++;
    } else {
      console.error('❌ TEST 3 FAILED: Expected 401 but got', res.status, updatedOrder?.paymentStatus);
      failed++;
    }
  } catch (e: any) {
    console.error('❌ TEST 3 EXCEPTION:', e.message);
    failed++;
  }

  // ----------------------------------------------------
  // TEST 4 — Wrong amount
  // ----------------------------------------------------
  try {
    console.log('--- TEST 4: Wrong Amount ---');
    const { order } = await createInternalOrder({
      packageId: 'pkg-essential',
      addonIds: [],
    });

    const wrongAmount = order.totalAmount - 50000;
    const msgId = `msg_test_4_${Date.now()}`;
    const signature = calculateLynkSignature({
      amount: wrongAmount,
      refId: order.orderNumber,
      messageId: msgId,
      merchantKey: TEST_MERCHANT_KEY,
    });

    const payload = {
      event: 'payment.received',
      data: {
        message_id: msgId,
        message_data: {
          refId: order.orderNumber,
          totals: {
            grandTotal: wrongAmount,
          },
        },
      },
    };

    const req = createMockWebhookRequest(payload, signature);
    const res = await webhookHandler(req);
    const updatedOrder = await findOrderByRefId(order.orderNumber);

    if (res.status === 400 && updatedOrder?.paymentStatus === 'PENDING') {
      console.log('✅ TEST 4 PASSED: Wrong amount rejected with 400, order remains pending\n');
      passed++;
    } else {
      console.error('❌ TEST 4 FAILED: Expected 400 but got', res.status, updatedOrder?.paymentStatus);
      failed++;
    }
  } catch (e: any) {
    console.error('❌ TEST 4 EXCEPTION:', e.message);
    failed++;
  }

  // ----------------------------------------------------
  // TEST 5 — Unknown refId
  // ----------------------------------------------------
  try {
    console.log('--- TEST 5: Unknown refId ---');
    const unknownRefId = 'UO-UNKNOWN-999999';
    const msgId = `msg_test_5_${Date.now()}`;
    const signature = calculateLynkSignature({
      amount: 199000,
      refId: unknownRefId,
      messageId: msgId,
      merchantKey: TEST_MERCHANT_KEY,
    });

    const payload = {
      event: 'payment.received',
      data: {
        message_id: msgId,
        message_data: {
          refId: unknownRefId,
          totals: {
            grandTotal: 199000,
          },
        },
      },
    };

    const req = createMockWebhookRequest(payload, signature);
    const res = await webhookHandler(req);

    if (res.status === 404) {
      console.log('✅ TEST 5 PASSED: Unknown refId returned 404, nothing activated\n');
      passed++;
    } else {
      console.error('❌ TEST 5 FAILED: Expected 404 but got', res.status);
      failed++;
    }
  } catch (e: any) {
    console.error('❌ TEST 5 EXCEPTION:', e.message);
    failed++;
  }

  // ----------------------------------------------------
  // TEST 6 — Duplicate webhook (Idempotency)
  // ----------------------------------------------------
  try {
    console.log('--- TEST 6: Duplicate Webhook Idempotency ---');
    const { order } = await createInternalOrder({
      packageId: 'pkg-essential',
      addonIds: ['love-story'],
    });

    const msgId = `msg_test_6_${Date.now()}`;
    const signature = calculateLynkSignature({
      amount: order.totalAmount,
      refId: order.orderNumber,
      messageId: msgId,
      merchantKey: TEST_MERCHANT_KEY,
    });

    const payload = {
      event: 'payment.received',
      data: {
        message_id: msgId,
        message_data: {
          refId: order.orderNumber,
          totals: {
            grandTotal: order.totalAmount,
          },
        },
      },
    };

    // First delivery
    const req1 = createMockWebhookRequest(payload, signature);
    const res1 = await webhookHandler(req1);
    const res1Json = await res1.json();

    // Second delivery (duplicate retry by Lynk)
    const req2 = createMockWebhookRequest(payload, signature);
    const res2 = await webhookHandler(req2);
    const res2Json = await res2.json();

    if (
      res1.status === 200 &&
      res2.status === 200 &&
      (res2Json.status === 'already_processed' || res2Json.status === 'order_already_paid')
    ) {
      console.log('✅ TEST 6 PASSED: Duplicate webhook returned 200 OK without re-activating\n');
      passed++;
    } else {
      console.error('❌ TEST 6 FAILED:', { res1: res1Json, res2: res2Json });
      failed++;
    }
  } catch (e: any) {
    console.error('❌ TEST 6 EXCEPTION:', e.message);
    failed++;
  }

  // ----------------------------------------------------
  // TEST 7 — User manipulates frontend price
  // ----------------------------------------------------
  try {
    console.log('--- TEST 7: Frontend Price Manipulation ---');
    const req = createMockOrderRequest({
      packageId: 'pkg-essential',
      addonIds: ['love-story'],
      price: 1, // Malicious client attempt
      total: 1,
    });

    const res = await createOrderHandler(req);
    const json = await res.json();

    // Expected: Essential (99.000) + love-story (25.000) = 124.000
    if (res.status === 201 && json.order.totalAmount === 124000) {
      console.log('✅ TEST 7 PASSED: Server ignored client price = 1 and calculated authoritative Rp 124.000\n');
      passed++;
    } else {
      console.error('❌ TEST 7 FAILED: Server accepted manipulated price:', json);
      failed++;
    }
  } catch (e: any) {
    console.error('❌ TEST 7 EXCEPTION:', e.message);
    failed++;
  }

  // ----------------------------------------------------
  // TEST 8 — Add-on not available for package
  // ----------------------------------------------------
  try {
    console.log('--- TEST 8: Add-on Not Available for Package ---');
    // premium-animation is locked for pkg-essential
    const req = createMockOrderRequest({
      packageId: 'pkg-essential',
      addonIds: ['premium-animation'], // Locked!
    });

    const res = await createOrderHandler(req);
    const json = await res.json();

    if (res.status === 400 && json.success === false) {
      console.log('✅ TEST 8 PASSED: Backend rejected order with unavailable/locked add-on:', json.error, '\n');
      passed++;
    } else {
      console.error('❌ TEST 8 FAILED: Expected rejection (400) but got', res.status, json);
      failed++;
    }
  } catch (e: any) {
    console.error('❌ TEST 8 EXCEPTION:', e.message);
    failed++;
  }

  console.log('====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
