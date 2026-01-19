"use client";

import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast"; // ← YE LINE ADD KARO

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draftProjects, setDraftProjects] = useState([]);
  const [images, setImages] = useState([]);
  const [projectCache, setProjectCache] = useState({}); // ← YE LINE ADD KARO (Line 17)
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user"); // ← YE LINE ADD KARO

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      // ← YE BLOCK ADD KARO
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user:", error);
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
    // Load drafts from localStorage
    const savedDrafts = localStorage.getItem("draftProjects");
    if (savedDrafts) {
      try {
        setDraftProjects(JSON.parse(savedDrafts));
      } catch (error) {
        console.error("Error parsing drafts:", error);
        localStorage.removeItem("draftProjects");
      }
    }
  }, []);

  const signupUser = async (username, email, password) => {
    const res = await fetch("https://elite-image.vercel.app/api/loginUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    return await res.json();
  };

  const loginUser = async (email, password) => {
    const res = await fetch(
      "https://elite-image.vercel.app/api/loginUser/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      if (data.user) {
        const userToSave = {
          _id: data.user._id,
          name: data.user.username || data.user.name,
          email: data.user.email,
        };
        setUser(userToSave);
        localStorage.setItem("user", JSON.stringify(userToSave));
      }
      window.location.href = "/admin/dashboard";
    }

    return data;
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ← YE LINE ADD KARO
    setToken(null);
    setUser(null);
    window.location.href = "/";
  };

  // Fetch all aiImages from backend
  const getAiImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/aiImagesmodels`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch images");

      const data = await res.json();
      setImages(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteImages = async (id) => {
    // UI se remove (optimistic)
    setImages((prev) => prev.filter((img) => img._id !== id));

    const res = await fetch(`${API_URL}/api/aiImagesmodels/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      await getAiImages(); // restore list
      throw new Error("Failed to delete project");
    }
  };

  // ✅ ADD THIS NEW FUNCTION
  // ✅ UPDATED getProjectById with CACHE
  const getProjectById = async (projectId, useCache = true) => {
    // ✅ STEP 1: Pehle cache check karo
    if (useCache && projectCache[projectId]) {
      console.log("✅ Loading from cache (instant)");
      return projectCache[projectId];
    }

    // ✅ STEP 2: Cache mein nahi hai to API call karo
    console.log("📡 Fetching from API...");
    try {
      const res = await fetch(`${API_URL}/api/aiImagesmodels/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch project");

      const project = await res.json();

      // ✅ STEP 3: Cache mein save karo
      setProjectCache((prev) => ({
        ...prev,
        [projectId]: project,
      }));

      return project;
    } catch (err) {
      console.error("Fetch project error:", err);
      throw err;
    }
  };

  // ✅ UPDATE THIS FUNCTION (modify existing saveGeneratedImage)
  const saveGeneratedImage = async (
    imageData,
    token,
    isUpdate = false,
    projectId = null
  ) => {
    try {
      const isBulkSave = Array.isArray(imageData);

      // UPDATE mode
      if (isUpdate && projectId) {
        const response = await fetch(
          `${API_URL}/api/aiImagesmodels/${projectId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(imageData),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to update image");
        }

        const updatedProject = await response.json();

        setImages((prevImages) =>
          prevImages.map((img) =>
            img._id === projectId ? updatedProject : img
          )
        );

        // ✅ FIX: Delete draft after update
        try {
          const allDrafts = JSON.parse(
            localStorage.getItem("draftProjects") || "[]"
          );
          const updatedDrafts = allDrafts.filter(
            (draft) =>
              !(
                draft.projectId === projectId ||
                (draft.userId === imageData.userid &&
                  draft.featureType === imageData.featureType)
              )
          );

          localStorage.setItem("draftProjects", JSON.stringify(updatedDrafts));
          console.log("✅ Draft deleted after update");
        } catch (error) {
          console.error("Error cleaning drafts:", error);
        }

        toast.success("Project updated successfully!");
        return updatedProject;
      }

      // BULK SAVE mode
      if (isBulkSave) {
        const savedImages = [];
        for (const data of imageData) {
          const response = await fetch(`${API_URL}/api/aiImagesmodels`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to save image");
          }

          const result = await response.json();
          savedImages.push(result);
        }

        setImages((prevImages) => [...savedImages, ...prevImages]);

        // ✅ FIX: Delete all related drafts after bulk save
        try {
          const allDrafts = JSON.parse(
            localStorage.getItem("draftProjects") || "[]"
          );
          const updatedDrafts = allDrafts.filter((draft) => {
            // Check if draft matches any saved project
            const matches = savedImages.some(
              (saved) =>
                draft.userId === saved.userid &&
                draft.featureType === saved.featureType
            );
            return !matches;
          });

          if (allDrafts.length !== updatedDrafts.length) {
            localStorage.setItem(
              "draftProjects",
              JSON.stringify(updatedDrafts)
            );
            console.log(
              "✅ Bulk drafts cleaned:",
              allDrafts.length - updatedDrafts.length,
              "removed"
            );
          }
        } catch (error) {
          console.error("Error cleaning bulk drafts:", error);
        }

        return savedImages;
      } else {
        // SINGLE SAVE mode
        const response = await fetch(`${API_URL}/api/aiImagesmodels`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(imageData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to save image");
        }

        const savedProject = await response.json();

        setImages((prevImages) => [savedProject, ...prevImages]);

        // ✅ FIX: Improved draft cleanup for single save
        try {
          const allDrafts = JSON.parse(
            localStorage.getItem("draftProjects") || "[]"
          );
          const updatedDrafts = allDrafts.filter(
            (draft) =>
              !(
                draft.userId === imageData.userid &&
                draft.featureType === imageData.featureType &&
                Math.abs(new Date(draft.lastEdited).getTime() - Date.now()) <
                  300000
              ) // 5 minutes
          );

          if (allDrafts.length !== updatedDrafts.length) {
            localStorage.setItem(
              "draftProjects",
              JSON.stringify(updatedDrafts)
            );
            localStorage.removeItem("currentDraft");
            console.log("✅ Related draft cleaned from AppContext");
          }
        } catch (error) {
          console.error("Error cleaning drafts:", error);
        }

        return savedProject;
      }
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  //profile k liya
  const updateProfile = async (userId, userData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/loginUser/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setUser((prev) => ({
        ...prev,
        ...data.user,
      }));

      const updatedUser = {
        _id: data.user._id || user._id,
        name: data.user.username || data.user.name,
        email: data.user.email,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully!");
      return { success: true, data: data.user };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update Password Function
  const updatePassword = async (userId, passwordData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/loginUser/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Password updated successfully!");
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Save draft function
  // Save draft function
  // Save draft function - ✅ IMPROVED VERSION
  const saveDraft = (formData, currentStep) => {
    try {
      // ✅ Get existing draftId from URL or formData
      const existingDraftId = formData.draftId;
      const draftId =
        existingDraftId ||
        `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const draftProject = {
        id: draftId,
        ...formData,
        draftId: draftId,
        currentStep: currentStep,
        lastEdited: new Date().toISOString(),
        progress: calculateProgress(currentStep, formData.totalSteps),
      };

      // ✅ FIX: Direct localStorage operation without state update during render
      const savedDrafts = localStorage.getItem("draftProjects");
      const currentDrafts = savedDrafts ? JSON.parse(savedDrafts) : [];

      const existingIndex = currentDrafts.findIndex((d) => d.id === draftId);
      let updatedDrafts;

      if (existingIndex > -1) {
        // Update existing draft
        updatedDrafts = [...currentDrafts];
        updatedDrafts[existingIndex] = draftProject;
        console.log("📝 Draft updated:", draftId);
      } else {
        // Add new draft
        updatedDrafts = [draftProject, ...currentDrafts];
        console.log("📝 New draft created:", draftId);
      }

      // Remove duplicates based on userId + featureType
      const uniqueDrafts = updatedDrafts.filter((draft, index, self) => {
        const firstIndex = self.findIndex(
          (d) =>
            d.userId === draft.userId &&
            d.featureType === draft.featureType &&
            d.id === draft.id
        );
        return index === firstIndex;
      });

      // Save to localStorage
      localStorage.setItem("draftProjects", JSON.stringify(uniqueDrafts));

      // ✅ Schedule state update for next tick (avoid render-time setState)
      setTimeout(() => {
        setDraftProjects(uniqueDrafts);
      }, 0);

      return draftId;
    } catch (error) {
      console.error("Error in saveDraft:", error);
      return formData.draftId || null;
    }
  };

  // Delete draft function
  const deleteDraft = (draftId) => {
    setDraftProjects((prev) => {
      const updated = prev.filter((d) => d.id !== draftId);
      localStorage.setItem("draftProjects", JSON.stringify(updated));
      return updated;
    });
  };

  // Calculate progress helper
  const calculateProgress = (currentStep, totalSteps) => {
    const stepMap = {
      step1: 1,
      step2: 2,
      step3: 3,
      step4: 4,
      step5: 5,
    };

    const stepNumber = stepMap[currentStep] || 1;
    const total = totalSteps > 0 ? totalSteps + 2 : 5; // +2 for step4 and step5
    return Math.round((stepNumber / total) * 100);
  };

  useEffect(() => {
    if (token) {
      getAiImages();
    }
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        images,
        draftProjects,
        getAiImages,
        deleteImages,
        saveGeneratedImage,
        signupUser,
        loginUser,
        logoutUser,
        updateProfile,
        updatePassword,
        getProjectById, // ← YE LINE ADD KARO
        saveDraft,
        deleteDraft,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
