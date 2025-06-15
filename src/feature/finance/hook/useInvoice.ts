import { useState, useEffect, useContext } from 'react';
import { AppContext } from '@/context/AppContext';
import { invoiceService } from '../service/invoiceService';
import { Invoice } from '../types/invoice';

export const useInvoice = () => {
  const { token } = useContext(AppContext);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const data = await invoiceService.getAll(token);
        setInvoices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [token]);

  return {
    invoices,
    loading,
    error,
    searchQuery,
    setSearchQuery
  };
};