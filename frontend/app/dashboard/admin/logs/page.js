"use client";
import { useEffect, useState, useRef } from "react";
import { MdTerminal, MdRefresh, MdDeleteSweep, MdSecurity, MdHistory, MdGavel, MdOutlineMonitorHeart } from "react-icons/md";
import { getHeaders } from "@/utils/api";

export default function AdminLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const fetchLogs = async () => {
        try {
            const res = await fetch("/api/merchant/admin/logs", {
                headers: getHeaders()
            });
            if (res.status === 403) {
                setError("Administrative access required to view system events.");
                return;
            }
            if (!res.ok) throw new Error("Connection failed");
            const data = await res.json();
            setLogs(data);
            setError(null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="flex-1 h-screen flex flex-col items-center justify-center bg-gray-50/30 p-8">
                <div className="premium-card p-10 max-w-md text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-6">
                        <MdSecurity className="text-3xl" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">{error}</p>
                    <button onClick={() => window.history.back()} className="btn-secondary py-2 px-6">
                        Return
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 h-screen flex flex-col bg-gray-50/30 p-6 md:p-10 transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-white text-lg">
                            <MdOutlineMonitorHeart />
                        </div>
                        System Audit
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">Real-time backend monitor for platform events.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span> Streaming
                    </div>
                    <button 
                        onClick={fetchLogs}
                        className="btn-secondary p-3 !rounded-lg"
                    >
                        <MdRefresh className="text-xl" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col premium-card overflow-hidden bg-gray-900 border-none shadow-2xl shadow-gray-200">
                <div className="bg-gray-800/50 px-6 py-3 border-b border-white/5 flex items-center justify-between">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 bg-red-500/30 rounded-full"></div>
                        <div className="w-2.5 h-2.5 bg-orange-500/30 rounded-full"></div>
                        <div className="w-2.5 h-2.5 bg-blue-500/30 rounded-full"></div>
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Nexus Terminal</span>
                    <MdTerminal className="text-gray-500" />
                </div>

                <div 
                    ref={scrollRef}
                    className="flex-1 p-6 font-mono text-[11px] overflow-y-auto custom-scrollbar"
                >
                    {loading && logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3">
                            <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                            <p className="text-gray-600 font-bold uppercase tracking-widest text-[9px]">Initializing...</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {logs.map((log, i) => {
                                let color = "text-gray-400";
                                if (log.includes("ERROR")) color = "text-red-400";
                                else if (log.includes("WARN")) color = "text-orange-300";
                                else if (log.includes("INFO")) color = "text-blue-400/70";
                                else if (log.includes("Status: 2")) color = "text-blue-400 font-bold";
                                else if (log.includes("Status: 4") || log.includes("Status: 5")) color = "text-red-500 font-bold";
                                
                                return (
                                    <div key={i} className={`${color} leading-relaxed flex items-start gap-4 hover:bg-white/5 px-2 py-0.5 rounded transition-colors`}>
                                        <span className="opacity-20 w-6 shrink-0 text-right select-none">{i + 1}</span>
                                        <span className="break-all">{log}</span>
                                    </div>
                                );
                            })}
                            <div className="pt-4 flex items-center gap-2">
                                <span className="w-1.5 h-3.5 bg-blue-500/30 animate-pulse"></span>
                                <span className="text-gray-700 font-bold uppercase text-[9px] tracking-widest">Awaiting events...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
