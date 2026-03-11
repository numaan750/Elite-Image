"use client";
import { useState, useEffect, useContext } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import ProgressBar from "./ProgressBar";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SKY_OPTIONS = [
  { name: "Clear Sky",           img: "/projects/SKY/sky-1.webp" },
  { name: "Partly Cloudy Sky",   img: "/projects/SKY/sky-2.webp" },
  { name: "Overcast Sky",        img: "/projects/SKY/sky-3.webp" },
  { name: "Sunset Sky",          img: "/projects/SKY/sky-4.webp" },
  { name: "Twilight / Dusk Sky", img: "/projects/SKY/sky-5.webp" },
  { name: "Dramatic Sky",        img: "/projects/SKY/sky-6.webp" },
  { name: "Rainy Sky",           img: "/projects/SKY/sky-7.webp" },
];

const Step2DuskSky = ({
  formData,
  setFormData,
  next,
  back,
  currentProgressStep,
}) => {
  const { saveDraft } = useContext(AppContext);
  const router = useRouter();

  const [selected, setSelected] = useState(formData.selectedSky || null);

  useEffect(() => {
    if (!formData.featureType) {
      toast.error("Please select a feature first");
      router.push("/admin/dashboard");
    }
  }, [formData.featureType, router]);

  useEffect(() => {
    if (selected) {
      const timeoutId = setTimeout(() => {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const existingDraftId = urlParams.get("draftId") || formData.draftId;
          saveDraft(
            { ...formData, selectedSky: selected, draftId: existingDraftId },
            "step2dusksky",
          );
        } catch (error) {
          console.error("Error saving draft:", error);
        }
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [selected]);

  const handleContinue = () => {
    setFormData((prev) => ({
      ...prev,
      selectedSky: selected,
      // AI ko sky info bhi milti rahe selectedFeature ke zariye
      selectedFeature: selected,
    }));
    next();
  };

  return (
    <div className="w-full min-h-screen bg-white mt-10 sm:mt-8 lg:mt-3">
      <h2 className="mb-2 sm:mb-4 lg:mb-6 text-[18px] sm:text-[20px] lg:text-[28px] font-semibold text-gray-900">
        Sky Replacement – Day to Dusk
      </h2>

      {formData.totalSteps > 0 && (
        <div className="mb-2 sm:mb-4 lg:mb-6 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
          <ProgressBar
            currentStep={currentProgressStep}
            totalSteps={formData.totalSteps}
          />
        </div>
      )}

      <div className="mb-2 sm:mb-4 lg:mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {SKY_OPTIONS.map((item) => (
          <div
            key={item.name}
            onClick={() => setSelected(item.name)}
            className={`rounded-xl cursor-pointer border-2 overflow-hidden transition-all hover:shadow-lg ${
              selected === item.name
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
                checked={selected === item.name}
                readOnly
                className="w-4 h-4 accent-[#034F75] cursor-pointer flex-shrink-0"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
        <button
          onClick={back}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 sm:px-6 py-2 text-[14px] sm:text-[18px] text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={17} className="rotate-180" />
          Back
        </button>

        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`flex items-center justify-center gap-2 bg-[#034F75] text-white text-[16px] sm:text-[18px] px-5 sm:px-7 py-2 rounded-lg transition-colors min-w-[160px] ${
            !selected ? "opacity-50 cursor-not-allowed" : "hover:bg-[#023a5c]"
          }`}
        >
          Continue
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Step2DuskSky;