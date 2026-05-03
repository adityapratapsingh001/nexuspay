"use client";
import { useEffect, useState } from "react";
import {
    MdVerified,
    MdBolt,
    MdSecurity,
    MdQrCodeScanner,
    MdArrowForward,
    MdKeyboardArrowDown,
    MdPlayCircleFilled,
    MdCode,
    MdLayers,
    MdAutoGraph,
    MdOutlineAccountBalanceWallet,
    MdOutlineIntegrationInstructions
} from "react-icons/md";
import { SiSwift, SiPython, SiNodedotjs, SiGo, SiPhp } from "react-icons/si";

export default function LandingPage() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => setLoggedIn(data.auth === true))
            .catch(() => setLoggedIn(false));

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen w-full bg-white text-slate-900 font-sans selection:bg-blue-100">

            {/* NAV BAR */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 py-4 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 py-3" : "bg-transparent"
                }`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                                <img src="/logo.png" className="w-8 h-8 rounded-lg border-1 border-[#02042B]" alt="NexusPay Logo" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-secondary">NexusPay</span>
                        </div>

                        <div className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-slate-600">
                            <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer group">
                                Products <MdKeyboardArrowDown className="group-hover:rotate-180 transition-transform" />
                            </div>
                            <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer group">
                                Solutions <MdKeyboardArrowDown className="group-hover:rotate-180 transition-transform" />
                            </div>
                            <a href="#features" className="hover:text-primary transition-colors">Pricing</a>
                            <a href="#" className="hover:text-primary transition-colors">Developers</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {!loggedIn ? (
                            <>
                                <a href="/login" className="hidden md:block text-sm font-bold text-slate-600 hover:text-primary transition-colors">
                                    Log In
                                </a>
                                <a href="/signup" className="btn-primary py-2.5 px-6 text-sm">
                                    Sign Up <MdArrowForward />
                                </a>
                            </>
                        ) : (
                            <a href="/dashboard" className="btn-primary py-2.5 px-6 text-sm">
                                Dashboard <MdArrowForward />
                            </a>
                        )}
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative pt-40 pb-20 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent"></div>
                <div className="absolute top-20 left-10 -z-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-40 right-20 -z-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col items-start text-left">
                        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-100 bg-blue-50 text-primary text-[13px] font-bold tracking-wide uppercase">
                            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                            Trusted by 50,000+ Enterprises
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-secondary leading-[1.05] tracking-tighter mb-8">
                            Modern <span className="text-gradient">Payments</span> <br />
                            for Modern <br />
                            Businesses.
                        </h1>

                        <p className="max-w-xl text-xl text-slate-500 font-medium leading-relaxed mb-10">
                            NexusPay is the fastest way to accept payments, send payouts, and manage your business finances — all in one platform with <span className="text-secondary font-bold">0% Transaction Fees</span>.
                        </p>

                        <div className="flex flex-wrap gap-5">
                            <a href="/signup" className="btn-primary text-lg px-10">
                                Get Started Now
                                <MdArrowForward className="text-2xl" />
                            </a>
                            <button className="btn-secondary text-lg px-10">
                                <MdPlayCircleFilled className="text-2xl text-primary" />
                                Watch Demo
                            </button>
                        </div>

                        <div className="mt-12 flex items-center gap-8 opacity-60">
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-secondary">0.0%</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">MDR Charges</span>
                            </div>
                            <div className="w-px h-10 bg-slate-200"></div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-secondary">Instant</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Settlements</span>
                            </div>
                            <div className="w-px h-10 bg-slate-200"></div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-secondary">24/7</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Support</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        {/* Dashboard Mockup */}
                        <div className="relative z-10 premium-card p-3 animate-float">
                            <img
                                src="/dashboard-preview.png"
                                className="w-full h-auto rounded-2xl shadow-2xl"
                                alt="Nexus Dashboard"
                            />
                        </div>

                        {/* Floating Stats Cards */}
                        <div className="absolute -top-10 -right-10 z-20 glass-panel p-6 rounded-2xl animate-float [animation-delay:1s] hidden md:block">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <MdAutoGraph className="text-2xl" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Revenue Today</p>
                                    <p className="text-2xl font-black text-secondary">₹4,82,910</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-10 -left-10 z-20 glass-panel p-6 rounded-2xl animate-float [animation-delay:2s] hidden md:block">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-primary">
                                    <MdVerified className="text-2xl" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Success Rate</p>
                                    <p className="text-2xl font-black text-secondary">99.98%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LOGO STRIP */}
            <section className="py-20 border-y border-slate-100 overflow-hidden bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-12">Empowering India's Best Startups</p>
                    <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                        <span className="text-3xl font-black text-secondary tracking-tighter">ZEPTO</span>
                        <span className="text-3xl font-black text-secondary tracking-tighter">CRED</span>
                        <span className="text-3xl font-black text-secondary tracking-tighter">SWIGGY</span>
                        <span className="text-3xl font-black text-secondary tracking-tighter">ZOMATO</span>
                        <span className="text-3xl font-black text-secondary tracking-tighter">NYKAA</span>
                        <span className="text-3xl font-black text-secondary tracking-tighter">UNACADEMY</span>
                    </div>
                </div>
            </section>

            {/* PRODUCTS SUITE */}
            <section id="features" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="mb-16">
                        <h2 className="text-primary font-black uppercase tracking-widest text-sm mb-4">The Nexus Ecosystem</h2>
                        <h3 className="text-4xl md:text-6xl font-black text-secondary mb-6 leading-tight">
                            Everything you need to <br /> <span className="text-gradient">build and scale</span>.
                        </h3>
                        <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium">
                            NexusPay offers a comprehensive suite of financial products designed to handle every aspect of your payment infrastructure.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Gateway */}
                        <div className="premium-card p-10 text-left group">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary text-3xl mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                                <MdLayers />
                            </div>
                            <h4 className="text-2xl font-black text-secondary mb-4">Payment Gateway</h4>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                Accept 100+ payment methods including UPI, Cards, Netbanking and EMI. Highest success rates guaranteed.
                            </p>
                            <a href="#" className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
                                Learn More <MdArrowForward />
                            </a>
                        </div>

                        {/* Payouts */}
                        <div className="premium-card p-10 text-left group">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-3xl mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                                <MdOutlineAccountBalanceWallet />
                            </div>
                            <h4 className="text-2xl font-black text-secondary mb-4">Smart Payouts</h4>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                Automate vendor payments, customer refunds, and employee payroll instantly via API, 24/7.
                            </p>
                            <a href="#" className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-4 transition-all">
                                Learn More <MdArrowForward />
                            </a>
                        </div>

                        {/* Smart Collect */}
                        <div className="premium-card p-10 text-left group">
                            <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 text-3xl mb-8 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300 shadow-inner">
                                <MdQrCodeScanner />
                            </div>
                            <h4 className="text-2xl font-black text-secondary mb-4">Smart Collect</h4>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                Create virtual accounts and UPI IDs to automate bank transfer reconciliation and tracking.
                            </p>
                            <a href="#" className="flex items-center gap-2 text-cyan-600 font-bold hover:gap-4 transition-all">
                                Learn More <MdArrowForward />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* DEVELOPER SECTION */}
            <section className="py-32 bg-secondary relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-[0.03]"></div>
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div>
                        <h2 className="text-primary font-black uppercase tracking-widest text-sm mb-4">Developer First</h2>
                        <h3 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                            Integrate in minutes, <br /> not days.
                        </h3>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                            Clean, lightweight SDKs for all major platforms. Well-documented REST APIs that make integration a breeze.
                        </p>

                        <div className="grid grid-cols-2 gap-8 mb-12">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white text-2xl">
                                    <MdCode />
                                </div>
                                <div>
                                    <h5 className="text-white font-bold mb-1">Modern SDKs</h5>
                                    <p className="text-slate-500 text-sm">React, Flutter, Android, iOS, and more.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white text-2xl">
                                    <MdOutlineIntegrationInstructions />
                                </div>
                                <div>
                                    <h5 className="text-white font-bold mb-1">Easy Testing</h5>
                                    <p className="text-slate-500 text-sm">Robust sandbox environment for testing.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <SiNodedotjs className="text-4xl text-slate-500 hover:text-green-500 transition-colors cursor-pointer" />
                            <SiPython className="text-4xl text-slate-500 hover:text-blue-400 transition-colors cursor-pointer" />
                            <SiGo className="text-4xl text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer" />
                            <SiPhp className="text-4xl text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer" />
                            <SiSwift className="text-4xl text-slate-500 hover:text-orange-500 transition-colors cursor-pointer" />
                        </div>
                    </div>

                    <div className="bg-[#0a0c36] rounded-3xl p-2 border border-white/10 shadow-2xl">
                        <div className="bg-[#05061b] rounded-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <span className="text-xs text-slate-500 font-bold tracking-widest uppercase">nexuspay.js</span>
                            </div>
                            <div className="p-8 font-mono text-sm leading-relaxed overflow-x-auto">
                                <div className="text-pink-500">import <span className="text-white">Nexus</span> from <span className="text-green-400">'@nexuspay/sdk'</span>;</div>
                                <div className="mt-4 text-slate-400">// Initialize with API Key</div>
                                <div className="text-blue-400">const <span className="text-white">nexus</span> = <span className="text-pink-500">new</span> <span className="text-yellow-400">Nexus</span>(<span className="text-green-400">'nx_live_...2k9'</span>);</div>
                                <div className="mt-6 text-slate-400">// Create a checkout session</div>
                                <div className="text-blue-400">const <span className="text-white">session</span> = <span className="text-pink-500">await</span> <span className="text-white">nexus.checkout.create</span>({`{`}</div>
                                <div className="pl-6">
                                    <div>amount: <span className="text-orange-400">50000</span>, <span className="text-slate-500">// ₹500.00</span></div>
                                    <div>currency: <span className="text-green-400">'INR'</span>,</div>
                                    <div>customer: {`{`} email: <span className="text-green-400">'dev@nexuspay.in'</span> {`}`},</div>
                                    <div>callback_url: <span className="text-green-400">'https://your-site.com/success'</span></div>
                                </div>
                                <div>{`}`});</div>
                                <div className="mt-6 text-slate-400">// Redirect to payment page</div>
                                <div className="text-yellow-400">nexus.checkout.redirect(<span className="text-white">session.id</span>);</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto rounded-[3.5rem] bg-gradient-to-br from-secondary to-slate-900 p-12 md:p-32 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500 filter blur-[300px] opacity-10"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500 filter blur-[250px] opacity-10"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-7xl font-black text-white mb-8 leading-tight">
                            Start accepting <br /> payments in <span className="text-highlight">seconds</span>.
                        </h2>
                        <p className="max-w-2xl mx-auto text-slate-400 text-xl font-medium mb-16">
                            Join 50,000+ businesses who switched to NexusPay and never looked back. Sign up today and get your account verified in under 2 hours.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <a href="/signup" className="px-16 py-6 text-xl font-black text-secondary bg-white rounded-2xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10">
                                Create Free Account
                            </a>
                            <button className="px-16 py-6 text-xl font-bold text-white bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                                Talk to Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                                    <img src="/logo.png" className="w-8 h-8 rounded-lg border-1 border-[#02042B]" alt="NexusPay Logo" />
                                </div>
                                <span className="text-2xl font-black text-secondary">NexusPay</span>
                            </div>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Building the future of digital payments for India. Zero MDR, instant settlements, and world-class developer tools.
                            </p>
                        </div>

                        <div>
                            <h6 className="text-secondary font-black uppercase tracking-widest text-sm mb-8">Products</h6>
                            <ul className="space-y-4 text-slate-500 font-bold text-[15px]">
                                <li><a href="#" className="hover:text-primary transition-colors">Payment Gateway</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Payouts</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Smart Collect</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Payment Links</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">UPI Autopay</a></li>
                            </ul>
                        </div>

                        <div>
                            <h6 className="text-secondary font-black uppercase tracking-widest text-sm mb-8">Company</h6>
                            <ul className="space-y-4 text-slate-500 font-bold text-[15px]">
                                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Press Kit</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h6 className="text-secondary font-black uppercase tracking-widest text-sm mb-8">Legal</h6>
                            <ul className="space-y-4 text-slate-500 font-bold text-[15px]">
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Security Information</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">MDR & Fees</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">SLA</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-slate-400 font-medium text-sm">
                            © {new Date().getFullYear()} NexusPay India Private Limited. All rights reserved.
                        </p>
                        <div className="flex gap-8 items-center">
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-widest border border-green-100">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                System Operational
                            </div>
                            <p className="text-slate-400 font-medium text-sm">Made with ❤️</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}