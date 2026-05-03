"use client";
import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDark(isDark);
    if (isDark) document.documentElement.classList.add("dark");
  }, []);

  const toggle = () => {
    const newDark = !dark;
    setDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggle}
      className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-primary transition-all shadow-sm border border-slate-100 dark:border-white/5"
      aria-label="Toggle Theme"
    >
      {dark ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
    </button>
  );
}
