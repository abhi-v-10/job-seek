
import { useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

declare global {
  interface Window {
    botpressWebChat: {
      init: (config: any) => void;
    };
  }
}

const SeekBot = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add Botpress script
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src = "https://files.bpcontent.cloud/2025/02/22/12/20250222122058-B0CN79X3.js";
    script2.async = true;

    document.body.appendChild(script1);
    document.body.appendChild(script2);

    // Clean up on unmount
    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
      // Remove the webchat container if it exists
      const webchatContainer = document.getElementById("webchat");
      if (webchatContainer) {
        document.body.removeChild(webchatContainer);
      }
    };
  }, []);

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
    </div>
  );
};

export default SeekBot;
