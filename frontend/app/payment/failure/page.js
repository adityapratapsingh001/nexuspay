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
    <div className="min-h-screen bg-[#f8fbff] flex flex-col items-center py-20 px-4 font-sans text-[#02042b]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-10">
        <img src="/logo.png" className="w-8 h-8" alt="Logo" />
        <span className="text-xl font-black">NexusPay</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white shadow-2xl shadow-blue-500/5 rounded-[2.5rem] p-10 text-center border border-slate-100 animate-in zoom-in-95 duration-500">

        {/* Failure Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-6xl">
            <MdErrorOutline />
          </div>
        </div>

        <h2 className="text-3xl font-black mb-2">Payment Failed</h2>
        <p className="text-slate-500 font-medium mb-8">Something went wrong with the transaction.</p>

        {/* Info Area */}
        <div className="bg-slate-50 rounded-2xl p-6 mb-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Amount attempted</p>
            <h3 className="text-3xl font-black text-[#02042b]">₹{amount}</h3>
        </div>

        <button 
            onClick={retryPayment}
            className="w-full py-4 bg-[#02042b] text-white font-black rounded-2xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
            <MdArrowBack /> Try Again
        </button>
      </div>

      <footer className="mt-12 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">
        © NexusPay — Powered by Payments Infrastructure
      </footer>
    </div>
  );
}
