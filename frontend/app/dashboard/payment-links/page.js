"use client";
import { useState } from "react";
import Toast from "@/components/Toast";
import Link from "next/link";
import { getHeaders } from "@/utils/api";
import {
  MdDescription,
  MdLink,
  MdContentCopy,
  MdShare,
  MdQrCode,
  MdArrowBack,
  MdOutlineLink,
  MdVerified
} from "react-icons/md";

export default function PaymentLinksPage() {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [returnUrl, setReturnUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");
  const [toast, setToast] = useState(null);

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
      const res = await fetch("/api/merchant/create-link", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ 
            amount: amt, 
            description: purpose,
            returnUrl: returnUrl,
            origin: window.location.origin
        }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setLink(data.url);
        showToast("Payment link generated!");
      } else {
        showToast(data.error || "Generation failed", "error");
      }
    } catch (err) {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    showToast("Link copied to clipboard");
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50/30 p-6 md:p-10 transition-all duration-300">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center gap-2 mb-8">
          <Link href="/dashboard" className="p-1.5 text-gray-400 hover:text-primary">
              <MdArrowBack className="text-xl" />
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Back to Dashboard</span>
      </div>

      <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900">Payment Links</h1>
          <p className="text-sm text-gray-500 mt-1">Generate one-time checkout links for customers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* FORM */}
          <div className="premium-card p-8">
              <div className="flex items-center gap-2 mb-8 text-primary">
                  <MdOutlineLink className="text-xl" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">Transaction Details</h3>
              </div>

              <form onSubmit={generate} className="space-y-6">
                  <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Amount (INR)</label>
                      <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-300 group-focus-within:text-blue-500">₹</span>
                          <input
                              type="number"
                              required
                              min="1"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-2xl font-bold text-gray-900 placeholder:text-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                          />
                      </div>
                  </div>

                  <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Purpose / Description</label>
                      <div className="relative group">
                          <MdDescription className="absolute left-4 top-4 text-gray-300 group-focus-within:text-blue-500" />
                          <textarea
                              rows="2"
                              value={purpose}
                              onChange={(e) => setPurpose(e.target.value)}
                              placeholder="E.g. Consultation / Web Design"
                              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 placeholder:text-gray-300 focus:border-blue-500 transition-all outline-none resize-none"
                          />
                      </div>
                  </div>

                  <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Redirect URL (Optional)</label>
                      <div className="relative group">
                          <MdLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500" />
                          <input
                              type="url"
                              value={returnUrl}
                              onChange={(e) => setReturnUrl(e.target.value)}
                              placeholder="https://mysite.com/success"
                              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 placeholder:text-gray-300 focus:border-blue-500 transition-all outline-none"
                          />
                      </div>
                  </div>

                  <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-3.5 text-sm uppercase tracking-widest disabled:opacity-50"
                  >
                      {loading ? "Generating Link..." : "Create Payment Link"}
                  </button>
              </form>
          </div>

          {/* PREVIEW */}
          <div className="lg:sticky lg:top-10">
              {!link ? (
                  <div className="bg-white border border-dashed border-gray-200 rounded-xl p-20 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 text-3xl mb-4">
                          <MdQrCode />
                      </div>
                      <h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Preview Mode</h4>
                      <p className="text-xs text-gray-300 mt-1">Enter details to see the link</p>
                  </div>
              ) : (
                  <div className="premium-card p-8 animate-in zoom-in-95 duration-300">
                       <div className="flex justify-between items-start mb-8">
                          <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ready to share</p>
                              <h3 className="text-3xl font-bold text-gray-900">₹{parseFloat(amount).toLocaleString()}</h3>
                              <p className="text-sm text-gray-500 font-semibold mt-1">{purpose || "Direct Transaction"}</p>
                          </div>
                          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-primary text-2xl border border-blue-100">
                              <MdQrCode />
                          </div>
                       </div>

                       <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3 mb-8">
                          <div className="flex-1 font-mono text-[11px] text-gray-400 truncate">
                              {link}
                          </div>
                          <button onClick={copyLink} className="p-2 text-gray-400 hover:text-primary transition-colors">
                              <MdContentCopy />
                          </button>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <button onClick={copyLink} className="btn-secondary py-3 text-[10px] uppercase tracking-widest">
                              <MdContentCopy /> Copy URL
                          </button>
                          <a href={link} target="_blank" className="btn-primary py-3 text-[10px] uppercase tracking-widest">
                              <MdShare /> Open Link
                          </a>
                       </div>
                       
                       <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-3">
                           <MdVerified className="text-lg text-blue-500" />
                           <p className="text-[10px] font-semibold text-gray-400 uppercase leading-relaxed">
                               This link is secure and supports all major UPI apps and Cards.
                           </p>
                       </div>
                  </div>
              )}
          </div>

      </div>
    </div>
  );
}