
import { useEffect, useState, useCallback, startTransition, Suspense } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  job_id: string | null;
};

type Contact = {
  id: string;
  full_name: string | null;
  job_id?: string | null;
  job_title?: string | null;
  company?: string | null;
  work?: string | null;
};

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const queryClient = useQueryClient();

  // Fetch contacts (users we've messaged with)
  const { data: contacts = [] } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data: messages, error } = await supabase
        .from("messages")
        .select(`
          sender_id,
          receiver_id,
          job_id,
          jobs:jobs(position, company, work)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (error) throw error;

      // Get unique contacts with their associated job details
      const uniqueContacts = new Map<string, Contact>();
      
      for (const message of messages) {
        const contactId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        
        if (!uniqueContacts.has(contactId)) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, full_name")
            .eq("id", contactId)
            .single();

          if (profile) {
            uniqueContacts.set(contactId, {
              id: profile.id,
              full_name: profile.full_name,
              job_id: message.job_id,
              job_title: message.jobs?.position || message.jobs?.work,
              company: message.jobs?.company,
              work: message.jobs?.work
            });
          }
        }
      }

      return Array.from(uniqueContacts.values());
    },
    enabled: !!user?.id,
  });

  // Fetch messages for selected contact
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", selectedContact?.id],
    queryFn: async () => {
      if (!selectedContact?.id || !user?.id) return [];

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${selectedContact.id},receiver_id.eq.${selectedContact.id}`)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!selectedContact?.id && !!user?.id,
  });

  // Subscribe to new messages
  useEffect(() => {
    if (!user?.id || !selectedContact?.id) return;

    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${selectedContact.id},receiver_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["messages", selectedContact.id] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedContact?.id, user?.id, queryClient]);

  const handleContactSelect = useCallback((contact: Contact) => {
    startTransition(() => {
      setSelectedContact(contact);
    });
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedContact?.id || !messageInput.trim()) return;

    try {
      const { error } = await supabase.from("messages").insert({
        content: messageInput,
        sender_id: user.id,
        receiver_id: selectedContact.id,
        job_id: selectedContact.job_id
      });

      if (error) throw error;

      setMessageInput("");
      queryClient.invalidateQueries({ queryKey: ["messages", selectedContact.id] });
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate("/")}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <div className="flex gap-4 h-[600px]">
        <div className="w-1/3 border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Conversations</h2>
          <div className="space-y-2">
            {contacts.map((contact) => (
              <Button
                key={contact.id}
                variant={selectedContact?.id === contact.id ? "default" : "outline"}
                className="w-full justify-start flex flex-col items-start"
                onClick={() => handleContactSelect(contact)}
              >
                <span>{contact.full_name || "Unknown"}</span>
                {contact.job_title && (
                  <span className="text-xs text-muted-foreground">
                    {contact.company ? `${contact.job_title} at ${contact.company}` : contact.job_title}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 border rounded-lg p-4">
          {selectedContact ? (
            <div className="h-full flex flex-col">
              <h2 className="text-lg font-semibold mb-4">
                Chat with {selectedContact.full_name || "Unknown"}
                {selectedContact.job_title && (
                  <div className="text-sm text-muted-foreground">
                    {selectedContact.company 
                      ? `Regarding: ${selectedContact.job_title} at ${selectedContact.company}`
                      : `Regarding: ${selectedContact.job_title}`
                    }
                  </div>
                )}
              </h2>
              <Suspense fallback={<div>Loading messages...</div>}>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[70%] ${
                          message.sender_id === user.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </Suspense>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                />
                <Button type="submit">Send</Button>
              </form>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
