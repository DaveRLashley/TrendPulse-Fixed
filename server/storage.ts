// server/storage.ts

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

// This interface defines all the functions our storage must have.
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

// This is our in-memory storage class that implements the interface.
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

  // This method populates our in-memory storage with rich mock data on startup.
  private initializeData() {
    // Initialize with sample trending videos
    const sampleVideos: Omit<TrendingVideo, 'id'>[] = [
      { title: "My Perfect Morning Routine for Productivity", platform: "youtube", views: 2100000, viralScore: 9.2, creator: "@productivityguru", category: "Lifestyle", thumbnailUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225", createdAt: new Date() },
      { title: "5 Minute Makeup Tutorial ✨", platform: "tiktok", views: 890000, viralScore: 8.7, creator: "@beautyhacks101", category: "Beauty", thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225", createdAt: new Date() },
      { title: "30-Second Pasta Recipe That'll Blow Your Mind", platform: "youtube", views: 1500000, viralScore: 9.5, creator: "@quickrecipes", category: "Food", thumbnailUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225", createdAt: new Date() },
      { title: "10 Minute Morning Yoga Flow", platform: "tiktok", views: 2800000, viralScore: 8.9, creator: "@mindfulmovement", category: "Fitness", thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225", createdAt: new Date() },
      { title: "iPhone Tips You Didn't Know Existed", platform: "youtube", views: 3200000, viralScore: 9.8, creator: "@techtips", category: "Technology", thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225", createdAt: new Date() },
      { title: "Dog Reacts to Magic Trick 🐕✨", platform: "tiktok", views: 4100000, viralScore: 9.7, creator: "@pawsomepets", category: "Entertainment", thumbnailUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225", createdAt: new Date() }
    ];
    sampleVideos.forEach(video => {
      const id = this.currentVideoId++;
      this.trendingVideos.set(id, { ...video, id });
    });

    // Initialize sample projects
    const sampleProjects: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[] = [
      { title: "Morning Routine Series", description: "5-part series about optimizing morning routines", status: "in-progress", progress: 60 },
      { title: "Tech Review Shorts", description: "Quick reviews of latest tech gadgets", status: "planning", progress: 25 },
      { title: "Cooking Tutorials", description: "Easy 5-minute recipe series", status: "completed", progress: 100 }
    ];
    sampleProjects.forEach(project => {
      const id = this.currentProjectId++;
      const now = new Date();
      this.projects.set(id, { ...project, id, createdAt: now, updatedAt: now });
    });

    // Initialize sample analytics
    const sampleAnalytics: Omit<Analytics, 'id' | 'createdAt'> = {
      totalViews: 2400000, viralScore: 8.7, engagementRate: 15.2, growthRate: 24, videosPublished: 42, newFollowers: 156000,
      platformDistribution: { youtube: 45, tiktok: 35, instagram: 20 },
      performanceData: { daily: [12000, 19000, 15000, 25000, 22000, 30000, 28000], weekly: [1200000, 1900000, 1500000, 2100000] }
    };
    const analyticsId = this.currentAnalyticsId++;
    this.analytics.set(analyticsId, { ...sampleAnalytics, id: analyticsId, createdAt: new Date() });
  }

  // --- ALL STORAGE METHODS ---
  async getUser(id: number): Promise<User | undefined> { return this.users.get(id); }
  async getUserByUsername(username: string): Promise<User | undefined> { return Array.from(this.users.values()).find(user => user.username === username); }
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, password: insertUser.password! };
    this.users.set(id, user);
    return user;
  }
  async getTrendingVideos(platform?: string, category?: string): Promise<TrendingVideo[]> {
    let videos = Array.from(this.trendingVideos.values());
    if (platform && platform !== 'all') { videos = videos.filter(video => video.platform === platform); }
    if (category && category !== 'all') { videos = videos.filter(video => video.category.toLowerCase() === category.toLowerCase()); }
    return videos.sort((a, b) => b.viralScore - a.viralScore);
  }
  async createTrendingVideo(video: InsertTrendingVideo): Promise<TrendingVideo> {
    const id = this.currentVideoId++;
    const newVideo: TrendingVideo = { ...video, id, createdAt: new Date(), thumbnailUrl: video.thumbnailUrl || null };
    this.trendingVideos.set(id, newVideo);
    return newVideo;
  }
  async getContentSuggestions(): Promise<ContentSuggestion[]> { return Array.from(this.contentSuggestions.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); }
  async createContentSuggestion(suggestion: InsertContentSuggestion): Promise<ContentSuggestion> {
    const id = this.currentSuggestionId++;
    const newSuggestion: ContentSuggestion = { ...suggestion, id, createdAt: new Date() };
    this.contentSuggestions.set(id, newSuggestion);
    return newSuggestion;
  }
  async getProjects(): Promise<Project[]> { return Array.from(this.projects.values()).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()); }
  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const newProject: Project = { ...project, id, createdAt: now, updatedAt: now, progress: project.progress || 0, description: project.description || null };
    this.projects.set(id, newProject);
    return newProject;
  }
  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    const updatedProject = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  async getLatestAnalytics(): Promise<Analytics | undefined> {
    const analytics = Array.from(this.analytics.values());
    return analytics.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  }
  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const id = this.currentAnalyticsId++;
    const newAnalytics: Analytics = { ...analyticsData, id, createdAt: new Date(), totalViews: analyticsData.totalViews || 0, viralScore: analyticsData.viralScore || 0, engagementRate: analyticsData.engagementRate || 0, growthRate: analyticsData.growthRate || 0, videosPublished: analyticsData.videosPublished || 0, newFollowers: analyticsData.newFollowers || 0, platformDistribution: analyticsData.platformDistribution || null, performanceData: analyticsData.performanceData || null };
    this.analytics.set(id, newAnalytics);
    return newAnalytics;
  }
  async updateAnalytics(id: number, updates: Partial<Analytics>): Promise<Analytics | undefined> {
    const analytics = this.analytics.get(id);
    if (!analytics) return undefined;
    const updatedAnalytics = { ...analytics, ...updates };
    this.analytics.set(id, updatedAnalytics);
    return updatedAnalytics;
  }
}

export const storage = new MemStorage();