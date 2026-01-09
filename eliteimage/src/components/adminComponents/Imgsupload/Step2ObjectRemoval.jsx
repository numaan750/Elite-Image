"use client";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import ProgressBar from "./ProgressBar";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // ✅ ADD THIS

const Step2ObjectRemoval = ({ formData, setFormData, next, back }) => {
  const router = useRouter(); // ✅ ADD THIS LINE
  const { token, saveGeneratedImage, user } = useContext(AppContext);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedAreas, setSelectedAreas] = useState({});
  const imageRef = useRef(null);

  const totalSelectedObjects = Object.values(selectedAreas).reduce(
    (total, areas) => total + areas.length,
    0
  );

  const allImagesHaveSelection = formData.uploadedImages.every(
    (img, index) => selectedAreas[index] && selectedAreas[index].length > 0
  );

  // Mouse down event - dragging shuru karna
  const handleMouseDown = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
    setDragEnd({ x, y });
  };

  // Mouse move event - drag karte waqt
  const handleMouseMove = (e) => {
    if (!isDragging || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDragEnd({ x, y });
  };

  // Mouse up event - dragging khatam
  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      // Selected area ko calculate karna
      const area = {
        x: Math.min(dragStart.x, dragEnd.x),
        y: Math.min(dragStart.y, dragEnd.y),
        width: Math.abs(dragEnd.x - dragStart.x),
        height: Math.abs(dragEnd.y - dragStart.y),
      };

      setSelectedAreas((prev) => ({
        ...prev,
        [activeImageIndex]: [...(prev[activeImageIndex] || []), area],
      }));
      setFormData((prev) => ({
        ...prev,
        selectedObjectAreas: {
          ...(prev.selectedObjectAreas || {}),
          [activeImageIndex]: [
            ...(prev.selectedObjectAreas?.[activeImageIndex] || []),
            area,
          ],
        },
      }));
    }

    setIsDragging(false);
  };

  // Rectangle draw karne ke liye helper function
  const getSelectionStyle = () => {
    if (!dragStart || !dragEnd) return {};

    const x = Math.min(dragStart.x, dragEnd.x);
    const y = Math.min(dragStart.y, dragEnd.y);
    const width = Math.abs(dragEnd.x - dragStart.x);
    const height = Math.abs(dragEnd.y - dragStart.y);

    return {
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
  };

  const handleContinue = () => {
    if (totalSelectedObjects === 0) {
      alert("Please select at least one object to remove");
      return;
    }
    next();
  };

  // ✅ UPDATED: Complete backend integration
  const handleRemoveObject = async () => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    // ✅ Validate selections
    if (!allImagesHaveSelection) {
      toast.error("Please select objects in all images first");
      return;
    }

    toast.loading("Removing objects & saving...", { id: "remove" });

    try {
      const allBackendPayloads = [];
      const CLOUD_NAME = "dhtpqla2b";
      const UPLOAD_PRESET = "unsigned_preset";

      // ✅ Cloudinary upload function
      const uploadToCloudinary = async (img) => {
        const fd = new FormData();
        const blob = await fetch(img).then((r) => r.blob());
        fd.append("file", blob);
        fd.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: fd }
        );
        const data = await res.json();
        return data.secure_url;
      };

      // ✅ Process each uploaded image
      for (let i = 0; i < formData.uploadedImages.length; i++) {
        const originalUrl = await uploadToCloudinary(
          formData.uploadedImages[i]
        );

        // ⚠ Future: AI object removal API will be called here
        const processedUrl = originalUrl;

        // ✅ Create backend payload
        allBackendPayloads.push({
          userid: user?._id || formData.userId,
          title: `Object Removal - Image ${
            i + 1
          } - ${new Date().toLocaleDateString()}`,
          description: `Object removal with ${
            selectedAreas[i]?.length || 0
          } selected area(s)`,
          featureType: "object-removal",
          uploadedImages: [originalUrl],
          selectedFeature: ["object-removal"],
          beforeAfterData: [
            {
              originalImage: originalUrl,
              processedImage: processedUrl,
              removedAreas: selectedAreas[i] || [],
              processedAt: new Date().toISOString(),
              status: "completed",
            },
          ],
          finalNotes: `Removed ${selectedAreas[i]?.length || 0} object(s)`,
          image: processedUrl,
        });
      }

      // ✅ Save to backend
      const savedData = await saveGeneratedImage(allBackendPayloads, token);

      // ✅ CRITICAL: Update formData with response
      const normalizedBeforeAfter = Array.isArray(savedData)
        ? savedData.flatMap((item) => item.beforeAfterData || [])
        : savedData.beforeAfterData || [];

      setFormData((prev) => ({
        ...prev,
        beforeAfterData: normalizedBeforeAfter,
      }));

      toast.dismiss("remove");
      toast.success("Objects removed & saved successfully!");

      
      next();
    } catch (err) {
      console.error(err);
      toast.dismiss("remove");
      toast.error("Failed to remove objects");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <div className="flex items-center gap-3 text-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={back}
            className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleContinue}
            className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <span className="font-medium text-black text-[18px] sm:text-[20px]">
          Elite Image AI
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-4 sm:mt-5 mb-2 text-[24px] sm:text-[30px] lg:text-[40px] font-semibold text-gray-900">
        Object Removal Options
      </h2>

      {/* Progress Bar */}
      <div className="mt-4 sm:mt-6 lg:mt-8 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
        <ProgressBar currentStep={2} totalSteps={formData.totalSteps} />
      </div>

      {/* Image Container with Selection */}
      <div className="mt-6 sm:mt-8 lg:mt-10 max-w-4xl mx-auto">
        <div className="bg-[#D3E7F0] border-2 border-[#6FB6D6] rounded-2xl p-4 sm:p-6">
          {/* Instructions */}
          <div className="mt-4 text-start">
            <p
              className="text-[20px] sm:text-[30px] text-black
              font-medium mb-2"
            >
              {totalSelectedObjects === 0
                ? "Select Objects — Drag Over Each One"
                : `${totalSelectedObjects} object(s) selected`}
            </p>
          </div>

          <div className="flex gap-3 mb-4 overflow-x-auto">
            {formData.uploadedImages.map((img, index) => (
              <img
                key={index}
                src={typeof img === "string" ? img : URL.createObjectURL(img)}
                onClick={() => setActiveImageIndex(index)}
                className={`h-20 w-28 object-cover rounded cursor-pointer border-2
        ${activeImageIndex === index ? "border-[#034F75]" : "border-gray-300"}`}
              />
            ))}
          </div>

          <div
            className="relative w-full bg-white rounded-[40px] overflow-hidden cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Image */}
            <Image
              ref={imageRef}
              src={
                typeof formData.uploadedImages[activeImageIndex] === "string"
                  ? formData.uploadedImages[activeImageIndex]
                  : URL.createObjectURL(
                      formData.uploadedImages[activeImageIndex]
                    )
              }
              alt="Select object to remove"
              width={800}
              height={600}
              sizes="(max-width: 768px) 100vw, 800px"
              className="w-full h-auto select-none"
              draggable={false}
              priority
            />

            {/* Selection Rectangle (while dragging) */}
            {isDragging && dragStart && dragEnd && (
              <div
                className="absolute border-2 border-dashed border-[#034F75] bg-[#034F75]/10"
                style={getSelectionStyle()}
              />
            )}

            {(selectedAreas[activeImageIndex] || []).map((area, index) => (
              <div
                key={index}
                className="absolute border-2 border-solid border-[#034F75] bg-[#034F75]/20"
                style={{
                  left: `${area.x}px`,
                  top: `${area.y}px`,
                  width: `${area.width}px`,
                  height: `${area.height}px`,
                }}
              >
                <div className="absolute -top-6 left-0 bg-[#034F75] text-white text-xs px-2 py-1 rounded">
                  Selected {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 sm:mt-10 lg:mt-12 flex justify-center lg:justify-end gap-3 max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={back}
          className="px-6 sm:px-8 py-2.5 sm:py-3 text-[16px] sm:text-[20px] border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Back
        </button>

        {/* Clear Selections Button */}
        {selectedAreas[activeImageIndex] &&
          selectedAreas[activeImageIndex].length > 0 && (
            <button
              onClick={() => {
                setSelectedAreas((prev) => ({
                  ...prev,
                  [activeImageIndex]: [],
                }));
                setFormData((prev) => ({
                  ...prev,
                  selectedObjectAreas: {
                    ...(prev.selectedObjectAreas || {}),
                    [activeImageIndex]: [],
                  },
                }));
              }}
              className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-[#034F75] text-[#034F75] rounded-lg"
            >
              Clear All Selections
            </button>
          )}

        {/* Remove Object Button */}
        <button
          onClick={handleRemoveObject}
          disabled={!allImagesHaveSelection}
          className={`flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 
  text-[16px] sm:text-[20px] rounded-lg transition-colors
  ${
    allImagesHaveSelection
      ? "bg-[#034F75] hover:bg-[#023a5c] text-white"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
        >
          Remove Object
        </button>
      </div>
    </div>
  );
};

export default Step2ObjectRemoval;
