"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FEATURES_DATA } from "./featuresData";
import Image from "next/image";
import ProgressBar from "./ProgressBar";

const Step2 = ({ formData, setFormData, next, back, featureType }) => {
  const featureData = FEATURES_DATA[featureType];

  const [selected, setSelected] = useState(formData.selectedFeatures || []);

  const handleContinue = () => {
    setFormData((prev) => ({
      ...prev,
      selectedFeatures: selected,
    }));
    next();
  };

  return (
    <div className="w-full min-h-screen bg-white px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8">
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
        <span className="font-medium text-black text-[18px] sm:text-[20px]">
          Elite Image AI
        </span>
      </div>

      <h2 className="mt-4 sm:mt-5 mb-4 sm:mb-6 text-[20px] sm:text-[24px] lg:text-[40px] font-semibold text-gray-900">
        {featureData.title}
      </h2>

      <div className="mt-4 sm:mt-6 lg:mt-8 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
        {/* <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" />
        <div className="h-[2px] sm:h-[3px] w-12 sm:w-16 lg:w-20 bg-[#CFE8F2]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#034F75]" />
        <div className="h-[2px] sm:h-[3px] w-12 sm:w-16 lg:w-20 bg-[#034F75]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" /> */}
        <ProgressBar currentStep={2} totalSteps={formData.totalSteps} />
      </div>

      <div className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto">
        {featureData.options.map((item) => (
          <div
            key={item.name}
            onClick={() => {
              setSelected([item.name]); // 🔥 sirf ek hi select hoga
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

      <div className="mt-8 sm:mt-10 lg:mt-12 flex justify-center lg:justify-end gap-4 max-w-7xl mx-auto">
        <button
          onClick={back} // or router.back() if you want browser back
          className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-black text-[16px] sm:text-[20px] px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className={`flex items-center gap-2 bg-[#034F75] hover:bg-[#023a5c] text-white text-[16px] sm:text-[20px] px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-colors ${
            selected.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Generate Now
        </button>
      </div>
    </div>
  );
};

export default Step2;
