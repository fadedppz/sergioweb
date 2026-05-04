'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Check, Package, Truck, Shield, Loader2 } from 'lucide-react';
import { formatPrice } from '@/data/products';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductCard } from '@/components/shop/ProductCard';
import { useCart } from '@/lib/cart-store';
import { createClient } from '@/lib/supabase/client';
import { Product, ProductVariant } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        const mapped: Product = {
          id: data.id,
          slug: data.slug,
          name: data.name,
          description: data.description || '',
          price: data.price,
          compare_price: data.compare_price || null,
          category: data.category || 'bikes',
          stock_qty: data.stock_qty ?? 0,
          images: data.images || [],
          specs: data.specs || {},
          is_featured: data.is_featured ?? false,
          created_at: data.created_at || '',
          variants: data.product_variants || [],
        };
        setProduct(mapped);
        setSelectedVariant(mapped.variants?.[0]);

        // Fetch related products
        const { data: relatedData } = await supabase
          .from('products')
          .select('*')
          .eq('category', data.category)
          .eq('is_active', true)
          .neq('id', data.id)
          .limit(4);

        if (relatedData) {
          setRelated(relatedData.map((p: any) => ({
            id: p.id, slug: p.slug, name: p.name, description: p.description || '',
            price: p.price, compare_price: p.compare_price || null, category: p.category || 'bikes',
            stock_qty: p.stock_qty ?? 0, images: p.images || [], specs: p.specs || {},
            is_featured: p.is_featured ?? false, created_at: p.created_at || '',
          })));
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--v-text-muted)' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--v-text)' }}>Product Not Found</h1>
          <Link href="/shop" className="text-sm underline" style={{ color: 'var(--v-text-muted)' }}>Back to Shop</Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock_qty === 0;
  const isOnSale = product.compare_price && product.compare_price > product.price;
  const currentPrice = product.price + (selectedVariant?.price_delta || 0);

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs mb-8 sm:mb-10 flex-wrap" style={{ color: 'var(--v-text-muted)' }}>
          <Link href="/shop" className="transition-colors flex items-center gap-1" style={{ color: 'var(--v-text-muted)' }}>
            <ArrowLeft className="w-3 h-3" /> Shop
          </Link>
          <span style={{ color: 'var(--v-text-dim)' }}>/</span>
          <span className="capitalize">{product.category}</span>
          <span style={{ color: 'var(--v-text-dim)' }}>/</span>
          <span style={{ color: 'var(--v-text-secondary)' }}>{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="aspect-square rounded-3xl flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(to bottom, var(--v-bg-elevated), var(--v-bg-surface))', border: '1px solid var(--v-border)' }}>
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg-card)' }}>
                <Package className="w-12 h-12 sm:w-16 sm:h-16" style={{ color: 'var(--v-text-dim)' }} />
              </div>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_featured && <Badge variant="featured">Featured</Badge>}
                {isOnSale && <Badge variant="sale">Sale</Badge>}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-3" style={{ color: 'var(--v-text-muted)' }}>
              {product.category === 'bikes' ? 'Electric Bikes' : product.category === 'parts' ? 'Parts' : 'Accessories'}
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-5" style={{ color: 'var(--v-text)' }}>{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl font-mono font-bold gradient-text">{formatPrice(currentPrice)}</span>
              {isOnSale && product.compare_price && (
                <>
                  <span className="text-base font-mono line-through" style={{ color: 'var(--v-text-dim)' }}>{formatPrice(product.compare_price)}</span>
                  <Badge variant="sale">−{formatPrice(product.compare_price - product.price)}</Badge>
                </>
              )}
            </div>

            <p className="text-sm leading-relaxed mb-6 sm:mb-8" style={{ color: 'var(--v-text-secondary)' }}>{product.description}</p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-3" style={{ color: 'var(--v-text-muted)' }}>
                  {product.category === 'accessories' ? 'Size' : 'Color'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button key={v.id} onClick={() => setSelectedVariant(v)}
                      className="px-4 py-2.5 text-xs rounded-full transition-all duration-200"
                      style={{
                        border: selectedVariant?.id === v.id ? '1px solid var(--v-btn-primary-bg)' : '1px solid var(--v-border)',
                        backgroundColor: selectedVariant?.id === v.id ? 'var(--v-btn-primary-bg)' : 'transparent',
                        color: selectedVariant?.id === v.id ? 'var(--v-btn-primary-text)' : 'var(--v-text-muted)',
                        fontWeight: selectedVariant?.id === v.id ? 600 : 400,
                      }}>
                      {v.label}
                      {v.price_delta > 0 && <span className="ml-1 opacity-50">+{formatPrice(v.price_delta)}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + ATC */}
            <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <div className="flex items-center rounded-full overflow-hidden" style={{ border: '1px solid var(--v-border)' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm transition-colors" style={{ color: 'var(--v-text-muted)' }}>−</button>
                <span className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-mono min-w-[40px] text-center" style={{ color: 'var(--v-text)' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm transition-colors" style={{ color: 'var(--v-text-muted)' }}>+</button>
              </div>
              <Button variant="glassy" size="lg" onClick={() => addItem(product, selectedVariant, quantity)}
                disabled={isOutOfStock} className="flex-1">
                <ShoppingCart className="w-4 h-4" />
                {isOutOfStock ? 'Notify Me' : 'Add to Cart'}
              </Button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Orders $500+' },
                { icon: Shield, label: 'Warranty', sub: '1-2 Years' },
                { icon: Check, label: 'Authentic', sub: 'Genuine Parts' },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl"
                  style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
                  <b.icon className="w-4 h-4 mb-2" style={{ color: 'var(--v-text-muted)' }} />
                  <span className="text-[10px] font-medium" style={{ color: 'var(--v-text-secondary)' }}>{b.label}</span>
                  <span className="text-[9px] mt-0.5" style={{ color: 'var(--v-text-dim)' }}>{b.sub}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Specs */}
        {Object.keys(product.specs).length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 sm:mt-20">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-8 h-px" style={{ backgroundColor: 'var(--v-border-hover)' }} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-muted)' }}>Specifications</span>
            </div>
            <div className="rounded-3xl overflow-hidden" style={{ border: '1px solid var(--v-border)' }}>
              <div>
                {Object.entries(product.specs).map(([key, value], idx) => (
                  <div key={key} className="flex items-center px-4 sm:px-6 py-3 sm:py-4"
                    style={{
                      backgroundColor: idx % 2 === 0 ? 'var(--v-bg-card)' : 'transparent',
                      borderBottom: '1px solid var(--v-border)',
                    }}>
                    <span className="w-1/3 text-xs font-medium" style={{ color: 'var(--v-text-muted)' }}>{key}</span>
                    <span className="flex-1 text-xs font-mono" style={{ color: 'var(--v-text-secondary)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20 sm:mt-32">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-8 h-px" style={{ backgroundColor: 'var(--v-border-hover)' }} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-muted)' }}>Related</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p, idx) => <ProductCard key={p.id} product={p} index={idx} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
