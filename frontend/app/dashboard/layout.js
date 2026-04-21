"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar"; 
import { MdMenu } from "react-icons/md";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  useEffect(() => {
      fetch("/api/merchant/me")
        .then(res => res.json())
        .then(setData)
        .catch(() => showToast("Failed to load dashboard data", "error"));
    }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <Sidebar data={data} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="md:ml-64 min-h-screen flex flex-col relative">
        
        <header className="md:hidden h-16 border-b border-white/5 flex items-center justify-between px-4 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-400 hover:text-white">
                    <MdMenu className="text-2xl" />
                </button>
                <span className="font-bold text-white">NexusPay</span>
            </div>
        </header>

        <div className="flex-1 relative z-0">
           {children}
        </div>

      </div>
    </div>
  );
}