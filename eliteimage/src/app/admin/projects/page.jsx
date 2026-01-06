import Projects from '@/components/adminComponents/Projects'
import AuthGuard from '@/components/AuthGuard'
import React from 'react'

const Page = () => {
  return (
    <AuthGuard>
      <Projects />
    </AuthGuard>
  )
}

export default Page