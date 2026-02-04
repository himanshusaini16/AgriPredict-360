import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";

import {
  FaCamera,
  FaSave,
  FaEdit,
  FaHistory,
  FaSignOutAlt,
  FaSeedling,
  FaBug,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

import { toast } from "react-toastify";

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

  const handleEditClick = () => {
    setName(userData.name || "");
    setIsEditing(true);
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      toast.warning("Name cannot be empty");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `${backendUrl}/api/users/${userData.id}/update-name`,
        null,
        {
          params: { username: name },
          headers: { Authorization: `Bearer ${userData.token}` },
        },
      );

      await getProfile();
      setIsEditing(false);

      toast.success("Profile name updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    if (!isEditing) return;
    fileInputRef.current.click();
  };

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
        },
      );

      await getProfile();
      toast.success("Profile image updated");

      URL.revokeObjectURL(previewUrl);
      setPreviewImage(null);
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
      setPreviewImage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setUserData(null);
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const username = userData.name || "";
  const userInitial = username.charAt(0)?.toUpperCase() || "U";
  const profileImage = userData.Image || userData.imageUrl || "";

  return (
    <div className="bg-green-50 min-h-[60vh] py-16 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div
            onClick={handleAvatarClick}
            className={`relative w-24 h-24 mx-auto mb-4 ${
              isEditing ? "cursor-pointer" : "cursor-default"
            }`}
          >
            {previewImage ? (
              <img
                src={previewImage}
                className="w-24 h-24 rounded-full object-cover border-2 border-green-600"
              />
            ) : profileImage ? (
              <img
                src={profileImage}
                className="w-24 h-24 rounded-full object-cover border-2 border-green-600"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-green-700 text-white flex items-center justify-center text-4xl font-bold">
                {userInitial}
              </div>
            )}

            {isEditing && (
              <span className="absolute bottom-0 right-0 bg-green-700 text-white p-1.5 rounded-full text-xs shadow">
                <FaCamera />
              </span>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {isEditing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center border rounded-lg px-3 py-2 w-full max-w-xs mx-auto block focus:ring-2 focus:ring-green-500"
              autoFocus
            />
          ) : (
            <h2 className="text-2xl font-extrabold text-green-800">
              {username}
            </h2>
          )}

          <p className="text-gray-600 text-sm">{userData.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <InfoCard icon={<FaUser />} label="Role" value="Farmer" />
          <InfoCard icon={<FaMapMarkerAlt />} label="Location" value="India" />
          <InfoCard icon={<FaCalendarAlt />} label="Joined" value="2025" />
          <div className="bg-green-50 rounded-lg p-4 text-center space-y-1">
            <p className="text-xs text-gray-500">Predictions</p>
            <p className="text-xl font-extrabold text-green-700">
              {totalPrediction}
            </p>
            <div className="flex justify-center gap-3 text-xs">
              <span className="text-green-700 font-semibold flex items-center gap-1">
                <FaSeedling /> {totalCropPredict}
              </span>
              <span className="text-red-600 font-semibold flex items-center gap-1">
                <FaBug /> {totalDiseasePredict}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {isEditing ? (
            <button
              onClick={handleSaveName}
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 flex items-center justify-center gap-2"
            >
              <FaSave />
              Save Changes
            </button>
          ) : (
            <button
              onClick={handleEditClick}
              className="w-full border border-green-600 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-50 flex items-center justify-center gap-2"
            >
              <FaEdit />
              Edit Profile
            </button>
          )}

          <button
            onClick={() => navigate("/history")}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 flex items-center justify-center gap-2"
          >
            <FaHistory />
            View Prediction History
          </button>

          <button
            onClick={handleLogout}
            className="w-full border border-red-500 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 flex items-center justify-center gap-2"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-green-50 rounded-lg p-4 text-center">
    <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
      {icon} {label}
    </p>
    <p className="font-semibold text-green-700">{value}</p>
  </div>
);

export default Profile;
