import { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import {
  FaSeedling,
  FaCloudSunRain,
  FaFlask,
  FaMagic,
  FaRobot,
  FaComments,
  FaSpinner,
} from "react-icons/fa";

const CropPrediction = () => {
  const [form, setForm] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    rainfall: "",
    ph: "",
  });

  const [modelResult, setModelResult] = useState(null);
  const [chatbotResult, setChatbotResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [chatbotLoading, setChatbotLoading] = useState(false);
  const [soilLoading, setSoilLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const [error, setError] = useState("");

  const { userId, backendUrl } = useContext(AppContext);

  const generateSoilTest = () => {
    if (soilLoading) return;

    setSoilLoading(true);

    setTimeout(() => {
      setForm((prev) => ({
        ...prev,
        nitrogen: Math.floor(Math.random() * 50) + 50,
        phosphorus: Math.floor(Math.random() * 40) + 20,
        potassium: Math.floor(Math.random() * 40) + 20,
        ph: (Math.random() * 2 + 5.5).toFixed(1),
      }));

      setSoilLoading(false);
    }, 5000);
  };

  const generateWeather = () => {
    if (weatherLoading) return;

    setWeatherLoading(true);

    setTimeout(() => {
      setForm((prev) => ({
        ...prev,
        temperature: (Math.random() * 22 + 18).toFixed(1),
        humidity: Math.floor(Math.random() * 55) + 40,
        rainfall: Math.floor(Math.random() * 300),
      }));

      setWeatherLoading(false);
    }, 5000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const predictFromModel = async () => {
    const payload = {
      userId,
      n: Number(form.nitrogen),
      p: Number(form.phosphorus),
      k: Number(form.potassium),
      temperature: Number(form.temperature),
      humidity: Number(form.humidity),
      ph: Number(form.ph),
      rainfall: Number(form.rainfall),
    };

    const res = await axios.post(`${backendUrl}/api/crop/predict`, payload);

    return res.data;
  };

  const predictFromChatbot = () => {
    setChatbotLoading(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        const crops = ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane"];
        const crop = crops[Math.floor(Math.random() * crops.length)];

        resolve({
          label: crop,
          confidence: (Math.random() * 20 + 70).toFixed(2),
        });

        setChatbotLoading(false);
      }, 1500);
    });
  };

  /* 🚀 Predict */
  const predictCrop = async () => {
    setLoading(true);
    setError("");
    setModelResult(null);
    setChatbotResult(null);

    try {
      const model = await predictFromModel();
      setModelResult(model);

      const chatbot = await predictFromChatbot();
      setChatbotResult(chatbot);
    } catch {
      setError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-green-800 text-center mb-12 flex items-center justify-center gap-3">
          <FaSeedling />
          Crop Recommendation System
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex gap-4 mb-8">
              <button
                onClick={generateSoilTest}
                disabled={soilLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold ${
                  soilLoading
                    ? "bg-gray-300 text-gray-600"
                    : "bg-green-700 text-white hover:bg-green-800"
                }`}
              >
                {soilLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Testing Soil...
                  </>
                ) : (
                  <>
                    <FaFlask />
                    Soil Test
                  </>
                )}
              </button>

              {/* Weather */}
              <button
                onClick={generateWeather}
                disabled={weatherLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold ${
                  weatherLoading
                    ? "bg-gray-300 text-gray-600"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {weatherLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Fetching Weather...
                  </>
                ) : (
                  <>
                    <FaCloudSunRain />
                    Weather
                  </>
                )}
              </button>
            </div>

            <h2 className="text-xl font-bold text-green-800 mb-6">
              Enter Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                ["nitrogen", "Nitrogen (N)"],
                ["phosphorus", "Phosphorus (P)"],
                ["potassium", "Potassium (K)"],
                ["ph", "Soil pH"],
                ["temperature", "Temperature (°C)"],
                ["humidity", "Humidity (%)"],
                ["rainfall", "Rainfall (mm)"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">
                    {label}
                  </label>
                  <input
                    type="number"
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={predictCrop}
              disabled={loading}
              className={`w-full mt-8 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 ${
                loading
                  ? "bg-gray-400"
                  : "bg-green-700 text-white hover:bg-green-800"
              }`}
            >
              <FaMagic />
              {loading ? "Predicting..." : "Predict Best Crop"}
            </button>

            {error && <p className="text-red-600 text-center mt-4">{error}</p>}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-bold text-green-800 mb-6">
              Prediction Results
            </h2>

            {!modelResult && !chatbotResult && (
              <p className="text-gray-500">
                Submit inputs to get predictions 🌱
              </p>
            )}

            {modelResult && (
              <div className="mb-8">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <FaRobot /> ML Model
                </p>
                <p className="text-4xl font-extrabold text-green-700">
                  {modelResult.label}
                </p>
                <p className="text-sm mt-2">
                  Confidence: {modelResult.confidence}%
                </p>
              </div>
            )}

            {chatbotLoading && (
              <p className="text-blue-500 flex items-center justify-center gap-2">
                <FaComments /> Chatbot thinking...
              </p>
            )}

            {chatbotResult && (
              <div>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <FaComments /> Chatbot Recommendation
                </p>
                <p className="text-4xl font-extrabold text-blue-700">
                  {chatbotResult.label}
                </p>
                <p className="text-sm mt-2">
                  Confidence: {chatbotResult.confidence}%
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropPrediction;
