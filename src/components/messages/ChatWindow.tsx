
import { Suspense } from "react";
import { Message, Contact } from "@/types/messages";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";

interface ChatWindowProps {
  contact: Contact | null;
  messages: Message[];
  currentUserId: string;
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onMessageSubmit: (e: React.FormEvent) => void;
}

export function ChatWindow({
  contact,
  messages,
  currentUserId,
  messageInput,
  onMessageInputChange,
  onMessageSubmit,
}: ChatWindowProps) {
  if (!contact) {
    return (
      <div className="flex-1 border rounded-lg p-4">
        <div className="h-full flex items-center justify-center text-muted-foreground">
          Select a conversation to start messaging
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 border rounded-lg p-4">
      <div className="h-full flex flex-col">
        <ChatHeader fullName={contact.full_name || "Unknown"} />
        <Suspense fallback={<div>Loading messages...</div>}>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                content={message.content}
                isCurrentUser={message.sender_id === currentUserId}
              />
            ))}
          </div>
        </Suspense>

        <MessageInput
          value={messageInput}
          onChange={onMessageInputChange}
          onSubmit={onMessageSubmit}
        />
      </div>
    </div>
  );
}
