"use client";
import { useEffect, useState, useContext } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { STYLES_DATA } from "./featuresData";
import ProgressBar from "./ProgressBar";
import { AppContext } from "@/context/AppContext";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Step3 = ({
  formData,
  setFormData,
  next,
  back,
  featureType,
  currentProgressStep,
}) => {
  const {
    token,
    saveGeneratedImage,
    user,
    saveDraft,
    deductUserCredits,
    processImageWithAI,
  } = useContext(AppContext);
  const router = useRouter();

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
  }, [selected]);

  const handleGenerate = async () => {
    const imageCount = formData.uploadedImages.length;
    const creditsNeeded = imageCount * 5;
    const canProceed = await deductUserCredits(creditsNeeded);
    if (!canProceed) return;

    if (!formData.uploadedImages || formData.uploadedImages.length === 0) {
      toast.error("Please upload at least one image first!");
      return;
    }
    if (!token) {
      toast.error("Please login to save images");
      return;
    }

    setIsSaving(true);

    try {
      const CLOUD_NAME = "drh7q62eh";
      const UPLOAD_PRESET = "unsigned_preset";

      const uploadToCloudinary = async (imageSource, index) => {
        if (typeof imageSource === "string" && imageSource.startsWith("http")) {
          return imageSource;
        }
        let imageBlob;
        if (
          typeof imageSource === "string" &&
          imageSource.startsWith("blob:")
        ) {
          const localFile = formData.localFiles?.[index];
          imageBlob =
            localFile || (await fetch(imageSource).then((r) => r.blob()));
        } else if (
          typeof imageSource === "string" &&
          imageSource.startsWith("data:")
        ) {
          imageBlob = await fetch(imageSource).then((r) => r.blob());
        } else if (imageSource instanceof File || imageSource instanceof Blob) {
          imageBlob = imageSource;
        } else {
          throw new Error("Unsupported image format");
        }
        const fd = new FormData();
        fd.append("file", imageBlob);
        fd.append("upload_preset", UPLOAD_PRESET);
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: fd },
        );
        if (!response.ok) throw new Error(`Upload failed`);
        const data = await response.json();
        if (!data.secure_url) throw new Error("No secure_url");
        return data.secure_url;
      };

      const allProcessedData = [];
      for (let i = 0; i < formData.uploadedImages.length; i++) {
        const uploadedImage = formData.uploadedImages[i];

        toast.loading(
          `Processing image ${i + 1} of ${formData.uploadedImages.length}...`,
          { id: `ai-${i}` },
        );

        const originalUrl = await uploadToCloudinary(uploadedImage, i);

        let processedUrl;
        try {
          processedUrl = await processImageWithAI(
            originalUrl,
            formData.featureType,
            formData.selectedFeature || formData.selectedFeatures?.[0] || "",
            formData.featureType === "Day to Dusk"
              ? formData.selectedSky
              : selected,
            selected,
            formData.finalNotes,
            formData.selectedSky || "",
          );
          toast.success(`Image ${i + 1} processed!`, { id: `ai-${i}` });
        } catch (aiError) {
          toast.error(`AI failed for image ${i + 1}`, { id: `ai-${i}` });
          processedUrl = originalUrl;
        }

        allProcessedData.push({
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
        });
      }
      setFormData((prev) => ({
        ...prev,
        selectedStyle: selected,
        beforeAfterData: allProcessedData,
      }));

      const backendPayload = {
        userid: user?._id || formData.userId,
        title: `${formData.featureType} - ${allProcessedData.length} Images - ${new Date().toLocaleDateString()}`,
        description: `Project with ${allProcessedData.length} image(s)`,
        featureType: formData.featureType,
        uploadedImages: allProcessedData.map((d) => d.originalImage),
        selectedFeature: Array.isArray(formData.selectedFeature)
          ? formData.selectedFeature.flat().filter((s) => typeof s === "string")
          : formData.selectedFeature
            ? [formData.selectedFeature]
            : Array.isArray(formData.selectedFeatures)
              ? formData.selectedFeatures
                  .flat()
                  .filter((s) => typeof s === "string")
              : [],
        selectedStyle: [selected],
        beforeAfterData: allProcessedData,
        finalNotes: formData.finalNotes || "",
        image: allProcessedData[0].processedImage,
      };
      const savedProject = await saveGeneratedImage(backendPayload, token);
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

      toast.success(`${allProcessedData.length} image(s) saved successfully!`, {
        id: "processing",
      });
      next();
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(`Error: ${error.message}`, { id: "processing" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white mt-10 sm:mt-8 lg:mt-3">
      <h2 className=" mb-4 sm:mb-5 lg:mb-6 text-[20px] sm:text-[24px] lg:text-[28px] font-semibold text-black">
        Edit Styles - {featureType}
      </h2>
      {formData.totalSteps > 0 && (
        <div className="mb-2 sm:mb-4 lg:mb-6 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
          <ProgressBar
            currentStep={currentProgressStep}
            totalSteps={formData.totalSteps}
          />
        </div>
      )}

      <div className="mb-2 sm:mb-4 lg:mb-6 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {styles.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            onClick={() => {
              if (!isSaving) setSelected(item.name);
            }}
            className={`w-full rounded-xl sm:rounded-2xl border-2 overflow-hidden transition-all
             ${
               isSaving
                 ? "cursor-not-allowed opacity-60"
                 : "cursor-pointer hover:shadow-lg"
             }
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
        <button
          onClick={back}
          disabled={isSaving}
          className={`flex items-center gap-2 rounded-lg border border-gray-300 px-4 sm:px-6 py-2 text-[14px] sm:text-[18px] text-gray-700 hover:bg-gray-100 transition-colors${isSaving ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
        >
          <ChevronRight size={17} className="rotate-180" />
          Back
        </button>

        <button
          onClick={handleGenerate}
          disabled={!selected || isSaving}
          className={`flex items-center justify-center gap-2 bg-[#034F75] text-white text-[16px] sm:text-[18px] px-5 sm:px-7 py-2 rounded-lg hover:bg-[#023d5c] transition-colors min-w-[160px] ${
            !selected || isSaving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSaving ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            "Generate Now"
          )}
        </button>
      </div>
    </div>
  );
};

export default Step3;
