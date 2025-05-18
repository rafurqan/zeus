import { City } from "./city";

export type SubDistrict = {
  id: string;
  name: string;
  city: City | null;
};
