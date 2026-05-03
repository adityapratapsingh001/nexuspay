"use client";
import { useState, useEffect } from "react";
import { getHeaders } from "@/utils/api";
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
  MdPerson,
  MdSecurity,
  MdArrowForward,
  MdVerifiedUser
} from "react-icons/md";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [activeStep, setActiveStep] = useState(1);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        router.push("/login");
        return;
    }

    fetch("/api/auth/me", {
        headers: getHeaders()
    })
      .then(res => res.json())
      .then(data => {
        if (data.email) setEmail(data.email);
        else router.push("/login");
      })
      .catch(() => router.push("/login"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      email,
      aadhar: form.aadhar.replace(/\s/g, "")
    };

    try {
        const res = await fetch("/api/merchant/onboard", {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            router.push("/dashboard");
        } else {
            alert(data.error || "Onboarding failed. Please check your details.");
        }
    } catch (error) {
        alert("A network error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const inputClass = "w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-secondary font-bold placeholder:text-slate-300 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm";
  const labelClass = "block text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2.5 px-1";
  const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl transition-colors group-focus-within:text-primary";

  return (
    <div className="min-h-screen w-full bg-[#fcfdfe] text-secondary flex flex-col font-sans">
      
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <img src="/logo.png" className="w-6 h-6 brightness-0 invert" alt="Logo" />
          </div>
          <span className="text-xl font-black text-secondary tracking-tight">NexusPay</span>
        </div>
        <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                <MdSecurity /> Secured Session
            </div>
            <LogoutButton />
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center pt-32 pb-20 px-6">
        
        {/* Step Indicator */}
        <div className="w-full max-w-4xl mb-12 flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
            {[1, 2, 3].map(step => (
                <div key={step} className="relative z-10 flex flex-col items-center gap-3 group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 border-4 border-[#fcfdfe] ${
                        activeStep >= step ? "bg-primary text-white shadow-xl shadow-blue-500/30 scale-110" : "bg-slate-200 text-slate-500"
                    }`}>
                        {step === 1 && <MdBusiness className="text-2xl" />}
                        {step === 2 && <MdVerifiedUser className="text-2xl" />}
                        {step === 3 && <MdAccountBalance className="text-2xl" />}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${activeStep >= step ? "text-primary" : "text-slate-400"}`}>
                        {step === 1 ? "Business" : step === 2 ? "Identity" : "Banking"}
                    </span>
                </div>
            ))}
        </div>

        <div className="w-full max-w-4xl bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-blue-900/5 overflow-hidden">
            <div className="bg-slate-50/50 px-10 py-8 border-b border-slate-100">
                <h1 className="text-3xl font-black text-secondary tracking-tight mb-2">Merchant Activation</h1>
                <p className="text-slate-500 font-medium">Complete your details to start accepting live payments.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-10 md:p-14 space-y-14">
                
                {/* BUSINESS SECTION */}
                <div className={activeStep === 1 ? "block" : "hidden"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="col-span-2">
                            <label className={labelClass}>Registered Business Name</label>
                            <div className="relative group">
                                <MdBusiness className={iconClass} />
                                <input name="businessName" required value={form.businessName} onChange={update} placeholder="Ex: Acme Corp Private Limited" className={inputClass} />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Business Category</label>
                            <div className="relative group">
                                <MdCategory className={iconClass} />
                                <select name="category" required value={form.category} onChange={update} className={`${inputClass} appearance-none cursor-pointer`}>
                                    <option value="">Select Category</option>
                                    <option>E-commerce</option>
                                    <option>Education</option>
                                    <option>Services</option>
                                    <option>Gaming</option>
                                    <option>Real Estate</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Business Website</label>
                            <div className="relative group">
                                <MdLanguage className={iconClass} />
                                <input name="website" value={form.website} onChange={update} placeholder="https://yourwebsite.com" className={inputClass} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* IDENTITY SECTION */}
                <div className={activeStep === 2 ? "block" : "hidden"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <label className={labelClass}>Business PAN</label>
                            <div className="relative group">
                                <MdBadge className={iconClass} />
                                <input name="pan" required value={form.pan} onChange={update} maxLength={10} placeholder="ABCDE1234F" className={`${inputClass} uppercase font-mono`} />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Aadhaar Number</label>
                            <div className="relative group">
                                <MdFingerprint className={iconClass} />
                                <input name="aadhar" required value={form.aadhar} onChange={update} placeholder="0000 0000 0000" className={`${inputClass} font-mono`} />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className={labelClass}>Registered Mobile Number</label>
                            <div className="relative group">
                                <MdPhone className={iconClass} />
                                <input name="mobile" required value={form.mobile} onChange={update} maxLength={10} placeholder="9876543210" className={`${inputClass} font-mono`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* BANKING SECTION */}
                <div className={activeStep === 3 ? "block" : "hidden"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="col-span-2">
                            <label className={labelClass}>Account Holder Name</label>
                            <div className="relative group">
                                <MdPerson className={iconClass} />
                                <input name="accountHolder" required value={form.accountHolder} onChange={update} placeholder="Exactly as per bank records" className={inputClass} />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Bank IFSC Code</label>
                            <div className="relative group">
                                <MdAccountBalance className={iconClass} />
                                <input name="ifsc" required value={form.ifsc} onChange={update} maxLength={11} placeholder="HDFC0001234" className={`${inputClass} uppercase font-mono`} />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Account Number</label>
                            <div className="relative group">
                                <MdNumbers className={iconClass} />
                                <input name="accountNumber" required value={form.accountNumber} onChange={update} maxLength={18} placeholder="0000 0000 0000 0000" className={`${inputClass} font-mono`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* NAVIGATION BUTTONS */}
                <div className="pt-10 flex flex-col md:flex-row gap-4">
                    {activeStep > 1 && (
                        <button 
                            type="button" 
                            onClick={() => setActiveStep(activeStep - 1)}
                            className="flex-1 btn-secondary py-5 uppercase tracking-widest text-sm"
                        >
                            Back
                        </button>
                    )}
                    
                    {activeStep < 3 ? (
                        <button 
                            type="button" 
                            onClick={() => setActiveStep(activeStep + 1)}
                            className="flex-[2] btn-primary py-5 uppercase tracking-widest text-sm"
                        >
                            Continue <MdArrowForward className="text-xl" />
                        </button>
                    ) : (
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-[2] btn-primary py-5 uppercase tracking-widest text-sm disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span>Verifying...</span>
                                </div>
                            ) : "Complete Activation"}
                        </button>
                    )}
                </div>

                <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                    <MdSecurity className="text-3xl text-primary mt-1" />
                    <div>
                        <h4 className="text-sm font-black text-secondary uppercase tracking-tight mb-1">Your data is safe with us</h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                            We use bank-grade 256-bit AES encryption to secure your details. Your sensitive information is never shared with third parties.
                        </p>
                    </div>
                </div>
            </form>
        </div>

        <p className="mt-10 text-slate-400 font-bold text-xs uppercase tracking-widest text-center">
            NexusPay India Private Limited • PCI-DSS Compliant Infrastructure
        </p>
      </div>
    </div>
  );
}