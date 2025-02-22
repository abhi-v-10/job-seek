import { useEffect, useState, useCallback, startTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ContactsList } from "@/components/messages/ContactsList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import type { Contact, Message } from "@/types/messages";

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const queryClient = useQueryClient();

  // Update the contacts query to match the new schema
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
          jobs (
            category,
            position,
            company_name,
            work_type
          )
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
              job_title: message.jobs?.category === 'corporate' ? message.jobs?.position : message.jobs?.work_type,
              company: message.jobs?.company_name,
              work: message.jobs?.work_type
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
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${selectedContact.id}),` +
          `and(sender_id.eq.${selectedContact.id},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!selectedContact?.id && !!user?.id,
  });

  // Mark messages as read when viewing them
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!user?.id || !selectedContact?.id) return;

      try {
        await supabase
          .from("messages")
          .update({ read: true })
          .eq("receiver_id", user.id)
          .eq("sender_id", selectedContact.id);

        // Invalidate queries to update UI
        queryClient.invalidateQueries({ queryKey: ["messages", selectedContact.id] });
        queryClient.invalidateQueries({ queryKey: ["unreadMessages"] });
      } catch (error: any) {
        console.error("Error marking messages as read:", error);
      }
    };

    markMessagesAsRead();
  }, [selectedContact?.id, user?.id, queryClient]);

  // Subscribe to new messages
  useEffect(() => {
    if (!user?.id) return;

    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          // Update messages if sender is currently selected contact
          if (selectedContact?.id === payload.new.sender_id) {
            queryClient.invalidateQueries({ queryKey: ["messages", selectedContact.id] });
          }
          // Always update unread messages count
          queryClient.invalidateQueries({ queryKey: ["unreadMessages"] });
          // Update contacts list as we might have a new contact
          queryClient.invalidateQueries({ queryKey: ["contacts"] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, selectedContact?.id, queryClient]);

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
        content: messageInput.trim(),
        sender_id: user.id,
        receiver_id: selectedContact.id,
        job_id: selectedContact.job_id,
        read: false
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
        <ContactsList
          contacts={contacts}
          selectedContact={selectedContact}
          onContactSelect={handleContactSelect}
        />
        <ChatWindow
          contact={selectedContact}
          messages={messages}
          currentUserId={user.id}
          messageInput={messageInput}
          onMessageInputChange={setMessageInput}
          onMessageSubmit={handleSendMessage}
        />
      </div>
    </div>
  );
}
