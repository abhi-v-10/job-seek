
import { MainNav } from "@/components/MainNav";
import { JobList } from "@/components/jobs/JobList";

const Jobs = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Available Jobs</h1>
            <p className="text-muted-foreground mt-2">
              Browse through corporate and domestic job opportunities
            </p>
          </div>
          <JobList />
        </div>
      </main>
    </div>
  );
};

export default Jobs;
