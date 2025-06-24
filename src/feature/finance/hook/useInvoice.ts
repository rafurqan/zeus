import { useState, useEffect, useContext } from 'react';
import { invoiceService } from '../service/invoiceService';
import { Invoice } from '../types/invoice';
import { AppContext } from "@/context/AppContext";

export const useInvoice = () => {
  const { token } = useContext(AppContext);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [originalInvoices, setOriginalInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua Status');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchInvoices = async () => {
    if (!token) return;
  
    try {
      setLoading(true);
      const response = await invoiceService.getAllPage(token, page, perPage, searchTerm, selectedStatus);
      setInvoices(response.data.data); // <-- ambil array invoice
      setLastPage(response.data.last_page);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchInvoices();
  }, [token, page, searchTerm, selectedStatus]);

  return {
    invoices,
    originalInvoices: invoices,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    page,
    setPage,
    lastPage
  };  
};
