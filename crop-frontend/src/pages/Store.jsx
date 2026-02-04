import { useState } from "react";
import {
  FaStore,
  FaSeedling,
  FaCapsules,
  FaShoppingCart,
  FaRupeeSign,
} from "react-icons/fa";

const seedsData = [
  {
    id: 1,
    name: "Wheat Seeds",
    price: "₹250 / kg",
    description: "High quality wheat seeds for better yield",
  },
  {
    id: 2,
    name: "Rice Seeds",
    price: "₹300 / kg",
    description: "Suitable for Indian climate and soil",
  },
  {
    id: 3,
    name: "Maize Seeds",
    price: "₹200 / kg",
    description: "Fast growing maize seeds",
  },
];

const medicineData = [
  {
    id: 1,
    name: "Pesticide A",
    price: "₹450",
    description: "Protects crops from insects",
  },
  {
    id: 2,
    name: "Fungicide B",
    price: "₹380",
    description: "Prevents fungal diseases",
  },
  {
    id: 3,
    name: "Herbicide C",
    price: "₹500",
    description: "Controls unwanted weeds",
  },
];

const Store = () => {
  const [active, setActive] = useState("seeds");
  const data = active === "seeds" ? seedsData : medicineData;

  return (
    <div className="min-h-[80vh] bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaStore />
          Store
        </h2>

        <button
          onClick={() => setActive("seeds")}
          className={`w-full flex items-center gap-2 text-left px-4 py-3 rounded-lg mb-2 font-medium transition
            ${
              active === "seeds"
                ? "bg-green-50 text-green-700 border-l-4 border-green-600"
                : "text-gray-600 hover:bg-gray-100"
            }
          `}
        >
          <FaSeedling />
          Seeds
        </button>

        <button
          onClick={() => setActive("medicine")}
          className={`w-full flex items-center gap-2 text-left px-4 py-3 rounded-lg font-medium transition
            ${
              active === "medicine"
                ? "bg-green-50 text-green-700 border-l-4 border-green-600"
                : "text-gray-600 hover:bg-gray-100"
            }
          `}
        >
          <FaCapsules />
          Medicines
        </button>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          {active === "seeds" ? <FaSeedling /> : <FaCapsules />}
          {active === "seeds" ? "Available Seeds" : "Available Medicines"}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.name}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                {item.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-green-700 flex items-center gap-1">
                  <FaRupeeSign />
                  {item.price.replace("₹", "")}
                </span>

                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-2">
                  <FaShoppingCart />
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Store;
