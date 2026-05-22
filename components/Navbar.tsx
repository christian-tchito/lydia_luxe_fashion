"use client";

import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";

export default function Navbar() {
    const { cartCount } = useCart();
    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!search.trim()) {
            router.push("/shop");
            setMenuOpen(false);
            return;
        }

        router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
        setMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-pink-100 shadow-sm">
            <div className="px-4 md:px-16 py-4">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="text-xl md:text-3xl font-extrabold tracking-tight whitespace-nowrap"
                    >
                        <span className="text-pink-600">Lydia’s</span>{" "}
                        <span className="text-black">Luxe</span>
                    </Link>

                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex flex-1 max-w-xl relative"
                    >
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full bg-white border border-gray-200 rounded-full px-5 py-3 pr-12 outline-none focus:border-pink-500 transition"
                        />

                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black hover:bg-pink-600 text-white p-2 rounded-full transition"
                        >
                            <Search size={18} />
                        </button>
                    </form>

                    <div className="hidden lg:flex items-center gap-7 font-medium text-sm">
                        <Link href="/" className="hover:text-pink-600 transition">
                            Home
                        </Link>
                        <Link href="/shop" className="hover:text-pink-600 transition">
                            Shop
                        </Link>
                        <Link href="/about" className="hover:text-pink-600 transition">
                            About
                        </Link>
                        <Link href="/contact" className="hover:text-pink-600 transition">
                            Contact
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/cart"
                            className="bg-black hover:bg-pink-600 text-white px-4 md:px-5 py-2.5 rounded-full text-sm font-semibold transition whitespace-nowrap"
                        >
                            Cart ({cartCount})
                        </Link>

                        <button
                            type="button"
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden border border-gray-200 p-2 rounded-full"
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="md:hidden mt-4 relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full bg-white border border-gray-200 rounded-full px-5 py-3 pr-12 outline-none focus:border-pink-500 transition"
                    />

                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-full"
                    >
                        <Search size={18} />
                    </button>
                </form>

                {menuOpen && (
                    <div className="lg:hidden mt-4 bg-white border border-pink-100 rounded-2xl p-4 shadow-sm">
                        <div className="flex flex-col gap-3 font-medium">
                            <Link
                                href="/"
                                onClick={() => setMenuOpen(false)}
                                className="py-2 hover:text-pink-600"
                            >
                                Home
                            </Link>

                            <Link
                                href="/shop"
                                onClick={() => setMenuOpen(false)}
                                className="py-2 hover:text-pink-600"
                            >
                                Shop
                            </Link>

                            <Link
                                href="/about"
                                onClick={() => setMenuOpen(false)}
                                className="py-2 hover:text-pink-600"
                            >
                                About
                            </Link>

                            <Link
                                href="/contact"
                                onClick={() => setMenuOpen(false)}
                                className="py-2 hover:text-pink-600"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}