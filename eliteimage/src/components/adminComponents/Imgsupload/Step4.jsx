"use client";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { TbEdit } from "react-icons/tb";
import { IoShareSocial } from "react-icons/io5";
import { PiDownload } from "react-icons/pi";
import { AppContext } from "@/context/AppContext";
import toast, { Toaster } from "react-hot-toast";
// import { useSearchParams } from "next/navigation"; // ✅ ADD THIS
import JSZip from "jszip";
import { saveAs } from "file-saver";

const CLOUD_NAME = "dhtpqla2b";
const UPLOAD_PRESET = "unsigned_preset";

const uploadToCloudinary = async (imageUrl) => {
  try {
    const formData = new FormData();

    let imageBlob;
    if (typeof imageUrl === "string" && imageUrl.startsWith("http")) {
      const response = await fetch(imageUrl);
      imageBlob = await response.blob();
    } else if (typeof imageUrl === "string" && imageUrl.startsWith("data:")) {
      const response = await fetch(imageUrl);
      imageBlob = await response.blob();
    } else {
      imageBlob = imageUrl;
    }

    formData.append("file", imageBlob);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("cloud_name", CLOUD_NAME);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Cloudinary upload failed");
    }

    const data = await response.json();
    console.log("✅ Cloudinary Upload Success:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    throw error;
  }
};

const processImage = async (imageUrl, options) => {
  try {
    console.log("🎨 Simulating image processing...");
    console.log("Options:", options);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("✅ Processing simulated successfully!");
    return imageUrl;
  } catch (error) {
    console.error("❌ Image Processing Error:", error);
    throw error;
  }
};

