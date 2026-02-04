import { useState } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-green-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-green-800 transition"
      >
        <FaRobot />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-xl border overflow-hidden">
          <div className="bg-green-700 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaRobot />
              <h3 className="font-semibold">Agri Assistant</h3>
            </div>
            <button onClick={() => setOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="h-64 p-4 overflow-y-auto bg-green-50 text-sm space-y-3">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              👋 Hi! I’m your Agri Assistant.
              <br />
              Ask me about crops, soil, or diseases.
            </div>

            <div className="bg-green-700 text-white p-3 rounded-lg ml-auto w-fit">
              What crop is best?
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm">
              🌾 Based on soil & weather, I can recommend the best crop.
            </div>
          </div>
          <div className="border-t p-3 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-700 text-white px-4 rounded-lg hover:bg-green-800 transition flex items-center justify-center">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
