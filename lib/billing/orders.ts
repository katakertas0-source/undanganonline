import crypto from 'crypto';
import { Order, OrderItem, Invitation } from '@/types';
import { DIY_PACKAGES, ADDONS } from '../data/catalog';
import { isAddonAvailableForPackage } from './entitlements';
import { getSupabaseAdmin } from '../supabase/admin';
import { orderToDbRow, dbRowToOrder, invitationToDbRow, dbRowToInvitation } from '../supabase/adapter';
import {
  getOrderById as getLocalOrderById,
  saveInvitation as saveLocalInvitation,
  getInvitationById as getLocalInvitationById,
  getCustomPackagePrices,
  getCustomAddonPrices,
} from '../store';

export interface AuthoritativePackage {
  id: string;
  name: string;
  tier: 'essential' | 'premium';
  price: number;
  availableAddonIds: string[];
  lockedAddonIds: string[];
}

export interface AuthoritativeAddon {
  id: string;
  name: string;
  code: string;
  featureKey: string;
  price: number;
}

export interface AuthoritativePriceCalculation {
  package: AuthoritativePackage;
  selectedAddons: AuthoritativeAddon[];
  subtotal: number;
  addonTotal: number;
  discount: number;
  total: number;
  items: OrderItem[];
  addonSnapshots: Array<{
    addonId: string;
    nameSnapshot: string;
    priceSnapshot: number;
  }>;
}

export interface CreateOrderParams {
  packageId: string;
  addonIds?: string[];
  invitationId?: string;
  userId?: string;
  orderNumber?: string;
}

/**
 * Authoritatively retrieves package information from database, falling back to static catalog.
 */
export async function getAuthoritativePackage(packageId: string): Promise<AuthoritativePackage | null> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', packageId)
        .eq('active', true)
        .maybeSingle();

      if (!error && data) {
        // Fetch availability matrix from package_addons if exists
        const { data: matrix } = await supabase
          .from('package_addons')
          .select('addon_id, is_available')
          .eq('package_id', packageId);

        const availableAddonIds: string[] = [];
        const lockedAddonIds: string[] = [];
        if (matrix) {
          for (const m of matrix) {
            if (m.is_available) availableAddonIds.push(m.addon_id);
            else lockedAddonIds.push(m.addon_id);
          }
        }

        return {
          id: data.id,
          name: data.name,
          tier: (data.tier || 'essential') as 'essential' | 'premium',
          price: Number(data.price),
          availableAddonIds,
          lockedAddonIds,
        };
      }
    } catch {
      // Fall through to catalog fallback
    }
  }

  // Catalog fallback
  const catalogPkg = DIY_PACKAGES.find((p) => p.id === packageId);
  if (!catalogPkg) return null;

  const customPkgPrices = getCustomPackagePrices();
  const pkgPrice = customPkgPrices[catalogPkg.id] !== undefined ? customPkgPrices[catalogPkg.id] : catalogPkg.price;

  return {
    id: catalogPkg.id,
    name: catalogPkg.name,
    tier: catalogPkg.tier,
    price: pkgPrice,
    availableAddonIds: catalogPkg.availableAddonIds || [],
    lockedAddonIds: catalogPkg.lockedAddonIds || [],
  };
}

/**
 * Authoritatively retrieves addon information from database, falling back to static catalog.
 */
export async function getAuthoritativeAddon(addonId: string): Promise<AuthoritativeAddon | null> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('addons')
        .select('*')
        .eq('id', addonId)
        .eq('active', true)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          code: data.code,
          featureKey: data.feature_key,
          price: Number(data.price),
        };
      }
    } catch {
      // Fall through to catalog fallback
    }
  }

  // Catalog fallback
  const catalogAddon = ADDONS.find((a) => a.id === addonId);
  if (!catalogAddon) return null;

  const customAddonPrices = getCustomAddonPrices();
  const addonPrice = customAddonPrices[catalogAddon.id] !== undefined ? customAddonPrices[catalogAddon.id] : catalogAddon.defaultPrice;

  return {
    id: catalogAddon.id,
    name: catalogAddon.name,
    code: catalogAddon.code,
    featureKey: catalogAddon.id.replace(/-/g, '_'),
    price: addonPrice,
  };
}

/**
 * Calculates authoritative order pricing on the backend.
 * Rejects any unallowed or locked add-ons and ignores client-supplied pricing.
 */
