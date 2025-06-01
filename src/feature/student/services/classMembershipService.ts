import http from "@/core/service/auth";
import {
  ClassMembershipResponse,
  CreateClassMembershipRequest,
  CreateClassMembershipResponse,
  FetchAllParams,
} from "../types/student-class-membership";

export const classMembershipService = {
  async getAll(params: FetchAllParams): Promise<ClassMembershipResponse> {
    const response = await http.get("/class-memberships/all-students", {
      params: params,
    });
    return response.data;
  },
  async create(
    data: CreateClassMembershipRequest
  ): Promise<CreateClassMembershipResponse> {
    const response = await http.post("/class-memberships", data);
    return response.data;
  },
};
