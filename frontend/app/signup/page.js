"use client";
import { useState } from "react";
import Link from "next/link";
import { MdArrowBack, MdLockOutline, MdEmail, MdBusiness } from "react-icons/md";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.auth && data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userEmail", formData.email);
                window.location.href = "/onboarding";
            } else {
                setError(data.error || "Failed to register account. Please try again.");
            }
        } catch (err) {
            setError("A network error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white flex overflow-hidden">

            {/* Left Side - Visual */}
            <div className="hidden lg:flex flex-1 bg-secondary relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-grid opacity-[0.05]"></div>
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary filter blur-[200px] opacity-10 -ml-40 -mt-40"></div>

                <div className="relative z-10 max-w-lg px-12">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                        <img src="/logo.png" className="w-11 h-11 rounded-lg border-1 border-[#02042B]" alt="Logo" />
                    </div>
                    <h2 className="text-5xl font-black text-white leading-tight mb-6">
                        Scale your <br /> business with <br /> <span className="text-highlight text-gradient">NexusPay.</span>
                    </h2>
                    <p className="text-slate-400 text-xl font-medium leading-relaxed">
                        The most developer-friendly payment infrastructure in India. Start accepting payments in minutes.
                    </p>

                    <div className="mt-12 space-y-6">
                        {[
                            { title: "Zero Setup Fee", desc: "No hidden charges to get started." },
                            { title: "Instant Verification", desc: "Get live in under 2 hours." },
                            { title: "Universal Integration", desc: "Support for all major web & mobile platforms." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-highlight/50 flex items-center justify-center text-primary text-xs shrink-0 mt-1">✓</div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">{item.title}</h4>
                                    <p className="text-slate-500 text-sm">{item.desc}</p>
                                </div>
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
                        <div className="mb-10 lg:hidden text-center">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                                <img src="/logo.png" className="w-8 h-8 brightness-0 invert" alt="Logo" />
                            </div>
                        </div>

                        <h1 className="text-4xl font-black text-secondary mb-2 tracking-tight">Create Account</h1>
                        <p className="text-slate-500 font-medium mb-10">Join 50,000+ businesses using NexusPay.</p>

                        {error && (
                            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-black shrink-0 mt-0.5">!</div>
                                <p className="text-sm font-bold text-red-600 leading-tight">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSignup} className="space-y-6">
                            <div className="group">
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Business Name</label>
                                <div className="relative">
                                    <MdBusiness className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-secondary"
                                        placeholder="Acme Corp Pvt Ltd"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Work Email</label>
                                <div className="relative">
                                    <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-secondary"
                                        placeholder="ceo@company.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
                                <div className="relative">
                                    <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-secondary"
                                        placeholder="••••••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <p className="mt-2 text-[10px] text-slate-400 font-bold px-1">Must be at least 8 characters long.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-5 text-lg shadow-blue-500/30 mt-4 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        <span>Creating Account...</span>
                                    </div>
                                ) : "Create Free Account"}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-slate-400 font-bold text-sm">
                                Already have an account?
                                <Link href="/login" className="text-primary hover:underline ml-1">Log in here</Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 flex justify-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50">
                    <p>By signing up, you agree to our <a href="#" className="text-secondary hover:underline">Terms</a> and <a href="#" className="text-secondary hover:underline">Privacy</a></p>
                </div>
            </div>
        </div>
    );
}