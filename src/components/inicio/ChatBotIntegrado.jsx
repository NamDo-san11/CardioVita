import React, { useEffect } from "react";
import "../../App.css";

const ChatbotDialogflow = () => {
  useEffect(() => {
    if (!document.querySelector('script[src*="dialogflow-console"]')) {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
      script.async = true;
      document.body.appendChild(script);
    }

    if (!document.querySelector("df-messenger")) {
      const dfMessenger = document.createElement("df-messenger");
      dfMessenger.setAttribute("intent", "WELCOME");
      dfMessenger.setAttribute("chat-title", "🐈‍⬛ Fushi");
      dfMessenger.setAttribute("agent-id", "c1192ce0-8275-410b-abce-2ead1dbf2613");
      dfMessenger.setAttribute("language-code", "es");
      dfMessenger.setAttribute("chat-icon", "https://cdn-icons-png.flaticon.com/128/3704/3704886.png");
      document.body.appendChild(dfMessenger);
    }
  }, []);

  return null;
};

export default ChatbotDialogflow;
