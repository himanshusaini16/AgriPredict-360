import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";

import Home from "./pages/Home";
import Store from "./pages/Store";
import Profile from "./pages/Profile";
import History from "./pages/History";
import CropPrediction from "./pages/CropPrediction";
import CropDisease from "./pages/CropDisease";
import Login from "./pages/Login";
import OAuthSuccess from "./pages/OAuthSuccess";

import ProtectedRoute from "./components/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Toast Messages */}
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow bg-green-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth2/success" element={<OAuthSuccess />} />

          {/* Protected Routes */}
          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <Store />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/predict-crop"
            element={
              <ProtectedRoute>
                <CropPrediction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/predict-disease"
            element={
              <ProtectedRoute>
                <CropDisease />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Chatbot + Footer */}
      <ChatBot />
      <Footer />
    </div>
  );
}

export default App;
