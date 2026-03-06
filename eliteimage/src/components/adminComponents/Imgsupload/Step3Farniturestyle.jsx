"use client";
import { useEffect, useState, useContext } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import ProgressBar from "./ProgressBar";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";

const FURNITURE_TYPES = [
  { name: "Modern Furniture", img: "/projects/Visual/Furniture-Styles-1.webp" },
  { name: "Contemporary", img: "/projects/Visual/Furniture-Styles-2.webp" },
  {
    name: "Minimalist",
    img: "/projects/Visual/Furniture-Styles-3.webp",
  },
  { name: "Scandinavian", img: "/projects/Visual/Furniture-Styles-4.webp" },
  { name: "Mid-Century", img: "/projects/Visual/Furniture-Styles-5.webp" },
  { name: "Industrial", img: "/projects/Visual/Furniture-Styles-16.webp" },
  { name: "Traditional", img: "/projects/Visual/Furniture-Styles-7.webp" },
  { name: "Transitional", img: "/projects/Visual/Furniture-Styles-8.webp" },
  {
    name: "Rustic",
    img: "/projects/Visual/Furniture-Styles-9.webp",
  },
  { name: "Bohemian", img: "/projects/Visual/Furniture-Styles-10.webp" },
  { name: "Farmhouse", img: "/projects/Visual/Furniture-Styles-11.webp" },
  {
    name: "Luxury / Glam",
    img: "/projects/Visual/Furniture-Styles-12.webp",
  },
  { name: "Japandi", img: "/projects/Visual/Furniture-Styles-13.webp" },
  { name: "Vintage", img: "/projects/Visual/Furniture-Styles-14.webp" },
  {
    name: "Art Deco",
    img: "/projects/Visual/Furniture-Styles-15.webp",
  },
];

const Step3Farniturestyle = ({ formData, setFormData, next, back }) => {
  const [selectedFurniture, setSelectedFurniture] = useState(
    formData.selectedFurniture || FURNITURE_TYPES[0].name,
  );
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { saveDraft } = useContext(AppContext);

  useEffect(() => {
    if (selectedFurniture) {
      const timeoutId = setTimeout(() => {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const existingDraftId = urlParams.get("draftId") || formData.draftId;

          saveDraft(
            {
              ...formData,
              selectedFurniture,
              draftId: existingDraftId,
            },
            "step3",
          );
        } catch (error) {
          console.error("Error saving draft:", error);
        }
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedFurniture]);

  useEffect(() => {
    if (!formData.featureType) {
      toast.error("Please select a feature first");
      router.push("/admin/dashboard");
    }
  }, [formData.featureType, router]);

  const handleContinue = () => {
    setIsSaving(true);
    setFormData((prev) => ({
      ...prev,
      selectedFurniture: selectedFurniture,
      selectedStyle: selectedFurniture,
    }));
    next();
  };

  return (
    <div className="w-full min-h-screen bg-white mt-14 sm:mt-16 lg:mt-15">
      <div className="flex items-center gap-3 text-gray-700">
        <span className="font-medium text-black text-[16px] sm:text-[20px] mb-6 sm:mb-8">
          Elite Image AI
        </span>
      </div>
      <h2 className="mb-4 sm:mb-5 lg:mb-6 text-[20px] sm:text-[24px] lg:text-[28px] font-semibold text-gray-900">
        Select Furniture Type
      </h2>
      {formData.totalSteps > 0 && (
        <div className="mb-4 sm:mb-5 lg:mb-6 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
          <ProgressBar currentStep={3} totalSteps={formData.totalSteps} />
        </div>
      )}

      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-4 sm:mb-5 lg:mb-6">
        {FURNITURE_TYPES.map((item) => (
          <div
            key={item.name}
            onClick={() => {
              if (!isSaving) setSelectedFurniture(item.name);
            }}
            className={`rounded-xl border-2 overflow-hidden transition-all
            ${
              isSaving
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer hover:shadow-lg"
            }
            ${
              selectedFurniture === item.name
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
                checked={selectedFurniture === item.name}
                readOnly
                className="w-4 h-4 accent-[#034F75] cursor-pointer flex-shrink-0"
              />
            </div>
          </div>
        ))}
      </div>

      <div
        className="
    
         flex flex-col sm:flex-row
         items-stretch sm:items-center
         justify-between
         gap-3 sm:gap-4
       "
      >
        <button
          onClick={back}
          disabled={isSaving}
          className={`flex items-center gap-2 rounded-lg border border-gray-300 px-4 sm:px-6 py-2 text-[14px] sm:text-[18px] text-gray-700 transition-colors ${isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
        >
          <ChevronRight size={17} className="rotate-180" />
          Back
        </button>

        <button
          onClick={handleContinue}
          disabled={!selectedFurniture || isSaving}
          className={`
           w-full sm:w-auto
           flex items-center justify-center gap-2
           bg-[#034F75]
           text-white
           text-[14px] sm:text-[16px] lg:text-[18px]
           px-5 sm:px-6 py-2
           rounded-lg
           transition-colors
           ${!selectedFurniture || isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-[#023a5c]"}
         `}
        >
          {isSaving ? "Loading..." : "Continue"}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Step3Farniturestyle;
