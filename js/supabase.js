// ============================================================
//  js/supabase.js  —  Supabase client + helpers
// ============================================================

let sb = null;
let currentUser = null;

function initSupabase() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = CONFIG;

  if (SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
    console.warn('Supabase not configured — running in demo mode.');
    return;
  }

  const { createClient } = supabase;
  sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  sb.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    updateAuthUI();
  });

  sb.auth.getSession().then(({ data: { session } }) => {
    currentUser = session?.user || null;
    updateAuthUI();
  });
}

// ── Products ─────────────────────────────────────────────────
async function fetchProductsFromDB() {
  if (!sb) return null;
  const { data, error } = await sb.from('products').select('*').order('id');
  if (error) { console.error('Products fetch error:', error.message); return null; }
  return data;
}

// ── Orders ───────────────────────────────────────────────────
async function saveOrder(orderData) {
  if (!sb) return null;
  const { data, error } = await sb
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  if (error) { console.error('Order save error:', error.message); return null; }
  return data;
}

async function updateOrderStatus(orderId, updates) {
  if (!sb) return;
  await sb.from('orders').update(updates).eq('id', orderId);
}

async function fetchUserOrders() {
  if (!sb || !currentUser) return [];
  const { data, error } = await sb
    .from('orders')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data;
}
