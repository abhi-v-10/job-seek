
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type CorporatePosition = Database["public"]["Enums"]["corporate_position"];
type EmploymentType = Database["public"]["Enums"]["employment_type"];

const positions: CorporatePosition[] = [
  "software_developer",
  "software_designer",
  "frontend_developer",
  "backend_developer",
  "full_stack_developer",
  "ui_ux_designer",
  "project_manager",
  "product_manager",
  "qa_engineer",
  "devops_engineer",
  "data_scientist",
  "system_architect",
];

const employmentTypes: EmploymentType[] = ["full_time", "part_time"];

const salaryRanges = [
  { min: 300000, max: 500000 },
  { min: 500000, max: 800000 },
  { min: 800000, max: 1200000 },
  { min: 1200000, max: 1800000 },
  { min: 1800000, max: 2500000 },
  { min: 2500000, max: 3500000 },
];

const experienceRanges = [
  "0-2 years",
  "2-5 years",
  "5-8 years",
  "8-12 years",
  "12+ years",
];

export function CorporateJobForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    position: "" as CorporatePosition,
    location: "",
    salaryRange: "",
    employmentType: "" as EmploymentType,
    yearsOfExperience: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const [minSalary, maxSalary] = formData.salaryRange.split("-").map(Number);

    try {
      const { error } = await supabase.from("jobs").insert({
        user_id: user.id,
        category: "corporate" as const,
        company_name: formData.companyName,
        position: formData.position,
        location: formData.location,
        salary_range_min: minSalary,
        salary_range_max: maxSalary,
        employment_type: formData.employmentType,
        years_of_experience: formData.yearsOfExperience,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job posted successfully",
      });
      
      navigate("/jobs");
    } catch (error: any) {
      console.error("Error posting job:", error);
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post Corporate Job"}
      </Button>
    </form>
  );
}
