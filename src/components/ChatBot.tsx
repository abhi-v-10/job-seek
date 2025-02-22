
import { useEffect } from "react";

const ChatBot = () => {
  useEffect(() => {
    // Create and inject the first script
    const injectScript = document.createElement("script");
    injectScript.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    injectScript.async = true;
    document.body.appendChild(injectScript);

    // Create and inject the second script
    const configScript = document.createElement("script");
    configScript.src = "https://files.bpcontent.cloud/2025/02/22/12/20250222122058-B0CN79X3.js";
    configScript.async = true;
    document.body.appendChild(configScript);

    // Cleanup function to remove scripts when component unmounts
    return () => {
      document.body.removeChild(injectScript);
      document.body.removeChild(configScript);
    };
  }, []); // Empty dependency array means this runs once on mount

  return null; // This component doesn't render any visible elements
};

export default ChatBot;
