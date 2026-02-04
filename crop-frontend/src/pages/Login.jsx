import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
  FaExclamationCircle,
  FaExchangeAlt,
} from "react-icons/fa";
import { GiWheat } from "react-icons/gi";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { backendUrl, getProfile } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        if (!name || !email || !password) {
          setError("All fields are required");
          return;
        }

        const res = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        localStorage.setItem(
          "token",
          JSON.stringify({ token: res.data.token, id: res.data.id }),
        );

        getProfile();
        navigate("/");
      } else {
        const res = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        localStorage.setItem(
          "token",
          JSON.stringify({ token: res.data.token, id: res.data.id }),
        );

        getProfile();
        navigate("/");
      }
    } catch (err) {
      if (err.response) {
        const msg =
          err.response.data?.message || err.response.data || "User not found";
        setError(msg);
      } else {
        setError("Server not reachable");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full py-16 bg-green-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-green-800 text-center mb-2 flex items-center justify-center gap-2">
          <GiWheat className="text-yellow-600" />
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        <p className="text-gray-600 text-center mb-6">
          {isRegister
            ? "Register to start using CropAdvisor"
            : "Login to continue to CropAdvisor"}
        </p>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4 flex items-center justify-center gap-2">
            <FaExclamationCircle />
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <FaUser />
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaEnvelope />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@example.com"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FaLock />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition flex items-center justify-center gap-2"
          >
            {isRegister ? <FaUserPlus /> : <FaSignInAlt />}
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <button
          onClick={() => {
            window.location.href = `${backendUrl}/oauth2/authorization/google`;
          }}
          className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium">
            {isRegister ? "Sign up with Google" : "Login with Google"}
          </span>
        </button>

        <p className="text-center text-sm text-gray-600 mt-6 flex items-center justify-center gap-2">
          {isRegister ? "Already have an account?" : "Don’t have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-green-700 font-semibold hover:underline flex items-center gap-1"
          >
            <FaExchangeAlt />
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
