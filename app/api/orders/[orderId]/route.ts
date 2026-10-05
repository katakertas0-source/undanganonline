import { NextRequest, NextResponse } from 'next/server';
import { findOrderByRefId } from '@/lib/billing/orders';
import { getEntitlements } from '@/lib/billing/entitlements';
import { createLynkPayment } from '@/lib/payments/lynk';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { dbRowToInvitation } from '@/lib/supabase/adapter';
import { getInvitationById as getLocalInvitationById } from '@/lib/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'orderId parameter is required' },
        { status: 400 }
      );
    }

    const order = await findOrderByRefId(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order not found: ${orderId}` },
        { status: 404 }
      );
    }

    // Retrieve invitation if linked
    let invitation = null;
    let entitlements = null;

    if (order.invitationId) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data } = await supabase
            .from('invitations')
            .select('*')
            .eq('id', order.invitationId)
            .maybeSingle();

          if (data) {
            invitation = dbRowToInvitation(data);
          }
        } catch {}
      }

      if (!invitation) {
        invitation = getLocalInvitationById(order.invitationId) || null;
      }

      if (invitation) {
        entitlements = getEntitlements(invitation);
      }
    }

    const paymentInfo = await createLynkPayment(order);

    return NextResponse.json({
      success: true,
      payment: paymentInfo,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        packageId: order.packageId,
        paymentStatus: order.paymentStatus,
        status: order.status || order.paymentStatus.toLowerCase(),
        totalAmount: order.totalAmount,
        subtotal: order.subtotal ?? order.totalAmount,
        addonTotal: order.addonTotal ?? 0,
        discount: order.discount ?? 0,
        items: order.items,
        paidAt: order.paidAt,
        paymentMethod: order.paymentMethod,
        lynkRefId: order.lynkRefId,
        invitationId: order.invitationId,
        createdAt: order.createdAt,
      },
      invitation: invitation
        ? {
            id: invitation.id,
            title: invitation.title,
            slug: invitation.slug,
            status: invitation.status,
            activeAddonIds: invitation.activeAddonIds,
            packageId: invitation.packageId,
          }
        : null,
      entitlements,
    });
  } catch (err: any) {
    console.error('[API /api/orders/[orderId]] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
