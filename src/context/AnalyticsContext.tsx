// src/context/AnalyticsContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Analytics } from '@/types';
import API_BASE_URL from '@/lib/api';

interface AnalyticsContextValue {
  analytics: Analytics | null;
  isLoading: boolean;
  isError: boolean;
  selectedRange: string;
  setSelectedRange: (range: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedRange, setSelectedRange] = useState("7"); // default to last 7 days

  const { data, isLoading, isError } = useQuery<Analytics>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/analytics`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    }
  });

  return (
    <AnalyticsContext.Provider value={{ analytics: data ?? null, isLoading, isError, selectedRange, setSelectedRange }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
