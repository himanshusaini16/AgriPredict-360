import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-800 text-green-100 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div className="max-w-sm">
          <h2 className="text-lg font-extrabold  mb-2">
            🌱 AgriPredict 360
          </h2>

          <p className="text-xs leading-relaxed text-green-100/90">
            <span className="font-semibold">AgriPredict 360</span> is an
            all-in-one precision agriculture platform that leverages
            <span className="font-semibold"> deep learning</span> to optimize
            farm productivity. By analyzing soil and environmental data, it
            predicts the most viable crops for a specific plot, while its
            <span className="font-semibold"> computer vision</span> engine
            identifies plant diseases in real-time. From seed selection to
            harvest protection, it provides a
            <span className="font-semibold"> 360-degree shield</span> for your
            yield.
          </p>

          <p className="text-[11px] mt-3 text-green-200">
            Built for smart & sustainable farming 🌾
          </p>
        </div>

        {/* Links */}
       <div>
  <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-green-200">
    Quick Links
  </h3>

  <ul className="space-y-2 text-xs">
    <li>
      <Link
        to="/"
        className="hover:text-yellow-400 transition cursor-pointer"
      >
        Home
      </Link>
    </li>

    <li>
      <Link
        to="/predict-crop"
        className="hover:text-yellow-400 transition cursor-pointer"
      >
        Predict Crop
      </Link>
    </li>

    <li>
      <Link
        to="/store"
        className="hover:text-yellow-400 transition cursor-pointer"
      >
        Store
      </Link>
    </li>
  </ul>
</div>


        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-green-200">
            Contact
          </h3>
          <p className="text-xs mb-1">📍 India</p>
          <p className="text-xs">📧 support@agripredict360.com</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-700/60 text-center py-3 text-[11px] text-green-200">
        © {new Date().getFullYear()} AgriPredict 360. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
