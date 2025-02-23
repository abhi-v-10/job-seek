
interface ChatHeaderProps {
  fullName: string;
  jobTitle?: string;
  company?: string;
}

export function ChatHeader({ fullName, jobTitle, company }: ChatHeaderProps) {
  return (
    <h2 className="text-lg font-semibold mb-4">
      Chat with {fullName || "Unknown"}
      {jobTitle && (
        <div className="text-sm text-muted-foreground">
          {company ? `Regarding: ${jobTitle} at ${company}` : `Regarding: ${jobTitle}`}
        </div>
      )}
    </h2>
  );
}
