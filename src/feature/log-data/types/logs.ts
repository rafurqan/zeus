import { Meta } from "@/core/types/meta";

export type LogRequestValue = string | number | boolean | null | undefined;
export type LogRequest = Record<string, LogRequestValue> | [];

// Type untuk single log entry
export type LogEntry = {
  raw?: string;
  user?: string;
  user_id?: string;
  ip?: string;
  timestamp?: string;
  method?: string;
  url?: string;
  request?: LogRequest;
};

export type LogResponse = {
  meta: Meta | null;
  data: LogEntry[];
};

export type ListLogRequest = {
  keyword?: string;
  page?: number;
  per_page?: number;
};