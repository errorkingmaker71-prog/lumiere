// ============================================================
//  js/products.js  —  Product data, fetch, render
// ============================================================

// Demo products — shown when Supabase is not yet configured
// Replace with real data via Supabase "products" table
const DEMO_PRODUCTS = [
  { id:1, name:'Artisan Leather Wallet',   description:'Full-grain vegetable-tanned leather. Slim profile, holds 8 cards.', price:1299, category:'Accessories', emoji:'👜', badge:'Bestseller' },
  { id:2, name:'Ceramic Pour-Over Set',    description:'Handcrafted matte ceramic dripper with matching server. For the ritual morning brew.', price:2499, category:'Kitchen',     emoji:'☕', badge:'New'        },
  { id:3, name:'Merino Wool Scarf',        description:'Extra-fine 17.5-micron merino. Naturally temperature-regulating, year-round.', price:3299, category:'Apparel',      emoji:'🧣', badge:null          },
  { id:4, name:'Brass Desk Compass',       description:'Vintage-inspired solid brass. A reminder that direction matters.', price:1799, category:'Stationery',  emoji:'🧭', badge:'Sale'       },
  { id:5, name:'Linen Cushion Cover',      description:'Stone-washed European linen, naturally softened. 50×50cm.',          price:899,  category:'Home',        emoji:'🛋️', badge:null          },
  { id:6, name:'Cold-Press Notebook',      description:'240 pages, acid-free cold-press paper. Fountain pen friendly.',       price:649,  category:'Stationery',  emoji:'📔', badge:'New'        },
  { id:7, name:'Soy Wax Candle',           description:'Hand-poured, bergamot & cedarwood. 50-hour burn time.',              price:749,  category:'Home',        emoji:'🕯️', badge:null          },
  { id:8, name:'Cotton Canvas Tote',       description:'12oz undyed organic canvas. Strong enough to carry everything.',      price:599,  category:'Accessories', emoji:'🎒', badge:null          },
];

async function loadProducts() {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '<div class="loading">Loading products…</div>';

  let products = DEMO_PRODUCTS;

  // Try Supabase if configured
  const dbProducts = await fetchProductsFromDB();
  if (dbProducts && dbProducts.length > 0) {
    products = dbProducts;
  }

  renderProducts(products);
}

function renderProducts(products) {
  const grid = document.getElementById('products-grid');

  if (!products || products.length === 0) {
    grid.innerHTML = '<p class="loading">No products found.</p>';
    return;
  }

  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="product-img">
        <span>${p.emoji || '📦'}</span>
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <p class="product-category">${p.category}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <span class="product-price">
            <span class="currency">₹</span>${Number(p.price).toLocaleString('en-IN')}
          </span>
          <button class="btn-add" onclick='addToCart(${JSON.stringify(p)})'>
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  `).join('');
}
