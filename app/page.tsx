import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabaseClient";

export default async function Home() {
  const categories = [
    {
      name: "Clothes",
      image: "/images/dress.jpg",
      description: "Dresses, outfits, and everyday fashion",
    },
    {
      name: "Shoes",
      image: "/images/shoes.jpg",
      description: "Heels, sandals, and stylish footwear",
    },
    {
      name: "Bags",
      image: "/images/bag.jpg",
      description: "Handbags and fashion accessories",
    },
    {
      name: "Jewelry",
      image: "/images/jewelry.jpg",
      description: "Earrings, necklaces, and jewelry sets",
    },
  ];

  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  const featuredProducts =
    data?.map((product) => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image_url,
      category: product.category,
      sizes: product.sizes || undefined,
      colors: product.colors || [],
    })) || [];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="px-6 md:px-16 py-10 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-block bg-pink-50 text-pink-600 px-4 py-2 rounded-full text-sm font-semibold mb-5">
              Modern Boutique Fashion
            </p>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Fashion designed for confidence and elegance.
            </h1>

            <p className="text-gray-600 text-base md:text-lg leading-8 max-w-xl mb-8">
              Discover stylish clothing, shoes, bags, and jewelry carefully
              selected for women who love a clean, classy, and modern look.
            </p>

            <Link
              href="/shop"
              className="inline-block bg-black hover:bg-pink-600 text-white px-7 py-3.5 rounded-full font-semibold transition"
            >
              Shop Collection
            </Link>
          </div>

          <div className="relative">
            <div className="h-[350px] md:h-[520px] rounded-[2rem] overflow-hidden border border-pink-100">
              <img
                src="/images/banner.jpg"
                alt="Lydia’s Luxe Fashion Banner"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-5 left-5 bg-white rounded-2xl shadow-md border border-pink-100 px-5 py-4">
              <p className="font-bold text-black">New Arrivals Available</p>
              <p className="text-gray-500 text-sm">Shop the latest collection</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="px-6 md:px-16 pb-10">
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-xl mb-3">Curated Fashion</h3>
            <p className="text-gray-500 leading-7">
              Boutique pieces selected for modern women.
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-xl mb-3">Easy Checkout</h3>
            <p className="text-gray-500 leading-7">
              Add items to cart and checkout quickly.
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-xl mb-3">Customer Support</h3>
            <p className="text-gray-500 leading-7">
              Contact us through the Navbar for sizing or order help.
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-6 md:px-16 py-14">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-pink-600 font-semibold mb-2">Categories</p>
            <h2 className="text-3xl md:text-5xl font-extrabold">
              Shop by style
            </h2>
          </div>

          <Link
            href="/shop"
            className="hidden md:block text-sm font-semibold text-pink-600 hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category) => (
            <Link
              href={`/shop?search=${category.name.toLowerCase()}`}
              key={category.name}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-500 text-sm leading-6">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="px-6 md:px-16 py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-pink-600 font-semibold mb-2">Featured</p>
            <h2 className="text-3xl md:text-5xl font-extrabold">
              Popular products
            </h2>
          </div>

          <Link
            href="/shop"
            className="hidden md:block text-sm font-semibold text-pink-600 hover:underline"
          >
            View Shop
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="border border-pink-100 rounded-2xl p-8 text-center text-gray-500">
            No products yet. Add products from the admin page.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* PROMO */}
      <section className="px-6 md:px-16 py-16">
        <div className="bg-black rounded-[2rem] overflow-hidden">
          <div className="grid lg:grid-cols-2 items-center">
            <div className="p-8 md:p-14 text-white">
              <p className="text-pink-300 font-semibold mb-3">
                New Collection
              </p>

              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
                Timeless pieces for every occasion.
              </h2>

              <p className="text-gray-300 leading-8 mb-8">
                Browse our newest arrivals in clothing, shoes, handbags, and
                jewelry.
              </p>

              <Link
                href="/shop"
                className="inline-block bg-white text-black hover:bg-pink-600 hover:text-white px-7 py-3.5 rounded-full font-semibold transition"
              >
                Explore Collection
              </Link>
            </div>

            <div className="h-[320px] md:h-full overflow-hidden">
              <img
                src="/images/promo.jpg"
                alt="Fashion Promo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}