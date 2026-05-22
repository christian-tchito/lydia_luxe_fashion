"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState("zelle");
    const router = useRouter();

    return (
        <main className="min-h-screen bg-white px-6 md:px-16 py-12 md:py-16">
            <section className="text-center mb-12">
                <p className="inline-block bg-pink-50 text-pink-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    Secure Checkout
                </p>

                <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                    Checkout
                </h1>

                <p className="text-gray-500">
                    Choose Zelle, Cash App, or credit/debit card.
                </p>
            </section>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Customer Form */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-pink-100">
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-6">
                        Customer Information
                    </h2>

                    <form
                        className="space-y-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            clearCart();
                            router.push("/order-success");
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-pink-500"
                        />

                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-pink-500"
                        />

                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-pink-500"
                        />

                        <input
                            type="text"
                            placeholder="Shipping Address"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-pink-500"
                        />

                        <input
                            type="text"
                            placeholder="City, State, ZIP"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-pink-500"
                        />

                        {/* Payment Method */}
                        <div className="pt-4">
                            <h3 className="text-xl md:text-2xl font-extrabold mb-4">
                                Payment Method
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("zelle")}
                                    className={`rounded-xl p-4 border font-semibold transition ${paymentMethod === "zelle"
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-black border-gray-200 hover:border-pink-500"
                                        }`}
                                >
                                    Zelle
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("cashapp")}
                                    className={`rounded-xl p-4 border font-semibold transition ${paymentMethod === "cashapp"
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-black border-gray-200 hover:border-pink-500"
                                        }`}
                                >
                                    Cash App
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("card")}
                                    className={`rounded-xl p-4 border font-semibold transition ${paymentMethod === "card"
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-black border-gray-200 hover:border-pink-500"
                                        }`}
                                >
                                    Card
                                </button>
                            </div>
                        </div>

                        {/* Payment Instructions */}
                        <div className="bg-[#fff4f7] border border-pink-100 rounded-xl p-5">
                            {paymentMethod === "zelle" && (
                                <div>
                                    <h4 className="font-bold text-lg mb-2">
                                        Pay with Zelle
                                    </h4>

                                    <p className="text-gray-600">
                                        Send payment to:{" "}
                                        <strong>614-296-9211</strong>
                                    </p>

                                    <p className="text-gray-600 mt-2">
                                        Include your name in the memo after payment.
                                    </p>
                                </div>
                            )}

                            {paymentMethod === "cashapp" && (
                                <div>
                                    <h4 className="font-bold text-lg mb-2">
                                        Pay with Cash App
                                    </h4>

                                    <p className="text-gray-600">
                                        Send payment to:{" "}
                                        <strong>$LydiaTchito</strong>
                                    </p>

                                    <p className="text-gray-600 mt-2">
                                        Include your name in the note after payment.
                                    </p>
                                </div>
                            )}

                            {paymentMethod === "card" && (
                                <div>
                                    <h4 className="font-bold text-lg mb-2">
                                        Credit / Debit Card
                                    </h4>

                                    <p className="text-gray-600">
                                        Card payment will be connected using Stripe.
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black hover:bg-pink-600 text-white py-3.5 rounded-full font-semibold transition"
                        >
                            Place Order
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-pink-100 h-fit">
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-6">
                        Order Summary
                    </h2>

                    <div className="space-y-5">
                        {cart.length === 0 ? (
                            <p className="text-gray-500">
                                Your cart is empty.
                            </p>
                        ) : (
                            cart.map((item, index) => (
                                <div
                                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                                    className="flex justify-between gap-4 border-b border-pink-100 pb-4"
                                >
                                    <div>
                                        <p className="font-bold">
                                            {item.name}
                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            Qty: {item.quantity}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                                            {item.selectedSize && (
                                                <span className="bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
                                                    Size: {item.selectedSize}
                                                </span>
                                            )}

                                            {item.selectedColor && (
                                                <span className="bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
                                                    Color: {item.selectedColor}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="font-semibold whitespace-nowrap">
                                        ${item.price * item.quantity}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex justify-between mt-8 text-gray-600">
                        <span>Subtotal</span>
                        <span>${cartTotal}</span>
                    </div>

                    <div className="flex justify-between mt-3 text-gray-600">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>

                    <div className="flex justify-between mt-6 pt-6 border-t border-pink-100 text-xl md:text-2xl font-extrabold">
                        <span>Total</span>
                        <span>${cartTotal}</span>
                    </div>

                    <div className="mt-8 bg-[#fff4f7] border border-pink-100 rounded-xl p-5">
                        <p className="text-sm text-gray-700 leading-6">
                            Zelle and Cash App payments are confirmed manually.
                            Credit/debit card payment will be processed through
                            Stripe when connected.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}