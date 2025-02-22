
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useJobChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const startChat = async (jobDetails: any, jobType: string, position?: string, company?: string, work?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send messages",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      const { data: existingChat, error: chatError } = await supabase
        .from('messages')
        .select('id')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${jobDetails?.profiles?.id}),and(sender_id.eq.${jobDetails?.profiles?.id},receiver_id.eq.${user.id})`)
        .limit(1);

      if (!existingChat?.length) {
        await supabase
          .from('messages')
          .insert({
            content: jobType === 'corporate' 
              ? `Interested in ${position} position at ${company}`
              : `Interested in ${work} work`,
            sender_id: user.id,
            receiver_id: jobDetails?.profiles?.id,
          });
      }

      toast({
        title: "Chat started",
        description: "You can now message the job poster",
      });

      navigate("/messages");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { startChat, user };
};

