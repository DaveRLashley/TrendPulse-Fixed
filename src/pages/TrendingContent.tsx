import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VideoCard } from "@/components/VideoCard";
import type { TrendingVideo } from "@/types";

export default function TrendingContent() {
  const [platform, setPlatform] = useState("all");
  const [category, setCategory] = useState("all");

  const { data: videos, isLoading } = useQuery<TrendingVideo[]>({
    queryKey: ['/api/trending-videos', { platform, category }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (platform !== 'all') params.append('platform', platform);
      if (category !== 'all') params.append('category', category);
      
      const response = await fetch(`/api/trending-videos?${params}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch trending videos');
      }
      
      return response.json();
    }
  });

  const handleAnalyze = (video: TrendingVideo) => {
    // Placeholder for analyze functionality
    console.log('Analyzing video:', video.title);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-card rounded-xl border border-border overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-foreground">Platform:</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="youtube">YouTube Shorts</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-foreground">Category:</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="beauty">Beauty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Videos Grid */}
      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onAnalyze={handleAnalyze}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No trending videos found for the selected filters.</p>
        </div>
      )}
    </div>
  );
}
