"use client";
import { useEffect, useState } from "react";
import { MdVerified, MdCheckCircle } from "react-icons/md";

export default function PaymentSuccess() {
  const [amount, setAmount] = useState("0");
  const [formattedTime, setFormattedTime] = useState("--");
  const [redirectTime, setRedirectTime] = useState(5);
  const [mname, setMname] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amt = params.get("amt") || "0";
    let timestamp = params.get("tmstp") || "";
    const mn = params.get("mname") || "";
    const ruri = params.get("redirect") || "";

    timestamp = decodeURIComponent(timestamp).replace(" ", "+");
    let ft = "--";

    if (timestamp) {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        ft = date.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      }
    }

    setAmount(amt);
    setFormattedTime(ft);
    setMname(mn);

    // Countdown redirect
    const interval = setInterval(() => {
      setRedirectTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (ruri) window.location.href = ruri;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col items-center py-20 px-4 font-sans text-[#02042b]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <img src="/logo.png" className="w-8 h-8" alt="Logo" />
        <span className="text-xl font-black">NexusPay</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white shadow-2xl shadow-blue-500/5 rounded-[2.5rem] p-10 text-center border border-slate-100 animate-in zoom-in-95 duration-500">

        {/* Animated Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-green-500 text-6xl">
            <MdCheckCircle />
          </div>
        </div>

        <h2 className="text-3xl font-black mb-2">Payment Success!</h2>
        <p className="text-slate-500 font-medium mb-8">Funds have been successfully sent.</p>

        {/* Merchant Info */}
        <div className="bg-slate-50 rounded-2xl p-6 mb-6">
            <div className="flex flex-col items-center gap-2 mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Paid To</p>
                <div className="flex items-center justify-center gap-1">
                    <h3 className="text-[#02042b] font-bold text-lg">{mname}</h3>
                    <MdVerified className="text-[#3395FF]" />
                </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase">Amount</span>
                <span className="text-xl font-black text-[#02042b]">₹{amount}</span>
            </div>
        </div>

        {/* Timestamp */}
        <div className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">{formattedTime}</div>

        {/* Redirecting Message */}
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
            <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            Redirecting in <strong>{redirectTime}s</strong>
        </div>
      </div>

      <footer className="mt-12 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">
        © NexusPay — Powered by Payments Infrastructure
      </footer>
    </div>
  );
}
