"use client";
import { MdCode, MdContentCopy, MdBolt, MdSecurity, MdWebhook, MdHistory } from "react-icons/md";


export default function DocsPage() {
  const copy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-700 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-[#02042b] tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#3395FF]">
                <MdCode />
            </div>
            API Documentation
        </h1>
        <p className="text-slate-500 font-medium text-lg mt-4">Integrate NexusPay into your application with our robust REST API.</p>
      </div>

      <div className="space-y-12">
        {/* Authentication */}
        <section>
            <h3 className="text-xl font-black text-[#02042b] mb-4 flex items-center gap-2">
                <MdSecurity className="text-blue-500" /> Authentication
            </h3>
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                    All API requests must include your <code className="bg-slate-50 px-2 py-1 rounded font-bold text-blue-500">X-API-KEY</code> and <code className="bg-slate-50 px-2 py-1 rounded font-bold text-blue-500">X-API-SECRET</code> in the headers. You can find these in your dashboard settings.
                </p>
                <div className="bg-[#02042b] rounded-2xl p-6 relative group overflow-hidden">
                    <pre className="text-blue-300 font-mono text-sm leading-relaxed">
{`curl -X POST https://api.nexuspay.com/v1/orders \\
  -H "X-API-KEY: your_api_key" \\
  -H "X-API-SECRET: your_api_secret" \\
  -H "Content-Type: application/json"`}
                    </pre>
                    <button onClick={() => copy('curl ...')} className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all opacity-0 group-hover:opacity-100">
                        <MdContentCopy />
                    </button>
                </div>
            </div>
        </section>

        {/* Create Order */}
        <section>
            <h3 className="text-xl font-black text-[#02042b] mb-4 flex items-center gap-2">
                <MdBolt className="text-orange-500" /> Create Payment Link
            </h3>
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-green-100">POST</span>
                    <code className="text-sm font-bold text-slate-400">/api/gateway/create-order</code>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Request Body</h4>
                        <div className="space-y-4 font-medium">
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <code className="text-blue-500 text-sm">amount</code>
                                <span className="text-xs text-slate-400 italic">Decimal, Required</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <code className="text-blue-500 text-sm">description</code>
                                <span className="text-xs text-slate-400 italic">String, Optional</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <code className="text-blue-500 text-sm">returnUrl</code>
                                <span className="text-xs text-slate-400 italic">URL, Optional</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Response</h4>
                        <div className="bg-slate-50 rounded-2xl p-4 font-mono text-[11px] text-slate-600">
{`{
  "success": true,
  "url": "https://nexuspay.com/pay?q=...",
  "orderId": "ord_123456"
}`}
                        </div>
                    </div>
                </div>
            </div>
        </section>


        {/* Check Status */}
        <section>
            <h3 className="text-xl font-black text-[#02042b] mb-4 flex items-center gap-2">
                <MdHistory className="text-green-500" /> Check Order Status
            </h3>
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100">GET</span>
                    <code className="text-sm font-bold text-slate-400">/api/gateway/order-status/{"{orderId}"}</code>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Parameters</h4>
                        <div className="space-y-4 font-medium">
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <code className="text-blue-500 text-sm">orderId</code>
                                <span className="text-xs text-slate-400 italic">Path, Required</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Sample Response</h4>
                        <div className="bg-slate-50 rounded-2xl p-4 font-mono text-[11px] text-slate-600">
{`{
  "orderId": "ord_123456",
  "status": "PAID",
  "amount": 500.00,
  "paidAt": "2026-04-26T02:40:00"
}`}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Webhooks */}

        <section>
            <h3 className="text-xl font-black text-[#02042b] mb-4 flex items-center gap-2">
                <MdWebhook className="text-purple-500" /> Webhooks
            </h3>
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                <p className="text-slate-500 font-medium mb-6 leading-relaxed italic opacity-70">
                    Webhook notifications are coming soon. You can currently poll the <code className="bg-slate-50 px-2 py-1 rounded font-bold text-[#02042b]">/verify-payment</code> endpoint for status updates.
                </p>
            </div>
        </section>
      </div>

      <footer className="mt-20 pt-10 border-t border-slate-100 text-center">
          <p className="text-slate-400 font-medium text-sm">Need help? Contact us at <span className="text-blue-500">support@nexuspay.com</span></p>
      </footer>
    </div>
  );
}
