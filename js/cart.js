

let cart = JSON.parse(localStorage.getItem('lumiere_cart') || '[]');


function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  persistCart();
  showToast(`"${product.name}" added to bag`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  persistCart();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else persistCart();
}

function clearCart() {
  cart = [];
  persistCart();
}

function persistCart() {
  localStorage.setItem('lumiere_cart', JSON.stringify(cart));
  renderCart();
}


function cartTotal()  { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function cartCount()  { return cart.reduce((s, i) => s + i.qty, 0); }


function renderCart() {
  const count = cartCount();
  document.getElementById('cart-count').textContent = count;

  const total = cartTotal();
  const fmt   = v => '₹' + v.toLocaleString('en-IN');
  document.getElementById('cart-subtotal').textContent = fmt(total);
  document.getElementById('cart-total').textContent    = fmt(total);

  const checkoutBtn = document.getElementById('checkout-btn');
  checkoutBtn.disabled = cart.length === 0;
  if (typeof updateSetupBanner === 'function') updateSetupBanner();

  const container = document.getElementById('cart-items');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div style="font-size:2.5rem;margin-bottom:1rem">🛍️</div>
        <p>Your bag is empty.</p>
      </div>`;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji || '📦'}</div>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">${fmt(item.price * item.qty)}</p>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}


function toggleCart() {
  document.getElementById('cart-drawer').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}
