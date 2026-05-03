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
    <div className="min-h-screen bg-[#f8fbff] flex flex-col items-center justify-center p-4 font-sans text-[#02042B] relative overflow-hidden">
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="flex items-center gap-3 mb-10 relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <img src="/logo.png" className="w-10 h-10" alt="Logo" />
        <span className="text-2xl font-black tracking-tight">NexusPay</span>
      </div>

      <div className="w-full max-w-md bg-white shadow-2xl shadow-blue-500/10 rounded-3xl overflow-hidden border border-slate-100 relative z-10 animate-in zoom-in-95 duration-500">
        
        <div className="p-10 text-center">
            <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-6xl shadow-inner shadow-blue-200/20">
                    <MdCheckCircle className="animate-in zoom-in-50 duration-500" />
                </div>
            </div>

            <h2 className="text-3xl font-black mb-2 tracking-tight text-[#02042B]">Payment Successful</h2>
            <p className="text-slate-400 font-medium text-sm mb-10 uppercase tracking-widest leading-relaxed">Transaction Receipt</p>

            <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100 text-left space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Paid To</p>
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-lg">{mname}</span>
                            <MdVerified className="text-[#3395FF]" />
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                        <span className="font-black text-2xl">₹{amount}</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date & Time</p>
                        <span className="text-xs font-bold text-slate-600">{formattedTime}</span>
                    </div>
                    <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        Confirmed
                    </div>
                </div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-3 text-slate-400 text-xs font-bold">
                    <div className="w-4 h-4 border-2 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                    <span>Auto-redirecting in {redirectTime}s</span>
                </div>
            </div>
        </div>

        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Transaction Secured by Nexus</p>
        </div>
      </div>

      <footer className="mt-12 relative z-10 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
        Payments Infrastructure © 2026
      </footer>
    </div>
  );
}
