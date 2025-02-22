
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CorporateJobForm } from "@/components/jobs/CorporateJobForm";
import { DomesticJobForm } from "@/components/jobs/DomesticJobForm";
import { useAuth } from "@/contexts/AuthContext";

const PostJob = () => {
  const [activeTab, setActiveTab] = useState<"corporate" | "domestic">("corporate");
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Post a Job</h1>
            <p className="text-muted-foreground mt-2">
              Create a new job listing for corporate or domestic work
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "corporate" | "domestic")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="corporate">Corporate Jobs</TabsTrigger>
              <TabsTrigger value="domestic">Domestic Jobs</TabsTrigger>
            </TabsList>
            <TabsContent value="corporate" className="mt-6">
              <CorporateJobForm />
            </TabsContent>
            <TabsContent value="domestic" className="mt-6">
              <DomesticJobForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default PostJob;
