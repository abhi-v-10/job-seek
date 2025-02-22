
interface ChatHeaderProps {
  fullName: string;
}

export function ChatHeader({ fullName }: ChatHeaderProps) {
  return (
    <h2 className="text-lg font-semibold mb-4">
      Chat with {fullName || "Unknown"}
    </h2>
  );
}
