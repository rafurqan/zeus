import { useState, useEffect, useContext } from 'react';
import { invoiceService } from '../service/invoiceService';
import { Invoice } from '../types/invoice';
import { AppContext } from "@/context/AppContext";

export const useInvoice = () => {
  const { token } = useContext(AppContext);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm ] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua Status');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchInvoices = async () => {
    if (!token) return;
  
    try {
      setLoading(true);
      const response = await invoiceService.getAllPage(token, page, 10, searchTerm, selectedStatus);
      setInvoices(response.data.data);
      setLastPage(response.data.last_page);
    } catch (err: any) {
      console.error(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchInvoices();
  }, [page, searchTerm, selectedStatus, token]); // Tambahkan selectedStatus ke dependencies

  return {
    invoices,
    page,
    setPage,
    lastPage,
    setSelectedStatus, // Expose this function
    loading
  };
};
