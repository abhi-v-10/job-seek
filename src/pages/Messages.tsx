
import { useState } from "react";
import { MainNav } from "@/components/MainNav";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MessageSquarePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define basic profile type without recursive relationships
type Profile = {
  id: string;
  username: string | null;
};

// Define message type with explicit profile types
type Message = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  sender: Profile | null;
  receiver: Profile | null;
};

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isStartingChat, setIsStartingChat] = useState(false);

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ['messages', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          receiver_id,
          sender:profiles!messages_sender_id_fkey(id, username),
          receiver:profiles!messages_receiver_id_fkey(id, username)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!user,
  });

  const startNewChat = async () => {
    if (!recipientEmail) return;
    
    setIsStartingChat(true);
    try {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('email', recipientEmail)
        .single();

      if (profileError || !profiles) {
        throw new Error("User not found");
      }

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          content: "Started a new conversation",
          sender_id: user?.id,
          receiver_id: profiles.id,
        });

      if (messageError) throw messageError;

      toast({
        title: "Chat started",
        description: `Started a new chat with ${profiles.username || recipientEmail}`,
      });

      setIsNewChatOpen(false);
      setRecipientEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsStartingChat(false);
    }
  };

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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Messages</h1>
          <Button
            onClick={() => setIsNewChatOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Start a new chat
          </Button>
        </div>
        
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

        <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Start a new chat</DialogTitle>
              <DialogDescription>
                Enter the email address of the person you want to chat with.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  placeholder="Enter recipient's email"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={startNewChat}
                disabled={!recipientEmail || isStartingChat}
              >
                {isStartingChat ? "Starting chat..." : "Start chat"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export default Messages;
