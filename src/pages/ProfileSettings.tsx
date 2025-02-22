
import { startTransition, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { PhoneInput } from "@/components/PhoneInput";

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
    </div>
  );
}
