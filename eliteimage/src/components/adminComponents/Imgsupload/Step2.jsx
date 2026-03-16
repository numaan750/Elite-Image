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
  }, [selected]);

  const handleContinue = () => {
    const flatSelected = Array.isArray(selected)
      ? selected.flat().filter((s) => typeof s === "string")
      : [selected].filter(Boolean);

    setFormData((prev) => ({
      ...prev,
      selectedFeatures: flatSelected,
      selectedFeature: flatSelected,
    }));
    next();
  };

  return (
    <div className="w-full min-h-screen bg-white mt-10 sm:mt-8 lg:mt-3">
      <h2 className="mb-2 sm:mb-4 lg:mb-6 text-[18px] sm:text-[20px] lg:text-[28px] font-semibold text-gray-900">
        {featureData.title}
      </h2>
      {formData.totalSteps > 0 && (
        <div className="mb-2 sm:mb-4 lg:mb-6 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
          <ProgressBar currentStep={2} totalSteps={formData.totalSteps} />
        </div>
      )}

      <div className="mb-2 sm:mb-4 lg:mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {featureData.options.map((item) => (
          <div
            key={item.name}
            // onClick={() => {
            //   if (featureType === "Enhance") {
            //     setSelected((prev) =>
            //       prev.includes(item.name)
            //         ? prev.filter((i) => i !== item.name)
            //         : [...prev, item.name],
            //     );
            //   } else {
            //     setSelected([item.name]);
            //   }
            // }}
            onClick={() => {
              if (featureType === "Enhance" || featureType === "HDR") {
                setSelected((prev) =>
                  prev.includes(item.name)
                    ? prev.filter((i) => i !== item.name)
                    : [...prev, item.name],
                );
              } else {
                setSelected([item.name]);
              }
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
        <button
          onClick={back}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 sm:px-6 py-2 text-[14px] sm:text-[18px] text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={17} className="rotate-180" /> {/* Left arrow */}
          Back
        </button>

        <button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className={`flex items-center gap-2 bg-[#034F75] hover:bg-[#023a5c] text-white text-[16px] sm:text-[18px] px-5 sm:px-7 py-2 rounded-lg transition-colors min-w-[160px] justify-center ${
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
