-- ============================================
-- Eclipse Electric — Full Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL)
-- ============================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 2. PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL CHECK (price >= 0), -- cents
  compare_price INTEGER CHECK (compare_price IS NULL OR compare_price >= 0),
  category TEXT NOT NULL CHECK (category IN ('bikes', 'parts', 'accessories')),
  stock_qty INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  specs JSONB DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  image_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;

-- ============================================
-- 3. PRODUCT VARIANTS
-- ============================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  price_delta INTEGER NOT NULL DEFAULT 0, -- cents, added to base price
  stock_qty INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);

-- ============================================
-- 4. ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0), -- cents
  discount INTEGER NOT NULL DEFAULT 0 CHECK (discount >= 0),
  shipping_cost INTEGER NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  tax INTEGER NOT NULL DEFAULT 0 CHECK (tax >= 0),
  total INTEGER NOT NULL CHECK (total >= 0), -- cents
  shipping_name TEXT NOT NULL,
  shipping_line1 TEXT NOT NULL,
  shipping_line2 TEXT DEFAULT '',
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_postal TEXT NOT NULL,
  shipping_country TEXT NOT NULL DEFAULT 'US',
  coupon_code TEXT DEFAULT NULL,
  stripe_session_id TEXT DEFAULT NULL,
  stripe_payment_intent TEXT DEFAULT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================
-- 5. ORDER ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL, -- snapshot at time of order
  variant_label TEXT DEFAULT '',
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0), -- cents
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================
-- 6. COUPONS
-- ============================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL CHECK (discount_value > 0), -- percentage (1-100) or cents
  min_order INTEGER DEFAULT 0, -- minimum order amount in cents
  max_uses INTEGER DEFAULT NULL, -- null = unlimited
  current_uses INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON coupons(code);

-- ============================================
-- 7. CONTACT SUBMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 8. SITE SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 9. ADMIN AUDIT LOG
-- ============================================
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL, -- e.g. 'product.create', 'order.update_status'
  target_type TEXT DEFAULT '', -- e.g. 'product', 'order'
  target_id TEXT DEFAULT '',
  details JSONB DEFAULT '{}',
  ip_address TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_admin ON admin_audit_logs(admin_id);
CREATE INDEX idx_audit_created ON admin_audit_logs(created_at DESC);
CREATE INDEX idx_audit_action ON admin_audit_logs(action);

-- ============================================
-- 10. INVOICES
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  invoice_number TEXT UNIQUE NOT NULL,
  subtotal INTEGER NOT NULL,
  discount INTEGER NOT NULL DEFAULT 0,
  tax INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'paid', 'void')),
  pdf_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_order ON invoices(order_id);
CREATE INDEX idx_invoices_user ON invoices(user_id);

-- ============================================
-- HELPER FUNCTION: Check if user is admin
-- ============================================
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile (non-role fields)"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));
  -- ^ prevents users from changing their own role

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (is_admin(auth.uid()));

-- PRODUCTS (public read, admin write)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can view all products"
  ON products FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (is_admin(auth.uid()));

-- PRODUCT VARIANTS (public read, admin write)
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view variants"
  ON product_variants FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage variants"
  ON product_variants FOR ALL
  USING (is_admin(auth.uid()));

-- ORDERS (user sees own, admin sees all)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE
  USING (is_admin(auth.uid()));

-- ORDER ITEMS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  USING (is_admin(auth.uid()));

-- COUPONS (admin only for management, public read for validation)
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons by code"
  ON coupons FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can manage coupons"
  ON coupons FOR ALL
  USING (is_admin(auth.uid()));

-- CONTACT SUBMISSIONS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admins can view contact submissions"
  ON contact_submissions FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update contact submissions"
  ON contact_submissions FOR UPDATE
  USING (is_admin(auth.uid()));

-- SITE SETTINGS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings"
  ON site_settings FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage settings"
  ON site_settings FOR ALL
  USING (is_admin(auth.uid()));

-- ADMIN AUDIT LOGS (admin read-only, insert via service role)
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON admin_audit_logs FOR SELECT
  USING (is_admin(auth.uid()));

