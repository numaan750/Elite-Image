import AuthGuard from '@/components/AuthGuard'
import React from 'react'

const Step1 = () => {
  return (
    <AuthGuard>Step1</AuthGuard>
  )
}

export default Step1