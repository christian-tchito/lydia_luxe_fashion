"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
    const {
        cart,
        cartTotal,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
    } = useCart();

    return (
        <main className="min-h-screen bg-white px-6 md:px-16 py-12 md:py-16">
            {/* Header */}
            <section className="text-center mb-12">
                <p className="inline-block bg-pink-50 text-pink-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    Shopping Bag
                </p>

                <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                    Your Cart
                </h1>

                <p className="text-base md:text-lg text-gray-500">
                    Review your items before checkout.
                </p>
            </section>

            {/* Empty Cart */}
            {cart.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-pink-100 text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
                        Your cart is empty
                    </h2>

                    <p className="text-gray-500 mb-8">
                        Add items to your cart and continue shopping.
                    </p>

                    <Link
                        href="/shop"
                        className="inline-block bg-black hover:bg-pink-600 text-white px-7 py-3.5 rounded-full font-semibold transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-5">
                        {cart.map((item, index) => (
                            <div
                                key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                                className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-pink-100 flex flex-col md:flex-row justify-between gap-6"
                            >
                                {/* Product Info */}
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-[#fff4f7] flex items-center justify-center text-xs text-gray-400">
                                        Image
                                    </div>

                                    <div>
                                        <p className="text-pink-600 font-semibold text-xs uppercase tracking-wide mb-1">
                                            {item.category}
                                        </p>

                                        <h2 className="text-xl md:text-2xl font-extrabold mb-2">
                                            {item.name}
                                        </h2>

                                        <p className="text-lg font-bold text-black mb-2">
                                            ${item.price}
                                        </p>

                                        <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                                            {item.selectedSize && (
                                                <span className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                                                    Size: {item.selectedSize}
                                                </span>
                                            )}

                                            {item.selectedColor && (
                                                <span className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                                                    Color: {item.selectedColor}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex md:flex-col items-center md:items-end justify-between gap-4">
                                    <div className="flex items-center gap-3 border border-gray-200 rounded-full px-3 py-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                decreaseQuantity(
                                                    item.id,
                                                    item.selectedSize,
                                                    item.selectedColor
                                                )
                                            }
                                            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-pink-50 transition"
                                        >
                                            -
                                        </button>

                                        <span className="font-bold min-w-5 text-center">
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                increaseQuantity(
                                                    item.id,
                                                    item.selectedSize,
                                                    item.selectedColor
                                                )
                                            }
                                            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-pink-50 transition"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeFromCart(
                                                item.id,
                                                item.selectedSize,
                                                item.selectedColor
                                            )
                                        }
                                        className="text-sm text-gray-500 hover:text-pink-600 font-semibold"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-pink-100 h-fit lg:sticky lg:top-28">
                        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">
                            Order Summary
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${cartTotal}</span>
                            </div>

                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>

                            <div className="border-t border-pink-100 pt-5 flex justify-between text-xl md:text-2xl font-extrabold">
                                <span>Total</span>
                                <span>${cartTotal}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="block text-center bg-black hover:bg-pink-600 text-white py-3.5 rounded-full font-semibold transition"
                        >
                            Proceed to Checkout
                        </Link>

                        <Link
                            href="/shop"
                            className="block text-center mt-4 border border-gray-300 text-black py-3.5 rounded-full font-semibold hover:border-pink-500 hover:text-pink-600 transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            )}
        </main>
    );
}