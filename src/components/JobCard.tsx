
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JobLogo } from "./jobs/JobLogo";
import { JobTitle } from "./jobs/JobTitle";
import { JobDetails } from "./jobs/JobDetails";
import { JobDialogContent } from "./jobs/JobDialogContent";
import { JobActions } from "./jobs/JobActions";
import { JobFooter } from "./jobs/JobFooter";
import { useJobDetails } from "@/hooks/useJobDetails";
import { useJobChat } from "@/hooks/useJobChat";

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
  jobType: string;
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
  jobType,
}: JobCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: jobDetails, isLoading } = useJobDetails(id, isOpen);
  const { startChat, user } = useJobChat();

  const handleMessageClick = () => {
    startChat(jobDetails, jobType, position, company, work);
  };

  return (
    <>
      <div className={`job-card animate-in ${jobType === 'corporate' ? '!bg-[#2C7A7B]' : '!bg-[#123524]'}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <JobLogo logo={logo} company={company} work={work} jobType={jobType} />
            <div>
              <JobTitle
                jobType={jobType}
                position={position}
                company={company}
                work={work}
                dailyWorkTime={dailyWorkTime}
              />
              <JobDetails
                jobType={jobType}
                type={type}
                level={level}
                work={work}
                dailyWorkTime={dailyWorkTime}
              />
            </div>
          </div>
          <JobActions onViewDetails={() => setIsOpen(true)} />
        </div>
        <JobFooter 
          location={location}
          salary={salary}
          postedAt={postedAt}
          jobType={jobType}
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {jobType === 'corporate' ? position : work}
            </DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <p>Loading job details...</p>
            </div>
          ) : jobDetails ? (
            <JobDialogContent
              jobDetails={jobDetails}
              jobType={jobType}
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
              onMessageClick={handleMessageClick}
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

