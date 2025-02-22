
import { useEffect, useState } from "react";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle } from "lucide-react";

declare global {
  interface Window {
    botpressWebChat: {
      init: (config: any) => void;
      sendEvent: (event: any) => void;
      onEvent: (event: any, handler: any) => void;
    };
  }
}

const SeekBot = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBotReady, setIsBotReady] = useState(false);

  useEffect(() => {
    // Add Botpress script
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src = "https://files.bpcontent.cloud/2025/02/22/12/20250222122058-B0CN79X3.js";
    script2.async = true;

    const initializeBot = () => {
      if (typeof window.botpressWebChat !== 'undefined') {
        try {
          window.botpressWebChat.init({
            composerPlaceholder: "Chat with SeekBot...",
            showConversationsButton: false,
            containerWidth: '100%',
            layoutWidth: '100%',
            hideWidget: true,
            stylesheet: `
              :root {
                --main-bg-color: #ffffff;
                --composer-bg-color: #f3f4f6;
                --composer-text-color: #374151;
              }
              .bpw-layout {
                width: 100% !important;
                height: calc(100vh - 150px) !important;
                border-radius: 0 !important;
                margin: 0 !important;
              }
              .bpw-header-container {
                padding: 1rem !important;
                border-top-left-radius: 0 !important;
                border-top-right-radius: 0 !important;
              }
            `
          });

          window.botpressWebChat.onEvent(
            "LIFECYCLE.LOADED",
            () => {
              setIsBotReady(true);
              window.botpressWebChat.onEvent(
                "WEBSOCKET.STATE_CHANGED",
                (event: any) => {
                  setIsChatOpen(event.connected);
                }
              );
            }
          );
        } catch (error) {
          console.error("Error initializing Botpress:", error);
        }
      }
    };

    const checkBotpress = setInterval(() => {
      if (typeof window.botpressWebChat !== 'undefined') {
        clearInterval(checkBotpress);
        initializeBot();
      }
    }, 100);

    document.body.appendChild(script1);
    script1.onload = () => {
      document.body.appendChild(script2);
    };

    // Clean up on unmount
    return () => {
      clearInterval(checkBotpress);
      document.body.removeChild(script1);
      if (document.body.contains(script2)) {
        document.body.removeChild(script2);
      }
      const webchatContainer = document.getElementById("bp-web-widget");
      if (webchatContainer) {
        document.body.removeChild(webchatContainer);
      }
    };
  }, []);

  const handleChatToggle = () => {
    if (isBotReady && !isChatOpen && window.botpressWebChat) {
      window.botpressWebChat.sendEvent({ type: "show" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-6">Chat with SeekBot</h1>
          <p className="text-muted-foreground mb-8">
            Ask me anything about job searching, resume writing, or career advice!
          </p>
        </div>
      </main>

      {/* Chat Icon Button */}
      {!isChatOpen && isBotReady && (
        <Button
          onClick={handleChatToggle}
          className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0"
          variant="default"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default SeekBot;
