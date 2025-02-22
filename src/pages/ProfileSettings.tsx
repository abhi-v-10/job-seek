import { startTransition, Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, X } from "lucide-react";
import { PhoneInput } from "@/components/PhoneInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Skill = {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'other';
};

function SkillsSection({ userId, existingSkills, onSkillsChange }: { 
  userId: string;
  existingSkills: Skill[];
  onSkillsChange: () => void;
}) {
  const { toast } = useToast();
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<Skill['category']>('technical');

  const addSkill = async () => {
    if (!newSkillName.trim()) return;

    try {
      const { error } = await supabase
        .from('skills')
        .insert({
          name: newSkillName.trim(),
          category: newSkillCategory,
          user_id: userId
        });

      if (error) throw error;

      setNewSkillName('');
      onSkillsChange();
      
      toast({
        title: "Skill added",
        description: "Your skill has been added successfully.",
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
        .from('skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;

      onSkillsChange();
      
      toast({
        title: "Skill removed",
        description: "Your skill has been removed successfully.",
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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Skills</h2>
      
      <div className="flex gap-2">
        <Input
          placeholder="Add a new skill"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          className="flex-1"
        />
        <Select value={newSkillCategory} onValueChange={(value: Skill['category']) => setNewSkillCategory(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="soft">Soft Skills</SelectItem>
            <SelectItem value="language">Language</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addSkill} type="button">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {existingSkills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
          >
            <span>{skill.name}</span>
            <button
              onClick={() => removeSkill(skill.id)}
              className="ml-1 rounded-full p-1 hover:bg-secondary-foreground/10"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileForm({ profile, onSubmit }: { 
  profile: any; 
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void 
}) {
  const { user } = useAuth();
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium">
          Full Name
        </label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={profile?.full_name || ''}
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={user?.email || ''}
          placeholder="Enter your email"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="mobileNumber" className="text-sm font-medium">
          Mobile Number
        </label>
        <PhoneInput
          value={profile?.mobile_number || ''}
          onChange={(value) => {
            const input = document.querySelector('input[name="mobileNumber"]') as HTMLInputElement;
            if (input) input.value = value;
          }}
        />
        <input type="hidden" name="mobileNumber" defaultValue={profile?.mobile_number || ''} />
      </div>

      <Button type="submit">
        Update Profile
      </Button>
    </form>
  );
}

export default function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);

  const handleBack = () => {
    startTransition(() => {
      navigate('/');
    });
  };

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    const fetchSkills = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        toast({
          title: "Error fetching skills",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setSkills(data || []);
    };

    fetchSkills();
  }, [user?.id, toast]);

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      full_name: formData.get('fullName')?.toString() || '',
      mobile_number: formData.get('mobileNumber')?.toString() || '',
    };

    const email = formData.get('email')?.toString();
    
    try {
      // Update email if changed
      if (email && email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email,
        });
        if (emailError) throw emailError;
      }

      // Update profile data
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
      });

      toast({
        title: "Profile updated",
        description: email !== user.email 
          ? "Your profile has been updated. Please check your email to confirm the email change."
          : "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="container max-w-2xl py-8">Loading...</div>;
  }

  return (
    <div className="container max-w-2xl py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleBack}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>
      
      <Suspense fallback={<div>Loading profile form...</div>}>
        <ProfileForm profile={profile} onSubmit={updateProfile} />
      </Suspense>

      <Suspense fallback={<div>Loading skills section...</div>}>
        <SkillsSection 
          userId={user?.id || ''} 
          existingSkills={skills}
          onSkillsChange={() => {
            if (user?.id) {
              const fetchSkills = async () => {
                const { data } = await supabase
                  .from('skills')
                  .select('*')
                  .eq('user_id', user.id);
                setSkills(data || []);
              };
              fetchSkills();
            }
          }}
        />
      </Suspense>
    </div>
  );
}
