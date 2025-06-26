import { useState } from "react";

import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { RegistrationCode } from "../types/prospective-student";
import { prospectiveStudentService } from "../service/prospectiveStudentService";

export const useGetRegistrationCode = () => {
  const [data, setData] = useState<RegistrationCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRegistrationCode = async () => {
    try {
      setLoading(true);
      const result = await prospectiveStudentService.getRegistrationCode();
      setData(result.data);
      setLoading(false);
      return result;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data.message ??
            "Terjadi kesalahan saat generate registration code"
        );
        setError(
          err.response?.data.message ||
            "Terjadi kesalahan saat generate registration code"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    getRegistrationCode,
  };
};
