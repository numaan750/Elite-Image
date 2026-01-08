"use client";
import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { TbEdit } from "react-icons/tb";
import { IoShareSocial } from "react-icons/io5";
import { PiDownload } from "react-icons/pi";
import { AppContext } from "@/context/AppContext";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

import JSZip from "jszip";
import { saveAs } from "file-saver";

// const CLOUD_NAME = "dhtpqla2b";
// const UPLOAD_PRESET = "unsigned_preset";

// const uploadToCloudinary = async (imageUrl) => {
//   try {
//     const formData = new FormData();
//     let imageBlob;

//     if (typeof imageUrl === "string" && imageUrl.startsWith("http")) {
//       const response = await fetch(imageUrl);
//       imageBlob = await response.blob();
//     } else if (typeof imageUrl === "string" && imageUrl.startsWith("data:")) {
//       const response = await fetch(imageUrl);
//       imageBlob = await response.blob();
//     } else {
//       imageBlob = imageUrl;
//     }

//     formData.append("file", imageBlob);
//     formData.append("upload_preset", UPLOAD_PRESET);
//     formData.append("cloud_name", CLOUD_NAME);

//     const response = await fetch(
//       `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Cloudinary upload failed");
//     }

//     const data = await response.json();
//     return data.secure_url;
//   } catch (error) {
//     console.error("❌ Cloudinary Upload Error:", error);
//     throw error;
//   }
// };

// const processImage = async (imageUrl, options) => {
//   try {
//     console.log("🎨 Processing image...");
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     return imageUrl;
//   } catch (error) {
//     console.error("❌ Image Processing Error:", error);
//     throw error;
//   }
// };

// const downloadImage = async (imageUrl, filename = "elite-image-ai.jpg") => {
//   try {
//     const response = await fetch(imageUrl);
//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     window.URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error("Download failed", error);
//     toast.error("Download failed");
//   }
// };

