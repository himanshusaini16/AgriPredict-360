import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import {
  FaLeaf,
  FaUpload,
  FaTrash,
  FaSearch,
  FaCapsules,
} from "react-icons/fa";
import { MdBugReport } from "react-icons/md";

const CropDisease = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [disease, setDisease] = useState(null);
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { getDiseaseFromModel, getMedicineFromChatbot } =
    useContext(AppContext);

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

  const predictDisease = async () => {
    setLoading(true);
    setDisease(null);
    setMedicine(null);
    setError("");

    try {
      const result = await getDiseaseFromModel(image);
      setDisease(result);

      const isHealthy = result.label.toLowerCase().includes("healthy");

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
        <h1 className="text-4xl font-extrabold text-green-800 mb-12 text-center flex items-center justify-center gap-3">
          <MdBugReport className="text-red-600" />
          Crop Disease Prediction
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center">
              {!preview ? (
                <>
                  <FaUpload className="text-4xl text-green-600 mx-auto mb-4" />
                  <p className="text-gray-500 mb-6">
                    Upload crop image (JPG / PNG)
                  </p>

                  <label className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-green-800 transition">
                    <FaUpload />
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
                    className="mx-auto max-h-64 rounded-xl mb-6 shadow"
                  />
                  <button
                    onClick={removeImage}
                    className="inline-flex items-center gap-2 border border-red-500 text-red-600 px-5 py-2 rounded-lg hover:bg-red-50 transition"
                  >
                    <FaTrash />
                    Remove Image
                  </button>
                </>
              )}
            </div>

            <div className="text-center mt-10">
              <button
                onClick={predictDisease}
                disabled={!image || loading}
                className={`inline-flex items-center gap-3 px-10 py-4 rounded-full text-lg font-semibold transition
                  ${
                    image && !loading
                      ? "bg-green-700 text-white hover:bg-green-800"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                <FaSearch />
                {loading ? "Predicting..." : "Predict Disease"}
              </button>
            </div>

            {error && <p className="text-red-600 text-center mt-6">{error}</p>}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center">
            {!disease && !loading && (
              <p className="text-gray-500 text-center">
                Upload an image and click predict to view results 🌱
              </p>
            )}

            {disease && (
              <div className="text-center space-y-8 w-full">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Disease Status</p>

                  <div
                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-2xl font-extrabold
                      ${
                        disease.label.toLowerCase().includes("healthy")
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }
                    `}
                  >
                    {disease.label.toLowerCase().includes("healthy") ? (
                      <FaLeaf />
                    ) : (
                      <MdBugReport />
                    )}
                    {disease.label}
                  </div>

                  <p className="text-sm text-gray-600 mt-3">
                    Confidence:{" "}
                    <span className="font-semibold">{disease.confidence}%</span>
                  </p>
                </div>

                {/* Medicine */}
                {medicine && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Recommendation</p>

                    <div className="inline-flex items-start gap-3 bg-green-50 px-6 py-4 rounded-xl text-gray-700 font-semibold">
                      <FaCapsules className="mt-1 text-green-700" />
                      <span>{medicine}</span>
                    </div>
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
