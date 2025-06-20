import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";
import type { TrendingVideo } from "@/types";

interface VideoCardProps {
  video: TrendingVideo;
  onAnalyze?: (video: TrendingVideo) => void;
}

export function VideoCard({ video, onAnalyze }: VideoCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`;
    }
    return views.toString();
  };

  const platformColors = {
    youtube: "bg-red-100 text-red-800",
    tiktok: "bg-pink-100 text-pink-800"
  };

  return (
    <Card className="overflow-hidden">
      {video.thumbnailUrl && (
        <img 
          src={video.thumbnailUrl} 
          alt={video.title}
          className="w-full h-auto max-h-48 object-contain"
        />
      )}
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge className={platformColors[video.platform]}>
            {video.platform === 'youtube' ? 'YouTube' : 'TikTok'}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatViews(video.views)} views
          </span>
        </div>
        <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
          {video.title}
        </h4>
        <p className="text-sm text-muted-foreground mb-3">{video.creator}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Flame className="w-4 h-4 text-warning mr-1" />
            Viral Score: {video.viralScore}
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onAnalyze?.(video)}
          >
            Analyze
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
