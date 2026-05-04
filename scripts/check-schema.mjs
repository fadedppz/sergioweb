import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lztnjyqlrfbghckgmmkh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dG5qeXFscmZiZ2hja2dtbWtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzMyMDc3NSwiZXhwIjoyMDkyODk2Nzc1fQ.L2zqfxW90SOWZm8gBqKsKqeWVJH7hGDlt6qIjyvlpV0'
);

// Try inserting a test row with minimal columns to discover which ones exist
const testRow = {
  slug: 'test-row-delete-me',
  name: 'Test',
  description: 'test',
  price: 100,
  compare_price: null,
  category: 'bikes',
  stock_qty: 1,
  is_featured: false,
  is_active: true,
};

const { data, error } = await supabase.from('products').insert([testRow]).select();
console.log('Test insert result:', JSON.stringify(data, null, 2));
console.log('Test insert error:', error);

// Clean up
if (data && data[0]) {
  await supabase.from('products').delete().eq('id', data[0].id);
  console.log('Cleaned up test row. Columns available:', Object.keys(data[0]));
}
