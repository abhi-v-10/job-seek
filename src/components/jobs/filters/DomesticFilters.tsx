
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HOURLY_WAGE_RANGES = [
  "0-200",
  "200-400",
  "400-600",
  "600-800",
  "800-1000",
  "1000+"
];

interface DomesticFiltersProps {
  selectedWork: string | null;
  setSelectedWork: (value: string | null) => void;
  selectedHourlyWageRange: string | null;
  setSelectedHourlyWageRange: (value: string | null) => void;
  selectedDailyWorkTime: string | null;
  setSelectedDailyWorkTime: (value: string | null) => void;
  works: string[];
  dailyWorkTimes: string[];
}

export function DomesticFilters({
  selectedWork,
  setSelectedWork,
  selectedHourlyWageRange,
  setSelectedHourlyWageRange,
  selectedDailyWorkTime,
  setSelectedDailyWorkTime,
  works,
  dailyWorkTimes,
}: DomesticFiltersProps) {
  return (
    <>
      <div className="space-y-2">
        <Select value={selectedWork || ""} onValueChange={setSelectedWork}>
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
  );
}
