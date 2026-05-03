"use client";
import { useEffect, useState } from "react";
import { MdSearch, MdCheckCircle, MdTimer, MdInfo, MdOutlineShoppingBag, MdOutlineFilterList } from "react-icons/md";
import { getHeaders } from "@/utils/api";
import Link from "next/link";

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
      if (Array.isArray(data)) setOrders(data);
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

  const getStatusStyle = (status) => {
    switch (status) {
      case "PAID": return "bg-blue-50 text-primary border-blue-100";
      case "PENDING": return "bg-orange-50 text-orange-600 border-orange-100";
      case "FAILED": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-400 border-gray-100";
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50/30 p-6 md:p-10 transition-all duration-300">
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time status of all generated payment requests.</p>
        </div>

        <div className="flex items-center gap-3">
            <button className="btn-secondary py-2 px-4">
                <MdOutlineFilterList className="text-lg" /> Filter
            </button>
            <Link href="/dashboard/payment-links" className="btn-primary py-2 px-4">
                 New Link
            </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input 
          type="text" 
          placeholder="Search Order ID..."
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fetching Orders...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-900 font-medium">
                {filteredOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <span className="font-mono text-[11px] text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        {order.orderId}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                        <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                        <p className="text-[10px] text-gray-400 uppercase">{new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-5 text-right font-bold">
                      ₹{order.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-xs text-gray-400 truncate max-w-[150px]">
                      {order.description || "—"}
                    </td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                        {order.status === "PAID" ? <MdCheckCircle /> : order.status === "PENDING" ? <MdTimer /> : <MdInfo />}
                        {order.status}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                        <button className="text-gray-400 hover:text-primary transition-colors">
                            <MdInfo className="text-xl" />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="premium-card p-24 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 text-3xl mb-4">
            <MdOutlineShoppingBag />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No orders found</h3>
          <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">Your payment requests will appear here once they are generated.</p>
          <Link href="/dashboard/payment-links" className="mt-6 text-primary font-bold text-xs uppercase tracking-widest hover:underline">
            Create Payment Link
          </Link>
        </div>
      )}
    </div>
  );
}
