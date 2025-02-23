
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  selectedJobType: string | null;
  setSelectedJobType: (value: string | null) => void;
  selectedPosition: string | null;
  setSelectedPosition: (value: string | null) => void;
  selectedLocation: string | null;
  setSelectedLocation: (value: string | null) => void;
  selectedCompany: string | null;
  setSelectedCompany: (value: string | null) => void;
  selectedType: string | null;
  setSelectedType: (value: string | null) => void;
  selectedWork: string | null;
  setSelectedWork: (value: string | null) => void;
  selectedHourlyWageRange: string | null;
  setSelectedHourlyWageRange: (value: string | null) => void;
  selectedDailyWorkTime: string | null;
  setSelectedDailyWorkTime: (value: string | null) => void;
}

export function ActiveFilters({
  selectedJobType,
  setSelectedJobType,
  selectedPosition,
  setSelectedPosition,
  selectedLocation,
  setSelectedLocation,
  selectedCompany,
  setSelectedCompany,
  selectedType,
  setSelectedType,
  selectedWork,
  setSelectedWork,
  selectedHourlyWageRange,
  setSelectedHourlyWageRange,
  selectedDailyWorkTime,
  setSelectedDailyWorkTime,
}: ActiveFiltersProps) {
  return (
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
  );
}
