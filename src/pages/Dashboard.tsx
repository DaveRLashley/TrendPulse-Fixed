import { useQuery } from "@tanstack/react-query";
import { Eye, Flame, Users, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { PerformanceChart } from "@/components/PerformanceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Analytics } from "@/types";

export default function Dashboard() {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ['/api/analytics']
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-card rounded-xl border border-border p-6 animate-pulse">
              <div className="h-16 bg-muted rounded"></div>
            </div>
          ))}
        </div>
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

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Views"
          value={formatNumber(analytics.totalViews)}
          change="+12.5% from last month"
          icon={Eye}
          color="bg-primary"
        />
        <StatsCard
          title="Viral Score"
          value={`${analytics.viralScore}/10`}
          change="Above average"
          icon={Flame}
          color="bg-secondary"
        />
        <StatsCard
          title="Engagement"
          value={`${analytics.engagementRate}%`}
          change="+3.1% increase"
          icon={Users}
          color="bg-accent"
        />
        <StatsCard
          title="Growth Rate"
          value={`+${analytics.growthRate}%`}
          change="This week"
          icon={TrendingUp}
          color="bg-warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PerformanceChart
          title="Performance Overview"
          data={analytics.performanceData.daily}
          type="line"
        />
        <PerformanceChart
          title="Platform Distribution"
          data={[
            analytics.platformDistribution.youtube,
            analytics.platformDistribution.tiktok,
            analytics.platformDistribution.instagram
          ]}
          type="doughnut"
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-foreground">
                  "10 Productivity Hacks" went viral on TikTok
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago • 45K views</p>
              </div>
              <Badge className="bg-accent text-white">Viral</Badge>
            </div>
            
            <div className="flex items-center p-4 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-foreground">
                  AI generated 5 new title suggestions
                </p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
              <Badge className="bg-primary text-white">New</Badge>
            </div>
            
            <div className="flex items-center p-4 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-foreground">
                  Trending hashtag detected: #MorningRoutine
                </p>
                <p className="text-xs text-muted-foreground">6 hours ago</p>
              </div>
              <Badge className="bg-secondary text-white">Trend</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
