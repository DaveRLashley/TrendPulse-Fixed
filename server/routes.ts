import express from "express";
import OpenAI from "openai";
import { IStorage } from "./storage";

export function registerRoutes(
  app: express.Application,
  openai: OpenAI,
  storage: IStorage
) {
  // Create Project
  app.post("/projects", async (req, res) => {
    try {
      const project = await storage.createProject(req.body);
      res.json(project);
    } catch (err) {
      console.error("createProject error:", err);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // Get All Projects
  app.get("/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (err) {
      console.error("getProjects error:", err);
      res.status(500).json({ error: "Failed to get projects" });
    }
  });

  // Get Trending Videos
  app.get("/trending", async (_req, res) => {
    try {
      const videos = await storage.getTrendingVideos();
      res.json(videos);
    } catch (err) {
      console.error("getTrendingVideos error:", err);
      res.status(500).json({ error: "Failed to get trending videos" });
    }
  });

  // Get Analytics
  app.get("/analytics", async (_req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (err) {
      console.error("getAnalytics error:", err);
      res.status(500).json({ error: "Failed to get analytics" });
    }
  });

  // Content Suggestions
  app.get("/suggestions", async (_req, res) => {
    try {
      const suggestions = await storage.getContentSuggestions();
      res.json(suggestions);
    } catch (err) {
      console.error("getContentSuggestions error:", err);
      res.status(500).json({ error: "Failed to get suggestions" });
    }
  });
}
