import Step4 from "@/components/adminComponents/Imgsupload/Step4";
import AuthGuard from "@/components/AuthGuard";
import React from "react";

const Step4 = () => {
  return (
    <AuthGuard>
      <Step4 />
    </AuthGuard>
  );
};

export default Step4;
