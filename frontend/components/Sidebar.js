"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/Logout";
import {
  MdDashboard,
  MdPayment,
  MdAttachMoney,
  MdLink,
  MdShoppingCart,
  MdAssessment,
  MdSettings,
  MdHelp,
  MdClose
} from "react-icons/md";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: MdDashboard },
  { name: "Payments", href: "/dashboard/payments", icon: MdPayment },
  { name: "Settlements", href: "/dashboard/settlements", icon: MdAttachMoney },
  { name: "Payment Links", href: "/dashboard/payment-links", icon: MdLink },
  { name: "Orders", href: "/dashboard/orders", icon: MdShoppingCart },
  { name: "Reports", href: "/dashboard/reports", icon: MdAssessment },
];

export default function Sidebar({ isOpen, setIsOpen, data }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="flex flex-col h-full">

          <div className="h-16 flex items-center px-6 border-b border-slate-100 justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" className="w-8 h-8" />
              <span className="font-black text-[#02042b] tracking-tight">NexusPay</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400">
              <MdClose className="text-xl" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-6">
            <p className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                      ? "bg-blue-50 text-[#3395FF]"
                      : "text-slate-500 hover:text-[#02042b] hover:bg-slate-50"
                    }`}
                >
                  <Icon className={`text-xl ${isActive ? "text-[#3395FF]" : "text-slate-400"}`} />
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-8 mt-8 border-t border-slate-50">
              <p className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Support</p>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-[#02042b] hover:bg-slate-50 transition-all">
                <MdSettings className="text-xl text-slate-400" /> Settings
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-[#02042b] hover:bg-slate-50 transition-all">
                <MdHelp className="text-xl text-slate-400" /> API Docs
              </Link>
            </div>
          </nav>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="font-black w-10 h-10 rounded-full bg-[#3395FF] flex items-center justify-center text-sm text-white shadow-lg shadow-blue-500/20">
                {data?.business_name ? data.business_name[0].toUpperCase() : "N"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-[#02042b] truncate">{data?.business_name || "Nexus Merchant"}</p>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <p className="text-[10px] font-bold text-green-600 uppercase">Live Mode</p>
                </div>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}