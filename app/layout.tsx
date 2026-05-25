import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lydia’s Luxe Fashion | Elegant Women’s Boutique",
  description:
    "Shop elegant clothes, shoes, bags, and jewelry from Lydia’s Luxe Fashion.",
  keywords: [
    "Lydia’s Luxe Fashion",
    "women fashion",
    "boutique fashion",
    "clothes",
    "shoes",
    "bags",
    "jewelry",
  ],
  openGraph: {
    title: "Lydia’s Luxe Fashion",
    description:
      "Elegant women’s boutique for clothes, shoes, bags, and jewelry.",
    images: ["/images/banner.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black">
        <CartProvider>
          <Navbar />

          <main className="flex-1">{children}</main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}