
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EMPLOYMENT_TYPES = ["Full Time", "Part Time"];

interface CorporateFiltersProps {
  selectedPosition: string | null;
  setSelectedPosition: (value: string | null) => void;
  selectedLocation: string | null;
  setSelectedLocation: (value: string | null) => void;
  selectedCompany: string | null;
  setSelectedCompany: (value: string | null) => void;
  selectedType: string | null;
  setSelectedType: (value: string | null) => void;
  locations: string[];
  companies: string[];
  positions: string[];
}

export function CorporateFilters({
  selectedPosition,
  setSelectedPosition,
  selectedLocation,
  setSelectedLocation,
  selectedCompany,
  setSelectedCompany,
  selectedType,
  setSelectedType,
  locations,
  companies,
  positions,
}: CorporateFiltersProps) {
  return (
    <>
      <div className="space-y-2">
        <Select value={selectedPosition || ""} onValueChange={setSelectedPosition}>
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
        <Select value={selectedLocation || ""} onValueChange={setSelectedLocation}>
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
        <Select value={selectedCompany || ""} onValueChange={setSelectedCompany}>
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
        <Select value={selectedType || ""} onValueChange={setSelectedType}>
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
  );
}
