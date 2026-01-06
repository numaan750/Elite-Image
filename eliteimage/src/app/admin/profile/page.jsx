import Profile from '@/components/adminComponents/Profile'
import AuthGuard from '@/components/AuthGuard'
import React from 'react'

const Page = () => {
  return (
    <AuthGuard>
      <Profile />
    </AuthGuard>
  )
}

export default Page