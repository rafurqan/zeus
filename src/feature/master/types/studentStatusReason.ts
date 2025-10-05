export type StudentStatusReason = {
  id: string;
  name: string;
};

export interface CreateStudentStatusReasonResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: {
    id: string;
  };
}

export interface UpdateStudentStatusReasonResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: {
    id: string;
  };
}

export interface RemoveStudentStatusReasonResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
}
