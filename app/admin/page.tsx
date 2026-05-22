"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type VariantInput = {
    color: string;
    size: string;
    stockQuantity: string;
    imageFile: File | null;
};

type ProductVariant = {
    id: string;
    product_id: string;
    color: string;
    size: string | null;
    stock_quantity: number;
    image_url: string;
};

type Product = {
    id: string;
    name: string;
    price: number;
    category: string;
    product_variants?: ProductVariant[];
};

export default function AdminPage() {
    const router = useRouter();

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [category, setCategory] = useState("Clothes");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [variants, setVariants] = useState<VariantInput[]>([
        { color: "", size: "", stockQuantity: "", imageFile: null },
    ]);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [message, setMessage] = useState("");

    const showSizes = category === "Clothes" || category === "Shoes";

    const fetchProducts = async () => {
        setLoadingProducts(true);

        const { data, error } = await supabase
            .from("products")
            .select(`
                id,
                name,
                price,
                category,
                product_variants (
                    id,
                    product_id,
                    color,
                    size,
                    stock_quantity,
                    image_url
                )
            `)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setProducts(data as Product[]);
        }

        setLoadingProducts(false);
    };

    useEffect(() => {
        const checkAdmin = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.push("/admin/login");
                return;
            }

            setCheckingAuth(false);
            fetchProducts();
        };

        checkAdmin();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    const updateVariant = (
        index: number,
        field: keyof VariantInput,
        value: string | File | null
    ) => {
        const updatedVariants = [...variants];
        updatedVariants[index] = {
            ...updatedVariants[index],
            [field]: value,
        };
        setVariants(updatedVariants);
    };

    const addVariant = () => {
        setVariants([
            ...variants,
            { color: "", size: "", stockQuantity: "", imageFile: null },
        ]);
    };

    const removeVariant = (index: number) => {
        if (variants.length === 1) return;
        setVariants(variants.filter((_, variantIndex) => variantIndex !== index));
    };

    const handleDeleteProduct = async (productId: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        setMessage("Deleting product...");

        const { error: variantDeleteError } = await supabase
            .from("product_variants")
            .delete()
            .eq("product_id", productId);

        if (variantDeleteError) {
            setMessage(`Variant delete failed: ${variantDeleteError.message}`);
            return;
        }

        const { error: productDeleteError } = await supabase
            .from("products")
            .delete()
            .eq("id", productId);

        if (productDeleteError) {
            setMessage(`Product delete failed: ${productDeleteError.message}`);
            return;
        }

        setProducts((currentProducts) =>
            currentProducts.filter((product) => product.id !== productId)
        );

        setMessage("Product deleted successfully.");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (!name || !price || !category) {
                setMessage("Please fill in product name, price, and category.");
                setLoading(false);
                return;
            }

            for (const variant of variants) {
                if (!variant.color || !variant.stockQuantity || !variant.imageFile) {
                    setMessage("Each variant needs color, quantity, and image.");
                    setLoading(false);
                    return;
                }

                if (showSizes && !variant.size) {
                    setMessage("Each clothes/shoes variant needs a size.");
                    setLoading(false);
                    return;
                }
            }

            const uniqueColors = Array.from(
                new Set(variants.map((variant) => variant.color.trim()).filter(Boolean))
            );

            const uniqueSizes = showSizes
                ? Array.from(
                    new Set(
                        variants
                            .map((variant) => variant.size.trim())
                            .filter(Boolean)
                    )
                )
                : null;

            const firstImageFile = variants[0].imageFile;

            if (!firstImageFile) {
                setMessage("Please upload at least one image.");
                setLoading(false);
                return;
            }

            const firstFileExt = firstImageFile.name.split(".").pop();
            const firstFileName = `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2)}.${firstFileExt}`;

            const { error: firstUploadError } = await supabase.storage
                .from("product-images")
                .upload(firstFileName, firstImageFile, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (firstUploadError) {
                throw firstUploadError;
            }

            const { data: firstPublicUrlData } = supabase.storage
                .from("product-images")
                .getPublicUrl(firstFileName);

            const mainImageUrl = firstPublicUrlData.publicUrl;

            const { data: productInsertData, error: productInsertError } =
                await supabase
                    .from("products")
                    .insert([
                        {
                            name,
                            price: Number(price),
                            category,
                            description,
                            image_url: mainImageUrl,
                            sizes: uniqueSizes,
                            colors: uniqueColors,
                        },
                    ])
                    .select()
                    .single();

            if (productInsertError) {
                throw productInsertError;
            }

            const productId = productInsertData.id;

            for (let index = 0; index < variants.length; index++) {
                const variant = variants[index];

                let imageUrl = mainImageUrl;

                if (index !== 0 && variant.imageFile) {
                    const fileExt = variant.imageFile.name.split(".").pop();
                    const fileName = `${Date.now()}-${index}-${Math.random()
                        .toString(36)
                        .substring(2)}.${fileExt}`;

                    const { error: uploadError } = await supabase.storage
                        .from("product-images")
                        .upload(fileName, variant.imageFile, {
                            cacheControl: "3600",
                            upsert: false,
                        });

                    if (uploadError) {
                        throw uploadError;
                    }

                    const { data: publicUrlData } = supabase.storage
                        .from("product-images")
                        .getPublicUrl(fileName);

                    imageUrl = publicUrlData.publicUrl;
                }

                const { error: variantInsertError } = await supabase
                    .from("product_variants")
                    .insert([
                        {
                            product_id: productId,
                            color: variant.color.trim(),
                            size: showSizes ? variant.size.trim() : null,
                            stock_quantity: Number(variant.stockQuantity),
                            image_url: imageUrl,
                        },
                    ]);

                if (variantInsertError) {
                    throw variantInsertError;
                }
            }

            setMessage("Product and variants saved successfully.");

            setName("");
            setPrice("");
            setCategory("Clothes");
            setDescription("");
            setVariants([{ color: "", size: "", stockQuantity: "", imageFile: null }]);

            fetchProducts();
        } catch (error: any) {
            setMessage(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (checkingAuth) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-gray-500">Checking admin access...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white px-6 md:px-16 py-12">
            <section className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <p className="text-pink-600 font-semibold mb-2">
                        Admin Dashboard
                    </p>

                    <h1 className="text-4xl md:text-5xl font-extrabold">
                        Manage Products
                    </h1>

                    <p className="text-gray-500 mt-3">
                        Add products, colors, sizes, stock quantity, and images.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="bg-black hover:bg-pink-600 text-white px-5 py-3 rounded-full font-semibold transition w-fit"
                >
                    Logout
                </button>
            </section>

            <div className="grid lg:grid-cols-2 gap-8">
                <section className="border border-pink-100 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">
                        Add New Product
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500"
                        />

                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500"
                        />

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500"
                        >
                            <option>Clothes</option>
                            <option>Shoes</option>
                            <option>Bags</option>
                            <option>Jewelry</option>
                        </select>

                        <textarea
                            placeholder="Product Description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500"
                        />

                        <div className="border border-gray-100 rounded-2xl p-4 space-y-5">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg">
                                    Product Variants
                                </h3>

                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="bg-black hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition"
                                >
                                    Add Variant
                                </button>
                            </div>

                            {variants.map((variant, index) => (
                                <div
                                    key={index}
                                    className="border border-pink-100 rounded-xl p-4 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">
                                            Variant {index + 1}
                                        </p>

                                        {variants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="text-red-500 text-sm font-semibold"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Color e.g. Black, Pink, White"
                                        value={variant.color}
                                        onChange={(e) =>
                                            updateVariant(index, "color", e.target.value)
                                        }
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500"
                                    />

                                    {showSizes && (
                                        <input
                                            type="text"
                                            placeholder="Size e.g. S, M, L or 6, 7, 8"
                                            value={variant.size}
                                            onChange={(e) =>
                                                updateVariant(index, "size", e.target.value)
                                            }
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500"
                                        />
                                    )}

                                    <input
                                        type="number"
                                        placeholder="Stock Quantity e.g. 10"
                                        value={variant.stockQuantity}
                                        onChange={(e) =>
                                            updateVariant(
                                                index,
                                                "stockQuantity",
                                                e.target.value
                                            )
                                        }
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500"
                                    />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            updateVariant(
                                                index,
                                                "imageFile",
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : null
                                            )
                                        }
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3"
                                    />
                                </div>
                            ))}
                        </div>

                        {message && (
                            <p className="text-sm font-semibold text-pink-600">
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black hover:bg-pink-600 text-white py-3.5 rounded-full font-semibold transition disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Save Product"}
                        </button>
                    </form>
                </section>

                <section className="border border-pink-100 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">
                        Product List
                    </h2>

                    {loadingProducts ? (
                        <p className="text-gray-500">Loading products...</p>
                    ) : products.length === 0 ? (
                        <p className="text-gray-500">No products yet.</p>
                    ) : (
                        <div className="space-y-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="border border-gray-200 rounded-xl p-4"
                                >
                                    <div className="flex justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg">
                                                {product.name}
                                            </h3>

                                            <p className="text-gray-500 text-sm">
                                                ${product.price} • {product.category}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteProduct(product.id)
                                            }
                                            className="text-red-500 text-sm font-semibold"
                                        >
                                            Delete
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {product.product_variants?.map((variant) => (
                                            <div
                                                key={variant.id}
                                                className="flex items-center gap-4 border border-pink-100 rounded-lg p-3"
                                            >
                                                <img
                                                    src={variant.image_url}
                                                    alt={product.name}
                                                    className="w-14 h-14 object-cover rounded-md"
                                                />

                                                <div>
                                                    <p className="font-semibold">
                                                        {variant.color}
                                                        {variant.size &&
                                                            ` / ${variant.size}`}
                                                    </p>

                                                    <p className="text-gray-500 text-sm">
                                                        Qty:{" "}
                                                        {variant.stock_quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}