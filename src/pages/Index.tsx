
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
      company_name: 'TechCorp Solutions',
      position: 'software_developer',
      location: 'San Francisco, CA',
      salary_range_min: 120000,
      salary_range_max: 180000,
      employment_type: 'full_time',
      category: 'corporate' as const,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      years_of_experience: 'Senior'
    },
    {
      id: 'sample-2',
      company_name: 'Innovation Labs',
      position: 'product_manager',
      location: 'New York, NY',
      salary_range_min: 130000,
      salary_range_max: 170000,
      employment_type: 'full_time',
      category: 'corporate' as const,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      years_of_experience: 'Mid-Level'
    },
    {
      id: 'sample-3',
      company_name: 'Cloud Systems Inc',
      position: 'devops_engineer',
      location: 'Austin, TX',
      salary_range_min: 110000,
      salary_range_max: 160000,
      employment_type: 'full_time',
      category: 'corporate' as const,
      created_at: new Date().toISOString(),
      years_of_experience: 'Mid-Level'
    }
  ];

  // Get unique values for filter options based on category
  const locations = Array.from(new Set(jobs?.filter(job => job.category === 'corporate').map(job => {
    const location = job.location.split(',')[0].trim();
    return location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
  }) || []));

  const companies = Array.from(new Set(jobs?.filter(job => job.category === 'corporate').map(job => job.company_name) || []));
  const positions = Array.from(new Set(jobs?.filter(job => job.category === 'corporate').map(job => job.position) || []));
  const works = Array.from(new Set(jobs?.filter(job => job.category === 'domestic').map(job => job.work_type) || []));
  const dailyWorkTimes = Array.from(new Set(jobs?.filter(job => job.category === 'domestic').map(job => job.daily_hours?.toString()) || []));

  // Filter jobs based on selected criteria
  const filteredJobs = jobs?.filter(job => {
    // First filter by job type
    if (selectedJobType && job.category !== selectedJobType.toLowerCase()) return false;

    if (job.category === 'corporate') {
      const matchesLocation = !selectedLocation || 
        normalizeString(job.location).includes(normalizeString(selectedLocation));
      const matchesCompany = !selectedCompany || 
        normalizeString(job.company_name || '').includes(normalizeString(selectedCompany));
      const matchesPosition = !selectedPosition || 
        normalizeString(job.position || '').includes(normalizeString(selectedPosition));
      const matchesType = !selectedType || 
        normalizeString(job.employment_type || '').includes(normalizeString(selectedType));
      
      return matchesLocation && matchesCompany && matchesPosition && matchesType;
    } else {
      // Domestic job filters
      const matchesWork = !selectedWork || 
        normalizeString(job.work_type || '').includes(normalizeString(selectedWork));
      const matchesHourlyWage = !selectedHourlyWageRange || 
        isInHourlyWageRange(job.hourly_wage_min?.toString() || '', selectedHourlyWageRange);
      const matchesDailyWorkTime = !selectedDailyWorkTime || 
        job.daily_hours === parseInt(selectedDailyWorkTime);
      
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleJobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                company={job.company_name}
                position={job.position}
                location={job.location}
                salary={`$${job.salary_range_min.toLocaleString()} - $${job.salary_range_max.toLocaleString()}`}
                type={job.employment_type}
                level={job.years_of_experience}
                postedAt={new Date(job.created_at)}
                category={job.category}
              />
            ))}
          </div>

          {isLoading ? (
            <p>Loading jobs...</p>
          ) : filteredJobs && filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {filteredJobs.map((job) => (
                <JobCard 
                  key={job.id}
                  id={job.id}
                  company={job.company_name}
                  position={job.position}
                  location={job.location}
                  salary={job.category === 'corporate' 
                    ? `$${job.salary_range_min?.toLocaleString()} - $${job.salary_range_max?.toLocaleString()}`
                    : `$${job.hourly_wage_min} - $${job.hourly_wage_max}/hr`
                  }
                  type={job.employment_type}
                  level={job.years_of_experience}
                  postedAt={new Date(job.created_at)}
                  work={job.work_type}
                  dailyWorkTime={job.daily_hours}
                  category={job.category}
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
