
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Messages from "@/pages/Messages";
import NotFound from "@/pages/NotFound";
import ProfileSettings from "@/pages/ProfileSettings";
import SeekBot from "@/pages/SeekBot";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/profile-settings" element={<ProfileSettings />} />
      <Route path="/seekbot" element={<SeekBot />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
