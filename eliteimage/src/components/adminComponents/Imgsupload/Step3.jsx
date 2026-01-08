"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { STYLES_DATA } from "./featuresData";
import ProgressBar from "./ProgressBar";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import toast, { Toaster } from "react-hot-toast";

const Step3 = ({ formData, setFormData, next, back, featureType }) => {
  const { token, saveGeneratedImage, user } = useContext(AppContext); // ← ADD THIS LINE
  const styles = STYLES_DATA[featureType];

  const [selected, setSelected] = useState(
    formData.selectedStyle || styles[0].name
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    if (!formData.uploadedImages || formData.uploadedImages.length === 0) {
      toast.error("Please upload at least one image first!");
      return;
    }

    if (!token) {
      toast.error("Please login to save images");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      selectedStyle: selected,
    }));

    setIsSaving(true);
    toast.loading(`Processing ${formData.uploadedImages.length} image(s)...`, {
      id: "processing",
    });

    try {
      const allProcessedData = [];
      const allBackendPayloads = [];

      const CLOUD_NAME = "dhtpqla2b";
      const UPLOAD_PRESET = "unsigned_preset";

      const uploadToCloudinary = async (imageUrl) => {
        const formData = new FormData();
        let imageBlob;

        if (typeof imageUrl === "string" && imageUrl.startsWith("http")) {
          const response = await fetch(imageUrl);
          imageBlob = await response.blob();
        } else if (
          typeof imageUrl === "string" &&
          imageUrl.startsWith("data:")
        ) {
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
          { method: "POST", body: formData }
        );

        if (!response.ok) throw new Error("Cloudinary upload failed");
        const data = await response.json();
        return data.secure_url;
      };

      for (let i = 0; i < formData.uploadedImages.length; i++) {
        const uploadedImage = formData.uploadedImages[i];

        console.log(`📤 [${i + 1}] Uploading original image...`);
        const originalCloudinaryUrl = await uploadToCloudinary(uploadedImage);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        const processedCloudinaryUrl = await uploadToCloudinary(uploadedImage);

        const processedData = {
          originalImage: originalCloudinaryUrl,
          processedImage: processedCloudinaryUrl,
          processedAt: new Date().toISOString(),
          status: "completed",
          userId: user?._id || formData.userId,
          featureType: formData.featureType,
          selectedOptions: {
            feature: formData.selectedFeature,
            style: selected,
          },
        };
        allProcessedData.push(processedData);

        const backendPayload = {
          userid: user?._id || formData.userId,
          title: `${formData.featureType} - Image ${
            i + 1
          } - ${new Date().toLocaleDateString()}`,
          description: formData.finalNotes || `Generated image ${i + 1}`,
          featureType: formData.featureType,
          uploadedImages: [originalCloudinaryUrl],
          selectedFeature: formData.selectedFeature
            ? [formData.selectedFeature]
            : [],
          selectedStyle: [selected],
          beforeAfterData: [processedData],
          finalNotes: formData.finalNotes || "",
          image: processedCloudinaryUrl,
        };
        allBackendPayloads.push(backendPayload);
      }

      setFormData((prev) => ({
        ...prev,
        beforeAfterData: allProcessedData,
        selectedStyle: selected,
      }));

      await saveGeneratedImage(allBackendPayloads, token);

      toast.success(
        `${formData.uploadedImages.length} image(s) processed and saved!`,
        { id: "processing" }
      );

      next();
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(`Error: ${error.message}`, { id: "processing" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-10">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex items-center gap-3 text-gray-700">
        <div className="flex items-center gap-2">
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
        </div>
        <span className="font-medium text-black text-[16px] sm:text-[20px]">
          Elite Image Ai
        </span>
      </div>

      <h2 className="mt-4 sm:mt-6 lg:mt-9 mb-4 sm:mb-5 lg:mb-6 text-[20px] sm:text-[24px] lg:text-[40px] font-semibold text-black">
        Edit Styles - {featureType}
      </h2>

      <div className="mt-4 sm:mt-6 lg:mt-8 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
        {/* <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-12 lg:w-20 bg-[#CFE8F2]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-12 lg:w-20 bg-[#D3E7F0]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#034F75]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-12 lg:w-20 bg-[#034F75]" /> */}
        <ProgressBar currentStep={3} totalSteps={formData.totalSteps} />
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
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
              <span className="text-[15px] sm:text-[19.05px] font-medium text-gray-800 truncate pr-2">
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

      <div className="mt-8 sm:mt-12 lg:mt-16 flex justify-center lg:justify-end gap-4">
        {/* Back Button */}
        <button
          onClick={back} // ya router.back() agar browser history chahiye
          className="flex items-center gap-2 bg-gray-300 text-black text-[16px] sm:text-[20px] px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Back
        </button>

        {/* Generate Now Button */}
        <button
          onClick={handleGenerate}
          disabled={!selected || isSaving}
          className={`flex items-center gap-2 bg-[#034F75] text-white text-[16px] sm:text-[20px] px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-[#023d5c] transition-colors ${
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
