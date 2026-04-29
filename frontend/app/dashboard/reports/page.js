"use client";
import { useEffect, useState } from "react";
import { MdAssessment, MdTrendingUp, MdTrendingDown, MdBarChart, MdTimeline, MdFileDownload } from "react-icons/md";
import { getHeaders } from "@/utils/api";

export default function ReportsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/merchant/stats", {
        headers: getHeaders()
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format) => {
    try {
      const res = await fetch(`/api/merchant/export/${format}`, {
        headers: getHeaders()
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transaction_report.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#02042b] tracking-tight">Business Intelligence</h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Deep dive into your transaction data and growth.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleDownload("pdf")}
            className="px-6 py-4 bg-[#02042b] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
          >
              <MdFileDownload className="text-lg" /> Download PDF
          </button>
          <button 
            onClick={() => handleDownload("csv")}
            className="px-6 py-4 bg-slate-100 text-[#02042b] font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2"
          >
              <MdFileDownload className="text-lg" /> Download CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <MdTrendingUp className="text-6xl text-green-500" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-300">Net Revenue</p>
              <h3 className="text-4xl font-black text-[#02042b] mb-2">₹{stats?.totalRevenue?.toLocaleString()}</h3>
              <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
                  <span className="px-2 py-0.5 bg-green-50 rounded-full">+12.5%</span>
                  <span>vs last month</span>
              </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-[#3395FF]">
                  <MdBarChart className="text-6xl" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Successful Orders</p>
              <h3 className="text-4xl font-black text-[#02042b] mb-2">{stats?.totalOrders}</h3>
              <div className="flex items-center gap-2 text-[#3395FF] text-xs font-bold">
                  <span className="px-2 py-0.5 bg-blue-50 rounded-full">+8%</span>
                  <span>vs last month</span>
              </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-orange-500">
                  <MdTimeline className="text-6xl" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Avg. Ticket Size</p>
              <h3 className="text-4xl font-black text-[#02042b] mb-2">₹{(stats?.totalRevenue / (stats?.totalOrders || 1)).toFixed(2)}</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Growth Phase</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="font-black text-[#02042b] uppercase tracking-widest text-sm mb-10 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[#3395FF] rounded-full"></div> Revenue Breakdown
              </h3>
              <div className="space-y-8">
                  {[
                      { label: "Direct Payments", value: 75, color: "#3395FF" },
                      { label: "Payment Links", value: 20, color: "#02042b" },
                      { label: "Subscriptions", value: 5, color: "#cbd5e1" }
                  ].map((item, i) => (
                      <div key={i}>
                          <div className="flex justify-between items-end mb-3">
                              <span className="text-sm font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                              <span className="text-lg font-black text-[#02042b]">{item.value}%</span>
                          </div>
                          <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden flex">
                              <div className="h-full transition-all duration-1000" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="font-black text-[#02042b] uppercase tracking-widest text-sm mb-10 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-green-500 rounded-full"></div> Conversion Funnel
              </h3>
              <div className="space-y-6">
                  {[
                      { label: "Visits", value: "1,240", sub: "100%", w: "100%" },
                      { label: "Initiated", value: "842", sub: "68%", w: "68%" },
                      { label: "Successful", value: "612", sub: "49%", w: "49%" }
                  ].map((item, i) => (
                      <div key={i} className="flex items-center gap-6">
                          <div className="w-32">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                              <p className="text-xl font-black text-[#02042b]">{item.value}</p>
                          </div>
                          <div className="flex-1 h-12 bg-slate-50 rounded-2xl relative overflow-hidden">
                              <div className="absolute inset-y-0 left-0 bg-green-500/10 border-r-2 border-green-500 transition-all duration-1000" style={{ width: item.w }}></div>
                              <div className="absolute inset-0 flex items-center px-4 font-black text-green-600 text-xs">
                                  {item.sub}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}
