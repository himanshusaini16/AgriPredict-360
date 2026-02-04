import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Store from "./pages/Store";
import Profile from "./pages/Profile";
import History from "./pages/History";
import CropPrediction from "./pages/CropPrediction";
import CropDisease from "./pages/CropDisease";
import Login from "./pages/Login";
import ChatBot from "./components/ChatBot";
import OAuthSuccess from "./pages/OAuthSuccess";

function App() {
  return (
  
    <div className="flex flex-col min-h-screen">


      <Navbar />

   
      <main className="flex-grow bg-green-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="predict-crop" element ={<CropPrediction/>}/>
          <Route path="/predict-disease" element ={<CropDisease/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth2/success" element={<OAuthSuccess />} />

        </Routes>
      </main>

      {/* Footer always bottom */}
      <ChatBot/>
      <Footer />
    </div>
  );
}

export default App;
