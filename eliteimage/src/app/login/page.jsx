import Login from '@/components/Acounts/Login'
import Footer from '@/components/landingpage/Footer'
import Navbar from '@/components/landingpage/Navbar'
import React, { Suspense } from 'react'

const Page = () => {
  return (
     <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
        <Login />
        <Footer />
     </Suspense>
  )
}

export default Page