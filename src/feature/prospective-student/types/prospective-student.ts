import { MasterData } from "@/core/types/master-data";
import { OriginSchool } from "./origin-school";
import { Contact } from "./contact";
import { Parent } from "./parent";
import { DocumentStudent } from "./document-student";
import { Village } from "@/core/types/village";
import { Meta } from "@/core/types/meta";
import { Invoice } from "@/feature/finance/types/invoice";
export type ProspectiveStudent = {
  id: string;
  registration_code: string;
  full_name: string;
  nickname: string;
  gender: string;
  birth_place: string;
  birth_date: string;
  nisn: string;
  entry_year: string | null;
  village: Village | null;
  status: string;
  email: string;
  student_id: string | null;
  photo_url: string | null;
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

  special_need: MasterData | null;

  nationality: MasterData | null;

  religion: MasterData | null;

  special_condition: MasterData | null;

  transportation_mode: MasterData | null;

  addresses: []; // kamu bisa bikin type khusus juga kalau strukturnya diketahui

  origin_schools: OriginSchool[];

  contacts: Contact[];

  documents: DocumentStudent[];

  parents: Parent[];

  invoices: Invoice[] | null;
};

export type ProspectiveStudentResponse = {
  meta: Meta | null;
  data: ProspectiveStudent[];
};

export type ListProspectiveStudentRequest = {
  keyword?: string;
  page?: number;
  per_page?: number;
  status?: string;
};

export interface CreateProspectiveStudentResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: {
    id: string;
  };
}

export interface UpdateProspectiveStudentResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: {
    id: string;
  };
}

export interface RemoveProspectiveStudentResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
}

export interface ApproveProspectiveStudentResponse {
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
