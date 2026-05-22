export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#fff8f5] px-6 md:px-16 py-16">
            <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
                <div>
                    <p className="text-pink-600 font-semibold mb-3">Contact Us</p>

                    <h1 className="text-5xl font-extrabold mb-6">
                        Need help with an order?
                    </h1>

                    <p className="text-lg text-gray-600 leading-8 mb-8">
                        Contact Lydia’s Luxe Fashion for product questions, sizing,
                        availability, delivery, and order support.
                    </p>

                    <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                        <p>
                            <strong>Location:</strong> Columbus, Ohio
                        </p>

                        <p>
                            <strong>Phone:</strong> 614-296-9211
                        </p>

                        <p>
                            <strong>Business:</strong> Clothes, Shoes, Bags & Jewelry
                        </p>

                        <a
                            href="https://wa.me/16142969211"
                            className="inline-block bg-pink-600 text-white px-7 py-3 rounded-full font-semibold"
                        >
                            Message on WhatsApp
                        </a>
                    </div>
                </div>

                <form className="bg-white rounded-[2rem] p-8 shadow-sm space-y-5">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
                    />

                    <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
                    />

                    <textarea
                        placeholder="Message"
                        rows={6}
                        className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-4 rounded-full font-semibold"
                    >
                        Send Message
                    </button>
                </form>
            </section>
        </main>
    );
}