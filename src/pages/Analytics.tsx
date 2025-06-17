// src/pages/Analytics.tsx
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PerformanceChart } from "@/components/PerformanceChart";
import type { Analytics as AnalyticsType } from "@/types"; // Renamed to avoid conflict
import API_BASE_URL from '@/lib/api';

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsType>({
    // UPDATED queryKey with full URL
    queryKey: [`${API_BASE_URL}/api/analytics`]
  });

  if (isLoading) {
    return (
      <div className="p-6">
        {/* ... loading skeleton JSX ... */}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  // ... rest of your component's code and JSX ...
  
  return (
    <div className="p-6">
       {/* ... rest of your component's JSX ... */}
    </div>
  );
}