export type Program = {
  id: string;
  name: string;
  description: string;
  level: string;
  status: string;
};

export interface CreateProgramResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: {
    id: string;
  };
}

export interface UpdateProgramResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: {
    id: string;
  };
}

export interface RemoveProgramResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
}
