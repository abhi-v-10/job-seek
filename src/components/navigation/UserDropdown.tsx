
import { Settings, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ResumeManager } from "./ResumeManager";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface UserDropdownProps {
  user: SupabaseUser | null;
}

export function UserDropdown({ user }: UserDropdownProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="flex items-center">
          <User className="h-4 w-4 mr-2" />
          Profile
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          className="flex items-center gap-2"
          onSelect={() => navigate("/profile-settings")}
        >
          <Settings size={16} />
          <span>Profile Settings</span>
        </DropdownMenuItem>
        <ResumeManager user={user} />
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2" onSelect={handleSignOut}>
          <LogOut size={16} />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
