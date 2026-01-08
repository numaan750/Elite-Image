"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import ProgressBar from "./ProgressBar";

// Virtual Staging ke furniture types
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
    formData.selectedFurniture || FURNITURE_TYPES[0].name
  );

  const handleContinue = () => {
    setFormData((prev) => ({
      ...prev,
      selectedFurniture: selectedFurniture,
    }));
    next();
  };

  return (
    <div className="w-full min-h-screen bg-white px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <div className="flex items-center gap-3 text-gray-700">
        <div className="flex items-center gap-2">
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
        </div>
        <span className="font-medium text-black text-[16px] sm:text-[20px]">
          Elite Image AI
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-4 sm:mt-5 mb-4 sm:mb-6 text-[20px] sm:text-[30px] lg:text-[40px] font-semibold text-gray-900">
        Select Furniture Type
      </h2>

      {/* Progress Bar - Step 3 of 6 */}
      <div className="mt-4 sm:mt-6 lg:mt-8 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
        {/* <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-10 lg:w-12 bg-[#CFE8F2]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-10 lg:w-12 bg-[#CFE8F2]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#034F75]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-10 lg:w-12 bg-[#034F75]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-10 lg:w-12 bg-[#D3E7F0]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-10 lg:w-12 bg-[#D3E7F0]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" /> */}
        <ProgressBar currentStep={3} totalSteps={formData.totalSteps} />
      </div>

      {/* Furniture Options Grid */}
      <div className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto">
        {FURNITURE_TYPES.map((item) => (
          <div
            key={item.name}
            onClick={() => setSelectedFurniture(item.name)}
            className={`rounded-xl cursor-pointer border-2 overflow-hidden transition-all hover:shadow-lg ${
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

      {/* Continue Button */}
      <div className="mt-8 sm:mt-10 lg:mt-12 flex justify-center lg:justify-end gap-4 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={back} // ya router.back() agar browser history chahiye
          className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-black text-[16px] sm:text-[20px] px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-colors"
        >
          Back
        </button>

        {/* Generate Now Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedFurniture}
          className={`flex items-center gap-2 bg-[#034F75] hover:bg-[#023a5c] text-white text-[16px] sm:text-[20px] px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-colors ${
            !selectedFurniture ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Generate Now
        </button>
      </div>
    </div>
  );
};

export default Step3Farniturestyle;
