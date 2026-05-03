"use client";
import { useEffect, useState } from "react";
import { MdAssessment, MdTrendingUp, MdBarChart, MdTimeline, MdFileDownload, MdPieChart } from "react-icons/md";
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
      a.download = `nexus_report.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30">
        <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Compiling Analytics...</p>
    </div>
  );

  return (
    <div className="flex-1 min-h-screen bg-gray-50/30 p-6 md:p-10 transition-all duration-300">
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive analysis of your business growth.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => handleDownload("pdf")}
            className="btn-secondary py-2 px-4 text-xs uppercase tracking-widest"
          >
              <MdFileDownload className="text-lg" /> PDF
          </button>
          <button 
            onClick={() => handleDownload("csv")}
            className="btn-primary py-2 px-4 text-xs uppercase tracking-widest"
          >
              <MdFileDownload className="text-lg" /> CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="premium-card p-8">
              <MdTrendingUp className="text-3xl text-blue-500 mb-6" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">₹{stats?.totalRevenue?.toLocaleString()}</h3>
              <div className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase">
                  <span className="px-2 py-0.5 bg-blue-50 rounded">+12.5%</span>
                  <span>vs last month</span>
              </div>
          </div>

          <div className="premium-card p-8">
              <MdBarChart className="text-3xl text-blue-500 mb-6" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Transactions</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{stats?.totalOrders?.toLocaleString()}</h3>
              <div className="flex items-center gap-2 text-blue-600 text-[10px] font-bold uppercase">
                  <span className="px-2 py-0.5 bg-blue-50 rounded">+8%</span>
                  <span>vs last month</span>
              </div>
          </div>

          <div className="premium-card p-8">
              <MdPieChart className="text-3xl text-orange-500 mb-6" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg. Ticket Size</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">₹{(stats?.totalRevenue / (stats?.totalOrders || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Consistent performance</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="premium-card p-8">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full"></div> Revenue Sources
              </h3>
              <div className="space-y-8">
                  {[
                      { label: "Direct Checkout", value: 72, color: "bg-blue-500" },
                      { label: "Payment Links", value: 22, color: "bg-gray-800" },
                      { label: "Smart Collect", value: 6, color: "bg-gray-200" }
                  ].map((item, i) => (
                      <div key={i}>
                          <div className="flex justify-between items-end mb-2">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                              <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-1000 ${item.color}`} style={{ width: `${item.value}%` }}></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="premium-card p-8">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full"></div> Conversion Funnel
              </h3>
              <div className="space-y-6">
                  {[
                      { label: "Total Visits", value: "2.4k", p: "100%", w: "100%", color: "bg-blue-500" },
                      { label: "Started Payment", value: "1.8k", p: "75%", w: "75%", color: "bg-blue-500" },
                      { label: "Completed", value: "1.2k", p: "50%", w: "50%", color: "bg-blue-500" }
                  ].map((item, i) => (
                      <div key={i} className="flex items-center gap-6">
                          <div className="w-28 shrink-0">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                              <p className="text-lg font-bold text-gray-900">{item.value}</p>
                          </div>
                          <div className="flex-1 h-10 bg-gray-50 rounded-lg relative overflow-hidden border border-gray-100">
                              <div className={`absolute inset-y-0 left-0 ${item.color} opacity-10 border-r-2 border-blue-500 transition-all duration-1000`} style={{ width: item.w }}></div>
                              <div className="absolute inset-0 flex items-center px-4 font-bold text-blue-600 text-[10px]">
                                  {item.p}
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
