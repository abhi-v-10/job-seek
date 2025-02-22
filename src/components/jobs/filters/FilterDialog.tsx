
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SlidersHorizontal } from "lucide-react";
import { CorporateFilters } from "./CorporateFilters";
import { DomesticFilters } from "./DomesticFilters";
import { JobTypeSelect } from "./JobTypeSelect";

interface FilterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedJobType: string | null;
  setSelectedJobType: (value: string | null) => void;
  selectedLocation: string | null;
  setSelectedLocation: (value: string | null) => void;
  selectedCompany: string | null;
  setSelectedCompany: (value: string | null) => void;
  selectedPosition: string | null;
  setSelectedPosition: (value: string | null) => void;
  selectedType: string | null;
  setSelectedType: (value: string | null) => void;
  selectedWork: string | null;
  setSelectedWork: (value: string | null) => void;
  selectedHourlyWageRange: string | null;
  setSelectedHourlyWageRange: (value: string | null) => void;
  selectedDailyWorkTime: string | null;
  setSelectedDailyWorkTime: (value: string | null) => void;
  locations: string[];
  companies: string[];
  positions: string[];
  works: string[];
  dailyWorkTimes: string[];
}

export function FilterDialog({
  isOpen,
  onOpenChange,
  selectedJobType,
  setSelectedJobType,
  selectedLocation,
  setSelectedLocation,
  selectedCompany,
  setSelectedCompany,
  selectedPosition,
  setSelectedPosition,
  selectedType,
  setSelectedType,
  selectedWork,
  setSelectedWork,
  selectedHourlyWageRange,
  setSelectedHourlyWageRange,
  selectedDailyWorkTime,
  setSelectedDailyWorkTime,
  locations,
  companies,
  positions,
  works,
  dailyWorkTimes,
}: FilterDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <JobTypeSelect
            selectedJobType={selectedJobType}
            setSelectedJobType={setSelectedJobType}
            setSelectedLocation={setSelectedLocation}
            setSelectedCompany={setSelectedCompany}
            setSelectedPosition={setSelectedPosition}
            setSelectedType={setSelectedType}
            setSelectedWork={setSelectedWork}
            setSelectedHourlyWageRange={setSelectedHourlyWageRange}
            setSelectedDailyWorkTime={setSelectedDailyWorkTime}
          />

          {selectedJobType === 'corporate' && (
            <CorporateFilters
              selectedPosition={selectedPosition}
              setSelectedPosition={setSelectedPosition}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              locations={locations}
              companies={companies}
              positions={positions}
            />
          )}

          {selectedJobType === 'domestic' && (
            <DomesticFilters
              selectedWork={selectedWork}
              setSelectedWork={setSelectedWork}
              selectedHourlyWageRange={selectedHourlyWageRange}
              setSelectedHourlyWageRange={setSelectedHourlyWageRange}
              selectedDailyWorkTime={selectedDailyWorkTime}
              setSelectedDailyWorkTime={setSelectedDailyWorkTime}
              works={works}
              dailyWorkTimes={dailyWorkTimes}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
