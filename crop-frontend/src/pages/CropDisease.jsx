import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const CropDisease = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [disease, setDisease] = useState(null); // { label, confidence }
  const [medicine, setMedicine] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { getDiseaseFromModel, getMedicineFromChatbot } =
    useContext(AppContext);

  // 📷 Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setDisease(null);
    setMedicine(null);
    setError("");
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    setDisease(null);
    setMedicine(null);
    setError("");
  };

  // 🔮 Predict Disease (MODEL + CHATBOT)
  const predictDisease = async () => {
    setLoading(true);
    setDisease(null);
    setMedicine(null);
    setError("");

    try {
      // 1️⃣ ML Model Prediction
      const result = await getDiseaseFromModel(image);
      setDisease(result);

      // ✅ HEALTHY CHECK (FIXED)
      const isHealthy = result.label
        .toLowerCase()
        .includes("healthy");

      // 2️⃣ Chatbot logic
      if (!isHealthy) {
        const medicineResult = await getMedicineFromChatbot(result);
        setMedicine(medicineResult);
      } else {
        setMedicine("No medicine required. Crop is healthy 🌱");
      }
    } catch (err) {
      setError("Prediction failed. Please try another image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-50 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-extrabold text-green-800 mb-12 text-center">
          🦠 Crop Disease Prediction
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT */}
          <div className="bg-white rounded-2xl shadow-lg p-8">

            <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center">
              {!preview ? (
                <>
                  <p className="text-gray-500 mb-4">
                    📷 Upload crop image (JPG / PNG)
                  </p>
                  <label className="bg-green-700 text-white px-6 py-3 rounded-lg cursor-pointer">
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <>
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto max-h-64 rounded-lg mb-6"
                  />
                  <button
                    onClick={removeImage}
                    className="border border-red-500 text-red-600 px-5 py-2 rounded-lg"
                  >
                    Remove Image
                  </button>
                </>
              )}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={predictDisease}
                disabled={!image || loading}
                className={`px-10 py-4 rounded-full text-lg font-semibold
                  ${
                    image && !loading
                      ? "bg-green-700 text-white hover:bg-green-800"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                {loading ? "Predicting..." : "🔍 Predict Disease"}
              </button>
            </div>

            {error && (
              <p className="text-red-600 text-center mt-4">{error}</p>
            )}
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-center">

            {!disease && !loading && (
              <p className="text-center text-gray-500">
                Upload image and click predict to see results 🌱
              </p>
            )}

            {disease && (
              <div className="text-center space-y-6">

                {/* Disease */}
                <div>
                  <p className="text-sm text-gray-500">
                    🦠 Disease Status
                  </p>

                  <p
                    className={`text-3xl font-extrabold ${
                      disease.label.toLowerCase().includes("healthy")
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {disease.label}
                  </p>

                  <p className="text-sm text-gray-600 mt-2">
                    Confidence:
                    <span className="font-semibold">
                      {" "}{disease.confidence}%
                    </span>
                  </p>
                </div>

                {/* Medicine */}
                {medicine && (
                  <div>
                    <p className="text-sm text-gray-500">
                      💊 Recommendation
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        disease.label.toLowerCase().includes("healthy")
                          ? "text-green-700"
                          : "text-gray-700"
                      }`}
                    >
                      {medicine}
                    </p>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CropDisease;
