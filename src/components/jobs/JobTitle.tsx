
interface JobTitleProps {
  jobType: string;
  position?: string;
  company?: string;
  work?: string;
  dailyWorkTime?: number;
}

export function JobTitle({ jobType, position, company, work, dailyWorkTime }: JobTitleProps) {
  if (jobType === 'corporate') {
    return (
      <>
        <h3 className="font-semibold text-lg">{position}</h3>
        <p className="text-sm text-muted-foreground">{company}</p>
      </>
    );
  }
  
  return (
    <>
      <h3 className="font-semibold text-lg">{work || "Domestic Work"}</h3>
      <p className="text-sm text-muted-foreground">
        {dailyWorkTime} hours per day
      </p>
    </>
  );
}
