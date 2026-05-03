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
          <aside className="hidden lg:block w-64 shrink-0 pr-8 border-r" style={{ borderColor: 'var(--v-border)' }}>
            <div className="sticky top-24 space-y-10">
              {/* Category Links (Patagonia Style) */}
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: 'var(--v-text)' }}>Categories</h4>
                <ul className="space-y-3">
                  {categories.map((cat) => (
                    <li key={cat.value}>
                      <button
                        onClick={() => setCategory(cat.value)}
                        className={`text-sm transition-colors duration-200 flex items-center justify-between w-full group ${category === cat.value ? 'font-semibold' : ''}`}
                        style={{ color: category === cat.value ? 'var(--v-text)' : 'var(--v-text-muted)' }}
                      >
                        <span className="group-hover:text-[var(--v-text-secondary)]">{cat.label}</span>
                        <span className="text-[10px] opacity-60">({cat.count})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-px w-full" style={{ backgroundColor: 'var(--v-border-subtle)' }} />

              {/* Availability */}
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: 'var(--v-text)' }}>Availability</h4>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 rounded border transition-colors"
                    style={{ 
                      borderColor: inStockOnly ? '#00D4FF' : 'var(--v-border)',
                      backgroundColor: inStockOnly ? '#00D4FF' : 'transparent' 
                    }}>
                    <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="opacity-0 absolute inset-0 cursor-pointer" />
                    {inStockOnly && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-sm transition-colors" style={{ color: inStockOnly ? 'var(--v-text)' : 'var(--v-text-secondary)' }}>In stock only</span>
                </label>
              </div>

              <div className="h-px w-full" style={{ backgroundColor: 'var(--v-border-subtle)' }} />

              {/* Framer-Style Pricing Slider */}
              <div className="relative">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-6" style={{ color: 'var(--v-text)' }}>Price Range</h4>
                
                <div className="relative pt-4 pb-2">
                  <input 
                    type="range" 
                    min={0} max={15000} step={100} value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))} 
                    className="w-full absolute inset-0 opacity-0 z-10 cursor-pointer h-full" 
                  />
                  
                  {/* Custom Track */}
                  <div className="w-full h-1.5 rounded-full relative overflow-hidden" style={{ backgroundColor: 'var(--v-border)' }}>
                    <div 
                      className="absolute left-0 top-0 bottom-0 rounded-full"
                      style={{ 
                        width: `${(maxPrice / 15000) * 100}%`,
                        background: 'linear-gradient(90deg, #00D4FF 0%, #7B2FFF 100%)',
                        boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
                      }}
                    />
                  </div>
                  
                  {/* Custom Thumb */}
                  <div 
                    className="absolute top-1/2 -mt-2.5 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-gray-100 flex items-center justify-center transition-transform hover:scale-110 pointer-events-none"
                    style={{ 
                      left: `calc(${(maxPrice / 15000) * 100}% - 10px)`,
                      boxShadow: '0 0 15px rgba(123, 47, 255, 0.4)'
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#7B2FFF' }} />
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center p-4 rounded-xl" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border-subtle)' }}>
                  <span className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--v-text-muted)' }}>Max Price</span>
                  <span className="text-2xl font-mono font-bold tracking-tight" style={{ color: 'var(--v-text)' }}>
                    ${maxPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-[10px] mt-8" style={{ color: 'var(--v-text-dim)' }}>Showing {filteredProducts.length} results</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-6" style={{ color: 'var(--v-text)' }}>Price Range</h4>
                <div className="relative pt-4 pb-2">
                  <input 
                    type="range" 
                    min={0} max={15000} step={100} value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))} 
                    className="w-full absolute inset-0 opacity-0 z-10 cursor-pointer h-full" 
                  />
                  <div className="w-full h-1.5 rounded-full relative overflow-hidden" style={{ backgroundColor: 'var(--v-border)' }}>
                    <div 
                      className="absolute left-0 top-0 bottom-0 rounded-full"
                      style={{ 
                        width: `${(maxPrice / 15000) * 100}%`,
                        background: 'linear-gradient(90deg, #00D4FF 0%, #7B2FFF 100%)'
                      }}
                    />
                  </div>
                  <div 
                    className="absolute top-1/2 -mt-2.5 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-gray-100 flex items-center justify-center pointer-events-none"
                    style={{ left: `calc(${(maxPrice / 15000) * 100}% - 10px)` }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#7B2FFF' }} />
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <span className="text-xl font-mono font-bold" style={{ color: 'var(--v-text)' }}>${maxPrice.toLocaleString()}</span>
                </div>
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
