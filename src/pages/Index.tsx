
import { MainNav } from "@/components/MainNav";
import { JobCard } from "@/components/JobCard";

const MOCK_JOBS = [
  {
    id: 1,
    company: "TechCorp",
    position: "Senior Frontend Developer",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    type: "Full-time",
    level: "Senior",
    postedAt: new Date("2024-02-15")
  },
  {
    id: 2,
    company: "DesignHub",
    position: "UI/UX Designer",
    location: "Remote",
    salary: "$90k - $120k",
    type: "Full-time",
    level: "Mid-level",
    postedAt: new Date("2024-02-14")
  },
  {
    id: 3,
    company: "StartupX",
    position: "Product Manager",
    location: "New York, NY",
    salary: "$130k - $160k",
    type: "Full-time",
    level: "Senior",
    postedAt: new Date("2024-02-13")
  }
];

const Index = () => {
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
          <div className="grid gap-4">
            {MOCK_JOBS.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Index;
