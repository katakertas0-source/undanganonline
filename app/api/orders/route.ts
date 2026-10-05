import { NextRequest, NextResponse } from 'next/server';
import { createInternalOrder } from '@/lib/billing/orders';
import { createLynkPayment } from '@/lib/payments/lynk';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { packageId, addonIds = [], invitationId, userId, customerName, customerEmail } = body;

    if (!packageId) {
      return NextResponse.json(
        { success: false, error: 'packageId is required' },
        { status: 400 }
      );
    }

    // Server-side authoritative validation and order creation
    // Backend rejects any unauthorized or locked add-ons and calculates the authoritative total
    const { order, pricing } = await createInternalOrder({
      packageId,
      addonIds: Array.isArray(addonIds) ? addonIds : [],
      invitationId,
      userId,
    });

    // Generate Lynk payment information using the payment adapter
    const origin = req.nextUrl.origin;
    const returnUrl = `${origin}/checkout/success?orderId=${order.id}`;

    const paymentInfo = await createLynkPayment(order, {
      customerName,
      customerEmail,
      returnUrl,
    });

    return NextResponse.json(
      {
        success: true,
        order,
        pricing: {
          subtotal: pricing.subtotal,
          addonTotal: pricing.addonTotal,
          discount: pricing.discount,
          total: pricing.total,
          items: pricing.items,
        },
        payment: paymentInfo,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[API /api/orders] Error creating order:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to create order',
      },
      { status: 400 }
    );
  }
}
