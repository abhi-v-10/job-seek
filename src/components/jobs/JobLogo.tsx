
import React from "react";

interface JobLogoProps {
  logo?: string;
  company?: string;
  work?: string;
  jobType: string;
}

export function JobLogo({ logo, company, work, jobType }: JobLogoProps) {
  return (
    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
      {logo ? (
        <img src={logo} alt={company} className="w-8 h-8 rounded-full" />
      ) : (
        <span className="text-lg font-semibold">
          {jobType === 'corporate' 
            ? (company && company.length > 0 ? company[0].toUpperCase() : "?")
            : (work && work.length > 0 ? work[0].toUpperCase() : "?")}
        </span>
      )}
    </div>
  );
}
