
import { useEffect, useState } from "react";

const ChatBot = () => {
  const [isMinimized, setIsMinimized] = useState(false);

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

  useEffect(() => {
    // Add custom styles to the chat container
    const style = document.createElement('style');
    style.textContent = `
      .bpw-layout {
        width: 100% !important;
        height: ${isMinimized ? '60px' : '400px'} !important;
        transition: height 0.3s ease;
        border-radius: 0 !important;
        border: none !important;
        border-top: 1px solid #e5e7eb !important;
      }
      .bpw-header {
        border-radius: 0 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isMinimized]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div 
        className="h-8 bg-background border-t border-border flex items-center justify-center cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <span className="text-sm text-muted-foreground">
          {isMinimized ? "Expand Chat" : "Minimize Chat"}
        </span>
      </div>
      <div id="webchat" />
    </div>
  );
};

export default ChatBot;
