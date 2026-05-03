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
      setErrorMessage("Connection failed: " + (err.message || "Unknown error"));
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
          body: JSON.stringify({ amount: Number(amount), timestamp, orderId }),
        });


        const result = await res.json();
        if (result.status === "received" && result.oid === orderId) {
          clearInterval(pollRef.current);
          clearInterval(countdownRef.current);
          const ts = new Date().toISOString();
          
          let finalRedirect = result.returnUrl || redirectURI || "";
          if (finalRedirect) {
              let baseUrl = finalRedirect.split('?')[0].replace(/\/$/, "");
              if (!baseUrl.endsWith("/payment/redirect")) {
                  baseUrl += "/payment/redirect";
              }
              
              const queryStr = finalRedirect.includes("?") ? finalRedirect.split('?')[1] : "";
              const separator = queryStr ? "&" : "?";
              finalRedirect = `${baseUrl}${queryStr ? "?" + queryStr + separator : separator}orderid=${orderId}`;
          }


          window.location.href = `/payment/success?amt=${amount}&mname=${mname}&tmstp=${encodeURIComponent(ts)}&redirect=${encodeURIComponent(finalRedirect)}`;
        }


      } catch (err) {
        console.error("Error verifying payment:", err);
      }
    }, 10000);
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="min-h-screen w-full bg-[#f8fbff] flex items-center justify-center p-4 md:p-8 font-sans">

      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      {/* MAIN CHECKOUT CONTAINER */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-blue-900/10 flex flex-col md:flex-row overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-700">

        {/* LEFT SIDE: MERCHANT & INFO */}
        <div className="w-full md:w-[360px] bg-[#02042B] p-8 md:p-10 text-white flex flex-col relative overflow-hidden">
          {/* Brand Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#3395FF_1px,transparent_1px)] bg-[size:20px_20px]" />
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
              <img src="/logo.png" className="w-10 h-10 rounded-lg" alt="Logo" />
              <span className="text-xl font-black tracking-tight">NexusPay</span>
            </div>


            {viewState === "active" && (
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Merchant</p>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold truncate">{mname}</h2>
                    <MdVerified className="text-[#3395FF] text-xl shrink-0" />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Amount to Pay</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-medium text-slate-400">₹</span>
                    <span className="text-6xl font-black tracking-tighter">{amountValue}</span>
                  </div>
                </div>

                <div className="pt-8 space-y-4">
                  <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <MdShield className="text-blue-500 text-lg" />
                    <span>Secure 256-bit SSL</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <MdBolt className="text-yellow-400 text-lg" />
                    <span>Instant Confirmation</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-auto pt-12 flex flex-col gap-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transaction ID</p>
              <p className="text-xs font-mono text-slate-400 truncate">{oid || "GEN_IN_PROGRESS"}</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: PAYMENT METHODS & QR */}
        <div className="flex-1 bg-white p-8 md:p-10">

          {viewState === "loading" ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
               <div className="w-16 h-16 border-4 border-[#02042B] border-t-transparent rounded-full animate-spin mb-6"></div>
               <p className="text-slate-500 font-bold animate-pulse">Initializing Secure Checkout...</p>
            </div>
          ) : viewState === "active" ? (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" className="w-6 h-6 object-contain" alt="Nexus" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#02042B]">Checkout</h3>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full border border-orange-100">
                  <MdTimer className="text-orange-500 text-lg" />
                  <span className="text-xs font-black text-orange-600 font-mono">
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">

                {/* QR CODE CARD */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Scan with any UPI app</p>

                  <div className="bg-white p-4 rounded-2xl shadow-xl shadow-blue-500/5 mb-6 border border-slate-50 relative group">
                    <img src={qrSrc} alt="UPI QR" className="w-48 h-48 object-contain" />
                    <div className="absolute inset-0 border-2 border-blue-500/5 rounded-2xl group-hover:border-[#02042B]/20 transition-all pointer-events-none" />
                  </div>

                  <div className="flex items-center gap-6 saturate-[0.8] hover:saturate-100 transition-all duration-500">
                    <img src="/gpay.png" className="h-5 object-contain" alt="Google Pay" />
                    <img src="/phonpe.png" className="h-5 object-contain" alt="PhonePe" />
                    <img src="/paytm.png" className="h-5 object-contain" alt="Paytm" />
                  </div>
                </div>

                {/* OTHER INFO */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
                    <MdCheckCircle className="text-blue-500 text-xl" />
                    <p className="text-xs font-bold text-blue-700">No extra charges applied for UPI payments.</p>
                  </div>
                </div>
              </div>


              <p className="mt-auto text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] pt-8">
                Securely processed by NexusPay
              </p>
            </div>
          ) : viewState === "paid_already" ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 text-6xl mb-8 animate-in zoom-in-50 duration-500">
                <MdCheckCircle />
              </div>
              <h2 className="text-3xl font-black mb-4">Payment Received</h2>
              <p className="text-slate-500 font-medium max-w-xs mx-auto mb-10">This order has already been paid for. You can close this window now.</p>
              <button onClick={() => window.close()} className="px-10 py-4 bg-[#02042B] text-white font-black rounded-xl hover:scale-105 transition-all uppercase text-xs tracking-widest">
                Close Window
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 text-6xl mb-8">
                <MdErrorOutline />
              </div>
              <h2 className="text-3xl font-black mb-4">Payment Failed</h2>
              <p className="text-slate-500 font-medium max-w-xs mx-auto mb-10">{errorMessage || "The link is invalid or has expired. Please request a new link."}</p>
              <a href="/" className="px-10 py-4 bg-[#02042B] text-white font-black rounded-xl hover:scale-105 transition-all uppercase text-xs tracking-widest">
                Back to Home
              </a>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}