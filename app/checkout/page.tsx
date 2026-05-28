"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();

    const [paymentMethod, setPaymentMethod] = useState("zelle");
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !phone || !address || !city) {
            alert("Please fill all required fields.");
            return;
        }

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        setLoading(true);

        try {
            if (paymentMethod === "card") {
                const response = await fetch("/api/checkout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cart,
                        customer: {
                            name,
                            email,
                            phone,
                            address,
                            city,
                        },
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.error || "Unable to start card payment.");
                    setLoading(false);
                    return;
                }

                if (data.url) {
                    window.location.href = data.url;
                    return;
                }

                alert("Unable to open payment page.");
                setLoading(false);
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
📧 Email: ${email || "Not provided"}

📍 Address:
${address}
${city}

🛒 Order:
${orderItems}

💰 Total: $${cartTotal}

💳 Payment Method: ${paymentMethod.toUpperCase()}

📸 Please attach your payment screenshot after sending payment.
            `;

            const whatsappNumber = "16142969211";

            const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                message
            )}`;

            window.open(url, "_blank");

            clearCart();
            router.push("/order-success");
        } catch (error) {
            alert("Something went wrong. Please try again.");
            setLoading(false);
        }
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
                    Choose WhatsApp payment confirmation or secure card payment.
                </p>
            </section>

            <div className="grid lg:grid-cols-2 gap-8">
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
                                        {method === "cashapp"
                                            ? "CASH APP"
                                            : method.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

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
                                        After sending payment, place your order
                                        and attach your screenshot in WhatsApp.
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
                                        After sending payment, place your order
                                        and attach your screenshot in WhatsApp.
                                    </p>
                                </div>
                            )}

                            {paymentMethod === "card" && (
                                <div>
                                    <h4 className="font-bold text-lg mb-2">
                                        Credit / Debit Card
                                    </h4>
                                    <p className="text-gray-600">
                                        You will be redirected to Stripe secure
                                        checkout to complete your payment.
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black hover:bg-pink-600 text-white py-3.5 rounded-full font-semibold transition disabled:opacity-60"
                        >
                            {loading
                                ? "Processing..."
                                : paymentMethod === "card"
                                    ? "Pay with Card"
                                    : "Place Order via WhatsApp"}
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
                    <h2 className="text-2xl font-extrabold mb-6">
                        Order Summary
                    </h2>

                    {cart.length === 0 ? (
                        <p className="text-gray-500">Your cart is empty.</p>
                    ) : (
                        cart.map((item, index) => (
                            <div
                                key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                                className="mb-4 border-b border-pink-100 pb-4"
                            >
                                <div className="flex justify-between gap-4">
                                    <div>
                                        <p className="font-bold">
                                            {item.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {item.selectedColor}{" "}
                                            {item.selectedSize} x
                                            {item.quantity}
                                        </p>
                                    </div>

                                    <p className="font-semibold">
                                        ${item.price * item.quantity}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}

                    <div className="mt-6 font-bold text-xl flex justify-between">
                        <span>Total:</span>
                        <span>${cartTotal}</span>
                    </div>
                </div>
            </div>
        </main>
    );
}