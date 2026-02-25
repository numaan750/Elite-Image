"use client";
import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { TbEdit } from "react-icons/tb";
import { IoShareSocial } from "react-icons/io5";
import { PiDownload } from "react-icons/pi";
import { AppContext } from "@/context/AppContext";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { saveAs } from "file-saver";
const Step4Page = () => {
  useEffect(() => {
    toast.dismiss();
  }, []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user, saveGeneratedImage, getProjectById } =
    useContext(AppContext);

  const [formData, setFormData] = useState({
    uploadedImages: [],
    featureType: "",
    selectedFeature: "",
    selectedStyle: "",
    beforeAfterData: [],
    finalNotes: "",
    userId: user?._id || "",
  });

  const [sliderPositions, setSliderPositions] = useState({});
  const [isDragging, setIsDragging] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    const loadProjectData = async () => {
      const mode = searchParams.get("mode");
      const pid = searchParams.get("projectId");

      if (!pid) {
        toast.error("Project ID missing!");
        router.push("/admin/dashboard");
        return;
      }

      setProjectId(pid);

      if (mode === "view") {
        setIsViewMode(true);
      } else if (mode === "edit") {
        setIsEditMode(true);
      }

      try {
        const project = await getProjectById(pid, true);

        setFormData({
          uploadedImages: project.uploadedImages || [],
          featureType: project.featureType || "",
          selectedFeature: project.selectedFeature?.[0] || "",
          selectedStyle: project.selectedStyle?.[0] || "",
          beforeAfterData:
            project.beforeAfterData && project.beforeAfterData.length > 0
              ? project.beforeAfterData
              : project.image
                ? [
                    {
                      processedImage: project.image,
                      originalImage:
                        project.uploadedImages?.[0] || project.image,
                    },
                  ]
                : [],
          uploadedImages: project.uploadedImages || [],
          finalNotes: project.finalNotes || "",
          userId: project.userid || user?._id,
        });
      } catch (error) {
        toast.error("Failed to load project");
        console.error(error);
      }
    };

    loadProjectData();
  }, [searchParams]);

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
  const showDownloadConfirmToast = () => {
    handleDownloadConfirmed();
  };
  const handleDownloadConfirmed = async () => {
    const processedData =
      formData.beforeAfterData && formData.beforeAfterData.length > 0
        ? formData.beforeAfterData
        : formData.uploadedImages.map((img) => ({
            processedImage: img,
          }));
    if (processedData.length === 1) {
      toast.loading("Downloading image...", { id: "download" });

      try {
        const response = await fetch(processedData[0].processedImage);
        const blob = await response.blob();

        if (window.showSaveFilePicker) {
          const fileHandle = await window
            .showSaveFilePicker({
              suggestedName: "elite-image-1.jpg",
              types: [
                {
                  description: "JPEG Image",
                  accept: { "image/jpeg": [".jpg"] },
                },
              ],
            })
            .catch(() => null);

          if (!fileHandle) {
            toast("Download cancelled", { id: "download", duration: 2000 });
            return;
          }

          try {
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();

            toast.success("Download complete", {
              id: "download",
              duration: 2000,
            });
          } catch (err) {
            console.error(err);
            toast.error("Save failed", { id: "download", duration: 2000 });
            return;
          }
        } else {
          saveAs(blob, "elite-image-1.jpg");
          toast.success("Download complete", {
            id: "download",
            duration: 2000,
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Download failed", { id: "download", duration: 3000 });
      }
      return;
    }
    if (!processedData || processedData.length === 0) {
      toast.error("No images to download");
      return;
    }
    toast.loading("Preparing ZIP...", { id: "zip" });
    try {
      const zip = new JSZip();
      const folder = zip.folder("Elite-Image-AI");
      for (let i = 0; i < processedData.length; i++) {
        const response = await fetch(processedData[i].processedImage);
        const blob = await response.blob();
        folder.file(`elite-image-${i + 1}.jpg`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });

      if (window.showSaveFilePicker) {
        const fileHandle = await window
          .showSaveFilePicker({
            suggestedName: "Elite-Image-AI-Project.zip",
            types: [
              {
                description: "ZIP Archive",
                accept: { "application/zip": [".zip"] },
              },
            ],
          })
          .catch(() => null);
        if (!fileHandle) {
          toast("Download cancelled", { id: "zip", duration: 2000 });
          return;
        }
        try {
          const writable = await fileHandle.createWritable();
          await writable.write(zipBlob);
          await writable.close();
          toast.success("Download complete", { id: "zip", duration: 2000 });
        } catch (err) {
          console.error(err);
          toast.error("Save failed", { id: "zip", duration: 2000 });
          return;
        }
      } else {
        saveAs(zipBlob, "Elite-Image-AI-Project.zip");
        toast.success("Download complete", { id: "zip", duration: 2000 });
      }
    } catch (err) {
      console.error(err);
      toast.error("Download failed", { id: "zip", duration: 3000 });
    }
  };
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center mt-14 sm:mt-16 lg:mt-15">
      <div className="w-full flex justify-start mb-4">
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-7 text-gray-700">
          <span className="font-medium text-black text-[16px] sm:text-[20px] mb-4 sm:mb-5 lg:mb-6 mt-8">
            Elite Image AI -{" "}
            {isViewMode ? "View" : isEditMode ? "Edit" : "Generate"} Mode
          </span>
        </div>
      </div>

      <div className="w-full ">
        <h2 className="text-[20px] sm:text-[24px] lg:text-[32px] font-semibold text-black ">
          {isViewMode
            ? "View Results"
            : isEditMode
              ? "Edit Project"
              : "Processing Complete"}
        </h2>{" "}
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-5 lg:mb-6 ">
          Total Images: {formData.uploadedImages.length}
        </p>
      </div>

      <div className="border border-[#034F75] rounded-xl p-3 sm:p-4 lg:p-5 w-full bg-[#D3E7F0] mb-4 sm:mb-5 lg:mb-6">
        <h3 className="text-[20px] sm:text-[24px] lg:text-[28px] font-semibold text-black mb-1">
          Before / After Comparison
        </h3>
        <p className="text-[12px] sm:text-[16px] lg:text-[18px] text-black mb-3 sm:mb-4">
          Drag the slider to compare original and enhanced versions
        </p>

        <div className="relative w-full rounded-xl overflow-hidden flex items-center justify-center">
          <div
            className={`w-full ${
              formData.uploadedImages.length === 1
                ? "flex flex-col gap-4 sm:gap-6"
                : "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
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
                    <div className="absolute inset-0">
                      <Image
                        src={img}
                        alt={`Before ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-contain"
                        priority
                      />
                    </div>

                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: `inset(0 ${
                          100 - (sliderPositions[index] || 50)
                        }% 0 0)`,
                      }}
                    >
                      <Image
                        src={
                          (Array.isArray(formData.beforeAfterData)
                            ? formData.beforeAfterData[index]?.processedImage
                            : formData.beforeAfterData?.processedImage) || img
                        }
                        alt={`After ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-contain"
                        priority
                      />
                    </div>

                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
                      style={{ left: `${sliderPositions[index] || 50}%` }}
                    >
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

                    <div className="absolute top-2 left-2 bg-[#034F75] text-white text-[10px] sm-text-[14px] px-3 py-1.5 rounded z-20">
                      Before
                    </div>
                    <div className="absolute top-2 right-2 bg-[#034F75] text-white text-[10px] sm-text-[14px] px-3 py-1.5 rounded z-20">
                      After
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-full sm:max-w-[820px] flex flex-col items-center gap-4 sm:gap-5">
        <div className="flex flex-col sm:flex-row w-full justify-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              router.push(`/admin/edit-project?projectId=${projectId}`);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#034F75] text-[16px] sm:text-[16px] lg:text-[18px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-[#034F75] hover:text-white transition-colors"
          >
            <TbEdit size={17} />
            Edit
          </button>
          <button
            onClick={async () => {
              const allData =
                formData.beforeAfterData && formData.beforeAfterData.length > 0
                  ? formData.beforeAfterData
                  : formData.uploadedImages.map((img) => ({
                      processedImage: img,
                    }));

              const shareUrl = allData?.[0]?.processedImage || "";

              if (allData.length <= 1) {
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: "Elite Image AI",
                      text: "Check out my AI enhanced image!",
                      url: shareUrl,
                    });
                  } catch (err) {
                    if (err.name !== "AbortError") toast.error("Share failed");
                  }
                } else {
                  await navigator.clipboard.writeText(shareUrl);
                  toast.success("Link copied!");
                }
                return;
              }
              try {
                toast.loading("Preparing images...", { id: "share" });
                const files = [];
                for (let i = 0; i < allData.length; i++) {
                  const response = await fetch(allData[i].processedImage);
                  const blob = await response.blob();
                  files.push(
                    new File([blob], `elite-image-${i + 1}.jpg`, {
                      type: "image/jpeg",
                    }),
                  );
                }
                toast.dismiss("share");

                if (
                  navigator.share &&
                  navigator.canShare &&
                  navigator.canShare({ files })
                ) {
                  await navigator.share({
                    title: "Elite Image AI",
                    text: "Check out my AI enhanced images!",
                    files: files,
                  });
                } else {
                  await navigator.clipboard.writeText(shareUrl);
                  toast.success(
                    "Link copied! (File sharing not supported on this device)",
                  );
                }
              } catch (err) {
                toast.dismiss("share");
                if (err.name !== "AbortError") toast.error("Share failed");
              }
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#034F75] text-[16px] sm:text-[16px] lg:text-[18px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-[#034F75] hover:text-white transition-colors"
          >
            <IoShareSocial size={17} />
            Share Link
          </button>
        </div>

        <button
          onClick={showDownloadConfirmToast}
          disabled={
            !formData.uploadedImages || formData.uploadedImages.length === 0
          }
          className={`
  w-full sm:w-[280px]
  flex items-center justify-center gap-2
  text-[16px] sm:text-[18px]
  py-2.5 sm:py-3
  rounded-lg
  transition-colors
  ${
    formData.uploadedImages && formData.uploadedImages.length > 0
      ? "bg-[#034F75] text-white hover:bg-[#023d5c] cursor-pointer"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
        >
          <PiDownload size={20} />
          <span>Download </span>
        </button>
      </div>
    </div>
  );
};

export default Step4Page;
