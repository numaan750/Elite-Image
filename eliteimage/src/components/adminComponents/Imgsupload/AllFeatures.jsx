"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  { title: "Enhance", image: "/LandingPage/Enhance.webp" },
  { title: "HDR", image: "/LandingPage/HDR.webp" },
  { title: "Grass Replacement", image: "/LandingPage/Grass.webp" },
  { title: "Object Removal", image: "/LandingPage/Object-Removel.webp" },
  { title: "Sky Replacement", image: "/LandingPage/Sky.webp" },
  { title: "Virtual Staging", image: "/LandingPage/Virtual-Staging.webp" },
  {
    title: "Day to Dusk",
    desc: "Transform twilight",
    image: "/LandingPage/Day-to-Dusk.webp",
  },
  {
    title: "Straighten",
    desc: "Fix angle",
    image: "/LandingPage/Straighten.webp",
  },
  {
    title: "Watermark Remove",
    desc: "Clean branding",
    image: "/LandingPage/Watermark-Remove.webp",
  },
];

const AllFeatures = () => {
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  const handleContinue = () => {
    if (!selected) return;
    
    // ✅ Feature select karne ke baad proper URL pe redirect karo
    // Ye Step1 ko feature ke saath load karega
    router.push(`/admin/uploadImage?type=${encodeURIComponent(selected)}`);
  };

  return (
    <div className="w-full min-h-screen bg-white py-8">
      {/* Header */}
      <h2 className="text-[22px] sm:text-[26px] font-semibold mb-8">
        Select Feature
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {features.map((item) => (
          <div
            key={item.title}
            onClick={() => setSelected(item.title)}
            className={`rounded-xl border-2 cursor-pointer overflow-hidden transition-all
              ${
                selected === item.title
                  ? "border-[#034F75] shadow-lg"
                  : "border-gray-200 hover:border-[#034F75]"
              }`}
          >
            {/* Image */}
            <div className="relative w-full h-44 bg-gray-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title + Checkbox */}
            <div className="flex items-center justify-between px-4 py-3 bg-white">
              <span className="text-[18px] font-medium text-black">
                {item.title}
              </span>

              <input
                type="checkbox"
                checked={selected === item.title}
                readOnly
                className="w-4 h-4 accent-[#034F75]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg text-[18px] transition-colors
            ${
              selected
                ? "bg-[#034F75] hover:bg-[#023a5c] text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
        >
          Continue
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default AllFeatures;