"use client";
import React, { useState, useContext } from "react";
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const RecentProjects = () => {
  const router = useRouter();

  const { images, loading, error, getAiImages, deleteImages } =
    useContext(AppContext);

  const [deleteLoading, setDeleteLoading] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting project...");
    setDeleteLoading(id);

    try {
      await deleteImages(id);
      toast.success("Project deleted successfully ✅", {
        id: toastId,
      });
    } catch (err) {
      toast.error("Delete failed ❌", { id: toastId });
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-[#034F75]" />
      </div>
    );
  }
  return (
    <div className="mt-10 sm:mt-12 lg:mt-14 ">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-[20px] sm:text-[28px] lg:text-[28px] font-semibold text-black">
          Recent Projects
        </h2>

        <Link href="/admin/projects">
          <button className="rounded-md cursor-pointer bg-[#0B5C7A] px-3 py-2 text-[16px] sm:text-[16px] text-white w-fit hover:bg-[#034F75] transition-colors">
            View All
          </button>
        </Link>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {images
          .slice() // copy banayi (important)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
          .slice(0, 5) // sirf 5
          .map((project) => (
            <div
              key={project._id}
              className="flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-xl border border-[#034F75] bg-[#D3E7F0] p-3 sm:p-4"
            >
              <Image
                src={
                  project.image ||
                  project.uploadedImages?.[0] || // ✅ SKY REPLACEMENT FIX
                  "/placeholder.png"
                }
                alt="project"
                width={112}
                height={112}
                className="h-30 w-30 sm:h-35 sm:w-35 rounded-lg object-cover flex-shrink-0"
              />

              <div className="flex flex-1 flex-col justify-between gap-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[16px] sm:text-[24px] font-medium text-black">
                    {project.featureType || "Unknown Feature"}
                  </p>
                  <span className="text-sm sm:text-base text-gray-600 whitespace-nowrap">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[16px] sm:text-[18px] text-gray-600 mb-2">
                  Images ({project.uploadedImages?.length || 1})
                </p>

                <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-5">
                  <Link
                    href={`/admin/step4?mode=view&projectId=${project._id}`}
                    className="flex cursor-pointer items-center gap-2 rounded-md bg-[#034F75] px-3 sm:px-4 py-2 text-[16px] sm:text-[18px] text-white hover:bg-[#023d5c] transition-colors"
                  >
                    <Eye size={16} className="flex-shrink-0" />
                    <span className="whitespace-nowrap">View Results</span>
                  </Link>

                  <Link
                    href={`/admin/edit-project?mode=edit&projectId=${
                      project._id
                    }&featureType=${encodeURIComponent(project.featureType)}`}
                    className="flex items-center gap-2 rounded-md bg-[#034F75] px-3 sm:px-4 py-2 text-[16px] sm:text-[18px] text-white hover:bg-[#023d5c] transition-colors"
                  >
                    <Pencil size={16} className="flex-shrink-0" />
                    <span className="whitespace-nowrap">Re-Edit</span>
                  </Link>

                  <button
                    onClick={() => {
                      setProjectToDelete(project._id);
                      setShowDeleteModal(true);
                    }}
                    disabled={deleteLoading === project._id}
                    className="flex items-center gap-2 cursor-pointer rounded-md shadow-md bg-white px-3 sm:px-4 py-2 text-[16px] sm:text-[18px] text-[#FF1C20] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading === project._id ? (
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

      {selectedProject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[#034F75] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-lg z-10">
              <h2 className="text-lg sm:text-xl font-semibold">
                Project Details
              </h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="hover:bg-[#023d5c] p-2 rounded-md transition cursor-pointer text-lg sm:text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 bg-gray-100 rounded-lg p-3 sm:p-4">
                {selectedProject.uploadedImages?.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`Image ${idx + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-32 sm:h-40 object-cover rounded-lg"
                  />
                ))}
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-[#D3E7F0] rounded-lg p-3 sm:p-4">
                  <label className="block text-xs sm:text-sm font-semibold mb-2">
                    Title
                  </label>
                  <p className="text-sm sm:text-base text-gray-800 break-words">
                    {selectedProject.title}
                  </p>
                </div>

                <div className="bg-[#D3E7F0] rounded-lg p-3 sm:p-4">
                  <label className="block text-xs sm:text-sm font-semibold mb-2">
                    Description
                  </label>
                  <p className="text-sm sm:text-base text-gray-800 break-words">
                    {selectedProject.description}
                  </p>
                </div>

                {selectedProject.featureType && (
                  <div className="bg-[#D3E7F0] rounded-lg p-3 sm:p-4">
                    <label className="block text-xs sm:text-sm font-semibold mb-2">
                      Feature Type
                    </label>
                    <span className="inline-block bg-[#034F75] text-white text-xs sm:text-sm px-3 py-1 rounded-full">
                      {selectedProject.featureType}
                    </span>
                  </div>
                )}

                {selectedProject.selectedStyle?.length > 0 && (
                  <div className="bg-[#D3E7F0] rounded-lg p-3 sm:p-4">
                    <label className="block text-xs sm:text-sm font-semibold mb-2">
                      Styles
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.selectedStyle.map((style, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-[#034F75] text-white text-xs sm:text-sm px-3 py-1 rounded-full"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProject.selectedFeature?.length > 0 && (
                  <div className="bg-[#D3E7F0] rounded-lg p-3 sm:p-4">
                    <label className="block text-xs sm:text-sm font-semibold mb-2">
                      Selected Features
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.selectedFeature.map((feature, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-[#0B5C7A] text-white text-xs sm:text-sm px-3 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Delete Project
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this project? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  handleDelete(projectToDelete);
                }}
                disabled={deleteLoading === projectToDelete}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
              >
                {deleteLoading === projectToDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentProjects;
