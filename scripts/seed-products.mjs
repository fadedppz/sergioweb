/**
 * Seed Script — Inserts all products into the Supabase 'products' table.
 * Run with: node scripts/seed-products.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lztnjyqlrfbghckgmmkh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dG5qeXFscmZiZ2hja2dtbWtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzMyMDc3NSwiZXhwIjoyMDkyODk2Nzc1fQ.L2zqfxW90SOWZm8gBqKsKqeWVJH7hGDlt6qIjyvlpV0'
);

const products = [
  { slug: 'altis-sigma2026', name: 'Altis Sigma2026', description: 'Premium electric dirt bike by Altis with cutting edge technology and superior handling.', price: 4500, compare_price: null, category: 'bikes', stock_qty: 10, specs: { Brand: 'Altis', Model: 'Sigma2026' }, is_featured: true, is_active: true },
  { slug: 'altis-delta', name: 'Altis Delta', description: 'High performance electric motorcycle for extreme trails.', price: 4800, compare_price: 5200, category: 'bikes', stock_qty: 5, specs: { Brand: 'Altis', Model: 'Delta' }, is_featured: false, is_active: true },
  { slug: 'surron-hyper-bee', name: 'Surron Hyper Bee', description: 'The newest addition to the Surron lineup, built for agility and torque.', price: 5500, compare_price: null, category: 'bikes', stock_qty: 8, specs: { Brand: 'Surron', Model: 'Hyper Bee' }, is_featured: true, is_active: true },
  { slug: 'surron-light-bee-x-2025', name: 'Surron Light Bee X 2025', description: 'The updated legendary Light Bee X. The ultimate lightweight electric off-road machine.', price: 4299, compare_price: 4799, category: 'bikes', stock_qty: 12, specs: { Brand: 'Surron', Model: 'Light Bee X 2025' }, is_featured: true, is_active: true },
  { slug: 'surron-ultra-bee-2025', name: 'Surron Ultra Bee 2025', description: 'Mid-size electric power meets agile handling. The updated Ultra Bee for 2025.', price: 8499, compare_price: 9499, category: 'bikes', stock_qty: 6, specs: { Brand: 'Surron', Model: 'Ultra Bee 2025' }, is_featured: true, is_active: true },
  { slug: 'talaria-xxx-pro-l1e', name: 'Talaria XXX Pro L1e', description: 'Street legal and agile electric motorbike for the urban commute and trails.', price: 3800, compare_price: null, category: 'bikes', stock_qty: 10, specs: { Brand: 'Talaria', Model: 'XXX Pro L1e' }, is_featured: false, is_active: true },
  { slug: 'talaria-mx5-pro', name: 'Talaria MX5 Pro', description: 'Ultimate power and suspension in the Talaria lineup.', price: 4900, compare_price: 5200, category: 'bikes', stock_qty: 7, specs: { Brand: 'Talaria', Model: 'MX5 Pro' }, is_featured: true, is_active: true },
  { slug: 'talaria-mx5-pro-l1e', name: 'Talaria MX5 Pro L1e', description: 'Street legal version of the powerful MX5.', price: 5100, compare_price: null, category: 'bikes', stock_qty: 5, specs: { Brand: 'Talaria', Model: 'MX5 Pro L1e' }, is_featured: false, is_active: true },
  { slug: 'talaria-komodo', name: 'Talaria Komodo', description: 'Heavy duty electric motorcycle for the most demanding riders.', price: 6500, compare_price: null, category: 'bikes', stock_qty: 4, specs: { Brand: 'Talaria', Model: 'Komodo' }, is_featured: false, is_active: true },
  { slug: 'talaria-komodo-l3e', name: 'Talaria Komodo L3e', description: 'Homologated L3e version of the Talaria Komodo.', price: 6800, compare_price: null, category: 'bikes', stock_qty: 3, specs: { Brand: 'Talaria', Model: 'Komodo L3e' }, is_featured: false, is_active: true },
  { slug: 'vtb-v1-plus', name: 'VTB V1+', description: 'Next gen electric motorcycle from VTB.', price: 4100, compare_price: null, category: 'bikes', stock_qty: 15, specs: { Brand: 'VTB', Model: 'V1+' }, is_featured: false, is_active: true },
  { slug: 'arctic-clouded-leopard-xe-pro-s', name: 'Arctic Clouded Leopard XE Pro S', description: 'Exceptional build quality and smooth ride from Arctic.', price: 5200, compare_price: null, category: 'bikes', stock_qty: 6, specs: { Brand: 'Arctic', Model: 'Clouded Leopard XE Pro S' }, is_featured: false, is_active: true },
  { slug: 'rerode-r1-plus', name: 'Rerode R1+', description: 'Lightweight electric dirt bike designed for maximum fun.', price: 3900, compare_price: 4200, category: 'bikes', stock_qty: 12, specs: { Brand: 'Rerode', Model: 'R1+' }, is_featured: false, is_active: true },
  { slug: '79bike-falcon-pro', name: '79bike Falcon-Pro', description: 'Sleek design and thrilling performance in the 79bike Falcon-Pro.', price: 4300, compare_price: null, category: 'bikes', stock_qty: 9, specs: { Brand: '79bike', Model: 'Falcon-Pro' }, is_featured: true, is_active: true },
  { slug: '79bike-gt', name: '79bike GT', description: 'Grand touring style electric motorbike for long range comfort.', price: 4700, compare_price: null, category: 'bikes', stock_qty: 8, specs: { Brand: '79bike', Model: 'GT' }, is_featured: false, is_active: true },
];

async function seed() {
  console.log('🔄 Clearing existing products...');
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('❌ Failed to clear products:', deleteError.message);
    return;
  }

  console.log(`📦 Inserting ${products.length} products...`);
  const { data, error } = await supabase.from('products').insert(products).select();

  if (error) {
    console.error('❌ Insert failed:', error.message);
  } else {
    console.log(`✅ Successfully seeded ${data.length} products into Supabase!`);
    data.forEach((p) => console.log(`   • ${p.name} — $${p.price}`));
  }
}

seed();
