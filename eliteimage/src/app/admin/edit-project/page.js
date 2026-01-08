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
  const { token, saveGeneratedImage, getProjectById } = useContext(AppContext);

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sliderPositions, setSliderPositions] = useState({});
  const [isDragging, setIsDragging] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editDescription, setEditDescription] = useState("");

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
        const project = await getProjectById(projectId);

        const loadedFormData = {
          uploadedImages: project.uploadedImages || [],
          featureType: project.featureType || "",
          selectedFeature: project.selectedFeature?.[0] || "",
          selectedStyle: project.selectedStyle?.[0] || "",
          beforeAfterData: project.beforeAfterData?.[0] || {},
          finalNotes: project.finalNotes || "",
          userId: project.userid,
          projectId: projectId,
        };

        setFormData(loadedFormData);
        setEditDescription(project.finalNotes || "");

        toast.success("Project loaded successfully!");
      } catch (error) {
        console.error("Failed to load project:", error);
        toast.error("Failed to load project");
        router.push("/admin/dashboard");
      } finally {
        setLoading(false);
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
    if (!token) {
      toast.error("Please login to save images");
      return;
    }

    setIsSaving(true);
    toast.loading("Updating project...", { id: "update" });

    const finalData = {
      ...formData,
      finalNotes: editDescription,
      lastModified: new Date().toISOString(),
    };

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
      await saveGeneratedImage(backendPayload, token, true, formData.projectId);
      toast.success("Project updated successfully!", { id: "update" });

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1000);
    } catch (error) {
      console.error("❌ Failed to update:", error);
      toast.error(`Failed to update: ${error.message}`, { id: "update" });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#034F75]"></div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Project not found</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8">
      <div className="w-full flex justify-start">
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-7 text-gray-700">
          <div className="flex items-center gap-2">
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
          </div>

          <span className="font-medium text-black text-[16px] sm:text-[20px]">
            Elite Image AI - Edit Mode
          </span>
        </div>
      </div>

      <div className="w-full mb-4 sm:mb-6 lg:mb-8 mt-4 sm:mt-6 lg:mt-10">
        <h2 className="text-[20px] sm:text-[24px] lg:text-[40px] font-semibold text-black">
          Edit Project
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

                    <div
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
                    </div>

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
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 bg-gray-300 text-black text-[14px] sm:text-[16px] px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-gray-400 transition-colors w-full sm:w-auto"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isSaving}
            className={`flex items-center justify-center gap-2 bg-[#034F75] text-white text-[14px] sm:text-[16px] px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-colors w-full sm:w-auto
              ${
                isSaving
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#023d5c]"
              }
            `}
          >
            <FaMagic size={15} className="sm:w-4 sm:h-4" />
            <span>{isSaving ? "Updating..." : "Update Project"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectPage;
