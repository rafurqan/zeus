import { Meta } from "@/core/types/meta";
import { StudentClass } from "./student-class";

export type ClassMembership = {
  id: string;
  full_name: string;
  gender: "male" | "female" | string;
  nisn: string;
  type: "student" | "prospective_student" | string;
  active_class: StudentClass | null;
};

export type ClassMembershipResponse = {
  meta: Meta | null;
  data: ClassMembership[];
};

export type CreateClassMembershipResponse = {
  meta: Meta | null;
  data: string;
};

export type FetchAllParams = {
  student_class_id?: string | null;
  keyword?: string;
  page?: number;
  per_page?: number;
};

export type CreateClassMembershipRequest = {
  prospective_student_id: string | null;
  student_class_id: string;
  student_id: string | null;
  start_at: string;
};
