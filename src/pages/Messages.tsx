
import { useState } from "react";
import { MainNav } from "@/components/MainNav";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeConversation, setActiveConversation] = useState(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, username),
          receiver:receiver_id(id, username)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-2">
            Please sign in to view your messages
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <div className="mt-6">
          {isLoading ? (
            <p>Loading messages...</p>
          ) : messages && messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="p-4 rounded-lg border bg-card"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {message.sender_id === user.id ? 
                          `To: ${message.receiver?.username}` : 
                          `From: ${message.sender?.username}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2">{message.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No messages found</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Messages;
