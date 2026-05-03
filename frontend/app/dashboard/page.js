"use client";
import { useEffect, useState } from "react";
import { getHeaders } from "@/utils/api";
import ConfirmModal from "@/components/ConfirmModal";
import {
    MdTrendingUp,
    MdReceipt,
    MdVpnKey,
    MdCheckCircle,
    MdInfo,
    MdHistory,
    MdOutlineCreditCard,
    MdOutlineAccountBalanceWallet,
    MdOutlineSync,
    MdOutlineShield,
    MdLink,
    MdAccountBalance,
    MdVisibility,
    MdVisibilityOff
} from "react-icons/md";

export default function DashboardPage() {
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalToday: 0, countToday: 0 });
    const [merchant, setMerchant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSecret, setShowSecret] = useState(false);
    const [isRollModalOpen, setIsRollModalOpen] = useState(false);
    const [rolling, setRolling] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const [copied, setCopied] = useState(null);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const fetchData = async () => {
        try {
            const headers = getHeaders();
            const [statsRes, merchantRes] = await Promise.all([
                fetch("/api/merchant/stats", { headers }),
                fetch("/api/merchant/me", { headers })
            ]);
            const statsData = await statsRes.json();
            const merchantData = await merchantRes.json();
            setStats(statsData);
            setMerchant(merchantData);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const rollKeys = async () => {
        setIsRollModalOpen(false);
        setRolling(true);
        try {
            const res = await fetch("/api/merchant/roll-keys", {
                method: "POST",
                headers: getHeaders()
            });
            const data = await res.json();
            // Correctly merge the new keys into the existing merchant state
            setMerchant(prev => ({
                ...prev,
                apiKey: data.apiKey,
                apiSecret: data.apiSecret
            }));
            alert("API keys successfully rotated.");
        } catch (error) {
            alert("Failed to rotate keys.");
        } finally {
            setRolling(false);
        }
    };

    if (loading) return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30">
            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Syncing Data...</p>
        </div>
    );

    return (
        <div className="flex-1 min-h-screen bg-gray-50/30 p-6 md:p-10 transition-all duration-500">

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome back, <span className="font-semibold text-primary">{merchant?.businessName}</span></p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="premium-card p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-primary">
                            <MdOutlineAccountBalanceWallet className="text-xl" />
                        </div>
                        <span className="text-[10px] font-bold text-primary bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <MdTrendingUp /> +12%
                        </span>
                    </div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">₹{stats.totalRevenue.toLocaleString()}</h3>
                </div>

                <div className="premium-card p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                            <MdReceipt className="text-xl" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            Stable
                        </span>
                    </div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Total Orders</p>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{stats.totalOrders}</h3>
                </div>

                <div className="premium-card p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                            <MdOutlineCreditCard className="text-xl" />
                        </div>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            Today
                        </span>
                    </div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Today's Sales</p>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">₹{stats.totalToday.toLocaleString()}</h3>
                </div>

                <div className="premium-card p-6 border-dashed border-gray-200 bg-transparent flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2">
                        +
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Add Metric</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                {/* API ACCESS CARD */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white">
                                    <MdVpnKey className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">API Access Credentials</h3>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-tight">Production Keys</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsRollModalOpen(true)}
                                disabled={rolling}
                                className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest disabled:opacity-50"
                            >
                                <MdOutlineSync className={`text-lg ${rolling ? 'animate-spin' : ''}`} /> {rolling ? 'Rolling...' : 'Rotate Keys'}
                            </button>
                        </div>

                        <ConfirmModal
                            isOpen={isRollModalOpen}
                            onClose={() => setIsRollModalOpen(false)}
                            onConfirm={rollKeys}
                            title="Rotate API Keys"
                            confirmText="Rotate Keys"
                            danger={true}
                        >
                            Are you sure you want to rotate your API keys? <br/>
                            <span className="text-red-400 font-bold">The current keys will stop working immediately</span>, which may break your existing integrations.
                        </ConfirmModal>

                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Public API Key</label>
                                        <button 
                                            onClick={() => copyToClipboard(merchant?.apiKey, 'apiKey')}
                                            className="text-[10px] font-bold text-primary hover:text-blue-700 uppercase tracking-widest flex items-center gap-1"
                                        >
                                            {copied === 'apiKey' ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 rounded-lg font-mono text-xs text-gray-600 border border-gray-100 truncate shadow-sm">
                                        {merchant?.apiKey}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Secret API Key</label>
                                        <button 
                                            onClick={() => copyToClipboard(merchant?.apiSecret, 'apiSecret')}
                                            className="text-[10px] font-bold text-primary hover:text-blue-700 uppercase tracking-widest flex items-center gap-1"
                                        >
                                            {copied === 'apiSecret' ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type={showSecret ? "text" : "password"}
                                            readOnly
                                            value={merchant?.apiSecret}
                                            className="w-full bg-gray-50 px-4 py-3 rounded-lg font-mono text-[11px] text-gray-600 border border-gray-100 outline-none shadow-sm focus:border-blue-200 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSecret(!showSecret)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-primary transition-all bg-white/80 rounded-md shadow-sm border border-gray-100"
                                            title={showSecret ? "Hide Secret" : "Show Secret"}
                                        >
                                            {showSecret ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 p-5 bg-blue-50 rounded-xl flex items-start gap-4">
                            <MdOutlineShield className="text-2xl text-primary shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-blue-900 mb-1">Keys are secured</h4>
                                <p className="text-xs text-blue-700/70 font-medium leading-relaxed">
                                    These keys allow your server to make requests to NexusPay. Never share your API Secret with anyone.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* QUICK ACTIONS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Create Link", desc: "Share payment link", icon: MdLink, color: "bg-blue-500" },
                            { label: "Settle Funds", desc: "Withdraw to bank", icon: MdAccountBalance, color: "bg-blue-500" },
                            { label: "Get Help", desc: "24/7 Support Desk", icon: MdInfo, color: "bg-gray-800" }
                        ].map((action, i) => (
                            <div key={i} className="premium-card p-6 cursor-pointer hover:border-blue-500 transition-all group">
                                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white mb-4 shadow-lg shadow-gray-200`}>
                                    <action.icon className="text-xl" />
                                </div>
                                <h4 className="text-sm font-bold text-gray-900">{action.label}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{action.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RECENT SETTLEMENT CARD */}
                <div className="space-y-6">
                    <div className="premium-card p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
                            <MdHistory className="text-gray-400" /> Recent Activity
                        </h3>

                        <div className="space-y-8">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 leading-none mb-1">Settlement Processed</p>
                                        <p className="text-xs text-gray-400 font-medium">₹12,450 sent to Bank • 2h ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-10 py-3 bg-gray-50 border border-gray-100 text-gray-500 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-gray-100 transition-all">
                            View Audit Logs
                        </button>
                    </div>

                    {/* TRUST BADGE */}
                    <div className="premium-card p-8 bg-gray-900 text-white border-none shadow-2xl shadow-blue-900/10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                <MdCheckCircle className="text-blue-400 text-2xl" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">PCI-DSS Compliant</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Level 1 Protection</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            NexusPay ensures that all transactions are processed through high-end encryption layers and global security standards.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}