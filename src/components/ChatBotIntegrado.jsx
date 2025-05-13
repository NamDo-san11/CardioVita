import React, { useEffect } from "react";

const ChatbotDialogflow = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <df-messenger
      intent="BIENVENIDO"
      chat-title="Fushi"
      agent-id="c1192ce0-8275-410b-abce-2ead1dbf2613"
      language-code="es"
    ></df-messenger>
  );
};

export default ChatbotDialogflow;
