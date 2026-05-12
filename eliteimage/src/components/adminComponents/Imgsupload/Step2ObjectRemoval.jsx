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
  const {
    token,
    saveGeneratedImage,
    user,
    deductUserCredits,
    processImageWithAI,
  } = useContext(AppContext);
  const { saveDraft } = useContext(AppContext);
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
  const mainImageRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalSelectedObjects = Object.values(selectedAreas).reduce(
    (total, areas) => total + areas.length,
    0,
  );

  const allImagesHaveSelection = formData.uploadedImages.every(
    (img, index) => selectedAreas[index] && selectedAreas[index].length > 0,
  );

  // YEH NAYA FUNCTION ADD KARO — kuch delete nahi karna:
  const createMaskedImage = async (areas, imageUrl) => {
    const img = await new Promise((resolve, reject) => {
      const image = new window.Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = imageUrl + "?t=" + Date.now();
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

    // ↓ YAHAN FIX HAI — mainImageRef directly use karo, querySelector nahi
    const rect = mainImageRef.current.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    ctx.fillStyle = "rgba(255, 0, 0, 1)";
    areas.forEach((area) => {
      ctx.fillRect(
        area.x * scaleX,
        area.y * scaleY,
        area.width * scaleX,
        area.height * scaleY
      );
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  };
  const handleMouseDown = (e) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
    setDragEnd({ x, y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
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
            "step2",
          );
        } catch (error) {
          console.error("Error saving draft:", error);
        }
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedAreas]);
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
    if (isProcessing) return;

    const imageCount = formData.uploadedImages.length;
    const creditsNeeded = imageCount * 5;
    const canProceed = await deductUserCredits(creditsNeeded);
    if (!canProceed) return;

    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (!allImagesHaveSelection) {
      toast.error("Please select objects in all images first");
      return;
    }

    setIsProcessing(true);
    toast.loading("Processing images...", { id: "remove" });

    try {
      const CLOUD_NAME = "drh7q62eh";
      const UPLOAD_PRESET = "unsigned_preset";

      const uploadToCloudinary = async (img) => {
        let blob;
        if (img.startsWith("blob:")) {
          const idx = formData.uploadedImages.indexOf(img);
          blob =
            formData.localFiles?.[idx] ||
            (await fetch(img).then((r) => r.blob()));
        } else {
          blob = await fetch(img).then((r) => r.blob());
        }
        const fd = new FormData();
        fd.append("file", blob);
        fd.append("upload_preset", UPLOAD_PRESET);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: fd },
        );
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
        const data = await res.json();
        if (!data.secure_url) throw new Error("No secure_url");
        return data.secure_url;
      };

      // const buildSelectionPrompt = (areas) => {
      //   if (!areas || areas.length === 0) {
      //     return "Remove any unwanted objects or distracting elements from this photo.";
      //   }

      //   const containerEl = document.querySelector(".cursor-crosshair");
      //   const displayWidth = containerEl?.offsetWidth || 800;
      //   const displayHeight = containerEl?.offsetHeight || 600;

      //   const areaDescriptions = areas.map((area, idx) => {
      //     const xPct = Math.round((area.x / displayWidth) * 100);
      //     const yPct = Math.round((area.y / displayHeight) * 100);
      //     const wPct = Math.round((area.width / displayWidth) * 100);
      //     const hPct = Math.round((area.height / displayHeight) * 100);
      //     const centerXPct = Math.round(xPct + wPct / 2);
      //     const centerYPct = Math.round(yPct + hPct / 2);
      //     const vertPos = yPct < 33 ? "upper" : yPct > 66 ? "lower" : "middle";
      //     const horizPos = xPct < 33 ? "left" : xPct > 66 ? "right" : "center";

      //     return `REGION ${idx + 1}: Remove object at ${vertPos}-${horizPos} area. Coordinates: starts ${xPct}% from left, ${yPct}% from top, covers ${wPct}% width and ${hPct}% height. Center: ${centerXPct}% from left, ${centerYPct}% from top.`;
      //   });

      //   return `Selection-PRECISE OBJECT REMOVAL - ${areas.length} REGION(s) to remove:

      //    ${areaDescriptions.join("\n\n")}

      //    CRITICAL EXECUTION RULES:
      //    1. Remove ONLY the content inside each described REGION above - nothing else
      //    2. There are exactly ${areas.length} REGION(s) to remove - remove ALL of them, every single one
      //    3. Fill each removed region with seamless background matching surrounding area exactly
      //    4. Reconstruction must be completely invisible - match texture, color, lighting perfectly
      //    5. DO NOT remove, change, or affect ANYTHING outside the ${areas.length} specified region(s)
      //    6. DO NOT alter brightness, colors, or quality of any area outside the regions
      //    7. Final result must look completely natural as if those objects were never there
      //    8. This is SURGICAL removal - only the selected regions, nothing more`;
      // };
      const uploadPromises = formData.uploadedImages.map(async (img, i) => {
        const originalUrl = await uploadToCloudinary(img);
        const areas = selectedAreas[i] || [];
        let processedUrl;
        try {
          // Masked image banao (red areas wali) — original save rehti hai
          const maskedBlob = await createMaskedImage(areas, originalUrl);
          const fd = new FormData();
          fd.append("file", maskedBlob);
          fd.append("upload_preset", UPLOAD_PRESET);
          const maskRes = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            { method: "POST", body: fd }
          );
          const maskData = await maskRes.json();
          const maskedUrl = maskData.secure_url;
          // AI ko masked image bhejo — selectedAreas [] empty bhejo
          const areasWithPct = areas.map(area => ({
            xPct: Math.round((area.x / mainImageRef.current.offsetWidth) * 100),
            yPct: Math.round((area.y / mainImageRef.current.offsetHeight) * 100),
            wPct: Math.round((area.width / mainImageRef.current.offsetWidth) * 100),
            hPct: Math.round((area.height / mainImageRef.current.offsetHeight) * 100),
          }));

          processedUrl = await processImageWithAI(
            maskedUrl,
            "Object Removal",
            null, null, null, null,
            areasWithPct  // ← percentage wale areas bhejo
          );
        } catch (aiError) {
          console.error(`AI failed for image ${i + 1}:`, aiError);
          processedUrl = originalUrl;
        }

        return {
          originalImage: originalUrl,
          processedImage: processedUrl,
          removedAreas: areas,
          processedAt: new Date().toISOString(),
          status: "completed",
        };
      });

      const results = await Promise.all(uploadPromises);
      const allUploadedImages = results.map((r) => r.originalImage);

      const singlePayload = {
        userid: user?._id || formData.userid,
        title: `Object Removal - ${new Date().toLocaleDateString()}`,
        description: `Object removal with ${totalSelectedObjects} selected area(s)`,
        featureType: "object-removal",
        uploadedImages: allUploadedImages,
        selectedFeature: ["object-removal"],
        beforeAfterData: results,
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

      toast.success("Objects removed successfully!", { id: "remove" });
      next();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove objects", { id: "remove" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white mt-10 sm:mt-8 lg:mt-3">
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
                onClick={() => {
                  if (!isProcessing) setActiveImageIndex(index);
                }}
                className={`h-20 w-28 object-cover rounded cursor-pointer border-2
                ${activeImageIndex === index
                    ? "border-[#034F75]"
                    : "border-gray-300"
                  }`}
              />
            ))}
          </div>

          <div
            className="relative w-full bg-white rounded-[40px] overflow-hidden cursor-crosshair"
            ref={imageRef}
            onMouseDown={isProcessing ? undefined : handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >

            <img
              ref={mainImageRef}  // ← SIRF YEH LINE ADD KARO
              src={
                typeof formData.uploadedImages[activeImageIndex] === "string"
                  ? formData.uploadedImages[activeImageIndex]
                  : URL.createObjectURL(formData.uploadedImages[activeImageIndex])
              }
              alt="Select object to remove"
              className="w-full h-auto select-none"
              draggable={false}
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
         justify-between
         gap-3
        "
      >
        <button
          onClick={back}
          disabled={isProcessing}
          className={`flex items-center gap-2 rounded-lg border border-gray-300 px-4 sm:px-6 py-2 text-[14px] sm:text-[18px] text-gray-700 transition-colors ${isProcessing ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
        >
          <ChevronRight size={17} className="rotate-180" />
          Back
        </button>
        <div className="flex flex-col sm:flex-row gap-3">
          {selectedAreas[activeImageIndex]?.length > 0 && (
            <button
              onClick={() => {
                if (!isProcessing) {
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
                }
              }}
              disabled={isProcessing}
              className={`
               w-full sm:w-auto sm:min-w-[180px]
               px-3 sm:px-3 py-2
               text-[14px] sm:text-[16px] lg:text-[18px]
               border-2 border-[#034F75] 
               rounded-lg 
               transition-colors
               justify-center
               ${isProcessing ? "opacity-50 cursor-not-allowed text-gray-400 border-gray-300" : "text-[#034F75] hover:bg-[#034F75] hover:text-white"}
             `}
            >
              Clear All Selections
            </button>
          )}

          <button
            onClick={handleRemoveObject}
            disabled={!allImagesHaveSelection || isProcessing}
            className={`
             w-full sm:w-auto sm:min-w-[180px]
             flex items-center justify-center gap-2
             px-5 sm:px-7 py-2 
             text-[14px] sm:text-[16px] lg:text-[18px]
             rounded-lg 
             transition-colors
             ${allImagesHaveSelection
                ? "bg-[#034F75] hover:bg-[#023a5c] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
           `}
          >
            {isProcessing ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Remove Object"
            )}{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2ObjectRemoval;
