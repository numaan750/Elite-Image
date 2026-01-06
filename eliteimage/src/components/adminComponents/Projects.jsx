"use client";
import React, { useState, useContext } from "react";
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AppContext } from "@/context/AppContext";

// const projects = [
//   {
//     id: 1,
//     image: "/projects/projects-1.png",
//     date: "03/12/2025",
//   },
//   {
//     id: 2,
//     image: "/projects/projects-2.png",
//     date: "03/12/2025",
//   },
//   {
//     id: 3,
//     image: "/projects/projects-3.png",
//     date: "03/12/2025",
//   },
// ];

const Projects = () => {
  const { images, loading, getAiImages, deleteImages } = useContext(AppContext);

  const [deleteLoading, setDeleteLoading] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    setDeleteLoading(id);
    try {
      await deleteImages(id);
    } catch (err) {
      alert("Delete failed");
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
    <>
      <h2 className="text-base sm:text-lg font-semibold text-black px-4 sm:px-6 lg:px-9 py-3 sm:py-4">
        Eliteimage Ai
      </h2>

      <div className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 lg:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-black">
            My Projects
          </h2>

          <button
            onClick={getAiImages}
            className="rounded-md cursor-pointer bg-[#0B5C7A] px-4 py-1.5 text-sm sm:text-base text-white hover:bg-[#034F75] transition-colors w-full sm:w-auto"
          >
            Refresh
          </button>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {images.map((project) => (
            <div
              key={project._id}
              className="flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-xl border border-[#034F75] bg-[#D3E7F0] p-3 sm:p-4"
            >
              <Image
                src={project.image}
                alt="project"
                width={112}
                height={112}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-lg object-cover flex-shrink-0"
              />

              <div className="flex flex-1 flex-col justify-between gap-3">
                <div>
                  <p className="text-sm sm:text-base font-medium text-black">
                    Project: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Multiple Image
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-5">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center cursor-pointer gap-2 rounded-md bg-[#034F75] px-3 sm:px-4 py-2 text-sm sm:text-base text-white hover:bg-[#023d5c] transition-colors"
                  >
                    <Eye size={16} className="flex-shrink-0" />
                    <span className="whitespace-nowrap">View Results</span>
                  </button>

                  <Link
                    href={`/admin/uploadImageTabs?type=${encodeURIComponent(
                      project.featureType
                    )}&editMode=true&projectId=${project._id}`}
                    className="flex items-center gap-2 rounded-md bg-[#034F75] px-3 sm:px-4 py-2 text-sm sm:text-base text-white hover:bg-[#023d5c] transition-colors"
                  >
                    <Pencil size={16} className="flex-shrink-0" />
                    <span className="whitespace-nowrap">Re-Edit</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(project._id)}
                    disabled={deleteLoading === project._id}
                    className="flex items-center cursor-pointer gap-2 rounded-md shadow-md bg-white px-3 sm:px-4 py-2 text-sm sm:text-base text-[#FF1C20] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                aria-label="Close Project Details"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex justify-center bg-gray-100 rounded-lg p-3 sm:p-4">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  width={400}
                  height={400}
                  className="max-w-full max-h-[300px] sm:max-h-[400px] object-contain rounded-lg"
                />
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
    </>
  );
};

export default Projects;
