import { MasterData } from "@/core/types/master-data";

export type DocumentStudent = {
  id: string;
  document_type: MasterData | null;
  name: string;
  file_name: string | null;
  file: string;
  created_at: string | null;
};
