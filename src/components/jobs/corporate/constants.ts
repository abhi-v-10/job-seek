
import type { Database } from "@/integrations/supabase/types";

type CorporatePosition = Database["public"]["Enums"]["corporate_position"];
type EmploymentType = Database["public"]["Enums"]["employment_type"];

export const positions: CorporatePosition[] = [
  "software_developer",
  "software_designer",
  "frontend_developer",
  "backend_developer",
  "full_stack_developer",
  "ui_ux_designer",
  "project_manager",
  "product_manager",
  "qa_engineer",
  "devops_engineer",
  "data_scientist",
  "system_architect",
];

export const employmentTypes: EmploymentType[] = ["full_time", "part_time"];

export const salaryRanges = [
  { min: 300000, max: 500000 },
  { min: 500000, max: 800000 },
  { min: 800000, max: 1200000 },
  { min: 1200000, max: 1800000 },
  { min: 1800000, max: 2500000 },
  { min: 2500000, max: 3500000 },
];

export const experienceRanges = [
  "0-2 years",
  "2-5 years",
  "5-8 years",
  "8-12 years",
  "12+ years",
];

