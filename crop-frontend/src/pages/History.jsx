import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import {
  FaHistory,
  FaLeaf,
  FaBug,
  FaTrash,
  FaCheckCircle,
  FaCapsules,
} from "react-icons/fa";
import { GiWheat } from "react-icons/gi";
import { cropImages } from "../assets/cropImage";

const History = () => {
  const [active, setActive] = useState("crop");

  const {
    cropHistory,
    diseaseHistory,
    loadingHistory,
    fetchCropHistory,
    fetchDiseaseHistory,
    deleteCropPrediction,
    deleteDiseasePrediction,
  } = useContext(AppContext);

  useEffect(() => {
    if (active === "crop") fetchCropHistory();
    if (active === "disease") fetchDiseaseHistory();
  }, [active]);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col md:flex-row">
      <aside className="hidden md:block w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
          <FaHistory /> History
        </h2>

        <button
          onClick={() => setActive("crop")}
          className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg mb-2 font-medium ${
            active === "crop"
              ? "bg-green-50 text-green-700 border-l-4 border-green-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FaLeaf /> Crop Prediction
        </button>

        <button
          onClick={() => setActive("disease")}
          className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium ${
            active === "disease"
              ? "bg-green-50 text-green-700 border-l-4 border-green-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FaBug /> Disease Prediction
        </button>
      </aside>

      <main className="flex-1 p-4 md:p-10">
        <div className="md:hidden mb-6">
          <h2 className="text-lg font-bold text-green-800 flex items-center gap-2 mb-3">
            <FaHistory /> History
          </h2>

          <select
            value={active}
            onChange={(e) => setActive(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="crop">🌱 Crop Prediction</option>
            <option value="disease">🐛 Disease Prediction</option>
          </select>
        </div>

        {active === "crop" && (
          <>
            <h1 className="text-xl md:text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <FaLeaf /> Crop Prediction History
            </h1>

            {loadingHistory && <p>Loading...</p>}

            {!loadingHistory && cropHistory.length === 0 && (
              <p className="text-gray-500">No crop predictions found.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cropHistory.map((item) => {
                const cropKey = item.crop?.toLowerCase();

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm border p-4"
                  >
                    <div className="bg-green-50 rounded-lg mb-3 p-2">
                      <img
                        src={cropImages[cropKey]}
                        alt={item.crop}
                        className="w-full h-48 object-contain rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <p>
                        <strong>N:</strong> {item.n}
                      </p>
                      <p>
                        <strong>P:</strong> {item.p}
                      </p>
                      <p>
                        <strong>K:</strong> {item.k}
                      </p>
                      <p>
                        <strong>pH:</strong> {Number(item.ph).toFixed(1)}
                      </p>
                      <p>
                        <strong>Humidity:</strong> {item.humidity}%
                      </p>
                      <p>
                        <strong>Rainfall:</strong> {item.rainfall}mm
                      </p>
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <p className="text-green-700 font-semibold flex items-center gap-1 capitalize">
                        <GiWheat /> {item.crop}
                      </p>
                      <p className="text-xs text-gray-600">
                        {item.confidence}%
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm("Delete this crop prediction?")) {
                          deleteCropPrediction(item.id);
                        }
                      }}
                      className="mt-3 w-full py-2 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center gap-2"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {active === "disease" && (
          <>
            <h1 className="text-xl md:text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <FaBug /> Disease Prediction History
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {diseaseHistory.map((item) => {
                const isHealthy = item.disease
                  .toLowerCase()
                  .includes("healthy");

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm border p-4"
                  >
                    <div className="bg-gray-50 rounded-lg mb-3 p-2">
                      <img
                        src={item.imageUrl}
                        alt="Crop"
                        className="w-full h-48 object-contain rounded-lg"
                      />
                    </div>

                    <p
                      className={`font-semibold mb-1 flex items-center gap-2 ${
                        isHealthy ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      <FaBug /> {item.disease}
                    </p>

                    {isHealthy ? (
                      <p className="text-green-700 text-sm flex items-center gap-2">
                        <FaCheckCircle /> No medicine required
                      </p>
                    ) : (
                      <p className="text-xs text-gray-700 flex items-center gap-2">
                        <FaCapsules /> {item.medicine}
                      </p>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm("Delete this disease prediction?")) {
                          deleteDiseasePrediction(item.id);
                        }
                      }}
                      className="mt-3 w-full py-2 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center gap-2"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default History;
