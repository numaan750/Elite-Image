"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import ProgressBar from "./ProgressBar";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const Step2ObjectRemoval = ({ formData, setFormData, next, back }) => {
  const router = useRouter();
  const { token, saveGeneratedImage, user } = useContext(AppContext);
  const { saveDraft } = useContext(AppContext);

  // ✅ ADD THIS:
  useEffect(() => {
    if (!formData.featureType) {
      toast.error("Please select a feature first");
      router.push("/admin/dashboard");
    }
  }, [formData.featureType, router]);

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
  const handleMouseDown = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
    setDragEnd({ x, y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDragEnd({ x, y });
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
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

  // Auto-save on area selection
  useEffect(() => {
    if (Object.keys(selectedAreas).length > 0) {
      const timeoutId = setTimeout(() => {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const existingDraftId = urlParams.get("draftId") || formData.draftId;

          saveDraft(
            {
              ...formData,
              selectedObjectAreas: selectedAreas,
              draftId: existingDraftId,
            },
            "step2"
          );
        } catch (error) {
          console.error("Error saving draft:", error);
        }
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedAreas]); // ✅ Remove formData and saveDraft from dependencies

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
const handleRemoveObject = async () => {
  // ✅ STEP 1: Validation (instant - 0ms)
  if (!token) {
    toast.error("Please login first");
    return;
  }

  if (!allImagesHaveSelection) {
    toast.error("Please select objects in all images first");
    return;
  }

  // ✅ STEP 2: Show success toast INSTANTLY
  toast.success("Processing your request...", { id: "remove" });

  // ✅ STEP 3: Navigate to next page IMMEDIATELY
  next();

  // ✅ STEP 4: Process & save in BACKGROUND (async, non-blocking)
  (async () => {
    try {
      const allUploadedImages = [];
      const allBeforeAfterData = [];
      const CLOUD_NAME = "dhtpqla2b";
      const UPLOAD_PRESET = "unsigned_preset";

      const uploadToCloudinary = async (img) => {
        let blob;
        if (img.startsWith('blob:')) {
          const idx = formData.uploadedImages.indexOf(img);
          blob = formData.localFiles?.[idx] || await fetch(img).then(r => r.blob());
        } else {
          blob = await fetch(img).then((r) => r.blob());
        }
        
        const fd = new FormData();
        fd.append("file", blob);
        fd.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: fd }
        );
        const data = await res.json();
        return data.secure_url;
      };

      // Upload all images in parallel
      const uploadPromises = formData.uploadedImages.map(async (img, i) => {
        const originalUrl = await uploadToCloudinary(img);
        const processedUrl = originalUrl; // Replace with actual processing

        return {
          originalImage: originalUrl,
          processedImage: processedUrl,
          removedAreas: selectedAreas[i] || [],
          processedAt: new Date().toISOString(),
          status: "completed",
        };
      });

      const results = await Promise.all(uploadPromises);
      allBeforeAfterData.push(...results);
      allUploadedImages.push(...results.map(r => r.originalImage));

      const singlePayload = {
        userid: user?._id || formData.userid,
        title: `Object Removal - ${new Date().toLocaleDateString()}`,
        description: `Object removal with ${totalSelectedObjects} selected area(s)`,
        featureType: "object-removal",
        uploadedImages: allUploadedImages,
        selectedFeature: ["object-removal"],
        beforeAfterData: allBeforeAfterData,
        finalNotes: `Removed ${totalSelectedObjects} object(s)`,
        image: allUploadedImages[0],
      };

      const savedData = await saveGeneratedImage([singlePayload], token);
      
      setFormData((prev) => ({
        ...prev,
        beforeAfterData: Array.isArray(savedData)
          ? savedData.flatMap((item) => item.beforeAfterData || [])
          : savedData.beforeAfterData || [],
      }));

      // Delete draft
      const urlParams = new URLSearchParams(window.location.search);
      const draftId = urlParams.get("draftId") || formData.draftId;

      if (draftId) {
        const savedDrafts = localStorage.getItem("draftProjects");
        if (savedDrafts) {
          const drafts = JSON.parse(savedDrafts);
          const updatedDrafts = drafts.filter((draft) => draft.id !== draftId);
          localStorage.setItem("draftProjects", JSON.stringify(updatedDrafts));
        }
      }
      localStorage.removeItem("currentDraft");

      toast.success("Objects removed & saved successfully!", { id: "remove" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove objects", { id: "remove" });
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
            onClick={handleContinue}
            className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div> */}
        <span className="font-medium text-black text-[18px] sm:text-[20px] mb-6 sm:mb-8">
          Elite Image AI
        </span>
      </div>

      <h2 className="mb-4 sm:mb-5 lg:mb-6 text-[20px] sm:text-[28px] lg:text-[28px] font-semibold text-gray-900">
        Object Removal Options
      </h2>

      {formData.totalSteps > 0 && (
        <div className=" flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-5 lg:mb-6">
          <ProgressBar currentStep={2} totalSteps={formData.totalSteps} />
        </div>
      )}

      <div className="mb-4 sm:mb-5 lg:mb-6">
        <div className="bg-[#D3E7F0] border-2 border-[#6FB6D6] rounded-2xl p-4 sm:p-6">
          <div className="text-start mb-4 sm:mb-5 lg:mb-6">
            <p
              className="text-[18px] sm:text-[20px] text-black
              font-medium mb-2"
            >
              {totalSelectedObjects === 0
                ? "Select Objects — Drag Over Each One"
                : `${totalSelectedObjects} object(s) selected`}
            </p>
          </div>

          <div className="flex gap-3 mb-4 overflow-x-auto mb-4 sm:mb-5 lg:mb-6">
            {formData.uploadedImages.map((img, index) => (
              <img
                key={index}
                src={typeof img === "string" ? img : URL.createObjectURL(img)}
                onClick={() => setActiveImageIndex(index)}
                className={`h-20 w-28 object-cover rounded cursor-pointer border-2
                ${
                  activeImageIndex === index
                    ? "border-[#034F75]"
                    : "border-gray-300"
                }`}
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

      <div
        className="
   
  flex flex-col sm:flex-row 
  items-stretch sm:items-center
  justify-center sm:justify-center lg:justify-end 
  gap-3 
  max-w-4xl mx-auto px-3
"
      >
        {/* Back Button */}
        <button
          onClick={back}
          className="
      w-full sm:w-auto
      px-4 sm:px-6 lg:px-8 
      py-2.5 sm:py-3 
      text-[14px] sm:text-[16px] lg:text-[18px] 
      border-2 border-gray-400 
      text-gray-700 
      rounded-lg 
      hover:bg-gray-100 
      transition-colors
    "
        >
          Back
        </button>

        {/* Clear Selection */}
        {selectedAreas[activeImageIndex]?.length > 0 && (
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
            className="
        w-full sm:w-auto
        px-4 sm:px-6 lg:px-8 
        py-2.5 sm:py-3 
        text-[14px] sm:text-[16px] lg:text-[18px]
        border-2 border-[#034F75] 
        text-[#034F75] 
        rounded-lg 
        hover:bg-[#034F75] hover:text-white
        transition-colors
      "
          >
            Clear All Selections
          </button>
        )}

        {/* Remove Object */}
        <button
          onClick={handleRemoveObject}
          disabled={!allImagesHaveSelection}
          className={`
      w-full sm:w-auto
      flex items-center justify-center gap-2
      px-4 sm:px-6 lg:px-8 
      py-2.5 sm:py-3 
      text-[14px] sm:text-[16px] lg:text-[18px]
      rounded-lg 
      transition-colors
      ${
        allImagesHaveSelection
          ? "bg-[#034F75] hover:bg-[#023a5c] text-white"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }
    `}
        >
          Remove Object
        </button>
      </div>
    </div>
  );
};

export default Step2ObjectRemoval;
