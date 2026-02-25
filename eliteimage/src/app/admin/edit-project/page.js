"use client";
import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { FaMagic } from "react-icons/fa";
import { AppContext } from "@/context/AppContext";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const EditProjectPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    token,
    saveGeneratedImage,
    getProjectById,
    deductUserCredits,
    processImageWithAI,
  } = useContext(AppContext);

  const [formData, setFormData] = useState({
    uploadedImages: [],
    featureType: "",
    selectedFeature: "",
    selectedStyle: "",
    beforeAfterData: {},
    finalNotes: "",
    userId: "",
    projectId: "",
  });
  const [loading, setLoading] = useState(false);

  const [sliderPositions, setSliderPositions] = useState({});
  const [isDragging, setIsDragging] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const typingTimerRef = React.useRef(null);

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      const projectId = searchParams.get("projectId");

      if (!projectId) {
        toast.error("Project ID missing!");
        router.push("/admin/dashboard");
        return;
      }

      try {
        const project = await getProjectById(projectId, true);

        const loadedFormData = {
          uploadedImages: project.uploadedImages || [],
          featureType: project.featureType || "",
          selectedFeature: project.selectedFeature?.[0] || "",
          selectedStyle: project.selectedStyle?.[0] || "",
          beforeAfterData: project.beforeAfterData || [],
          finalNotes: project.finalNotes || "",
          userId: project.userid,
          projectId: projectId,
        };

        setFormData(loadedFormData);
        setEditDescription(project.finalNotes || "");
        // ✅ Toast removed - no more "Project loaded successfully"
      } catch (error) {
        console.error("Failed to load project:", error);
        toast.error("Failed to load project");
        router.push("/admin/dashboard");
      }
    };

    loadProject();
  }, []);

  // Initialize slider positions
  useEffect(() => {
    if (formData?.uploadedImages) {
      const initialPositions = {};
      formData.uploadedImages.forEach((_, index) => {
        initialPositions[index] = 50;
      });
      setSliderPositions(initialPositions);
    }
  }, [formData?.uploadedImages]);

  // Handle mouse/touch events
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
      toast.error("Please enter a description of the edits you want.");
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
    setIsTyping(true);

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
          processedUrl = await processImageWithAI(
            originalImage,
            formData.featureType,
            formData.selectedFeature || null,
            formData.selectedStyle || null,
            editDescription,
          );
          toast.success(`Image ${i + 1} ready!`, { id: `gen-${i}` });
        } catch (aiError) {
          console.error(`AI failed for image ${i + 1}:`, aiError);
          toast.error(`AI failed for image ${i + 1}`, { id: `gen-${i}` });
          processedUrl = originalImage;
        }

        allProcessedData.push({
          originalImage: originalImage,
          processedImage: processedUrl,
          editPrompt: editDescription,
          editedAt: new Date().toISOString(),
          status: "completed",
        });
      }

      // ✅ formData update karo
      setFormData((prev) => ({
        ...prev,
        beforeAfterData: allProcessedData,
        finalNotes: editDescription,
        uploadedImages: allProcessedData.map((item) => item.processedImage),
      }));

      // ✅ Database mein save karo
      const backendPayload = {
        userid: formData.userId,
        title: `${formData.featureType} - Edited - ${new Date().toLocaleDateString()}`,
        description: editDescription,
        featureType: formData.featureType,
        uploadedImages: allProcessedData.map((item) => item.processedImage),
        selectedFeature: formData.selectedFeature
          ? [formData.selectedFeature]
          : [],
        selectedStyle: formData.selectedStyle ? [formData.selectedStyle] : [],
        beforeAfterData: allProcessedData,
        finalNotes: editDescription,
        image:
          allProcessedData[0]?.processedImage || formData.uploadedImages[0],
      };

      await saveGeneratedImage(backendPayload, token, true, formData.projectId);
      toast.success("Project updated successfully!", { duration: 2000 });
      setTimeout(() => {
        router.push(
          `/admin/step4?projectId=${formData.projectId}&mode=view&t=${Date.now()}`,
        );
      }, 1500);
    } catch (error) {
      console.error("❌ Generate error:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setIsTyping(false);
    }
  };

  if (!formData.projectId && loading) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center mt-14 sm:mt-16 lg:mt-15">
        <div className="w-full animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center mt-14 sm:mt-16 lg:mt-15">
      <div className="w-full flex justify-start">
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-7 text-gray-700 mb-6 sm:mb-8">
          {/* <div className="flex items-center gap-2">
              <button
                onClick={() => router.back()}
                className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div> */}

          <span className="font-medium text-black text-[16px] sm:text-[20px]  ">
            Elite Image AI - Edit Mode
          </span>
        </div>
      </div>

      <div className="w-full mb-2 sm:mb-4 lg:mb-6">
        <h2 className="text-[20px] sm:text-[24px] lg:text-[32px] font-semibold text-black">
          Edit Project
        </h2>
      </div>

      <div className="border border-[#034F75] rounded-xl p-3 sm:p-4 lg:p-5 w-full bg-[#D3E7F0] mb-2 sm:mb-4 lg:mb-6">
        <h3 className="text-[16px] sm:text-[18px] lg:text-[20px] font-semibold text-black mb-1">
          Edit Your Image Instantly
        </h3>
        <p className="text-[12px] sm:text-[16px] lg:text-[20px] text-black mb-3 sm:mb-4">
          The image is ready to edit. Enter your prompt below to apply changes
          instantly.
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
                    {/* ✅ Sirf generated image dikhao */}
                    <div className="absolute inset-0">
                      <Image
                        src={
                          Array.isArray(formData.beforeAfterData) &&
                          formData.beforeAfterData[index]?.processedImage
                            ? formData.beforeAfterData[index].processedImage
                            : formData.beforeAfterData?.processedImage || img
                        }
                        alt={`Generated ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-contain"
                        priority
                      />
                    </div>

                    {/* ✅ Shimmer - typing ya generating ke waqt */}
                    {(isTyping || isGenerating) && (
                      <div
                        className="absolute inset-0 z-10 rounded-lg"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                          backgroundSize: "200% 100%",
                          animation: "shimmerSlide 1.2s ease-in-out infinite",
                        }}
                      />
                    )}

                    {/* <div
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
                        style={{ left: `${sliderPositions[index] || 50}%` }}
                      >
                        <div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                          w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center
                          cursor-ew-resize border-2 border-[#034F75]"
                          onMouseDown={() => setIsDragging(index)}
                          onTouchStart={() => setIsDragging(index)}
                        >
                          <MoveHorizontal size={20} className="text-[#034F75]" />
                        </div>
                      </div> */}

                    {/* <div className="absolute top-2 left-2 bg-[#034F75] text-white text-[10px] sm-text-[14px] px-3 py-1.5 rounded z-20">
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

      <div className="w-full">
        <label className="block text-[18px] sm:text-[24px] lg:text-[32px] font-semibold text-black mb-2 sm:mb-4 lg:mb-6">
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
              text-[14px] sm:text-[20px] text-gray-800 placeholder:text-gray-400
              focus:outline-none"
          />
        </div>

        <div
          className="
    flex flex-col sm:flex-row
    w-full
    justify-between
    items-stretch sm:items-center
    gap-3 sm:gap-4
    
  "
        >
          <button
            onClick={() => router.back()}
            className="
        w-full sm:w-auto
        flex items-center justify-center gap-2
        bg-gray-300 text-black
        text-[16px] sm:text-[16px] lg:text-[18px]
        px-4 sm:px-6
        py-2.5 sm:py-3
        rounded-lg
        hover:bg-gray-400
        transition-colors
      "
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isSaving || isGenerating}
            className={`
              w-full sm:w-auto            
              flex items-center justify-center gap-2
              bg-[#034F75] text-white
              text-[16px] sm:text-[16px] lg:text-[18px]
              px-4 sm:px-6
              py-2.5 sm:py-3
              rounded-lg
              transition-colors
              ${isSaving || isGenerating ? "opacity-50 cursor-not-allowed" : "hover:bg-[#023d5c]"}
            `}
          >
            <FaMagic size={16} />
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

export default EditProjectPage;
