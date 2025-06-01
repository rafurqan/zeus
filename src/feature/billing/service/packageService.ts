import http from "@/core/service/https";
import {
  CreateRatePackageResponse,
  RatePackage,
  UpdateRatePackageResponse,
} from "../types/ratePackage";

export const packageService = {
  async getAll(token: string): Promise<RatePackage[]> {
    const response = await http(token).get("master/rates-package");
    // console.log(response.data.data);
    return response.data.data;
  },

  async create(token: string, data: RatePackage): Promise<CreateRatePackageResponse> {
    const response = await http(token).post<CreateRatePackageResponse>(
      "master/rates-package",
      data
    );
    return response.data;
  },

  async update(token: string, data: RatePackage): Promise<CreateRatePackageResponse> {
    const response = await http(token).put<UpdateRatePackageResponse>(
      `master/rates-package/${data.id}`,
      data
    );
    // console.log(response.data);
    return response.data;
  },

  async remove(token: string, id: string): Promise<CreateRatePackageResponse> {
    const response = await http(token).delete(`master/rates-package/${id}`);
    // console.log(response.data);
    return response.data;
  },
};