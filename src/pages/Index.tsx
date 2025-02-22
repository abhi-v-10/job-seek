
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
  DialogDescription,
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

const HOURLY_WAGE_RANGES = [
  "0-200",
  "200-400",
  "400-600",
  "600-800",
  "800-1000",
  "1000+"
];

const EMPLOYMENT_TYPES = ["Full Time", "Part Time"];

const Index = () => {
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedWork, setSelectedWork] = useState<string | null>(null);
  const [selectedHourlyWageRange, setSelectedHourlyWageRange] = useState<string | null>(null);
  const [selectedDailyWorkTime, setSelectedDailyWorkTime] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Generalize and normalize a string for comparison
  const normalizeString = (str: string) => str.toLowerCase().trim().replace(/\s+/g, ' ');

  // Get unique values for filter options based on job type
  const locations = Array.from(new Set(jobs?.filter(job => job.job_type === 'corporate').map(job => {
    const location = job.location.split(',')[0].trim(); // Get just the city or main area
    return location.charAt(0).toUpperCase() + location.slice(1).toLowerCase(); // Capitalize first letter
  }) || []));

  const companies = Array.from(new Set(jobs?.filter(job => job.job_type === 'corporate').map(job => job.company) || []));
  const positions = Array.from(new Set(jobs?.filter(job => job.job_type === 'corporate').map(job => job.position) || []));
  const works = Array.from(new Set(jobs?.filter(job => job.job_type === 'domestic').map(job => job.work) || []));
  const dailyWorkTimes = Array.from(new Set(jobs?.filter(job => job.job_type === 'domestic').map(job => job.daily_work_time) || []));

  // Function to check if a wage falls within a range
  const isInHourlyWageRange = (wage: string, range: string) => {
    if (!wage) return false;
    const numericWage = parseInt(wage.replace(/[^0-9]/g, ''));
    if (isNaN(numericWage)) return false;
    
    const [min, max] = range.split('-').map(num => parseInt(num.replace(/\D/g, '')));
    if (range.endsWith('+')) return numericWage >= min;
    return numericWage >= min && numericWage <= max;
  };

  // Filter jobs based on selected criteria
  const filteredJobs = jobs?.filter(job => {
    // First filter by job type
    if (selectedJobType && job.job_type !== selectedJobType.toLowerCase()) return false;

    if (job.job_type === 'corporate') {
      const matchesLocation = !selectedLocation || 
        normalizeString(job.location).includes(normalizeString(selectedLocation));
      const matchesCompany = !selectedCompany || 
        normalizeString(job.company || '').includes(normalizeString(selectedCompany));
      const matchesPosition = !selectedPosition || 
        normalizeString(job.position || '').includes(normalizeString(selectedPosition));
      const matchesType = !selectedType || 
        normalizeString(job.type || '').includes(normalizeString(selectedType));
      
      return matchesLocation && matchesCompany && matchesPosition && matchesType;
    } else {
      // Domestic job filters
      const matchesWork = !selectedWork || 
        normalizeString(job.work || '').includes(normalizeString(selectedWork));
      const matchesHourlyWage = !selectedHourlyWageRange || 
        isInHourlyWageRange(job.hourly_wage || '', selectedHourlyWageRange);
      const matchesDailyWorkTime = !selectedDailyWorkTime || 
        job.daily_work_time === parseInt(selectedDailyWorkTime);
      
      return matchesWork && matchesHourlyWage && matchesDailyWorkTime;
    }
  });

  const clearFilters = () => {
    setSelectedJobType(null);
    setSelectedLocation(null);
    setSelectedCompany(null);
    setSelectedPosition(null);
    setSelectedSalaryRange(null);
    setSelectedType(null);
    setSelectedWork(null);
    setSelectedHourlyWageRange(null);
    setSelectedDailyWorkTime(null);
  };

  const hasActiveFilters = selectedJobType || selectedLocation || selectedCompany || 
    selectedPosition || selectedSalaryRange || selectedType || selectedWork || 
    selectedHourlyWageRange || selectedDailyWorkTime;

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
                    <DialogDescription>
                      Select job type and relevant filters to find the perfect match.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Select
                        value={selectedJobType || ""}
                        onValueChange={(value) => {
                          setSelectedJobType(value);
                          // Clear other filters when job type changes
                          setSelectedLocation(null);
                          setSelectedCompany(null);
                          setSelectedPosition(null);
                          setSelectedType(null);
                          setSelectedWork(null);
                          setSelectedHourlyWageRange(null);
                          setSelectedDailyWorkTime(null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Job Type</SelectLabel>
                            <SelectItem value="corporate">Corporate</SelectItem>
                            <SelectItem value="domestic">Domestic</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedJobType === 'corporate' && (
                      <>
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
                            value={selectedType || ""}
                            onValueChange={setSelectedType}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select employment type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Employment Type</SelectLabel>
                                {EMPLOYMENT_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    {selectedJobType === 'domestic' && (
                      <>
                        <div className="space-y-2">
                          <Select
                            value={selectedWork || ""}
                            onValueChange={setSelectedWork}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select work type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Work</SelectLabel>
                                {works.map((work) => (
                                  <SelectItem key={work} value={work}>
                                    {work}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Select
                            value={selectedHourlyWageRange || ""}
                            onValueChange={setSelectedHourlyWageRange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select hourly wage range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Hourly Wage Range</SelectLabel>
                                {HOURLY_WAGE_RANGES.map((range) => (
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
                            value={selectedDailyWorkTime?.toString() || ""}
                            onValueChange={(value) => setSelectedDailyWorkTime(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select daily work hours" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Daily Work Hours</SelectLabel>
                                {dailyWorkTimes.map((time) => (
                                  <SelectItem key={time} value={time.toString()}>
                                    {time} hours
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {selectedJobType && (
                <Badge variant="secondary" className="gap-2">
                  {selectedJobType}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedJobType(null)}
                  />
                </Badge>
              )}
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
              {selectedType && (
                <Badge variant="secondary" className="gap-2">
                  {selectedType}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedType(null)}
                  />
                </Badge>
              )}
              {selectedWork && (
                <Badge variant="secondary" className="gap-2">
                  {selectedWork}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedWork(null)}
                  />
                </Badge>
              )}
              {selectedHourlyWageRange && (
                <Badge variant="secondary" className="gap-2">
                  {selectedHourlyWageRange}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedHourlyWageRange(null)}
                  />
                </Badge>
              )}
              {selectedDailyWorkTime && (
                <Badge variant="secondary" className="gap-2">
                  {selectedDailyWorkTime} hours
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedDailyWorkTime(null)}
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
                  work={job.work}
                  dailyWorkTime={job.daily_work_time}
                  jobType={job.job_type}
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