-- INVOICES
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage invoices"
  ON invoices FOR ALL
  USING (is_admin(auth.uid()));

-- ============================================
-- SEED DATA: Products
-- All prices in cents (e.g. 429900 = $4,299)
-- ============================================
INSERT INTO products (slug, name, description, price, compare_price, category, stock_qty, specs, is_featured, image_urls) VALUES
('surron-light-bee-x', 'Surron Light Bee X', 'The ultimate lightweight electric off-road machine. The Light Bee X delivers explosive power from its 6kW mid-drive motor, paired with a 60V 34Ah battery for extended trail sessions. Weighing just 125 lbs, it handles like a mountain bike but hits like a motorcycle. Perfect for trails, enduro, and urban shredding.', 429900, 479900, 'bikes', 12, '{"Motor":"6kW mid-drive (peak 10kW)","Battery":"60V 34Ah Panasonic cells","Top Speed":"47 mph (75 km/h)","Range":"40-60 miles (trail dependent)","Weight":"125 lbs (57 kg)","Frame":"6061 Aluminum alloy","Suspension Front":"Inverted hydraulic fork, 203mm travel","Suspension Rear":"Adjustable mono-shock, 203mm travel","Brakes":"Hydraulic disc, 203mm rotors F/R","Tires":"19\" front / 18\" rear, off-road knobby","Charge Time":"3.5 hours (standard charger)","Display":"LCD with speed, battery, trip data","Drive":"Chain drive, steel sprocket","Seat Height":"33.4 inches"}', TRUE, '{}'),
('surron-storm-bee', 'Surron Storm Bee', 'Full-size electric enduro beast. The Storm Bee is Surron''s flagship — a highway-capable electric motorcycle with a liquid-cooled 22.5kW motor, massive 104V 55Ah battery, and full-size dirt bike chassis.', 1199900, 1349900, 'bikes', 4, '{"Motor":"22.5kW liquid-cooled mid-drive","Battery":"104V 55Ah high-density pack","Top Speed":"75 mph (120 km/h)","Range":"60-80 miles","Weight":"280 lbs (127 kg)","Frame":"Chromoly steel, full-size MX geometry","Cooling":"Liquid-cooled with radiator"}', TRUE, '{}'),
('surron-light-bee-s', 'Surron Light Bee S', 'Street-legal electric motorcycle built for urban warriors. The Light Bee S takes everything great about the LBX and adds DOT-approved lighting, mirrors, turn signals, and a license plate bracket.', 379900, NULL, 'bikes', 8, '{"Motor":"6kW mid-drive (peak 10kW)","Battery":"60V 34Ah Panasonic cells","Top Speed":"45 mph (limited for street legal)","Range":"40-55 miles","Weight":"130 lbs (59 kg)","Registration":"Street legal in most US states"}', FALSE, '{}'),
('surron-ultra-bee', 'Surron Ultra Bee', 'The sweet spot — mid-size electric power meets agile handling. The Ultra Bee bridges the gap between the nimble Light Bee and the full-size Storm Bee with a 74V 60Ah battery system pushing 12.5kW continuous.', 849900, 949900, 'bikes', 6, '{"Motor":"12.5kW continuous / 18kW peak","Battery":"74V 60Ah high-density pack","Top Speed":"59 mph (95 km/h)","Range":"50-75 miles","Weight":"195 lbs (88 kg)","Ride Modes":"Eco, Sport, Turbo"}', TRUE, '{}'),
('surron-storm-bee-rs', 'Surron Storm Bee RS', 'The next evolution. Coming soon — the Storm Bee RS pushes everything to the limit with an upgraded 25kW motor, race-tuned suspension, carbon fiber components, and an aggressive competition-ready chassis.', 1349900, NULL, 'bikes', 0, '{"Motor":"25kW liquid-cooled (estimated)","Battery":"104V 65Ah race-spec pack","Top Speed":"85+ mph (estimated)","Status":"PRE-ORDER — Shipping Q3 2025"}', TRUE, '{}'),
('surron-lbx-upgraded-battery-60v-40ah', 'Surron LBX Upgraded Battery 60V 40Ah', 'Drop-in battery upgrade for Light Bee X/S. 18% more capacity than stock with premium Samsung 40T cells.', 89900, 109900, 'parts', 20, '{"Voltage":"60V nominal","Capacity":"40Ah (2.4kWh)","Cells":"Samsung 40T 21700","Compatibility":"Light Bee X, Light Bee S","Installation":"Plug-and-play, 15 min","Warranty":"2 years"}', FALSE, '{}'),
('surron-lbx-rear-suspension-upgrade', 'Surron LBX Rear Suspension Upgrade', 'Race-tuned rear shock upgrade for the Light Bee platform. Fully adjustable rebound, compression, and preload.', 34900, NULL, 'parts', 15, '{"Type":"Nitrogen-charged reservoir shock","Adjustments":"Rebound, compression, preload","Travel":"203mm","Compatibility":"Light Bee X, Light Bee S"}', FALSE, '{}'),
('surron-lbx-handguard-set', 'Surron LBX Handguard Set', 'Full-wrap aluminum handguards with integrated wind deflectors. Protect your levers and hands from branches, rocks, and crashes.', 8900, NULL, 'parts', 30, '{"Material":"6061 Aluminum bar + polycarbonate shield","Color":"Black anodized","Compatibility":"Light Bee X, Light Bee S, Ultra Bee"}', FALSE, '{}'),
('surron-storm-bee-exhaust-guard', 'Surron Storm Bee Exhaust Guard', 'CNC machined aluminum motor/controller guard for the Storm Bee. Protects critical components from rock strikes and impacts.', 12900, NULL, 'parts', 18, '{"Material":"6061-T6 Aluminum, 4mm thick","Finish":"Black anodized","Compatibility":"Storm Bee, Storm Bee RS"}', FALSE, '{}'),
('surron-lbx-performance-controller', 'Surron LBX Performance Controller', 'Unlock the full potential of your Light Bee. This upgraded sine-wave controller replaces the stock unit to deliver smoother power delivery.', 44900, 54900, 'parts', 10, '{"Type":"Sine-wave FOC controller","Max Current":"100A continuous / 150A peak","Features":"Bluetooth programmable, regenerative braking","Ride Modes":"3 programmable modes via app","Compatibility":"Light Bee X, Light Bee S"}', TRUE, '{}'),
('surron-lbx-led-headlight-upgrade', 'Surron LBX LED Headlight Upgrade', 'Ultra-bright LED headlight module with high/low beam and DRL mode. 4000 lumens with precision optics.', 14900, NULL, 'parts', 25, '{"Lumens":"4000 (high beam)","Color Temp":"6000K daylight white","Modes":"High, Low, DRL","Compatibility":"Light Bee X, Light Bee S"}', FALSE, '{}'),
('surron-chain-sprocket-kit', 'Surron Chain & Sprocket Kit', 'Complete drivetrain refresh kit. Premium O-ring chain with hardened steel sprockets for extended life.', 19900, NULL, 'parts', 22, '{"Chain":"420 O-ring, 120 links","Compatibility":"Light Bee X, Light Bee S"}', FALSE, '{}'),
('surron-branded-helmet', 'Surron Branded Helmet', 'DOT and ECE certified full-face helmet with Surron branding. Lightweight composite shell with premium EPS liner.', 24900, 29900, 'accessories', 35, '{"Certification":"DOT + ECE 22.06","Shell":"Fiberglass composite","Sizes":"XS, S, M, L, XL","Visor":"Clear + tinted included"}', FALSE, '{}'),
('riding-gloves', 'Riding Gloves', 'Premium touchscreen-compatible riding gloves with knuckle protection and reinforced palm.', 5900, NULL, 'accessories', 50, '{"Material":"Synthetic leather palm, mesh upper","Protection":"TPU knuckle guard, foam padding","Sizes":"S, M, L, XL"}', FALSE, '{}'),
('battery-charger-60v-10a', 'Battery Charger 60V 10A', 'Fast charger for all 60V Surron models. Cuts charge time in half compared to the stock 5A charger.', 17900, NULL, 'accessories', 18, '{"Output":"67.2V 10A","Input":"110-240V AC (worldwide compatible)","Charge Time":"~2 hours (from empty)"}', FALSE, '{}'),
('phone-mount', 'Phone Mount', 'Vibration-dampened phone mount for handlebars. Fits all phones up to 6.7".', 3900, NULL, 'accessories', 40, '{"Compatibility":"All phones up to 6.7\"","Material":"CNC aluminum + rubber dampeners","Rotation":"360° adjustable"}', FALSE, '{}'),
('security-cable-lock', 'Security Cable Lock', 'Heavy-duty braided steel cable lock with combination dial. 6ft reach.', 4900, NULL, 'accessories', 30, '{"Material":"Braided steel cable, vinyl coated","Length":"6 ft (1.8m)","Lock Type":"4-digit resettable combination"}', FALSE, '{}');

