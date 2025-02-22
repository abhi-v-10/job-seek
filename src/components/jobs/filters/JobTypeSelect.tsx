
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobTypeSelectProps {
  selectedJobType: string | null;
  setSelectedJobType: (value: string | null) => void;
  setSelectedLocation: (value: string | null) => void;
  setSelectedCompany: (value: string | null) => void;
  setSelectedPosition: (value: string | null) => void;
  setSelectedType: (value: string | null) => void;
  setSelectedWork: (value: string | null) => void;
  setSelectedHourlyWageRange: (value: string | null) => void;
  setSelectedDailyWorkTime: (value: string | null) => void;
}

export function JobTypeSelect({
  selectedJobType,
  setSelectedJobType,
  setSelectedLocation,
  setSelectedCompany,
  setSelectedPosition,
  setSelectedType,
  setSelectedWork,
  setSelectedHourlyWageRange,
  setSelectedDailyWorkTime,
}: JobTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Select
        value={selectedJobType || ""}
        onValueChange={(value) => {
          setSelectedJobType(value);
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
  );
}
