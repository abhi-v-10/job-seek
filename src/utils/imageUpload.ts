
import { supabase } from "@/integrations/supabase/client";

export const uploadJobImage = async (file: File): Promise<string | null> => {
  if (!file) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('job-images')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('job-images')
    .getPublicUrl(fileName);

  return publicUrl;
};

