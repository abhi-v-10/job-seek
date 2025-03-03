
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Eye, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface JobCardProps {
  id: string;
  company: string;
  position: string;
  location: string;
  salary: string;
  type: string;
  level: string;
  postedAt: Date;
  logo?: string;
}

export function JobCard({
  id,
  company = "Unknown Company", // Added default value
  position = "Untitled Position", // Added default value
  location = "No location specified", // Added default value
  salary = "Salary not specified", // Added default value
  type = "Not specified", // Added default value
  level = "Not specified", // Added default value
  postedAt,
  logo,
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
          profiles!jobs_posted_by_fkey (
            username,
            full_name,
            avatar_url,
            id
          )
        `)
        .eq('id', id)
        .maybeSingle(); // Changed from single() to maybeSingle()
      
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
            content: `Interested in ${position} position at ${company}`,
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

  return (
    <>
      <div className="job-card animate-in">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              {logo ? (
                <img src={logo} alt={company} className="w-8 h-8 rounded-full" />
              ) : (
                <span className="text-lg font-semibold">
                  {company && company.length > 0 ? company[0].toUpperCase() : "?"}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{position}</h3>
              <p className="text-sm text-muted-foreground">{company}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{type}</Badge>
                <Badge variant="secondary">{level}</Badge>
              </div>
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
            <DialogTitle className="text-xl">{position}</DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <p>Loading job details...</p>
            </div>
          ) : jobDetails ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-lg font-semibold">
                    {company && company.length > 0 ? company[0].toUpperCase() : "?"}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold">{company}</h4>
                  <p className="text-sm text-muted-foreground">{location}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge>{type}</Badge>
                  <Badge>{level}</Badge>
                  <Badge variant="secondary">{salary}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Posted by</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {jobDetails.profiles?.avatar_url ? (
                      <img 
                        src={jobDetails.profiles.avatar_url} 
                        alt={jobDetails.profiles.full_name || "User"} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-sm font-semibold">
                          {(jobDetails.profiles?.full_name?.[0] || jobDetails.profiles?.username?.[0] || "?").toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span>
                      {jobDetails.profiles?.full_name || jobDetails.profiles?.username || "Anonymous"}
                    </span>
                  </div>
                  {user?.id !== jobDetails.posted_by && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={startChat}
                      className="flex items-center"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  )}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Posted {formatDistanceToNow(new Date(postedAt), { addSuffix: true })}
              </div>
            </div>
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

