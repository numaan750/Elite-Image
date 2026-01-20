"use client";
import { useState, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FEATURES_DATA } from "./featuresData";
import Image from "next/image";
import ProgressBar from "./ProgressBar";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";

const Step2 = ({ formData, setFormData, next, back, featureType }) => {
  const router = useRouter();

  const featureData = FEATURES_DATA[featureType];
  const { saveDraft } = useContext(AppContext);

  const [selected, setSelected] = useState(formData.selectedFeatures || []);

  useEffect(() => {
    if (!formData.featureType) {
      toast.error("Please select a feature first");
      router.push("/admin/dashboard");
    }
  }, [formData.featureType, router]);

  // Auto-save on selection change
  useEffect(() => {
    if (selected.length > 0) {
      const timeoutId = setTimeout(() => {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const existingDraftId = urlParams.get("draftId") || formData.draftId;

          saveDraft(
            {
              ...formData,
              selectedFeatures: selected,
              draftId: existingDraftId,
            },
            "step2",
          );
        } catch (error) {
          console.error("Error saving draft:", error);
        }
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [selected]); // ✅ Remove saveDraft and formData from dependencies

  // const handleContinue = async () => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     selectedFeatures: selected,
  //   }));
  //   // if (featureType === "Sky Replacement") {
  //   //   try {
  //   //     const token = localStorage.getItem("token");

  //   //     if (!token) {
  //   //       toast.error("Please login first");
  //   //       return;
  //   //     }

  //   //     toast.loading("Saving your selection...", { id: "save-sky" });

  //   //     const backendPayload = {
  //   //       userid: formData.userId,
  //   //       title: `Sky Replacement - ${new Date().toLocaleDateString()}`,
  //   //       description: `Selected Sky: ${selected[0]}`,
  //   //       featureType: "Sky Replacement",
  //   //       uploadedImages: formData.uploadedImages,
  //   //       selectedFeature: selected,
  //   //       selectedStyle: [],
  //   //       selectedFurniture: [],
  //   //       beforeAfterData: [],
  //   //       finalNotes: "",
  //   //     };
  //   //     const API_URL =
  //   //       process.env.NEXT_PUBLIC_API_URL || "https://elite-image.vercel.app";

  //   //     const response = await fetch(`${API_URL}/api/aiImagesmodels`, {
  //   //       method: "POST",
  //   //       headers: {
  //   //         "Content-Type": "application/json",
  //   //         Authorization: `Bearer ${token}`,
  //   //       },
  //   //       body: JSON.stringify(backendPayload),
  //   //     });

  //   //     if (!response.ok) {
  //   //       const errorData = await response.json();
  //   //       throw new Error(errorData.message || "Failed to save");
  //   //     }

  //   //     const data = await response.json();

  //   //     toast.success("Selection saved!", { id: "save-sky" });
  //   //     setFormData((prev) => ({
  //   //       ...prev,
  //   //       projectId: data._id,
  //   //     }));
  //   //   } catch (error) {
  //   //     console.error("Save error:", error);
  //   //     toast.error(`Failed: ${error.message}`, { id: "save-sky" });
  //   //     return;
  //   //   }
  //   // }
  //   if (featureType === "Sky Replacement") {
  //     setFormData((prev) => ({
  //       ...prev,
  //       beforeAfterData: prev.uploadedImages.map((img) => ({
  //         processedImage: img,
  //       })),
  //     }));
  //   }

  //   next();
  // };

  const handleContinue = () => {
    setFormData((prev) => ({
      ...prev,
      selectedFeatures: selected,
    }));

    // ✅ YE CONDITION REMOVE KAREIN - Draft delete nahi karna Step 2 mein
    // Sirf last step mein hi draft delete hoga

    next();
  };

  return (
    <div className="w-full min-h-screen bg-white mt-14 sm:mt-16 lg:mt-15">
      <div className="flex items-center text-gray-700">
        {/* <div className="flex items-center gap-2">
          <button
            onClick={back}
            className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleContinue}
            className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div> */}
        <span className="font-medium text-black text-[16px] sm:text-[18px] mb-6 sm:mb-8">
          Elite Image AI
        </span>
      </div>

      <h2 className="mb-2 sm:mb-4 lg:mb-6 text-[18px] sm:text-[20px] lg:text-[28px] font-semibold text-gray-900">
        {featureData.title}
      </h2>
      {formData.totalSteps > 0 && (
        <div className="mb-2 sm:mb-4 lg:mb-6 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
          {/* <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" />
        <div className="h-[2px] sm:h-[3px] w-12 sm:w-16 lg:w-20 bg-[#CFE8F2]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#034F75]" />
        <div className="h-[2px] sm:h-[3px] w-12 sm:w-16 lg:w-20 bg-[#034F75]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" /> */}
          <ProgressBar currentStep={2} totalSteps={formData.totalSteps} />
        </div>
      )}

      <div className="mb-2 sm:mb-4 lg:mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {featureData.options.map((item) => (
          <div
            key={item.name}
            onClick={() => {
              setSelected([item.name]);
            }}
            className={`rounded-xl cursor-pointer border-2 overflow-hidden transition-all hover:shadow-lg ${
              selected.includes(item.name)
                ? "border-[#034F75] shadow-md"
                : "border-gray-200"
            }`}
          >
            <div className="relative w-full h-36 sm:h-40 lg:h-44 bg-gray-100">
              <Image
                src={item.img}
                alt={item.name}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white">
              <span className="text-[16px] sm:text-[20px] font-medium text-gray-800 truncate pr-2">
                {item.name}
              </span>

              <input
                type="checkbox"
                checked={selected.includes(item.name)}
                readOnly
                className="w-4 h-4 accent-[#034F75] cursor-pointer flex-shrink-0"
              />
            </div>
          </div>
        ))}
      </div>

      <div className=" flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={back}
          className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-black text-[16px] sm:text-[18px] px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-colors"
        >
          <ChevronRight size={17} className="rotate-180" /> {/* Left arrow */}
          Back
        </button>

        <button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className={`flex items-center gap-2 bg-[#034F75] hover:bg-[#023a5c] text-white text-[16px] sm:text-[18px] px-6 sm:px-10 py-2.5 sm:py-3 rounded-lg transition-colors ${
            selected.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Continue
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Step2;
