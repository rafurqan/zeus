import { useState, useEffect, useContext, useMemo } from 'react';
import { invoiceService } from '../service/invoiceService';
import { Invoice } from '../types/invoice';
import { AppContext } from "@/context/AppContext";


export const useInvoice = () => {
  const { token } = useContext(AppContext);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await invoiceService.getAll(token);
        setInvoices(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [token]);

  const filteredInvoices = useMemo(() => {
    if (!searchTerm) return invoices;
    
    return invoices?.filter(invoice => 
      invoice.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.entity?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [invoices, searchTerm]);

  return {
    invoices: filteredInvoices,
    loading,
    error,
    searchTerm,
    setSearchTerm
  };
};