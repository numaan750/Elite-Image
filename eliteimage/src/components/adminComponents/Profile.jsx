"use client";
import { AppContext } from "@/context/AppContext";
import React, { useContext, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Profile() {
  const { user, updateProfile, updatePassword, loading } =
    useContext(AppContext);

  if (loading) {
    return <p className="p-6">Loading profile...</p>;
  }

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    console.log(profileData);

    if (!user?._id) {
      toast.error("Session expired. Please login again.");
      return;
    }

    if (!profileData.name || !profileData.email) {
      toast.error("Please fill all fields");
      return;
    }

    await updateProfile(user._id, profileData);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    console.log(passwordData);

    if (!user?._id) {
      toast.error("Session expired. Please login again.");
      return;
    }

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    const result = await updatePassword(user._id, {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });

    if (result.success) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 sm:px-10 py-7">
      <Toaster position="top-right" />
      <h3 className="text-[16px] sm:text-[20px] font-semibold mb-6 sm:mb-15">
        Eliteimage Ai
      </h3>
      <h2 className="text-[20px] sm:text-[24px] font-semibold mb-6 sm:mb-8">
        Account Settings
      </h2>
      <div className="max-w-full sm:max-w-3xl space-y-6 sm:space-y-10">
        <div className="rounded-lg bg-[#D3E7F0] p-4 sm:p-6">
          <h3 className="font-semibold mb-4">Personal Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm mb-1">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    name: e.target.value,
                  })
                }
                disabled={loading}
                className="w-full rounded-md border border-[#034F7580] bg-[#D3E7F0] px-3 sm:px-4 py-2 focus:outline-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">E-mail</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    email: e.target.value,
                  })
                }
                disabled={loading}
                className="w-full rounded-md border border-[#034F7580] bg-[#D3E7F0] px-4 py-2 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              onClick={handleProfileUpdate}
              disabled={loading}
              className="mt-2 sm:mt-4 w-full sm:w-auto rounded-md bg-[#034F75] px-3 sm:px-4 py-2 sm:py-2.5 text-[14px] sm:text-[16px] font-medium text-white hover:bg-[#023a5a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-[#D3E7F0] p-6">
          <h2 className="font-semibold mb-4">Change Password</h2>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm mb-1">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                disabled={loading}
                className="w-full rounded-md border border-[#034F7580] bg-[#D3E7F0] px-4 py-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                disabled={loading}
                className="w-full rounded-md border border-[#034F7580] bg-[#D3E7F0] px-4 py-2 focus:outline-none"
              />
              <p className="mt-1 text-[10px] sm:text-xs text-gray-600">
                Use 8 or more characters with a mix of letters, numbers &
                symbols
              </p>
            </div>

            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                disabled={loading}
                className="w-full rounded-md border border-[#034F7580] bg-[#D3E7F0] px-4 py-2 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              onClick={handlePasswordUpdate}
              disabled={loading}
              className="mt-2 sm:mt-4 w-full sm:w-auto rounded-md bg-[#034F75] px-3 sm:px-4 py-2 sm:py-2.5 text-[14px] sm:text-[16px] font-medium text-white hover:bg-[#023a5a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
