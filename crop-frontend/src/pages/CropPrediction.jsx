import { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

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
  const [error, setError] = useState("");
  const {userId,backendUrl} = useContext(AppContext)


  console.log("user id from crop ",userId)

  // 🌱 Random Soil Test
  const generateSoilTest = () => {
    setForm((prev) => ({
      ...prev,
      nitrogen: Math.floor(Math.random() * 50) + 50,
      phosphorus: Math.floor(Math.random() * 40) + 20,
      potassium: Math.floor(Math.random() * 40) + 20,
      ph: (Math.random() * 2 + 5.5).toFixed(1),
    }));
  };

  // 🌦 Random Weather
  const generateWeather = () => {
    setForm((prev) => ({
      ...prev,
      temperature: (Math.random() * 22 + 18).toFixed(1),
      humidity: Math.floor(Math.random() * 55) + 40,
      rainfall: Math.floor(Math.random() * 300),
    }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔮 ML Model Prediction (REAL)
  const predictFromModel = async () => {
    const payload = {
      userId: userId,
      n: Number(form.nitrogen),
      p: Number(form.phosphorus),
      k: Number(form.potassium),
      temperature: Number(form.temperature),
      humidity: Number(form.humidity),
      ph: Number(form.ph),
      rainfall: Number(form.rainfall),
    };

    const response = await axios.post(
      "http://localhost:8080/api/crop/predict",
      payload
    );

    return response.data;
  };

  // 💬 Chatbot Prediction (DUMMY)
  const predictFromChatbot = () => {
    setChatbotLoading(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        const dummyCrops = [
          "Rice",
          "Wheat",
          "Maize",
          "Cotton",
          "Sugarcane",
          "Barley",
        ];

        const crop =
          dummyCrops[Math.floor(Math.random() * dummyCrops.length)];

        resolve({
          label: crop,
          confidence: (Math.random() * 20 + 70).toFixed(2),
        });

        setChatbotLoading(false);
      }, 1500);
    });
  };

  // 🚀 Predict Both
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
    } catch (err) {
      setError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-green-800 text-center mb-12">
          🌾 Crop Recommendation System
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex gap-4 mb-6">
              <button
                onClick={generateSoilTest}
                className="flex-1 bg-green-700 text-white py-2 rounded-lg font-semibold"
              >
                🌱 Soil Test
              </button>
              <button
                onClick={generateWeather}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold"
              >
                🌦 Weather
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
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={predictCrop}
              disabled={loading}
              className={`w-full mt-8 py-4 rounded-xl text-lg font-bold ${
                loading
                  ? "bg-gray-400"
                  : "bg-green-700 text-white hover:bg-green-800"
              }`}
            >
              {loading ? "Predicting..." : "🔮 Predict Best Crop"}
            </button>

            {error && (
              <p className="text-red-600 text-center mt-4">{error}</p>
            )}
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-xl font-bold text-green-800 mb-6 text-center">
              Prediction Results
            </h2>

            {!modelResult && !chatbotResult && (
              <p className="text-center text-gray-500">
                Submit inputs to get predictions 🌱
              </p>
            )}

            {modelResult && (
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-500">
                  🤖 ML Model
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
              <p className="text-center text-blue-500">
                💬 Chatbot thinking...
              </p>
            )}

            {chatbotResult && (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  💬 Chatbot Recommendation
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
