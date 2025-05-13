import React, { useEffect } from "react";

const ChatbotDialogflow = () => {
  useEffect(() => {
    // Evitar múltiples cargas del script
    if (!document.querySelector('script[src*="dialogflow-console"]')) {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
      script.async = true;
      document.body.appendChild(script);
    }
    
    if (!document.querySelector("df-messenger")) {
      const dfMessenger = document.createElement("df-messenger");
      dfMessenger.setAttribute("intent", "WELCOME");
      dfMessenger.setAttribute("chat-title", "Fushi");
      dfMessenger.setAttribute("agent-id", "c1192ce0-8275-410b-abce-2ead1dbf2613");
      dfMessenger.setAttribute("language-code", "es");
      document.body.appendChild(dfMessenger);
    }
  }, []);

  return null; 
};

export default ChatbotDialogflow;
