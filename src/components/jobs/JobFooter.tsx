
import { formatDistanceToNow } from "date-fns";

interface JobFooterProps {
  location: string;
  salary: string;
  postedAt: Date;
  jobType: string;
}

export function JobFooter({ location, salary, postedAt, jobType }: JobFooterProps) {
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
      <div className="flex items-center space-x-4">
        <span>{location}</span>
        <span>{jobType === 'corporate' ? salary : `${salary} per hour`}</span>
      </div>
      <span>{formatDistanceToNow(postedAt, { addSuffix: true })}</span>
    </div>
  );
}

