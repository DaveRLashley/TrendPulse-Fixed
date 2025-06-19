import {
  type User,
  type InsertUser,
  type TrendingVideo,
  type InsertTrendingVideo,
  type ContentSuggestion,
  type InsertContentSuggestion,
  type Project,
  type InsertProject,
  type Analytics,
  type InsertAnalytics,
} from "../shared/schema";

export interface IStorage {
  getUsers(): Promise<User[]>;
  createUser(input: InsertUser): Promise<User>;
  getProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | null>;
  createProject(input: InsertProject): Promise<Project>;
  getTrendingVideos(): Promise<TrendingVideo[]>;
  getAnalytics(): Promise<Analytics>;
  getContentSuggestions(): Promise<ContentSuggestion[]>;
  createTrendingVideo(input: InsertTrendingVideo): Promise<TrendingVideo>;
  createAnalytics(input: InsertAnalytics): Promise<Analytics>;
  createContentSuggestion(input: InsertContentSuggestion): Promise<ContentSuggestion>;
}

export class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private trendingVideos = new Map<number, TrendingVideo>();
  private contentSuggestions = new Map<number, ContentSuggestion>();
  private projects = new Map<number, Project>();
  private analytics = new Map<number, Analytics>();

  private currentUserId = 1;
  private currentVideoId = 1;
  private currentSuggestionId = 1;
  private currentProjectId = 1;
  private currentAnalyticsId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    const sampleVideos: Omit<TrendingVideo, "id">[] = [
      {
        title: "My Perfect Morning Routine for Productivity",
        platform: "youtube",
        views: 2100000,
        viralScore: 9.2,
        creator: "@productivityguru",
        category: "Lifestyle",
        thumbnailUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
        createdAt: new Date(),
      },
      {
        title: "5 Minute Makeup Tutorial ✨",
        platform: "tiktok",
        views: 890000,
        viralScore: 8.7,
        creator: "@beautyhacks101",
        category: "Beauty",
        thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
        createdAt: new Date(),
      },
    ];
    sampleVideos.forEach((video) => {
      const id = this.currentVideoId++;
      this.trendingVideos.set(id, { ...video, id });
    });

    const sampleProjects: Omit<Project, "id" | "createdAt" | "updatedAt">[] = [
      {
        title: "Morning Routine Series",
        description: "5-part series about optimizing morning routines",
        status: "in-progress",
        progress: 60,
      },
    ];
    sampleProjects.forEach((project) => {
      const id = this.currentProjectId++;
      const now = new Date();
      this.projects.set(id, { ...project, id, createdAt: now, updatedAt: now });
    });

    const sampleAnalytics: Omit<Analytics, "id" | "createdAt"> = {
      totalViews: 2400000,
      viralScore: 8.7,
      engagementRate: 15.2,
      growthRate: 24,
      videosPublished: 42,
      newFollowers: 156000,
      platformDistribution: { youtube: 45, tiktok: 35, instagram: 20 },
      performanceData: {
        daily: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        weekly: [1200000, 1900000, 1500000, 2100000],
      },
    };
    const analyticsId = this.currentAnalyticsId++;
    this.analytics.set(analyticsId, { ...sampleAnalytics, id: analyticsId, createdAt: new Date() });
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(input: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { id, ...input };
    this.users.set(id, user);
    return user;
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectById(id: number): Promise<Project | null> {
    return this.projects.get(id) ?? null;
  }

  async createProject(input: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const project: Project = {
      id,
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(id, project);
    return project;
  }

  async getTrendingVideos(): Promise<TrendingVideo[]> {
    return Array.from(this.trendingVideos.values());
  }

  async createTrendingVideo(input: InsertTrendingVideo): Promise<TrendingVideo> {
    const id = this.currentVideoId++;
    const video: TrendingVideo = { id, ...input };
    this.trendingVideos.set(id, video);
    return video;
  }

  async getAnalytics(): Promise<Analytics> {
    return Array.from(this.analytics.values())[0];
  }

  async createAnalytics(input: InsertAnalytics): Promise<Analytics> {
    const id = this.currentAnalyticsId++;
    const analytics: Analytics = { id, ...input, createdAt: new Date() };
    this.analytics.set(id, analytics);
    return analytics;
  }

  async getContentSuggestions(): Promise<ContentSuggestion[]> {
    return Array.from(this.contentSuggestions.values());
  }

  async createContentSuggestion(input: InsertContentSuggestion): Promise<ContentSuggestion> {
    const id = this.currentSuggestionId++;
    const suggestion: ContentSuggestion = { id, ...input };
    this.contentSuggestions.set(id, suggestion);
    return suggestion;
  }
}

export const storage = new MemStorage();
