import { useState } from "react";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-green-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-green-800 transition"
      >
        🤖
      </button>

      
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-xl border overflow-hidden">

          {/* Header */}
          <div className="bg-green-700 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold">Agri Assistant 🌱</h3>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Messages */}
          <div className="h-64 p-4 overflow-y-auto bg-green-50 text-sm space-y-3">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              👋 Hi! I’m your Agri Assistant.  
              <br />
              Ask me about crops, soil, or diseases.
            </div>

            {/* Example user message */}
            <div className="bg-green-700 text-white p-3 rounded-lg ml-auto w-fit">
              What crop is best?
            </div>

            {/* Example bot reply */}
            <div className="bg-white p-3 rounded-lg shadow-sm">
              🌾 Based on soil & weather, I can recommend the best crop.
            </div>
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            />
            <button
              className="bg-green-700 text-white px-4 rounded-lg hover:bg-green-800 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
