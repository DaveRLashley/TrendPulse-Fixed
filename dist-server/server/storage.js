export class MemStorage {
    users = new Map();
    trendingVideos = new Map();
    contentSuggestions = new Map();
    projects = new Map();
    analytics = new Map();
    currentUserId = 1;
    currentVideoId = 1;
    currentSuggestionId = 1;
    currentProjectId = 1;
    currentAnalyticsId = 1;
    constructor() {
        this.initializeData();
    }
    initializeData() {
        // Optional: preload mock data if needed
    }
    async getUser(id) {
        return this.users.get(id);
    }
    async getUserByUsername(username) {
        return [...this.users.values()].find(u => u.username === username);
    }
    async createUser(user) {
        const newUser = { ...user, id: this.currentUserId++ };
        this.users.set(newUser.id, newUser);
        return newUser;
    }
    async getTrendingVideos(platform, category) {
        let videos = [...this.trendingVideos.values()];
        if (platform)
            videos = videos.filter(v => v.platform === platform);
        if (category)
            videos = videos.filter(v => v.category === category);
        return videos;
    }
    async createTrendingVideo(video) {
        const newVideo = {
            ...video,
            id: this.currentVideoId++,
            createdAt: new Date(),
            thumbnailUrl: video.thumbnailUrl ?? ""
        };
        this.trendingVideos.set(newVideo.id, newVideo);
        return newVideo;
    }
    async getContentSuggestions() {
        return [...this.contentSuggestions.values()];
    }
    async createContentSuggestion(suggestion) {
        const newSuggestion = {
            ...suggestion,
            id: this.currentSuggestionId++,
            createdAt: new Date()
        };
        this.contentSuggestions.set(newSuggestion.id, newSuggestion);
        return newSuggestion;
    }
    async getProjects() {
        return [...this.projects.values()];
    }
    async createProject(project) {
        const newProject = {
            ...project,
            id: this.currentProjectId++,
            createdAt: new Date(),
            updatedAt: new Date(),
            description: project.description ?? "",
            progress: project.progress ?? 0
        };
        this.projects.set(newProject.id, newProject);
        return newProject;
    }
    async updateProject(id, updates) {
        const project = this.projects.get(id);
        if (!project)
            return undefined;
        const updated = { ...project, ...updates };
        this.projects.set(id, updated);
        return updated;
    }
    async getLatestAnalytics() {
        const analytics = [...this.analytics.values()];
        return analytics.at(-1);
    }
    async createAnalytics(analyticsData) {
        const newAnalytics = {
            ...analyticsData,
            id: this.currentAnalyticsId++,
            createdAt: new Date(),
            totalViews: analyticsData.totalViews ?? 0,
            viralScore: analyticsData.viralScore ?? 0,
            engagementRate: analyticsData.engagementRate ?? 0,
            growthRate: analyticsData.growthRate ?? 0,
            videosPublished: analyticsData.videosPublished ?? 0,
            newFollowers: analyticsData.newFollowers ?? 0,
            platformDistribution: analyticsData.platformDistribution ?? {},
            performanceData: analyticsData.performanceData ?? {}
        };
        this.analytics.set(newAnalytics.id, newAnalytics);
        return newAnalytics;
    }
    async updateAnalytics(id, updates) {
        const current = this.analytics.get(id);
        if (!current)
            return undefined;
        const updated = { ...current, ...updates };
        this.analytics.set(id, updated);
        return updated;
    }
}
export const storage = new MemStorage();