export async function calculateAuthoritativePricing(
  packageId: string,
  addonIds: string[] = []
): Promise<AuthoritativePriceCalculation> {
  const pkg = await getAuthoritativePackage(packageId);
  if (!pkg) {
    throw new Error(`Package not found: ${packageId}`);
  }

  // Filter out duplicates
  const uniqueAddonIds = Array.from(new Set(addonIds));
  const selectedAddons: AuthoritativeAddon[] = [];

  for (const addonId of uniqueAddonIds) {
    // 1. Verify eligibility for this package
    const isEligible = isAddonAvailableForPackage(packageId, addonId);
    if (!isEligible) {
      throw new Error(`Add-on '${addonId}' is not available for package '${pkg.name}'`);
    }

    // 2. Fetch authoritative addon pricing
    const addon = await getAuthoritativeAddon(addonId);
    if (!addon) {
      throw new Error(`Add-on not found in catalog: ${addonId}`);
    }

    selectedAddons.push(addon);
  }

  const subtotal = pkg.price;
  const addonTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const discount = 0;
  const total = subtotal + addonTotal - discount;

  // Build authoritative OrderItems snapshot
  const items: OrderItem[] = [
    {
      id: `item-pkg-${pkg.id}`,
      itemType: 'PACKAGE',
      referenceId: pkg.id,
      itemName: `Paket ${pkg.name}`,
      unitPrice: subtotal,
      quantity: 1,
      subtotal,
    },
    ...selectedAddons.map((addon) => ({
      id: `item-addon-${addon.id}`,
      itemType: 'ADDON' as const,
      referenceId: addon.id,
      itemName: addon.name,
      unitPrice: addon.price,
      quantity: 1,
      subtotal: addon.price,
    })),
  ];

  // Build snapshot for order_addons table
  const addonSnapshots = selectedAddons.map((addon) => ({
    addonId: addon.id,
    nameSnapshot: addon.name,
    priceSnapshot: addon.price,
  }));

  return {
    package: pkg,
    selectedAddons,
    subtotal,
    addonTotal,
    discount,
    total,
    items,
    addonSnapshots,
  };
}

/**
 * Creates an authoritative internal order.
 * - Recalculates all prices authoritatively
 * - Saves order to database
 * - Creates immutable order_addons snapshots
 */
// In-memory fallback stores for local testing / when tables are pending migration
const memoryOrders = new Map<string, Order>();
const memoryWebhooks = new Map<string, any>();

/**
 * Creates an authoritative internal order.
 * - Recalculates all prices authoritatively
 * - Saves order to database (with defensive fallback if schema migration is pending)
 * - Creates immutable order_addons snapshots
 */
