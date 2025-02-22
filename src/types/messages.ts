
export type Message = {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  job_id: string | null;
  read: boolean;
};

export type Contact = {
  id: string;
  full_name: string | null;
  job_id?: string | null;
  job_title?: string | null;
  company?: string | null;
  work?: string | null;
};
