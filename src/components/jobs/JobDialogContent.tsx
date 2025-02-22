
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { JobLogo } from "./JobLogo";

interface JobDialogContentProps {
  jobDetails: any;
  jobType: string;
  company?: string;
  position?: string;
  work?: string;
  location: string;
  salary: string;
  type?: string;
  level?: string;
  dailyWorkTime?: number;
  postedAt: Date;
  userId?: string;
  onMessageClick: () => void;
}

export function JobDialogContent({
  jobDetails,
  jobType,
  company,
  position,
  work,
  location,
  salary,
  type,
  level,
  dailyWorkTime,
  postedAt,
  userId,
  onMessageClick,
}: JobDialogContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <JobLogo logo="" company={company} work={work} jobType={jobType} />
        <div>
          {jobType === 'corporate' ? (
            <>
              <h4 className="font-semibold">{company}</h4>
              <p className="text-sm text-muted-foreground">{location}</p>
            </>
          ) : (
            <>
              <h4 className="font-semibold">{work}</h4>
              <p className="text-sm text-muted-foreground">
                {dailyWorkTime} hours per day at {location}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {jobType === 'corporate' ? (
            <>
              <Badge>{type}</Badge>
              <Badge>{level}</Badge>
              <Badge variant="secondary">{salary}</Badge>
            </>
          ) : (
            <>
              <Badge>Domestic Work</Badge>
              <Badge variant="secondary">{salary} per hour</Badge>
            </>
          )}
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
          {userId !== jobDetails.posted_by && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onMessageClick}
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
  );
}
