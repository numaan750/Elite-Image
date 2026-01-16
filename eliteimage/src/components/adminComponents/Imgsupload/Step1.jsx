"use client";
import React, { useContext, useState } from "react";
import { Upload, ArrowRight, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import ProgressBar from "./ProgressBar";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CLOUD_NAME = "dhtpqla2b";
const UPLOAD_PRESET = "unsigned_preset";

const Step1 = ({ formData, setFormData, next }) => {
  const router = useRouter();

  const { token, saveGeneratedImage } = useContext(AppContext);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoadedMap, setImageLoadedMap] = useState({});

  // ✅ ADDED: Track loading images count
  const [loadingCount, setLoadingCount] = useState(0);

  const handleGenerateAndSave = async () => {
    if (!formData.featureType) {
      toast.error("Please select a feature first");
      router.push("/admin/dashboard");
      return;
    }

    if (!formData.uploadedImages || formData.uploadedImages.length === 0) {
      toast.error("Please upload at least one image first!");
      return;
    }

    if (!token) {
      toast.error("Please login to save images");
      return;
    }

    setIsSaving(true);
    toast.loading(`Processing ${formData.uploadedImages.length} image(s)...`, {
      id: "processing",
    });

    try {
      const allProcessedData = [];
      const allUploadedImages = [];

      for (let i = 0; i < formData.uploadedImages.length; i++) {
        const uploadedImage = formData.uploadedImages[i];

        console.log(`📤 [${i + 1}] Processing ${formData.featureType}...`);

        const processedImageUrl = uploadedImage;

        const processedData = {
          originalImage: uploadedImage,
          processedImage: processedImageUrl,
          processedAt: new Date().toISOString(),
          status: "completed",
          userId: formData.userId,
          featureType: formData.featureType,
        };
        allProcessedData.push(processedData);
        allUploadedImages.push(uploadedImage);
      }

      const singlePayload = {
        userid: formData.userId,
        title: `${formData.featureType} - ${new Date().toLocaleDateString()}`,
        description:
          formData.finalNotes ||
          `${formData.featureType} applied to ${formData.uploadedImages.length} image(s)`,
        featureType: formData.featureType,
        uploadedImages: allUploadedImages,
        selectedFeature: [],
        selectedStyle: [],
        beforeAfterData: allProcessedData,
        finalNotes: formData.finalNotes || "",
        image: allUploadedImages[0],
      };

      setFormData((prev) => ({
        ...prev,
        beforeAfterData: allProcessedData,
      }));

      if (formData.projectId) {
        await saveGeneratedImage(
          singlePayload,
          token,
          true,
          formData.projectId
        );
        toast.success("Project updated successfully!", { id: "processing" });
      } else {
        await saveGeneratedImage([singlePayload], token);
        toast.success(
          `${formData.uploadedImages.length} image(s) saved in 1 project!`,
          {
            id: "processing",
          }
        );
      }
      next();
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(`Error: ${error.message}`, { id: "processing" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setLoadingCount(files.length);
    setUploadingImage(true);

    const loadingPlaceholders = files.map(
      (_, idx) => `loading-${Date.now()}-${idx}`
    );

    setFormData((prev) => ({
      ...prev,
      uploadedImages: [...prev.uploadedImages, ...loadingPlaceholders],
    }));

    const uploadedUrls = [];
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name}: Only image files allowed`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: Image must be under 5MB`);
        continue;
      }

      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("upload_preset", UPLOAD_PRESET);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: uploadForm,
          }
        );

        const data = await res.json();

        const optimizedUrl = data.secure_url.replace(
          "/upload/",
          "/upload/f_auto,q_auto,w_1200/"
        );

        // ✅ **YE NEW CODE HAI - IMAGE KO PRELOAD KAREIN**
        await new Promise((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = optimizedUrl;
        });

        uploadedUrls.push(optimizedUrl);
        successCount++;
      } catch (err) {
        toast.error(`${file.name}: Upload failed`);
      }
    }

    setFormData((prev) => {
      const withoutPlaceholders = prev.uploadedImages.filter(
        (img) => !img.startsWith("loading-")
      );
      return {
        ...prev,
        uploadedImages: [...withoutPlaceholders, ...uploadedUrls],
        lastUploadedAt: new Date().toISOString(),
      };
    });

    setLoadingCount(0);
    setUploadingImage(false);

    if (successCount > 0) {
      toast.success(`${successCount} image(s) uploaded successfully!`);
    }

    e.target.value = "";
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const fakeEvent = { target: { files: Array.from(files) } };
      await handleFileUpload(fakeEvent);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      uploadedImages: prev.uploadedImages.filter(
        (_, idx) => idx !== indexToRemove
      ),
    }));
  };

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    if (formData.uploadedImages.length === 0) {
      toast.error("Please upload at least one image first!");
      return;
    }

    if (!formData.featureType) {
      router.push("/admin/uploadImage");
      return;
    }

    next();
  };

  const isSpecialFeature =
    formData.featureType === "Straighten" ||
    formData.featureType === "Watermark Remove";

  // ✅ ADDED: Check if there are any real images (not loading placeholders)
  const realImages = formData.uploadedImages.filter(
    (img) => !img.startsWith("loading-")
  );
  const hasImages = realImages.length > 0 || loadingCount > 0;

  return (
    <div className="bg-white mt-14 sm:mt-16 lg:mt-15">
      <div className="flex items-center text-gray-700">
        <span className="font-medium text-black text-[16px] sm:text-[20px] mb-6 sm:mb-8 ">
          Elite Image Ai
        </span>
      </div>

      <h2 className="mb-2 sm:mb-4 lg:mb-6 text-[18px] sm:text-[20px] lg:text-[28px] font-semibold text-black">
        Upload Images
        {formData.featureType && (
          <span className="text-black font-medium">
            {" "}
            – {formData.featureType}
          </span>
        )}
      </h2>

      {formData.totalSteps > 0 && (
        <div className="mb-2 sm:mb-4 lg:mb-6 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
          <ProgressBar currentStep={1} totalSteps={formData.totalSteps} />
        </div>
      )}

      <div className="mb-2 sm:mb-4 lg:mb-6 rounded-2xl border border-[#6FB6D6] bg-[#D3E7F0] p-3 sm:p-4 min-h-[250px] sm:min-h-[300px] lg:min-h-[400px]">
        <div
          className={`relative flex flex-col ${
            !hasImages
              ? "items-center justify-center"
              : "items-start justify-start"
          } rounded-xl border-2 border-dashed border-[#034F75] px-3 sm:px-4 lg:px-6 ${
            !hasImages ? "py-8 sm:py-10 lg:py-16" : "py-3 sm:py-4"
          } text-center cursor-pointer min-h-[250px] sm:min-h-[300px] lg:min-h-[350px] ${
            isDragging ? "bg-blue-50 border-solid" : ""
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() =>
            !uploadingImage && document.getElementById("file-input").click()
          }
        >
          {!hasImages ? (
            <>
              <Upload
                size={32}
                className="text-[#034F75] sm:w-10 sm:h-10 lg:w-[50px] lg:h-[50px]"
              />
              <p className="mt-3 sm:mt-4 text-[12px] sm:text-[20px] lg:text-[20px] font-medium text-[#034F75] px-2">
                Drag and drop your images here
              </p>
              <span className="my-2 sm:my-3 text-[12px] sm:text-[16px] lg:text-[20px] text-[#034F75]">
                Or
              </span>
              <label className="rounded-lg bg-[#034F75] px-4 sm:px-5 lg:px-6 py-2 text-white text-[16px] sm:text-[18px] cursor-pointer hover:bg-[#023d5c] transition-colors">
                {uploadingImage ? "Uploading..." : "Browse File"}
              </label>
              <p className="mt-3 sm:mt-4 text-[12px] sm:text-[20px] text-[#034F75] px-2">
                Supports: JPG, PNG, HEIC • Max 5MB per file
              </p>
            </>
          ) : (
            <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* ✅ ADDED: Show skeleton loaders */}
              {loadingCount > 0 &&
                Array.from({ length: loadingCount }).map((_, idx) => (
                  <div
                    key={`skeleton-${idx}`}
                    className="relative rounded-lg sm:rounded-xl overflow-hidden border border-[#6FB6D6] animate-none"
                  >
                    <div className="w-full h-32 sm:h-36 lg:h-40 bg-gradient-to-r from-[#d3d3d3] via-[#d5d5d5] to-[#d7d7d7] bg-[length:200%_100%] animate-shimmer" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-[#034F75] text-sm">Loading...</div>
                    </div>
                  </div>
                ))}

              {/* ✅ CHANGED: Show real images after loading */}
              {realImages.map((img, idx) => {
                const loaded = imageLoadedMap[img];

                return (
                  <div
                    key={img}
                    className="relative rounded-lg sm:rounded-xl overflow-hidden border border-[#6FB6D6]"
                  >
                    {/* SHIMMER OVERLAY */}
                    {!loaded && (
                      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#d3d3d3] via-[#d5d5d5] to-[#d7d7d7] bg-[length:200%_100%] animate-shimmer" />
                    )}

                    {/* IMAGE */}
                    <Image
                      src={img}
                      alt={`Uploaded ${idx + 1}`}
                      width={400}
                      height={350}
                      quality={75}
                      priority={idx < 4} // ✅ First 4 images ko priority dein
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className={`w-full h-32 sm:h-36 lg:h-40 object-contain transition-opacity duration-300 ${
                        loaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoadingComplete={() =>
                        setImageLoadedMap((prev) => ({ ...prev, [img]: true }))
                      }
                    />

                    {/* REMOVE BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-black/50 cursor-pointer text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={uploadingImage}
          />
        </div>
      </div>

      <div className="flex justify-between items-center gap-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 sm:px-6 py-2 text-[14px] sm:text-[18px] text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={17} className="rotate-180" />
          Back
        </button>

        {isSpecialFeature ? (
          <button
            onClick={handleGenerateAndSave}
            disabled={realImages.length === 0 || isSaving || uploadingImage}
            className={`flex items-center gap-2 rounded-lg px-5 sm:px-6 py-2 text-[12px] sm:text-[20px] text-white transition-colors ${
              realImages.length === 0 || isSaving || uploadingImage
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#034F75]"
            }`}
          >
            {isSaving ? "Saving..." : "Generate Now "}
            <ArrowRight size={17} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        ) : (
          <button
            onClick={handleContinue}
            disabled={realImages.length === 0 || uploadingImage}
            className={`flex items-center gap-2 rounded-lg bg-[#034F75] px-5 sm:px-6 py-2 text-[16px] sm:text-[18px] text-white hover:bg-[#023d5c] transition-colors ${
              realImages.length === 0 || uploadingImage
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Continue
            <ArrowRight size={17} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 200%;
          }
          100% {
            background-position: -200% -200%;
          }
        }

        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Step1;
