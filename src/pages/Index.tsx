
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
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
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

  // Get unique values for filter options
  const locations = Array.from(new Set(jobs?.map(job => job.location) || []));
  const companies = Array.from(new Set(jobs?.map(job => job.company) || []));
  const positions = Array.from(new Set(jobs?.map(job => job.position) || []));
  const types = Array.from(new Set(jobs?.map(job => job.type) || []));

  // Predefined salary ranges
  const salaryRanges = [
    "0-50k",
    "50k-100k",
    "100k-150k",
    "150k-200k",
    "200k+"
  ];

  // Helper function to check if a salary falls within a range
  const isInSalaryRange = (salary: string, range: string) => {
    const numericSalary = parseInt(salary.replace(/[^0-9]/g, ''));
    switch (range) {
      case "0-50k":
        return numericSalary <= 50000;
      case "50k-100k":
        return numericSalary > 50000 && numericSalary <= 100000;
      case "100k-150k":
        return numericSalary > 100000 && numericSalary <= 150000;
      case "150k-200k":
        return numericSalary > 150000 && numericSalary <= 200000;
      case "200k+":
        return numericSalary > 200000;
      default:
        return true;
    }
  };

  // Filter jobs based on selected criteria
  const filteredJobs = jobs?.filter(job => {
    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const matchesCompany = !selectedCompany || job.company === selectedCompany;
    const matchesPosition = !selectedPosition || job.position === selectedPosition;
    const matchesSalaryRange = !selectedSalaryRange || isInSalaryRange(job.salary, selectedSalaryRange);
    const matchesType = !selectedType || job.type === selectedType;
    
    return matchesLocation && matchesCompany && matchesPosition && matchesSalaryRange && matchesType;
  });

  const clearFilters = () => {
    setSelectedLocation(null);
    setSelectedCompany(null);
    setSelectedPosition(null);
    setSelectedSalaryRange(null);
    setSelectedType(null);
  };

  const hasActiveFilters = selectedLocation || selectedCompany || selectedPosition || selectedSalaryRange || selectedType;

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
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Filter Jobs</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Select
                        value={selectedPosition || ""}
                        onValueChange={setSelectedPosition}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Position</SelectLabel>
                            {positions.map((position) => (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Select
                        value={selectedLocation || ""}
                        onValueChange={setSelectedLocation}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Location</SelectLabel>
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
                      <Select
                        value={selectedCompany || ""}
                        onValueChange={setSelectedCompany}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Company</SelectLabel>
                            {companies.map((company) => (
                              <SelectItem key={company} value={company}>
                                {company}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Select
                        value={selectedSalaryRange || ""}
                        onValueChange={setSelectedSalaryRange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select salary range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Salary Range</SelectLabel>
                            {salaryRanges.map((range) => (
                              <SelectItem key={range} value={range}>
                                {range}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Select
                        value={selectedType || ""}
                        onValueChange={setSelectedType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Employment Type</SelectLabel>
                            {types.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
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
            <div className="flex flex-wrap gap-2">
              {selectedPosition && (
                <Badge variant="secondary" className="gap-2">
                  {selectedPosition}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedPosition(null)}
                  />
                </Badge>
              )}
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
              {selectedSalaryRange && (
                <Badge variant="secondary" className="gap-2">
                  {selectedSalaryRange}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedSalaryRange(null)}
                  />
                </Badge>
              )}
              {selectedType && (
                <Badge variant="secondary" className="gap-2">
                  {selectedType}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedType(null)}
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
