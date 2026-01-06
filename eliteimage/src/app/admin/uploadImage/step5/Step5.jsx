import Step5 from '@/components/adminComponents/Imgsupload/Step5'
import AuthGuard from '@/components/AuthGuard'
import React from 'react'

const Step5 = () => {
  return (
    <AuthGuard>
        <Step5 />
    </AuthGuard>
  )
}

export default Step5