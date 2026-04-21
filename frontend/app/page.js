"use client";
import { useEffect, useState } from "react";
import { MdVerified, MdBolt, MdSecurity, MdQrCodeScanner, MdArrowForward } from "react-icons/md";

export default function LandingPage() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => setLoggedIn(data.auth === true))
            .catch(() => setLoggedIn(false));
    }, []);

    return (
        <div className="min-h-screen w-full bg-[#f8fbff] text-slate-900 font-sans selection:bg-blue-100">
            
            {/* Background Grain/Grid */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            {/* NAV BAR */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" className="w-10 h-10 object-contain" alt="NexusPay Logo" />
                    <span className="text-2xl font-bold tracking-tight text-[#02042b]">NexusPay</span>
                </div>

                <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
                    <a href="#features" className="hover:text-[#3395FF] transition-colors">Products</a>
                    <a href="#features" className="hover:text-[#3395FF] transition-colors">Pricing</a>
                    <a href="#" className="hover:text-[#3395FF] transition-colors">Resources</a>
                </div>

                <div className="flex items-center gap-4">
                    {!loggedIn ? (
                        <>
                            <a href="/login" className="hidden md:block text-sm font-semibold text-[#3395FF] hover:text-blue-700">
                                Log In
                            </a>
                            <a href="/signup" className="px-6 py-2.5 text-sm font-bold text-white bg-[#3395FF] rounded-md hover:bg-blue-600 transition-all shadow-md">
                                Sign Up
                            </a>
                        </>
                    ) : (
                        <a href="/dashboard" className="px-6 py-2.5 text-sm font-bold text-white bg-[#3395FF] rounded-md hover:bg-blue-600 transition-all shadow-md">
                            Dashboard
                        </a>
                    )}
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative z-10 pt-48 pb-24 px-6 flex flex-col items-center text-center">
                
                {/* Badge */}
                <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Powering 10,000+ Indian Businesses
                </div>

                <h1 className="max-w-5xl text-5xl md:text-8xl font-black tracking-tight text-[#02042b] leading-[1]">
                    The New Standard <br className="hidden md:block" />
                    of <span className="text-[#3395FF]">Digital Payments</span>
                </h1>

                <p className="mt-8 max-w-2xl text-xl text-slate-500 font-medium leading-relaxed">
                    Scale your business with India's most developer-friendly payment infrastructure. 
                    Zero setup fees. Zero transaction fees. Total control.
                </p>

                <div className="mt-12 flex flex-wrap justify-center gap-5">
                    <a href="/signup" className="inline-flex items-center gap-3 px-10 py-5 text-lg font-black text-white bg-[#3395FF] rounded-lg hover:bg-blue-600 transition-all hover:scale-105 shadow-xl shadow-blue-500/20">
                        Get Started for Free
                        <MdArrowForward className="text-2xl" />
                    </a>
                    <a href="#features" className="px-10 py-5 text-lg font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
                        View Demo
                    </a>
                </div>

                {/* HERO IMAGE/DASHBOARD PREVIEW MOCKUP */}
                <div className="mt-20 w-full max-w-6xl mx-auto rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white p-2">
                    <div className="bg-slate-50 rounded-2xl w-full h-[400px] md:h-[600px] flex items-center justify-center relative overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-transparent"></div>
                         <div className="relative z-10 text-slate-300 font-black text-9xl rotate-[-5deg] opacity-10">DASHBOARD_UI</div>
                         {/* Abstract UI Elements */}
                         <div className="absolute top-10 left-10 w-48 h-32 bg-white rounded-xl shadow-lg border border-slate-100 flex flex-col p-4">
                             <div className="w-1/2 h-2 bg-slate-100 rounded mb-2"></div>
                             <div className="w-3/4 h-4 bg-blue-500/10 rounded mb-4"></div>
                             <div className="mt-auto w-full h-8 bg-[#3395FF] rounded"></div>
                         </div>
                         <div className="absolute bottom-20 right-10 w-64 h-80 bg-white rounded-xl shadow-2xl border border-slate-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-50"></div>
                                <div className="space-y-1">
                                    <div className="w-20 h-2 bg-slate-100 rounded"></div>
                                    <div className="w-12 h-2 bg-slate-50 rounded"></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="flex justify-between items-center">
                                        <div className="w-24 h-2 bg-slate-100 rounded"></div>
                                        <div className="w-8 h-2 bg-blue-100 rounded"></div>
                                    </div>
                                ))}
                            </div>
                         </div>
                    </div>
                </div>
            </section>

            {/* TRUSTED BY */}
            <section className="py-20 bg-white border-y border-slate-100 text-center">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-10">Trusted by fast-growing startups</p>
                <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale items-center">
                    <div className="text-3xl font-black text-slate-900">ZEPTO</div>
                    <div className="text-3xl font-black text-slate-900">CRED</div>
                    <div className="text-3xl font-black text-slate-900">SWIGGY</div>
                    <div className="text-3xl font-black text-slate-900">ZOMATO</div>
                    <div className="text-3xl font-black text-slate-900">RAZORPAY</div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="py-32 px-6 md:px-20">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-sm font-black text-[#3395FF] uppercase tracking-widest mb-4">Why NexusPay?</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-[#02042b] mb-20 leading-tight">
                        Payments that feel <br /> like Magic.
                    </h3>

                    <div className="grid md:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <div className="p-10 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 text-left">
                            <div className="w-16 h-16 mb-8 rounded-2xl bg-blue-50 flex items-center justify-center text-[#3395FF] text-3xl shadow-inner">
                                <MdBolt />
                            </div>
                            <h4 className="text-2xl font-bold text-[#02042b] mb-4">Zero Transaction Fee</h4>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                Keep 100% of the money you earn. We don't take a cut. No hidden MDR, no surprise charges.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-10 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 text-left">
                            <div className="w-16 h-16 mb-8 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 text-3xl shadow-inner">
                                <MdSecurity />
                            </div>
                            <h4 className="text-2xl font-bold text-[#02042b] mb-4">Bank-Grade Security</h4>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                Every transaction is backed by military-grade AES-256 encryption and PCI-compliant architecture.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-10 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 text-left">
                            <div className="w-16 h-16 mb-8 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-500 text-3xl shadow-inner">
                                <MdQrCodeScanner />
                            </div>
                            <h4 className="text-2xl font-bold text-[#02042b] mb-4">Modern SDKs</h4>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                Integrate in minutes, not days. We provide clean RESTful APIs and lightweight SDKs for all platforms.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-32 px-6">
                <div className="max-w-6xl mx-auto rounded-[3rem] bg-[#02042b] p-12 md:p-24 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500 filter blur-[200px] opacity-10"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3395FF] filter blur-[150px] opacity-10"></div>
                    
                    <h2 className="relative z-10 text-4xl md:text-6xl font-black text-white mb-8">
                        Ready to supercharge <br /> your business?
                    </h2>
                    <p className="relative z-10 max-w-xl mx-auto text-blue-100/60 text-xl font-medium mb-12">
                        Join 10,000+ businesses who switched to NexusPay and saved ₹50Cr+ in transaction fees last year.
                    </p>
                    <div className="relative z-10 flex flex-wrap justify-center gap-6">
                        <a href="/signup" className="px-12 py-5 text-xl font-black text-[#02042b] bg-white rounded-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95">
                            Create Free Account
                        </a>
                        <a href="#" className="px-12 py-5 text-xl font-bold text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all">
                            Talk to Expert
                        </a>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" className="w-8 h-8 contrast-125" alt="NexusPay Logo" />
                        <span className="text-xl font-black text-[#02042b]">NexusPay</span>
                    </div>
                    <div className="flex gap-10 text-slate-500 font-bold text-sm">
                        <a href="#" className="hover:text-[#3395FF]">Security</a>
                        <a href="#" className="hover:text-[#3395FF]">Privacy</a>
                        <a href="#" className="hover:text-[#3395FF]">Terms</a>
                        <a href="#" className="hover:text-[#3395FF]">Help</a>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">
                        © {new Date().getFullYear()} NexusPay India. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}