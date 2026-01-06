import Step2 from '@/components/adminComponents/Imgsupload/Step2'
import AuthGuard from '@/components/AuthGuard'
import React from 'react'

const Step2 = () => {
  return (
    <AuthGuard>
        <Step2 />
    </AuthGuard>
  )
}

export default Step2