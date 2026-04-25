"use client";
import { useState } from "react";
import { MdSettings, MdLock, MdCheckCircle, MdError } from "react-icons/md";
import Toast from "@/components/Toast";

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showToast("New passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      const email = localStorage.getItem("userEmail") || "demo@nexuspay.com";
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Password updated successfully");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        showToast(data.error || "Failed to update password", "error");
      }
    } catch (error) {
      showToast("Network error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-700 max-w-2xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="mb-12">
        <h1 className="text-4xl font-black text-[#02042b] tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                <MdSettings />
            </div>
            Settings
        </h1>
        <p className="text-slate-500 font-medium text-lg mt-4">Manage your account preferences and security.</p>
      </div>

      <div className="space-y-8">
        <section className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
            <h3 className="text-xl font-black text-[#02042b] mb-8 flex items-center gap-3">
                <MdLock className="text-blue-500" /> Security & Password
            </h3>
            
            <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Current Password</label>
                    <input 
                        type="password" 
                        required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium"
                        value={passwords.current}
                        onChange={e => setPasswords({...passwords, current: e.target.value})}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">New Password</label>
                        <input 
                            type="password" 
                            required
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium"
                            value={passwords.new}
                            onChange={e => setPasswords({...passwords, new: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Confirm New Password</label>
                        <input 
                            type="password" 
                            required
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium"
                            value={passwords.confirm}
                            onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                        />
                    </div>
                </div>

                <button 
                    disabled={loading}
                    className="mt-4 px-10 py-4 bg-[#02042b] text-white font-black rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-3 text-xs uppercase tracking-widest"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </section>

        <section className="bg-red-50/50 border border-red-100 rounded-[2.5rem] p-10">
             <h3 className="text-lg font-black text-red-600 mb-2">Danger Zone</h3>
             <p className="text-red-400 text-sm font-medium mb-6">Irreversible actions for your account.</p>
             <button className="px-8 py-4 bg-white border border-red-200 text-red-600 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                Deactivate Merchant Account
             </button>
        </section>
      </div>
    </div>
  );
}
