import http from "./https";

export const listEducationLevel = async (token: string | null) => {
  const response = await http(token).get("/master/education-levels");
  return response.data;
};

export const deleteEducationLevel = (token: string | null, id: string) => {
  return http(token).delete(`/api/v1/master/education-levels/${id}`);
};

export const listNationality = async (token: string | null) => {
  const response = await http(token).get("/master/nationalities");
  return response.data;
};

export const listReligion = async (token: string | null) => {
  const response = await http(token).get("/master/religions");
  return response.data;
};

export const listIncomeRange = async (token: string | null) => {
  const response = await http(token).get("/master/income-ranges");
  return response.data;
};

export const listContactType = async (token: string | null) => {
  const response = await http(token).get("/master/contact-types");
  return response.data;
};

export const listSpecialNeed = async (token: string | null) => {
  const response = await http(token).get("/master/special-needs");
  return response.data;
};

export const listTransporatationMode = async (token: string | null) => {
  const response = await http(token).get("/master/transportation-modes");
  return response.data;
};

export const listDocumentType = async (token: string | null) => {
  const response = await http(token).get("/master/document-types");
  return response.data;
};

export const listGuardianRelationship = async (token: string | null) => {
  const response = await http(token).get("/master/guardian-relationships");
  return response.data;
};

export const listSchoolType = async (token: string | null) => {
  const response = await http(token).get("/master/school-types");
  return response.data;
};

export const listSpecialCondition = async (token: string | null) => {
  const response = await http(token).get("/master/special-conditions");
  return response.data;
};

export const listVillage = async (token: string | null, id: string) => {
  const response = await http(token).get("/master/villages", {
    params: { sub_district_id: id },
  });
  return response.data;
};

export const listSubDistrict = async (token: string | null, id: string) => {
  const response = await http(token).get("/master/sub-districts", {
    params: { city_id: id },
  });
  return response.data;
};

export const listCity = async (token: string | null, id: string) => {
  const response = await http(token).get("/master/cities", {
    params: { province_id: id },
  });
  return response.data;
};

export const listProvince = async (token: string | null) => {
  const response = await http(token).get("/master/provinces");
  return response.data;
};
