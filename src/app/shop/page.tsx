'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/shop/ProductCard';

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
    <div className="pt-16 min-h-screen">
      {/* Vignette */}
      <div className="vignette-glow" />

      {/* Header */}
      <div className="relative py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-white/10" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-medium">Catalog</span>
            </div>
            <h1 className="text-5xl sm:text-6xl leading-tight">
              <span className="font-serif-italic gradient-text">Browse</span>{' '}
              <span className="font-bold text-white">collection</span>
            </h1>
            <p className="text-sm text-white/40 mt-4 max-w-md">
              Surron electric motorcycles, performance upgrades, and riding accessories.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-32">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-10 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-full border border-white/[0.04] bg-white/[0.01]">
            {categories.map((cat) => (
              <button key={cat.value} onClick={() => setCategory(cat.value)}
                className={`px-5 py-2 text-xs rounded-full transition-all duration-300 ${
                  category === cat.value
                    ? 'bg-white text-black font-semibold'
                    : 'text-white/40 hover:text-white/70'
                }`}>
                {cat.label}
                <span className="ml-1.5 text-[9px] opacity-50">{cat.count}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-white/[0.02] border border-white/[0.04] rounded-full px-4 py-2 text-xs text-white/60 focus:outline-none cursor-pointer">
              <option value="featured">Featured</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="newest">Newest</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs border border-white/[0.04] rounded-full text-white/40 hover:text-white/70 lg:hidden">
              <SlidersHorizontal className="w-3.5 h-3.5" />Filters
            </button>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-4">Availability</h4>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 accent-white cursor-pointer" />
                  <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">In stock only</span>
                </label>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-4">Max Price</h4>
                <input type="range" min={0} max={15000} step={100} value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full accent-white" />
                <div className="flex justify-between text-[10px] text-white/20 font-mono mt-2">
                  <span>$0</span><span>${maxPrice.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-[10px] text-white/15">{filteredProducts.length} products</p>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-sm text-white/30 mb-2">No products match your filters</p>
                <button onClick={() => { setCategory('all'); setInStockOnly(false); setMaxPrice(15000); }}
                  className="text-xs text-white/50 hover:text-white underline">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowFilters(false)} />
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-[#080808] border-t border-white/[0.04] rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X className="w-5 h-5 text-white/40" /></button>
            </div>
            <div className="space-y-6">
              <label className="flex items-center gap-2.5">
                <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="w-4 h-4 accent-white" />
                <span className="text-xs text-white/40">In stock only</span>
              </label>
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">Max Price</h4>
                <input type="range" min={0} max={15000} step={100} value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full accent-white" />
                <p className="text-xs text-white/30 font-mono mt-1">${maxPrice.toLocaleString()}</p>
              </div>
              <button onClick={() => setShowFilters(false)}
                className="w-full py-3 bg-white text-black font-semibold rounded-full text-sm">
                Show {filteredProducts.length} Results
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
