import Step3 from '@/components/adminComponents/Imgsupload/Step3'
import AuthGuard from '@/components/AuthGuard'
import React from 'react'

const Step3 = () => {
  return (
    <AuthGuard>
        <Step3 />
    </AuthGuard>
  )
}

export default Step3