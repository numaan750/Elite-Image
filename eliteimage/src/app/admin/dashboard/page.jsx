import Dashboard from '@/components/adminComponents/Dashboard'
import AuthGuard from '@/components/AuthGuard'
import React from 'react'

const Page = () => {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  )
}

export default Page