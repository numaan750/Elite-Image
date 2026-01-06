"use client";
import React, { useState, useContext } from "react";
import {
  Loader2,
  Trash2,
  Calendar,
  AlertCircle,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";
import { AppContext } from "@/context/AppContext";
import Image from "next/image";

const History = () => {
  const { images, loading, error, getAiImages, deleteImages } =
    useContext(AppContext);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#034F75] mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-300 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 text-center mb-2">
            Error Loading History
          </h3>
          <p className="text-gray-600 text-center">{error}</p>
          <button
            onClick={getAiImages}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-9">
      <div className="max-w-full">
        <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm sm:text-base lg:text-xl font-semibold mb-1 sm:mb-2">
              Eliteimage Ai
            </h3>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-1 sm:mb-2">
              Generation History
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              View all your AI generated images
            </p>
          </div>
          <button
            onClick={getAiImages}
            className="bg-[#034F75] cursor-pointer hover:bg-[#023a5a] text-white font-medium py-2 px-3 sm:px-4 rounded-md transition flex items-center gap-2 text-xs sm:text-sm lg:text-base whitespace-nowrap"
          >
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
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
          <div className="bg-[#D3E7F0] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#034F75] text-white">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">
                      Image
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">
                      Title
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold hidden sm:table-cell">
                      Description
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold hidden md:table-cell">
                      Feature Type
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold hidden lg:table-cell">
                      Date
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {images.map((item, index) => (
                    <tr
                      key={item._id}
                      className={`border-b border-[#034F7530] hover:bg-[#D3E7F0] transition ${
                        index % 2 === 0 ? "bg-white" : "bg-[#D3E7F010]"
                      }`}
                    >
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={100}
                          height={100}
                          className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 object-cover rounded-md"
                          loading="lazy"
                        />
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <p className="font-medium text-gray-800 text-xs sm:text-sm lg:text-base truncate max-w-[100px] sm:max-w-[150px] lg:max-w-xs">
                          {item.title}
                        </p>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">
                        <p className="text-gray-600 text-xs sm:text-sm truncate max-w-[200px] lg:max-w-xs">
                          {item.description}
                        </p>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
                        {item.featureType && (
                          <span className="inline-block bg-[#034F75] text-white text-xs px-2 sm:px-3 py-1 rounded-full">
                            {item.featureType}
                          </span>
                        )}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 hidden lg:table-cell">
                        <div className="flex items-center text-gray-600 text-xs">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {formatDate(item.createdAt)}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <button
                            onClick={() => setSelectedImage(item)}
                            className="bg-[#034F75] cursor-pointer hover:bg-[#023a5a] text-white p-1.5 sm:p-2 rounded-md transition"
                            title="View Details"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={deleteLoading === item._id}
                            className="bg-red-600 cursor-pointer hover:bg-red-700 text-white p-1.5 sm:p-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            {deleteLoading === item._id ? (
                              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[#034F75] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-lg">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold">
                Image Details
              </h2>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 sm:p-2 cursor-pointer rounded-md transition hover:bg-[#023a5a]"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex justify-center bg-gray-100 rounded-lg p-3 sm:p-4">
                <Image
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  width={500}
                  height={500}
                  className="max-w-full max-h-[300px] sm:max-h-[400px] object-contain rounded-lg"
                />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-[#D3E7F0] rounded-lg p-3 sm:p-4">
                  <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                    Title
                  </label>
                  <p className="text-sm sm:text-base text-gray-800">
                    {selectedImage.title}
                  </p>
                </div>

                <div className="bg-[#D3E7F0] rounded-lg p-3 sm:p-4">
                  <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                    Description
                  </label>
                  <p className="text-sm sm:text-base text-gray-800">
                    {selectedImage.description}
                  </p>
                </div>

                {selectedImage.featureType && (
                  <div className="bg-[#D3E7F0] rounded-lg p-3 sm:p-4">
                    <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                      Feature Type
                    </label>
                    <span className="inline-block bg-[#034F75] text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                      {selectedImage.featureType}
                    </span>
                  </div>
                )}

                {selectedImage.selectedStyle &&
                  selectedImage.selectedStyle.length > 0 && (
                    <div className="bg-[#D3E7F0] rounded-lg p-3 sm:p-4">
                      <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                        Styles
                      </label>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {selectedImage.selectedStyle.map((style, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-[#034F75] text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full"
                          >
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="bg-[#D3E7F0] rounded-lg p-3 sm:p-4">
                  <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                    Created Date
                  </label>
                  <div className="flex items-center text-sm sm:text-base text-gray-800">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {formatDate(selectedImage.createdAt)}
                  </div>
                </div>

                {selectedImage.finalNotes && (
                  <div className="bg-[#D3E7F0] rounded-lg p-3 sm:p-4">
                    <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                      Notes
                    </label>
                    <p className="text-sm sm:text-base text-gray-800 italic">
                      {selectedImage.finalNotes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 sm:py-2.5 px-4 rounded-md transition text-sm sm:text-base"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedImage._id);
                    setSelectedImage(null);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 sm:py-2.5 px-4 rounded-md transition text-sm sm:text-base"
                >
                  Delete Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
