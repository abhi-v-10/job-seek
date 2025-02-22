
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

const ChatBot = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.crossOrigin = "anonymous";
        
        script.onload = () => {
          console.log(`Script loaded successfully: ${src}`);
          resolve();
        };
        
        script.onerror = (error) => {
          console.error(`Error loading script ${src}:`, error);
          reject(new Error(`Failed to load script: ${src}`));
        };
        
        document.body.appendChild(script);
      });
    };

    const initializeChatbot = async () => {
      try {
        // Load scripts in sequence to ensure proper initialization
        await loadScript("https://cdn.botpress.cloud/webchat/v2.2/inject.js");
        await loadScript("https://files.bpcontent.cloud/2025/02/22/12/20250222122058-B0CN79X3.js");
        setIsLoaded(true);
      } catch (error) {
        console.error("Error initializing chatbot:", error);
        toast({
          title: "Error",
          description: "Failed to load chat widget. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    initializeChatbot();

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script');
      scripts.forEach(script => {
        if (
          script.src.includes("botpress.cloud/webchat") ||
          script.src.includes("bpcontent.cloud")
        ) {
          document.body.removeChild(script);
        }
      });
    };
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (!isLoaded) return;

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
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, [isMinimized, isLoaded]);

  if (!isLoaded) {
    return null;
  }

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
