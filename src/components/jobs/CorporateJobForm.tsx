
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CORPORATE_POSITIONS = [
  "Software Developer",
  "Software Designer",
  "Full-Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "Product Manager",
  "Project Manager",
  "Business Analyst",
  "Data Scientist",
  "DevOps Engineer",
  "System Administrator",
  "Quality Assurance",
  "HR Manager",
  "Office Assistant",
  "Marketing Manager",
  "Sales Executive",
  "Content Writer",
  "Graphic Designer",
  "Administrative Assistant",
  "Receptionist",
  "Accountant",
  "Financial Analyst",
  "Customer Service Representative",
  "Janitor",
  "Security Officer",
  "Intern",
];

const SALARY_RANGES = [
  "₹40k - ₹50k",
  "₹50k - ₹60k",
  "₹60k - ₹70k",
  "₹70k - ₹80k",
  "₹80k - ₹90k",
  "₹90k - ₹100k",
  "₹100k+"
];

interface CorporateJobFormProps {
  formData: {
    company: string;
    position: string;
    location: string;
    salary: string;
    type: string;
    experience: string;
  };
  onFormChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const CorporateJobForm = ({
  formData,
  onFormChange,
  onSubmit,
  onBack,
  isSubmitting,
}: CorporateJobFormProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold">Corporate Job</h1>
      <p className="text-muted-foreground mt-2">Work in corporate companies</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-2">
              Company Name
            </label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={(e) => onFormChange("company", e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium mb-2">
              Position
            </label>
            <Select
              value={formData.position}
              onValueChange={(value) => onFormChange("position", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>
              <SelectContent>
                {CORPORATE_POSITIONS.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              Location
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={(e) => onFormChange("location", e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium mb-2">
              Salary Range
            </label>
            <Select
              value={formData.salary}
              onValueChange={(value) => onFormChange("salary", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select salary range" />
              </SelectTrigger>
              <SelectContent>
                {SALARY_RANGES.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-2">
              Employment Type
            </label>
            <Select
              value={formData.type}
              onValueChange={(value) => onFormChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full Time">Full Time</SelectItem>
                <SelectItem value="Part Time">Part Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium mb-2">
              Years of Experience
            </label>
            <Input
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={(e) => onFormChange("experience", e.target.value)}
              placeholder="e.g. 5 years as Full-stack Developer"
              required
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Job"}
          </Button>
        </div>
      </form>
    </>
  );
};

