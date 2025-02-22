
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Search, MessageSquare, Briefcase, Plus, LogIn, User, Settings, Upload, LogOut, File } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

export function MainNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  
  const navItems = [
    {
      title: "Jobs",
      href: "/",
      icon: Briefcase
    },
    {
      title: "Messages",
      href: "/messages",
      icon: MessageSquare
    },
    {
      title: "Post Job",
      href: "/post-job",
      icon: Plus
    }
  ];

  useEffect(() => {
    if (user) {
      checkExistingResume();
    }
  }, [user]);

  const checkExistingResume = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .list(`${user?.id}/`, {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      if (data && data.length > 0) {
        const { data: resumeData } = await supabase.storage
          .from('resumes')
          .createSignedUrl(`${user?.id}/${data[0].name}`, 3600);

        setResumeUrl(resumeData?.signedUrl || null);
      }
    } catch (error: any) {
      console.error('Error checking resume:', error);
    }
  };

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

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Check file type
    if (!['application/pdf', 'image/png'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF document or PNG image",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload file to Supabase Storage in user's folder
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/resume.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get signed URL for the uploaded file
      const { data: resumeData } = await supabase.storage
        .from('resumes')
        .createSignedUrl(fileName, 3600);

      setResumeUrl(resumeData?.signedUrl || null);

      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading resume",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  return (
    <nav className="bg-[#18181B] text-white px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-bold">
            JobSeek
          </Link>
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 text-sm transition-colors hover:text-white/80",
                  location.pathname === item.href
                    ? "text-white"
                    : "text-white/60"
                )}
              >
                <item.icon size={18} />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Search size={20} />
          </button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings size={16} />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                {resumeUrl ? (
                  <DropdownMenuItem className="flex items-center gap-2" onSelect={handleViewResume}>
                    <File size={16} />
                    <span>View Resume</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="flex items-center gap-2" onSelect={(e) => {
                    e.preventDefault();
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.pdf,.png';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleFileUpload(file);
                      }
                    };
                    input.click();
                  }}>
                    <Upload size={16} />
                    <span>{isUploading ? 'Uploading...' : 'Upload Resume'}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="flex items-center gap-2" onSelect={handleSignOut}>
                  <LogOut size={16} />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center"
              onClick={() => navigate("/auth")}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign in
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
