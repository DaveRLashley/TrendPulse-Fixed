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
  createUser(user: InsertUser): Promise<User>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  createTrendingVideo(video: InsertTrendingVideo): Promise<TrendingVideo>;
  getContentSuggestions(): Promise<ContentSuggestion[]>;
  createContentSuggestion(suggestion: InsertContentSuggestion): Promise<ContentSuggestion>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  updateAnalytics(id: number, updates: Partial<Analytics>): Promise<Analytics | undefined>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private trendingVideos = new Map<number, TrendingVideo>();
  private analytics = new Map<number, Analytics>();
  private projects = new Map<number, Project>();
  private users = new Map<number, User>();
  private contentSuggestions = new Map<number, ContentSuggestion>();

  private currentVideoId = 1;
  private currentAnalyticsId = 1;
  private currentProjectId = 1;
  private currentUserId = 1;
  private currentSuggestionId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Corrected sample videos list
    const sampleVideos: Omit<TrendingVideo, 'id' | 'createdAt'>[] = [
      { title: "My Perfect Morning Routine for Productivity", platform: "youtube", views: 2100000, viralScore: 9.2, creator: "@productivityguru", category: "Lifestyle", thumbnailUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136" },
      { title: "5 Minute Makeup Tutorial ✨", platform: "tiktok", views: 890000, viralScore: 8.7, creator: "@beautyhacks101", category: "Beauty", thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113" },
      { title: "How I Gained 1M Followers in 30 Days", platform: "youtube", views: 1500000, viralScore: 9.5, creator: "@growthhacker", category: "Marketing", thumbnailUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4" },
      { title: "Beginner’s Guide to Reels Editing 🎬", platform: "instagram", views: 620000, viralScore: 8.3, creator: "@editqueen", category: "Tech", thumbnailUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee" },
      { title: "Day in My Life as a Remote Dev", platform: "youtube", views: 450000, viralScore: 7.9, creator: "@codedaily", category: "Lifestyle", thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c" },
      { title: "Viral TikTok Dance Explained", platform: "tiktok", views: 1340000, viralScore: 8.8, creator: "@trendspotter", category: "Entertainment", thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg" },
    ];
    sampleVideos.forEach(video => this.createTrendingVideo(video));

    // Corrected analytics data
    const sampleAnalytics: Analytics = {
      id: 1,
      totalViews: 2400000,
      viralScore: 8.7,       // <-- CORRECTED
      engagementRate: 15.2,
      growthRate: 24,
      videosPublished: 42,
      newFollowers: 156000,
      platformDistribution: { youtube: 65, tiktok: 35 }, // <-- CORRECTED
      performanceData: {
        daily: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        weekly: [1200000, 1900000, 1500000, 2100000]
      },
      createdAt: new Date()
    };
    this.analytics.set(sampleAnalytics.id, sampleAnalytics);
    this.currentAnalyticsId = 2;
  }
  
  // --- All storage methods are present and correct below ---

  async getTrendingVideos(): Promise<TrendingVideo[]> {
    return Array.from(this.trendingVideos.values());
  }

  async getLatestAnalytics(): Promise<Analytics | null> {
    const list = Array.from(this.analytics.values());
    list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return list[0] ?? null;
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
    const fullProject: Project = { 
      id, 
      ...project, 
      createdAt: now, 
      updatedAt: now,
      description: project.description || null,
      progress: project.progress || 0
    };
    this.projects.set(id, fullProject);
    return fullProject;
  }

  async getUser(id: number): Promise<User | undefined> { return this.users.get(id); }
  async getUserByUsername(username: string): Promise<User | undefined> { return Array.from(this.users.values()).find(user => user.username === username); }
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, password: insertUser.password! };
    this.users.set(id, user);
    return user;
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
  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    const updatedProject = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
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