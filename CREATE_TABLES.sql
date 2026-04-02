
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,              
  category TEXT,
  emoji TEXT,
  badge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  items JSONB NOT NULL,                
  total BIGINT NOT NULL,               
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending', 
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  razorpay_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);




ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  USING (true);


CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);


CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);


CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);

INSERT INTO products (name, description, price, category, emoji, badge) VALUES
  ('Artisan Leather Wallet', 'Full-grain vegetable-tanned leather. Slim profile, holds 8 cards.', 129900, 'Accessories', '👜', 'Bestseller'),
  ('Ceramic Pour-Over Set', 'Handcrafted matte ceramic dripper with matching server. For the ritual morning brew.', 249900, 'Kitchen', '☕', 'New'),
  ('Merino Wool Scarf', 'Extra-fine 17.5-micron merino. Naturally temperature-regulating, year-round.', 329900, 'Apparel', '🧣', NULL),
  ('Brass Desk Compass', 'Vintage-inspired solid brass. A reminder that direction matters.', 179900, 'Stationery', '🧭', 'Sale'),
  ('Linen Cushion Cover', 'Stone-washed European linen, naturally softened. 50×50cm.', 89900, 'Home', '🛋️', NULL),
  ('Cold-Press Notebook', '240 pages, acid-free cold-press paper. Fountain pen friendly.', 64900, 'Stationery', '📔', 'New'),
  ('Soy Wax Candle', 'Hand-poured, bergamot & cedarwood. 50-hour burn time.', 74900, 'Home', '🕯️', NULL),
  ('Cotton Canvas Tote', '12oz undyed organic canvas. Strong enough to carry everything.', 59900, 'Accessories', '🎒', NULL);

