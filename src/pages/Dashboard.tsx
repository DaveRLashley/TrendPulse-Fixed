// src/pages/Dashboard.tsx
import { useQuery } from "@tanstack/react-query";
import { Eye, Flame, Users, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { PerformanceChart } from "@/components/PerformanceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Analytics } from "@/types";
import API_BASE_URL from '@/lib/api';

export default function Dashboard() {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: [`${API_BASE_URL}/api/analytics`],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/analytics`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  // Note: In a real app, recent activity would be its own API call
  const recentActivity = [
    { text: '"10 Productivity Hacks" went viral on TikTok', time: '2 hours ago', views: '45K views', type: 'Viral', color: 'bg-green-500' },
    { text: 'AI generated 5 new title suggestions', time: '4 hours ago', type: 'New', color: 'bg-blue-500' },
    { text: 'Trending hashtag detected: #MorningRoutine', time: '6 hours ago', type: 'Trend', color: 'bg-purple-500' },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
          {[...Array(4)].map((_, i) => ( <div key={i} className="bg-muted rounded-xl h-32"></div> ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8 animate-pulse">
          <div className="lg:col-span-3 bg-muted rounded-xl h-80"></div>
          <div className="lg:col-span-2 bg-muted rounded-xl h-80"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No analytics data available.
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Views" value={formatNumber(analytics.totalViews)} change="+12.5% from last month" icon={Eye} color="bg-primary"/>
        <StatsCard title="Viral Score" value={`${analytics.viralScore}/10`} change="Above average" icon={Flame} color="bg-secondary"/>
        <StatsCard title="Engagement" value={`${analytics.engagementRate}%`} change="+3.1% increase" icon={Users} color="bg-accent"/>
        <StatsCard title="Growth Rate" value={`+${analytics.growthRate}%`} change="This week" icon={TrendingUp} color="bg-warning"/>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <PerformanceChart title="Performance Overview" data={analytics.performanceData.daily.map((views, index) => ({ name: `Day ${index + 1}`, views }))} type="line"/>
        </div>
        <div className="lg:col-span-2">
          <PerformanceChart title="Platform Distribution" data={[
              { name: 'YouTube', value: analytics.platformDistribution.youtube },
              { name: 'TikTok', value: analytics.platformDistribution.tiktok },
              { name: 'Instagram', value: analytics.platformDistribution.instagram },
            ]} type="doughnut"/>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center`}>
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}{activity.views ? ` • ${activity.views}` : ''}</p>
                </div>
                <Badge className={activity.color}>{activity.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}