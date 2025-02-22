
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { JobLogo } from "./jobs/JobLogo";
import { JobTitle } from "./jobs/JobTitle";
import { JobDetails } from "./jobs/JobDetails";
import { JobDialogContent } from "./jobs/JobDialogContent";

interface JobCardProps {
  id: string;
  company?: string;
  position?: string;
  location: string;
  salary: string;
  type?: string;
  level?: string;
  postedAt: Date;
  logo?: string;
  work?: string;
  dailyWorkTime?: number;
  category: "corporate" | "domestic";
}

export function JobCard({
  id,
  company,
  position,
  location,
  salary,
  type,
  level,
  postedAt,
  logo,
  work,
  dailyWorkTime,
  category,
}: JobCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: jobDetails, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles!jobs_user_id_fkey (
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
    enabled: isOpen,
  });

  const startChat = async () => {
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
            content: category === 'corporate' 
              ? `Interested in ${position} position at ${company}`
              : `Interested in ${work} work`,
            sender_id: user.id,
            receiver_id: jobDetails?.profiles?.id,
            job_id: id
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

  return (
    <>
      <div className={`job-card animate-in ${category === 'corporate' ? '!bg-[#2C7A7B]' : '!bg-[#123524]'}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <JobLogo logo={logo} company={company} work={work} category={category} />
            <div>
              <JobTitle
                category={category}
                position={position}
                company={company}
                work={work}
                dailyWorkTime={dailyWorkTime}
              />
              <JobDetails
                category={category}
                type={type}
                level={level}
                work={work}
                dailyWorkTime={dailyWorkTime}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setIsOpen(true)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Details
            </Button>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>{location}</span>
            <span>{salary}</span>
          </div>
          <span>{formatDistanceToNow(postedAt, { addSuffix: true })}</span>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {category === 'corporate' ? position : work}
            </DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <p>Loading job details...</p>
            </div>
          ) : jobDetails ? (
            <JobDialogContent
              jobDetails={jobDetails}
              category={category}
              company={company}
              position={position}
              work={work}
              location={location}
              salary={salary}
              type={type}
              level={level}
              dailyWorkTime={dailyWorkTime}
              postedAt={postedAt}
              userId={user?.id}
              onMessageClick={startChat}
            />
          ) : (
            <div className="p-4">
              <p>Failed to load job details</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
