"use client";

import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draftProjects, setDraftProjects] = useState([]);
  const [images, setImages] = useState([]);
  const [projectCache, setProjectCache] = useState({});
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.token && !user) {
      handleGoogleLogin(session);
    }
  }, [session?.user?.token]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        setUser({
          ...parsedUser,
          credits: Number(parsedUser.credits) || 15,
        });
      } catch (error) {
        console.error("Error parsing user:", error);
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
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
    try {
      const res = await fetch("https://elite-image.vercel.app/api/loginUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (data._id) {
        const userToSave = {
          _id: data._id,
          name: data.username,
          email: data.email,
          credits: Number(data.credits) || 15,
        };

        setUser(userToSave);
        localStorage.setItem("user", JSON.stringify(userToSave));

        toast.success("Account created successfully!");
      }

      return data;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed");
      return { status: "error", message: error.message };
    }
  };

  const loginUser = async (email, password) => {
    const res = await fetch("https://elite-image.vercel.app/api/loginUser/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      if (data.user) {
        const userToSave = {
          _id: data.user._id,
          name: data.user.username || data.user.name,
          email: data.user.email,
          credits: Number(data.user.credits) || 15,
        };
        setUser(userToSave);
        localStorage.setItem("user", JSON.stringify(userToSave));
      }
      window.location.href = "/admin/dashboard";
    }

    return data;
  };

  const logoutUser = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("draftProjects");
      localStorage.removeItem("currentDraft");

      setToken(null);
      setUser(null);
      setDraftProjects([]);

      await signOut({ redirect: false });

      toast.success("Logged out successfully!");

      setTimeout(() => {
        window.location.href = "/";
      }, 300);
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear();
      setToken(null);
      setUser(null);
      window.location.href = "/";
    }
  };

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
    setImages((prev) => prev.filter((img) => img._id !== id));

    const res = await fetch(`${API_URL}/api/aiImagesmodels/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      await getAiImages();
      throw new Error("Failed to delete project");
    }
  };

  const getProjectById = async (projectId, useCache = true) => {
    if (useCache && projectCache[projectId]) {
      console.log("✅ Loading from cache (instant)");
      return projectCache[projectId];
    }
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
  const saveGeneratedImage = async (
    imageData,
    token,
    isUpdate = false,
    projectId = null,
  ) => {
    try {
      const isBulkSave = Array.isArray(imageData);

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
          },
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to update image");
        }

        const updatedProject = await response.json();

        setImages((prevImages) =>
          prevImages.map((img) =>
            img._id === projectId ? updatedProject : img,
          ),
        );
        try {
          const allDrafts = JSON.parse(
            localStorage.getItem("draftProjects") || "[]",
          );
          const updatedDrafts = allDrafts.filter(
            (draft) =>
              !(
                draft.projectId === projectId ||
                (draft.userId === imageData.userid &&
                  draft.featureType === imageData.featureType)
              ),
          );

          localStorage.setItem("draftProjects", JSON.stringify(updatedDrafts));
          console.log("✅ Draft deleted after update");
        } catch (error) {
          console.error("Error cleaning drafts:", error);
        }

        toast.success("Project updated successfully!");
        return updatedProject;
      }
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
        try {
          const allDrafts = JSON.parse(
            localStorage.getItem("draftProjects") || "[]",
          );
          const updatedDrafts = allDrafts.filter((draft) => {
            const matches = savedImages.some(
              (saved) =>
                draft.userId === saved.userid &&
                draft.featureType === saved.featureType,
            );
            return !matches;
          });

          if (allDrafts.length !== updatedDrafts.length) {
            localStorage.setItem(
              "draftProjects",
              JSON.stringify(updatedDrafts),
            );
            console.log(
              "✅ Bulk drafts cleaned:",
              allDrafts.length - updatedDrafts.length,
              "removed",
            );
          }
        } catch (error) {
          console.error("Error cleaning bulk drafts:", error);
        }

        return savedImages;
      } else {
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

        try {
          const allDrafts = JSON.parse(
            localStorage.getItem("draftProjects") || "[]",
          );
          const updatedDrafts = allDrafts.filter(
            (draft) =>
              !(
                draft.userId === imageData.userid &&
                draft.featureType === imageData.featureType &&
                Math.abs(new Date(draft.lastEdited).getTime() - Date.now()) <
                  300000
              ),
          );

          if (allDrafts.length !== updatedDrafts.length) {
            localStorage.setItem(
              "draftProjects",
              JSON.stringify(updatedDrafts),
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

      // ✅ Sirf ek baar setUser call karo
      const updatedUser = {
        _id: data.user._id || user._id,
        name: data.user.username || data.user.name,
        email: data.user.email,
        credits: Number(data.user.credits) || Number(user.credits) || 15,
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

  const saveDraft = (formData, currentStep) => {
    try {
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

      const savedDrafts = localStorage.getItem("draftProjects");
      const currentDrafts = savedDrafts ? JSON.parse(savedDrafts) : [];

      const existingIndex = currentDrafts.findIndex((d) => d.id === draftId);
      let updatedDrafts;

      if (existingIndex > -1) {
        updatedDrafts = [...currentDrafts];
        updatedDrafts[existingIndex] = draftProject;
        console.log("📝 Draft updated:", draftId);
      } else {
        updatedDrafts = [draftProject, ...currentDrafts];
        console.log("📝 New draft created:", draftId);
      }

      const uniqueDrafts = updatedDrafts.filter((draft, index, self) => {
        const firstIndex = self.findIndex(
          (d) =>
            d.userId === draft.userId &&
            d.featureType === draft.featureType &&
            d.id === draft.id,
        );
        return index === firstIndex;
      });

      localStorage.setItem("draftProjects", JSON.stringify(uniqueDrafts));
      setTimeout(() => {
        setDraftProjects(uniqueDrafts);
      }, 0);

      return draftId;
    } catch (error) {
      return formData.draftId || null;
    }
  };
  const deleteDraft = (draftId) => {
    setDraftProjects((prev) => {
      const updated = prev.filter((d) => d.id !== draftId);
      localStorage.setItem("draftProjects", JSON.stringify(updated));
      return updated;
    });
  };

  const handleGoogleLogin = async (session) => {
    try {
      console.log("🟢 handleGoogleLogin called:", session);

      if (!session?.user?.token) {
        console.error("❌ No token in session");
        return;
      }

      const userToSave = {
        _id: session.user._id,
        name: session.user.username || session.user.name,
        email: session.user.email,
        credits: Number(session.user.credits) || 15,
      };

      console.log("🟢 Saving user:", userToSave);

      setUser(userToSave);
      setToken(session.user.token);
      localStorage.setItem("user", JSON.stringify(userToSave));
      localStorage.setItem("token", session.user.token);

      toast.success("Google login successful! 🎉");

      setTimeout(() => {
        if (session.user.isNewUser) {
          window.location.href = "/register";
        } else {
          window.location.href = "/admin/dashboard";
        }
      }, 1000);
    } catch (error) {
      console.error("❌ Google login error:", error);
      toast.error("Google login failed");
    }
  };

  const calculateProgress = (currentStep, totalSteps) => {
    const stepMap = {
      step1: 1,
      step2: 2,
      step3: 3,
      step4: 4,
      step5: 5,
    };

    const stepNumber = stepMap[currentStep] || 1;
    const total = totalSteps > 0 ? totalSteps + 2 : 5;
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
        getProjectById,
        saveDraft,
        deleteDraft,
        handleGoogleLogin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
