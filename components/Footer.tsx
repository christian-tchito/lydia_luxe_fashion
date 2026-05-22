import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-black text-white px-6 md:px-16 py-12 mt-auto">
            <div className="grid md:grid-cols-4 gap-10">
                <div>
                    <h3 className="text-2xl font-extrabold mb-3">
                        Lydia’s Luxe Fashion
                    </h3>

                    <p className="text-gray-400 leading-7">
                        Clothing, shoes, bags, and jewelry for confident women.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold mb-4">Shop</h4>

                    <div className="space-y-2 text-gray-400">
                        <Link href="/shop" className="block hover:text-pink-400">
                            Clothes
                        </Link>
                        <Link href="/shop" className="block hover:text-pink-400">
                            Shoes
                        </Link>
                        <Link href="/shop" className="block hover:text-pink-400">
                            Bags
                        </Link>
                        <Link href="/shop" className="block hover:text-pink-400">
                            Jewelry
                        </Link>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-4">Company</h4>

                    <div className="space-y-2 text-gray-400">
                        <Link href="/" className="block hover:text-pink-400">
                            Home
                        </Link>
                        <Link href="/about" className="block hover:text-pink-400">
                            About Us
                        </Link>
                        <Link href="/contact" className="block hover:text-pink-400">
                            Contact Us
                        </Link>
                        <Link href="/cart" className="block hover:text-pink-400">
                            Cart
                        </Link>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-4">Connect</h4>

                    <p className="text-gray-400 mb-2">Columbus, Ohio</p>
                    <p className="text-gray-400 mb-4">614-296-9211</p>

                    <div className="flex gap-3">
                        <a
                            href="https://www.tiktok.com/@journey.fashion8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-white/20 px-4 py-2 rounded-full text-sm hover:bg-pink-600 hover:border-pink-600 transition"
                        >
                            TikTok
                        </a>

                        <a
                            href="https://www.instagram.com/kombebeauty_parlor"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-white/20 px-4 py-2 rounded-full text-sm hover:bg-pink-600 hover:border-pink-600 transition"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 mt-10 pt-6 text-center text-gray-500 text-sm">
                © 2026 Lydia’s Luxe Fashion. All rights reserved.
            </div>
        </footer>
    );
}