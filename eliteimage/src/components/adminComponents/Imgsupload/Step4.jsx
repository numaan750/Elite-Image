"use client";
import React, { useState, useEffect } from "react"; // ADD useState & useEffect
import Image from "next/image";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react"; // ADD MoveHorizontal for slider handle
import { TbEdit } from "react-icons/tb";
import { IoShareSocial } from "react-icons/io5";
import { PiDownload } from "react-icons/pi";

const Step4 = ({ formData, setFormData, next, back }) => {
  const [sliderPositions, setSliderPositions] = useState({});
  const [isDragging, setIsDragging] = useState(null);

  // Initialize slider positions for each image
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
                    {/* Before Image (Full) */}
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

                    {/* After Image (Clipped) */}
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

                    {/* Slider Line */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
                      style={{ left: `${sliderPositions[index] || 50}%` }}
                    >
                      {/* Slider Handle */}
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

                    {/* Labels */}
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
        {/* Top Row: Edit / Share / Back */}
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

        {/* Download Button */}
        <button
          onClick={handleGenerate}
          className="w-full sm:w-[280px] flex items-center justify-center gap-2 bg-[#034F75] text-white text-[12px] sm:text-[16px] py-2.5 sm:py-3 rounded-lg hover:bg-[#023d5c] transition-colors"
        >
          <PiDownload size={20} className="sm:w-5 sm:h-5" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export default Step4;
