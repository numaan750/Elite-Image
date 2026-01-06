"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { STYLES_DATA } from "./featuresData";

const Step3 = ({ formData, setFormData, next, back, featureType }) => {
  const styles = STYLES_DATA[featureType];

  const [selected, setSelected] = useState(
    formData.selectedStyle || styles[0].name
  );

  const handleGenerate = () => {
    setFormData((prev) => ({
      ...prev,
      selectedStyle: selected,
    }));
    next();
  };

  return (
    <div className="w-full min-h-screen bg-white px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-10">
      <div className="flex items-center gap-3 text-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={back}
            className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleGenerate}
            className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <span className="font-medium text-black text-sm sm:text-base">
          Elite Image Ai
        </span>
      </div>

      <h2 className="mt-4 sm:mt-6 lg:mt-9 mb-4 sm:mb-5 lg:mb-6 text-lg sm:text-xl lg:text-2xl font-semibold text-black">
        Edit Styles - {featureType}
      </h2>

      <div className="mt-4 sm:mt-6 lg:mt-8 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-12 lg:w-20 bg-[#CFE8F2]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-12 lg:w-20 bg-[#D3E7F0]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#034F75]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-12 lg:w-20 bg-[#034F75]" />
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {styles.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            onClick={() => setSelected(item.name)}
            className={`w-full rounded-xl sm:rounded-2xl cursor-pointer border-2 overflow-hidden transition-all hover:shadow-lg
             ${
               selected === item.name
                 ? "border-[#034F75] shadow-md"
                 : "border-gray-200"
             }`}
          >
            <Image
              src={item.img}
              alt={item.name}
              width={260}
              height={170}
              className="w-full h-36 sm:h-40 lg:h-44 object-cover"
              priority
            />
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white">
              <span className="text-xs sm:text-sm font-medium text-gray-800 truncate pr-2">
                {item.name}
              </span>
              <input
                type="checkbox"
                checked={selected === item.name}
                readOnly
                className="w-4 h-4 accent-[#034F75] cursor-pointer flex-shrink-0"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 sm:mt-12 lg:mt-16 flex justify-center lg:justify-end">
        <button
          onClick={handleGenerate}
          disabled={!selected}
          className={`flex items-center gap-2 bg-[#034F75] text-white text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-[#023d5c] transition-colors ${
            !selected ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Generate Now
        </button>
      </div>
    </div>
  );
};

export default Step3;
