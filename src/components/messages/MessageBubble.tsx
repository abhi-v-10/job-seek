
interface MessageBubbleProps {
  content: string;
  isCurrentUser: boolean;
}

export function MessageBubble({ content, isCurrentUser }: MessageBubbleProps) {
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-lg px-4 py-2 max-w-[70%] ${
          isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
