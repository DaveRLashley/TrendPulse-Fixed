import {
  users,
  trendingVideos,
  contentSuggestions,
  projects,
  analytics,
  type User,
  type InsertUser,
  type TrendingVideo,
  type InsertTrendingVideo,
  type ContentSuggestion,
  type InsertContentSuggestion,
  type Project,
  type InsertProject,
  type Analytics,
  type InsertAnalytics
} from "../shared/schema.js";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getTrendingVideos(platform?: string, category?: string): Promise<TrendingVideo[]>;
  createTrendingVideo(video: InsertTrendingVideo): Promise<TrendingVideo>;

  getContentSuggestions(): Promise<ContentSuggestion[]>;
  createContentSuggestion(suggestion: InsertContentSuggestion): Promise<ContentSuggestion>;

  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;

  getLatestAnalytics(): Promise<Analytics | undefined>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  updateAnalytics(id: number, updates: Partial<Analytics>): Promise<Analytics | undefined>;
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
    // Optional: preload mock data if needed
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return [...this.users.values()].find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = { ...user, id: this.currentUserId++, password: user.password || '' };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async getTrendingVideos(platform?: string, category?: string): Promise<TrendingVideo[]> {
    let videos = [...this.trendingVideos.values()];
    if (platform) videos = videos.filter(v => v.platform === platform);
    if (category) videos = videos.filter(v => v.category === category);
    return videos;
  }

  async createTrendingVideo(video: InsertTrendingVideo): Promise<TrendingVideo> {
    const newVideo: TrendingVideo = {
      ...video,
      id: this.currentVideoId++,
      createdAt: new Date(),
      thumbnailUrl: video.thumbnailUrl || null
    };
    this.trendingVideos.set(newVideo.id, newVideo);
    return newVideo;
  }

  async getContentSuggestions(): Promise<ContentSuggestion[]> {
    return [...this.contentSuggestions.values()];
  }

  async createContentSuggestion(suggestion: InsertContentSuggestion): Promise<ContentSuggestion> {
    const newSuggestion: ContentSuggestion = {
      ...suggestion,
      id: this.currentSuggestionId++,
      createdAt: new Date(),
      titles: suggestion.titles as string[],
      tags: suggestion.tags as string[],
      contentIdeas: suggestion.contentIdeas as any[],
    };
    this.contentSuggestions.set(newSuggestion.id, newSuggestion);
    return newSuggestion;
  }

  async getProjects(): Promise<Project[]> {
    return [...this.projects.values()];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: this.currentProjectId++,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: project.description || null,
      progress: project.progress || 0
    };
    this.projects.set(newProject.id, newProject);
    return newProject;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    const updated = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updated);
    return updated;
  }

  async getLatestAnalytics(): Promise<Analytics | undefined> {
    const allAnalytics = [...this.analytics.values()];
    return allAnalytics.length > 0 ? allAnalytics[allAnalytics.length - 1] : undefined;
  }

  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const newAnalytics: Analytics = {
      ...analyticsData,
      id: this.currentAnalyticsId++,
      createdAt: new Date(),
      totalViews: analyticsData.totalViews ?? 0,
      viralScore: analyticsData.viralScore ?? 0,
      engagementRate: analyticsData.engagementRate ?? 0,
      growthRate: analyticsData.growthRate ?? 0,
      videosPublished: analyticsData.videosPublished ?? 0,
      newFollowers: analyticsData.newFollowers ?? 0,
      platformDistribution: analyticsData.platformDistribution || null,
      performanceData: analyticsData.performanceData || null
    };
    this.analytics.set(newAnalytics.id, newAnalytics);
    return newAnalytics;
  }

  async updateAnalytics(id: number, updates: Partial<Analytics>): Promise<Analytics | undefined> {
    const current = this.analytics.get(id);
    if (!current) return undefined;
    const updated = { ...current, ...updates };
    this.analytics.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();