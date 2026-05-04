'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Loader2, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string; slug: string; name: string; description: string; price: number; compare_price: number | null;
  stock_qty: number; category: string; is_featured: boolean; is_active: boolean; created_at: string;
  image_urls: string[]; specs: Record<string, string>;
}

const emptyProduct: Omit<Product, 'id' | 'created_at'> = {
  slug: '', name: '', description: '', price: 0, compare_price: null,
  stock_qty: 0, category: 'bikes', is_featured: false, is_active: true,
  image_urls: [], specs: {},
};

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts((data as Product[]) || []);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from('products').update({ is_active: !current }).eq('id', id);
    fetchProducts();
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const supabase = createClient();
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const openAddModal = () => {
    setEditing(null);
    setForm(emptyProduct);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditing(product);
    setForm({
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      compare_price: product.compare_price,
      stock_qty: product.stock_qty,
      category: product.category,
      is_featured: product.is_featured,
      is_active: product.is_active,
      image_urls: product.image_urls || [],
      specs: product.specs || {},
    });
    setErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (form.price <= 0) e.price = 'Price must be greater than 0';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.description.trim().length < 20) e.description = 'Description should be at least 20 characters for a professional listing';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);

    try {
      const supabase = createClient();
      const slug = form.slug || generateSlug(form.name);

      const payload = {
        slug,
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        compare_price: form.compare_price ? Number(form.compare_price) : null,
        stock_qty: Number(form.stock_qty),
        category: form.category,
        is_featured: form.is_featured,
        is_active: form.is_active,
        image_urls: form.image_urls,
        specs: form.specs,
      };

      if (editing) {
        const { error } = await supabase.from('products').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error('Save failed:', err);
      setErrors(prev => ({ ...prev, save: err.message || 'Failed to save product. Check console for details.' }));
    } finally {
      setSaving(false);
    }
  };

  const addSpec = () => {
    if (!specKey.trim()) return;
    setForm(prev => ({ ...prev, specs: { ...prev.specs, [specKey.trim()]: specVal.trim() } }));
    setSpecKey('');
    setSpecVal('');
  };

  const removeSpec = (key: string) => {
    setForm(prev => {
      const newSpecs = { ...prev.specs };
      delete newSpecs[key];
      return { ...prev, specs: newSpecs };
    });
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase())
  );

  const inputStyles: React.CSSProperties = {
    backgroundColor: 'var(--v-input-bg)', border: '1px solid var(--v-border)', color: 'var(--v-text)',
  };

  if (loading) return <div className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Loading products...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-xl font-bold" style={{ color: 'var(--v-text)' }}>Products ({products.length})</h1>
        <Button variant="glassy" size="sm" onClick={openAddModal}>
          <Plus className="w-3 h-3" /> Add Product
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--v-text-dim)' }} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none"
          style={inputStyles} />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--v-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--v-border)', backgroundColor: 'var(--v-bg-card)' }}>
                <th className="text-left px-4 py-3 font-medium uppercase tracking-wider" style={{ color: 'var(--v-text-muted)' }}>Product</th>
                <th className="text-left px-4 py-3 font-medium uppercase tracking-wider" style={{ color: 'var(--v-text-muted)' }}>Category</th>
                <th className="text-right px-4 py-3 font-medium uppercase tracking-wider" style={{ color: 'var(--v-text-muted)' }}>Price</th>
                <th className="text-right px-4 py-3 font-medium uppercase tracking-wider" style={{ color: 'var(--v-text-muted)' }}>Stock</th>
                <th className="text-center px-4 py-3 font-medium uppercase tracking-wider" style={{ color: 'var(--v-text-muted)' }}>Status</th>
                <th className="text-right px-4 py-3 font-medium uppercase tracking-wider" style={{ color: 'var(--v-text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--v-border)' }} className="transition-colors hover:bg-[var(--v-bg-card)]">
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: 'var(--v-text)' }}>{product.name}</p>
                    <p className="text-[10px] font-mono" style={{ color: 'var(--v-text-dim)' }}>{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 capitalize" style={{ color: 'var(--v-text-muted)' }}>{product.category}</td>
                  <td className="px-4 py-3 text-right font-mono" style={{ color: 'var(--v-text)' }}>
                    ${product.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-mono ${product.stock_qty === 0 ? 'text-red-400' : product.stock_qty < 5 ? 'text-amber-400' : ''}`}
                      style={{ color: product.stock_qty >= 5 ? 'var(--v-text-secondary)' : undefined }}>
                      {product.stock_qty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleActive(product.id, product.is_active)}
                      className="px-2 py-0.5 rounded-full text-[9px] font-semibold transition-colors cursor-pointer"
                      style={{
                        backgroundColor: product.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: product.is_active ? '#10b981' : '#ef4444',
                      }}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(product)} className="p-1.5 rounded-lg transition-colors hover:bg-[var(--v-bg-card)]" style={{ color: 'var(--v-text-muted)' }}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteProduct(product.id, product.name)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(239,68,68,0.1)]" style={{ color: 'var(--v-text-dim)' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════
          PRODUCT EDITOR MODAL
          ═══════════════════════════════════ */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl"
              style={{ backgroundColor: 'var(--v-bg-surface)', border: '1px solid var(--v-border)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold tracking-wide" style={{ color: 'var(--v-text)' }}>
                  {editing ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-2 rounded-full hover:bg-[var(--v-bg-card)]" style={{ color: 'var(--v-text-dim)' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Product Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => { setForm(prev => ({ ...prev, name: e.target.value, slug: generateSlug(e.target.value) })); setErrors(prev => ({ ...prev, name: '' })); }}
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                    style={errors.name ? { ...inputStyles, border: '1px solid rgba(239,68,68,0.5)' } : inputStyles}
                    placeholder="e.g. Surron Light Bee X Pro"
                  />
                  {errors.name && <p className="text-[11px] mt-1 ml-1 text-red-400">{errors.name}</p>}
                  {form.slug && <p className="text-[10px] mt-1 ml-1 font-mono" style={{ color: 'var(--v-text-dim)' }}>Slug: {form.slug}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Description *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => { setForm(prev => ({ ...prev, description: e.target.value })); setErrors(prev => ({ ...prev, description: '' })); }}
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-y min-h-[120px]"
                    style={errors.description ? { ...inputStyles, border: '1px solid rgba(239,68,68,0.5)' } : inputStyles}
                    placeholder="Write a detailed, professional product description. This will be displayed on the store and homepage."
                  />
                  {errors.description && <p className="text-[11px] mt-1 ml-1 text-red-400">{errors.description}</p>}
                  <p className="text-[10px] mt-1 ml-1" style={{ color: 'var(--v-text-dim)' }}>{form.description.length} characters</p>
                </div>

                {/* Price & Compare Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Price ($) *</label>
                    <input
                      type="number" min="0" step="1"
                      value={form.price || ''}
                      onChange={(e) => { setForm(prev => ({ ...prev, price: Number(e.target.value) })); setErrors(prev => ({ ...prev, price: '' })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                      style={errors.price ? { ...inputStyles, border: '1px solid rgba(239,68,68,0.5)' } : inputStyles}
                      placeholder="4299"
                    />
                    {errors.price && <p className="text-[11px] mt-1 ml-1 text-red-400">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Compare Price ($)</label>
                    <input
                      type="number" min="0" step="1"
                      value={form.compare_price || ''}
                      onChange={(e) => setForm(prev => ({ ...prev, compare_price: e.target.value ? Number(e.target.value) : null }))}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                      style={inputStyles}
                      placeholder="4799 (optional, shows as strikethrough)"
                    />
                  </div>
                </div>

                {/* Category & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none appearance-none"
                      style={inputStyles}
                    >
                      <option value="bikes">Bikes</option>
                      <option value="parts">Parts & Upgrades</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Stock Qty</label>
                    <input
                      type="number" min="0"
                      value={form.stock_qty}
                      onChange={(e) => setForm(prev => ({ ...prev, stock_qty: Number(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                      style={inputStyles}
                      placeholder="12"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="w-4 h-4 rounded accent-[#00D4FF]" />
                    <span className="text-xs" style={{ color: 'var(--v-text-secondary)' }}>Featured on homepage</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_active} onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 rounded accent-[#10b981]" />
                    <span className="text-xs" style={{ color: 'var(--v-text-secondary)' }}>Active (visible in store)</span>
                  </label>
                </div>

                {/* Specs Editor */}
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 block" style={{ color: 'var(--v-text-muted)' }}>Specifications</label>
                  <div className="space-y-2 mb-3">
                    {Object.entries(form.specs).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
                        <span className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--v-text)' }}>{key}:</span>
                        <span className="text-xs flex-1 truncate" style={{ color: 'var(--v-text-muted)' }}>{val}</span>
                        <button onClick={() => removeSpec(key)} className="text-red-400 hover:text-red-300 shrink-0">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="Key (e.g. Motor)"
                      className="flex-1 px-3 py-2 rounded-lg text-xs focus:outline-none" style={inputStyles} />
                    <input value={specVal} onChange={(e) => setSpecVal(e.target.value)} placeholder="Value (e.g. 6kW mid-drive)"
                      className="flex-1 px-3 py-2 rounded-lg text-xs focus:outline-none" style={inputStyles}
                      onKeyDown={(e) => e.key === 'Enter' && addSpec()} />
                    <button onClick={addSpec} className="px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                      style={{ backgroundColor: 'var(--v-bg-card)', color: '#00D4FF', border: '1px solid var(--v-border)' }}>
                      Add
                    </button>
                  </div>
                </div>

                {/* Save Error */}
                {errors.save && <p className="text-[11px] text-red-400 text-center py-2">{errors.save}</p>}

                {/* Save Button */}
                <div className="flex items-center justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--v-border)' }}>
                  <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl text-xs font-medium transition-colors"
                    style={{ color: 'var(--v-text-muted)' }}>
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all hover:scale-105 disabled:opacity-50"
                    style={{ backgroundColor: '#00D4FF', color: '#000' }}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : (editing ? 'Update Product' : 'Create Product')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
