
import { useState, useEffect } from "react";
import { File, Edit, Upload } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface ResumeManagerProps {
  user: User | null;
}

export function ResumeManager({ user }: ResumeManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleFileUpload = async (file: File) => {
    if (!file) return;

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
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/resume.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

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

  const handleEditResume = (e: Event) => {
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
  };

  if (resumeUrl) {
    return (
      <>
        <DropdownMenuItem className="flex items-center gap-2" onSelect={handleViewResume}>
          <File size={16} />
          <span>View Resume</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2" onSelect={handleEditResume}>
          <Edit size={16} />
          <span>Edit Resume</span>
        </DropdownMenuItem>
      </>
    );
  }

  return (
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
  );
}
