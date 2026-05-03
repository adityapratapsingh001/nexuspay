"use client";
import { useEffect, useState } from "react";
import { MdErrorOutline, MdArrowBack } from "react-icons/md";

export default function PaymentFailure() {
  const [amount, setAmount] = useState("0");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amt = params.get('q') || '0';
    setAmount(amt);
  }, []);

  function retryPayment() {
    window.history.back();
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col items-center justify-center p-4 font-sans text-[#02042B] relative overflow-hidden">
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-red-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="flex items-center gap-3 mb-10 relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <img src="/logo.png" className="w-10 h-10" alt="Logo" />
        <span className="text-2xl font-black tracking-tight">NexusPay</span>
      </div>

      <div className="w-full max-w-md bg-white shadow-2xl shadow-red-900/10 rounded-3xl overflow-hidden border border-slate-100 relative z-10 animate-in zoom-in-95 duration-500">
        
        <div className="p-10 text-center">
            <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-6xl">
                    <MdErrorOutline className="animate-in shake duration-500" />
                </div>
            </div>

            <h2 className="text-3xl font-black mb-2 tracking-tight">Payment Failed</h2>
            <p className="text-slate-400 font-medium text-sm mb-10 uppercase tracking-widest leading-relaxed">Transaction Unsuccessful</p>

            <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100 mb-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Amount Attempted</p>
                <h3 className="text-4xl font-black text-[#02042B]">₹{amount}</h3>
                <p className="text-xs font-bold text-red-400 mt-4">The transaction was declined or cancelled.</p>
            </div>

            <div className="flex flex-col gap-4">
                <button 
                    onClick={retryPayment}
                    className="w-full py-5 bg-[#02042B] text-white font-black rounded-xl hover:bg-[#071a2d] transition-all active:scale-95 flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
                >
                    <MdArrowBack className="text-lg" /> Try Again
                </button>
                <button 
                    onClick={() => window.location.href = "/"}
                    className="w-full py-4 bg-slate-50 text-slate-500 font-black rounded-xl hover:bg-slate-100 transition-all text-xs uppercase tracking-widest"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>

        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Transaction Secured by Nexus</p>
        </div>
      </div>

      <footer className="mt-12 relative z-10 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
        Support ID: TXN_ERR_04
      </footer>
    </div>
  );
}
