'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ProductCard } from '@/components/shop/ProductCard';
import { Product } from '@/types';
import Link from 'next/link';

const categoryMeta: Record<string, { title: string; serifWord: string; description: string }> = {
  bikes: {
    title: 'Bikes',
    serifWord: 'Electric',
    description: 'Premium electric motorcycles from Surron, Talaria, Altis, and more.',
  },
  parts: {
    title: 'upgrades',
    serifWord: 'Performance',
    description: 'Batteries, controllers, suspension, and drivetrain upgrades.',
  },
  accessories: {
    title: 'gear',
    serifWord: 'Rider',
    description: 'Helmets, gloves, chargers, mounts, and security gear for every rider.',
  },
};

export default function CategoryPage() {
  const params = useParams();
  const cat = params.cat as string;
  const meta = categoryMeta[cat];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category', cat)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (data) {
        setProducts(data.map((p: any) => ({
          id: p.id, slug: p.slug, name: p.name, description: p.description || '',
          price: p.price, compare_price: p.compare_price || null, category: p.category || 'bikes',
          stock_qty: p.stock_qty ?? 0, images: p.image_urls || [], specs: p.specs || {},
          is_featured: p.is_featured ?? false, created_at: p.created_at || '',
        })));
      }
      setLoading(false);
    };
    fetchProducts();
  }, [cat]);

  if (!meta) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--v-text)' }}>Category Not Found</h1>
          <Link href="/shop" className="text-sm underline" style={{ color: 'var(--v-text-muted)' }}>Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />
      <div className="relative py-16 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--v-text-muted)' }}>
              <Link href="/shop" className="transition-colors">Shop</Link>
              <span style={{ color: 'var(--v-text-dim)' }}>/</span>
              <span className="capitalize" style={{ color: 'var(--v-text-secondary)' }}>{cat}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl leading-tight mb-4">
              <span className="font-serif-italic gradient-text">{meta.serifWord}</span>{' '}
              <span className="font-bold" style={{ color: 'var(--v-text)' }}>{meta.title}</span>
            </h1>
            <p className="text-sm max-w-lg" style={{ color: 'var(--v-text-muted)' }}>{meta.description}</p>
            <p className="text-[10px] mt-3 uppercase tracking-widest" style={{ color: 'var(--v-text-dim)' }}>{products.length} products</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-24 sm:pb-32">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--v-text-muted)' }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
