"use client";
import React, { useState, useContext } from "react";
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation"; // ✅ ADD THIS
import Image from "next/image";
import { AppContext } from "@/context/AppContext";

const History = () => {
  const router = useRouter(); // ✅ ADD THIS
  const { images, loading, error, getAiImages, deleteImages } =
    useContext(AppContext);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    setDeleteLoading(id);
    try {
      await deleteImages(id);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete image");
    } finally {
      setDeleteLoading(null);
    }
  };

  // ✅ ADD THIS: View Results function
  const handleViewResults = (item) => {
    // Step4 page par bhejne ke liye data prepare karo
    const queryParams = new URLSearchParams({
      projectId: item._id,
      featureType: item.featureType,
      mode: "view",
    }).toString();

    router.push(`/admin/step4?${queryParams}`);
  };

  // ✅ ADD THIS: Re-edit function
  const handleReEdit = (item) => {
    // UploadImageTabs par bhejo with edit mode
    const queryParams = new URLSearchParams({
      type: item.featureType,
      editMode: "true",
      projectId: item._id,
    }).toString();

    router.push(`/admin/uploadImageTabs?${queryParams}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-[#034F75]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-300 rounded-lg p-6 max-w-md">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-base sm:text-[26px] font-bold text-black px-4 sm:px-6 lg:px-9 py-3 sm:py-4">
        Eliteimage Ai
      </h2>

      <div className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 lg:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h2 className="text-[20px] sm:text-[28px] lg:text-[35px] font-semibold text-black">
            Generation History
          </h2>

          <button
            onClick={getAiImages}
            className="rounded-md cursor-pointer bg-[#0B5C7A] px-4 py-1.5 text-[16px] sm:text-[20px] text-white hover:bg-[#034F75] transition-colors w-full sm:w-auto"
          >
            Refresh
          </button>
        </div>

        {!images || images.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-[#D3E7F0] rounded-lg">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-3xl sm:text-4xl">🖼️</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-2">
              No Images Yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              Start generating images to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {images.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-xl border border-[#034F75] bg-[#D3E7F0] p-3 sm:p-4"
              >
                <Image
                  src={
                    item.image ||
                    item.uploadedImages?.[0] || // ✅ SKY REPLACEMENT FIX
                    "/placeholder.png"
                  }
                  alt={item.title}
                  width={112}
                  height={112}
                  className="h-24 w-24 sm:h-35 sm:w-35 rounded-lg object-cover flex-shrink-0"
                />

                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div>
                    <p className="text-[16px] sm:text-[20px] font-medium text-black">
                      {item.title}
                    </p>
                    <p className="text-[16px] sm:text-[20px] text-gray-600">
                      {item.featureType}
                    </p>
                    <p className="text-[14px] text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-5">
                    {/* ✅ View Results Button */}
                    <button
                      onClick={() => handleViewResults(item)}
                      className="flex items-center cursor-pointer gap-2 rounded-md bg-[#034F75] px-3 sm:px-4 py-2 text-sm sm:text-base text-white hover:bg-[#023d5c] transition-colors"
                    >
                      <Eye size={16} className="flex-shrink-0" />
                      <span className="whitespace-nowrap">View Results</span>
                    </button>

                    {/* ✅ Re-Edit Button */}
                    <Link
                      href={`/admin/step4?mode=edit&projectId=${
                        item._id
                      }&featureType=${encodeURIComponent(item.featureType)}`}
                      className="flex items-center gap-2 rounded-md bg-[#034F75] px-3 sm:px-4 py-2 text-sm sm:text-base text-white hover:bg-[#023d5c] transition-colors"
                    >
                      <Pencil size={16} className="flex-shrink-0" />
                      <span className="whitespace-nowrap">Re-Edit</span>
                    </Link>

                    {/* ✅ Delete Button */}
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deleteLoading === item._id}
                      className="flex items-center cursor-pointer gap-2 rounded-md shadow-md bg-white px-3 sm:px-4 py-2 text-sm sm:text-base text-[#FF1C20] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteLoading === item._id ? (
                        <Loader2
                          size={16}
                          className="animate-spin flex-shrink-0"
                        />
                      ) : (
                        <Trash2 size={16} className="flex-shrink-0" />
                      )}
                      <span className="whitespace-nowrap">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default History;
