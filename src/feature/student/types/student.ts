import { MasterData } from "@/core/types/master-data";
import { Village } from "@/core/types/village";
import { Meta } from "@/core/types/meta";
import { OriginSchool } from "@/feature/prospective-student/types/origin-school";
import { Contact } from "@/feature/prospective-student/types/contact";
import { DocumentStudent } from "@/feature/prospective-student/types/document-student";
import { Parent } from "@/feature/prospective-student/types/parent";
import { ClassMembership } from "./student-class-membership";
import { Invoice } from "@/feature/finance/types/invoice";
export type Student = {
  id: string;
  registration_code: string;
  full_name: string;
  nickname: string;
  gender: string;
  birth_place: string;
  birth_date: string;
  nisn: string;
  village: Village | null;
  status: string;
  email: string;
  entry_year: string | null;
  phone: string;
  child_order: number;
  street: string;
  family_status: string;
  document_status: string;
  photo_filename: string | null;
  file: string | null;
  health_condition: string;
  hobby: string;
  additional_information: string;
  has_kip: boolean;
  has_kps: boolean;
  eligible_for_kip: boolean;
  created_at: string;
  updated_at: string | null;
  created_by_id: string;
  updated_by_id: string | null;

  photo_url: string | null;

  special_need: MasterData | null;

  nationality: MasterData | null;

  religion: MasterData | null;

  special_condition: MasterData | null;

  transportation_mode: MasterData | null;

  addresses: [];

  origin_schools: OriginSchool[];

  contacts: Contact[];

  documents: DocumentStudent[] | null;

  parents: Parent[];

  class_memberships: ClassMembership[] | null;

  invoices: Invoice[] | null;
};

export type StudentResponse = {
  meta: Meta | null;
  data: Student[];
  extra: Extra | null;
};

export type GetStudentResponse = {
  meta: Meta | null;
  data: Student;
};

export type ListStudentRequest = {
  keyword?: string;
  page?: number;
  per_page?: number;
};

export interface CreateStudentResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: {
    id: string;
  };
}

export interface UpdateStudentResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: {
    id: string;
  };
}

export interface RemoveStudentResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
}

export interface ApproveStudentResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
}

export interface GetRegistrationCodeResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: RegistrationCode | null;
}

export type RegistrationCode = {
  id: string;
  registration_code: string;
};

export type Extra = {
  summary: Summary | null;
};

export type Summary = {
  total: number | null;
  approved: number | null;
  orphan: number | null;
  teacher_child: number | null;
  special_needs: number | null;
  surrounding_environment: number | null;
};

export interface ChangeStatusRequest {
  id: string;
  status: string;
}

export interface ChangeStatusResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  id: string | null;
  status: string | null;
}
