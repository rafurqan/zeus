import { EducationLevel } from "../../../core/types/education-level";

export type Teacher = {
  id: string;
  name: string;
  education_level: EducationLevel | null;
  nip: string;
  birth_place: string;
  birth_date: string;
  graduated_from: string;
};

export interface CreateTeacherResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: {
    id: string;
  };
}

export interface UpdateTeacherResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: {
    id: string;
  };
}

export interface RemoveTeacherResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
}
