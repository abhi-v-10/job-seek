
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

const ChatBot = () => {
  const [isLoading, setIsLoading] = useState(true);

  const initializeChatbot = () => {
    return new Promise((resolve, reject) => {
      try {
        // Create and inject the first script
        const injectScript = document.createElement("script");
        injectScript.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
        injectScript.async = true;
        injectScript.crossOrigin = "anonymous"; // Add CORS header
        
        // Handle script load error
        injectScript.onerror = (error) => {
          console.error("Error loading script:", error);
          reject(new Error(`Failed to load script: ${injectScript.src}`));
        };

        // Handle successful load of first script
        injectScript.onload = () => {
          // Create and inject the second script after first one loads
          const configScript = document.createElement("script");
          configScript.src = "https://files.bpcontent.cloud/2025/02/22/12/20250222122058-B0CN79X3.js";
          configScript.async = true;
          configScript.crossOrigin = "anonymous"; // Add CORS header
          
          // Handle config script error
          configScript.onerror = (error) => {
            console.error("Error loading config script:", error);
            reject(new Error(`Failed to load script: ${configScript.src}`));
          };

          // Handle successful load of second script
          configScript.onload = () => {
            resolve(undefined);
          };

          document.body.appendChild(configScript);
        };

        document.body.appendChild(injectScript);
      } catch (error) {
        console.error("Error initializing chatbot:", error);
        reject(error);
      }
    });
  };

  useEffect(() => {
    const loadChatbot = async () => {
      try {
        setIsLoading(true);
        await initializeChatbot();
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing chatbot:", error);
        toast({
          title: "Error",
          description: "Failed to load chat bot. Please try refreshing the page.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    loadChatbot();

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[src*="botpress"]');
      scripts.forEach(script => script.remove());
    };
  }, []); // Empty dependency array means this runs once on mount

  if (isLoading) {
    return null;
  }

  return null; // This component doesn't render any visible elements
};

export default ChatBot;

