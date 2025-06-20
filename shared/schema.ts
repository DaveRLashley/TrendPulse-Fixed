import { z } from "zod";

// Zod schema for project validation
export const insertProjectSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  status: z.enum(["planning", "in-progress", "completed"]),
  progress: z.number().min(0).max(100).optional(),
});

// TypeScript types for shared data structures
export type Project = {
  id: number;
  title: string;
  description: string;
  status: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
};
export type InsertProject = Omit<Project, "id" | "createdAt" | "updatedAt">;

export type TrendingVideo = {
  id: number;
  title: string;
  platform: string;
  views: number;
  viralScore: number;
  creator: string;
  category: string;
  thumbnailUrl: string;
  createdAt: Date;
};
export type InsertTrendingVideo = Omit<TrendingVideo, "id">;

export type Analytics = {
  id: number;
  totalViews: number;
  viralScore: number;
  engagementRate: number;
  growthRate: number;
  videosPublished: number;
  newFollowers: number;
  platformDistribution: Record<string, number>;
  performanceData: {
    daily: number[];
    weekly: number[];
  };
  createdAt: Date;
};
export type InsertAnalytics = Omit<Analytics, "id" | "createdAt">;

export type ContentSuggestion = {
  id: number;
  title: string;
  tags: string[];
};
export type InsertContentSuggestion = Omit<ContentSuggestion, "id">;

export type User = { id: number; name: string };
export type InsertUser = Omit<User, "id">;