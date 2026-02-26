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
  const [isProcessing, setIsProcessing] = useState(false);

  const totalSelectedObjects = Object.values(selectedAreas).reduce(
    (total, areas) => total + areas.length,
    0,
  );

  const allImagesHaveSelection = formData.uploadedImages.every(
    (img, index) => selectedAreas[index] && selectedAreas[index].length > 0,
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

      const buildSelectionPrompt = (areas) => {
        if (!areas || areas.length === 0) {
          return "Remove any unwanted objects, clutter, or distracting elements from this photo.";
        }

        const containerEl = document.querySelector(".cursor-crosshair");
        const displayWidth = containerEl?.offsetWidth || 800;
        const displayHeight = containerEl?.offsetHeight || 600;

        const areaDescriptions = areas.map((area, idx) => {
          const xPct = Math.round((area.x / displayWidth) * 100);
          const yPct = Math.round((area.y / displayHeight) * 100);
          const wPct = Math.round((area.width / displayWidth) * 100);
          const hPct = Math.round((area.height / displayHeight) * 100);

          const vertPos = yPct < 33 ? "upper" : yPct > 66 ? "lower" : "middle";
          const horizPos = xPct < 33 ? "left" : xPct > 66 ? "right" : "center";

          return `Selection ${idx + 1}: in the ${vertPos}-${horizPos} portion of the image, starting at ${xPct}% from left and ${yPct}% from top, spanning ${wPct}% of image width and ${hPct}% of image height`;
        });

        return `There ${areas.length === 1 ? "is" : "are"} ${areas.length} selected region${areas.length > 1 ? "s" : ""} that must be removed:\n${areaDescriptions.join("\n")}\n\nFor each selected region: identify the object or content inside that exact region, completely erase it, and fill the area naturally with the surrounding background (wall, floor, sky, grass, etc.) as if the object was never there. Do NOT remove anything outside these selected regions. Keep everything else in the photo completely unchanged.`;
      };
      const uploadPromises = formData.uploadedImages.map(async (img, i) => {
        const originalUrl = await uploadToCloudinary(img);

        const areas = selectedAreas[i] || [];
        const selectionPrompt = buildSelectionPrompt(areas);

        let processedUrl;
        try {
          processedUrl = await processImageWithAI(
            originalUrl,
            "Object Removal",
            selectionPrompt,
            null,
            null,
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
    <div className="w-full min-h-screen bg-white mt-14 sm:mt-16 lg:mt-15">
      <div className="flex items-center gap-3 text-gray-700">
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
                      formData.uploadedImages[activeImageIndex],
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
         justify-between
         gap-3
        "
      >
        <button
          onClick={back}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 sm:px-6 py-2 text-[14px] sm:text-[18px] text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={17} className="rotate-180" />
          Back
        </button>

        <div className="flex flex-col sm:flex-row gap-3">
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
               px-3 sm:px-3 py-2
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

          <button
            onClick={handleRemoveObject}
            disabled={!allImagesHaveSelection || isProcessing}
            className={`
             w-full sm:w-auto
             flex items-center justify-center gap-2
             px-5 sm:px-7 py-2 
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
