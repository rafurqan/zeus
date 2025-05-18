import { MasterData } from "../../../core/types/master-data";

export type Contact = {
  id: string;
  student_id: string;
  value: string;
  contact_type: MasterData | null;
};
