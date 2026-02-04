import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [cropHistory, setCropHistory] = useState([]);
  const [diseaseHistory, setDiseaseHistory] = useState([]);

  const [totalCropPredict, setTotalCropPredict] = useState(0);
  const [totalDiseasePredict, setTotalDiseasePredict] = useState(0);
  const [totalPrediction, setTotalPrediction] = useState(0);
  

  const auth = JSON.parse(localStorage.getItem("token"));
  const token = auth?.token;
  const userId = auth?.id;

  console.log("userid from appconetxt",userId)

  
  const getProfile = async () => {
    try {
      if (!token || !userId) {
        console.log("❌ No auth found");
        setLoading(false);
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ getProfile success:", data);
      setUserData({ ...data, token }); // keep token in memory
    } catch (error) {
      console.error(
        "❌ getProfile error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };


  const deleteCropPrediction = async (predictionId) => {
  await axios.delete(
    `${backendUrl}/api/crop/delete-crop/${predictionId}`
  );
  fetchCropHistory(); // refresh
};

const deleteDiseasePrediction = async (predictionId) => {
  await axios.delete(
    `${backendUrl}/api/crop/disease/${predictionId}`
  );
  fetchDiseaseHistory(); // refresh
};





/**
 * 🦠 Disease prediction using ML model (multipart/form-data)
 */
const getDiseaseFromModel = async (imageFile) => {
  const formData = new FormData();

  formData.append("image", imageFile); // ✅ must match backend
  formData.append(
    "userId",
    userId // ✅ same as Postman
  );

  const response = await axios.post(`${backendUrl}/api/crop/predict-disease`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });



  return response.data;
};



const getMedicineFromChatbot = async (diseaseResult) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!diseaseResult || diseaseResult.label === "Healthy") {
        resolve("No medicine required. Crop is healthy 🌱");
      } else {
        resolve(
          "Spray Mancozeb 75% WP twice at 7-day interval. Ensure proper irrigation."
        );
      }
    }, 1200);
  });
};

const fetchCropHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get(
        `${backendUrl}/api/crop/all-crop/${userId}`
      );

      setCropHistory(res.data);
      setTotalCropPredict(res.data.length);
    } catch (err) {
      console.error("❌ Failed to fetch crop history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchDiseaseHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get(
        `${backendUrl}/api/crop/disease/${userId}`
      );

      setDiseaseHistory(res.data);
      setTotalDiseasePredict(res.data.length);
    } catch (err) {
      console.error("❌ Failed to fetch disease history");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    setTotalPrediction(totalCropPredict + totalDiseasePredict);
  }, [totalCropPredict, totalDiseasePredict]);


  useEffect(() => {
    getProfile();
  }, []);

  const value = {
    backendUrl,
    userData,
    setUserData,
    getProfile,
    loading,
    getDiseaseFromModel,
    getMedicineFromChatbot,
    userId,
    loadingHistory,
    setLoadingHistory,
    fetchCropHistory,
    fetchDiseaseHistory,
    cropHistory,
    diseaseHistory,
    totalPrediction,
    totalCropPredict,
    totalDiseasePredict,
    deleteCropPrediction,
    deleteDiseasePrediction
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
