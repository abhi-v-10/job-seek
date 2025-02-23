
import { Badge } from "@/components/ui/badge";

interface JobDetailsProps {
  jobType: string;
  type?: string;
  level?: string;
  work?: string;
  dailyWorkTime?: number;
}

export function JobDetails({ jobType, type, level, work, dailyWorkTime }: JobDetailsProps) {
  if (jobType === 'corporate') {
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="secondary">{type}</Badge>
        <Badge variant="secondary">{level}</Badge>
      </div>
    );
  }
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <Badge variant="secondary">Domestic Work</Badge>
      <p className="text-sm text-muted-foreground">
        {dailyWorkTime} hours per day
      </p>
    </div>
  );
}
