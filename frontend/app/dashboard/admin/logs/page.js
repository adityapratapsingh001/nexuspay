"use client";
import { useEffect, useState, useRef } from "react";
import { MdTerminal, MdRefresh, MdDeleteSweep } from "react-icons/md";
import { getHeaders } from "@/utils/api";

export default function AdminLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000); // Auto-refresh every 5s
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
                setError("Access Denied: You do not have admin privileges.");
                return;
            }
            if (!res.ok) throw new Error("Failed to fetch logs");
            const data = await res.json();
            setLogs(data);
            setError(null);
        } catch (err) {
            console.error(err);
            // setError("Connection error. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="p-12 flex flex-col items-center justify-center h-[70vh]">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
                    <MdTerminal className="text-4xl" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Restricted Area</h2>
                <p className="text-slate-500 font-medium text-center max-w-md">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-8 md:p-12 h-screen flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-black text-[#02042b] tracking-tight flex items-center gap-4">
                        <MdTerminal className="text-blue-500" /> System Logs
                    </h1>
                    <p className="text-slate-500 font-medium text-lg mt-1">Real-time backend monitor.</p>
                </div>
                <button 
                    onClick={fetchLogs}
                    className="p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all text-[#02042b]"
                >
                    <MdRefresh className="text-2xl" />
                </button>
            </div>

            <div 
                ref={scrollRef}
                className="flex-1 bg-[#0d1117] rounded-[2rem] border border-slate-800 p-8 font-mono text-sm overflow-y-auto shadow-2xl shadow-blue-500/5"
            >
                {loading && logs.length === 0 ? (
                    <div className="flex items-center gap-3 text-slate-500 animate-pulse">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Initializing terminal session...
                    </div>
                ) : (
                    <div className="space-y-1">
                        {logs.map((log, i) => {
                            let color = "text-slate-300";
                            
                            // Log Level Colors
                            if (log.includes("ERROR")) color = "text-red-400";
                            else if (log.includes("WARN")) color = "text-orange-300";
                            else if (log.includes("INFO")) color = "text-blue-300";
                            else if (log.includes("DEBUG")) color = "text-purple-400";
                            
                            // HTTP Status Colors (Override)
                            if (log.includes("Status: 2")) color = "text-green-400";
                            else if (log.includes("Status: 4") || log.includes("Status: 5")) color = "text-red-500 font-bold";
                            
                            return (
                                <div key={i} className={`${color} leading-relaxed`}>
                                    <span className="opacity-30 mr-3 text-[10px] select-none">{i + 1}</span>
                                    {log}
                                </div>
                            );
                        })}
                        <div className="pt-4 text-blue-500/50 animate-pulse flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-blue-500/50"></span>
                            Waiting for new events...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
