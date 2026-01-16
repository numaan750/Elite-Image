"use client";
import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Loader2, Clock } from "lucide-react";
import Image from "next/image";

const Draft = () => {
  const [draftProjects, setDraftProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Load draft projects from localStorage
  useEffect(() => {
    const loadDrafts = () => {
      try {
        const savedDrafts = localStorage.getItem("draftProjects");
        if (savedDrafts) {
          setDraftProjects(JSON.parse(savedDrafts));
        }
      } catch (error) {
        console.error("Error loading drafts:", error);
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
          (project) => project.id !== id
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
    // Save current step and project data to localStorage for editing
    localStorage.setItem("editingDraft", JSON.stringify(project));
    
    // Redirect to the step where user left off
    const currentStep = project.currentStep || "step1";
    window.location.href = `/admin/${currentStep}?mode=draft&draftId=${project.id}`;
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
                <div className="relative">
                  <Image
                    src={
                      project.uploadedImages?.[0] ||
                      project.image ||
                      "/placeholder.png"
                    }
                    alt="draft project"
                    width={112}
                    height={112}
                    className="h-30 w-30 sm:h-35 sm:w-35 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Draft
                  </div>
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

                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#034F75] h-2 rounded-full transition-all"
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      {project.progress || 0}%
                    </span>
                  </div>

                  <p className="text-[16px] sm:text-[18px] text-gray-600">
                    Images ({project.uploadedImages?.length || 0})
                    {project.currentStep && (
                      <span className="ml-2 text-sm text-[#034F75]">
                        • Step: {project.currentStep.replace("step", "")}
                      </span>
                    )}
                  </p>

                  <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-5">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex items-center gap-2 cursor-pointer rounded-md bg-[#034F75] px-3 sm:px-4 py-2 text-[16px] sm:text-[18px] text-white hover:bg-[#023d5c] transition-colors"
                    >
                      <Pencil size={16} className="flex-shrink-0" />
                      <span className="whitespace-nowrap">Continue Editing</span>
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
              Delete Draft
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this draft? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDelete(projectToDelete)}
                disabled={deleteLoading === projectToDelete}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
              >
                {deleteLoading === projectToDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Draft;