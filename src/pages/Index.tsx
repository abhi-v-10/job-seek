
import { useQuery } from "@tanstack/react-query";
import { MainNav } from "@/components/MainNav";
import { JobCard } from "@/components/JobCard";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Available Jobs</h1>
            <p className="text-muted-foreground mt-2">
              Find your next opportunity from our curated list of positions
            </p>
          </div>
          {isLoading ? (
            <p>Loading jobs...</p>
          ) : jobs && jobs.length > 0 ? (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id}
                  company={job.company}
                  position={job.position}
                  location={job.location}
                  salary={job.salary}
                  type={job.type}
                  level={job.level}
                  postedAt={new Date(job.created_at)}
                />
              ))}
            </div>
          ) : (
            <p>No jobs found. Be the first to post a job!</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Index;
