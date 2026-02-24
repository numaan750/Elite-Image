"use client"
import React, { useEffect } from 'react'

export default function page() {
  
    if (!token) {
    redirect("/login");
  }
  redirect("/admin/dashboard");
  return (
    <div></div>
  )
}
