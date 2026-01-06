"use client"
import React, { useEffect } from 'react'

export default function page() {
  
    if (!token) {
    redirect("/login");
  }

  // ✅ Agar token hai - Dashboard bhejo
  redirect("/admin/dashboard");
  return (
    <div></div>
  )
}
