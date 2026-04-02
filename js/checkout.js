// ============================================================
//  js/checkout.js  —  Razorpay payment flow
// ============================================================

async function initiateCheckout() {
  if (cart.length === 0) return;

  // Require login if Supabase is configured
  if (!currentUser && sb) {
    openAuthModal();
    showToast('Please sign in to complete your purchase.');
    return;
  }

  const amount = cartTotal();

  // ── Save pending order to Supabase ────────────────────────
  let orderId = 'demo_' + Date.now();

  if (sb) {
    const saved = await saveOrder({
      user_id:    currentUser?.id,
      items:      cart,
      total:      amount,
      currency:   CONFIG.CURRENCY,
      status:     'pending',
      created_at: new Date().toISOString(),
    });
    if (saved) orderId = saved.id;
  }

  // ── Demo mode (no Razorpay key yet) ───────────────────────
  if (CONFIG.RAZORPAY_KEY_ID.includes('YOUR_KEY_ID')) {
    setTimeout(async () => {
      if (sb) await updateOrderStatus(orderId, { status: 'paid' });
      clearCart();
      toggleCart();
      showToast('🎉 Demo order placed! Add your Razorpay key for real payments.');
    }, 600);
    return;
  }

  // ── Real Razorpay checkout ────────────────────────────────
  const options = {
    key:         CONFIG.RAZORPAY_KEY_ID,
    amount:      amount * 100,             // paise
    currency:    CONFIG.CURRENCY,
    name:        CONFIG.STORE_NAME,
    description: `Order #${orderId}`,
    // NOTE: For production, generate order_id from your backend:
    // POST https://api.razorpay.com/v1/orders  →  set response.id here
    // order_id: '<razorpay_order_id_from_server>',

    prefill: {
      name:  currentUser?.user_metadata?.full_name || '',
      email: currentUser?.email || '',
    },

    theme: { color: '#1a1714' },

    handler: async function (response) {
      // ── Payment success ──────────────────────────────────
      if (sb) {
        await updateOrderStatus(orderId, {
          status:               'paid',
          razorpay_payment_id:  response.razorpay_payment_id,
          razorpay_order_id:    response.razorpay_order_id,
          razorpay_signature:   response.razorpay_signature,
        });
      }
      clearCart();
      toggleCart();
      showToast('🎉 Payment successful! Thank you for shopping with ' + CONFIG.STORE_NAME);
    },

    modal: {
      ondismiss: () => showToast('Payment was cancelled.'),
    },
  };

  const rzp = new Razorpay(options);

  rzp.on('payment.failed', async function (response) {
    if (sb) await updateOrderStatus(orderId, { status: 'failed' });
    showToast('Payment failed: ' + response.error.description);
  });

  rzp.open();
}
