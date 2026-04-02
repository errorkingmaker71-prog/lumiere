# LUMIÈRE — E-Commerce Website

A full-featured e-commerce frontend built with **HTML, CSS, JavaScript**, **Supabase** (backend + auth) and **Razorpay** (payments).

---

## 📁 Project Structure

```
lumiere/
├── index.html            ← Main storefront
├── css/
│   └── style.css         ← All styles
├── js/
│   ├── config.js         ← ⚙️  YOUR CREDENTIALS GO HERE
│   ├── supabase.js       ← Supabase client + DB helpers
│   ├── cart.js           ← Cart state & render
│   ├── auth.js           ← Sign in / Sign up
│   ├── products.js       ← Product fetch & render
│   ├── checkout.js       ← Razorpay payment flow
│   └── app.js            ← App initialisation
└── pages/
    └── orders.html       ← User order history
```

---

## ⚙️ Step 1 — Add Your Credentials

Open **`js/config.js`** and replace the placeholder values:

```js
const CONFIG = {
  SUPABASE_URL:      'https://YOUR_PROJECT_ID.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY',
  RAZORPAY_KEY_ID:   'rzp_test_YOUR_KEY_ID',
  STORE_NAME: 'LUMIÈRE',
  CURRENCY:   'INR',
};
```

---

## 🗄️ Step 2 — Supabase Setup

1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. Go to **Project Settings → API** to get your URL and anon key.
3. In the **SQL Editor**, run the following:

```sql
-- Products table
create table products (
  id          bigserial primary key,
  name        text not null,
  description text,
  price       numeric not null,
  category    text,
  emoji       text,
  badge       text,
  stock       int default 100,
  created_at  timestamptz default now()
);

-- Orders table
create table orders (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid references auth.users(id),
  items                jsonb,
  total                numeric,
  currency             text default 'INR',
  status               text default 'pending',
  razorpay_payment_id  text,
  razorpay_order_id    text,
  razorpay_signature   text,
  created_at           timestamptz default now()
);

-- RLS policies
alter table products enable row level security;
alter table orders   enable row level security;

create policy "Products are public" on products for select using (true);
create policy "Users can insert orders"  on orders for insert with check (auth.uid() = user_id);
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Service can update orders" on orders for update using (true);
```

4. Insert sample products (optional):

```sql
insert into products (name, description, price, category, emoji, badge) values
  ('Artisan Leather Wallet', 'Full-grain vegetable-tanned leather. Slim profile, holds 8 cards.', 1299, 'Accessories', '👜', 'Bestseller'),
  ('Ceramic Pour-Over Set', 'Handcrafted matte ceramic dripper with matching server.', 2499, 'Kitchen', '☕', 'New'),
  ('Merino Wool Scarf', 'Extra-fine 17.5-micron merino. Naturally temperature-regulating.', 3299, 'Apparel', '🧣', null),
  ('Brass Desk Compass', 'Vintage-inspired solid brass. A reminder that direction matters.', 1799, 'Stationery', '🧭', 'Sale');
```

5. Enable **Email Auth** under Authentication → Providers.

---

## 💳 Step 3 — Razorpay Setup

1. Sign up at [https://razorpay.com](https://razorpay.com).
2. Go to **Settings → API Keys** and generate a test key.
3. Paste the **Key ID** into `js/config.js`.

> **For production**, you must create Razorpay orders server-side (Node.js / Python / etc.) and pass the returned `order_id` to the frontend options in `js/checkout.js`. This prevents amount tampering.

---

## 🚀 Step 4 — Run Locally

### Option A — VS Code Live Server (recommended)
1. Install the **Live Server** extension in VS Code.
2. Right-click `index.html` → **Open with Live Server**.

### Option B — Python
```bash
python -m http.server 3000
# Open http://localhost:3000
```

### Option C — Node.js
```bash
npx serve .
```

---

## ✅ Features

- [x] Product grid (Supabase or demo data)
- [x] Cart with quantity controls (persisted in localStorage)
- [x] Slide-in cart drawer
- [x] Sign In / Sign Up via Supabase Auth
- [x] Razorpay checkout with order saved to Supabase
- [x] Payment success / failure handling
- [x] Order history page
- [x] Demo mode when credentials not yet configured
- [x] Fully responsive (mobile-friendly)
- [x] Keyboard accessible (Escape closes modals)

---

## 🔒 Notes

- The `anon` key is safe to use in frontend code — Supabase RLS policies protect your data.
- Never expose your Razorpay **Secret Key** in frontend code. Only the **Key ID** goes here.
- For production payments, add a backend to create Razorpay orders and verify signatures.
