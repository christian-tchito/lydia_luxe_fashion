import Link from "next/link";

export default function OrderSuccessPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100 px-6 md:px-16 py-20 flex items-center justify-center">
            <section className="bg-white rounded-[3rem] p-10 md:p-16 shadow-sm border border-pink-100 text-center max-w-2xl">
                <div className="text-7xl mb-6">💕</div>

                <h1 className="text-5xl font-extrabold mb-5">
                    Order Received!
                </h1>

                <p className="text-gray-600 text-lg mb-8">
                    Thank you for shopping with Lydia’s Luxe Fashion. Please complete your selected payment method, then contact us if needed.
                </p>

                <div className="bg-pink-50 border border-pink-100 rounded-2xl p-5 text-left mb-8">
                    <p className="font-bold mb-2">Payment Reminder:</p>
                    <p className="text-gray-600">
                        Zelle: 614-296-9211
                    </p>
                    <p className="text-gray-600">
                        Cash App: $YourCashTagHere
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    <Link
                        href="/shop"
                        className="bg-pink-500 text-white px-8 py-4 rounded-full font-bold"
                    >
                        Continue Shopping
                    </Link>

                    <a
                        href="https://wa.me/16142969211"
                        className="bg-black text-white px-8 py-4 rounded-full font-bold"
                    >
                        Contact on WhatsApp
                    </a>
                </div>
            </section>
        </main>
    );
}