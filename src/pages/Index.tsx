
import { useQuery } from "@tanstack/react-query";
import { MainNav } from "@/components/MainNav";
import { JobCard } from "@/components/JobCard";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FilterDialog } from "@/components/jobs/filters/FilterDialog";
import { ActiveFilters } from "@/components/jobs/ActiveFilters";
import { normalizeString, isInHourlyWageRange } from "@/utils/job-filters";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
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

  // Sample corporate jobs for display
  const sampleJobs = [
    {
      id: 'sample-1',
      company: 'TechCorp Solutions',
      position: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      salary: '$120,000 - $180,000',
      type: 'Full-time',
      level: 'Senior',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      job_type: 'corporate'
    },
    {
      id: 'sample-2',
      company: 'Innovation Labs',
      position: 'Product Manager',
      location: 'New York, NY',
      salary: '$130,000 - $170,000',
      type: 'Full-time',
      level: 'Mid-Level',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      job_type: 'corporate'
    },
    {
      id: 'sample-3',
      company: 'Cloud Systems Inc',
      position: 'DevOps Engineer',
      location: 'Austin, TX',
      salary: '$110,000 - $160,000',
      type: 'Full-time',
      level: 'Mid-Level',
      created_at: new Date().toISOString(), // Today
      job_type: 'corporate'
    }
  ];

  // Get unique values for filter options based on job type
  const locations = Array.from(new Set(jobs?.filter(job => job.job_type === 'corporate').map(job => {
    const location = job.location.split(',')[0].trim();
    return location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
  }) || []));

  const companies = Array.from(new Set(jobs?.filter(job => job.job_type === 'corporate').map(job => job.company) || []));
  const positions = Array.from(new Set(jobs?.filter(job => job.job_type === 'corporate').map(job => job.position) || []));
  const works = Array.from(new Set(jobs?.filter(job => job.job_type === 'domestic').map(job => job.work) || []));
  const dailyWorkTimes = Array.from(new Set(jobs?.filter(job => job.job_type === 'domestic').map(job => job.daily_work_time.toString()) || []));

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
    setSelectedType(null);
    setSelectedWork(null);
    setSelectedHourlyWageRange(null);
    setSelectedDailyWorkTime(null);
  };

  const hasActiveFilters = selectedJobType || selectedLocation || selectedCompany || 
    selectedPosition || selectedType || selectedWork || 
    selectedHourlyWageRange || selectedDailyWorkTime;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1">
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
              <FilterDialog
                isOpen={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                selectedJobType={selectedJobType}
                setSelectedJobType={setSelectedJobType}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                selectedCompany={selectedCompany}
                setSelectedCompany={setSelectedCompany}
                selectedPosition={selectedPosition}
                setSelectedPosition={setSelectedPosition}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedWork={selectedWork}
                setSelectedWork={setSelectedWork}
                selectedHourlyWageRange={selectedHourlyWageRange}
                setSelectedHourlyWageRange={setSelectedHourlyWageRange}
                selectedDailyWorkTime={selectedDailyWorkTime}
                setSelectedDailyWorkTime={setSelectedDailyWorkTime}
                locations={locations}
                companies={companies}
                positions={positions}
                works={works}
                dailyWorkTimes={dailyWorkTimes}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <ActiveFilters
              selectedJobType={selectedJobType}
              setSelectedJobType={setSelectedJobType}
              selectedPosition={selectedPosition}
              setSelectedPosition={setSelectedPosition}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedWork={selectedWork}
              setSelectedWork={setSelectedWork}
              selectedHourlyWageRange={selectedHourlyWageRange}
              setSelectedHourlyWageRange={setSelectedHourlyWageRange}
              selectedDailyWorkTime={selectedDailyWorkTime}
              setSelectedDailyWorkTime={setSelectedDailyWorkTime}
            />
          )}

          {/* Display sample jobs first */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleJobs.map((job) => (
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
                jobType={job.job_type}
              />
            ))}
          </div>

          {/* Display fetched jobs */}
          {isLoading ? (
            <p>Loading jobs...</p>
          ) : filteredJobs && filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
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
            <p className="mt-6">No jobs found matching your filters. Try adjusting your search criteria.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Index;

