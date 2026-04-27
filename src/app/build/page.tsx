'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Plus, Minus, ShoppingCart, Check, ChevronRight } from 'lucide-react';
import { products, formatPrice } from '@/data/products';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useCart } from '@/lib/cart-store';
import { Product } from '@/types';

const bikes = products.filter(p => p.category === 'bikes' && p.stock_qty > 0);
const upgrades = products.filter(p => p.category === 'parts');

export default function BuildPage() {
  const [selectedBike, setSelectedBike] = useState<Product | null>(null);
  const [selectedUpgrades, setSelectedUpgrades] = useState<Product[]>([]);
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
  };

  const handleAddAll = () => {
    if (selectedBike) {
      addItem(selectedBike, selectedBike.variants?.[0]);
      selectedUpgrades.forEach(u => addItem(u));
    }
  };

  return (
    <div className="pt-[72px] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7B2FFF]/10 border border-[#7B2FFF]/20 text-[#7B2FFF] text-xs font-medium uppercase tracking-wider mb-6">
            <Zap className="w-3.5 h-3.5" /> Configurator
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F5F5F5] mb-4">Build Your Surron</h1>
          <p className="text-[#888888] max-w-lg mx-auto">
            Pick your base model, add performance upgrades, and see your total price update in real-time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Configuration */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Choose Base */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center text-sm font-bold text-[#00D4FF]">1</div>
                <h2 className="text-xl font-semibold text-[#F5F5F5]">Choose Your Base Model</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bikes.map((bike) => (
                  <motion.button key={bike.id} whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedBike(bike)}
                    className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                      selectedBike?.id === bike.id
                        ? 'border-[#00D4FF] bg-[#00D4FF]/5 shadow-[0_0_20px_rgba(0,212,255,0.1)]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                    }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-[#F5F5F5] mb-1">{bike.name}</h3>
                        <p className="text-xs text-[#888888] line-clamp-2 mb-3">{bike.specs['Motor']} • {bike.specs['Top Speed']}</p>
                        <span className="text-lg font-mono font-bold text-[#00D4FF]">{formatPrice(bike.price)}</span>
                      </div>
                      {selectedBike?.id === bike.id && (
                        <div className="w-6 h-6 rounded-full bg-[#00D4FF] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-[#0A0A0A]" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Step 2: Add Upgrades */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#7B2FFF]/10 border border-[#7B2FFF]/30 flex items-center justify-center text-sm font-bold text-[#7B2FFF]">2</div>
                <h2 className="text-xl font-semibold text-[#F5F5F5]">Add Performance Upgrades</h2>
                <span className="text-xs text-[#888888]">(Optional)</span>
              </div>
              <div className="space-y-3">
                {upgrades.map((upgrade) => {
                  const isSelected = selectedUpgrades.some(u => u.id === upgrade.id);
                  return (
                    <motion.button key={upgrade.id} whileTap={{ scale: 0.99 }}
                      onClick={() => toggleUpgrade(upgrade)}
                      className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                        isSelected
                          ? 'border-[#7B2FFF] bg-[#7B2FFF]/5'
                          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                      }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#7B2FFF] border-[#7B2FFF]' : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-[#F5F5F5]">{upgrade.name}</span>
                          <p className="text-xs text-[#888888] mt-0.5 line-clamp-1">{upgrade.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-mono font-semibold text-[#F5F5F5] shrink-0 ml-4">+{formatPrice(upgrade.price)}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="sticky top-24">
              <GlassCard hover={false} className="p-6">
                <h3 className="text-lg font-semibold text-[#F5F5F5] mb-6">Your Build</h3>

                {!selectedBike ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-[#888888]">Select a base model to start</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                      <div>
                        <p className="text-sm font-medium text-[#F5F5F5]">{selectedBike.name}</p>
                        <p className="text-xs text-[#888888]">Base model</p>
                      </div>
                      <span className="text-sm font-mono text-[#F5F5F5]">{formatPrice(selectedBike.price)}</span>
                    </div>

                    <AnimatePresence>
                      {selectedUpgrades.map((upgrade) => (
                        <motion.div key={upgrade.id}
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                          <div>
                            <p className="text-sm text-[#CCCCCC]">{upgrade.name}</p>
                            <p className="text-xs text-[#888888]">Upgrade</p>
                          </div>
                          <span className="text-sm font-mono text-[#CCCCCC]">+{formatPrice(upgrade.price)}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <div className="flex items-center justify-between pt-4">
                      <span className="font-semibold text-[#F5F5F5]">Total</span>
                      <span className="text-2xl font-mono font-bold gradient-text">{formatPrice(totalPrice)}</span>
                    </div>

                    <Button variant="primary" glow size="lg" className="w-full mt-4" onClick={handleAddAll}>
                      <ShoppingCart className="w-4 h-4" /> Add Build to Cart
                    </Button>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
