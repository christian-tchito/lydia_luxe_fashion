"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();

    const [paymentMethod, setPaymentMethod] = useState("zelle");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");

    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !phone || !address || !city) {
            alert("Please fill all required fields.");
            return;
        }

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const orderItems = cart
            .map((item) => {
                return `• ${item.name} (${item.selectedColor || ""}${item.selectedSize ? " / " + item.selectedSize : ""
                    }) x${item.quantity} - $${item.price * item.quantity}`;
            })
            .join("\n");

        const message = `
🛍️ *NEW ORDER - Lydia’s Luxe Fashion*

👤 Name: ${name}
📞 Phone: ${phone}
📧 Email: ${email}

📍 Address:
${address}
${city}

🛒 Order:
${orderItems}

💰 Total: $${cartTotal}

💳 Payment Method: ${paymentMethod.toUpperCase()}

${paymentMethod === "zelle" || paymentMethod === "cashapp"
                ? "📸 Please attach your payment screenshot after sending payment."
                : ""
            }
        `;

        const whatsappNumber = "16142969211";

        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            message
        )}`;

        window.open(url, "_blank");

        clearCart();
        router.push("/order-success");
    };

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
                    Complete your order via WhatsApp.
                </p>
            </section>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* FORM */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-pink-100">
                    <h2 className="text-2xl font-extrabold mb-6">
                        Customer Information
                    </h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3"
                        />

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3"
                        />

                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3"
                        />

                        <input
                            type="text"
                            placeholder="Shipping Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3"
                        />

                        <input
                            type="text"
                            placeholder="City, State, ZIP"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3"
                        />

                        {/* PAYMENT */}
                        <div className="pt-4">
                            <h3 className="text-xl font-extrabold mb-4">
                                Payment Method
                            </h3>

                            <div className="grid grid-cols-3 gap-3">
                                {["zelle", "cashapp", "card"].map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setPaymentMethod(method)}
                                        className={`rounded-xl p-4 border font-semibold transition ${paymentMethod === method
                                                ? "bg-black text-white"
                                                : "bg-white border-gray-200 hover:border-pink-500"
                                            }`}
                                    >
                                        {method.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black hover:bg-pink-600 text-white py-3.5 rounded-full font-semibold transition"
                        >
                            Place Order via WhatsApp
                        </button>
                    </form>
                </div>

                {/* SUMMARY */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
                    <h2 className="text-2xl font-extrabold mb-6">
                        Order Summary
                    </h2>

                    {cart.length === 0 ? (
                        <p className="text-gray-500">Your cart is empty.</p>
                    ) : (
                        cart.map((item, index) => (
                            <div key={index} className="mb-4">
                                <p className="font-bold">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    {item.selectedColor} {item.selectedSize} x
                                    {item.quantity}
                                </p>
                            </div>
                        ))
                    )}

                    <div className="mt-6 font-bold text-xl">
                        Total: ${cartTotal}
                    </div>
                </div>
            </div>
        </main>
    );
}