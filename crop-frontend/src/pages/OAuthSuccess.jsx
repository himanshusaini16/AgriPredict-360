import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const id = params.get("id");

    if (token && id) {
      localStorage.setItem(
        "token",
        JSON.stringify({ token, id })
      );
    }

    navigate("/");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">

      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <img
          src="/logo.png"
          alt="AgriPredict 360 Logo"
          className="w-20 h-20 mb-3 animate-pulse"
        />
        <h1 className="text-3xl font-extrabold text-green-800">
          AgriPredict 360
        </h1>
      </div>

      {/* Message */}
      <p className="text-lg font-semibold text-green-700">
        Logging you in with Google…
      </p>

      <p className="text-sm text-gray-500 mt-2">
        Please wait while we securely sign you in
      </p>
    </div>
  );
};

export default OAuthSuccess;
