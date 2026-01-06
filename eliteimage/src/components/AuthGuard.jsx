"use client";

import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { redirect } from "next/navigation";

const AuthGuard = ({ children }) => {
  const { token, loading } = useContext(AppContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="h-12 w-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!token) {
    redirect("/");
  }

  return children;
};

export default AuthGuard;