
import { useQuery } from "@tanstack/react-query";
import { MainNav } from "@/components/MainNav";
import { JobCard } from "@/components/JobCard";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, X } from "lucide-react";

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  // Get unique locations and companies for filter options
  const locations = Array.from(new Set(jobs?.map(job => job.location) || []));
  const companies = Array.from(new Set(jobs?.map(job => job.company) || []));

  // Filter jobs based on selected criteria
  const filteredJobs = jobs?.filter(job => {
    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const matchesCompany = !selectedCompany || job.company === selectedCompany;
    return matchesLocation && matchesCompany;
  });

  const clearFilters = () => {
    setSelectedLocation(null);
    setSelectedCompany(null);
  };

  const hasActiveFilters = selectedLocation || selectedCompany;

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Available Jobs</h1>
              <p className="text-muted-foreground mt-2">
                Find your next opportunity from our curated list of positions
              </p>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  Clear filters
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter Jobs
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Filter Jobs</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <SelectLabel>Location</SelectLabel>
                      <Select
                        value={selectedLocation || ""}
                        onValueChange={setSelectedLocation}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <SelectLabel>Company</SelectLabel>
                      <Select
                        value={selectedCompany || ""}
                        onValueChange={setSelectedCompany}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {companies.map((company) => (
                              <SelectItem key={company} value={company}>
                                {company}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex gap-2">
              {selectedLocation && (
                <Badge variant="secondary" className="gap-2">
                  {selectedLocation}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedLocation(null)}
                  />
                </Badge>
              )}
              {selectedCompany && (
                <Badge variant="secondary" className="gap-2">
                  {selectedCompany}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedCompany(null)}
                  />
                </Badge>
              )}
            </div>
          )}

          {isLoading ? (
            <p>Loading jobs...</p>
          ) : filteredJobs && filteredJobs.length > 0 ? (
            <div className="grid gap-4">
              {filteredJobs.map((job) => (
                <JobCard 
                  key={job.id}
                  id={job.id}
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
            <p>No jobs found matching your filters. Try adjusting your search criteria.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Index;
