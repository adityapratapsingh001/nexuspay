"use client";
import { useState, useEffect } from "react";

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

  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.email) setEmail(data.email);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      email,
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
  const inputClass = "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[#02042b] font-medium placeholder:text-slate-400 outline-none focus:border-[#3395FF] focus:ring-4 focus:ring-blue-500/10 transition-all";
  const labelClass = "block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg";

  return (
    <div className="min-h-screen w-full bg-[#f8fbff] text-[#02042b] font-sans selection:bg-blue-100 flex flex-col relative">

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="w-10 h-10" />
          <h1 className="text-xl font-bold text-[#02042b] tracking-tight">NexusPay</h1>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block">Step 1 of 1</span>
            <LogoutButton />
        </div>
      </nav>

      <div className="flex-1 flex justify-center items-start py-12 px-4 relative z-10 overflow-y-auto">

        <div className="w-full max-w-4xl bg-white shadow-xl shadow-blue-500/5 border border-slate-100 rounded-[2.5rem] p-8 md:p-12 animate-[fadeIn_0.5s_ease-out]">

          <div className="mb-12">
            <h1 className="text-4xl font-black text-[#02042b] mb-3">Merchant Onboarding</h1>
            <p className="text-slate-500 font-medium text-lg">Complete your profile to activate your live payment gateway.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">

            {/* SECTION 1: Business Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3395FF] flex items-center justify-center font-bold text-sm">1</div>
                  <h3 className="text-sm font-black text-[#02042b] uppercase tracking-widest">Business Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className={labelClass}>Registered Business Name</label>
                  <div className="relative group">
                    <MdBusiness className={`${iconClass} group-focus-within:text-[#3395FF] transition-colors`} />
                    <input name="businessName" required value={form.businessName} onChange={update} placeholder="Ex: Acme Corp Pvt Ltd" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Category</label>
                  <div className="relative group">
                    <MdCategory className={`${iconClass} group-focus-within:text-[#3395FF] transition-colors`} />
                    <select name="category" required value={form.category} onChange={update} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="" className="text-slate-400">Select Category</option>
                      <option>Grocery</option>
                      <option>Electronics</option>
                      <option>Restaurant</option>
                      <option>Services</option>
                      <option>Education</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Website (Optional)</label>
                  <div className="relative group">
                    <MdLanguage className={`${iconClass} group-focus-within:text-[#3395FF] transition-colors`} />
                    <input name="website" value={form.website} onChange={update} placeholder="https://mercurion.com" className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Legal & Identity */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-sm">2</div>
                  <h3 className="text-sm font-black text-[#02042b] uppercase tracking-widest">Identity Verification</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelClass}>PAN Number</label>
                  <div className="relative group">
                    <MdBadge className={`${iconClass} group-focus-within:text-indigo-500 transition-colors`} />
                    <input name="pan" required value={form.pan} onChange={update} maxLength={10} placeholder="ABCDE1234F" className={`${inputClass} uppercase font-mono`} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Aadhaar Number</label>
                  <div className="relative group">
                    <MdFingerprint className={`${iconClass} group-focus-within:text-indigo-500 transition-colors`} />
                    <input name="aadhar" required value={form.aadhar} onChange={update} placeholder="0000 0000 0000" className={`${inputClass} font-mono`} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Mobile Number</label>
                  <div className="relative group">
                    <MdPhone className={`${iconClass} group-focus-within:text-indigo-500 transition-colors`} />
                    <input name="mobile" required value={form.mobile} onChange={update} maxLength={10} placeholder="9876543210" className={`${inputClass} font-mono`} />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: Banking */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center font-bold text-sm">3</div>
                  <h3 className="text-sm font-black text-[#02042b] uppercase tracking-widest">Banking Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Account Holder Name</label>
                  <div className="relative group">
                    <MdPerson className={`${iconClass} group-focus-within:text-purple-500 transition-colors`} />
                    <input name="accountHolder" required value={form.accountHolder} onChange={update} placeholder="Name as per Bank" className={inputClass} />
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>IFSC Code</label>
                  <div className="relative group">
                    <MdAccountBalance className={`${iconClass} group-focus-within:text-purple-500 transition-colors`} />
                    <input name="ifsc" required value={form.ifsc} onChange={update} maxLength={11} placeholder="SBIN0001234" className={`${inputClass} uppercase font-mono`} />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className={labelClass}>Account Number</label>
                  <div className="relative group">
                    <MdNumbers className={`${iconClass} group-focus-within:text-purple-500 transition-colors`} />
                    <input name="accountNumber" required value={form.accountNumber} onChange={update} maxLength={18} placeholder="000000000000" className={`${inputClass} font-mono`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className={`hover:cursor-pointer w-full py-5 rounded-2xl font-black text-white shadow-xl shadow-blue-500/20 transition-all transform active:scale-[0.98] uppercase tracking-widest text-sm ${loading ? "bg-slate-400 cursor-wait" : "bg-[#3395FF] hover:bg-blue-600"
                  }`}
              >
                {loading ? "Verifying Details..." : "Complete Activation"}
              </button>
              <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-6">
                  By clicking activate, you agree to our <a href="#" className="text-[#3395FF] hover:underline">Terms of Service</a> and <a href="#" className="text-[#3395FF] hover:underline">Privacy Policy</a>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}