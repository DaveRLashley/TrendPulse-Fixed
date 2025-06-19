import express from "express";
import OpenAI from "openai";
import { IStorage } from "./storage";

export function registerRoutes(
  app: express.Application,
  openai: OpenAI,
  storage: IStorage
) {
  // AI Suggestions (POST)
  app.post("/api/ai-suggestions", async (req, res) => {
    try {
      const prompt = req.body.prompt;
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert content strategist who suggests viral short-form video ideas.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-4",
      });
      res.json({ suggestions: completion.choices[0].message.content });
    } catch (err) {
      console.error("AI Suggestion Error:", err);
      res.status(500).json({ error: "AI suggestion failed" });
    }
  });

  // Analyze Content (POST)
  app.post("/api/analyze-content", async (req, res) => {
    try {
      const prompt = req.body.prompt;
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a content analyst that evaluates the quality and structure of short-form video scripts.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-4",
      });
      res.json({ analysis: completion.choices[0].message.content });
    } catch (err) {
      console.error("Content Analysis Error:", err);
      res.status(500).json({ error: "Content analysis failed" });
    }
  });

  // Trending Videos (GET)
  app.get("/api/trending-videos", async (_req, res) => {
    try {
      const videos = await storage.getTrendingVideos();
      res.json(videos);
    } catch (err) {
      console.error("Trending Video Error:", err);
      res.status(500).json({ error: "Failed to fetch trending videos" });
    }
  });

  // Analytics (GET)
  app.get("/api/analytics", async (_req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (err) {
      console.error("Analytics Error:", err);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Content Suggestions (GET)
  app.get("/api/content-suggestions", async (_req, res) => {
    try {
      const suggestions = await storage.getContentSuggestions();
      res.json(suggestions);
    } catch (err) {
      console.error("Suggestions Error:", err);
      res.status(500).json({ error: "Failed to fetch suggestions" });
    }
  });

  // All Projects (GET)
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (err) {
      console.error("Get Projects Error:", err);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Single Project by ID (GET)
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProjectById(id);
      res.json(project);
    } catch (err) {
      console.error("Get Project Error:", err);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Create New Project (POST)
  app.post("/api/projects", async (req, res) => {
    try {
      const project = await storage.createProject(req.body);
      res.json(project);
    } catch (err) {
      console.error("Create Project Error:", err);
      res.status(500).json({ error: "Failed to create project" });
    }
  });
}
