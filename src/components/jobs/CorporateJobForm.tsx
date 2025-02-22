
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { FormFields } from "./corporate/FormFields";
import type { CorporateFormData } from "./corporate/types";

export function CorporateJobForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CorporateFormData>({
    companyName: "",
    position: "software_developer",
    location: "",
    salaryRange: "",
    employmentType: "full_time",
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
      <FormFields formData={formData} setFormData={setFormData} />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post Corporate Job"}
      </Button>
    </form>
  );
}

