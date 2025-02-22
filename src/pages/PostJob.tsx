
import { useState } from "react";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CorporateJobForm } from "@/components/jobs/CorporateJobForm";
import { DomesticJobForm } from "@/components/jobs/DomesticJobForm";
import { JobTypeSelector } from "@/components/jobs/JobTypeSelector";
import { useCorporateFormState, useDomesticFormState } from "@/hooks/useJobFormState";
import { uploadJobImage } from "@/utils/imageUpload";

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobType, setJobType] = useState<"corporate" | "domestic" | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  const { corporateFormData, handleCorporateChange } = useCorporateFormState();
  const { domesticFormData, handleDomesticChange } = useDomesticFormState();

  const handleImageUpload = (file: File) => {
    setSelectedImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a job",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      const logoUrl = selectedImage ? await uploadJobImage(selectedImage) : null;

      const jobData = jobType === "corporate"
        ? {
            company: corporateFormData.company,
            position: corporateFormData.position,
            location: corporateFormData.location,
            salary: corporateFormData.salary,
            type: corporateFormData.type,
            level: corporateFormData.experience,
            logo: logoUrl,
            job_type: "corporate",
            posted_by: user.id
          }
        : {
            work: domesticFormData.work,
            daily_work_time: parseInt(domesticFormData.dailyWorkTime),
            location: domesticFormData.location,
            hourly_wage: domesticFormData.hourlyWage,
            salary: domesticFormData.hourlyWage + " per hour",
            logo: logoUrl,
            job_type: "domestic",
            posted_by: user.id
          };

      const { error: insertError } = await supabase
        .from("jobs")
        .insert(jobData)
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      toast({
        title: "Success!",
        description: "Your job has been posted",
      });
      navigate("/");
    } catch (error: any) {
      console.error('Job posting error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold">Post a Job</h1>
          <p className="text-muted-foreground mt-2">
            Please sign in to post a job listing
          </p>
          <Button className="mt-4" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="max-w-2xl">
          {!jobType ? (
            <JobTypeSelector onSelect={setJobType} />
          ) : jobType === "corporate" ? (
            <CorporateJobForm
              formData={corporateFormData}
              onFormChange={handleCorporateChange}
              onSubmit={handleSubmit}
              onBack={() => setJobType(null)}
              isSubmitting={isSubmitting}
              onImageUpload={handleImageUpload}
            />
          ) : (
            <DomesticJobForm
              formData={domesticFormData}
              onFormChange={handleDomesticChange}
              onSubmit={handleSubmit}
              onBack={() => setJobType(null)}
              isSubmitting={isSubmitting}
              onImageUpload={handleImageUpload}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default PostJob;

