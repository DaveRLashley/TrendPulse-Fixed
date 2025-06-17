// server/storage.ts

import {
  // ... imports
  type Analytics,
  type InsertAnalytics,
  type TrendingVideo,
  type InsertTrendingVideo,
  // ... other imports
} from "../shared/schema";

// (Interface is unchanged)
export interface IStorage {
  // ... all interface methods
  getTrendingVideos(platform?: string, category?: string): Promise<TrendingVideo[]>;
  getLatestAnalytics(): Promise<Analytics | undefined>;
}

export class MemStorage implements IStorage {
  private users = new Map();
  private trendingVideos = new Map<number, TrendingVideo>();
  private contentSuggestions = new Map();
  private projects = new Map();
  private analytics = new Map<number, Analytics>();
  private currentVideoId = 1;
  private currentAnalyticsId = 1;

  constructor() {
    this.initializeData();
  }

  // UPDATED METHOD WITH CORRECTED MOCK DATA
  private initializeData() {
    const mockAnalytics: Analytics = {
      id: this.currentAnalyticsId++,
      totalViews: 2400000,
      viralScore: 8.7,
      engagementRate: 15.2,
      growthRate: 24.0,
      videosPublished: 12,
      newFollowers: 5600,
      platformDistribution: {
        youtube: 60,
        tiktok: 35,
        instagram: 5,
      },
      performanceData: {
        daily: [
          { name: 'Mon', views: 4000 },
          { name: 'Tue', views: 3000 },
          { name: 'Wed', views: 2000 },
          { name: 'Thu', views: 2780 },
          { name: 'Fri', views: 1890 },
          { name: 'Sat', views: 2390 },
          { name: 'Sun', views: 3490 },
        ],
        weekly: [
          { name: 'Week 1', views: 15000 },
          { name: 'Week 2', views: 21000 },
          { name: 'Week 3', views: 18000 },
          { name: 'Week 4', views: 25000 },
        ],
      },
      createdAt: new Date(),
    };
    this.analytics.set(mockAnalytics.id, mockAnalytics);

    const mockVideo: TrendingVideo = {
      id: this.currentVideoId++,
      title: '"10 Productivity Hacks" went viral on TikTok',
      platform: 'TikTok',
      views: 45000,
      viralScore: 9.2,
      creator: 'Alex Creator',
      category: 'Education',
      thumbnailUrl: null,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    };
    this.trendingVideos.set(mockVideo.id, mockVideo);
  }

  // --- All other methods remain the same ---

  async getTrendingVideos(platform?: string, category?: string): Promise<TrendingVideo[]> {
    let videos = [...this.trendingVideos.values()];
    if (platform && platform !== 'all') videos = videos.filter(v => v.platform === platform);
    if (category && category !== 'all') videos = videos.filter(v => v.category === category);
    return videos;
  }

  async getLatestAnalytics(): Promise<Analytics | undefined> {
    const allAnalytics = [...this.analytics.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return allAnalytics.length > 0 ? allAnalytics[0] : undefined;
  }
  // ... other methods like createProject, etc.
}

export const storage = new MemStorage();