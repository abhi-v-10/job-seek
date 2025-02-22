
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const workTypes = [
  "gardening",
  "housekeeping",
  "cooking",
  "childcare",
  "elderly_care",
  "driving",
  "pet_care",
  "home_maintenance",
] as const;

const hourlyWageRanges = [
  { min: 100, max: 150 },
  { min: 150, max: 200 },
  { min: 200, max: 300 },
  { min: 300, max: 400 },
  { min: 400, max: 500 },
  { min: 500, max: 750 },
];

export function DomesticJobForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    workType: "",
    location: "",
    dailyHours: "",
    hourlyWageRange: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const [minWage, maxWage] = formData.hourlyWageRange.split("-").map(Number);

    try {
      const { error } = await supabase.from("jobs").insert({
        category: "domestic",
        work_type: formData.workType,
        location: formData.location,
        daily_hours: parseInt(formData.dailyHours),
        hourly_wage_min: minWage,
        hourly_wage_max: maxWage,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job posted successfully",
      });
      
      navigate("/jobs");
    } catch (error) {
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
          <label className="text-sm font-medium mb-2 block">Type of Work</label>
          <Select
            required
            value={formData.workType}
            onValueChange={(value) =>
              setFormData({ ...formData, workType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select work type" />
            </SelectTrigger>
            <SelectContent>
              {workTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
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
          <label className="text-sm font-medium mb-2 block">Daily Hours of Work</label>
          <Input
            required
            type="number"
            min="1"
            max="24"
            value={formData.dailyHours}
            onChange={(e) =>
              setFormData({ ...formData, dailyHours: e.target.value })
            }
            placeholder="Enter daily hours (1-24)"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Hourly Wage Range (₹)</label>
          <Select
            required
            value={formData.hourlyWageRange}
            onValueChange={(value) =>
              setFormData({ ...formData, hourlyWageRange: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select hourly wage range" />
            </SelectTrigger>
            <SelectContent>
              {hourlyWageRanges.map((range) => (
                <SelectItem
                  key={`${range.min}-${range.max}`}
                  value={`${range.min}-${range.max}`}
                >
                  ₹{range.min} - ₹{range.max} per hour
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post Domestic Job"}
      </Button>
    </form>
  );
}
