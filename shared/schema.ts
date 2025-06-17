import { pgTable, text, serial, integer, real, jsonb, timestamp } from "drizzle-orm/pg-core";
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
  platform: text("platform").notNull(),
  views: integer("views").notNull(),
  viralScore: real("viral_score").notNull(),
  creator: text("creator").notNull(),
  category: text("category").notNull(),
  thumbnailUrl: text("thumbnail_url"), // <-- THIS LINE IS CRITICAL
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contentSuggestions = pgTable("content_suggestions", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  platform: text("platform").notNull(),
  style: text("style").notNull(),
  titles: jsonb("titles").$type<string[]>().notNull(),
  tags: jsonb("tags").$type<string[]>().notNull(),
  contentIdeas: jsonb("content_ideas").$type<Array<{ title: string; description: string; engagement: string }>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull(),
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

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertTrendingVideoSchema = createInsertSchema(trendingVideos);
export const insertContentSuggestionSchema = createInsertSchema(contentSuggestions);
export const insertProjectSchema = createInsertSchema(projects);
export const insertAnalyticsSchema = createInsertSchema(analytics);

// TypeScript types inferred from the database schemas
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type TrendingVideo = typeof trendingVideos.$inferSelect;
export type InsertTrendingVideo = typeof trendingVideos.$inferInsert;
export type ContentSuggestion = typeof contentSuggestions.$inferSelect;
export type InsertContentSuggestion = typeof contentSuggestions.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;