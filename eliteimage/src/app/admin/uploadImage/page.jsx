"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import AllFeatures from "@/components/adminComponents/Imgsupload/AllFeatures";

import Step1 from "@/components/adminComponents/Imgsupload/Step1";
import Step2 from "@/components/adminComponents/Imgsupload/Step2";
import Step3 from "@/components/adminComponents/Imgsupload/Step3";
import Step4 from "@/components/adminComponents/Imgsupload/Step4";
import Step5 from "@/components/adminComponents/Imgsupload/Step5";
import Step2ObjectRemoval from "@/components/adminComponents/Imgsupload/Step2ObjectRemoval";
import Step3Farniturestyle from "@/components/adminComponents/Imgsupload/Step3Farniturestyle";
import Step2DuskSky from "@/components/adminComponents/Imgsupload/Step2DuskSky";
import toast from "react-hot-toast";

const FEATURE_STEPS_CONFIG = {
  Enhance: {
    totalSteps: 3,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step2, name: "Feature Options" },
      { id: 3, component: Step3, name: "Edit Styles" },
      { id: 4, component: Step4, name: "Processing" },
      { id: 5, component: Step5, name: "Final Edit" },
    ],
  },

  // HDR: {
  //   totalSteps: 3,
  //   steps: [
  //     { id: 1, component: Step1, name: "Upload Images" },
  //     { id: 2, component: Step2, name: "Feature Options" },
  //     { id: 3, component: Step3, name: "Edit Styles" },
  //     { id: 4, component: Step4, name: "Processing" },
  //     { id: 5, component: Step5, name: "Final Edit" },
  //   ],
  // },


  HDR: {
  totalSteps: 0,
  steps: [
    { id: 1, component: Step1, name: "Upload Images" },
    { id: 2, component: Step4, name: "Processing" },
    { id: 3, component: Step5, name: "Final Edit" },
  ],
},


  "Grass Replacement": {
    totalSteps: 3,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step2, name: "Enhancement Level" },
      { id: 3, component: Step3, name: "Grass Style" },
      { id: 4, component: Step4, name: "Processing" },
      { id: 5, component: Step5, name: "Final Edit" },
    ],
  },

  "Object Removal": {
    totalSteps: 2,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step2ObjectRemoval, name: "Select Object" },
      { id: 3, component: Step4, name: "Processing" },
      { id: 4, component: Step5, name: "Final Edit" },
    ],
  },

  "Sky Replacement": {
    totalSteps: 3,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step2, name: "Sky Options" },
      { id: 3, component: Step3, name: "Edit Styles" },
      { id: 3, component: Step4, name: "Processing" },
      { id: 4, component: Step5, name: "Final Edit" },
    ],
  },

  "Virtual Staging": {
    totalSteps: 4,
    steps: [
      { id: 1, component: Step1, name: "Upload Images", progressStep: 1 },
      { id: 2, component: Step2, name: "Room Type", progressStep: 2 },
      {
        id: 3,
        component: Step3Farniturestyle,
        name: "Furniture Type",
        progressStep: 3,
      },
      { id: 4, component: Step3, name: "Edit Styles", progressStep: 4 },
      { id: 5, component: Step4, name: "Processing", progressStep: null },
      { id: 6, component: Step5, name: "Final Edit", progressStep: null },
    ],
  },

  "Day to Dusk": {
    totalSteps: 4,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step2, name: "Dusk Options" },
      { id: 3, component: Step2DuskSky, name: "Sky Selection" },
      { id: 3, component: Step3, name: "Edit Styles" },
      { id: 4, component: Step4, name: "Processing" },
      { id: 5, component: Step5, name: "Final Edit" },
    ],
  },

  Straighten: {
    totalSteps: 0,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step4, name: "Processing" },
      { id: 3, component: Step5, name: "Final Edit" },
    ],
  },

  "Watermark Remove": {
    totalSteps: 0,
    steps: [
      { id: 1, component: Step1, name: "Upload Images" },
      { id: 2, component: Step4, name: "Processing" },
      { id: 3, component: Step5, name: "Final Edit" },
    ],
  },
};

const UploadImageTabs = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const featureType = searchParams.get("type");

  const [activeStep, setActiveStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [showAllFeatures, setShowAllFeatures] = useState(!featureType);

  const currentConfig =
    FEATURE_STEPS_CONFIG[featureType] || FEATURE_STEPS_CONFIG.Enhance;
  const totalSteps = currentConfig.totalSteps;
  const stepsConfig = currentConfig.steps;

  const [formData, setFormData] = useState({
    userId: null,
    featureType: featureType || null,
    uploadedImages: [],
    localFiles: [],
    selectedFeature: "",
    selectedFeatures: [],
    selectedFurniture: "",
    selectedStyle: "",
    beforeAfterData: {},
    finalNotes: "",
    totalSteps: currentConfig.totalSteps,
    projectId: null,
  });
  useEffect(() => {
    const mode = searchParams.get("mode");
    const draftId = searchParams.get("draftId");

    if (mode === "draft" && draftId) {
      const currentDraft = localStorage.getItem("currentDraft");

      if (currentDraft) {
        try {
          const draft = JSON.parse(currentDraft);
          if (draft.id === draftId || draft.draftId === draftId) {
            setFormData({
              ...draft,
              draftId: draftId,
            });
            const stepMap = {
              step1: 1,
              step2: 2,
              step3: 3,
              step4: 4,
              step5: 5,
            };
            setActiveStep(stepMap[draft.currentStep] || 1);

            console.log("✅ Draft loaded:", draftId);
          } else {
            console.warn("⚠️ Draft ID mismatch");
            localStorage.removeItem("currentDraft");
          }
        } catch (error) {
          console.error("Error loading draft:", error);
          toast.error("Failed to load draft");
          localStorage.removeItem("currentDraft");
        }
      }
    }
  }, [searchParams]);

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
    if (featureType) {
      setFormData((prev) => ({
        ...prev,
        featureType: featureType,
        totalSteps: currentConfig.totalSteps,
      }));
      setShowAllFeatures(false);
      setActiveStep(1);
    } else {
      setShowAllFeatures(true);
    }
  }, [featureType, currentConfig.totalSteps]);

  const maxSteps = stepsConfig.length;
  const goNext = () => setActiveStep((prev) => Math.min(prev + 1, maxSteps));
  const goBack = () => setActiveStep((prev) => Math.max(prev - 1, 1));

  const currentStepConfig = stepsConfig[activeStep - 1];
  const CurrentStepComponent = currentStepConfig?.component;
  const currentProgressStep = currentStepConfig?.progressStep ?? activeStep;
  if (showAllFeatures) {
    return (
      <AuthGuard>
        <div className="max-w-6xl mx-auto p-6">
          <AllFeatures />
        </div>
      </AuthGuard>
    );
  }

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
              currentProgressStep={currentProgressStep}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Step component not found</p>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default UploadImageTabs;
