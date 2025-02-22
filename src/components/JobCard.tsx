
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JobCardProps {
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
  company,
  position,
  location,
  salary,
  type,
  level,
  postedAt,
  logo
}: JobCardProps) {
  return (
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
        <Button variant="ghost" size="sm">
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
  );
}