export async function createInternalOrder({
  packageId,
  addonIds = [],
  invitationId = '',
  userId = '',
  orderNumber,
}: CreateOrderParams): Promise<{
  order: Order;
  pricing: AuthoritativePriceCalculation;
}> {
  const pricing = await calculateAuthoritativePricing(packageId, addonIds);

  const orderId = crypto.randomUUID();
  const generatedOrderNumber = orderNumber || `UO-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: orderId,
    orderNumber: generatedOrderNumber,
    userId: userId || '',
    invitationId: invitationId || '',
    packageId,
    items: pricing.items,
    totalAmount: pricing.total,
    discountAmount: pricing.discount,
    netAmount: pricing.total,
    subtotal: pricing.subtotal,
    addonTotal: pricing.addonTotal,
    discount: pricing.discount,
    total: pricing.total,
    paymentStatus: 'PENDING',
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  // Cache in memory fallback
  memoryOrders.set(orderId, newOrder);
  memoryOrders.set(generatedOrderNumber, newOrder);

  // 1. Save to Supabase orders table
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const fullRow = orderToDbRow(newOrder);
      const { error: orderError } = await supabase.from('orders').insert(fullRow);

      if (orderError) {
        // If error is due to columns added in migration (e.g. addon_total), retry with base schema columns
        if (orderError.message.includes('column') || orderError.message.includes('schema cache')) {
          const baseRow = {
            id: newOrder.id,
            order_number: newOrder.orderNumber,
            user_id: newOrder.userId && newOrder.userId.length === 36 ? newOrder.userId : null,
            invitation_id: newOrder.invitationId || null,
            items: newOrder.items || [],
            total_amount: newOrder.totalAmount,
            discount_amount: newOrder.discountAmount,
            net_amount: newOrder.netAmount,
            payment_status: 'PENDING',
            payment_method: null,
            paid_at: null,
          };
          const { error: retryErr } = await supabase.from('orders').insert(baseRow);
          if (retryErr) {
            console.warn('[Orders Service] Retry inserting base order failed:', retryErr.message);
          }
        } else {
          console.warn('[Orders Service] Error inserting order in Supabase:', orderError.message);
        }
      } else {
        // 2. Insert order_addons snapshots if order_addons table exists
        if (pricing.addonSnapshots.length > 0) {
          const addonRows = pricing.addonSnapshots.map((snap) => ({
            order_id: orderId,
            addon_id: snap.addonId,
            name_snapshot: snap.nameSnapshot,
            price_snapshot: snap.priceSnapshot,
          }));

          const { error: addonError } = await supabase.from('order_addons').insert(addonRows);
          if (addonError) {
            console.warn('[Orders Service] Error inserting order_addons snapshot:', addonError.message);
          }
        }
      }
    } catch (e) {
      console.warn('[Orders Service] Supabase exception during order creation:', e);
    }
  }

  return {
    order: newOrder,
    pricing,
  };
}

/**
 * Finds an order by internal ID, order number, or Lynk refId.
 */
export async function findOrderByRefId(refId: string): Promise<Order | null> {
  const cleanRef = refId.trim();
  if (!cleanRef) return null;

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`order_number.eq.${cleanRef},id.eq.${cleanRef}`)
        .maybeSingle();

      if (!error && data) {
        const order = dbRowToOrder(data);
        memoryOrders.set(order.id, order);
        memoryOrders.set(order.orderNumber, order);
        return order;
      }
    } catch (e) {
      console.warn('[Orders Service] Supabase error in findOrderByRefId:', e);
    }
  }

  // Memory cache fallback
  if (memoryOrders.has(cleanRef)) {
    return memoryOrders.get(cleanRef)!;
  }

  // Local fallback
  const local = getLocalOrderById(cleanRef);
  if (local) {
    memoryOrders.set(local.id, local);
    memoryOrders.set(local.orderNumber, local);
    return local;
  }

  return null;
}

/**
 * Webhook Idempotency Check:
 * Checks if a given messageId has already been recorded and processed in payment_webhooks.
 */
export async function isWebhookProcessed(messageId: string): Promise<boolean> {
  const cleanId = messageId.trim();
  if (!cleanId) return false;

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('payment_webhooks')
        .select('processed')
        .eq('message_id', cleanId)
        .maybeSingle();

      if (!error && data && data.processed) {
        return true;
      }
    } catch {}
  }

  // Memory fallback
  const cached = memoryWebhooks.get(cleanId);
  return Boolean(cached && cached.processed);
}

/**
 * Webhook Audit Logging:
 * Records the raw webhook event for debugging and idempotency tracking.
 */
export async function recordWebhookAudit({
  provider = 'lynk',
  event,
  messageId,
  refId,
  signature,
  payload,
  processed = false,
}: {
  provider?: string;
  event: string;
  messageId: string;
  refId?: string;
  signature?: string;
  payload: any;
  processed?: boolean;
}): Promise<string | null> {
  // Always update memory store
  memoryWebhooks.set(messageId, {
    provider,
    event,
    messageId,
    refId,
    signature,
    payload,
    processed,
    processedAt: processed ? new Date().toISOString() : null,
  });

  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('payment_webhooks')
      .upsert(
        {
          provider,
          event,
          message_id: messageId,
          ref_id: refId || null,
          signature: signature || null,
          payload,
          processed,
          processed_at: processed ? new Date().toISOString() : null,
        },
        { onConflict: 'message_id' }
      )
      .select('id')
      .maybeSingle();

    if (error) {
      return null;
    }

    return data?.id || null;
  } catch {
    return null;
  }
}

/**
 * Authoritatively marks an order as PAID, performs reconciliation,
 * activates the package and add-ons on the invitation, and generates credentials.
 */
export async function markOrderPaidAuthoritative(
  refId: string,
  details: {
    messageId?: string;
    lynkRefId?: string;
    paymentMethod?: string;
  } = {}
): Promise<{
  success: boolean;
  order: Order;
  invitation?: Invitation;
  alreadyPaid?: boolean;
}> {
  const order = await findOrderByRefId(refId);
  if (!order) {
    throw new Error(`Order not found for refId: ${refId}`);
  }

  // Idempotency: Protect against multiple activations for the same order
  if (order.paymentStatus === 'PAID' || order.status === 'paid') {
    return {
      success: true,
      order,
      alreadyPaid: true,
    };
  }

  const now = new Date().toISOString();
  order.paymentStatus = 'PAID';
  order.status = 'paid';
  order.paidAt = now;
  order.updatedAt = now;
  order.paymentMethod = details.paymentMethod || 'Lynk.id';
  if (details.lynkRefId) order.lynkRefId = details.lynkRefId;
  if (details.messageId) order.lynkMessageId = details.messageId;

  // Update in memory cache
  memoryOrders.set(order.id, order);
  memoryOrders.set(order.orderNumber, order);

  const supabase = getSupabaseAdmin();

  // 1. Update Order in Supabase
  if (supabase) {
    try {
      const { error: updateErr } = await supabase
        .from('orders')
        .update({
          payment_status: 'PAID',
          status: 'paid',
          paid_at: now,
          updated_at: now,
          payment_method: order.paymentMethod,
          lynk_ref_id: order.lynkRefId || null,
          lynk_message_id: order.lynkMessageId || null,
        })
        .eq('id', order.id);

      if (updateErr && (updateErr.message.includes('column') || updateErr.message.includes('schema cache'))) {
        // Fallback to base columns if migration is pending in Supabase
        await supabase
          .from('orders')
          .update({
            payment_status: 'PAID',
            paid_at: now,
            payment_method: order.paymentMethod,
          })
          .eq('id', order.id);
      }
    } catch (e) {
      console.warn('[Orders Service] Supabase error updating order to PAID:', e);
    }
  }

  // 2. Activate Package & Add-ons on Related Invitation
  let updatedInvitation: Invitation | undefined;

  if (order.invitationId) {
    let currentInv: Invitation | null = null;

    if (supabase) {
      try {
        const { data } = await supabase
          .from('invitations')
          .select('*')
          .eq('id', order.invitationId)
          .maybeSingle();

        if (data) {
          currentInv = dbRowToInvitation(data);
        }
      } catch (e) {
        console.warn('[Orders Service] Error fetching invitation from Supabase:', e);
      }
    }

    if (!currentInv) {
      currentInv = getLocalInvitationById(order.invitationId) || null;
    }

    if (currentInv) {
      // Gather addon IDs purchased in this order
      const purchasedAddonIds: string[] = order.items
        .filter((item) => item.itemType === 'ADDON')
        .map((item) => item.referenceId);

      // Merge active addons
      const mergedAddonIds = Array.from(
        new Set([...(currentInv.activeAddonIds || []), ...purchasedAddonIds])
      );

      // Generate dashboard credentials if not already assigned
      const dashboardUsername = currentInv.dashboardUsername || currentInv.slug;
      const dashboardPassword =
        currentInv.dashboardPassword || `KITA-${Math.floor(1000 + Math.random() * 9000)}`;

      currentInv.status = 'ACTIVE';
      currentInv.activeAddonIds = mergedAddonIds;
      if (order.packageId) {
        currentInv.packageId = order.packageId;
      }
      currentInv.dashboardUsername = dashboardUsername;
      currentInv.dashboardPassword = dashboardPassword;
      order.dashboardUsername = dashboardUsername;
      order.dashboardPassword = dashboardPassword;

      updatedInvitation = currentInv;

      // Update Invitation in Supabase
      if (supabase) {
        try {
          const invRow = invitationToDbRow(currentInv);
          await supabase
            .from('invitations')
            .update({
              status: 'ACTIVE',
              package_id: currentInv.packageId,
              active_addon_ids: mergedAddonIds,
              updated_at: now,
            })
            .eq('id', currentInv.id);
        } catch (e) {
          console.warn('[Orders Service] Error activating invitation in Supabase:', e);
        }
      }

      // Sync to local store
      try {
        saveLocalInvitation(currentInv);
      } catch {}
    }
  }

  return {
    success: true,
    order,
    invitation: updatedInvitation,
  };
}
