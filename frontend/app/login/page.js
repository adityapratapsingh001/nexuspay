"use client";
import { useState } from "react";
import Link from "next/link";
import { MdArrowBack, MdLockOutline, MdEmail } from "react-icons/md";

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
                localStorage.setItem("userEmail", email);
                localStorage.setItem("token", data.token);
                if (data.onboarded) {
                    window.location.href = "/dashboard";
                } else {
                    window.location.href = "/onboarding";
                }
            } else {
                setError(data.error || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            setError("A network error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white flex overflow-hidden">

            {/* Left Side - Visual */}
            <div className="hidden lg:flex flex-1 bg-secondary relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-grid opacity-[0.05]"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary filter blur-[200px] opacity-10 -mr-40 -mt-40"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent filter blur-[150px] opacity-10 -ml-20 -mb-20"></div>

                <div className="relative z-10 max-w-lg px-12">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                        <img src="/logo.png" className="w-11 h-11 rounded-lg border-1 border-[#02042B]" alt="Logo" />
                    </div>
                    <h2 className="text-5xl font-black text-white leading-tight mb-6">
                        The Operating <br /> System for <br /> <span className="text-highlight text-gradient">Indian Commerce.</span>
                    </h2>
                    <p className="text-slate-400 text-xl font-medium leading-relaxed">
                        Join 50,000+ businesses who rely on NexusPay to power their payments and financial operations.
                    </p>

                    <div className="mt-12 flex flex-col gap-6">
                        {[
                            "0% Transaction Fees",
                            "Instant Bank Settlements",
                            "PCI-DSS Compliant Security"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-slate-300 font-bold">
                                <div className="w-5 h-5 rounded-full bg-highlight/50 flex items-center justify-center text-primary text-xs">✓</div>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col bg-[#fcfdfe]">
                <div className="p-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors">
                        <MdArrowBack className="text-xl" /> Back to Website
                    </Link>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-20 lg:px-32">
                    <div className="w-full max-w-md">
                        <div className="mb-10 lg:hidden">
                            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                                <img src="/logo.png" className="w-11 h-11 rounded-lg border-1 border-[#02042B]" alt="Logo" />
                            </div>
                        </div>

                        <h1 className="text-4xl font-black text-secondary mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-500 font-medium mb-10">Securely sign in to your merchant dashboard.</p>

                        {error && (
                            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-black shrink-0 mt-0.5">!</div>
                                <p className="text-sm font-bold text-red-600 leading-tight">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="group">
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Merchant Email</label>
                                <div className="relative">
                                    <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-secondary"
                                        placeholder="name@business.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                                    <a href="#" className="text-[11px] font-black text-primary hover:underline uppercase tracking-widest">Forgot?</a>
                                </div>
                                <div className="relative">
                                    <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-secondary"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-5 text-lg shadow-blue-500/30 mt-4 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        <span>Authenticating...</span>
                                    </div>
                                ) : "Sign In to Dashboard"}
                            </button>
                        </form>

                        <div className="mt-12 text-center">
                            <p className="text-slate-400 font-bold text-sm">
                                Don't have a merchant account? <br className="md:hidden" />
                                <Link href="/signup" className="text-primary hover:underline ml-1">Create one for free</Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 flex justify-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50">
                    <a href="#" className="hover:text-secondary">Security</a>
                    <a href="#" className="hover:text-secondary">Privacy</a>
                    <a href="#" className="hover:text-secondary">Terms</a>
                    <a href="#" className="hover:text-secondary">Support</a>
                </div>
            </div>
        </div>
    );
}