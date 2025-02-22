
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    mobileNumber: "",
  });
  const [skills, setSkills] = useState<{ id: string; name: string }[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Fetch profile data and skills when component mounts
  useState(() => {
    if (user) {
      fetchProfileData();
      fetchSkills();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, mobile_number")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      setProfile({
        fullName: data.full_name || "",
        mobileNumber: data.mobile_number || "",
      });
    } catch (error: any) {
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("id, name")
        .eq("user_id", user?.id);

      if (error) throw error;

      setSkills(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching skills",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.fullName,
          mobile_number: profile.mobileNumber,
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      const { error } = await supabase.from("skills").insert({
        user_id: user?.id,
        name: newSkill.trim(),
      });

      if (error) throw error;

      setNewSkill("");
      fetchSkills();
      toast({
        title: "Skill added",
        description: "Your new skill has been added successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding skill",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", skillId);

      if (error) throw error;

      fetchSkills();
      toast({
        title: "Skill removed",
        description: "The skill has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error removing skill",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-2xl py-8 space-y-8">
      <h1 className="text-2xl font-bold">Profile Settings</h1>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="fullName"
            value={profile.fullName}
            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="mobileNumber" className="text-sm font-medium">
            Mobile Number
          </label>
          <Input
            id="mobileNumber"
            value={profile.mobileNumber}
            onChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })}
            placeholder="Enter your mobile number"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Skills</label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill.id}
                variant="secondary"
                className="flex items-center gap-2"
              >
                {skill.name}
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter a new skill"
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill} className="w-full">
                  Add Skill
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Button
          onClick={updateProfile}
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </div>
  );
}
