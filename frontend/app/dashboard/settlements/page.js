"use client";
import { useEffect, useState } from "react";
import { MdAccountBalance, MdCheckCircle, MdTimer, MdError, MdInfo, MdHistory } from "react-icons/md";
import Toast from "@/components/Toast";
import { getHeaders } from "@/utils/api";

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    try {
      const res = await fetch("/api/merchant/settlements", {
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.settlements) {
        setSettlements(data.settlements);
        setBalance(data.availableBalance);
      }
    } catch (error) {
      console.error("Error fetching settlements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSettlement = async () => {
    setRequesting(true);
    try {
      const res = await fetch("/api/merchant/request-settlement", {
        method: "POST",
        headers: getHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Settlement processed successfully!");
        fetchSettlements();
      } else {
        showToast(data.error || "Failed to process settlement", "error");
      }
    } catch (error) {
      showToast("Network error", "error");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-700">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#02042b] tracking-tight flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                  <MdAccountBalance />
              </div>
              Settlements
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-4">Manage your payouts and bank transfers.</p>
        </div>
        <button 
            onClick={handleRequestSettlement}
            disabled={requesting}
            className="px-10 py-5 bg-[#02042b] text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
        >
            {requesting ? "Processing..." : "Instant Settlement"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Available Balance</p>
              <h3 className="text-4xl font-black mb-6 italic">₹{balance?.toLocaleString()}</h3>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 w-fit px-3 py-1.5 rounded-full">
                  <MdInfo className="text-sm" /> T+1 Settlement Cycle
              </div>
          </div>
          
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Last Payout</p>
              <h3 className="text-3xl font-black text-[#02042b]">
                {settlements.length > 0 ? `₹${settlements[0].netAmount.toLocaleString()}` : "₹0.00"}
              </h3>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Settlement Cycle</p>
              <h3 className="text-xl font-black text-[#02042b] uppercase tracking-widest">Instant Pay</h3>
          </div>
      </div>

      <h3 className="text-xl font-black text-[#02042b] mb-8 flex items-center gap-3">
          <MdHistory className="text-slate-400" /> Payout History
      </h3>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : settlements.length > 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement ID</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Amount</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fees & Tax</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">UTR / Reference</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {settlements.map((s) => (
                        <tr key={s.settlementId} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6 font-mono text-xs font-bold text-slate-400">{s.settlementId}</td>
                            <td className="px-8 py-6 text-lg font-black text-[#02042b]">₹{s.netAmount.toLocaleString()}</td>
                            <td className="px-8 py-6 text-sm font-medium text-red-400">-₹{(s.fees + s.tax).toLocaleString()}</td>
                            <td className="px-8 py-6 font-mono text-xs font-bold text-blue-500 tracking-tighter">{s.utr}</td>
                            <td className="px-8 py-6">
                                <span className="px-3 py-1.5 bg-green-50 text-green-600 text-[10px] font-black rounded-lg uppercase tracking-widest">
                                    {s.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] border border-slate-100 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto grayscale opacity-50">🏦</div>
            <h3 className="text-2xl font-black text-[#02042b]">No settlements yet</h3>
            <p className="text-slate-400 mt-2 font-medium">Click on 'Instant Settlement' to transfer funds to your bank.</p>
        </div>
      )}
    </div>
  );
}
