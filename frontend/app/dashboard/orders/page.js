"use client";
import { useEffect, useState } from "react";
import { MdSearch, MdReceipt, MdCheckCircle, MdTimer, MdInfo } from "react-icons/md";
import { getHeaders } from "@/utils/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/merchant/orders", {
        headers: getHeaders()
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID": return "bg-green-50 text-green-600 border-green-100";
      case "PENDING": return "bg-orange-50 text-orange-600 border-orange-100";
      case "FAILED": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#02042b] tracking-tight">Orders</h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Real-time transaction and order monitoring.</p>
        </div>

        <div className="relative group">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Order ID..."
            className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl w-full md:w-80 shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{order.orderId}</span>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-8 py-6 text-lg font-black text-[#02042b]">
                      ₹{order.amount}
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-500">
                      {order.description || "—"}
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status === "PAID" ? <MdCheckCircle /> : order.status === "PENDING" ? <MdTimer /> : <MdInfo />}
                        {order.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-xl shadow-slate-200/50">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-5xl mb-6 grayscale opacity-50">📦</div>
          <h3 className="text-2xl font-black text-[#02042b]">No orders found</h3>
          <p className="text-slate-400 max-w-xs mx-auto mt-2 font-medium">Your sales and payment requests will appear here once they are generated.</p>
          <button className="mt-8 px-8 py-4 bg-[#02042b] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
            Create Payment Link
          </button>
        </div>
      )}
    </div>
  );
}

