"use client";

import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast"; // ← YE LINE ADD KARO

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);

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
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/aiImagesmodels/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete image");
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
    setImages((prev) => prev.filter((img) => img._id !== id));
  };

  // ✅ ADD THIS NEW FUNCTION
const getProjectById = async (projectId) => {
  try {
    const res = await fetch(`${API_URL}/api/aiImagesmodels/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch project");
    return await res.json();
  } catch (err) {
    console.error("Fetch project error:", err);
    throw err;
  }
};

// ✅ UPDATE THIS FUNCTION (modify existing saveGeneratedImage)
const saveGeneratedImage = async (imageData, token, isUpdate = false, projectId = null) => {
  try {
    const isBulkSave = Array.isArray(imageData);

    // ✅ NEW: Handle UPDATE mode
    if (isUpdate && projectId) {
      const response = await fetch(`${API_URL}/api/aiImagesmodels/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(imageData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update image");
      }

      toast.success("Project updated successfully!");
      return await response.json();
    }

    // Existing save logic...
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

      return await response.json();
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
        getAiImages,
        deleteImages,
        saveGeneratedImage,
        signupUser,
        loginUser,
        logoutUser,
        updateProfile,
        updatePassword,
        getProjectById, // ← YE LINE ADD KARO
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
