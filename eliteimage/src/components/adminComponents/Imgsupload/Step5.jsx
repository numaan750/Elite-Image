"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { FaMagic } from "react-icons/fa";

const Step5 = ({ formData, setFormData, back }) => {
  const [sliderPositions, setSliderPositions] = useState({});
  const [isDragging, setIsDragging] = useState(null);

  // Initialize slider positions for each image
  useEffect(() => {
    const initialPositions = {};
    formData.uploadedImages.forEach((_, index) => {
      initialPositions[index] = 50;
    });
    setSliderPositions(initialPositions);
  }, [formData.uploadedImages.length]);
  const [editDescription, setEditDescription] = useState(
    formData.finalNotes || ""
  );
  useEffect(() => {
    if (formData.finalNotes) {
      setEditDescription(formData.finalNotes);
    }
  }, [formData.finalNotes]);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(null);
    const handleTouchEnd = () => setIsDragging(null);

    if (isDragging !== null) {
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  const handleGenerate = () => {
    const finalData = {
      ...formData,
      finalNotes: editDescription,
      lastModified: new Date().toISOString(),
    };

    setFormData(finalData);

    console.log("=== FINAL COMPLETE DATA ===");
    console.log("Feature Type:", finalData.featureType);
    console.log("Uploaded Images:", finalData.uploadedImages);
    console.log("Selected Feature:", finalData.selectedFeature);
    console.log("Selected Style:", finalData.selectedStyle);
    console.log("Before/After Data:", finalData.beforeAfterData);
    console.log("Final Notes:", finalData.finalNotes);
    console.log("Last Modified:", finalData.lastModified);
    console.log("=========================");

    alert("Final edits saved! Check console for complete data.");
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8">
      <div className="w-full flex justify-start">
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-7 text-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={back}
              className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          <span className="font-medium text-black text-[16px] sm:text-[20px]">
            Elite Image Ai
          </span>
        </div>
      </div>

      <div className="w-full mb-4 sm:mb-6 lg:mb-8 mt-4 sm:mt-6 lg:mt-10">
        <h2 className="text-[20px] sm:text-[24px] lg:text-[40px] font-semibold text-black">
          Processing Complete
        </h2>
      </div>

      <div className="border border-[#034F75] rounded-xl p-3 sm:p-4 lg:p-5 w-full bg-[#D3E7F0]">
        <h3 className="text-[20px] sm:text-[24px] lg:text-[30px] font-semibold text-black mb-1">
          Before / After Comparison
        </h3>
        <p className="text-[12px] sm:text-[16px] lg:text-[20px] text-black mb-3 sm:mb-4">
          Drag the slider to compare original and enhanced versions
        </p>

        <div className="relative w-full rounded-xl overflow-hidden flex items-center justify-center">
          <div
            className={`w-full ${
              formData.uploadedImages.length === 1
                ? "flex flex-col gap-4 sm:gap-6"
                : "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
            }`}
          >
            {formData.uploadedImages.map((img, index) => (
              <div
                key={index}
                className="border border-[#6FB6D6] rounded-lg sm:rounded-xl p-3 sm:p-4 bg-[#d3e7f0]"
              >
                <p className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-black">
                  Image {index + 1}
                </p>

                <div className="flex flex-col gap-3 sm:gap-4">
                  <div
                    className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-ew-resize select-none"
                    onMouseMove={(e) => {
                      if (isDragging !== index) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const percentage = (x / rect.width) * 100;
                      setSliderPositions((prev) => ({
                        ...prev,
                        [index]: Math.min(Math.max(percentage, 0), 100),
                      }));
                    }}
                    onTouchMove={(e) => {
                      if (isDragging !== index) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.touches[0].clientX - rect.left;
                      const percentage = (x / rect.width) * 100;
                      setSliderPositions((prev) => ({
                        ...prev,
                        [index]: Math.min(Math.max(percentage, 0), 100),
                      }));
                    }}
                  >
                    {/* Before Image (Full) */}
                    <div className="absolute inset-0">
                      <Image
                        src={img}
                        alt={`Before ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-cover"
                        priority
                      />
                    </div>

                    {/* After Image (Clipped) */}
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: `inset(0 ${
                          100 - (sliderPositions[index] || 50)
                        }% 0 0)`,
                      }}
                    >
                      <Image
                        src={formData.beforeAfterData?.processedImage || img}
                        alt={`After ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-cover"
                        priority
                      />
                    </div>

                    {/* Slider Line */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
                      style={{ left: `${sliderPositions[index] || 50}%` }}
                    >
                      {/* Slider Handle */}
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center
                        cursor-ew-resize border-2 border-[#034F75]"
                        onMouseDown={() => setIsDragging(index)}
                        onTouchStart={() => setIsDragging(index)}
                      >
                        <MoveHorizontal size={20} className="text-[#034F75]" />
                      </div>
                    </div>

                    {/* Labels */}
                    <div className="absolute top-2 left-2 bg-[#034F75] text-white text-[14px] px-3 py-1.5 rounded z-20">
                      Before
                    </div>
                    <div className="absolute top-2 right-2 bg-[#034F75] text-white text-[14px] px-3 py-1.5 rounded z-20">
                      After
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full mt-6 sm:mt-8 lg:mt-10">
        <label className="block text-[14px] sm:text-[18px] lg:text-[24px] font-medium text-black mb-2">
          Describe What You Can Edit
        </label>

        <div className="w-full rounded-lg border border-dashed border-[#034F75] bg-[#DFF0F7] p-3 sm:p-4">
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Enter Here"
            className="w-full h-20 sm:h-24 lg:h-28 resize-none rounded border-none bg-transparent 
            text-[14px] sm:text-[20px] text-gray-800 placeholder:text-gray-400
            focus:outline-none"
          />
        </div>

        <div className="flex justify-center sm:justify-end mt-4 sm:mt-5 gap-3 w-full sm:w-auto">
          {/* Back Button */}
          <button
            onClick={back} // ya router.back() agar browser history chahiye
            className="flex items-center justify-center gap-2 bg-gray-300 text-black text-[14px] sm:text-[16px] px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-gray-400 transition-colors w-full sm:w-auto"
          >
            Back
          </button>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="flex items-center justify-center gap-2 bg-[#034F75] text-white text-[14px] sm:text-[16px] px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-[#023d5c] transition-colors w-full sm:w-auto"
          >
            <FaMagic size={15} className="sm:w-4 sm:h-4" />
            <span>Generate</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step5;
