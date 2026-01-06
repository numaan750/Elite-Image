import Pricing from '@/components/adminComponents/Pricing'
import AuthGuard from '@/components/AuthGuard'
import React from 'react'

const Page = () => {
  return (
    <AuthGuard>
      <Pricing />
    </AuthGuard>
  )
}

export default Page