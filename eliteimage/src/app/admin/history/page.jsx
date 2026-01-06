import History from '@/components/adminComponents/History'
import AuthGuard from '@/components/AuthGuard'
import React from 'react'

const page = () => {
  return (
    <AuthGuard>
        <History />
    </AuthGuard>
  )
}

export default page