import { useState, useEffect, useContext } from "react";
import { paymentService } from "../service/paymentService";
import { Payment } from "../types/payment";
import { AppContext } from "@/context/AppContext";

export const usePayment = () => {
  const { token } = useContext(AppContext);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [activeTab, setActiveTab] = useState(null);
  const [total, setTotal] = useState(0);
  

  const fetchPayments = async (page = 1, search = "", status: string | null = null) => {
    setLoading(true);
    setPayments([]); // Reset payments sebelum fetch data baru
    try {
      const response = await paymentService.getAllPage(token, page, 10, search, status);
      if (response.data?.data) {
        setPayments(response.data.data);
        setTotal(response.data.total || 0);
        setLastPage(Math.ceil((response.data.total || 0) / 10));
      }
    } catch (err) {
      setError(err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTab = (status: string | null) => {
    setPage(1);
    setActiveTab(status);
  };
  

  useEffect(() => {
    if (!token) return; // Tambahkan ini
    fetchPayments(page, searchTerm, activeTab);
  }, [token, page, searchTerm, activeTab]);
  

  return {
    payments,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    lastPage,
    activeTab,
    setActiveTab,
  };

  
};