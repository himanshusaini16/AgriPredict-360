import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

const History = () => {
  const [active, setActive] = useState("crop");
  const [visibleCount, setVisibleCount] = useState(3);

  const {
    cropHistory,
    diseaseHistory,
    loadingHistory,
    fetchCropHistory,
    fetchDiseaseHistory,
    deleteCropPrediction,
    deleteDiseasePrediction,
  } = useContext(AppContext);

  // Reload when tab changes
  useEffect(() => {
    setVisibleCount(3);
    if (active === "crop") fetchCropHistory();
    if (active === "disease") fetchDiseaseHistory();
  }, [active]);

  return (
    <div className="min-h-screen bg-green-50 flex">

      {/* SIDEBAR (DESKTOP) */}
      <aside className="hidden md:block w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold text-green-800 mb-6">
          📜 History
        </h2>

        <button
          onClick={() => setActive("crop")}
          className={`w-full text-left px-4 py-3 rounded-lg mb-2 font-medium
            ${active === "crop"
              ? "bg-green-50 text-green-700 border-l-4 border-green-600"
              : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          🌱 Crop Prediction
        </button>

        <button
          onClick={() => setActive("disease")}
          className={`w-full text-left px-4 py-3 rounded-lg font-medium
            ${active === "disease"
              ? "bg-green-50 text-green-700 border-l-4 border-green-600"
              : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          🦠 Disease Prediction
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-4 md:p-10">

        {/* MOBILE SELECT */}
        <div className="block md:hidden mb-4">
          <select
            value={active}
            onChange={(e) => setActive(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border bg-white font-medium"
          >
            <option value="crop">🌱 Crop Prediction</option>
            <option value="disease">🦠 Disease Prediction</option>
          </select>
        </div>

        {/* ================= CROP HISTORY ================= */}
        {active === "crop" && (
          <>
            <h1 className="text-xl md:text-2xl font-bold text-green-800 mb-4">
              Crop Prediction History
            </h1>

            {loadingHistory && <p>Loading...</p>}

            {!loadingHistory && cropHistory.length === 0 && (
              <p className="text-gray-500">No crop predictions found.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(window.innerWidth < 768
                ? cropHistory.slice(0, visibleCount)
                : cropHistory
              ).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border p-4"
                >
                  <img
                    src="rice.png"
                    alt={item.crop}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />

                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <p><strong>N:</strong> {item.n}</p>
                    <p><strong>P:</strong> {item.p}</p>
                    <p><strong>K:</strong> {item.k}</p>
                    <p><strong>pH:</strong> {Number(item.ph).toFixed(1)}</p>
                    <p><strong>Temp:</strong> {item.temperature}°C</p>
                    <p><strong>Humidity:</strong> {item.humidity}%</p>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-green-700 font-semibold">
                      🌾 {item.crop}
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
                    className="mt-3 w-full py-2 text-xs rounded-lg
                               bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    🗑 Delete
                  </button>
                </div>
              ))}
            </div>

            {/* LOAD MORE (MOBILE) */}
            {window.innerWidth < 768 &&
              visibleCount < cropHistory.length && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setVisibleCount((v) => v + 3)}
                    className="px-6 py-2 bg-green-700 text-white rounded-full text-sm"
                  >
                    + Load More
                  </button>
                </div>
              )}
          </>
        )}

        {/* ================= DISEASE HISTORY ================= */}
        {active === "disease" && (
          <>
            <h1 className="text-xl md:text-2xl font-bold text-green-800 mb-4">
              Disease Prediction History
            </h1>

            {loadingHistory && <p>Loading...</p>}

            {!loadingHistory && diseaseHistory.length === 0 && (
              <p className="text-gray-500">No disease predictions found.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(window.innerWidth < 768
                ? diseaseHistory.slice(0, visibleCount)
                : diseaseHistory
              ).map((item) => {
                const isHealthy =
                  item.disease.toLowerCase().includes("healthy");

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm border p-4"
                  >
                    <img
                      src={item.imageUrl}
                      alt="Crop"
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />

                    <p
                      className={`font-semibold mb-1 ${
                        isHealthy
                          ? "text-green-700"
                          : "text-red-600"
                      }`}
                    >
                      🦠 {item.disease}
                    </p>

                    <p className="text-xs text-gray-600">
                      Confidence: {item.confidence}%
                    </p>

                    {isHealthy ? (
                      <p className="text-green-700 text-sm mt-2">
                        ✅ No medicine required
                      </p>
                    ) : (
                      <p className="text-xs text-gray-700 mt-2">
                        💊 {item.medicine || "Recommended by expert"}
                      </p>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm("Delete this disease prediction?")) {
                          deleteDiseasePrediction(item.id);
                        }
                      }}
                      className="mt-3 w-full py-2 text-xs rounded-lg
                                 bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      🗑 Delete
                    </button>
                  </div>
                );
              })}
            </div>

            {/* LOAD MORE (MOBILE) */}
            {window.innerWidth < 768 &&
              visibleCount < diseaseHistory.length && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setVisibleCount((v) => v + 3)}
                    className="px-6 py-2 bg-green-700 text-white rounded-full text-sm"
                  >
                    + Load More
                  </button>
                </div>
              )}
          </>
        )}
      </main>
    </div>
  );
};

export default History;