-- Seed variants for products that have them
INSERT INTO product_variants (product_id, label, price_delta, stock_qty)
SELECT p.id, v.label, v.price_delta, v.stock_qty
FROM products p
CROSS JOIN LATERAL (
  VALUES
    ('Stealth Black', 0, 5),
    ('Electric Blue', 0, 4),
    ('Neon Green', 10000, 3)
) AS v(label, price_delta, stock_qty)
WHERE p.slug = 'surron-light-bee-x';

INSERT INTO product_variants (product_id, label, price_delta, stock_qty)
SELECT p.id, v.label, v.price_delta, v.stock_qty
FROM products p
CROSS JOIN LATERAL (
  VALUES ('Matte Black', 0, 2), ('Racing Red', 20000, 2)
) AS v(label, price_delta, stock_qty)
WHERE p.slug = 'surron-storm-bee';

INSERT INTO product_variants (product_id, label, price_delta, stock_qty)
SELECT p.id, v.label, v.price_delta, v.stock_qty
FROM products p
CROSS JOIN LATERAL (
  VALUES ('Gloss Black', 0, 4), ('Silver', 0, 4)
) AS v(label, price_delta, stock_qty)
WHERE p.slug = 'surron-light-bee-s';

INSERT INTO product_variants (product_id, label, price_delta, stock_qty)
SELECT p.id, v.label, v.price_delta, v.stock_qty
FROM products p
CROSS JOIN LATERAL (
  VALUES ('Midnight Black', 0, 3), ('Arctic White', 0, 3)
) AS v(label, price_delta, stock_qty)
WHERE p.slug = 'surron-ultra-bee';

