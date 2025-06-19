// src/pages/Analytics.tsx
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PerformanceChart } from "@/components/PerformanceChart";
import type { Analytics as AnalyticsType } from "@/types";
import API_BASE_URL from '@/lib/api';

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsType>({
    queryKey: [`${API_BASE_URL}/api/analytics`],
    queryFn: async () => {
      const response = await fetch(`${API_...`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  const topPerformingVideos = [
    { title: "My 5AM Morning Routine", platform: "YouTube", views: "2.1M", engagement: "18.2%", viralScore: 9.2 },
    { title: "iPhone Tips You Don't Know", platform: "TikTok", views: "1.8M", engagement: "22.1%", viralScore: 9.8 },
    { title: "30-Second Pasta Recipe", platform: "YouTube", views: "1.5M", engagement: "16.7%", viralScore: 9.5 },
    { title: "Dog Magic Trick Reaction", platform: "TikTok", views: "4.1M", engagement: "25.3%", viralScore: 9.7 }
  ];

  if (isLoading) {
    return <div className="p-6 animate-pulse"><div className="h-screen bg-muted rounded-xl"></div></div>;
  }

  if (!analytics) {
    return <div className="p-6 text-center text-muted-foreground">No analytics data available</div>;
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* ...Header and Key Metrics sections are unchanged... */}
      <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">Performance Analytics</CardTitle>
                {/* ...other elements... */}
            </div>
          </CardHeader>
          <CardContent>
            {/* ...other elements... */}
          </CardContent>
      </Card>


      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* ...Charts are unchanged... */}
      </div>

      {/* Top Performing Content */}
      <Card>
        <CardHeader><CardTitle>Top Performing Content</CardTitle></CardHeader>
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
                      {/* --- START: THIS IS THE ONLY CHANGE --- */}
                      <Badge 
                        variant="outline"
                        className={
                          video.platform === 'YouTube' 
                            ? 'text-primary border-primary bg-primary/10 font-semibold' 
                            : 'text-accent border-accent bg-accent/10 font-semibold'
                        }
                      >
                        {video.platform}
                      </Badge>
                      {/* --- END: THIS IS THE ONLY CHANGE --- */}
                    </td>
                    <td className="py-3 text-muted-foreground">{video.views}</td>
                    <td className="py-3 text-muted-foreground">{video.engagement}</td>
                    <td className="py-3"><Badge variant="secondary">{video.viralScore}</Badge></td>
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