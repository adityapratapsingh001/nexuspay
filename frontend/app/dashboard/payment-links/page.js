"use client";
import { useState } from "react";
import Toast from "@/components/Toast";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import {
  MdAttachMoney,
  MdDescription,
  MdLink,
  MdContentCopy,
  MdShare,
  MdQrCode,
  MdArrowBack,
  MdMenu
} from "react-icons/md";

export default function PaymentLinksPage() {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const generate = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return showToast("Enter a valid amount", "error");

    setLoading(true);
    setLink("");

    try {
      const res = await fetch("/api/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            amount: amt, 
            description: purpose
        }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setLink(data.url);
        showToast("Link generated successfully!", "success");
      } else {
        showToast(data.error || "Failed to generate link", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Server connection failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    showToast("Link copied to clipboard", "success");
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} data={{ business_name: "Nexus Merchant" }} />

      <main className="flex-1 md:ml-64 flex flex-col">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 md:hidden text-slate-500 hover:bg-slate-50 rounded-lg"
                >
                    <MdMenu className="text-2xl" />
                </button>
                <div className="flex items-center gap-2 text-slate-400 group">
                    <Link href="/dashboard" className="hover:text-[#3395FF] transition-colors"><MdArrowBack className="text-xl" /></Link>
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Overview</span>
                </div>
            </div>
        </header>

        <div className="p-6 md:p-10 w-full max-w-6xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-[#02042b]">Payment Links</h1>
                <p className="text-slate-500 font-medium text-lg mt-1">Create instant checkout links for your customers.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                
                {/* GENERATE FORM */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-500/5 p-10">
                    <form onSubmit={generate} className="space-y-8">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Transaction Amount (INR)</label>
                            <div className="relative group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-300 group-focus-within:text-[#3395FF] transition-colors">₹</span>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-14 pr-6 py-6 bg-slate-50 border border-slate-100 rounded-2xl text-4xl font-black text-[#02042b] placeholder:text-slate-200 outline-none focus:border-[#3395FF] focus:ring-4 focus:ring-blue-500/5 transition-all tracking-tighter"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Payment Purpose</label>
                            <div className="relative group">
                                <MdDescription className="absolute left-6 top-6 text-xl text-slate-300 group-focus-within:text-[#3395FF] transition-colors" />
                                <textarea
                                    rows="3"
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    placeholder="Ex: Consultation Fee / Invoice #102"
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-[#02042b] font-bold placeholder:text-slate-300 outline-none focus:border-[#3395FF] transition-all resize-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-[#3395FF] text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
                        >
                            {loading ? "Generating..." : <><MdLink className="text-2xl" /> Create Secure Link</>}
                        </button>
                    </form>
                </div>

                {/* PREVIEW / RESULT */}
                <div className="sticky top-28">
                    {!link ? (
                        <div className="bg-slate-50 border-4 border-dashed border-slate-100 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-100 text-4xl mb-6 shadow-sm">
                                <MdQrCode />
                            </div>
                            <h4 className="text-xl font-bold text-slate-300">Ready to Generate</h4>
                            <p className="text-slate-200 text-sm font-bold uppercase tracking-widest mt-2">Enter details on the left</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-500/10 p-10 animate-in zoom-in-95 duration-500">
                             <div className="flex justify-between items-start mb-10">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Generated Link</p>
                                    <h3 className="text-5xl font-black text-[#02042b] tracking-tighter">₹{amount}</h3>
                                    <p className="text-slate-500 font-bold text-lg mt-1">{purpose || "Digital Service"}</p>
                                </div>
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#3395FF] text-3xl">
                                    <MdQrCode />
                                </div>
                             </div>

                             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4 mb-10">
                                <div className="flex-1 font-mono text-xs font-bold text-slate-400 truncate">
                                    {link}
                                </div>
                                <button onClick={copyLink} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#3395FF] hover:border-[#3395FF] transition-all">
                                    <MdContentCopy />
                                </button>
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                                <button onClick={copyLink} className="py-4 bg-[#02042b] text-white font-black rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm uppercase">
                                    <MdContentCopy /> Copy Link
                                </button>
                                <a href={link} target="_blank" className="py-4 bg-[#3395FF] text-white font-black rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 text-sm uppercase">
                                    <MdShare /> Open Link
                                </a>
                             </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
      </main>
    </div>
  );
}