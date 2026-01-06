"use client";

import { useContext, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Landing from "@/landingpagemain/Landing";

const Page = () => {
  const { token, loading } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && token) {
      router.replace("/admin/dashboard");
    }
  }, [token, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex space-x-2">
          <div
            className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>

          <div
            className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>

          <div
            className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></div>
        </div>
      </div>
    );
  }

  if (token) {
    return null;
  }

  return <Landing />;
};

export default Page;
