import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * POST /api/orders — Create a new order.
 * SERVER-SIDE VALIDATED: auth, prices, stock, coupon.
 * The client is NEVER trusted for pricing or auth state.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate the user (server-side session check)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll() { /* Route handler, no-op for reads */ },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to place an order.' },
        { status: 401 }
      );
    }

    // 2. Parse and validate the request body
    const body = await request.json();
    const { items, shipping, couponCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    if (!shipping?.name || !shipping?.line1 || !shipping?.city || !shipping?.state || !shipping?.postal) {
      return NextResponse.json({ error: 'Complete shipping address is required.' }, { status: 400 });
    }

    // Sanitize shipping fields
    const sanitizedShipping = {
      name: String(shipping.name).trim().slice(0, 200),
      line1: String(shipping.line1).trim().slice(0, 300),
      line2: String(shipping.line2 || '').trim().slice(0, 300),
      city: String(shipping.city).trim().slice(0, 100),
      state: String(shipping.state).trim().slice(0, 50),
      postal: String(shipping.postal).trim().slice(0, 20),
      country: String(shipping.country || 'US').trim().slice(0, 10),
    };

    // 3. Validate all items against the DATABASE (never trust client prices)
    const admin = createAdminClient();
    const productIds = items.map((i: { productId: string }) => i.productId);
    
    const { data: dbProducts, error: productError } = await admin
      .from('products')
      .select('*, product_variants(*)')
      .in('id', productIds)
      .eq('is_active', true);

    if (productError || !dbProducts) {
      return NextResponse.json({ error: 'Failed to verify products.' }, { status: 500 });
    }

    // Build a lookup map
    const productMap = new Map(dbProducts.map((p: Record<string, unknown>) => [p.id, p]));

    // 4. Calculate total server-side and validate stock
    let subtotal = 0;
    const orderItems: Array<{
      product_id: string;
      variant_id: string | null;
      product_name: string;
      variant_label: string;
      unit_price: number;
      quantity: number;
    }> = [];

    for (const item of items) {
      const product = productMap.get(item.productId) as Record<string, unknown> | undefined;
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }

      const qty = Math.max(1, Math.min(99, parseInt(String(item.quantity)) || 1));
      let unitPrice = product.price as number;
      let variantLabel = '';
      let variantId = null;

      // Validate variant if provided
      if (item.variantId) {
        const variants = product.product_variants as Array<Record<string, unknown>>;
        const variant = variants?.find((v: Record<string, unknown>) => v.id === item.variantId);
        if (variant) {
          unitPrice += variant.price_delta as number;
          variantLabel = variant.label as string;
          variantId = variant.id as string;
        }
      }

      // Check stock
      if ((product.stock_qty as number) < qty) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Available: ${product.stock_qty}` },
          { status: 400 }
        );
      }

      subtotal += unitPrice * qty;
      orderItems.push({
        product_id: product.id as string,
        variant_id: variantId,
        product_name: product.name as string,
        variant_label: variantLabel,
        unit_price: unitPrice,
        quantity: qty,
      });
    }

    // 5. Apply coupon if provided (server-validated)
    let discount = 0;
    let appliedCoupon = null;

    if (couponCode && typeof couponCode === 'string') {
      const { data: coupon } = await admin
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase().trim())
        .eq('is_active', true)
        .single();

      if (coupon) {
        const now = new Date();
        const notExpired = !coupon.expires_at || new Date(coupon.expires_at) > now;
        const underLimit = !coupon.max_uses || coupon.current_uses < coupon.max_uses;
        const meetsMinimum = subtotal >= (coupon.min_order || 0);

        if (notExpired && underLimit && meetsMinimum) {
          if (coupon.discount_type === 'percentage') {
            discount = Math.round(subtotal * (coupon.discount_value / 100));
          } else {
            discount = Math.min(coupon.discount_value, subtotal);
          }
          appliedCoupon = coupon;
        }
      }
    }

    // 6. Calculate final total
    const shippingCost = subtotal >= 50000 ? 0 : 2999; // Free shipping over $500
    const taxRate = 0; // Configure per state if needed
    const tax = Math.round((subtotal - discount) * taxRate);
    const total = subtotal - discount + shippingCost + tax;

    // 7. Create the order in a transaction-like manner
    const { data: order, error: orderError } = await admin
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        subtotal,
        discount,
        shipping_cost: shippingCost,
        tax,
        total,
        shipping_name: sanitizedShipping.name,
        shipping_line1: sanitizedShipping.line1,
        shipping_line2: sanitizedShipping.line2,
        shipping_city: sanitizedShipping.city,
        shipping_state: sanitizedShipping.state,
        shipping_postal: sanitizedShipping.postal,
        shipping_country: sanitizedShipping.country,
        coupon_code: appliedCoupon?.code || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Order creation failed:', orderError);
      return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
    }

    // 8. Insert order items
    const itemsToInsert = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await admin.from('order_items').insert(itemsToInsert);
    if (itemsError) {
      // Rollback order
      await admin.from('orders').delete().eq('id', order.id);
      console.error('Order items insertion failed:', itemsError);
      return NextResponse.json({ error: 'Failed to create order items.' }, { status: 500 });
    }

    // 9. Decrement stock for each product
    for (const item of orderItems) {
      const currentStock = (productMap.get(item.product_id) as Record<string, unknown>).stock_qty as number;
      await admin
        .from('products')
        .update({ stock_qty: currentStock - item.quantity })
        .eq('id', item.product_id);
    }

    // 10. Increment coupon usage
    if (appliedCoupon) {
      await admin
        .from('coupons')
        .update({ current_uses: appliedCoupon.current_uses + 1 })
        .eq('id', appliedCoupon.id);
    }

    // 11. Create invoice
    const invoiceNumber = `INV-${Date.now()}-${order.id.slice(0, 8).toUpperCase()}`;
    await admin.from('invoices').insert({
      order_id: order.id,
      user_id: user.id,
      invoice_number: invoiceNumber,
      subtotal,
      discount,
      tax,
      total,
      status: 'issued',
    });

    // 12. Send order confirmation email (non-blocking)
    sendOrderConfirmationEmail(user.email!, order.id, invoiceNumber, total).catch(console.error);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      invoiceNumber,
      total,
    });

  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * Send order confirmation email via Resend.
 * Non-blocking — errors are logged but don't fail the order.
 */
async function sendOrderConfirmationEmail(
  customerEmail: string,
  orderId: string,
  invoiceNumber: string,
  totalCents: number
) {
  const resendKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL || 'tesertar@gmail.com';

  if (!resendKey || resendKey === 'PLACEHOLDER') return;

  const total = (totalCents / 100).toFixed(2);

  // Email to customer
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Eclipse Electric <orders@eclipseelectric.com>',
      to: customerEmail,
      subject: `Order Confirmed — ${invoiceNumber}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; margin-bottom: 8px;">Order Confirmed</h1>
          <p style="color: #666; margin-bottom: 24px;">Thank you for your purchase from Eclipse Electric.</p>
          <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p><strong>Order ID:</strong> ${orderId.slice(0, 8)}...</p>
            <p><strong>Invoice:</strong> ${invoiceNumber}</p>
            <p><strong>Total:</strong> $${total}</p>
            <p><strong>Status:</strong> Pending</p>
          </div>
          <p style="color: #999; font-size: 12px;">
            You will receive tracking information once your order ships.
            Questions? Reply to this email or contact us at eclipseelectric.com/contact
          </p>
        </div>
      `,
    }),
  });

  // Notification to business
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Eclipse Electric <orders@eclipseelectric.com>',
      to: notificationEmail,
      subject: `New Order — ${invoiceNumber} ($${total})`,
      html: `
        <div style="font-family: -apple-system, sans-serif; padding: 20px;">
          <h2>New Order Received</h2>
          <p><strong>Customer:</strong> ${customerEmail}</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Invoice:</strong> ${invoiceNumber}</p>
          <p><strong>Total:</strong> $${total}</p>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/orders">View in Admin</a></p>
        </div>
      `,
    }),
  });
}
