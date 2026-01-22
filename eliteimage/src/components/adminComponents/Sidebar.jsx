"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Upload,
  Folder,
  CreditCard,
  HelpCircle,
  User,
  LogOut,
  Menu,
  X,
  History,
} from "lucide-react";
import { LuFiles } from "react-icons/lu";

import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { logoutUser } = useContext(AppContext);

  const menu = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: Folder },
    { name: "Draft", href: "/admin/draft", icon: LuFiles },
    { name: "Pricing", href: "/admin/pricing", icon: CreditCard },
    { name: "Support", href: "/admin/support", icon: HelpCircle },
    { name: "Profile", href: "/admin/profile", icon: User },
  ];

  const handleLogout = () => {
    toast.custom(
      (t) => (
        // Full screen overlay
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]"
          onClick={() => toast.dismiss(t.id)} // Click outside closes toast
        >
          {/* Toast content box */}
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-[320px] text-center"
            onClick={(e) => e.stopPropagation()} // Prevent click bubbling
          >

            <h3 className="text-lg font-semibold mb-2">Logout Confirmation</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-center gap-4">
              {/* YES */}
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  setTimeout(() => logoutUser(), 300);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
              >
                Yes
              </button>

              {/* NO */}
              <button
                onClick={() => toast.dismiss(t.id)}
                className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center", // position is ignored, overlay handles centering
        style: { background: "transparent", boxShadow: "none" },
      },
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed z-50 p-3 bg-[#D3E7F0] w-full flex items-center gap-5"
      >
        <Menu size={24} />
        <span className="text-black font-semibold text-[18px]">EliteImage</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64
          bg-[#D3E7F0] p-6
          flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[24px] font-semibold">Eliteimage</h2>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {menu.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/admin/dashboard" &&
                pathname.startsWith("/admin/uploadImage"));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[16px]
                  ${
                    isActive
                      ? "bg-[#034F75] text-white"
                      : "hover:bg-[#034F75] hover:text-white"
                  }`}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="
            mt-auto
            flex items-center gap-3
            w-full
            bg-[#D30000]
            hover:bg-[#B00000]
            text-white
            px-4
            py-2.5
            rounded-lg
            text-[16px]
            font-medium
            transition-colors
            cursor-pointer
          "
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  );
}
