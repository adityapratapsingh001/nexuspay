"use client";
import { useEffect, useState } from "react";
import { MdAccountBalance, MdCheckCircle, MdTimer, MdError, MdInfo, MdHistory, MdOutlineAccountBalance, MdFlashOn } from "react-icons/md";
import Toast from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import { getHeaders } from "@/utils/api";

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(false);
    setRequesting(true);
    try {
      const res = await fetch("/api/merchant/request-settlement", {
        method: "POST",
        headers: getHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Settlement initiated successfully.");
        fetchSettlements();
      } else {
        showToast(data.error || "Request failed", "error");
      }
    } catch (error) {
      showToast("Network error", "error");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50/30 p-6 md:p-10 transition-all duration-300">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settlements</h1>
          <p className="text-sm text-gray-500 mt-1">Withdraw your collected funds to your bank account.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={requesting}
          className="btn-primary py-3 px-8 text-xs uppercase tracking-widest"
        >
          {requesting ? "Processing..." : <><MdFlashOn className="text-lg" /> Instant Settlement</>}
        </button>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleRequestSettlement}
        title="Confirm Settlement"
        confirmText="Withdraw Funds"
      >
        Are you sure you want to withdraw <span className="font-bold text-white">₹{balance?.toLocaleString()}</span> to your registered bank account? 
        The funds will be processed via IMPS/NEFT.
      </ConfirmModal>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="premium-card p-8 bg-gray-900 text-white border-none shadow-xl shadow-gray-200">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Available for Settlement</p>
          <h3 className="text-4xl text-white font-bold mb-8">₹{balance?.toLocaleString()}</h3>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white/10 w-fit px-3 py-1.5 rounded-lg border border-white/5">
            <MdTimer /> T+1 Cycle
          </div>
        </div>

        <div className="premium-card p-8 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Last Settlement</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {settlements.length > 0 ? `₹${settlements[0].netAmount.toLocaleString()}` : "₹0.00"}
          </h3>
          <p className="text-[10px] text-primary font-bold uppercase mt-2">Paid successfully</p>
        </div>

        <div className="premium-card p-8 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Bank Mode</p>
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <MdOutlineAccountBalance className="text-xl text-gray-400" />
            <span className="uppercase tracking-widest">IMPS / NEFT</span>
          </div>
        </div>
      </div>

      <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MdHistory className="text-gray-400 text-lg" /> Payout History
      </h3>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading Records...</p>
        </div>
      ) : settlements.length > 0 ? (
        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payout Amount</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">MDR + Tax</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">UTR Reference</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium text-gray-900">
                {settlements.map((s) => (
                  <tr key={s.settlementId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 font-mono text-[11px] text-gray-400">{s.settlementId}</td>
                    <td className="px-6 py-5 font-bold">₹{s.netAmount.toLocaleString()}</td>
                    <td className="px-6 py-5 text-red-500">-₹{(s.fees + s.tax).toLocaleString()}</td>
                    <td className="px-6 py-5 font-mono text-[11px] text-blue-500">{s.utr || "PENDING"}</td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-primary border-blue-100`}>
                        <MdCheckCircle /> {s.status}
                      </div>
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
            <MdAccountBalance />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No settlements yet</h3>
          <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">Click on 'Instant Settlement' to move your balance to your bank.</p>
        </div>
      )}
    </div>
  );
}
