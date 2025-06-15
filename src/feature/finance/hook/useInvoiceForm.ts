import { useState, useEffect } from 'react';
import { billingService } from '@/feature/billing/service/billingService';

export const useInvoiceForm = () => {
  const [packages, setPackages] = useState([]);
  const [individualItems, setIndividualItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        const data = await billingService.getAll();
        // Pisahkan data menjadi paket dan item individual
        const packageItems = data.filter(item => item.category === 'package');
        const individual = data.filter(item => item.category !== 'package');
        
        setPackages(packageItems);
        setIndividualItems(individual);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  return {
    packages,
    individualItems,
    loading,
    error
  };
};