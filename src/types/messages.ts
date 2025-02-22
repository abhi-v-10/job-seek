
export type Message = {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
};

export type Contact = {
  id: string;
  full_name: string | null;
};
