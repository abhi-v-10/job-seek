
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useJobDetails = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles!jobs_posted_by_fkey (
            username,
            full_name,
            avatar_url,
            id
          )
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled,
  });
};

