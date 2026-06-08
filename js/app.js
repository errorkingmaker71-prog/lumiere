function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3200);
}


document.getElementById('auth-modal').addEventListener('click', function (e) {
  if (e.target === this) this.classList.remove('open');
});


document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.getElementById('auth-modal').classList.remove('open');
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('overlay').classList.remove('open');
  }
});


function isConfigured() {
  return (
    CONFIG.SUPABASE_URL && !CONFIG.SUPABASE_URL.includes('YOUR_PROJECT_ID') &&
    CONFIG.SUPABASE_ANON_KEY && !CONFIG.SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY') &&
    CONFIG.RAZORPAY_KEY_ID && !CONFIG.RAZORPAY_KEY_ID.includes('YOUR_KEY_ID')
  );
}

function updateSetupBanner() {
  const banner = document.getElementById('config-banner');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (isConfigured()) {
    banner.style.display = 'none';
    if (checkoutBtn) checkoutBtn.disabled = false;
  } else {
    banner.style.display = 'block';
    if (checkoutBtn) checkoutBtn.disabled = true;
  }
}

// ── Boot ─────────────────────────────────────────────────────
initSupabase();
loadProducts();
renderCart();
updateSetupBanner();
