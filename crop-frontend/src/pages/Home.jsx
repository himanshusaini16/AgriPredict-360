import { Link } from "react-router-dom";
import { GiWheat, GiPlantRoots } from "react-icons/gi";
import { MdBugReport } from "react-icons/md";

const Home = () => {
  return (
    <div className="bg-green-50 flex flex-col items-center">
      <section className="w-full bg-gradient-to-b from-green-100 to-green-50 py-5 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-6 flex items-center justify-center gap-3">
          <GiWheat className="text-yellow-600" />
          Smart Crop Advisor
        </h1>

        <p className="text-gray-700 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
          CropAdvisor helps farmers make smarter decisions by recommending the
          best crops and detecting plant diseases using machine learning.
          Increase productivity and reduce losses with modern agriculture.
        </p>
      </section>

      <section className="flex flex-grow items-center justify-center w-full py-16">
        <div className="max-w-5xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="text-5xl mb-4 flex justify-center">
                <GiPlantRoots className="text-green-700" />
              </div>

              <h2 className="text-2xl font-bold text-green-700 mb-4">
                Predict Best Crop
              </h2>

              <p className="text-gray-600 mb-8">
                Get crop recommendations based on soil nutrients, weather
                conditions, and your location.
              </p>

              <Link
                to="/predict-crop"
                className="inline-block bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition"
              >
                Predict Crop
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-10 text-center hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="text-5xl mb-4 flex justify-center">
                <MdBugReport className="text-red-600" />
              </div>

              <h2 className="text-2xl font-bold text-green-700 mb-4">
                Predict Crop Disease
              </h2>

              <p className="text-gray-600 mb-8">
                Upload a crop image and detect plant diseases early to protect
                your crops from damage.
              </p>

              <Link
                to="/predict-disease"
                className="inline-block bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition"
              >
                Predict Disease
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
