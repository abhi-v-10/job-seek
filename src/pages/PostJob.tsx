
import { useState } from "react";
import { MainNav } from "@/components/MainNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobType, setJobType] = useState<"corporate" | "domestic" | null>(null);
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
      const jobData = jobType === "corporate" 
        ? {
            company: corporateFormData.company,
            position: corporateFormData.position,
            location: corporateFormData.location,
            salary: corporateFormData.salary,
            type: corporateFormData.type,
            level: corporateFormData.experience,
            job_type: "corporate"
          }
        : {
            work: domesticFormData.work,
            daily_work_time: parseInt(domesticFormData.dailyWorkTime),
            location: domesticFormData.location,
            hourly_wage: domesticFormData.hourlyWage,
            salary: domesticFormData.hourlyWage + " per hour", // Add salary field for domestic jobs
            job_type: "domestic"
          };

      const { error } = await supabase.from("jobs").insert({
        ...jobData,
        posted_by: user.id,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your job has been posted",
      });
      navigate("/");
    } catch (error: any) {
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
            <>
              <h1 className="text-3xl font-bold">Corporate Job</h1>
              <p className="text-muted-foreground mt-2">
                Work in corporate companies
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium mb-2"
                    >
                      Company Name
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={corporateFormData.company}
                      onChange={(e) =>
                        handleCorporateChange("company", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="position"
                      className="block text-sm font-medium mb-2"
                    >
                      Position
                    </label>
                    <Select
                      value={corporateFormData.position}
                      onValueChange={(value) =>
                        handleCorporateChange("position", value)
                      }
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
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium mb-2"
                    >
                      Location
                    </label>
                    <Input
                      id="location"
                      name="location"
                      value={corporateFormData.location}
                      onChange={(e) =>
                        handleCorporateChange("location", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="salary"
                      className="block text-sm font-medium mb-2"
                    >
                      Salary Range
                    </label>
                    <Input
                      id="salary"
                      name="salary"
                      value={corporateFormData.salary}
                      onChange={(e) =>
                        handleCorporateChange("salary", e.target.value)
                      }
                      placeholder="e.g. $50k - $70k"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium mb-2"
                    >
                      Employment Type
                    </label>
                    <Select
                      value={corporateFormData.type}
                      onValueChange={(value) => handleCorporateChange("type", value)}
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
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium mb-2"
                    >
                      Years of Experience
                    </label>
                    <Input
                      id="experience"
                      name="experience"
                      value={corporateFormData.experience}
                      onChange={(e) =>
                        handleCorporateChange("experience", e.target.value)
                      }
                      placeholder="e.g. 5 years as Full-stack Developer"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setJobType(null)}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post Job"}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">Domestic Job</h1>
              <p className="text-muted-foreground mt-2">
                Post domestic work opportunities
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="work"
                      className="block text-sm font-medium mb-2"
                    >
                      Work
                    </label>
                    <Input
                      id="work"
                      name="work"
                      value={domesticFormData.work}
                      onChange={handleDomesticChange}
                      placeholder="e.g. Gardening"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="dailyWorkTime"
                      className="block text-sm font-medium mb-2"
                    >
                      Daily Work Hours
                    </label>
                    <Input
                      id="dailyWorkTime"
                      name="dailyWorkTime"
                      type="number"
                      min="1"
                      max="23"
                      value={domesticFormData.dailyWorkTime}
                      onChange={handleDomesticChange}
                      placeholder="e.g. 2"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium mb-2"
                    >
                      Location
                    </label>
                    <Input
                      id="location"
                      name="location"
                      value={domesticFormData.location}
                      onChange={handleDomesticChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="hourlyWage"
                      className="block text-sm font-medium mb-2"
                    >
                      Hourly Wage
                    </label>
                    <Input
                      id="hourlyWage"
                      name="hourlyWage"
                      value={domesticFormData.hourlyWage}
                      onChange={handleDomesticChange}
                      placeholder="e.g. 500 - 600 per hour"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setJobType(null)}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post Job"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PostJob;

