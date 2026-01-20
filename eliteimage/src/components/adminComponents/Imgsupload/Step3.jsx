"use client";
import { useEffect, useState, useContext } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { STYLES_DATA } from "./featuresData";
import ProgressBar from "./ProgressBar";
import { AppContext } from "@/context/AppContext";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Step3 = ({ formData, setFormData, next, back, featureType }) => {
  const { token, saveGeneratedImage, user, saveDraft } = useContext(AppContext);
  const router = useRouter();

  // ✅ ADD THIS:
  useEffect(() => {
    if (!formData.featureType) {
      toast.error("Please select a feature first");
      router.push("/admin/dashboard");
    }
  }, [formData.featureType, router]);
  const styles = STYLES_DATA[featureType];

  const [selected, setSelected] = useState(
    formData.selectedStyle || styles[0].name,
  );
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save on style change
  useEffect(() => {
    if (selected) {
      const timeoutId = setTimeout(() => {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const existingDraftId = urlParams.get("draftId") || formData.draftId;

          saveDraft(
            {
              ...formData,
              selectedStyle: selected,
              draftId: existingDraftId,
            },
            "step3",
          );
        } catch (error) {
          console.error("Error saving draft:", error);
        }
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [selected]); // ✅ Remove formData and saveDraft from dependencies

  const handleGenerate = async () => {
    // ✅ STEP 1: Validation (instant - 0ms)
    if (!formData.uploadedImages || formData.uploadedImages.length === 0) {
      toast.error("Please upload at least one image first!");
      return;
    }

    if (!token) {
      toast.error("Please login to save images");
      return;
    }

    // ✅ STEP 2: Update local state immediately (instant UI update)
    setFormData((prev) => ({
      ...prev,
      selectedStyle: selected,
    }));

    // ✅ STEP 3: Show success toast INSTANTLY
    toast.success(`Processing ${formData.uploadedImages.length} image(s)...`, {
      id: "processing",
      duration: 2000,
    });

    // ✅ STEP 4: Navigate to next page IMMEDIATELY (no waiting!)
    next();

    // ✅ STEP 5: Process & save in BACKGROUND (async, non-blocking)
    setIsSaving(true);

    (async () => {
      try {
        const CLOUD_NAME = "dhtpqla2b";
        const UPLOAD_PRESET = "unsigned_preset";

        const uploadToCloudinary = async (imageSource, index) => {
          let imageBlob;

          // ✅ Handle different image source types
          if (
            typeof imageSource === "string" &&
            imageSource.startsWith("blob:")
          ) {
            // For blob URLs, get from localFiles array
            const localFile = formData.localFiles?.[index];
            if (localFile) {
              imageBlob = localFile;
            } else {
              // Fallback: fetch the blob
              const response = await fetch(imageSource);
              imageBlob = await response.blob();
            }
          } else if (
            typeof imageSource === "string" &&
            imageSource.startsWith("http")
          ) {
            // Already uploaded to Cloudinary - return as is
            return imageSource;
          } else if (
            typeof imageSource === "string" &&
            imageSource.startsWith("data:")
          ) {
            // Data URL
            const response = await fetch(imageSource);
            imageBlob = await response.blob();
          } else if (
            imageSource instanceof File ||
            imageSource instanceof Blob
          ) {
            // Direct file/blob
            imageBlob = imageSource;
          } else {
            throw new Error("Unsupported image format");
          }

          // Upload to Cloudinary
          const fd = new FormData();
          fd.append("file", imageBlob);
          fd.append("upload_preset", UPLOAD_PRESET);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            { method: "POST", body: fd },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              `Upload failed: ${errorData.error?.message || "Unknown error"}`,
            );
          }

          const data = await response.json();
          return data.secure_url;
        };

        const allProcessedData = [];

        // ✅ PARALLEL processing - all images at once
        const processingPromises = formData.uploadedImages.map(
          async (uploadedImage, i) => {
            try {
              // Upload original image
              const originalUrl = await uploadToCloudinary(uploadedImage, i);

              // ✅ For now, use same image as processed (simulate processing)
              // In real app, you'd call your AI processing API here
              const processedUrl = originalUrl; // or await processImage(originalUrl)

              return {
                originalImage: originalUrl,
                processedImage: processedUrl,
                processedAt: new Date().toISOString(),
                status: "completed",
                userId: user?._id || formData.userId,
                featureType: formData.featureType,
                selectedOptions: {
                  feature: formData.selectedFeature,
                  style: selected,
                },
              };
            } catch (error) {
              console.error(`Error processing image ${i + 1}:`, error);
              toast.error(`Failed to process image ${i + 1}`);
              return null;
            }
          },
        );

        const results = await Promise.all(processingPromises);

        // Filter out any failed uploads
        const successfulResults = results.filter((result) => result !== null);

        if (successfulResults.length === 0) {
          throw new Error("All images failed to process");
        }

        allProcessedData.push(...successfulResults);

        // Save to backend
        const backendPayload = {
          userid: user?._id || formData.userId,
          title: `${formData.featureType} - ${successfulResults.length} Images - ${new Date().toLocaleDateString()}`,
          description: `Project with ${successfulResults.length} image(s)`,
          featureType: formData.featureType,
          uploadedImages: allProcessedData.map((data) => data.originalImage),
          selectedFeature: formData.selectedFeature
            ? [formData.selectedFeature]
            : [],
          selectedStyle: [selected],
          beforeAfterData: allProcessedData,
          finalNotes: formData.finalNotes || "",
          image: allProcessedData[0].processedImage,
        };

        // Update state for Step4
        setFormData((prev) => ({
          ...prev,
          beforeAfterData: allProcessedData,
          selectedStyle: selected,
        }));

        await saveGeneratedImage(backendPayload, token);

        // Delete draft
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

        toast.success(
          `${successfulResults.length} image(s) saved successfully!`,
          {
            id: "processing",
          },
        );
      } catch (error) {
        console.error("❌ Error:", error);
        toast.error(`Error: ${error.message}`, { id: "processing" });
      } finally {
        setIsSaving(false);
      }
    })();
  };

  return (
    <div className="w-full min-h-screen bg-white mt-14 sm:mt-16 lg:mt-15">
      <div className="flex items-center gap-3 text-gray-700">
        {/* <div className="flex items-center gap-2">
          <button
            onClick={back}
            className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleGenerate}
            className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div> */}
        <span className="font-medium text-black text-[16px] sm:text-[18px] mb-6 sm:mb-8">
          Elite Image Ai
        </span>
      </div>

      <h2 className=" mb-4 sm:mb-5 lg:mb-6 text-[20px] sm:text-[24px] lg:text-[28px] font-semibold text-black">
        Edit Styles - {featureType}
      </h2>
      {formData.totalSteps > 0 && (
        <div className="mb-2 sm:mb-4 lg:mb-6 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
          {/* <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-12 lg:w-20 bg-[#CFE8F2]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-12 lg:w-20 bg-[#D3E7F0]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#034F75]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-12 lg:w-20 bg-[#034F75]" /> */}
          <ProgressBar currentStep={3} totalSteps={formData.totalSteps} />
        </div>
      )}

      <div className="mb-2 sm:mb-4 lg:mb-6 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {styles.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            onClick={() => setSelected(item.name)}
            className={`w-full rounded-xl sm:rounded-2xl cursor-pointer border-2 overflow-hidden transition-all hover:shadow-lg
             ${
               selected === item.name
                 ? "border-[#034F75] shadow-md"
                 : "border-gray-200"
             }`}
          >
            <Image
              src={item.img}
              alt={item.name}
              width={260}
              height={170}
              className="w-full h-36 sm:h-40 lg:h-44 object-cover"
              priority
            />
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white">
              <span className="text-[16px] sm:text-[18px] font-medium text-gray-800 truncate pr-2">
                {item.name}
              </span>
              <input
                type="checkbox"
                checked={selected === item.name}
                readOnly
                className="w-4 h-4 accent-[#034F75] cursor-pointer flex-shrink-0"
              />
            </div>
          </div>
        ))}
      </div>

      <div className=" flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
        {/* Back Button (Left) */}
        <button
          onClick={back}
          className="flex items-center gap-2 bg-gray-300 text-black text-[16px] sm:text-[18px] px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-400 transition-colors"
        >
          <ChevronRight size={17} className="rotate-180" />
          Back
        </button>

        {/* Generate Button (Right) */}
        <button
          onClick={handleGenerate}
          disabled={!selected || isSaving}
          className={`flex items-center gap-2 bg-[#034F75] text-white text-[16px] sm:text-[18px] px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-[#023d5c] transition-colors ${
            !selected || isSaving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSaving ? "Processing..." : "Generate Now"}
        </button>
      </div>
    </div>
  );
};

export default Step3;
