import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const toastShown = useRef(false);

  useEffect(() => {
    if (!token && !toastShown.current) {
      toast.error("Please login or create an account 🔐");
      toastShown.current = true;
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
