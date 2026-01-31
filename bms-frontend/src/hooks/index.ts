/**
 * Custom Hooks for BMS Frontend
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to fetch paginated data
 */
export const usePaginatedData = <T,>(
  fetchFn: (page: number, limit: number) => Promise<any>,
  limit = 20
) => {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await fetchFn(page, limit);
        setData(response.data);
        setTotal(response.pagination?.total || 0);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page]);

  return {
    data,
    page,
    setPage,
    total,
    loading,
    error,
    pages: Math.ceil(total / limit),
  };
};

/**
 * Hook to check if user has required role
 */
export const useCanAccess = (requiredRoles?: string[]) => {
  const { user } = useAuth();

  if (!requiredRoles) return true;
  return user && requiredRoles.includes(user.role);
};

/**
 * Hook for form state management
 */
export const useForm = <T extends Record<string, any>>(initialState: T) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const setField = (name: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setFormData(initialState);
  };

  return { formData, handleChange, setField, reset };
};

/**
 * Hook for async API calls
 */
export const useAsync = <T,>(
  asyncFn: () => Promise<T>,
  deps?: React.DependencyList
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await asyncFn();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, deps || []);

  return { data, loading, error };
};
