import { useState, useEffect, useContext } from 'react';
import { billingService } from '@/feature/billing/service/billingService';
import { AppContext } from '@/context/AppContext';
import { Billing } from '@/feature/billing/types/billing'; // Pastikan path ini sesuai

export const useInvoiceForm = () => {
  const { token } = useContext(AppContext);
  const [packages, setPackages] = useState<Billing[]>([]);
  const [individualItems, setIndividualItems] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        const data = await billingService.getAll(token as string);
        
        const packageItems = data.filter(item => item.category === 'package');
        const individual = data.filter(item => item.category !== 'package');
        
        setPackages(packageItems);
        setIndividualItems(individual);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBillingData();
    }
  }, [token]);

  return {
    packages,
    individualItems,
    loading,
    error
  };
};