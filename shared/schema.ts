import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const trendingVideos = pgTable("trending_videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  platform: text("platform").notNull(), // 'youtube' | 'tiktok'
  views: integer("views").notNull(),
  viralScore: real("viral_score").notNull(),
  creator: text("creator").notNull(),
  category: text("category").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contentSuggestions = pgTable("content_suggestions", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  platform: text("platform").notNull(),
  style: text("style").notNull(),
  titles: jsonb("titles").notNull(),
  tags: jsonb("tags").notNull(),
  contentIdeas: jsonb("content_ideas").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull(), // 'planning' | 'in-progress' | 'completed'
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  totalViews: integer("total_views").default(0),
  viralScore: real("viral_score").default(0),
  engagementRate: real("engagement_rate").default(0),
  growthRate: real("growth_rate").default(0),
  videosPublished: integer("videos_published").default(0),
  newFollowers: integer("new_followers").default(0),
  platformDistribution: jsonb("platform_distribution"),
  performanceData: jsonb("performance_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTrendingVideoSchema = createInsertSchema(trendingVideos).omit({
  id: true,
  createdAt: true,
});

export const insertContentSuggestionSchema = createInsertSchema(contentSuggestions).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type TrendingVideo = typeof trendingVideos.$inferSelect;
export type InsertTrendingVideo = z.infer<typeof insertTrendingVideoSchema>;
export type ContentSuggestion = typeof contentSuggestions.$inferSelect;
export type InsertContentSuggestion = z.infer<typeof insertContentSuggestionSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
