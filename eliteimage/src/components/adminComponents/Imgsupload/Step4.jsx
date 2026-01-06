"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TbEdit } from "react-icons/tb";
import { IoShareSocial } from "react-icons/io5";
import { PiDownload } from "react-icons/pi";

const Step4 = ({ formData, setFormData, next, back }) => {
  // const handleGenerate = async () => {
  // // ✅ STEP 1: User ke uploaded images fetch karo
  // const uploadedImage = formData.uploadedImages[0]; // Pehli image use karo

  // if (!uploadedImage) {
  //   alert("Please upload an image first!");
  //   return;
  // }

  //   // ✅ CHANGE 2: beforeAfterData mein save karo
  //   setFormData((prev) => ({
  //     ...prev,
  //     beforeAfterData: processedData,
  //   }));

  //   console.log("Data saved to beforeAfterData:", processedData);
  //   alert("Image processed and saved! You can now edit if needed.");
  // };

  const handleGenerate = async () => {
    const uploadedImage = formData.uploadedImages[0];

    if (!uploadedImage) {
      alert("Please upload an image first!");
      return;
    }

    console.log("🔄 Processing started...");
    console.log("User ID:", formData.userId);
    console.log("Feature Type:", formData.featureType);
    console.log("Selected Feature:", formData.selectedFeature);
    console.log("Selected Style:", formData.selectedStyle);
    console.log("Original Image:", uploadedImage);

    try {
      const processedImageUrl = uploadedImage;

      const processedData = {
        originalImage: uploadedImage,
        processedImage: processedImageUrl,
        processedAt: new Date().toISOString(),
        status: "completed",
        userId: formData.userId,
        featureType: formData.featureType,
        selectedOptions: {
          feature: formData.selectedFeature,
          style: formData.selectedStyle,
        },
      };

      setFormData((prev) => ({
        ...prev,
        beforeAfterData: processedData,
      }));

      console.log("✅ Data saved to beforeAfterData:", processedData);
      alert("Image processed successfully!");

      next();
    } catch (error) {
      console.error("❌ Processing failed:", error);
      alert("Processing failed. Please try again.");
    }
  };
  const handleDownload = () => {
    console.log("Downloading image...");
    alert("Download functionality will be implemented here!");
  };

  const handleShare = () => {
    console.log("Sharing link...");
    alert("Share functionality will be implemented here!");
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8">
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

          <span className="font-medium text-black text-sm sm:text-base">
            Elite Image Ai
          </span>
        </div>
      </div>

      <div className="w-full mb-4 sm:mb-6 lg:mb-8 mt-4 sm:mt-6 lg:mt-10">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-black">
          Processing Complete
        </h2>
      </div>

      <div className="border border-[#034F75] rounded-xl p-3 sm:p-4 lg:p-5 w-full bg-[#D3E7F0]">
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1">
          Before / After Comparison
        </h3>
        <p className="text-xs sm:text-sm lg:text-base text-black mb-3 sm:mb-4">
          Drag the slider to compare original and enhanced versions
        </p>

        <div
          className={`w-full ${
            formData.uploadedImages.length === 1
              ? "flex"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          }`}
        >
          {formData.uploadedImages.map((img, idx) => (
            <div
              key={idx}
              className={`relative rounded-lg sm:rounded-xl overflow-hidden border border-[#6FB6D6] ${
                formData.uploadedImages.length === 1
                  ? "w-full aspect-video"
                  : "w-full aspect-video"
              }`}
            >
              <Image
                src={img}
                alt={`Uploaded ${idx}`}
                width={800}
                height={500}
                className="w-full h-full object-cover bg-white"
                priority
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-full sm:max-w-[820px] flex flex-col items-center mt-6 sm:mt-8 gap-3 sm:gap-4">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={next}
            className="flex items-center justify-center gap-2 border border-[#034F75] text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-[#034F75] hover:text-white transition-colors flex-1 sm:flex-initial min-w-[120px]"
          >
            <TbEdit size={16} className="sm:w-[18px] sm:h-[18px]" />
            Edit
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 border border-[#034F75] text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-[#034F75] hover:text-white transition-colors flex-1 sm:flex-initial min-w-[120px]"
          >
            <IoShareSocial size={16} className="sm:w-[18px] sm:h-[18px]" />
            Share Link
          </button>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full sm:w-[220px] flex items-center justify-center gap-2 bg-[#034F75] text-white text-sm sm:text-base py-2.5 sm:py-3 rounded-lg hover:bg-[#023d5c] transition-colors"
        >
          <PiDownload size={18} className="sm:w-5 sm:h-5" />
          <span>Generate</span>
        </button>
      </div>
    </div>
  );
};

export default Step4;
