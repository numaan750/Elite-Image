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
    processImageWithAI,
  } = useContext(AppContext);
  const searchParams = useSearchParams();
  const [sliderPositions, setSliderPositions] = useState({});
  const [isDragging, setIsDragging] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const typingTimerRef = React.useRef(null);

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
    if (!editDescription.trim()) {
      toast.error("Pehle kuch likho textarea mein!");
      return;
    }

    const imageCount = formData.uploadedImages.length;
    const creditsNeeded = imageCount * 5;
    const canProceed = await deductUserCredits(creditsNeeded);
    if (!canProceed) return;

    if (!token) {
      toast.error("Please login to save images");
      return;
    }

    setIsGenerating(true);
    setIsTyping(true); // shimmer on

    try {
      const allProcessedData = [];

      for (let i = 0; i < formData.uploadedImages.length; i++) {
        const originalImage = formData.uploadedImages[i];

        toast.loading(
          `AI processing image ${i + 1} of ${formData.uploadedImages.length}...`,
          { id: `gen-${i}` },
        );

        let processedUrl;
        try {
          // ✅ Real AI Call - textarea ki value jayegi as finalNotes
          processedUrl = await processImageWithAI(
            originalImage,
            formData.featureType,
            formData.selectedFeature || null,
            formData.selectedStyle || null,
            editDescription, // ✅ yeh textarea wali value hai
          );
          toast.success(`Image ${i + 1} ready!`, { id: `gen-${i}` });
        } catch (aiError) {
          console.error(`AI failed for image ${i + 1}:`, aiError);
          toast.error(`AI failed for image ${i + 1}`, { id: `gen-${i}` });
          processedUrl = originalImage; // fallback
        }

        allProcessedData.push({
          originalImage: originalImage,
          processedImage: processedUrl, // ✅ AI wali nayi image
          editPrompt: editDescription,
          editedAt: new Date().toISOString(),
          status: "completed",
        });
      }

      // ✅ formData update karo nayi processed images se
      setFormData((prev) => ({
        ...prev,
        beforeAfterData: allProcessedData,
        finalNotes: editDescription,
      }));

      // ✅ Database mein save karo
      const backendPayload = {
        userid: formData.userId,
        title: `${formData.featureType} - Edited - ${new Date().toLocaleDateString()}`,
        description: editDescription,
        featureType: formData.featureType,
        uploadedImages: formData.uploadedImages,
        selectedFeature: formData.selectedFeature
          ? [formData.selectedFeature]
          : [],
        selectedStyle: formData.selectedStyle ? [formData.selectedStyle] : [],
        beforeAfterData: allProcessedData,
        finalNotes: editDescription,
        image:
          allProcessedData[0]?.processedImage || formData.uploadedImages[0],
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

      // ✅ Draft clean karo
      const urlParams = new URLSearchParams(window.location.search);
      const draftId = urlParams.get("draftId") || formData.draftId;
      if (draftId) {
        const savedDrafts = localStorage.getItem("draftProjects");
        if (savedDrafts) {
          const drafts = JSON.parse(savedDrafts);
          localStorage.setItem(
            "draftProjects",
            JSON.stringify(drafts.filter((d) => d.id !== draftId)),
          );
        }
      }
      localStorage.removeItem("currentDraft");

      toast.success("Images generate ho gayi!", { duration: 2000 });

      // ✅ Step 4 par wapas jao nayi images ke saath
      back();
    } catch (error) {
      console.error("❌ Generate error:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setIsTyping(false); // shimmer off
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
                    {/* ✅ Background = Generated/Processed Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={
                          Array.isArray(formData.beforeAfterData) &&
                          formData.beforeAfterData[index]?.processedImage
                            ? formData.beforeAfterData[index].processedImage
                            : formData.beforeAfterData?.processedImage || img
                        }
                        alt={`After ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-contain"
                        priority
                      />
                    </div>

                    {/* ✅ Shimmer Overlay - typing ke waqt dikhega */}
                    {isTyping && (
                      <div className="absolute inset-0 z-10 overflow-hidden rounded-lg">
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmerMove 1.2s ease-in-out infinite",
                          }}
                        />
                      </div>
                    )}

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
            onChange={(e) => {
              setEditDescription(e.target.value);
              setIsTyping(true);
              if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
              typingTimerRef.current = setTimeout(() => {
                setIsTyping(false);
              }, 1000);
            }}
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
            disabled={isSaving || isGenerating}
            className={`flex items-center justify-center gap-2 bg-[#034F75] text-white text-[16px] sm:text-[18px] px-5 sm:px-7 py-2 rounded-lg transition-colors
  ${
    isSaving || isGenerating
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-[#023d5c]"
  }
`}
          >
            <FaMagic size={15} />
            <span>
              {isGenerating
                ? "AI Processing..."
                : isSaving
                  ? "Saving..."
                  : "Generate"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

<style jsx global>{`
  @keyframes shimmerMove {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`}</style>;

export default Step5;
