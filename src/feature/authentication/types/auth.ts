export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: {
    access_token: string;
    token_type: string;
    user: {
      id: string;
      name: string;
      email: string;
      email_verified_at: string | null;
      created_at: string;
      updated_at: string;
    };
  };
}
