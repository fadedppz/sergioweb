// ============================================
// VANDAL — Core Type Definitions
// ============================================

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compare_price: number | null;
  category: 'bikes' | 'parts' | 'accessories';
  stock_qty: number;
  images: string[];
  specs: Record<string, string>;
  is_featured: boolean;
  created_at: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  label: string;
  price_delta: number;
  stock_qty: number;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  stripe_session_id: string | null;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: CartItem[];
  shipping_address: ShippingAddress;
  created_at: string;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}
