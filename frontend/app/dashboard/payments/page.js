"use client";
import { useEffect, useState } from "react";
import { MdSearch, MdHistory, MdFilterList, MdCheckCircle, MdTimer, MdFlashOn, MdLink } from "react-icons/md";
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
    
    // Filter by Search
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Filter by Time
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
    link.setAttribute("download", `nexus_payments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#02042b] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#02042b] to-slate-500">Payments</h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Monitor your successful revenue streams.</p>
        </div>

        <div className="flex gap-4 items-center">
            <button 
                onClick={exportToCSV}
                className="px-6 py-4 bg-white border border-slate-200 text-[#02042b] font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
            >
                Download CSV
            </button>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">

                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 text-2xl">
                    ₹
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Today's Collection</p>
                    <h3 className="text-2xl font-black text-[#02042b]">₹{stats.totalToday}</h3>
                </div>
            </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by ID or Description..."
            className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl w-full shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
            {["all", "week", "month"].map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-[#02042b] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    {f === "all" ? "All Time" : f === "week" ? "Last Week" : "Last Month"}
                </button>
            ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredPayments.length > 0 ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paid At</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPayments.map((p) => (
                  <tr key={p.orderId} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${p.source === 'API' ? 'bg-indigo-50 text-indigo-500' : 'bg-blue-50 text-blue-500'}`} title={p.source}>
                            {p.source === 'API' ? <MdFlashOn /> : <MdLink />}
                        </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-mono text-xs font-bold text-slate-500">{p.orderId}</span>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-600">
                      {new Date(p.paidAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-8 py-6 text-lg font-black text-green-600">
                      ₹{p.amount}
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-400">
                      {p.description || "—"}
                    </td>
                    <td className="px-8 py-6 text-right">
                        <button className="text-blue-500 hover:text-blue-700 text-xs font-black uppercase tracking-widest">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-xl shadow-slate-200/50">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-5xl mb-6 grayscale opacity-50">💳</div>
          <h3 className="text-2xl font-black text-[#02042b]">No successful payments</h3>
          <p className="text-slate-400 max-w-xs mx-auto mt-2 font-medium">Try changing your filters or checking the Orders tab for pending requests.</p>
        </div>
      )}
    </div>
  );
}

