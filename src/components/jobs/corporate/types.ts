
import type { Database } from "@/integrations/supabase/types";

export type CorporatePosition = Database["public"]["Enums"]["corporate_position"];
export type EmploymentType = Database["public"]["Enums"]["employment_type"];

export interface CorporateFormData {
  companyName: string;
  position: CorporatePosition;
  location: string;
  salaryRange: string;
  employmentType: EmploymentType;
  yearsOfExperience: string;
}

