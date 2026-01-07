"use client";
import React, { useState } from "react";
import { Upload, ArrowRight, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import ProgressBar from "./ProgressBar";

const CLOUD_NAME = "dhtpqla2b";
const UPLOAD_PRESET = "unsigned_preset";

const Step1 = ({ formData, setFormData, next }) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const toast = {
    loading: (msg) => console.log(msg),
    success: (msg) => console.log(msg),
    error: (msg) => console.error(msg),
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("upload_preset", UPLOAD_PRESET);

    try {
      setUploadingImage(true);
      toast.loading("Uploading image...");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadForm,
        }
      );

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      const optimizedUrl = data.secure_url.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_1200/"
      );

      setFormData((prev) => ({
        ...prev,
        uploadedImages: [...prev.uploadedImages, optimizedUrl],
        lastUploadedAt: new Date().toISOString(),
      }));

      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Image upload failed!");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const fakeEvent = { target: { files: [files[0]] } };
      await handleFileUpload(fakeEvent);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      uploadedImages: prev.uploadedImages.filter(
        (_, idx) => idx !== indexToRemove
      ),
    }));
  };

  return (
    <div className="bg-white px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8">
      <div className="flex items-center gap-3 text-gray-700">
        <button className="h-7 w-7 rounded border flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ChevronRight size={16} />
        </button>
        <span className="font-medium text-black text-[16px] sm:text-[20px]">
          Elite Image Ai
        </span>
      </div>

      <h2 className="mt-4 sm:mt-6 lg:mt-8 text-[18px] sm:text-[20px] lg:text-[24px] font-semibold text-black">
        Upload Images
      </h2>

      <div className="mt-4 sm:mt-6 lg:mt-8 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
        {/* <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#034F75]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-12 lg:w-20 bg-[#034F75]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-12 lg:w-20 bg-[#CFE8F2]" />
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#D3E7F0]" />
        <div className="h-[2px] sm:h-[3px] w-8 sm:w-12 lg:w-20 bg-[#D3E7F0]" /> */}

        <ProgressBar currentStep={1} totalSteps={formData.totalSteps} />
      </div>

      <div className="mt-6 sm:mt-8 lg:mt-10 rounded-2xl border border-[#6FB6D6] bg-[#D3E7F0] p-3 sm:p-4 min-h-[250px] sm:min-h-[300px] lg:min-h-[400px]">
        <div
          className={`relative flex flex-col ${
            formData.uploadedImages.length === 0
              ? "items-center justify-center"
              : "items-start justify-start"
          } rounded-xl border-2 border-dashed border-[#034F75] px-3 sm:px-4 lg:px-6 ${
            formData.uploadedImages.length === 0
              ? "py-8 sm:py-10 lg:py-16"
              : "py-3 sm:py-4"
          } text-center cursor-pointer min-h-[250px] sm:min-h-[300px] lg:min-h-[350px] ${
            isDragging ? "bg-blue-50 border-solid" : ""
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input").click()}
        >
          {formData.uploadedImages.length === 0 ? (
            <>
              <Upload
                size={32}
                className="text-[#034F75] sm:w-10 sm:h-10 lg:w-[50px] lg:h-[50px]"
              />
              <p className="mt-3 sm:mt-4 text-[16px] sm:text-[20px] lg:text-[24px] font-medium text-[#034F75] px-2">
                Drag and drop your images here
              </p>
              <span className="my-2 sm:my-3 text-[12px] sm:text-[16px] lg:text-[24px] text-[#034F75]">
                Or
              </span>
              <label className="rounded-lg bg-[#034F75] px-4 sm:px-5 lg:px-6 py-2 text-white text-[16px] sm:text-[20px] cursor-pointer hover:bg-[#023d5c] transition-colors">
                {uploadingImage ? "Uploading..." : "Browse File"}
              </label>
              <p className="mt-3 sm:mt-4 text-[12px] sm:text-[24px] text-[#034F75] px-2">
                Supports: JPG, PNG, HEIC • Max 5MB per file
              </p>
            </>
          ) : (
            <div
              className={`w-full ${
                formData.uploadedImages.length === 1
                  ? "flex items-start justify-start"
                  : "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
              }`}
            >
              {formData.uploadedImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-lg sm:rounded-xl overflow-hidden border border-[#6FB6D6] group ${
                    formData.uploadedImages.length === 1 ? "w-full h-full" : ""
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={img}
                    alt={`Uploaded ${idx + 1}`}
                    width={400}
                    height={350}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={`w-full ${
                      formData.uploadedImages.length === 1
                        ? "h-full min-h-[250px] sm:min-h-[300px] lg:min-h-[350px]"
                        : "h-32 sm:h-36 lg:h-40"
                    } object-cover`}
                    priority={idx === 0}
                  />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-black/50 cursor-pointer text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploadingImage}
          />
        </div>
      </div>

      {/* {formData.uploadedImages.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {formData.uploadedImages.map((img, idx) => (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden border border-[#6FB6D6] group"
            >
              <img
                src={img}
                alt={`Uploaded ${idx + 1}`}
                className="w-full h-40 object-cover"
              />
              <button
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-2 right-2 bg-black/50 cursor-pointer text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )} */}

      <div className="mt-6 sm:mt-8 lg:mt-10 flex justify-center sm:justify-end">
        <button
          onClick={next}
          disabled={formData.uploadedImages.length === 0}
          className={`flex items-center gap-2 rounded-lg bg-[#034F75] px-5 sm:px-6 py-2 text-[12px] sm:text-[20px] text-white hover:bg-[#023d5c] transition-colors ${
            formData.uploadedImages.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          Continue
          <ArrowRight size={17} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>
    </div>
  );
};

export default Step1;
