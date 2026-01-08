"use client";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import ProgressBar from "./ProgressBar";

const Step2ObjectRemoval = ({ formData, setFormData, next, back }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const imageRef = useRef(null);

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

      setSelectedAreas((prev) => [...prev, area]);

      setFormData((prev) => ({
        ...prev,
        selectedObjectAreas: [...(prev.selectedObjectAreas || []), area],
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
    if (selectedAreas.length === 0) {
      alert("Please select at least one object to remove");
      return;
    }
    next();
  };

  const handleRemoveObject = () => {
    console.log("Removing objects from areas:", selectedAreas);
    // Yahan aap API call kar sakte hain object removal ke liye
    next();
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
        {/* <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" />
        <div className="h-[2px] sm:h-[3px] w-12 sm:w-16 lg:w-20 bg-[#CFE8F2]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#034F75]" />
        <div className="h-[2px] sm:h-[3px] w-12 sm:w-16 lg:w-20 bg-[#034F75]" /> */}
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
              {selectedAreas.length === 0
                ? "Select Objects — Drag Over Each One"
                : `${selectedAreas.length} object(s) selected`}
            </p>
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
              src={formData.uploadedImages[0]}
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

            {selectedAreas.map((area, index) => (
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
          onClick={back} // ya router.back() agar browser history chahiye
          className="px-6 sm:px-8 py-2.5 sm:py-3 text-[16px] sm:text-[20px] border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Back
        </button>

        {selectedAreas.length > 0 && (
          <button
            onClick={() => {
              setSelectedAreas([]);
              setFormData((prev) => ({
                ...prev,
                selectedObjectAreas: [],
              }));
            }}
            className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-[#034F75] text-[#034F75] rounded-lg"
          >
            Clear All Selections
          </button>
        )}

        {/* Remove Object */}
        <button
          onClick={handleRemoveObject}
          disabled={selectedAreas.length === 0}
          className={`flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 text-[16px] sm:text-[20px] rounded-lg transition-colors
      ${
        selectedAreas.length > 0
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
