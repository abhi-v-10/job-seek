
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
            className="w-full justify-start"
            onClick={() => onContactSelect(contact)}
          >
            {contact.full_name || "Unknown"}
          </Button>
        ))}
      </div>
    </div>
  );
}
