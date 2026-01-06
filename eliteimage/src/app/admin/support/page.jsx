import Suport from '@/components/adminComponents/Suport'
import AuthGuard from '@/components/AuthGuard'
import React from 'react'

const Page = () => {
  return (
    <AuthGuard>
      <Suport />
    </AuthGuard>
  )
}

export default Page