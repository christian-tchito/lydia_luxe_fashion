import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabaseClient";

type ShopPageProps = {
    searchParams: {
        search?: string;
    };
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const searchTerm = searchParams.search?.toLowerCase() || "";

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    const products =
        data?.map((product) => ({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image_url,
            category: product.category,
            sizes: product.sizes || undefined,
            colors: product.colors || [],
        })) || [];

    const filteredProducts = products.filter((product) => {
        return (
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    });

    return (
        <main className="min-h-screen bg-white px-6 md:px-16 py-12 md:py-16">
            <section className="text-center mb-12">
                <p className="inline-block bg-pink-50 text-pink-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    Lydia’s Luxe Collection
                </p>

                <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                    Shop Collection
                </h1>

                {searchTerm ? (
                    <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
                        Showing results for{" "}
                        <span className="font-bold text-pink-600">
                            “{searchTerm}”
                        </span>
                    </p>
                ) : (
                    <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-7">
                        Browse clothing, shoes, bags, and jewelry selected for a
                        clean, stylish, and confident look.
                    </p>
                )}
            </section>

            <section className="flex flex-wrap justify-center gap-3 mb-12">
                <Link href="/shop" className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-pink-600 transition">
                    All
                </Link>

                <Link href="/shop?search=clothes" className="bg-white border border-gray-200 text-gray-800 px-5 py-2.5 rounded-full text-sm font-semibold hover:border-pink-500 hover:text-pink-600 transition">
                    Clothes
                </Link>

                <Link href="/shop?search=shoes" className="bg-white border border-gray-200 text-gray-800 px-5 py-2.5 rounded-full text-sm font-semibold hover:border-pink-500 hover:text-pink-600 transition">
                    Shoes
                </Link>

                <Link href="/shop?search=bags" className="bg-white border border-gray-200 text-gray-800 px-5 py-2.5 rounded-full text-sm font-semibold hover:border-pink-500 hover:text-pink-600 transition">
                    Bags
                </Link>

                <Link href="/shop?search=jewelry" className="bg-white border border-gray-200 text-gray-800 px-5 py-2.5 rounded-full text-sm font-semibold hover:border-pink-500 hover:text-pink-600 transition">
                    Jewelry
                </Link>
            </section>

            {error ? (
                <div className="bg-white rounded-2xl p-10 shadow-sm border border-red-100 text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl font-extrabold mb-4">
                        Error loading products
                    </h2>
                    <p className="text-gray-500">{error.message}</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 shadow-sm border border-pink-100 text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
                        No products found
                    </h2>

                    <p className="text-gray-500 mb-6">
                        Try searching for clothes, shoes, bags, or jewelry.
                    </p>

                    <Link
                        href="/shop"
                        className="inline-block bg-black hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition"
                    >
                        View All Products
                    </Link>
                </div>
            ) : (
                <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </section>
            )}
        </main>
    );
}