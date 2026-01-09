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
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { logoutUser } = useContext(AppContext);

  const menu = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Upload Image", href: "/admin/uploadImage", icon: Upload },
    { name: "Projects", href: "/admin/projects", icon: Folder },
    { name: "Pricing", href: "/admin/pricing", icon: CreditCard },
    { name: "Support", href: "/admin/support", icon: HelpCircle },
    { name: "Profile", href: "/admin/profile", icon: User },
    { name: "history", href: "/admin/history", icon: History },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#D3E7F0] w-full rounded-md"
      >
        <Menu size={24} />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-[#D3E7F0] p-6
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[24px] font-semibold">Logo</h2>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[16px]
                ${
                  pathname === item.href
                    ? "bg-[#034F75] text-white"
                    : "hover:bg-[#034F75] hover:text-white"
                }`}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={() => {
            logoutUser();
            toast.success("Logged out successfully ✅");
            setOpen(false); // mobile sidebar close
          }}
          className="
             mt-40
             flex items-center justify-start gap-3
             w-full
             bg-[#D30000]
            
             text-white
             px-4
             py-2.5
             rounded-lg
             text-[16px]
             font-medium         
             transition-colors cursor-pointer
              "
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  );
}
