"use client";
import { MdCode, MdContentCopy, MdBolt, MdSecurity, MdHistory, MdLink, MdCheckCircle } from "react-icons/md";
import { useState } from "react";

export default function DocsPage() {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const authCurl = `curl -X POST https://nexus.adityathakur.tech \\
  -H "X-API-KEY: your_api_key" \\
  -H "X-API-SECRET: your_api_secret" \\
  -H "Content-Type: application/json"`;

  const createOrderCurl = `curl -X POST https://nexus.adityathakur.tech/api/gateway/create-order \\
  -H "X-API-KEY: your_api_key" \\
  -H "X-API-SECRET: your_api_secret" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 500.00,
    "description": "Test Payment",
    "returnUrl": "https://your-site.com/success"
  }'`;

  return (
    <div className="flex-1 min-h-screen bg-white p-6 md:p-10 transition-all duration-300">
      
      <div className="mb-12 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold mb-4 border border-blue-100 uppercase tracking-wider">
          <MdCode className="text-sm" />
          API Reference v1.0
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Integrate NexusPay
        </h1>
        <p className="text-lg text-gray-500 mt-4 leading-relaxed max-w-2xl">
          Build powerful payment experiences with our robust REST API. Connect your application to the Nexus gateway in minutes.
        </p>
      </div>

      <div className="max-w-5xl space-y-20 pb-32">
        
        {/* AUTH */}
        <section id="authentication">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <MdSecurity className="text-xl" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Authentication</h3>
                    <p className="text-sm text-gray-500">Secure your requests with API keys</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <p className="text-sm text-gray-600 leading-relaxed">
                        All API requests must include your <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700 font-bold">X-API-KEY</code> and <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700 font-bold">X-API-SECRET</code> in the headers. 
                    </p>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-4 shadow-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Header Name</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Value Type</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <code className="text-primary font-bold bg-blue-50/50 px-1 rounded">X-API-KEY</code>
                            <span className="text-gray-500 font-medium italic">String</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                            <code className="text-primary font-bold bg-blue-50/50 px-1 rounded">X-API-SECRET</code>
                            <span className="text-gray-500 font-medium italic">String</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 italic flex items-center gap-2">
                        <MdCheckCircle className="text-blue-500" />
                        Manage your keys in the dashboard settings.
                    </p>
                </div>

                <div className="lg:col-span-3">
                    <div className="bg-[#0f172a] rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-black/5">
                        <div className="flex justify-between items-center px-5 py-3 bg-white/5 border-b border-white/10">
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Headers Example</span>
                            <button 
                                onClick={() => copyToClipboard(authCurl, 'auth')} 
                                className="text-gray-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium"
                            >
                                {copied === 'auth' ? 'Copied!' : <><MdContentCopy /> Copy</>}
                            </button>
                        </div>
                        <div className="p-6 overflow-x-auto">
                            <pre className="text-blue-300/90 font-mono text-xs leading-[1.8]">
{authCurl}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* CREATE ORDER */}
        <section id="create-payment">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <MdLink className="text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Create Payment Link</h3>
                        <p className="text-sm text-gray-500">Generate a new payment session</p>
                    </div>
                </div>
                <button 
                    onClick={() => copyToClipboard(createOrderCurl, 'create')} 
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded-lg border border-gray-200 transition-all"
                >
                    {copied === 'create' ? 'Copied Example!' : <><MdContentCopy /> Copy CURL</>}
                </button>
            </div>
            
            <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-100">
                    <span className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-black rounded uppercase tracking-tighter shadow-sm">POST</span>
                    <code className="text-sm font-mono font-bold text-gray-600">/api/gateway/create-order</code>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 border-r border-gray-100 bg-white">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Request Body</h4>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <code className="text-blue-600 font-bold text-sm bg-blue-50 px-1 rounded">amount</code>
                                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">Required</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">The transaction amount as a decimal value.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-mono text-gray-400 font-medium">Decimal</span>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-gray-100/50">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <code className="text-blue-600 font-bold text-sm bg-blue-50 px-1 rounded">description</code>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Optional</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">Brief purpose or note for the payment.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-mono text-gray-400 font-medium">String</span>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-gray-100/50">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <code className="text-blue-600 font-bold text-sm bg-blue-50 px-1 rounded">returnUrl</code>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Optional</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">URL to redirect user after payment is processed.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-mono text-gray-400 font-medium">URL</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-gray-50">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Success Response</h4>
                        <div className="bg-[#1e293b] rounded-xl p-6 shadow-xl border border-white/5">
                            <pre className="text-blue-300 font-mono text-xs leading-relaxed">
{`{
  "success": true,
  "url": "https://nexuspay.com/pay?q=...",
  "orderId": "ord_123456"
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* CHECK STATUS */}
        <section id="order-status">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                    <MdHistory className="text-xl" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Check Order Status</h3>
                    <p className="text-sm text-gray-500">Verify payment completion</p>
                </div>
            </div>
            
            <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-100">
                    <span className="px-2.5 py-1 bg-orange-500 text-white text-[10px] font-black rounded uppercase tracking-tighter shadow-sm">GET</span>
                    <code className="text-sm font-mono font-bold text-gray-600">/api/gateway/order-status/<span className="text-orange-500">{"{orderId}"}</span></code>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 border-r border-gray-100 bg-white">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Path Parameters</h4>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <code className="text-orange-500 font-bold text-sm bg-orange-50 px-1 rounded">orderId</code>
                                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">Required</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">The unique identifier for the order to check.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-mono text-gray-400 font-medium">Path</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-gray-50">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Sample Response</h4>
                        <div className="bg-[#1e293b] rounded-xl p-6 shadow-xl border border-white/5">
                            <pre className="text-orange-300 font-mono text-xs leading-relaxed">
{`{
  "orderId": "ord_123456",
  "status": "PAID",
  "amount": 500.00,
  "paidAt": "2026-04-26T02:40:00"
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
}

