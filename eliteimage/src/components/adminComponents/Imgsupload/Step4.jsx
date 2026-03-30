"use client";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { TbEdit } from "react-icons/tb";
import { IoShareSocial } from "react-icons/io5";
import { PiDownload } from "react-icons/pi";
import { AppContext } from "@/context/AppContext";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "next/navigation";

import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";

const CLOUD_NAME = "drh7q62eh";
const UPLOAD_PRESET = "unsigned_preset";

const uploadToCloudinary = async (imageUrl) => {
  try {
    console.log("🚀 Uploading to Cloudinary...");

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

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Upload failed:", errorText);
      throw new Error(`Cloudinary upload failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Upload success:", data.secure_url);

    if (!data.secure_url) {
      throw new Error("No secure_url in response");
    }

    return data.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary error:", error);
    toast.error(`Upload failed: ${error.message}`);
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
    if (formData.featureType === "Sky Replacement" && formData.projectId) {
      const backendPayload = {
        beforeAfterData: formData.beforeAfterData,
        uploadedImages: formData.uploadedImages,
        selectedFeature: formData.selectedFeatures,
        featureType: "Sky Replacement",
        finalNotes: formData.finalNotes || "",
      };

      toast.success("Sky Replacement images saved!", { id: "processing" });

      if (formData.uploadedImages.length === 1) {
        toast.loading("Downloading single image...", { id: "download" });

        try {
          const imageUrl = formData.uploadedImages[0];
          const response = await fetch(imageUrl);
          const blob = await response.blob();

          if (window.showSaveFilePicker) {
            let fileHandle;
            try {
              fileHandle = await window.showSaveFilePicker({
                suggestedName: "Elite-Image-AI-Project.zip",
                types: [
                  {
                    description: "ZIP Archive",
                    accept: { "application/zip": [".zip"] },
                  },
                ],
              });
            } catch (error) {
              if (error.name === "AbortError") {
                toast.error("Download cancelled", { id: "zip" });
                return;
              } else {
                console.error("Save dialog error:", error);
                fileHandle = null;
              }
            }

            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();

            toast.success("Image downloaded!", { id: "download" });
          } else {
            saveAs(blob, "sky-replacement-image.jpg");
            toast.success("Image downloaded!", { id: "download" });
          }
        } catch (error) {
          if (error.name === "AbortError") {
            toast.error("Download cancelled", { id: "download" });
          } else {
            toast.error("Download failed!", { id: "download" });
          }
        }

        return;
      }
      toast.loading("Select download location...", { id: "download-init" });

      let fileHandle;
      try {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: "Elite-Image-AI-Sky-Replacement.zip",
          types: [
            {
              description: "ZIP Archive",
              accept: { "application/zip": [".zip"] },
            },
          ],
        });
      } catch (error) {
        if (error.name === "AbortError") {
          toast.error("Download cancelled", { id: "download-init" });
          return;
        }
        if (!window.showSaveFilePicker) {
          toast.loading("Creating ZIP file...", { id: "download-init" });

          const zip = new JSZip();
          const folder = zip.folder("Elite-Image-AI-Sky-Replacement");

          for (let i = 0; i < formData.uploadedImages.length; i++) {
            const imageUrl = formData.uploadedImages[i];
            try {
              const response = await fetch(imageUrl);
              if (!response.ok)
                throw new Error(`Failed to fetch image ${i + 1}`);
              const blob = await response.blob();
              folder.file(`sky-original-${i + 1}.jpg`, blob);
            } catch (error) {
              console.error(`Error downloading image ${i + 1}:`, error);
            }
          }

          const zipBlob = await zip.generateAsync({ type: "blob" });
          saveAs(zipBlob, "Sky-Replacement-Images.zip");
          toast.success(
            `${formData.uploadedImages.length} images downloaded!`,
            { id: "download-init" },
          );
          return;
        }
        throw error;
      }

      toast.loading("Creating ZIP file...", { id: "download-init" });
      const zip = new JSZip();
      const folder = zip.folder("Elite-Image-AI-Sky-Replacement");

      for (let i = 0; i < formData.uploadedImages.length; i++) {
        const imageUrl = formData.uploadedImages[i];

        toast.loading(
          `Adding image ${i + 1} of ${formData.uploadedImages.length}...`,
          { id: "download-init" },
        );

        try {
          const response = await fetch(imageUrl);
          if (!response.ok) throw new Error(`Failed to fetch image ${i + 1}`);
          const blob = await response.blob();
          folder.file(`sky-original-${i + 1}.jpg`, blob);
        } catch (error) {
          console.error(`Error downloading image ${i + 1}:`, error);
        }
      }

      toast.loading("Finalizing download...", { id: "download-init" });
      const zipBlob = await zip.generateAsync({ type: "blob" });

      const writableStream = await fileHandle.createWritable();
      await writableStream.write(zipBlob);
      await writableStream.close();

      toast.success(
        `${formData.uploadedImages.length} images downloaded successfully!`,
        { id: "download-init" },
      );
      return;
    }
    const processedData = formData.beforeAfterData;

    if (
      !processedData ||
      (Array.isArray(processedData) && processedData.length === 0)
    ) {
      toast.error("No images to download");
      return;
    }
    const dataArray = Array.isArray(processedData)
      ? processedData
      : [processedData];

    if (dataArray.length === 1) {
      toast.loading("Downloading image...", { id: "download" });

      try {
        const imageUrl = dataArray[0].processedImage;
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        if (window.showSaveFilePicker) {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: "elite-image-ai.jpg",
            types: [
              {
                description: "Image",
                accept: { "image/jpeg": [".jpg"], "image/png": [".png"] },
              },
            ],
          });

          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();

          toast.success("Image downloaded!", { id: "download" });
        } else {
          saveAs(blob, "elite-image-ai.jpg");
          toast.success("Image downloaded!", { id: "download" });
        }
      } catch (error) {
        if (error.name === "AbortError") {
          toast.error("Download cancelled", { id: "download" });
        } else {
          toast.error("Download failed!", { id: "download" });
        }
      }

      return;
    }

    toast.loading("Select download location...", { id: "download-init" });

    let fileHandle;
    try {
      fileHandle = await window.showSaveFilePicker({
        suggestedName: "Elite-Image-AI-Project.zip",
        types: [
          {
            description: "ZIP Archive",
            accept: { "application/zip": [".zip"] },
          },
        ],
      });
    } catch (error) {
      if (error.name === "AbortError") {
        toast.error("Download cancelled", { id: "download-init" });
        return;
      }
      if (!window.showSaveFilePicker) {
        toast.loading("Creating ZIP file...", { id: "download-init" });

        const zip = new JSZip();
        const folder = zip.folder("Elite-Image-AI");

        for (let i = 0; i < dataArray.length; i++) {
          const imageUrl = dataArray[i].processedImage;
          try {
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error(`Failed to fetch image ${i + 1}`);
            const blob = await response.blob();
            folder.file(`elite-image-${i + 1}.jpg`, blob);
          } catch (error) {
            console.error(`Error downloading image ${i + 1}:`, error);
          }
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "Elite-Image-AI-Project.zip");
        toast.success(`${dataArray.length} images downloaded!`, {
          id: "download-init",
        });
        return;
      }
      throw error;
    }

    toast.loading("Creating ZIP file...", { id: "download-init" });
    const zip = new JSZip();
    const folder = zip.folder("Elite-Image-AI");

    for (let i = 0; i < dataArray.length; i++) {
      const imageUrl = dataArray[i].processedImage;

      toast.loading(`Adding image ${i + 1} of ${dataArray.length}...`, {
        id: "download-init",
      });

      try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image ${i + 1}`);
        const blob = await response.blob();
        folder.file(`elite-image-${i + 1}.jpg`, blob);
      } catch (error) {
        console.error(`Error downloading image ${i + 1}:`, error);
      }
    }

    toast.loading("Finalizing download...", { id: "download-init" });
    const zipBlob = await zip.generateAsync({ type: "blob" });

    const writableStream = await fileHandle.createWritable();
    await writableStream.write(zipBlob);
    await writableStream.close();

    toast.success(`${dataArray.length} images downloaded successfully!`, {
      id: "download-init",
    });
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
  const { token, saveGeneratedImage } = useContext(AppContext);
  const [sliderPositions, setSliderPositions] = useState({});
  const [isDragging, setIsDragging] = useState(null);
  const router = useRouter();
  const { saveDraft } = useContext(AppContext);
  const searchParams = useSearchParams();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!formData.featureType) {
        toast.error("Please select a feature first");
        router.push("/admin/dashboard");
      }
    }, 300); // 300ms wait karo
    return () => clearTimeout(timer);
  }, [formData.featureType, router]);

  useEffect(() => {
    if (typeof window !== "undefined" && formData.beforeAfterData) {
      const dataArray = Array.isArray(formData.beforeAfterData)
        ? formData.beforeAfterData
        : [formData.beforeAfterData];

      dataArray.forEach((data) => {
        if (data.processedImage) {
          const img = window.Image ? new window.Image() : null;
          if (img) {
            img.src = data.processedImage;
          }
        }
      });
    }
  }, [formData.beforeAfterData]);

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

  useEffect(() => {
    if (
      formData.beforeAfterData &&
      ((Array.isArray(formData.beforeAfterData) &&
        formData.beforeAfterData.length > 0) ||
        formData.beforeAfterData.processedImage)
    ) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const existingDraftId = urlParams.get("draftId") || formData.draftId;

        saveDraft(
          {
            ...formData,
            draftId: existingDraftId,
          },
          "step4",
        );
      } catch (error) {
        console.error("Error saving draft:", error);
      }
    }
  }, [formData.beforeAfterData]);

  useEffect(() => {
    const removeDraftFromList = () => {
      try {
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
            console.log("✅ Draft removed from list on Step 4");
          }
        }
      } catch (error) {
        console.error("Error removing draft:", error);
      }
    };

    removeDraftFromList();
  }, []);
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

  const imagesToShow =
    formData.featureType === "HDR"
      ? [
          {
            originalImage: formData.uploadedImages?.[0],
            processedImage: formData.beforeAfterData?.[0]?.processedImage,
          },
        ]
      : formData.uploadedImages.map((img, index) => ({
          originalImage: img,
          processedImage: Array.isArray(formData.beforeAfterData)
            ? formData.beforeAfterData[index]?.processedImage
            : formData.beforeAfterData?.processedImage,
        }));

  const handleShare = async () => {
    const shareUrl =
      formData.beforeAfterData?.[0]?.processedImage ||
      formData.uploadedImages?.[0] ||
      "";
    const processedData =
      formData.beforeAfterData && formData.beforeAfterData.length > 0
        ? formData.beforeAfterData
        : formData.uploadedImages.map((img) => ({ processedImage: img }));
    if (processedData.length <= 1) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Elite Image AI",
            text: "Check out my AI enhanced image!",
            url: shareUrl,
          });
        } catch (err) {
          if (err.name !== "AbortError") toast.error("Share failed");
        }
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
      return;
    }
    try {
      toast.loading("Preparing images...", { id: "share" });

      const files = [];
      for (let i = 0; i < processedData.length; i++) {
        const response = await fetch(processedData[i].processedImage);
        const blob = await response.blob();
        const file = new File([blob], `elite-image-${i + 1}.jpg`, {
          type: "image/jpeg",
        });
        files.push(file);
      }

      toast.dismiss("share");

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files })
      ) {
        await navigator.share({
          title: "Elite Image AI",
          text: "Check out my AI enhanced images!",
          files: files,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success(
          "Link copied! (File sharing not supported on this device)",
        );
      }
    } catch (err) {
      toast.dismiss("share");
      if (err.name !== "AbortError") toast.error("Share failed");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center mt-10 sm:mt-8 lg:mt-3">
      <div className="w-full mb-4 sm:mb-5 lg:mb-6">
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

      <div className="border border-[#034F75] rounded-xl p-3 sm:p-4 lg:p-5 w-full bg-[#D3E7F0]  mb-4 sm:mb-5 lg:mb-6">
        <h3 className="text-[18px] sm:text-[24px] lg:text-[24px] font-semibold text-black mb-1">
          Before / After Comparison
        </h3>
        <p className="text-[12px] sm:text-[16px] lg:text-[20px] text-black mb-3 sm:mb-4">
          Drag the slider to compare original and enhanced versions
        </p>

        <div className="relative w-full rounded-xl overflow-hidden flex items-center justify-center">
          <div
            className={`w-full ${
              imagesToShow.length === 1
                ? "flex flex-col gap-4 sm:gap-6"
                : "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
            }`}
          >
            {imagesToShow.map((img, index) => (
              <div
                key={index}
                className="border border-[#6FB6D6] rounded-lg sm:rounded-xl p-3 sm:p-4 bg-[#d3e7f0]"
              >
                <p className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-black">
                  Image {index + 1}
                </p>

                <div className="flex flex-col gap-3 sm:gap-4">
                  <div
                    className="relative w-full h-[220px] sm:h-[300px] lg:h-[400px] bg-gray-100 rounded-lg overflow-hidden cursor-ew-resize select-none"
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
                        src={(() => {
                          if (formData.featureType === "HDR") {
                            return (
                              formData.beforeAfterData?.[0]?.processedImage ||
                              img.processedImage
                            );
                          }
                          if (
                            Array.isArray(formData.beforeAfterData) &&
                            formData.beforeAfterData[index]?.processedImage
                          ) {
                            return formData.beforeAfterData[index]
                              .processedImage;
                          } else if (formData.beforeAfterData?.processedImage) {
                            return formData.beforeAfterData.processedImage;
                          }
                          return img.processedImage || img.originalImage;
                        })()}
                        alt={`After ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-contain"
                        priority
                      />
                    </div>

                    {formData.featureType !== "HDR" && (
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath: `inset(0 ${
                            100 - (sliderPositions[index] || 50)
                          }% 0 0)`,
                        }}
                      >
                        {(() => {
                          if (!img) return null;
                          return (
                            <Image
                              src={
                                (Array.isArray(formData.beforeAfterData)
                                  ? formData.beforeAfterData[index]
                                      ?.originalImage
                                  : formData.beforeAfterData?.originalImage) ||
                                img.originalImage
                              }
                              alt={`Before ${index + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 800px"
                              className="object-contain"
                              priority
                            />
                          );
                        })()}
                      </div>
                    )}

                    {formData.featureType !== "HDR" && (
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
                          <MoveHorizontal
                            size={20}
                            className="text-[#034F75]"
                          />
                        </div>
                      </div>
                    )}

                    {formData.featureType !== "HDR" && (
                      <>
                        <div className="absolute top-2 left-2 bg-[#034F75] text-white text-[10px] sm-text-[16px] px-3 py-1.5 rounded z-20">
                          Before
                        </div>
                        <div className="absolute top-2 right-2 bg-[#034F75] text-white text-[10px] sm-text-[14px] px-3 py-1.5 rounded z-20">
                          After
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-full sm:max-w-[820px] flex flex-col items-center gap-3 sm:gap-4">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={next}
            className="flex items-center justify-center gap-2 border border-[#034F75] text-[16px] sm:text-[18px] px-4 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-[#034F75] hover:text-white transition-colors flex-1 sm:flex-initial min-w-[120px]"
          >
            <TbEdit size={17} className="sm:w-[18px] sm:h-[18px]" />
            Edit
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 border border-[#034F75] text-[16px] sm:text-[18px] px-4 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-[#034F75] hover:text-white transition-colors flex-1 sm:flex-initial min-w-[120px]"
          >
            <IoShareSocial size={17} className="sm:w-[18px] sm:h-[18px]" />
            Share Link
          </button>
        </div>

        <button
          onClick={() => downloadImagesAsZip(formData)}
          disabled={
            !formData.beforeAfterData ||
            (Array.isArray(formData.beforeAfterData) &&
              formData.beforeAfterData.length === 0)
          }
          className={`w-full sm:w-[280px] flex items-center justify-center gap-2 text-[16px] sm:text-[18px] py-2.5 sm:py-3 rounded-lg transition-colors
            ${
              formData.beforeAfterData &&
              ((Array.isArray(formData.beforeAfterData) &&
                formData.beforeAfterData.length > 0) ||
                formData.beforeAfterData.processedImage)
                ? "bg-[#034F75] text-white hover:bg-[#023d5c] cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          <PiDownload size={20} className="sm:w-5 sm:h-5" />
          <span>
            {formData.beforeAfterData &&
            ((Array.isArray(formData.beforeAfterData) &&
              formData.beforeAfterData.length > 0) ||
              formData.beforeAfterData.processedImage)
              ? "Download Now"
              : "Processing..."}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Step4;
