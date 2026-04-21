"use client";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (data.auth) {
                window.location.href = "/dashboard";
            } else {
                setError(data.error || "Invalid credentials");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fbff] p-6">
            <div className="mb-10 flex flex-col items-center gap-3">
                <img src="/logo.png" className="w-16 h-16" alt="NexusPay Logo" />
                <h1 className="text-3xl font-black text-[#02042b]">NexusPay</h1>
            </div>

            <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl shadow-blue-500/5 border border-slate-100">
                <h2 className="mb-2 text-xl font-bold text-[#02042b]">Welcome Back</h2>
                <p className="mb-8 text-sm font-medium text-slate-500">Enter your credentials to access your dashboard</p>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#3395FF] focus:ring-1 focus:ring-[#3395FF] transition-all font-medium"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#3395FF] focus:ring-1 focus:ring-[#3395FF] transition-all font-medium"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#3395FF] text-white font-black rounded-lg hover:bg-blue-600 shadow-lg shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In to Dashboard"}
                    </button>
                </form>

                <div className="mt-10 text-center text-sm font-medium text-slate-500">
                    Don't have an account? <a href="/signup" className="font-bold text-[#3395FF] hover:underline">Create one for free</a>
                </div>
            </div>

            <div className="mt-8 flex gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <a href="/" className="hover:text-slate-600">Home</a>
                <a href="#" className="hover:text-slate-600">Terms</a>
                <a href="#" className="hover:text-slate-600">Privacy</a>
            </div>
        </div>
    );
}