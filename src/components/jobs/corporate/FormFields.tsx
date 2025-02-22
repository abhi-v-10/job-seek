
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { positions, employmentTypes, salaryRanges, experienceRanges } from "./constants";
import type { CorporateFormData, CorporatePosition, EmploymentType } from "./types";

interface FormFieldsProps {
  formData: CorporateFormData;
  setFormData: (data: CorporateFormData) => void;
}

export function FormFields({ formData, setFormData }: FormFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Company Name</label>
        <Input
          required
          value={formData.companyName}
          onChange={(e) =>
            setFormData({ ...formData, companyName: e.target.value })
          }
          placeholder="Enter company name"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Position</label>
        <Select
          required
          value={formData.position}
          onValueChange={(value: CorporatePosition) =>
            setFormData({ ...formData, position: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            {positions.map((pos) => (
              <SelectItem key={pos} value={pos}>
                {pos.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Location</label>
        <Input
          required
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="Enter location"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Salary Range (₹)</label>
        <Select
          required
          value={formData.salaryRange}
          onValueChange={(value) =>
            setFormData({ ...formData, salaryRange: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select salary range" />
          </SelectTrigger>
          <SelectContent>
            {salaryRanges.map((range) => (
              <SelectItem
                key={`${range.min}-${range.max}`}
                value={`${range.min}-${range.max}`}
              >
                ₹{(range.min / 100000).toFixed(1)}L - ₹{(range.max / 100000).toFixed(1)}L
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Employment Type</label>
        <Select
          required
          value={formData.employmentType}
          onValueChange={(value: EmploymentType) =>
            setFormData({ ...formData, employmentType: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select employment type" />
          </SelectTrigger>
          <SelectContent>
            {employmentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Years of Experience</label>
        <Select
          required
          value={formData.yearsOfExperience}
          onValueChange={(value) =>
            setFormData({ ...formData, yearsOfExperience: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select experience range" />
          </SelectTrigger>
          <SelectContent>
            {experienceRanges.map((range) => (
              <SelectItem key={range} value={range}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

