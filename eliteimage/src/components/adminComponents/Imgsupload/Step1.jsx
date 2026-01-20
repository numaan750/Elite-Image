"use client";
import React, { useContext, useState, useEffect } from "react";
import { Upload, ArrowRight, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import ProgressBar from "./ProgressBar";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CLOUD_NAME = "dhtpqla2b";
const UPLOAD_PRESET = "unsigned_preset";

const Step1 = ({ formData, setFormData, next }) => {
  const router = useRouter();

  const { token, saveGeneratedImage, saveDraft } = useContext(AppContext);
  const searchParams = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoadedMap, setImageLoadedMap] = useState({});

  // ✅ ADDED: Track loading images count
  const [loadingCount, setLoadingCount] = useState(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false); // ✅ ADD THIS LINE

  useEffect(() => {
    const realImages = formData.uploadedImages.filter(
      (img) => !img.startsWith("loading-"),
    );

    // ✅ FIX: Sirf basic conditions check karo
    if (
      realImages.length > 0 && // Images hai
      !uploadingImage && // Upload complete
      formData.featureType // Feature selected
    ) {
      const timeoutId = setTimeout(() => {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const existingDraftId = urlParams.get("draftId") || formData.draftId;

          console.log("💾 Saving draft with images:", realImages.length);

          const draftId = saveDraft(
            {
              ...formData,
              uploadedImages: realImages,
              draftId: existingDraftId,
            },
            "step1",
          );

          if (draftId && draftId !== formData.draftId) {
            setFormData((prev) => ({
              ...prev,
              draftId,
            }));
          }
        } catch (error) {
          console.error("Error saving draft:", error);
        }
      }, 2000); // ✅ 2 seconds (5000 se kam)

      return () => clearTimeout(timeoutId);
    }
  }, [
    formData.uploadedImages,
    formData.featureType,
    uploadingImage,
    saveDraft, // ✅ ADD: saveDraft dependency
  ]);

  const handleGenerateAndSave = async () => {
    // ✅ STEP 1: Validation (instant - 0ms)
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

    // ✅ STEP 2: Prepare data (instant - 5-10ms)
    const allProcessedData = [];
    const allUploadedImages = [];

    formData.uploadedImages.forEach((uploadedImage) => {
      const processedData = {
        originalImage: uploadedImage,
        processedImage: uploadedImage,
        processedAt: new Date().toISOString(),
        status: "completed",
        userId: formData.userId,
        featureType: formData.featureType,
      };
      allProcessedData.push(processedData);
      allUploadedImages.push(uploadedImage);
    });

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

    // ✅ STEP 3: Update local state immediately (instant UI update)
    setFormData((prev) => ({
      ...prev,
      beforeAfterData: allProcessedData,
    }));

    // ✅ STEP 4: Show success toast INSTANTLY
    toast.success(`Saving ${formData.uploadedImages.length} image(s)...`, {
      id: "saving",
      duration: 2000,
    });

    // ✅ STEP 5: Navigate to next page IMMEDIATELY (no waiting!)
    next();

    // ✅ STEP 6: Save to database in BACKGROUND (async, non-blocking)
    setIsSaving(true);

    (async () => {
      try {
        // Database save happens after user moved to next page
        if (formData.projectId) {
          await saveGeneratedImage(
            singlePayload,
            token,
            true,
            formData.projectId,
          );
        } else {
          await saveGeneratedImage([singlePayload], token);
        }

        // Background success notification
        toast.success("Project saved to database!", {
          id: "saving",
          duration: 2000,
        });

        // ✅ STEP 7: Delete draft after successful DB save
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
            }
          }

          localStorage.removeItem("currentDraft");
        } catch (error) {
          console.error("❌ Error deleting draft:", error);
        }
      } catch (error) {
        console.error("❌ Database save error:", error);
        toast.error(`Failed to save: ${error.message}`, {
          id: "saving",
          duration: 3000,
        });
      } finally {
        setIsSaving(false);
      }
    })();
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // ✅ STEP 1: Immediate validation (fast - 10ms)
    const validFiles = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name}: Only image files allowed`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: Image must be under 5MB`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploadingImage(true);

    // ✅ STEP 2: Show images INSTANTLY using local URLs (0ms delay)
    const localUrls = validFiles.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      uploadedImages: [...prev.uploadedImages, ...localUrls],
      localFiles: [...(prev.localFiles || []), ...validFiles], // Store actual files
    }));

    toast.success(`${validFiles.length} image(s) added!`);
    setUploadingImage(false);

    // ✅ STEP 3: Upload to Cloudinary in BACKGROUND (non-blocking)
    (async () => {
      const CLOUD_NAME = "dhtpqla2b";
      const UPLOAD_PRESET = "unsigned_preset";

      // ✅ Upload ALL images parallelly
      const uploadPromises = validFiles.map(async (file, idx) => {
        const uploadForm = new FormData();
        uploadForm.append("file", file);
        uploadForm.append("upload_preset", UPLOAD_PRESET);

        try {
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            { method: "POST", body: uploadForm },
          );
          const data = await res.json();

          const optimizedUrl = data.secure_url.replace(
            "/upload/",
            "/upload/f_auto,q_auto,w_800,h_600,c_limit/",
          );

          return { success: true, url: optimizedUrl, localUrl: localUrls[idx] };
        } catch (err) {
          console.error(`Upload failed for ${file.name}:`, err);
          return { success: false, localUrl: localUrls[idx] };
        }
      });

      // ✅ Wait for ALL uploads to complete
      const results = await Promise.allSettled(uploadPromises);

      // ✅ Replace ALL local URLs with Cloudinary URLs AT ONCE
      setFormData((prev) => {
        const newImages = [...prev.uploadedImages];

        results.forEach((result) => {
          if (result.status === "fulfilled" && result.value.success) {
            const { localUrl, url } = result.value;
            const localIdx = prev.uploadedImages.indexOf(localUrl);
            if (localIdx !== -1) {
              newImages[localIdx] = url;
            }
          }
        });

        return { ...prev, uploadedImages: newImages };
      });

      // ✅ Mark all images as loaded
      setAllImagesLoaded(true);

      // Clean up local URLs
      localUrls.forEach((url) => URL.revokeObjectURL(url));
    })();

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
        (_, idx) => idx !== indexToRemove,
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
    (img) => !img.startsWith("loading-"),
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

              {formData.uploadedImages.map((img, idx) => {
                const isLocalUrl = img.startsWith("blob:");
                const uniqueKey = `${img}-${idx}`;

                return (
                  <div
                    key={uniqueKey}
                    className="relative rounded-lg sm:rounded-xl overflow-hidden border border-[#6FB6D6]"
                  >
                    {/* ✅ No shimmer for local URLs - they load instantly */}
                    {!isLocalUrl && !imageLoadedMap[img] && (
                      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#d3d3d3] via-[#d5d5d5] to-[#d7d7d7] bg-[length:200%_100%] animate-shimmer" />
                    )}

                    <Image
                      src={img}
                      alt={`Uploaded ${idx + 1}`}
                      width={400}
                      height={350}
                      quality={isLocalUrl ? 100 : 60} // Higher quality for local preview
                      loading="eager"
                      priority={!isLocalUrl}
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className={`w-full h-32 sm:h-36 lg:h-40 object-contain transition-opacity duration-300 ${
                        isLocalUrl || imageLoadedMap[img]
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      onLoad={() => {
                        if (!isLocalUrl) {
                          setImageLoadedMap((prev) => ({
                            ...prev,
                            [img]: true,
                          }));
                        }
                      }}
                    />

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
          animation: shimmer 0.8s ease-in-out infinite; // ✅ Fast shimmer effect
        }
      `}</style>
    </div>
  );
};

export default Step1;