const Step4Page = () => {
  useEffect(() => {
    toast.dismiss();
  }, []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user, saveGeneratedImage, getProjectById } =
    useContext(AppContext);

  const [formData, setFormData] = useState({
    uploadedImages: [],
    featureType: "",
    selectedFeature: "",
    selectedStyle: "",
    beforeAfterData: [],
    finalNotes: "",
    userId: user?._id || "",
  });

  const [sliderPositions, setSliderPositions] = useState({});
  const [isDragging, setIsDragging] = useState(null);
  // const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmDownload, setConfirmDownload] = useState(false);

  // Load project data
  useEffect(() => {
    const loadProjectData = async () => {
      const mode = searchParams.get("mode");
      const pid = searchParams.get("projectId");

      if (!pid) {
        toast.error("Project ID missing!");
        router.push("/admin/dashboard");
        return;
      }

      setProjectId(pid);

      if (mode === "view") {
        setIsViewMode(true);
      } else if (mode === "edit") {
        setIsEditMode(true);
      }

      try {
        const project = await getProjectById(pid);

        setFormData({
          uploadedImages: project.uploadedImages || [],
          featureType: project.featureType || "",
          selectedFeature: project.selectedFeature?.[0] || "",
          selectedStyle: project.selectedStyle?.[0] || "",
          beforeAfterData: project.beforeAfterData || [],
          finalNotes: project.finalNotes || "",
          userId: project.userid || user?._id,
        });

        toast.success("Project loaded successfully!", {
          id: "project-loaded",
          duration: 2000,
        });
      } catch (error) {
        toast.error("Failed to load project");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, []);

  // Initialize slider positions
  useEffect(() => {
    const initialPositions = {};
    formData.uploadedImages.forEach((_, index) => {
      initialPositions[index] = 50;
    });
    setSliderPositions(initialPositions);
  }, [formData.uploadedImages.length]);

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

  // const handleGenerate = async () => {
  //   if (!formData.uploadedImages || formData.uploadedImages.length === 0) {
  //     toast.error("Please upload at least one image first!");
  //     return;
  //   }

  //   if (!token) {
  //     toast.error("Please login to save images");
  //     return;
  //   }

  //   setIsSaving(true);
  //   toast.loading(`Processing ${formData.uploadedImages.length} image(s)...`, {
  //     id: "processing",
  //   });

  //   try {
  //     const allProcessedData = [];
  //     const allBackendPayloads = [];

  //     for (let i = 0; i < formData.uploadedImages.length; i++) {
  //       const uploadedImage = formData.uploadedImages[i];

  //       const originalCloudinaryUrl = await uploadToCloudinary(uploadedImage);
  //       const processedImageUrl = await processImage(originalCloudinaryUrl, {
  //         userId: formData.userId,
  //         featureType: formData.featureType,
  //         selectedFeature: formData.selectedFeature,
  //         selectedStyle: formData.selectedStyle,
  //       });
  //       const processedCloudinaryUrl = await uploadToCloudinary(processedImageUrl);

  //       const processedData = {
  //         originalImage: originalCloudinaryUrl,
  //         processedImage: processedCloudinaryUrl,
  //         processedAt: new Date().toISOString(),
  //         status: "completed",
  //         userId: formData.userId,
  //         featureType: formData.featureType,
  //         selectedOptions: {
  //           feature: formData.selectedFeature,
  //           style: formData.selectedStyle,
  //         },
  //       };
  //       allProcessedData.push(processedData);

  //       const backendPayload = {
  //         userid: formData.userId,
  //         title: `${formData.featureType} - Image ${i + 1} - ${new Date().toLocaleDateString()}`,
  //         description: formData.finalNotes || `Generated image ${i + 1}`,
  //         featureType: formData.featureType,
  //         uploadedImages: [originalCloudinaryUrl],
  //         selectedFeature: formData.selectedFeature ? [formData.selectedFeature] : [],
  //         selectedStyle: formData.selectedStyle ? [formData.selectedStyle] : [],
  //         beforeAfterData: [processedData],
  //         finalNotes: formData.finalNotes || "",
  //         image: processedCloudinaryUrl,
  //       };
  //       allBackendPayloads.push(backendPayload);
  //     }

  //     setFormData((prev) => ({
  //       ...prev,
  //       beforeAfterData: allProcessedData,
  //     }));

  //     if (isEditMode && projectId) {
  //       await saveGeneratedImage(allBackendPayloads[0], token, true, projectId);
  //       toast.success("Project updated successfully!", { id: "processing" });
  //     } else {
  //       await saveGeneratedImage(allBackendPayloads, token);
  //       toast.success(`${formData.uploadedImages.length} image(s) saved!`, { id: "processing" });
  //     }

  //     for (let i = 0; i < allProcessedData.length; i++) {
  //       await downloadImage(
  //         allProcessedData[i].processedImage,
  //         `elite-image-ai-${i + 1}.jpg`
  //       );
  //     }

  //     router.push("/admin/dashboard");
  //   } catch (error) {
  //     console.error("❌ Error:", error);
  //     toast.error(`Error: ${error.message}`, { id: "processing" });
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  const showDownloadConfirmToast = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium text-black">Download images as ZIP?</p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                toast("Download cancelled");
              }}
              className="px-3 py-1 rounded border text-sm"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleDownloadConfirmed();
              }}
              className="px-3 py-1 rounded bg-[#034F75] text-white text-sm"
            >
              Yes, Download
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const handleDownloadConfirmed = async () => {
    const processedData = formData.beforeAfterData;

    if (!processedData || processedData.length === 0) {
      toast.error("No images to download");
      return;
    }

    toast.loading("Preparing ZIP...", { id: "zip" });

    try {
      const zip = new JSZip();
      const folder = zip.folder("Elite-Image-AI");

      for (let i = 0; i < processedData.length; i++) {
        const response = await fetch(processedData[i].processedImage);
        const blob = await response.blob();
        folder.file(`elite-image-${i + 1}.jpg`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });

      if (window.showSaveFilePicker) {
        try {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: "Elite-Image-AI-Project.zip",
            types: [
              {
                description: "ZIP Archive",
                accept: { "application/zip": [".zip"] },
              },
            ],
          });

          const writable = await fileHandle.createWritable();
          await writable.write(zipBlob);
          await writable.close();
        } catch {
          toast("Download cancelled", { id: "zip" });
          return;
        }
      } else {
        saveAs(zipBlob, "Elite-Image-AI-Project.zip");
      }

      toast.success("Download complete", { id: "zip" });
    } catch (err) {
      console.error(err);
      toast.error("Download failed", { id: "zip" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#034F75]"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8">
      <div className="w-full flex justify-start mb-4">
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
            Elite Image AI -{" "}
            {isViewMode ? "View" : isEditMode ? "Edit" : "Generate"} Mode
          </span>
        </div>
      </div>

      <div className="w-full mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-[20px] sm:text-[24px] lg:text-[40px] font-semibold text-black">
          {isViewMode
            ? "View Results"
            : isEditMode
            ? "Edit Project"
            : "Processing Complete"}
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
                        src={
                          formData.beforeAfterData?.[index]?.processedImage ||
                          img
                        }
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

      <div className="w-full max-w-full sm:max-w-[820px] flex flex-col items-center mt-6 sm:mt-8 gap-3 sm:gap-4">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full sm:w-auto">
          {!isViewMode && (
            <button
    onClick={() => {
      router.push(`/admin/edit-project?projectId=${projectId}`);
      
    }}
    className="flex items-center justify-center gap-2 border border-[#034F75] text-[12px] sm:text-[16px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-[#034F75] hover:text-white transition-colors flex-1 sm:flex-initial min-w-[120px]"
  >
    <TbEdit size={17} />
    Edit
  </button>
          )}

          <button
            onClick={() => alert("Share functionality coming soon!")}
            className="flex items-center justify-center gap-2 border border-[#034F75] text-[12px] sm:text-[16px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-[#034F75] hover:text-white transition-colors flex-1 sm:flex-initial min-w-[120px]"
          >
            <IoShareSocial size={17} />
            Share Link
          </button>
        </div>

        {/* {!isViewMode && (
          <button
            onClick={handleGenerate}
            disabled={formData.uploadedImages.length === 0 || isSaving}
            className={`w-full sm:w-[280px] flex items-center justify-center gap-2 text-[12px] sm:text-[16px] py-2.5 sm:py-3 rounded-lg transition-colors
              ${
                formData.uploadedImages.length > 0 && !isSaving
                  ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            <span>
              {isSaving
                ? isEditMode
                  ? "Updating..."
                  : "Saving..."
                : isEditMode
                ? "Update Project"
                : "Generate Image"}
            </span>
          </button>
        )} */}

        <button
          onClick={showDownloadConfirmToast}
          disabled={
            !formData.beforeAfterData ||
            (Array.isArray(formData.beforeAfterData) &&
              formData.beforeAfterData.length === 0)
          }
          className={`w-full sm:w-[280px] flex items-center justify-center gap-2 text-[12px] sm:text-[16px] py-2.5 sm:py-3 rounded-lg transition-colors
            ${
              formData.beforeAfterData && formData.beforeAfterData.length > 0
                ? "bg-[#034F75] text-white hover:bg-[#023d5c] cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          <PiDownload size={20} />
          <span>
            {formData.beforeAfterData && formData.beforeAfterData.length > 0
              ? `Download ${formData.beforeAfterData.length} Image(s)`
              : "Generate First"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Step4Page;
