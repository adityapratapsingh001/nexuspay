"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/Logout";
import {
  MdBusiness,
  MdCategory,
  MdLanguage,
  MdBadge,
  MdFingerprint,
  MdPhone,
  MdAccountBalance,
  MdNumbers,
  MdPerson
} from "react-icons/md";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    businessName: "",
    category: "",
    website: "",
    pan: "",
    aadhar: "",
    mobile: "",
    accountHolder: "",
    accountNumber: "",
    ifsc: ""
  });

  const update = (e) => {
    const { name, value } = e.target;

    if (name === "pan") {
      let val = value.toUpperCase();
      if (!/^[A-Z]{0,5}[0-9]{0,4}[A-Z]{0,1}$/.test(val)) return;
      setForm({ ...form, pan: val });
      return;
    }

    if (name === "aadhar") {
      let numeric = value.replace(/\D/g, "").slice(0, 12);
      let formatted = numeric.replace(/(\d{4})(?=\d)/g, "$1 ");
      setForm({ ...form, aadhar: formatted });
      return;
    }

    if (name === "mobile") {
      if (!/^[0-9]{0,10}$/.test(value)) return;
      setForm({ ...form, mobile: value });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      aadhar: form.aadhar.replace(/\s/g, "")
    };

    const res = await fetch("/api/merchant/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) router.push("/dashboard");
    else alert(data.error || "Onboarding failed");
  };

  // Helper for input classes to keep JSX clean
  const inputClass = "w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all";
  const labelClass = "block text-xs font-medium text-slate-400 mb-1.5 ml-1";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg";

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col relative">

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img src="/icon.png" className="w-10" />
          <h1 className="text-lg font-bold text-white tracking-tight">NexusPay</h1>
        </div>
        <LogoutButton />
      </nav>

      <div className="flex-1 flex justify-center items-start py-12 px-4 relative z-10 overflow-y-auto">

        <div className="w-full max-w-4xl bg-slate-900/60 backdrop-blur-xl shadow-2xl border border-white/10 rounded-3xl p-8 md:p-10 animate-[fadeIn_0.5s_ease-out]">

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Merchant Onboarding</h1>
            <p className="text-slate-400">Complete your profile to activate payments.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* SECTION 1: Business Details */}
            <div>
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Business Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className={labelClass}>Registered Business Name</label>
                  <div className="relative group">
                    <MdBusiness className={`${iconClass} group-focus-within:text-blue-400 transition-colors`} />
                    <input name="businessName" required value={form.businessName} onChange={update} placeholder="Ex: Acme Corp Pvt Ltd" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Category</label>
                  <div className="relative group">
                    <MdCategory className={`${iconClass} group-focus-within:text-blue-400 transition-colors`} />
                    <select name="category" required value={form.category} onChange={update} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="" className="bg-slate-900 text-slate-500">Select Category</option>
                      <option className="bg-slate-900">Grocery</option>
                      <option className="bg-slate-900">Electronics</option>
                      <option className="bg-slate-900">Restaurant</option>
                      <option className="bg-slate-900">Services</option>
                      <option className="bg-slate-900">Education</option>
                      <option className="bg-slate-900">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Website (Optional)</label>
                  <div className="relative group">
                    <MdLanguage className={`${iconClass} group-focus-within:text-blue-400 transition-colors`} />
                    <input name="website" value={form.website} onChange={update} placeholder="https://mercurion.com" className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Legal & Identity */}
            <div>
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Identity Verification</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelClass}>PAN Number</label>
                  <div className="relative group">
                    <MdBadge className={`${iconClass} group-focus-within:text-cyan-400 transition-colors`} />
                    <input name="pan" required value={form.pan} onChange={update} maxLength={10} placeholder="ABCDE1234F" className={`${inputClass} uppercase font-mono`} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Aadhaar Number</label>
                  <div className="relative group">
                    <MdFingerprint className={`${iconClass} group-focus-within:text-cyan-400 transition-colors`} />
                    <input name="aadhar" required value={form.aadhar} onChange={update} placeholder="0000 0000 0000" className={`${inputClass} font-mono`} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Mobile Number</label>
                  <div className="relative group">
                    <MdPhone className={`${iconClass} group-focus-within:text-cyan-400 transition-colors`} />
                    <input name="mobile" required value={form.mobile} onChange={update} maxLength={10} placeholder="9876543210" className={`${inputClass} font-mono`} />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: Banking */}
            <div>
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Banking Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Account Holder Name</label>
                  <div className="relative group">
                    <MdPerson className={`${iconClass} group-focus-within:text-purple-400 transition-colors`} />
                    <input name="accountHolder" required value={form.accountHolder} onChange={update} placeholder="Name as per Bank" className={inputClass} />
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>IFSC Code</label>
                  <div className="relative group">
                    <MdAccountBalance className={`${iconClass} group-focus-within:text-purple-400 transition-colors`} />
                    <input name="ifsc" required value={form.ifsc} onChange={update} maxLength={11} placeholder="SBIN0001234" className={`${inputClass} uppercase font-mono`} />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className={labelClass}>Account Number</label>
                  <div className="relative group">
                    <MdNumbers className={`${iconClass} group-focus-within:text-purple-400 transition-colors`} />
                    <input name="accountNumber" required value={form.accountNumber} onChange={update} maxLength={18} placeholder="000000000000" className={`${inputClass} font-mono`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`hover:cursor-pointer w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.99] ${loading ? "bg-slate-700 cursor-wait opacity-70" : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-blue-500/25 hover:brightness-110"
                  }`}
              >
                {loading ? "Verifying & Submitting..." : "Complete Onboarding"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}