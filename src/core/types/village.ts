import { SubDistrict } from "./sub-district";

export type Village = {
  id: string;
  name: string;
  sub_district: SubDistrict | null;
};
