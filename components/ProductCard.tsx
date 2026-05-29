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
    const [showImageModal, setShowImageModal] = useState(false);
    const [error, setError] = useState("");

    const requiresSize =
        product.category === "Clothes" || product.category === "Shoes";

    const allSizes =
        product.sizes
            ?.flatMap((size) => size.split(",").map((s) => s.trim()))
            .filter(Boolean) || [];

    const selectedVariant = product.product_variants?.find((variant) => {
        const colorMatches = variant.color === selectedColor;

        const variantSizes =
            variant.size
                ?.split(",")
                .map((s) => s.trim())
                .filter(Boolean) || [];

        const sizeMatches = requiresSize
            ? variantSizes.includes(selectedSize)
            : true;

        return colorMatches && sizeMatches;
    });

    const displayImage = selectedVariant?.image_url || product.image || "";

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
        <>
            <div className="bg-white rounded-2xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-md transition">
                <div className="h-40 sm:h-48 md:h-52 bg-[#faf7f8] overflow-hidden">
                    {displayImage ? (
                        <img
                            src={displayImage}
                            alt={product.name}
                            onClick={() => setShowImageModal(true)}
                            className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition duration-300"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            No Image
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <p className="text-pink-600 text-[11px] font-bold uppercase tracking-wide mb-1">
                        {product.category}
                    </p>

                    <h3 className="text-base font-bold mb-1 line-clamp-1">
                        {product.name}
                    </h3>

                    <p className="font-bold text-lg mb-3">
                        ${product.price}
                    </p>

                    {requiresSize && allSizes.length > 0 && (
                        <div className="mb-3">
                            <p className="font-semibold text-xs mb-1">
                                Size
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                                {allSizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => {
                                            setSelectedSize(size);
                                            setError("");
                                        }}
                                        className={`px-2.5 py-1.5 rounded-full border text-[11px] font-semibold transition ${selectedSize === size
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

                    <div className="mb-3">
                        <p className="font-semibold text-xs mb-1">
                            Color
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                            {product.colors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => {
                                        setSelectedColor(color);
                                        setError("");
                                    }}
                                    className={`px-2.5 py-1.5 rounded-full border text-[11px] font-semibold transition ${selectedColor === color
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
                            className={`text-xs font-semibold mb-2 ${isOutOfStock
                                    ? "text-red-500"
                                    : "text-green-600"
                                }`}
                        >
                            {isOutOfStock
                                ? "Out of Stock"
                                : `In Stock (${selectedVariant.stock_quantity})`}
                        </p>
                    )}

                    {error && (
                        <p className="text-red-500 text-xs font-semibold mb-2">
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleAddToCart}
                        disabled={!!isOutOfStock}
                        className={`w-full py-2.5 rounded-full text-sm font-semibold transition ${isOutOfStock
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-black hover:bg-pink-600 text-white"
                            }`}
                    >
                        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>
                </div>
            </div>

            {showImageModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setShowImageModal(false)}
                >
                    <button
                        onClick={() => setShowImageModal(false)}
                        className="absolute top-4 right-6 text-white text-5xl font-bold"
                    >
                        ×
                    </button>

                    <img
                        src={displayImage}
                        alt={product.name}
                        className="max-h-[90vh] max-w-[95vw] object-contain rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}