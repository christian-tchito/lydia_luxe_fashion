"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

type ProductVariant = {
    id: string;
    product_id?: string;
    color: string;
    size: string | null;
    stock_quantity: number;
    image_url: string;
};

type ProductProps = {
    product: {
        id: string | number;
        name: string;
        price: number;
        image?: string;
        category: string;
        sizes?: string[];
        colors: string[];
        product_variants?: ProductVariant[];
    };
};

export default function ProductCard({ product }: ProductProps) {
    const { addToCart } = useCart();

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [error, setError] = useState("");

    const requiresSize =
        product.category === "Clothes" || product.category === "Shoes";

    const selectedVariant = product.product_variants?.find((variant) => {
        const colorMatches = variant.color === selectedColor;
        const sizeMatches = requiresSize
            ? variant.size === selectedSize
            : true;

        return colorMatches && sizeMatches;
    });

    const displayImage =
        selectedVariant?.image_url || product.image || "";

    const isOutOfStock =
        selectedVariant !== undefined &&
        selectedVariant.stock_quantity <= 0;

    const handleAddToCart = () => {
        if (requiresSize && !selectedSize) {
            setError("Select a size.");
            return;
        }

        if (!selectedColor) {
            setError("Select a color.");
            return;
        }

        if (product.product_variants && !selectedVariant) {
            setError("This option is not available.");
            return;
        }

        if (selectedVariant && selectedVariant.stock_quantity <= 0) {
            setError("Out of stock.");
            return;
        }

        addToCart({
            ...product,
            image: displayImage,
            selectedSize: requiresSize ? selectedSize : undefined,
            selectedColor,
            variantId: selectedVariant?.id,
        });

        setError("");
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg transition">
            <div className="h-64 bg-[#faf7f8] overflow-hidden">
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        No Image
                    </div>
                )}
            </div>

            <div className="p-5">
                <p className="text-pink-600 text-xs font-semibold uppercase tracking-wide mb-2">
                    {product.category}
                </p>

                <h3 className="text-lg font-bold mb-2">{product.name}</h3>

                <p className="font-bold text-xl mb-4">${product.price}</p>

                {requiresSize && product.sizes && product.sizes.length > 0 && (
                    <div className="mb-4">
                        <p className="font-semibold text-sm mb-2">Size</p>

                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => {
                                        setSelectedSize(size);
                                        setError("");
                                    }}
                                    className={`px-3 py-2 rounded-full border text-xs font-semibold transition ${selectedSize === size
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-pink-500"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-4">
                    <p className="font-semibold text-sm mb-2">Color</p>

                    <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => {
                                    setSelectedColor(color);
                                    setError("");
                                }}
                                className={`px-3 py-2 rounded-full border text-xs font-semibold transition ${selectedColor === color
                                        ? "bg-pink-600 text-white border-pink-600"
                                        : "bg-white text-gray-700 border-gray-200 hover:border-pink-500"
                                    }`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>

                {selectedVariant && (
                    <p
                        className={`text-sm font-semibold mb-3 ${isOutOfStock ? "text-red-500" : "text-green-600"
                            }`}
                    >
                        {isOutOfStock
                            ? "Out of Stock"
                            : `In Stock (${selectedVariant.stock_quantity})`}
                    </p>
                )}

                {error && (
                    <p className="text-red-500 text-sm font-semibold mb-3">
                        {error}
                    </p>
                )}

                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full py-3 rounded-full font-semibold transition ${isOutOfStock
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-black hover:bg-pink-600 text-white"
                        }`}
                >
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
}