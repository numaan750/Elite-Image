"use client";
import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Loader2, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Draft = () => {
  const router = useRouter();

  const [draftProjects, setDraftProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Load draft projects from localStorage
  // Load draft projects from localStorage
  useEffect(() => {
    const loadDrafts = () => {
      try {
        const savedDrafts = localStorage.getItem("draftProjects");
        if (savedDrafts) {
          const drafts = JSON.parse(savedDrafts);

          // ✅ Filter: Old drafts + Empty drafts (without images)
          const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          const validDrafts = drafts.filter((draft) => {
            const draftTime = new Date(draft.lastEdited).getTime();
            const hasImages =
              draft.uploadedImages && draft.uploadedImages.length > 0;

            // ✅ SIRF WO DRAFTS DIKHAO JO:
            // 1. 7 din se purane nahi
            // 2. Images uploaded hon
            return draftTime > sevenDaysAgo && hasImages;
          });

          if (validDrafts.length !== drafts.length) {
            localStorage.setItem("draftProjects", JSON.stringify(validDrafts));
            console.log(
              "🧹 Cleaned",
              drafts.length - validDrafts.length,
              "invalid drafts",
            );
          }

          setDraftProjects(validDrafts);
        }
      } catch (error) {
        console.error("Error loading drafts:", error);
        localStorage.removeItem("draftProjects");
      } finally {
        setLoading(false);
      }
    };

    loadDrafts();
  }, []);

  const handleDelete = (id) => {
    setDeleteLoading(id);

    setTimeout(() => {
      try {
        const updatedDrafts = draftProjects.filter(
          (project) => project.id !== id,
        );
        setDraftProjects(updatedDrafts);
        localStorage.setItem("draftProjects", JSON.stringify(updatedDrafts));
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting draft:", error);
      } finally {
        setDeleteLoading(null);
      }
    }, 500);
  };

  const handleEdit = (project) => {
    localStorage.setItem("currentDraft", JSON.stringify(project));

    router.push(
      `/admin/uploadImage?type=${project.featureType}&mode=draft&draftId=${project.id}`,
    );
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === draftProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(draftProjects.map((p) => p.id));
    }
  };

  const handleSelectProject = (id) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id],
    );
  };

  const handleBulkDelete = () => {
    setDeleteLoading("bulk");

    setTimeout(() => {
      try {
        const updatedDrafts = draftProjects.filter(
          (project) => !selectedProjects.includes(project.id),
        );
        setDraftProjects(updatedDrafts);
        localStorage.setItem("draftProjects", JSON.stringify(updatedDrafts));
        setSelectedProjects([]);
        setIsSelectionMode(false);
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting drafts:", error);
      } finally {
        setDeleteLoading(null);
      }
    }, 500);
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
      <h2 className="text-base sm:text-[20px] font-medium text-black mt-14 sm:mt-16 lg:mt-15">
        Eliteimage Ai
      </h2>

      <div className="py-4 sm:py-6 lg:py-8 w-full">
        <div className="mb-2 sm:mb-4 lg:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-[20px] sm:text-[32px] lg:text-[28px] font-semibold text-black">
              Draft Projects
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Continue your incomplete projects
            </p>
          </div>

          {draftProjects.length > 0 && (
            <div className="flex gap-2 sm:gap-3">
              {!isSelectionMode ? (
                <button
                  onClick={() => setIsSelectionMode(true)}
                  className="px-3 cursor-pointer py-2 rounded-md bg-[#034F75] text-white hover:bg-[#023d5c] transition-colors text-[14px] sm:text-[16px]"
                >
                  Select Multiple
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-2 rounded-md cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors text-[14px] sm:text-[16px]"
                  >
                    Select All
                  </button>

                  <button
                    onClick={() => {
                      setIsSelectionMode(false);
                      setSelectedProjects([]);
                    }}
                    className="px-3 py-2 rounded-md cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors text-[14px] sm:text-[16px]"
                  >
                    Cancel
                  </button>

                  {selectedProjects.length > 0 && (
                    <button
                      onClick={() => {
                        setProjectToDelete("bulk");
                        setShowDeleteModal(true);
                      }}
                      className="px-3 py-2 rounded-md cursor-pointer bg-red-600 hover:bg-red-700 text-white transition-colors text-[14px] sm:text-[16px] flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete ({selectedProjects.length})
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {draftProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
            <div className="bg-[#D3E7F0] rounded-full p-6 mb-4">
              <Clock size={48} className="text-[#034F75]" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              No Draft Projects
            </h3>
            <p className="text-sm sm:text-base text-gray-600 text-center max-w-md">
              Your incomplete projects will appear here. Start a new project to
              see it in drafts.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {draftProjects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-xl border border-[#034F75] bg-[#D3E7F0] p-3 sm:p-4"
              >
                {isSelectionMode && (
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => handleSelectProject(project.id)}
                      className="w-5 h-5 cursor-pointer accent-[#034F75]"
                    />
                  </div>
                )}
                <div className="relative">
                  {" "}
                  {/* Yeh line already hai */}
                  {isSelectionMode && (
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(project.id)}
                        onChange={() => handleSelectProject(project.id)}
                        className="w-5 h-5 cursor-pointer accent-[#034F75]"
                      />
                    </div>
                  )}
                  <Image
                    src={
                      project.uploadedImages?.[0] ||
                      project.image ||
                      "/placeholder.png"
                    }
                    alt="draft project"
                    width={160}
                    height={160}
                    priority
                    loading="eager"
                    unoptimized
                    placeholder="blur"
                    blurDataURL="/placeholder.png"
                    className="h-30 w-30 sm:h-40 sm:w-40 rounded-lg object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-[16px] sm:text-[24px] font-medium text-black">
                        {project.featureType || "Untitled Project"}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Last edited:{" "}
                        {new Date(project.lastEdited).toLocaleDateString()} at{" "}
                        {new Date(project.lastEdited).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#034F75] h-2 rounded-full transition-all"
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      {project.progress || 0}%
                    </span>
                  </div> */}

                  <p className="text-[16px] sm:text-[18px] text-gray-600">
                    Images ({project.uploadedImages?.length || 0})
                    {/* {project.currentStep && (
                      <span className="ml-2 text-sm text-[#034F75]">
                        • Step: {project.currentStep.replace("step", "")}
                      </span>
                    )} */}
                  </p>

                  <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-5">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex items-center gap-2 cursor-pointer rounded-md bg-[#034F75] px-3 sm:px-4 py-2 text-[16px] sm:text-[18px] text-white hover:bg-[#023d5c] transition-colors"
                    >
                      <Pencil size={16} className="flex-shrink-0" />
                      <span className="whitespace-nowrap">
                        Continue Editing
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setProjectToDelete(project.id);
                        setShowDeleteModal(true);
                      }}
                      disabled={deleteLoading === project.id}
                      className="flex items-center cursor-pointer gap-2 rounded-md shadow-md bg-white px-3 sm:px-4 py-2 text-[16px] sm:text-[18px] text-[#FF1C20] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteLoading === project.id ? (
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

      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {projectToDelete === "bulk"
                ? "Delete Multiple Drafts"
                : "Delete Draft"}
            </h3>
            <p className="text-gray-600 mb-6">
              {projectToDelete === "bulk"
                ? `Are you sure you want to delete ${
                    selectedProjects.length
                  } draft${
                    selectedProjects.length > 1 ? "s" : ""
                  }? This action cannot be undone.`
                : "Are you sure you want to delete this draft? This action cannot be undone."}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  projectToDelete === "bulk"
                    ? handleBulkDelete()
                    : handleDelete(projectToDelete)
                }
                disabled={deleteLoading !== null}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
              >
                {deleteLoading !== null ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Draft;
