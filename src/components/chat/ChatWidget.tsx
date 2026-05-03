'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Zap } from 'lucide-react';
import { ChatMessage } from '@/types';

const MIN_LEN = 2;
const MAX_LEN = 500;
const SEND_COOLDOWN_MS = 800;

const FAQ_RESPONSES: Record<string, string> = {
  pricing: "Our Surron bikes range from $3,799 (Light Bee S) to $13,499 (Storm Bee RS). Parts start at $39 and go up to $899 for upgraded batteries. Check out /shop for full pricing!",
  bikes: "We carry 5 Surron models: Light Bee X ($4,299), Light Bee S ($3,799 - street legal), Ultra Bee ($8,499), Storm Bee ($11,999), and the upcoming Storm Bee RS ($13,499 - pre-order). Each one's a beast!",
  battery: "Looking to upgrade your battery? Our 60V 40Ah upgraded battery ($899) gives you 18% more capacity than stock. Plug-and-play installation, no mods needed. We also have 10A fast chargers ($179) that cut charge time in half.",
  speed: "Top speeds: Light Bee X hits 47 mph, Ultra Bee reaches 59 mph, and the Storm Bee maxes out at 75 mph. The upcoming Storm Bee RS is estimated at 85+ mph!",
  range: "Range varies by model: Light Bee X gets 40-60 miles, Ultra Bee gets 50-75 miles, and Storm Bee gets 60-80 miles per charge. Real-world range depends on terrain and riding style.",
  shipping: "Free shipping on all orders over $500! Bikes ship fully assembled via freight carrier. Parts and accessories ship via USPS/UPS, typically arriving in 3-7 business days.",
  warranty: "All Surron bikes come with a 1-year manufacturer warranty on frame and motor, 6 months on battery. Aftermarket parts have a 1-year Eclipse Electric warranty.",
  parts: "We stock batteries, controllers, suspension upgrades, handguards, LED headlights, chain kits, and more. All parts are plug-and-play compatible with Surron models.",
  street: "The Light Bee S ($3,799) is our street-legal model — comes with DOT lighting, mirrors, and turn signals. The LBX can be made street legal in some states with aftermarket DOT kits.",
  controller: "Our Performance Controller ($449) upgrades your Light Bee's power delivery with sine-wave FOC, 100A continuous current, Bluetooth tuning, and 3 programmable ride modes.",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello. I am the Eclipse Electric AI Advisor. Ask me anything about Surron electric bikes, parts, specs, or orders.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastSentAt, setLastSentAt] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) return FAQ_RESPONSES.pricing;
    if (msg.includes('bike') || msg.includes('model') || msg.includes('which')) return FAQ_RESPONSES.bikes;
    if (msg.includes('battery') || msg.includes('charge') || msg.includes('power')) return FAQ_RESPONSES.battery;
    if (msg.includes('speed') || msg.includes('fast') || msg.includes('top')) return FAQ_RESPONSES.speed;
    if (msg.includes('range') || msg.includes('far') || msg.includes('mile')) return FAQ_RESPONSES.range;
    if (msg.includes('ship') || msg.includes('deliver')) return FAQ_RESPONSES.shipping;
    if (msg.includes('warranty') || msg.includes('guarantee') || msg.includes('return')) return FAQ_RESPONSES.warranty;
    if (msg.includes('part') || msg.includes('upgrade') || msg.includes('accessori')) return FAQ_RESPONSES.parts;
    if (msg.includes('street') || msg.includes('legal') || msg.includes('road')) return FAQ_RESPONSES.street;
    if (msg.includes('controller') || msg.includes('performance')) return FAQ_RESPONSES.controller;
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) return "Hey there! Welcome to Eclipse Electric. Looking for a Surron bike, parts, or gear? I can help with specs, pricing, and recommendations.";
    return "Great question! I can help with:\n\n• Bike models & specs\n• Pricing & comparisons\n• Parts & upgrades\n• Shipping & warranty\n• Street legality\n\nTry asking about a specific model like the \"Light Bee X\" or \"Storm Bee\", or ask about battery upgrades, top speed, or range.";
  };

  const handleSendMessage = async () => {
    const trimmed = inputValue.trim();
    if (trimmed.length < MIN_LEN || trimmed.length > MAX_LEN) return;
    if (!/[a-zA-Z0-9]/.test(trimmed)) return;
    const now = Date.now();
    if (now - lastSentAt < SEND_COOLDOWN_MS) return;
    setLastSentAt(now);

    const userMessage: ChatMessage = { id: Date.now().toString(), text: trimmed, isBot: false, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    inputRef.current?.focus();
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (res.ok) {
        const data = await res.json();

        // If API returned a fallback flag, use local FAQ instead
        if (data.fallback) {
          const localResponse = getBotResponse(trimmed);
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: localResponse, isBot: true, timestamp: new Date() }]);
        } else {
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: data.reply, isBot: true, timestamp: new Date() }]);
        }
      } else {
        throw new Error('API error');
      }
    } catch {
      // Network error — use local FAQ
      await new Promise(r => setTimeout(r, 400 + Math.random() * 400));
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: getBotResponse(trimmed), isBot: true, timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full backdrop-blur-xl flex items-center justify-center transition-all cursor-pointer"
        style={{
          backgroundColor: 'var(--v-glass)',
          border: '1px solid var(--v-border)',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring' }}
        aria-label="Toggle chat"
      >
        {isOpen
          ? <X className="w-4 h-4" style={{ color: 'var(--v-text-muted)' }} />
          : <MessageCircle className="w-4 h-4" style={{ color: 'var(--v-text-muted)' }} />}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[min(380px,calc(100vw-32px))] h-[min(500px,70vh)] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{
              backgroundColor: 'var(--v-bg-surface)',
              border: '1px solid var(--v-border)',
            }}
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--v-bg-elevated)', borderBottom: '1px solid var(--v-border)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--v-bg-card)' }}>
                <Zap className="w-3.5 h-3.5" style={{ color: 'var(--v-text-muted)' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--v-text)' }}>Eclipse Electric AI</h3>
                <p className="text-[10px]" style={{ color: 'var(--v-text-dim)' }}>{isTyping ? 'Typing...' : 'Online'}</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--v-text-dim)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: 'var(--v-bg)' }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                      msg.isBot
                        ? 'rounded-2xl rounded-bl-md'
                        : 'rounded-2xl rounded-br-md'
                    }`}
                    style={msg.isBot ? {
                      backgroundColor: 'var(--v-bg-card)',
                      color: 'var(--v-text-secondary)',
                      border: '1px solid var(--v-border)',
                    } : {
                      backgroundColor: 'var(--v-btn-primary-bg)',
                      color: 'var(--v-btn-primary-text)',
                    }}
                  >
                    <p className="whitespace-pre-line break-words">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md" style={{ backgroundColor: 'var(--v-bg-card)', border: '1px solid var(--v-border)' }}>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0ms]" style={{ backgroundColor: 'var(--v-text-dim)' }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:150ms]" style={{ backgroundColor: 'var(--v-text-dim)' }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:300ms]" style={{ backgroundColor: 'var(--v-text-dim)' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto" style={{ backgroundColor: 'var(--v-bg)', borderTop: '1px solid var(--v-border)' }}>
              {['Bikes', 'Parts', 'Pricing'].map((action) => (
                <button key={action} onClick={() => { setInputValue(action); }}
                  className="shrink-0 px-3 py-1.5 text-[10px] rounded-full uppercase tracking-wider transition-colors"
                  style={{ color: 'var(--v-text-muted)', border: '1px solid var(--v-border)' }}>
                  {action}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: 'var(--v-bg-elevated)', borderTop: '1px solid var(--v-border)' }}>
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Surron..."
                maxLength={MAX_LEN}
                className="flex-1 rounded-full px-4 py-2.5 text-sm focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--v-input-bg)',
                  border: '1px solid var(--v-border)',
                  color: 'var(--v-text)',
                }}
              />
              <button onClick={handleSendMessage}
                className="p-2.5 rounded-full transition-colors disabled:opacity-30"
                style={{ backgroundColor: 'var(--v-btn-primary-bg)', color: 'var(--v-btn-primary-text)' }}
                disabled={inputValue.trim().length < MIN_LEN}>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
