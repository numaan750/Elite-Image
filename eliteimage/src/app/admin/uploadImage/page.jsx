"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

import Step1 from "@/components/adminComponents/Imgsupload/Step1";
import Step2 from "@/components/adminComponents/Imgsupload/Step2";
import Step3 from "@/components/adminComponents/Imgsupload/Step3";
import Step4 from "@/components/adminComponents/Imgsupload/Step4";
import Step5 from "@/components/adminComponents/Imgsupload/Step5";
import Step2ObjectRemoval from "@/components/adminComponents/Imgsupload/Step2ObjectRemoval";
import Step3Farniturestyle from "@/components/adminComponents/Imgsupload/Step3Farniturestyle";

const FEATURE_STEPS_CONFIG = {
  // Feature 1: Enhance - 5 steps
  Enhance: {
    totalSteps: 5,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step2, name: "Feature Options" },
      { id: 3, component: Step3, name: "Edit Styles" },
      { id: 4, component: Step4, name: "Processing" },
      { id: 5, component: Step5, name: "Final Edit" },
    ],
  },

  // Feature 2: HDR - 5 steps
  HDR: {
    totalSteps: 5,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step2, name: "Feature Options" },
      { id: 3, component: Step3, name: "Edit Styles" },
      { id: 4, component: Step4, name: "Processing" },
      { id: 5, component: Step5, name: "Final Edit" },
    ],
  },

  // Feature 3: Grass Replacement - 5 steps
  "Grass Replacement": {
    totalSteps: 5,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step2, name: "Enhancement Level" },
      { id: 3, component: Step3, name: "Grass Style" },
      { id: 4, component: Step4, name: "Processing" },
      { id: 5, component: Step5, name: "Final Edit" },
    ],
  },

  // Feature 4: Object Removal - 4 steps
  "Object Removal": {
    totalSteps: 4,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step2ObjectRemoval, name: "Select Object" }, // ✅ CHANGED
      { id: 3, component: Step4, name: "Processing" },
      { id: 4, component: Step5, name: "Final Edit" },
    ],
  },

  // Feature 5: Sky Replacement - 4 steps
  "Sky Replacement": {
    totalSteps: 4,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step2, name: "Sky Options" },
      { id: 3, component: Step4, name: "Processing" },
      { id: 4, component: Step5, name: "Final Edit" },
    ],
  },

  // Feature 6: Virtual Staging - 5 steps
  "Virtual Staging": {
    totalSteps: 6,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step2, name: "Room Type" },
      { id: 3, component: Step3Farniturestyle, name: "Furniture Type" }, // ✅ Naya component
      { id: 4, component: Step3, name: "Edit Styles" },
      { id: 5, component: Step4, name: "Processing" },
      { id: 6, component: Step5, name: "Final Edit" },
    ],
  },

  // Feature 7: Day to Dusk - 5 steps
  "Day to Dusk": {
    totalSteps: 5,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step2, name: "Dusk Options" },
      { id: 3, component: Step3, name: "Edit Styles" },
      { id: 4, component: Step4, name: "Processing" },
      { id: 5, component: Step5, name: "Final Edit" },
    ],
  },

  // Feature 8: Straighten - 3 steps
  Straighten: {
    totalSteps: 3,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step4, name: "Processing" },
      { id: 3, component: Step5, name: "Final Edit" },
    ],
  },

  // Feature 9: Watermark Remove - 3 steps
  "Watermark Remove": {
    totalSteps: 3,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step4, name: "Processing" },
      { id: 3, component: Step5, name: "Final Edit" },
    ],
  },
};

const UploadImageTabs = () => {
  const searchParams = useSearchParams();
  const [activeStep, setActiveStep] = useState(1);
  const [userId, setUserId] = useState(null);

  const featureType = searchParams.get("type") || "Enhance";

  const currentConfig =
    FEATURE_STEPS_CONFIG[featureType] || FEATURE_STEPS_CONFIG.Enhance;
  const totalSteps = currentConfig.totalSteps;
  const stepsConfig = currentConfig.steps;

  const [formData, setFormData] = useState({
    userId: null,
    featureType: featureType,
    uploadedImages: [],
    selectedFeature: "",
    selectedFurniture: "",
    selectedStyle: "",
    beforeAfterData: {},
    finalNotes: "",
    totalSteps: currentConfig.totalSteps, // ✅ YE LINE ADD KARI
    projectId: null, // ✅ YE LINE ADD KAREIN
  });

  // useEffect(() => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     featureType: featureType,
  //   }));
  //   // Reset to step 1 when feature type changes
  //   setActiveStep(1);
  // }, [featureType]);

  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userId", id);
    }
    setUserId(id);
  }, []);

  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({
        ...prev,
        userId: userId,
      }));
    }
  }, [userId]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      featureType: featureType,
      totalSteps: currentConfig.totalSteps, // ✅ YE LINE ADD KARI
    }));
    setActiveStep(1);
  }, [featureType, currentConfig.totalSteps]);

  const goNext = () => setActiveStep((prev) => Math.min(prev + 1, totalSteps));
  const goBack = () => setActiveStep((prev) => Math.max(prev - 1, 1));

  const currentStepConfig = stepsConfig[activeStep - 1];
  const CurrentStepComponent = currentStepConfig?.component;

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto p-6">
        <div>
          {CurrentStepComponent ? (
            <CurrentStepComponent
              formData={formData}
              setFormData={setFormData}
              next={goNext}
              back={goBack}
              featureType={featureType}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Step component not found</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <div>
            {activeStep > 1 && (
              <span>← Previous: {stepsConfig[activeStep - 2]?.name}</span>
            )}
          </div>
          <div>
            {activeStep < totalSteps && (
              <span>Next: {stepsConfig[activeStep]?.name} →</span>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default UploadImageTabs;
