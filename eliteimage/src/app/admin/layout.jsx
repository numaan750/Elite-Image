"use client";

import Sidebar from "@/components/adminComponents/Sidebar";
import AuthGuard from "@/components/AuthGuard";
import { AppContext } from "@/context/AppContext";
import { useContext, useEffect } from "react";

export default function AdminLayout({ children }) {

  return (
    <AuthGuard>
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        {children}
      </div>
    </div>
    </AuthGuard>
  );
}
