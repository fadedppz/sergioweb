import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart-store";
import { ThemeProvider } from "@/lib/theme-store";
import { CartDrawer } from "@/components/shop/CartDrawer";
import ChatWidget from "@/components/chat/ChatWidget";
import { CustomCursor } from "@/components/ui/CustomCursor";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "VANDAL — Premium Electric Motorcycles & Parts",
    template: "%s | VANDAL",
  },
  description:
    "The premier destination for Surron electric motorcycles, performance parts, and riding accessories.",
  keywords: [
    "Surron", "electric motorcycle", "Light Bee X", "Storm Bee",
    "Ultra Bee", "electric dirt bike", "VANDAL",
  ],
  openGraph: {
    type: "website",
    siteName: "VANDAL",
    title: "VANDAL — Premium Electric Motorcycles & Parts",
    description: "The premier destination for Surron electric motorcycles.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col transition-colors duration-500">
        <ThemeProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <ChatWidget />
            <CustomCursor />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
