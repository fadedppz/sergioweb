'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShoppingCart, Check, ChevronRight, Package, Cpu, Battery, Gauge } from 'lucide-react';
import { products, formatPrice } from '@/data/products';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/cart-store';
import { Product } from '@/types';

const bikes = products.filter(p => p.category === 'bikes' && p.stock_qty > 0);
const upgrades = products.filter(p => p.category === 'parts');

const specIcons: Record<string, any> = {
  Motor: Cpu,
  Battery: Battery,
  'Top Speed': Gauge,
};

export default function BuildPage() {
  const [selectedBike, setSelectedBike] = useState<Product | null>(null);
  const [selectedUpgrades, setSelectedUpgrades] = useState<Product[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  const totalPrice = useMemo(() => {
    let total = selectedBike?.price || 0;
    selectedUpgrades.forEach(u => total += u.price);
    return total;
  }, [selectedBike, selectedUpgrades]);

  const toggleUpgrade = (upgrade: Product) => {
    setSelectedUpgrades(prev =>
      prev.find(u => u.id === upgrade.id)
        ? prev.filter(u => u.id !== upgrade.id)
        : [...prev, upgrade]
    );
    setAddedToCart(false);
  };

  const handleAddAll = () => {
    if (selectedBike) {
      addItem(selectedBike, selectedBike.variants?.[0]);
      selectedUpgrades.forEach(u => addItem(u));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    }
  };

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }}>
      <div className="vignette-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-20 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ backgroundColor: 'var(--v-border-hover)' }} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: 'var(--v-text-muted)' }}>Configurator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-4">
            <span className="font-serif-italic gradient-text">Build</span>{' '}
            <span className="font-bold" style={{ color: 'var(--v-text)' }}>your Surron</span>
          </h1>
          <p className="text-sm sm:text-base max-w-lg" style={{ color: 'var(--v-text-muted)' }}>
            Choose your base, add performance upgrades, and see your build total update in real time.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-10 sm:mb-14 overflow-x-auto pb-2">
          {[
            { num: 1, label: 'Base Model', active: true },
            { num: 2, label: 'Upgrades', active: !!selectedBike },
            { num: 3, label: 'Review', active: !!selectedBike && selectedUpgrades.length > 0 },
          ].map((step, idx) => (
            <div key={step.num} className="flex items-center gap-3 shrink-0">
              {idx > 0 && (
                <div className="w-8 sm:w-12 h-px" style={{ backgroundColor: step.active ? 'var(--v-text-muted)' : 'var(--v-border)' }} />
              )}
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                  style={{
                    backgroundColor: step.active ? 'var(--v-btn-primary-bg)' : 'var(--v-bg-card)',
                    color: step.active ? 'var(--v-btn-primary-text)' : 'var(--v-text-muted)',
                    border: step.active ? 'none' : '1px solid var(--v-border)',
                  }}
                >
                  {step.num}
                </div>
                <span
                  className="text-xs font-medium uppercase tracking-wider hidden sm:inline"
                  style={{ color: step.active ? 'var(--v-text)' : 'var(--v-text-dim)' }}
                >
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          {/* Left: Configuration */}
          <div className="lg:col-span-2 space-y-10">
            {/* Step 1: Choose Base */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="roman-index text-lg">I</span>
                <h2 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--v-text)' }}>Choose Your Base Model</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bikes.map((bike) => {
                  const isSelected = selectedBike?.id === bike.id;
                  return (
                    <motion.button
                      key={bike.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setSelectedBike(bike); setAddedToCart(false); }}
                      className="text-left p-5 sm:p-6 rounded-2xl transition-all duration-300 group relative overflow-hidden"
                      style={{
                        backgroundColor: isSelected ? 'var(--v-glass-hover)' : 'var(--v-bg-card)',
                        border: `1px solid ${isSelected ? 'var(--v-text-muted)' : 'var(--v-border)'}`,
                      }}
                    >
                      {/* Selected indicator */}
                      {isSelected && (
                        <motion.div
                          layoutId="bike-selected"
                          className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'var(--v-btn-primary-bg)' }}
                        >
                          <Check className="w-3.5 h-3.5" style={{ color: 'var(--v-btn-primary-text)' }} />
                        </motion.div>
                      )}

                      {/* Bike icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: 'var(--v-bg-card)' }}
                      >
                        <Package className="w-5 h-5" style={{ color: 'var(--v-text-muted)' }} />
                      </div>

                      <h3 className="font-semibold text-sm sm:text-base mb-1.5" style={{ color: 'var(--v-text)' }}>
                        {bike.name}
                      </h3>

                      {/* Specs row */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
                        {Object.entries(bike.specs).slice(0, 3).map(([key, value]) => {
                          const Icon = specIcons[key] || Zap;
                          return (
                            <div key={key} className="flex items-center gap-1.5">
                              <Icon className="w-3 h-3" style={{ color: 'var(--v-text-dim)' }} />
                              <span className="text-[10px]" style={{ color: 'var(--v-text-muted)' }}>{value}</span>
                            </div>
                          );
                        })}
                      </div>

                      <span className="text-lg font-mono font-bold gradient-text">{formatPrice(bike.price)}</span>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {/* Step 2: Add Upgrades */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="roman-index text-lg">II</span>
                <h2 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--v-text)' }}>
                  Performance Upgrades
                </h2>
                <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--v-text-dim)' }}>Optional</span>
              </div>
              <div className="space-y-3">
                {upgrades.map((upgrade) => {
                  const isSelected = selectedUpgrades.some(u => u.id === upgrade.id);
                  return (
                    <motion.button
                      key={upgrade.id}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => toggleUpgrade(upgrade)}
                      className="w-full text-left p-4 sm:p-5 rounded-xl flex items-center justify-between transition-all duration-200"
                      style={{
                        backgroundColor: isSelected ? 'var(--v-glass-hover)' : 'var(--v-bg-card)',
                        border: `1px solid ${isSelected ? 'var(--v-text-muted)' : 'var(--v-border)'}`,
                      }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        {/* Checkbox */}
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all"
                          style={{
                            backgroundColor: isSelected ? 'var(--v-btn-primary-bg)' : 'transparent',
                            border: isSelected ? 'none' : '1px solid var(--v-border-hover)',
                          }}
                        >
                          {isSelected && <Check className="w-3 h-3" style={{ color: 'var(--v-btn-primary-text)' }} />}
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-medium block truncate" style={{ color: 'var(--v-text)' }}>
                            {upgrade.name}
                          </span>
                          <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--v-text-muted)' }}>
                            {upgrade.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-mono font-semibold shrink-0 ml-4" style={{ color: 'var(--v-text)' }}>
                        +{formatPrice(upgrade.price)}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="sticky top-24">
              <div className="glass-card-static p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="roman-index text-lg">III</span>
                  <h3 className="text-base font-semibold" style={{ color: 'var(--v-text)' }}>Your Build</h3>
                </div>

                {!selectedBike ? (
                  <div className="text-center py-10">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: 'var(--v-bg-card)' }}
                    >
                      <Package className="w-6 h-6" style={{ color: 'var(--v-text-dim)' }} />
                    </div>
                    <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Select a base model to start</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Base model */}
                    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--v-border)' }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--v-text)' }}>{selectedBike.name}</p>
                        <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--v-text-muted)' }}>Base model</p>
                      </div>
                      <span className="text-sm font-mono" style={{ color: 'var(--v-text)' }}>{formatPrice(selectedBike.price)}</span>
                    </div>

                    {/* Upgrades */}
                    <AnimatePresence>
                      {selectedUpgrades.map((upgrade) => (
                        <motion.div
                          key={upgrade.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between py-3"
                          style={{ borderBottom: '1px solid var(--v-border)' }}
                        >
                          <div>
                            <p className="text-sm" style={{ color: 'var(--v-text-secondary)' }}>{upgrade.name}</p>
                            <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--v-text-dim)' }}>Upgrade</p>
                          </div>
                          <span className="text-sm font-mono" style={{ color: 'var(--v-text-secondary)' }}>+{formatPrice(upgrade.price)}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-4">
                      <span className="font-semibold text-sm" style={{ color: 'var(--v-text)' }}>Total</span>
                      <span className="text-2xl sm:text-3xl font-mono font-bold gradient-text">{formatPrice(totalPrice)}</span>
                    </div>

                    {/* Savings indicator */}
                    {selectedUpgrades.length > 0 && (
                      <p className="text-[10px] text-center" style={{ color: 'var(--v-text-dim)' }}>
                        {selectedUpgrades.length} upgrade{selectedUpgrades.length > 1 ? 's' : ''} added
                      </p>
                    )}

                    {/* CTA */}
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full mt-2"
                      onClick={handleAddAll}
                      disabled={addedToCart}
                    >
                      {addedToCart ? (
                        <><Check className="w-4 h-4" /> Added to Cart</>
                      ) : (
                        <><ShoppingCart className="w-4 h-4" /> Add Build to Cart</>
                      )}
                    </Button>

                    {/* Continue */}
                    <button
                      className="w-full flex items-center justify-center gap-1 py-2 text-xs transition-colors"
                      style={{ color: 'var(--v-text-muted)' }}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      <ChevronRight className="w-3 h-3" /> Modify build
                    </button>
                  </div>
                )}
              </div>

              {/* Trust badges */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: 'Free Shipping', sub: 'On bikes' },
                  { label: 'Warranty', sub: '1-2 Years' },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="text-center py-3 px-4 rounded-xl"
                    style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}
                  >
                    <span className="text-[10px] font-medium" style={{ color: 'var(--v-text-secondary)' }}>{b.label}</span>
                    <span className="text-[9px] block mt-0.5" style={{ color: 'var(--v-text-dim)' }}>{b.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
