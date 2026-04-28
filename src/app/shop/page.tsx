'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/Button';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';
type CategoryFilter = 'all' | 'bikes' | 'parts' | 'accessories';

export default function ShopPage() {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (category !== 'all') result = result.filter(p => p.category === category);
    if (inStockOnly) result = result.filter(p => p.stock_qty > 0);
    result = result.filter(p => p.price <= maxPrice);
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      default: result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }
    return result;
  }, [category, sortBy, inStockOnly, maxPrice]);

  const categories: { label: string; value: CategoryFilter; count: number }[] = [
    { label: 'All', value: 'all', count: products.length },
    { label: 'Bikes', value: 'bikes', count: products.filter(p => p.category === 'bikes').length },
    { label: 'Parts', value: 'parts', count: products.filter(p => p.category === 'parts').length },
    { label: 'Accessories', value: 'accessories', count: products.filter(p => p.category === 'accessories').length },
  ];

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />

      {/* Header */}
      <div className="relative py-16 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px" style={{ backgroundColor: 'var(--v-border-hover)' }} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-muted)' }}>Catalog</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-tight">
              <span className="font-serif-italic gradient-text">Browse</span>{' '}
              <span className="font-bold" style={{ color: 'var(--v-text)' }}>collection</span>
            </h1>
            <p className="text-sm mt-4 max-w-md" style={{ color: 'var(--v-text-muted)' }}>
              Surron electric motorcycles, performance upgrades, and riding accessories.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-24 sm:pb-32">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8 sm:mb-10 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-full overflow-x-auto" style={{ border: '1px solid var(--v-border)', backgroundColor: 'var(--v-bg-card)' }}>
            {categories.map((cat) => (
              <button key={cat.value} onClick={() => setCategory(cat.value)}
                className="px-4 sm:px-5 py-2 text-xs rounded-full transition-all duration-300 shrink-0"
                style={{
                  backgroundColor: category === cat.value ? 'var(--v-btn-primary-bg)' : 'transparent',
                  color: category === cat.value ? 'var(--v-btn-primary-text)' : 'var(--v-text-muted)',
                  fontWeight: category === cat.value ? 600 : 400,
                }}>
                {cat.label}
                <span className="ml-1.5 text-[9px] opacity-50">{cat.count}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-full px-4 py-2 text-xs focus:outline-none cursor-pointer"
              style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)', color: 'var(--v-text-secondary)' }}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="newest">Newest</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-full lg:hidden"
              style={{ border: '1px solid var(--v-border)', color: 'var(--v-text-muted)' }}>
              <SlidersHorizontal className="w-3.5 h-3.5" />Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8 lg:gap-10">
          {/* Sidebar */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: 'var(--v-text-muted)' }}>Availability</h4>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer accent-current" />
                  <span className="text-xs transition-colors" style={{ color: 'var(--v-text-muted)' }}>In stock only</span>
                </label>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: 'var(--v-text-muted)' }}>Max Price</h4>
                <input type="range" min={0} max={15000} step={100} value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full" />
                <div className="flex justify-between text-[10px] font-mono mt-2" style={{ color: 'var(--v-text-dim)' }}>
                  <span>$0</span><span>${maxPrice.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-[10px]" style={{ color: 'var(--v-text-dim)' }}>{filteredProducts.length} products</p>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-sm mb-2" style={{ color: 'var(--v-text-muted)' }}>No products match your filters</p>
                <button onClick={() => { setCategory('all'); setInStockOnly(false); setMaxPrice(15000); }}
                  className="text-xs underline" style={{ color: 'var(--v-text-secondary)' }}>Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--v-overlay)' }} onClick={() => setShowFilters(false)} />
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }}
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-6"
            style={{ backgroundColor: 'var(--v-bg-surface)', borderTop: '1px solid var(--v-border)' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--v-text)' }}>Filters</h3>
              <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" style={{ color: 'var(--v-text-muted)' }} /></button>
            </div>
            <div className="space-y-6">
              <label className="flex items-center gap-2.5">
                <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="w-4 h-4" />
                <span className="text-xs" style={{ color: 'var(--v-text-muted)' }}>In stock only</span>
              </label>
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--v-text-muted)' }}>Max Price</h4>
                <input type="range" min={0} max={15000} step={100} value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full" />
                <p className="text-xs font-mono mt-1" style={{ color: 'var(--v-text-muted)' }}>${maxPrice.toLocaleString()}</p>
              </div>
              <Button variant="primary" size="lg" className="w-full" onClick={() => setShowFilters(false)}>
                Show {filteredProducts.length} Results
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