INSERT INTO product_variants (product_id, label, price_delta, stock_qty)
SELECT p.id, 'Race Black', 0, 0
FROM products p
WHERE p.slug = 'surron-storm-bee-rs';

INSERT INTO product_variants (product_id, label, price_delta, stock_qty)
SELECT p.id, v.label, v.price_delta, v.stock_qty
FROM products p
CROSS JOIN LATERAL (
  VALUES ('XS', 0, 5), ('S', 0, 7), ('M', 0, 10), ('L', 0, 8), ('XL', 0, 5)
) AS v(label, price_delta, stock_qty)
WHERE p.slug = 'surron-branded-helmet';

INSERT INTO product_variants (product_id, label, price_delta, stock_qty)
SELECT p.id, v.label, v.price_delta, v.stock_qty
FROM products p
CROSS JOIN LATERAL (
  VALUES ('S', 0, 12), ('M', 0, 15), ('L', 0, 13), ('XL', 0, 10)
) AS v(label, price_delta, stock_qty)
WHERE p.slug = 'riding-gloves';

-- Seed default settings
INSERT INTO site_settings (key, value) VALUES
('store_name', 'Eclipse Electric'),
('store_email', 'tesertar@gmail.com'),
('store_phone', ''),
('shipping_policy', 'Free shipping on all orders over $500. Standard shipping 3-7 business days.'),
('return_policy', '30-day returns on unopened parts and accessories. Bikes must be inspected within 48 hours of delivery.'),
('notification_email', 'tesertar@gmail.com');
