"use client";
import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { FaMagic } from "react-icons/fa";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

const Step5 = ({ formData, setFormData, back }) => {
  const { token, saveGeneratedImage } = useContext(AppContext);
  const [sliderPositions, setSliderPositions] = useState({});
  const [isDragging, setIsDragging] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // ✅ ADD THIS
  const router = useRouter();

  useEffect(() => {
    if (!formData.featureType) {
      toast.error("Please select a feature first");
      router.push("/admin/dashboard");
    }
  }, [formData.featureType, router]);

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

  const handleGenerate = async () => {
    if (!token) {
      alert("Please login to save images");
      return;
    }

    setIsSaving(true);

    const finalData = {
      ...formData,
      finalNotes: editDescription,
      lastModified: new Date().toISOString(),
    };

    setFormData(finalData);

    const backendPayload = {
      userid: finalData.userId,
      title: `${finalData.featureType} - ${new Date().toLocaleDateString()}`,
      description: finalData.finalNotes || "",
      featureType: finalData.featureType,
      uploadedImages: finalData.uploadedImages,
      selectedFeature: finalData.selectedFeature
        ? [finalData.selectedFeature]
        : [],
      selectedStyle: finalData.selectedStyle ? [finalData.selectedStyle] : [],
      beforeAfterData: finalData.beforeAfterData
        ? [finalData.beforeAfterData]
        : [],
      finalNotes: finalData.finalNotes || "",
      image:
        finalData.beforeAfterData?.processedImage ||
        finalData.uploadedImages[0] ||
        "",
    };

    try {
      console.log("💾 Saving to backend...", backendPayload);

      // ✅ Check if editing existing project
      if (formData.projectId) {
        await saveGeneratedImage(
          backendPayload,
          token,
          true,
          formData.projectId
        );
        alert("Project updated successfully!");
      } else {
        await saveGeneratedImage(backendPayload, token);
        alert("Image saved successfully!");
      }

      router.push("/admin/dashboard");
    } catch (error) {
      console.error("❌ Failed to save:", error);
      alert(`Failed to save image: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-white flex flex-col items-center mt-14 sm:mt-16 lg:mt-15">
      <div className="w-full flex justify-start">
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-7 text-gray-700">
          {/* <div className="flex items-center gap-2">
            <button
              onClick={back}
              className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div> */}

          <span className="font-medium text-black text-[16px] sm:text-[20px] mb-6 sm:mb-8">
            Elite Image Ai
          </span>
        </div>
      </div>

      <div className="w-full mb-2 sm:mb-4 lg:mb-6 ">
        <h2 className="text-[20px] sm:text-[24px] lg:text-[28px] font-semibold text-black">
          Processing Complete
          {formData.featureType && (
            <span className="text-black font-medium">
              {" "}
              – {formData.featureType}
            </span>
          )}
        </h2>
      </div>

      <div className="border border-[#034F75] rounded-xl p-3 sm:p-4 lg:p-5 w-full bg-[#D3E7F0] mb-2 sm:mb-4 lg:mb-6">
        <h3 className="text-[20px] sm:text-[10px] lg:text-[24px] font-semibold text-black mb-1">
          Before / After Comparison
        </h3>
        <p className="text-[12px] sm:text-[16px] lg:text-[18px] text-black mb-3 sm:mb-4">
          Drag the slider to compare original and enhanced versions
        </p>

        <div className="relative w-full rounded-xl overflow-hidden flex items-center justify-center ">
          <div
            className={`w-full ${
              formData.uploadedImages.length === 1
                ? "flex flex-col gap-4 sm:gap-6"
                : "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 gap-4 sm:gap-6"
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
                    className="relative w-full h-[220px] sm:h-[300px] lg:h-[420px]
 bg-gray-100 rounded-lg overflow-hidden cursor-ew-resize select-none"
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
                        className="object-contain"
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
                        className="object-contain"
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
                        w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-xl flex items-center justify-center
                        cursor-ew-resize border-2 border-[#034F75]"
                        onMouseDown={() => setIsDragging(index)}
                        onTouchStart={() => setIsDragging(index)}
                      >
                        <MoveHorizontal size={20} className="text-[#034F75]" />
                      </div>
                    </div>

                    {/* Labels */}
                    <div className="absolute top-2 left-2 bg-[#034F75] text-white text-[12px] px-3 py-1.5 rounded z-20">
                      Before
                    </div>
                    <div className="absolute top-2 right-2 bg-[#034F75] text-white text-[12px] px-3 py-1.5 rounded z-20">
                      After
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full ">
        <label className="block text-[20px] sm:text-[24px] lg:text-[28px] font-semibold text-black mb-2 sm:mb-4 lg:mb-6 ">
          Describe What You Can Edit
        </label>

        <div className="w-full rounded-lg border border-dashed border-[#034F75] bg-[#DFF0F7] p-3 sm:p-4 mb-2 sm:mb-4 lg:mb-6">
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Enter Here"
            className="w-full h-20 sm:h-24 lg:h-28 resize-none rounded border-none bg-transparent 
            text-[14px] sm:text-[18px] text-gray-800 placeholder:text-gray-400
            focus:outline-none"
          />
        </div>

        <div className="flex justify-between gap-3 w-full">
          {/* Back Button (LEFT) */}
          <button
            onClick={back}
            className="flex items-center justify-center gap-2 bg-gray-300 text-black text-[16px] sm:text-[18px] px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-gray-400 transition-colors"
          >
            <ChevronRight size={15} className="rotate-180" />
            Back
          </button>

          {/* Generate Button (RIGHT) */}
          <button
            onClick={handleGenerate}
            disabled={isSaving}
            className={`flex items-center justify-center gap-2 bg-[#034F75] text-white text-[16px] sm:text-[18px] px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-colors
              ${
                isSaving
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#023d5c]"
              }
            `}
          >
            <FaMagic size={15} />
            <span>{isSaving ? "Saving..." : "Generate"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step5;
