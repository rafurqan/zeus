import http from "./auth";

export const listEducationLevel = async () => {
  const response = await http.get("/master/education-levels");
  return response.data;
};

export const listProgram = async () => {
  const response = await http.get("/master/programs");
  return response.data;
};

export const deleteEducationLevel = (id: string) => {
  return http.delete(`/api/v1/master/education-levels/${id}`);
};

export const listNationality = async () => {
  const response = await http.get("/master/nationalities");
  return response.data;
};

export const listReligion = async () => {
  const response = await http.get("/master/religions");
  return response.data;
};

export const listIncomeRange = async () => {
  const response = await http.get("/master/income-ranges");
  return response.data;
};

export const listParentType = async () => {
  const response = await http.get("/master/parent-types");
  return response.data;
};

export const listContactType = async () => {
  const response = await http.get("/master/contact-types");
  return response.data;
};

export const listSpecialNeed = async () => {
  const response = await http.get("/master/special-needs");
  return response.data;
};

export const listTransporatationMode = async () => {
  const response = await http.get("/master/transportation-modes");
  return response.data;
};

export const listDocumentType = async () => {
  const response = await http.get("/master/document-types");
  return response.data;
};

export const listGuardianRelationship = async () => {
  const response = await http.get("/master/guardian-relationships");
  return response.data;
};

export const listSchoolType = async () => {
  const response = await http.get("/master/school-types");
  return response.data;
};

export const listSpecialCondition = async () => {
  const response = await http.get("/master/special-conditions");
  return response.data;
};

export const listVillage = async (id: string) => {
  const response = await http.get("/master/villages", {
    params: { sub_district_id: id },
  });
  return response.data;
};

export const listSubDistrict = async (id: string) => {
  const response = await http.get("/master/sub-districts", {
    params: { city_id: id },
  });
  return response.data;
};

export const listCity = async (id: string) => {
  const response = await http.get("/master/cities", {
    params: { province_id: id },
  });
  return response.data;
};

export const listProvince = async () => {
  const response = await http.get("/master/provinces");
  return response.data;
};


export const listOccupations = async () => {
  const response = await http.get("/master/occupations");
  return response.data;
};