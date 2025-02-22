
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { IndianRupee } from "lucide-react";

interface Job {
  id: string;
  category: "corporate" | "domestic";
  location: string;
  company_name?: string;
  position?: string;
  salary_range_min?: number;
  salary_range_max?: number;
  employment_type?: string;
  years_of_experience?: string;
  work_type?: string;
  daily_hours?: number;
  hourly_wage_min?: number;
  hourly_wage_max?: number;
  created_at: string;
}

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (isLoading) {
    return <div>Loading jobs...</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No jobs available yet</p>
        <Button asChild>
          <Link to="/post-job">Post a Job</Link>
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatMoney = (amount: number, isHourly = false) => {
    if (isHourly) {
      return `₹${amount}`;
    }
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  return (
    <div className="space-y-6">
      <div className="text-right">
        <Button asChild>
          <Link to="/post-job">Post a Job</Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="job-card hover:border-blue-500/50 hover:shadow-blue-500/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                {job.category === "corporate" ? (
                  <>
                    <h3 className="font-semibold text-lg">{job.position?.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</h3>
                    <p className="text-muted-foreground">{job.company_name}</p>
                  </>
                ) : (
                  <h3 className="font-semibold text-lg">
                    {job.work_type?.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                  </h3>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(job.created_at)}
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Location:</span> {job.location}
              </p>
              
              {job.category === "corporate" ? (
                <>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Employment:</span>{" "}
                    {job.employment_type?.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Experience:</span>{" "}
                    {job.years_of_experience}
                  </p>
                  <p className="flex items-center gap-1 text-sm">
                    <IndianRupee className="h-3 w-3" />
                    <span className="text-muted-foreground">Salary:</span>{" "}
                    {formatMoney(job.salary_range_min!)} - {formatMoney(job.salary_range_max!)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Daily Hours:</span>{" "}
                    {job.daily_hours} hours
                  </p>
                  <p className="flex items-center gap-1 text-sm">
                    <IndianRupee className="h-3 w-3" />
                    <span className="text-muted-foreground">Hourly Rate:</span>{" "}
                    {formatMoney(job.hourly_wage_min!, true)} - {formatMoney(job.hourly_wage_max!, true)}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
