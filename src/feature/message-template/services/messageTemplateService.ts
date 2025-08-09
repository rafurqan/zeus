import http from "@/core/service/https";
import {
  CreateMessageTemplateResponse,
  MessageTemplate,
  MessageTemplateResponse,
  UpdateMessageTemplateResponse,
  DeleteMessageTemplateResponse
} from "../types/messageTemplate";

export const messageTemplateService = {
  async getAll(token: string): Promise<MessageTemplate[]> {
    const response = await http(token).get("message-templates");
    return response.data.data;
  },

  async getAllWithPagination(
    token: string,
    page: number = 1,
    perPage: number = 10,
    search: string = ""
  ): Promise<MessageTemplateResponse> {
    const response = await http(token).get("message-templates", {
      params: {
        page,
        per_page: perPage,
        search,
      },
    });
    return response.data;
  },

  async getById(token: string, id: string): Promise<MessageTemplate> {
    const response = await http(token).get(`message-templates/${id}`);
    return response.data.data;
  },

  async create(token: string, data: MessageTemplate): Promise<CreateMessageTemplateResponse> {
    const response = await http(token).post<CreateMessageTemplateResponse>(
      "message-templates",
      data
    );
    return response.data;
  },

  async update(token: string, data: MessageTemplate): Promise<UpdateMessageTemplateResponse> {
    const response = await http(token).put<UpdateMessageTemplateResponse>(
      `message-templates/${data.id}`,
      data
    );
    return response.data;
  },

  async remove(token: string, id: string): Promise<DeleteMessageTemplateResponse> {
    const response = await http(token).delete(`message-templates/${id}`);
    return response.data;
  },
};