const downloadImagesAsZip = async (formData) => {
  try {
    const processedData = formData.beforeAfterData;

    // Check if data exists
    if (
      !processedData ||
      (Array.isArray(processedData) && processedData.length === 0)
    ) {
      toast.error("No images to download");
      return;
    }

    toast.loading("Preparing download...", { id: "zip" });

    // Handle both array and single object
    const dataArray = Array.isArray(processedData)
      ? processedData
      : [processedData];

    const zip = new JSZip();
    const folder = zip.folder("Elite-Image-AI");

    // Add images to zip
    for (let i = 0; i < dataArray.length; i++) {
      const imageUrl = dataArray[i].processedImage;

      if (!imageUrl) {
        console.warn(`Image ${i + 1} has no processedImage URL`);
        continue;
      }

      try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image ${i + 1}`);

        const blob = await response.blob();
        folder.file(`elite-image-${i + 1}.jpg`, blob);
      } catch (error) {
        console.error(`Error downloading image ${i + 1}:`, error);
        toast.error(`Failed to add image ${i + 1} to zip`);
      }
    }

    // Generate zip blob
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // ✅ NEW: Check if File System Access API is supported
    if (window.showSaveFilePicker) {
      try {
        // Open save dialog with location selection
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: "Elite-Image-AI-Project.zip",
          types: [
            {
              description: "ZIP Archive",
              accept: { "application/zip": [".zip"] },
            },
          ],
        });

        // Write the file
        const writableStream = await fileHandle.createWritable();
        await writableStream.write(zipBlob);
        await writableStream.close();

        toast.dismiss("zip");
toast.success(`${dataArray.length} image(s) downloaded!`);
      } catch (error) {
        // User cancelled the dialog
        if (error.name === "AbortError") {
          toast.error("Download cancelled", { id: "zip" });
        } else {
          console.error("Save dialog error:", error);
          // Fallback to default download
          saveAs(zipBlob, "Elite-Image-AI-Project.zip");
          toast.dismiss("zip");
toast.success(`${dataArray.length} image(s) downloaded!`);
        }
      }
    } else {
      // ✅ Fallback for browsers that don't support File System Access API
      saveAs(zipBlob, "Elite-Image-AI-Project.zip");
      toast.success(
        `${dataArray.length} image(s) downloaded! (Default location used)`,
        { id: "zip" }
      );
    }
  } catch (error) {
    console.error("Zip download error:", error);
    toast.dismiss("zip");
toast.error("Failed to create zip file");
  }
};

const downloadImage = async (imageUrl, filename) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
};

const Step4 = ({ formData, setFormData, next, back }) => {
  // const { token, saveGeneratedImage, getProjectById } = useContext(AppContext);
  // const searchParams = useSearchParams(); // ✅ ADD
  // const [sliderPositions, setSliderPositions] = useState({});
  // const [isDragging, setIsDragging] = useState(null);
  // const [isSaving, setIsSaving] = useState(false);
  // const [isEditMode, setIsEditMode] = useState(false); // ✅ ADD
  // const [projectId, setProjectId] = useState(null); // ✅ ADD
  // const [isViewMode, setIsViewMode] = useState(false); // ✅ ADD
  const { token, saveGeneratedImage } = useContext(AppContext);
  const [sliderPositions, setSliderPositions] = useState({});
  const [isDragging, setIsDragging] = useState(null);

  useEffect(() => {
    const initialPositions = {};
    formData.uploadedImages.forEach((_, index) => {
      initialPositions[index] = 50;
    });
    setSliderPositions(initialPositions);
  }, [formData.uploadedImages.length]);

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

  // ✅ ADD THIS COMPLETE useEffect
  // useEffect(() => {
  //   const loadProjectData = async () => {
  //     const mode = searchParams.get("mode");
  //     const pid = searchParams.get("projectId");

  //     if (mode === "view" && pid) {
  //       setIsViewMode(true);
  //       setProjectId(pid);
  //       try {
  //         const project = await getProjectById(pid);

  //         // Pre-fill formData with existing project data
  //         setFormData({
  //           ...formData,
  //           uploadedImages: project.uploadedImages || [],
  //           featureType: project.featureType || "",
  //           selectedFeature: project.selectedFeature?.[0] || "",
  //           selectedStyle: project.selectedStyle?.[0] || "",
  //           beforeAfterData: project.beforeAfterData || [],
  //           finalNotes: project.finalNotes || "",
  //           userId: project.userid || user?._id,
  //         });

  //         toast.success("Project loaded successfully!");
  //       } catch (error) {
  //         toast.error("Failed to load project");
  //         console.error(error);
  //       }
  //     } else if (mode === "edit" && pid) {
  //       setIsEditMode(true);
  //       setProjectId(pid);
  //     }
  //   };

  //   if (searchParams.get("projectId")) {
  //     loadProjectData();
  //   }
  // }, [searchParams]);

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

  //       console.log(`📤 [${i + 1}] Uploading original image...`);
  //       const originalCloudinaryUrl = await uploadToCloudinary(uploadedImage);

  //       console.log(`🎨 [${i + 1}] Processing image...`);
  //       const processedImageUrl = await processImage(originalCloudinaryUrl, {
  //         userId: formData.userId,
  //         featureType: formData.featureType,
  //         selectedFeature: formData.selectedFeature,
  //         selectedStyle: formData.selectedStyle,
  //       });

  //       console.log(`📤 [${i + 1}] Uploading processed image...`);
  //       const processedCloudinaryUrl = await uploadToCloudinary(
  //         processedImageUrl
  //       );

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
  //         title: `${formData.featureType} - Image ${
  //           i + 1
  //         } - ${new Date().toLocaleDateString()}`,
  //         description: formData.finalNotes || `Generated image ${i + 1}`,
  //         featureType: formData.featureType,
  //         uploadedImages: [originalCloudinaryUrl],
  //         selectedFeature: formData.selectedFeature
  //           ? [formData.selectedFeature]
  //           : [],
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

  //     // ✅ CHANGE: Check if update or save
  //     if (isEditMode && projectId) {
  //       // Update existing project
  //       await saveGeneratedImage(allBackendPayloads[0], token, true, projectId);
  //       toast.success("Project updated successfully!", { id: "processing" });
  //     } else {
  //       // Save new projects
  //       await saveGeneratedImage(allBackendPayloads, token);
  //       toast.success(
  //         `${formData.uploadedImages.length} image(s) processed and saved!`,
  //         { id: "processing" }
  //       );
  //     }

  //     // for (let i = 0; i < allProcessedData.length; i++) {
  //     //   await downloadImage(
  //     //     allProcessedData[i].processedImage,
  //     //     `elite-image-ai-${i + 1}.jpg`
  //     //   );
  //     // }

  //     next();
  //   } catch (error) {
  //     console.error("❌ Error:", error);
  //     toast.error(`Error: ${error.message}`, { id: "processing" });
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
  const handleDownload = () => {
    const processedData = formData.beforeAfterData;

    if (
      !processedData ||
      (Array.isArray(processedData) && processedData.length === 0)
    ) {
      toast.error("No processed images found! Please click 'Generate' first.");
      return;
    }

    if (Array.isArray(processedData)) {
      console.log(`⬇️ Downloading ${processedData.length} images...`);
      processedData.forEach((data, index) => {
        downloadImage(data.processedImage, `elite-image-ai-${index + 1}.jpg`);
      });
      toast.success(`Downloaded ${processedData.length} images!`);
    } else {
      console.log("⬇️ Downloading from:", processedData.processedImage);
      downloadImage(processedData.processedImage, "elite-image-ai.jpg");
      toast.success("Downloaded 1 image!");
    }
  };
  const handleShare = () => {
    console.log("Sharing link...");
    alert("Share functionality will be implemented here!");
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8">
      {/* <Toaster position="top-right" reverseOrder={false} /> */}

      <div className="w-full flex justify-start">
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-7 text-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={back}
              className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
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
                          Array.isArray(formData.beforeAfterData)
                            ? formData.beforeAfterData[index]?.processedImage
                            : formData.beforeAfterData?.processedImage || img
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
          <button
            onClick={next}
            className="flex items-center justify-center gap-2 border border-[#034F75] text-[12px] sm:text-[16px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-[#034F75] hover:text-white transition-colors flex-1 sm:flex-initial min-w-[120px]"
          >
            <TbEdit size={17} className="sm:w-[18px] sm:h-[18px]" />
            Edit
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 border border-[#034F75] text-[12px] sm:text-[16px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-[#034F75] hover:text-white transition-colors flex-1 sm:flex-initial min-w-[120px]"
          >
            <IoShareSocial size={17} className="sm:w-[18px] sm:h-[18px]" />
            Share Link
          </button>

          {/* Back Button
          <button
            onClick={back} // ya router.back() agar browser history chahiye
            className="flex items-center justify-center gap-2 border border-gray-400 text-[12px] sm:text-[16px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-gray-200 transition-colors flex-1 sm:flex-initial min-w-[120px]"
          >
           Back
          </button> */}
        </div>

        {/* Generate Button - ADD THIS IF NOT EXISTS */}
        {/* <button
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
        </button> */}

        <button
          onClick={() => downloadImagesAsZip(formData)}
          disabled={
            !formData.beforeAfterData ||
            (Array.isArray(formData.beforeAfterData) &&
              formData.beforeAfterData.length === 0) ||
            (!Array.isArray(formData.beforeAfterData) &&
              !formData.beforeAfterData.processedImage)
          }
          className={`w-full sm:w-[280px] flex items-center justify-center gap-2 text-[12px] sm:text-[16px] py-2.5 sm:py-3 rounded-lg transition-colors
    ${
      formData.beforeAfterData &&
      ((Array.isArray(formData.beforeAfterData) &&
        formData.beforeAfterData.length > 0) ||
        (!Array.isArray(formData.beforeAfterData) &&
          formData.beforeAfterData.processedImage))
        ? "bg-[#034F75] text-white hover:bg-[#023d5c] cursor-pointer"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
        >
          <PiDownload size={20} className="sm:w-5 sm:h-5" />
          <span>
            {formData.beforeAfterData &&
            ((Array.isArray(formData.beforeAfterData) &&
              formData.beforeAfterData.length > 0) ||
              (!Array.isArray(formData.beforeAfterData) &&
                formData.beforeAfterData.processedImage))
              ? `Download ${
                  Array.isArray(formData.beforeAfterData)
                    ? formData.beforeAfterData.length
                    : 1
                } Image(s)`
              : "No Images to Download"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Step4;
