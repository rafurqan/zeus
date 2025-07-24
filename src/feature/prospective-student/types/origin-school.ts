import { Education } from "@/core/types/education";
import { MasterData } from "@/core/types/master-data";

export type OriginSchool = {
  id: string;
  school_name: string;
  school_type: MasterData | null;
  npsn: string;
  address_name: string;
  graduation_year: string;
  aggregate_id: string;
  education_level: Education | null;
};
