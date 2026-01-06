import AuthGuard from '@/components/AuthGuard'
import React from 'react'

const page = () => {
  return (
    <AuthGuard>page</AuthGuard>
  )
}

export default page