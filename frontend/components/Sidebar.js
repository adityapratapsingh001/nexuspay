"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdPayments,
  MdReceipt,
  MdLink,
  MdAccountBalance,
  MdAssessment,
  MdSettings,
  MdLogout,
  MdMenu,
  MdClose,
  MdTerminal,
  MdKeyboardArrowRight,
  MdOutlineShield,
  MdOutlineIntegrationInstructions,
  MdHistory
} from "react-icons/md";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: MdDashboard, category: "MARKETING" },
  { name: "Payments", href: "/dashboard/payments", icon: MdPayments, category: "PAYMENTS" },
  { name: "Orders", href: "/dashboard/orders", icon: MdReceipt, category: "PAYMENTS" },
  { name: "Payment Links", href: "/dashboard/payment-links", icon: MdLink, category: "PAYMENTS" },
  { name: "Settlements", href: "/dashboard/settlements", icon: MdAccountBalance, category: "PAYMENTS" },
  { name: "Reports", href: "/dashboard/reports", icon: MdAssessment, category: "MARKETING" },
  { name: "API Docs", href: "/dashboard/docs", icon: MdOutlineIntegrationInstructions, category: "SYSTEM" },
  { name: "Settings", href: "/dashboard/settings", icon: MdSettings, category: "SYSTEM" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
    setUserEmail(localStorage.getItem("userEmail") || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAdmin");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <MdMenu className="text-xl text-gray-600" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-gray-100 transition-transform duration-300 md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">

          {/* Logo Section */}
          <div className="h-16 flex items-center px-6 border-b border-gray-50 justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <img src="/logo.png" className="w-8 h-8 rounded-lg border-1 border-[#02042B]" alt="NexusPay" />
              </div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">NexusPay</span>
            </Link>
            <button onClick={() => setIsOpen(false)} className="md:hidden p-1 text-gray-400 hover:text-gray-600">
              <MdClose className="text-xl" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto custom-scrollbar">

            {/* Group by category logic or just list */}
            <div>
              <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Menu</p>
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                                    ${isActive ? "bg-blue-50 text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                                `}
                    >
                      <item.icon className={`text-xl ${isActive ? "text-primary" : "text-gray-400"}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {isAdmin && (
              <div>
                <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Administration</p>
                <Link
                  href="/dashboard/admin/logs"
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${pathname === "/dashboard/admin/logs" ? "bg-blue-50 text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                  `}
                >
                  <MdTerminal className="text-xl" />
                  System Audit
                </Link>
              </div>
            )}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-50">
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-primary text-sm font-bold">
                {userEmail?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {userEmail || "Merchant"}
                </p>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">Verified Account</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <MdLogout className="text-xl" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}