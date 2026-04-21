"use client";
import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { MdVerified, MdTimer, MdShield, MdBolt, MdCheckCircle, MdErrorOutline } from "react-icons/md";

export default function PayPage() {
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const encryptedAmount = params ? params.get("q") : null;

  const [viewState, setViewState] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const [amountValue, setAmountValue] = useState(0);
  const [mname, setMname] = useState("");
  const [oid, setOid] = useState("");
  const [qrSrc, setQrSrc] = useState("");
  const [redirectURI, setRediectURI] = useState("");
  const [countdown, setCountdown] = useState(5 * 60);

  const pollRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    generate();
    return () => {
      clearInterval(pollRef.current);
      clearInterval(countdownRef.current);
    };
  }, []);

  const generate = async () => {
    try {
      const response = await fetch("/api/generate-upi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: encryptedAmount }),
      });
      const data = await response.json();
      if (data.error === "This payment has already been completed.") {
        setViewState("paid_already");
        setOid(data.order_id);
        return;
      }
      if (data.error) {
        setErrorMessage(data.error);
        setViewState("error");
        return;
      }
      if (data.upiUri && data.amount && data.mname && data.order_id) {
        setAmountValue(data.amount);
        const qrUrl = await QRCode.toDataURL(data.upiUri);
        setQrSrc(qrUrl);
        setMname(data.mname);
        setOid(data.order_id);
        setViewState("active");
        
        setCountdown(5 * 60);
        setRediectURI(data.redirectUri)
        startPolling(data.amount, data.timestamp, data.mname, data.order_id, data.redirectUri); 
        startCountdown();
      } else {
        setErrorMessage("Invalid response from server");
        setViewState("error");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Connection failed");
      setViewState("error");
    }
  };

  const startCountdown = () => {
    clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          clearInterval(pollRef.current);
          window.location.href = `/payment/failure?q=${amountValue}`;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startPolling = (amount, timestamp, mname, orderId, redirectURI) => {
    clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Number(amount), timestamp, order_id: orderId }),
        });

        const result = await res.json();
        if (result.status === "received" && result.oid === orderId) {
          clearInterval(pollRef.current);
          clearInterval(countdownRef.current);
          const ts = new Date().toISOString();
          window.location.href = `/payment/success?amt=${amount}&mname=${mname}&tmstp=${encodeURIComponent(ts)}&redirect=${encodeURIComponent(redirectURI)}`;
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
      }
    }, 10000); 
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  if (viewState === "loading") {
    return (
      <div className="h-screen w-full bg-[#f8fbff] flex flex-col items-center justify-center gap-5">
        <div className="w-12 h-12 border-4 border-[#3395FF]/20 border-t-[#3395FF] rounded-full animate-spin"></div>
        <div className="flex flex-col items-center">
            <p className="text-[#02042b] font-black text-xs uppercase tracking-widest animate-pulse">Connecting to UPI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f8fbff] text-[#02042b] font-sans selection:bg-blue-100 flex flex-col items-center p-6">
      
      {/* HEADER LOGO */}
      <div className="flex items-center gap-2 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <img src="/logo.png" className="w-8 h-8" alt="Logo" />
        <span className="text-xl font-black">NexusPay</span>
      </div>

      {/* PAYMENT CARD */}
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-500">
        
        <div className="p-8 pb-4 text-center">
            {viewState === "active" && (
                <>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Paying To</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-full border border-blue-100 mb-8">
                        <span className="text-sm font-bold text-[#3395FF]">{mname}</span>
                        <MdVerified className="text-[#3395FF]" />
                    </div>

                    <div className="mb-10">
                        <span className="text-xl font-bold text-slate-400">₹</span>
                        <span className="text-5xl font-black text-[#02042b] tracking-tighter ml-1">{amountValue}</span>
                    </div>

                    {/* QR SECTION */}
                    <div className="relative group mx-auto w-64 h-64 bg-white rounded-3xl p-4 shadow-xl shadow-blue-500/5 border border-slate-50 mb-8">
                         <img src={qrSrc} alt="UPI QR" className="w-full h-full object-contain" />
                         <div className="absolute inset-0 border-2 border-blue-500/10 rounded-3xl pointer-events-none"></div>
                    </div>

                    <div className="flex flex-col gap-4 items-center">
                        <div className="flex items-center gap-2 text-xs font-black text-orange-500 uppercase tracking-wider bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                            <MdTimer className="text-lg" />
                            <span>Expires in {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Scan with any UPI App</p>
                        
                        <div className="flex gap-4 opacity-40 grayscale mt-2">
                             <span className="font-black text-sm">GPay</span>
                             <span className="font-black text-sm">PhonePe</span>
                             <span className="font-black text-sm">Paytm</span>
                        </div>
                    </div>
                </>
            )}

            {viewState === "paid_already" && (
                <div className="py-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 text-5xl mb-6">
                        <MdCheckCircle />
                    </div>
                    <h2 className="text-2xl font-black text-[#02042b] mb-2">Order Already Paid</h2>
                    <p className="text-slate-500 font-medium text-sm px-6">This transaction was completed successfully. Your order is being processed.</p>
                </div>
            )}

            {viewState === "error" && (
                <div className="py-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 text-5xl mb-6">
                        <MdErrorOutline />
                    </div>
                    <h2 className="text-2xl font-black text-[#02042b] mb-2">Oops!</h2>
                    <p className="text-slate-500 font-medium text-sm px-6">{errorMessage || "The payment link has expired or is invalid."}</p>
                </div>
            )}
        </div>

        {/* SECURE FOOTER */}
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
             <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <MdShield className="text-green-500 text-lg" />
                100% Encrypted & Secure Payments
             </div>
        </div>
      </div>

      <p className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Powered by NexusPay Systems</p>
    </div>
  );
}