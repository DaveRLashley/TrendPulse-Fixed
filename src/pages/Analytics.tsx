import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PerformanceChart } from "@/components/PerformanceChart";
import type { Analytics } from "@/types";

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ['/api/analytics']
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div className="bg-white dark:bg-card rounded-xl border border-border p-6 animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-8 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>
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

  const topPerformingVideos = [
    {
      title: "My 5AM Morning Routine",
      platform: "YouTube",
      views: "2.1M",
      engagement: "18.2%",
      viralScore: 9.2
    },
    {
      title: "iPhone Tips You Don't Know",
      platform: "TikTok", 
      views: "1.8M",
      engagement: "22.1%",
      viralScore: 9.8
    },
    {
      title: "30-Second Pasta Recipe",
      platform: "YouTube",
      views: "1.5M", 
      engagement: "16.7%",
      viralScore: 9.5
    },
    {
      title: "Dog Magic Trick Reaction",
      platform: "TikTok",
      views: "4.1M",
      engagement: "25.3%", 
      viralScore: 9.7
    }
  ];

  return (
    <div className="p-6">
      {/* Analytics Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Performance Analytics</CardTitle>
            <div className="flex items-center space-x-2">
              <Select defaultValue="30">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{analytics.videosPublished}</div>
              <div className="text-sm text-muted-foreground">Videos Published</div>
              <div className="text-xs text-accent">+7 this month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(analytics.totalViews)}
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
              <div className="text-xs text-accent">+2.1M this month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {analytics.engagementRate}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Engagement</div>
              <div className="text-xs text-accent">+1.3% increase</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(analytics.newFollowers)}
              </div>
              <div className="text-sm text-muted-foreground">New Followers</div>
              <div className="text-xs text-accent">+32K this month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PerformanceChart
          title="Views Over Time"
          data={analytics.performanceData.weekly}
          type="bar"
        />
        <PerformanceChart
          title="Engagement Metrics"
          data={[85, 70, 60, 75, 80]}
          type="line"
        />
      </div>

      {/* Top Performing Content */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Video Title</th>
                  <th className="pb-3 font-medium text-muted-foreground">Platform</th>
                  <th className="pb-3 font-medium text-muted-foreground">Views</th>
                  <th className="pb-3 font-medium text-muted-foreground">Engagement</th>
                  <th className="pb-3 font-medium text-muted-foreground">Viral Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topPerformingVideos.map((video, index) => (
                  <tr key={index}>
                    <td className="py-3 font-medium text-foreground">{video.title}</td>
                    <td className="py-3">
                      <Badge 
                        className={
                          video.platform === 'YouTube' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-pink-100 text-pink-800'
                        }
                      >
                        {video.platform}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{video.views}</td>
                    <td className="py-3 text-muted-foreground">{video.engagement}</td>
                    <td className="py-3">
                      <Badge className="bg-accent/10 text-accent">
                        {video.viralScore}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
