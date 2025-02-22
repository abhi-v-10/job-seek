
import { useState } from "react";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CorporateJobForm } from "@/components/jobs/CorporateJobForm";
import { DomesticJobForm } from "@/components/jobs/DomesticJobForm";

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobType, setJobType] = useState<"corporate" | "domestic" | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [corporateFormData, setCorporateFormData] = useState({
    company: "",
    position: "",
    location: "",
    salary: "",
    type: "Full Time",
    experience: "",
  });
  const [domesticFormData, setDomesticFormData] = useState({
    work: "",
    dailyWorkTime: "",
    location: "",
    hourlyWage: "",
  });

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
      let logoUrl = null;
      
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('job-images')
          .upload(fileName, selectedImage);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('job-images')
          .getPublicUrl(fileName);

        logoUrl = publicUrl;
      }

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

      const { error: insertError, data: insertedJob } = await supabase
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

  const handleCorporateChange = (name: string, value: string) => {
    setCorporateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDomesticChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDomesticFormData((prev) => ({ ...prev, [name]: value }));
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
            <div>
              <h1 className="text-3xl font-bold">Post a Job</h1>
              <p className="text-muted-foreground mt-2">
                Which type of job do you want to post?
              </p>
              <div className="mt-8 space-y-4">
                <Button
                  className="w-full"
                  onClick={() => setJobType("corporate")}
                >
                  Corporate Job
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setJobType("domestic")}
                >
                  Domestic Job
                </Button>
              </div>
            </div>
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
