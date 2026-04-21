"use client";
import { useState } from "react";

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
            if (data.auth) {
                window.location.href = "/login";
            } else {
                setError(data.error || "Failed to register");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fbff] p-6 text-slate-900">
             <div className="mb-10 flex flex-col items-center gap-3">
                <img src="/logo.png" className="w-16 h-16" alt="NexusPay Logo" />
                <h1 className="text-3xl font-black text-[#02042b]">NexusPay</h1>
            </div>

            <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl shadow-blue-500/5 border border-slate-100">
                <h2 className="mb-2 text-xl font-bold text-[#02042b]">Create your account</h2>
                <p className="mb-8 text-sm font-medium text-slate-500">Start accepting UPI payments in less than 5 minutes.</p>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Business Name</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#3395FF] focus:ring-1 focus:ring-[#3395FF] transition-all font-medium"
                            placeholder="Zomato Pvt Ltd"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Work Email</label>
                        <input
                            type="email"
                            required
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#3395FF] focus:ring-1 focus:ring-[#3395FF] transition-all font-medium"
                            placeholder="ceo@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Create Password</label>
                        <input
                            type="password"
                            required
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#3395FF] focus:ring-1 focus:ring-[#3395FF] transition-all font-medium"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#3395FF] text-white font-black rounded-lg hover:bg-blue-600 shadow-lg shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Start Free Trial"}
                    </button>
                </form>

                 <div className="mt-10 text-center text-sm font-medium text-slate-500">
                    Already have an account? <a href="/login" className="font-bold text-[#3395FF] hover:underline">Log in</a>
                </div>
            </div>

            <div className="mt-8 flex gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                Check our <a href="#" className="hover:text-slate-600 underline">Privacy Policy</a> and <a href="#" className="hover:text-slate-600 underline">Terms of Service</a>
            </div>
        </div>
    );
}