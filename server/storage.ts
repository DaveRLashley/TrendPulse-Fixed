
import {
  type User, type InsertUser, type TrendingVideo, type InsertTrendingVideo,
  type ContentSuggestion, type InsertContentSuggestion, type Project,
  type InsertProject, type Analytics, type InsertAnalytics,
} from "../shared/schema";

export interface IStorage {
  getTrendingVideos(): Promise<TrendingVideo[]>;
  getLatestAnalytics(): Promise<Analytics | null>;
  getProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | null>;
  createProject(project: InsertProject): Promise<Project>;
}

export class MemStorage implements IStorage {
  private trendingVideos = new Map<number, TrendingVideo>();
  private analytics = new Map<number, Analytics>();
  private projects = new Map<number, Project>();
  private currentVideoId = 1;
  private currentAnalyticsId = 1;
  private currentProjectId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    const sampleVideos: Omit<TrendingVideo, 'id'>[] = [
      { title: "My Perfect Morning Routine for Productivity", platform: "youtube", views: 2100000, viralScore: 9.2, creator: "@productivityguru", category: "Lifestyle", thumbnailUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4", createdAt: new Date() },
      { title: "5 Minute Makeup Tutorial ✨", platform: "tiktok", views: 890000, viralScore: 8.7, creator: "@beautyhacks101", category: "Beauty", thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113", createdAt: new Date() },
      { title: "How I Gained 1M Followers in 30 Days", platform: "youtube", views: 1500000, viralScore: 9.5, creator: "@growthhacker", category: "Marketing", thumbnailUrl: "", createdAt: new Date() },
      { title: "Beginner’s Guide to Reels Editing 🎬", platform: "instagram", views: 620000, viralScore: 8.3, creator: "@editqueen", category: "Tech", thumbnailUrl: "", createdAt: new Date() },
      { title: "Day in My Life as a Remote Dev", platform: "youtube", views: 450000, viralScore: 7.9, creator: "@codedaily", category: "Lifestyle", thumbnailUrl: "", createdAt: new Date() },
      { title: "Viral TikTok Dance Explained", platform: "tiktok", views: 1340000, viralScore: 8.8, creator: "@trendspotter", category: "Entertainment", thumbnailUrl: "", createdAt: new Date() },
    ];
    sampleVideos.forEach(video => this.trendingVideos.set(this.currentVideoId++, { ...video, id: this.currentVideoId - 1 }));

    const sampleAnalytics: Analytics = {
      id: this.currentAnalyticsId++,
      createdAt: new Date(),
      totalViews: 2400000,
      viralScore: 8.7,
      engagementRate: 15.2,
      growthRate: 24,
      videosPublished: 42,
      newFollowers: 156000,
      platformDistribution: { youtube: 45, tiktok: 35, instagram: 20 },
      performanceData: {
        daily: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        weekly: [1200000, 1900000, 1500000, 2100000]
      }
    };
    this.analytics.set(sampleAnalytics.id, sampleAnalytics);
  }

  async getTrendingVideos(): Promise<TrendingVideo[]> {
    return Array.from(this.trendingVideos.values());
  }

  async getLatestAnalytics(): Promise<Analytics | null> {
    const list = Array.from(this.analytics.values());
    return list[list.length - 1] ?? null;
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectById(id: number): Promise<Project | null> {
    return this.projects.get(id) ?? null;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const fullProject: Project = { id, ...project, createdAt: now, updatedAt: now };
    this.projects.set(id, fullProject);
    return fullProject;
  }
}

export const storage = new MemStorage();
