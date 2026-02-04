import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    console.log("google ",params)

    const token = params.get("token");
    const id = params.get("id");

    console.log("google token",token)

    if (token && id) {
      // ✅ SAVE exactly like normal login
      localStorage.setItem(
        "token",
        JSON.stringify({ token, id })
      );
    }

    navigate("/");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold text-green-700">
        Logging you in with Google…
      </p>
    </div>
  );
};

export default OAuthSuccess;
