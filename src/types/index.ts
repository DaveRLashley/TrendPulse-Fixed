export interface TrendingVideo {
  id: number;
  title: string;
  platform: 'youtube' | 'tiktok';
  views: number;
  viralScore: number;
  creator: string;
  category: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface ContentSuggestion {
  id: number;
  topic: string;
  platform: string;
  style: string;
  titles: string[];
  tags: string[];
  contentIdeas: {
    title: string;
    description: string;
    engagement: string;
  }[];
  createdAt: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  status: 'planning' | 'in-progress' | 'completed';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  id: number;
  totalViews: number;
  viralScore: number;
  engagementRate: number;
  growthRate: number;
  videosPublished: number;
  newFollowers: number;
  platformDistribution: {
    youtube: number;
    tiktok: number;
    instagram: number;
  };
  performanceData: {
    daily: number[];
    weekly: number[];
  };
  createdAt: string;
}
