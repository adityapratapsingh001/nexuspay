"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import {
  MdContentCopy,
  MdQrCode,
  MdRefresh,
  MdAccountBalance,
  MdBusiness,
  MdVerified,
  MdVisibility,
  MdVisibilityOff,
  MdCode,
  MdBarChart,
  MdMenu
} from "react-icons/md";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [showSecret, setShowSecret] = useState(false);
  const [toast, setToast] = useState(null); 
  const [isRollModalOpen, setIsRollModalOpen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/merchant/me")
      .then(res => res.json())
      .then(setData)
      .catch(() => showToast("Failed to load dashboard data", "error"));
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard", "success");
  };

  const confirmRollKeys = async () => {
    setIsRolling(true);
    try {
      const res = await fetch("/api/merchant/roll-keys", { method: "POST" });
      const json = await res.json();
      
      if (res.ok) {
        setData(prev => ({
          ...prev,
          api_key: json.apiKey,
          api_secret: json.apiSecret
        }));
        showToast("New API keys generated successfully", "success");
        setIsRollModalOpen(false);
      } else {
        showToast(json.error || "Failed to generate keys", "error");
      }
    } catch (error) {
      showToast("Network error occurred", "error");
    } finally {
      setIsRolling(false);
    }
  };

  if (!data) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-[#f8fbff] gap-5">
        <div className="w-12 h-12 border-4 border-[#3395FF]/20 border-t-[#3395FF] rounded-full animate-spin"></div>
        <p className="text-[#02042b] font-black text-xs uppercase tracking-widest animate-pulse">Building Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} data={data} />

      <main className="flex-1 md:ml-64 flex flex-col">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <ConfirmModal
          isOpen={isRollModalOpen}
          onClose={() => setIsRollModalOpen(false)}
          onConfirm={confirmRollKeys}
          isLoading={isRolling}
          title="Regenerate API Keys?"
          confirmText="Confirm Roll Keys"
          danger={true}
        >
          Your current secret key will stop working immediately. This action cannot be undone.
        </ConfirmModal>

        {/* TOP BAR / MOBILE NAVBAR */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 md:hidden text-slate-500 hover:bg-slate-50 rounded-lg"
                >
                    <MdMenu className="text-2xl" />
                </button>
                <h2 className="text-sm font-black text-[#02042b] uppercase tracking-widest hidden md:block">Overview</h2>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
                    <span className="text-[10px] font-bold text-green-500 border border-green-100 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Fully Operational
                    </span>
                </div>
            </div>
        </header>

        {/* CONTENT */}
        <div className="p-6 md:p-10 w-full max-w-6xl mx-auto">
            
            {/* WELCOME */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-[#02042b]">Dashboard</h1>
                    <p className="text-slate-500 font-medium text-lg mt-1">Manage your keys and monitor settlements.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/payment-links" className="px-6 py-3 bg-[#3395FF] text-white font-black rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center gap-2 text-sm uppercase">
                        <MdQrCode /> Create Link
                    </Link>
                </div>
            </div>

            {/* METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Live Collections</p>
                    <h3 className="text-3xl font-black text-[#02042b]">₹0.00</h3>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Total Orders</p>
                    <h3 className="text-3xl font-black text-[#02042b]">0</h3>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Health</p>
                    <h3 className="text-3xl font-black text-green-500">100%</h3>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Settlement Acc</p>
                    <h3 className="text-3xl font-black text-[#02042b] truncate font-mono tracking-tighter">
                        {data?.account_number ? `...${data.account_number.slice(-4)}` : "None"}
                    </h3>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-8">
                     <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="font-black text-[#02042b] flex items-center gap-2 uppercase tracking-wider text-sm">
                                <MdCode className="text-[#3395FF]" /> API Credentials
                            </h3>
                            <button 
                                onClick={() => setIsRollModalOpen(true)}
                                className="text-xs font-black text-[#3395FF] flex items-center gap-1 hover:underline uppercase"
                            >
                                <MdRefresh /> Roll Keys
                            </button>
                        </div>
                        <div className="p-8 space-y-8">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Merchant ID</label>
                                <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-2 pl-6">
                                    <code className="flex-1 font-mono text-sm text-[#02042b] font-bold truncate">{data?.api_key || ""}</code>
                                    <button onClick={() => copy(data?.api_key || "")} className="p-4 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#3395FF] hover:border-[#3395FF] transition-all">
                                        <MdContentCopy />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">API Secret Key</label>
                                <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-2 pl-6">
                                    <code className="flex-1 font-mono text-sm text-slate-300 font-bold truncate">
                                        {showSecret ? data?.api_secret : "sk_test_••••••••••••••••••••••••••••••••"}
                                    </code>
                                    <div className="flex gap-2">
                                        <button onClick={() => setShowSecret(!showSecret)} className="p-4 text-slate-400 hover:text-slate-600 transition-all">
                                            {showSecret ? <MdVisibilityOff /> : <MdVisibility />}
                                        </button>
                                        <button onClick={() => copy(data?.api_secret || "")} className="p-4 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#3395FF] hover:border-[#3395FF] transition-all">
                                            <MdContentCopy />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                     <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                        <h3 className="font-black text-[#02042b] flex items-center gap-2 uppercase tracking-wider text-sm mb-8">
                            <MdAccountBalance className="text-[#3395FF]" /> Bank Account
                        </h3>
                        <div className="space-y-6">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payout Account</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs font-bold">
                                        <span className="text-slate-400">HOLDER</span>
                                        <span className="text-[#02042b] truncate max-w-[100px]">{data?.account_holder || "Demo"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold">
                                        <span className="text-slate-400">NUMBER</span>
                                        <span className="text-[#02042b] font-mono">•••• {data?.account_number?.slice(-4) || "0000"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold">
                                        <span className="text-slate-400">IFSC</span>
                                        <span className="text-[#02042b] font-mono">{data?.ifsc || "SBIN0000"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-green-600 font-black text-[10px] bg-green-50 px-4 py-2 rounded-lg border border-green-100 uppercase tracking-wider">
                                <MdVerified className="text-lg" /> KYC Verified
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}