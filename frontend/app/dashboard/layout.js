"use client";
import { useState, useEffect } from "react";
import { getHeaders } from "@/utils/api";
import Sidebar from "@/components/Sidebar"; 
import { MdMenu } from "react-icons/md";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
        return;
    }

    fetch("/api/merchant/me", {
      headers: getHeaders()
    })
      .then(res => res.json())
      .then(data => {
          if (data.id && (!data.pan || data.pan === "")) {
              window.location.href = "/onboarding";
          }
          setData(data);
      })
      .catch(() => {
          window.location.href = "/login";
      });
  }, []);


  return (
    <div className="min-h-screen bg-slate-50 text-[#02042b] font-sans selection:bg-blue-500/30">

      <Sidebar data={data} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="md:ml-64 min-h-screen flex flex-col relative">
        
        <header className="md:hidden h-16 border-b border-slate-100 flex items-center justify-between px-4 bg-white/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-500 hover:text-[#3395FF]">
                    <MdMenu className="text-2xl" />
                </button>
                <span className="font-bold text-[#02042b]">NexusPay</span>
            </div>
        </header>


        <div className="flex-1 relative z-0">
           {children}
        </div>

      </div>
    </div>
  );
}