"use client";
import { useState } from "react";
import { MdSettings, MdLock, MdCheckCircle, MdError, MdShield, MdDeleteOutline, MdPerson, MdSecurity } from "react-icons/md";
import Toast from "@/components/Toast";
import { getHeaders } from "@/utils/api";

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
      const email = localStorage.getItem("userEmail");
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: getHeaders(),
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
        showToast(data.error || "Update failed", "error");
      }
    } catch (error) {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block";
  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-900 font-medium outline-none focus:border-blue-500 transition-all placeholder:text-gray-200";

  return (
    <div className="flex-1 min-h-screen bg-gray-50/30 p-6 md:p-10 transition-all duration-300">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="mb-10 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                <MdSettings />
            </div>
            Settings
        </h1>
        <p className="text-sm text-gray-500 mt-2">Manage your merchant account preferences and security.</p>
      </div>

      <div className="max-w-2xl space-y-10">
        
        {/* Profile */}
        <div className="premium-card p-8 flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-primary text-2xl">
                <MdPerson />
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">Business Profile</h3>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-tight">Active Merchant</p>
            </div>
        </div>

        {/* Security */}
        <section className="premium-card p-8">
            <div className="flex items-center gap-2 mb-8 text-primary">
                <MdSecurity className="text-xl" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Security & Credentials</h3>
            </div>
            
            <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                    <label className={labelClass}>Current Password</label>
                    <input 
                        type="password" 
                        required
                        className={inputClass}
                        value={passwords.current}
                        onChange={e => setPasswords({...passwords, current: e.target.value})}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>New Password</label>
                        <input 
                            type="password" 
                            required
                            className={inputClass}
                            value={passwords.new}
                            onChange={e => setPasswords({...passwords, new: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Confirm New Password</label>
                        <input 
                            type="password" 
                            required
                            className={inputClass}
                            value={passwords.confirm}
                            onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                        />
                    </div>
                </div>

                <button 
                    disabled={loading}
                    className="btn-primary py-3 px-8 text-xs uppercase tracking-widest shadow-none disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </section>

        {/* Danger */}
        <section className="bg-red-50/50 border border-red-100 rounded-xl p-8">
             <div className="flex items-center gap-2 mb-4 text-red-600">
                 <MdDeleteOutline className="text-xl" />
                 <h3 className="text-sm font-bold uppercase tracking-widest">Danger Zone</h3>
             </div>
             
             <p className="text-xs text-red-500/70 font-medium mb-6 leading-relaxed">
                 Closing your account will disable all payment links and API access. This action cannot be undone.
             </p>
             
             <button className="px-6 py-2.5 bg-white border border-red-200 text-red-600 font-bold rounded-lg text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                Deactivate Account
             </button>
        </section>

      </div>
    </div>
  );
}
