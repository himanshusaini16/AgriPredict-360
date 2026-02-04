import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

import { GiPlantRoots } from "react-icons/gi";
import { MdBugReport } from "react-icons/md";
import { FaStore, FaUser, FaHistory, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const [userOpen, setUserOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  const { userData, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setUserOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-extrabold text-2xl"
        >
          <img
            src="/logo.png"
            alt="AgriPredict 360 Logo"
            className="h-10 w-10 object-contain"
          />
          <span>AgriPredict 360</span>
        </Link>

        <ul className="hidden md:flex items-center space-x-10 font-semibold">
          <li>
            <Link
              to="/predict-crop"
              className="flex items-center gap-2 hover:text-yellow-400"
            >
              <GiPlantRoots />
              Predict Crop
            </Link>
          </li>

          <li>
            <Link
              to="/predict-disease"
              className="flex items-center gap-2 hover:text-yellow-400"
            >
              <MdBugReport />
              Predict Disease
            </Link>
          </li>

          {userData && (
            <li>
              <Link
                to="/history"
                className="flex items-center gap-2 hover:text-yellow-400"
              >
                <FaHistory />
                History
              </Link>
            </li>
          )}

          <li>
            <Link
              to="/store"
              className="flex items-center gap-2 hover:text-yellow-400"
            >
              <FaStore />
              Store
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-4" ref={menuRef}>
          {!userData && (
            <Link
              to="/login"
              className="hidden md:block bg-yellow-400 text-green-900 px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300"
            >
              Login
            </Link>
          )}

          {userData && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-600"
              >
                <div className="w-9 h-9 bg-yellow-400 text-green-900 rounded-full flex items-center justify-center font-bold">
                  {userData.Image ? (
                    <img
                      src={userData.Image}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    userData.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <span>{userData.name}</span>
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-green-100"
                  >
                    <FaUser className="text-green-700" />
                    Profile
                  </Link>

                  <Link
                    to="/history"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-green-100"
                  >
                    <FaHistory className="text-green-700" />
                    History
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-100"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="md:hidden text-3xl"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            ☰
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-green-800 text-white px-6 py-5 space-y-4">
          {userData && (
            <div className="flex items-center gap-3 pb-4 border-b border-green-600">
              <div className="w-10 h-10 bg-yellow-400 text-green-900 rounded-full flex items-center justify-center font-bold">
                {userData.Image ? (
                  <img src={userData.Image} className="w-8 h-8 rounded-full" />
                ) : (
                  userData.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-semibold">{userData.name}</p>
                <p className="text-sm text-green-200">{userData.email}</p>
              </div>
            </div>
          )}

          <ul className="flex flex-col space-y-4 font-semibold">
            <li>
              <Link to="/predict-crop" onClick={() => setMobileOpen(false)}>
                <GiPlantRoots /> Predict Crop
              </Link>
            </li>

            <li>
              <Link to="/predict-disease" onClick={() => setMobileOpen(false)}>
                <MdBugReport />
                Predict Disease
              </Link>
            </li>

            <li>
              <Link to="/store" onClick={() => setMobileOpen(false)}>
                <FaStore />
                Store
              </Link>
            </li>

            {userData ? (
              <>
                <li>
                  <Link to="/history" onClick={() => setMobileOpen(false)}>
                    <FaHistory /> History
                  </Link>
                </li>

                <li>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>
                    👤 Profile
                  </Link>
                </li>

                <li className="pt-3 border-t border-green-600">
                  <button onClick={handleLogout} className="text-red-300">
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="pt-3 border-t border-green-600">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  🔐 Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
