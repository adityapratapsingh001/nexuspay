"use client";
import { useEffect, useState } from "react";
import { MdSearch, MdFilterList, MdCheckCircle, MdTimer, MdFlashOn, MdLink, MdFileDownload, MdHistory, MdOutlineFilterList } from "react-icons/md";
import { getHeaders } from "@/utils/api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({ totalToday: 0, countToday: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = getHeaders();
      
      const [paymentsRes, statsRes] = await Promise.all([
        fetch("/api/merchant/orders", { headers }),
        fetch("/api/merchant/stats", { headers })
      ]);

      const paymentsData = await paymentsRes.json();
      const statsData = await statsRes.json();

      if (Array.isArray(paymentsData)) setPayments(paymentsData);
      if (statsData.totalToday !== undefined) setStats(statsData);
    } catch (error) {
      console.error("Error fetching payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPayments = () => {
    let filtered = payments.filter(p => p.status === "PAID");
    
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    const now = new Date();
    if (filter === "week") {
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(p => new Date(p.paidAt) >= lastWeek);
    } else if (filter === "month") {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        filtered = filtered.filter(p => new Date(p.paidAt) >= lastMonth);
    }

    return filtered;
  };

  const filteredPayments = getFilteredPayments();

  const exportToCSV = () => {
    if (filteredPayments.length === 0) return;
    const headers = ["Order ID", "Date", "Amount", "Description", "Source", "Status"];
    const rows = filteredPayments.map(p => [
        p.orderId,
        new Date(p.paidAt).toLocaleString(),
        p.amount,
        p.description || "",
        p.source,
        p.status
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `payments_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50/30 p-6 md:p-10 transition-all duration-300">
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your successful transactions.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
            <button 
                onClick={exportToCSV}
                className="btn-secondary py-2 px-4"
            >
                <MdFileDownload className="text-lg" /> Export
            </button>
            <div className="premium-card py-2 px-4 flex items-center gap-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Today</p>
                <h3 className="text-lg font-bold text-gray-900">₹{stats.totalToday.toLocaleString()}</h3>
            </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input 
            type="text" 
            placeholder="Search by ID or Description..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex p-1 bg-gray-100 rounded-lg border border-gray-200">
            {["all", "week", "month"].map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    {f === "all" ? "All Time" : f === "week" ? "Week" : "Month"}
                </button>
            ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Loading Payments...</p>
        </div>
      ) : filteredPayments.length > 0 ? (
        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Source</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPayments.map((p) => (
                  <tr key={p.orderId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${p.source === 'API' ? 'bg-blue-50 text-primary' : 'bg-blue-50 text-blue-600'}`}>
                            {p.source === 'API' ? <MdFlashOn /> : <MdLink />}
                        </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-mono text-[11px] font-medium text-gray-500 uppercase">{p.orderId}</span>
                    </td>
                    <td className="px-6 py-5">
                        <p className="text-xs font-semibold text-gray-900 leading-none mb-1">
                            {new Date(p.paidAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase">
                            {new Date(p.paidAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </td>
                    <td className="px-6 py-5 text-right">
                        <span className="text-sm font-bold text-gray-900">₹{p.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5 text-xs font-medium text-gray-400 truncate max-w-[150px]">
                      {p.description || "—"}
                    </td>
                    <td className="px-6 py-5 text-right">
                        <button className="text-primary hover:text-blue-700 text-[10px] font-bold uppercase tracking-widest">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="premium-card p-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 text-3xl mb-4">
            <MdHistory />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No transactions found</h3>
          <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">Try adjusting your filters or checking back later.</p>
        </div>
      )}
    </div>
  );
}
