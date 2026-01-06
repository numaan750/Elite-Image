import Payment from '@/components/adminComponents/Payment'
import AuthGuard from '@/components/AuthGuard'
import StripeWrapper from '@/components/StripeWrapper'
import React from 'react'

const page = () => {
  return (
    <AuthGuard>
        <StripeWrapper>
        <Payment />
        </StripeWrapper>
    </AuthGuard>
  )
}

export default page