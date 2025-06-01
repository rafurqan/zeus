import { Program } from "@/feature/master/types/program";
import { Teacher } from "@/feature/teacher/types/teacher";

export type StudentClass = {
  id: string;
  name: string;
  part: string;
  program: Program | null;
  capacity: string | null;
  academic_year: string | null;
  status: string | null;
  class_membership_count: number | null;
  teacher: Teacher | null;
};

export interface CreateStudentClassResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: {
    id: string;
  };
}

export interface UpdateStudentClassResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: {
    id: string;
  };
}

export interface RemoveStudentClassResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
}
