"use client";
import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { FaMagic } from "react-icons/fa";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

const Step5 = ({ formData, setFormData, back }) => {
  const {
    token,
    saveGeneratedImage,
    saveDraft,
    deleteDraft,
    deductUserCredits,
  } = useContext(AppContext);
  const searchParams = useSearchParams();
  const [sliderPositions, setSliderPositions] = useState({});
  const [isDragging, setIsDragging] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!formData.featureType) {
      toast.error("Please select a feature first");
      router.push("/admin/dashboard");
    }
  }, [formData.featureType, router]);

  useEffect(() => {
    const initialPositions = {};
    formData.uploadedImages.forEach((_, index) => {
      initialPositions[index] = 50;
    });
    setSliderPositions(initialPositions);
  }, [formData.uploadedImages.length]);
  const [editDescription, setEditDescription] = useState(
    formData.finalNotes || "",
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
  const imageCount = formData.uploadedImages.length;
  const creditsNeeded = imageCount * 5;
  const canProceed = await deductUserCredits(creditsNeeded);
  if (!canProceed) {
    return;
  }
    if (!token) {
      toast.error("Please login to save images");
      return;
    }
    const finalData = {
      ...formData,
      finalNotes: editDescription,
      lastModified: new Date().toISOString(),
    };
    const updatedBeforeAfterData = formData.beforeAfterData
      ? Array.isArray(formData.beforeAfterData)
        ? formData.beforeAfterData.map((item) => ({
            ...item,
            editPrompt: editDescription,
            editedAt: new Date().toISOString(),
          }))
        : {
            ...formData.beforeAfterData,
            editPrompt: editDescription,
            editedAt: new Date().toISOString(),
          }
      : [];

    setFormData((prev) => ({
      ...prev,
      beforeAfterData: updatedBeforeAfterData,
      finalNotes: editDescription,
      lastModified: new Date().toISOString(),
    }));

    back();
    (async () => {
      try {
        const backendPayload = {
          userid: finalData.userId,
          title: `${finalData.featureType} - Edited - ${new Date().toLocaleDateString()}`,
          description: editDescription,
          featureType: finalData.featureType,
          uploadedImages: finalData.uploadedImages,
          selectedFeature: finalData.selectedFeature
            ? [finalData.selectedFeature]
            : [],
          selectedStyle: finalData.selectedStyle
            ? [finalData.selectedStyle]
            : [],
          beforeAfterData: Array.isArray(updatedBeforeAfterData)
            ? updatedBeforeAfterData
            : [updatedBeforeAfterData],
          finalNotes: editDescription,
          image:
            (Array.isArray(updatedBeforeAfterData)
              ? updatedBeforeAfterData[0]?.processedImage
              : updatedBeforeAfterData?.processedImage) ||
            finalData.uploadedImages[0],
        };

        if (formData.projectId) {
          await saveGeneratedImage(
            backendPayload,
            token,
            true,
            formData.projectId,
          );
        } else {
          await saveGeneratedImage(backendPayload, token);
        }

        const urlParams = new URLSearchParams(window.location.search);
        const draftId = urlParams.get("draftId") || formData.draftId;

        if (draftId) {
          const savedDrafts = localStorage.getItem("draftProjects");
          if (savedDrafts) {
            const drafts = JSON.parse(savedDrafts);
            const updatedDrafts = drafts.filter(
              (draft) => draft.id !== draftId,
            );
            localStorage.setItem(
              "draftProjects",
              JSON.stringify(updatedDrafts),
            );
          }
        }
        localStorage.removeItem("currentDraft");
      } catch (error) {
        console.error("❌ Background save failed:", error);
      }
    })();
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
          Edit Your Image Instantly
        </h3>
        <p className="text-[12px] sm:text-[16px] lg:text-[18px] text-black mb-3 sm:mb-4">
          The image is ready to edit. Enter your prompt below to apply changes
          instantly.
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
                    {/* <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
                      style={{ left: `${sliderPositions[index] || 50}%` }}
                    >
                      {/* Slider Handle */}
                    {/* <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-xl flex items-center justify-center
                        cursor-ew-resize border-2 border-[#034F75]"
                        onMouseDown={() => setIsDragging(index)}
                        onTouchStart={() => setIsDragging(index)}
                      >
                        <MoveHorizontal size={20} className="text-[#034F75]" />
                      </div>
                    </div> */}

                    {/* Labels
                    <div className="absolute top-2 left-2 bg-[#034F75] text-white text-[10px] sm-text-[14px] px-3 py-1.5 rounded z-20">
                      Before
                    </div>
                    <div className="absolute top-2 right-2 bg-[#034F75] text-white text-[10px] sm-text-[14px] px-3 py-1.5 rounded z-20">
                      After
                    </div> */}
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
          <button
            onClick={back}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 sm:px-6 py-2 text-[14px] sm:text-[18px] text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isSaving}
            className={`flex items-center justify-center gap-2 bg-[#034F75] text-white text-[16px] sm:text-[18px] px-5 sm:px-7 py-2 rounded-lg transition-colors
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
