export interface MessageTemplate {
  id?: string;
  name: string;
  body: string;
  created_at?: string;
  updated_at?: string;
}

export interface MessageTemplateResponse {
  data: {
    data: MessageTemplate[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  meta: {
    code: number;
    status: string;
    message: string;
  };
}

export interface CreateMessageTemplateResponse {
  data: MessageTemplate;
  meta: {
    code: number;
    status: string;
    message: string;
  };
}

export interface UpdateMessageTemplateResponse {
  data: MessageTemplate;
  meta: {
    code: number;
    status: string;
    message: string;
  };
}

export interface DeleteMessageTemplateResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
}