import Login from '@/components/Acounts/Login'
import React, { Suspense } from 'react'

const Page = () => {
  return (
     <Suspense fallback={<div>Loading...</div>}>
        <Login />
     </Suspense>
  )
}

export default Page