"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout");
    router.push("/login");
  };

  return (
    <button
      onClick={logout}
      className="hover:cursor-pointer w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"

    >
      Logout
    </button>
  );
}
