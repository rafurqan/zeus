import { MasterData } from "@/core/types/master-data";

export type DocumentStudent = {
  id: string | null;
  document_type: MasterData | null;
  name: string | null;
  file_name: string | null;
  file: string | null;
  file_url: string | null;
  created_at: string | null;
};
