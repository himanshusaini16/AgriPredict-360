import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const Profile = () => {
  const {
    userData,
    setUserData,
    backendUrl,
    getProfile,
    totalPrediction,
    totalCropPredict,
    totalDiseasePredict,
    fetchCropHistory,
    fetchDiseaseHistory,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    getProfile();
    fetchCropHistory();
    fetchDiseaseHistory();
  }, []);

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-lg">
          Please login to view your profile.
        </p>
      </div>
    );
  }

  // ✏️ Start editing
  const handleEditClick = () => {
    setName(userData.name || "");
    setIsEditing(true);
  };

  // 💾 Save name
  const handleSaveName = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      await axios.put(
        `${backendUrl}/api/users/${userData.id}/update-name`,
        null,
        {
          params: { username: name },
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      await getProfile();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update name", err);
    } finally {
      setLoading(false);
    }
  };

  // 📷 Click avatar ONLY when editing
  const handleAvatarClick = () => {
    if (!isEditing) return;
    fileInputRef.current.click();
  };

  // 🖼 Upload image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);

      await axios.post(
        `${backendUrl}/api/users/${userData.id}/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await getProfile();
      URL.revokeObjectURL(previewUrl);
      setPreviewImage(null);
    } catch (err) {
      console.error("Image upload failed", err);
      setPreviewImage(null);
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    setUserData(null);
    navigate("/login");
  };

  const username = userData.name || "";
  const userInitial = username.charAt(0)?.toUpperCase() || "U";
  const profileImage = userData.Image || userData.imageUrl || "";

  return (
    <div className="bg-green-50 min-h-[60vh] py-16 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8">

        {/* 👤 PROFILE HEADER */}
        <div className="text-center mb-8">

          {/* Avatar */}
          <div
            onClick={handleAvatarClick}
            className={`relative w-24 h-24 mx-auto mb-4
              ${isEditing ? "cursor-pointer" : "cursor-default"}`}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-green-600"
              />
            ) : profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-green-600"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-green-700 text-white flex items-center justify-center text-4xl font-bold">
                {userInitial}
              </div>
            )}

            {/* 📷 CAMERA ICON — ONLY WHEN EDITING */}
            {isEditing && (
              <span className="absolute bottom-0 right-0 bg-green-700 text-white p-1.5 rounded-full text-xs shadow">
                📷
              </span>
            )}
          </div>

          {/* Hidden input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Username */}
          {isEditing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center border rounded-lg px-3 py-2 w-full max-w-xs mx-auto block
                         focus:ring-2 focus:ring-green-500"
              autoFocus
            />
          ) : (
            <h2 className="text-2xl font-extrabold text-green-800">
              {username}
            </h2>
          )}

          <p className="text-gray-600 text-sm">{userData.email}</p>
        </div>

        {/* 📊 INFO GRID */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500">Role</p>
            <p className="font-semibold text-green-700">Farmer</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500">Location</p>
            <p className="font-semibold text-green-700">India</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500">Joined</p>
            <p className="font-semibold text-green-700">2025</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 text-center space-y-1">
            <p className="text-xs text-gray-500">Predictions</p>
            <p className="text-xl font-extrabold text-green-700">
              {totalPrediction}
            </p>
            <div className="flex justify-center gap-3 text-xs">
              <span className="text-green-700 font-semibold">
                🌱 {totalCropPredict}
              </span>
              <span className="text-red-600 font-semibold">
                🦠 {totalDiseasePredict}
              </span>
            </div>
          </div>
        </div>

        {/* 🔘 ACTIONS */}
        <div className="space-y-4">
          {isEditing ? (
            <button
              onClick={handleSaveName}
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800"
            >
              💾 Save Changes
            </button>
          ) : (
            <button
              onClick={handleEditClick}
              className="w-full border border-green-600 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-50"
            >
              ✏️ Edit Profile
            </button>
          )}

          <button
            onClick={() => navigate("/history")}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800"
          >
            📜 View Prediction History
          </button>

          <button
            onClick={handleLogout}
            className="w-full border border-red-500 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
