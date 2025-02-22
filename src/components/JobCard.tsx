
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
import { Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  company,
  position,
  location,
  salary,
  type,
  level,
  postedAt,
  logo,
}: JobCardProps) {
  const [isOpen, setIsOpen] = useState(false);

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
            avatar_url
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  return (
    <>
      <div className="job-card animate-in">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              {logo ? (
                <img src={logo} alt={company} className="w-8 h-8 rounded-full" />
              ) : (
                <span className="text-lg font-semibold">{company[0]}</span>
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
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setIsOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Details
          </Button>
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
                  <span className="text-lg font-semibold">{company[0]}</span>
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
                <div className="flex items-center space-x-2">
                  {jobDetails.profiles?.avatar_url ? (
                    <img 
                      src={jobDetails.profiles.avatar_url} 
                      alt={jobDetails.profiles.username || "User"} 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-sm font-semibold">
                        {(jobDetails.profiles?.username || "U")[0]}
                      </span>
                    </div>
                  )}
                  <span className="text-sm">
                    {jobDetails.profiles?.full_name || jobDetails.profiles?.username || "Anonymous"}
                  </span>
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
