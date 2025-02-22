
import { Button } from "@/components/ui/button";
import { Contact } from "@/types/messages";

interface ContactsListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onContactSelect: (contact: Contact) => void;
}

export function ContactsList({ contacts, selectedContact, onContactSelect }: ContactsListProps) {
  return (
    <div className="w-1/3 border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Conversations</h2>
      <div className="space-y-2">
        {contacts.map((contact) => (
          <Button
            key={contact.id}
            variant={selectedContact?.id === contact.id ? "default" : "outline"}
            className="w-full justify-start flex flex-col items-start"
            onClick={() => onContactSelect(contact)}
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
  );
}
