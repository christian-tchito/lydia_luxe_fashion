"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
            setLoading(false);
            return;
        }

        router.push("/admin");
    };

    return (
        <main className="min-h-screen bg-white px-6 flex items-center justify-center">
            <section className="w-full max-w-md border border-pink-100 rounded-2xl p-8 shadow-sm">
                <p className="text-pink-600 font-semibold mb-2">
                    Admin Access
                </p>

                <h1 className="text-3xl font-extrabold mb-6">
                    Login
                </h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500"
                    />

                    <input
                        type="password"
                        placeholder="Admin Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500"
                    />

                    {message && (
                        <p className="text-sm font-semibold text-red-500">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black hover:bg-pink-600 text-white py-3.5 rounded-full font-semibold transition disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </section>
        </main>
    );
}