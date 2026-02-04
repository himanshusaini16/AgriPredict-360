import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const [userOpen, setUserOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  const { userData, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  console.log("userData from Nav Bar",userData)

  // ❌ Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setUserOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-green-700 text-white shadow-md">
      {/* ================= DESKTOP HEADER ================= */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="font-extrabold text-2xl">
          🌾 AgriPredict 360
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-10 font-semibold">
          <li>
            <Link to="/predict-crop" className="hover:text-yellow-400">
              Predict Crop
            </Link>
          </li>
          <li>
            <Link to="/predict-disease" className="hover:text-yellow-400">
              Predict Disease
            </Link>
          </li>
          <li>
            <Link to="/store" className="hover:text-yellow-400">
              Store
            </Link>
          </li>
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-4" ref={menuRef}>
          {/* Not logged in */}
          {!userData && (
            <Link
              to="/login"
              className="hidden md:block bg-yellow-400 text-green-900 px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300"
            >
              Login
            </Link>
          )}

          {/* Logged in (Desktop) */}
          {userData && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-600"
              >
                <div className="w-9 h-9 bg-yellow-400 text-green-900 rounded-full flex items-center justify-center font-bold">
                  {userData.Image ? <img src={userData.Image} className="w-8 h-8 rounded-full"/>:userData.name.charAt(0).toUpperCase()}
                </div>
                <span>{userData.name}</span>
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-xl shadow-xl z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 hover:bg-green-100"
                  >
                    👤 Profile
                  </Link>
                  <Link
                    to="/history"
                    className="block px-4 py-3 hover:bg-green-100"
                  >
                    📜 History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-100"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 🍔 Mobile Menu Button */}
          <button
            className="md:hidden text-3xl"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div className="md:hidden bg-green-800 text-white px-6 py-5 space-y-4">

          {/* User Info */}
          {userData && (
            <div className="flex items-center gap-3 pb-4 border-b border-green-600">
              <div className="w-10 h-10 bg-yellow-400 text-green-900 rounded-full flex items-center justify-center font-bold">
                {userData.Image ? <img src={userData.Image} className="w-8 h-8 rounded-full"/>:userData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{userData.name}</p>
                <p className="text-sm text-green-200">{userData.email}</p>
              </div>
            </div>
          )}

          {/* Menu List */}
          <ul className="flex flex-col space-y-4 font-semibold">
            <li>
              <Link to="/predict-crop" onClick={() => setMobileOpen(false)}>
                🌱 Predict Crop
              </Link>
            </li>
            <li>
              <Link to="/predict-disease" onClick={() => setMobileOpen(false)}>
                🦠 Predict Disease
              </Link>
            </li>
            <li>
              <Link to="/store" onClick={() => setMobileOpen(false)}>
                🛒 Store
              </Link>
            </li>

            {userData ? (
              <>
                <li>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>
                    👤 Profile
                  </Link>
                </li>
                <li>
                  <Link to="/history" onClick={() => setMobileOpen(false)}>
                    📜 History
                  </Link>
                </li>
                <li className="pt-3 border-t border-green-600">
                  <button
                    onClick={handleLogout}
                    className="text-red-300"
                  >
                    🚪 Logout
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
