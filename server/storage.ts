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
} from "../shared/schema";

// (Interface is unchanged)
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
    // Call the new method to populate data on startup
    this.initializeData();
  }

  // NEW METHOD TO ADD MOCK DATA
  private initializeData() {
    // Create Mock Analytics Data
    const mockAnalytics: Analytics = {
      id: this.currentAnalyticsId++,
      totalViews: 2400000,
      viralScore: 8.7,
      engagementRate: 15.2,
      growthRate: 24.0,
      videosPublished: 12,
      newFollowers: 5600,
      platformDistribution: { youtube: 60, tiktok: 40 },
      performanceData: [
        { date: 'Day 1', views: 1000 },
        { date: 'Day 2', views: 1500 },
        { date: 'Day 3', views: 1200 },
        { date: 'Day 4', views: 1800 },
        { date: 'Day 5', views: 2500 },
        { date: 'Day 6', views: 2200 },
        { date: 'Day 7', views: 3000 },
      ],
      createdAt: new Date(),
    };
    this.analytics.set(mockAnalytics.id, mockAnalytics);

    // Create a Mock Trending Video
    const mockVideo: TrendingVideo = {
      id: this.currentVideoId++,
      title: '"10 Productivity Hacks" went viral on TikTok',
      platform: 'TikTok',
      views: 45000,
      viralScore: 9.2,
      creator: 'Alex Creator',
      category: 'Education',
      thumbnailUrl: null, // You could add a real image URL here
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    };
    this.trendingVideos.set(mockVideo.id, mockVideo);
  }

  // (The rest of the methods are unchanged)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return [...this.users.values()].find(u => u.username === username);
  }
  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = { ...user, id: this.currentUserId++, password: user.password! };
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
      thumbnailUrl: video.thumbnailUrl || null,
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
    };
    this.contentSuggestions.set(newSuggestion.id, newSuggestion);
    return newSuggestion;
  }
  async getProjects(): Promise<Project[]> {
    return [...this.projects.values()];
  }
  async createProject(project: InsertProject): Promise<Project> {
    const newProject: Project = {
      description: null,
      progress: 0,
      ...project,
      id: this.currentProjectId++,
      createdAt: new Date(),
      updatedAt: new Date(),
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
    const allAnalytics = [...this.analytics.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return allAnalytics.length > 0 ? allAnalytics[0] : undefined;
  }
  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const newAnalytics: Analytics = {
      totalViews: 0,
      viralScore: 0,
      engagementRate: 0,
      growthRate: 0,
      videosPublished: 0,
      newFollowers: 0,
      platformDistribution: null,
      performanceData: null,
      ...analyticsData,
      id: this.currentAnalyticsId++,
      createdAt: new Date(),
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