
import type { Express } from "express";
import type { IStorage } from "./storage";
import type OpenAI from "openai";
import { insertProjectSchema } from "../shared/schema";

export function registerRoutes(app: Express, openai: OpenAI, storage: IStorage) {
  app.get("/api/trending-videos", async (_req, res) => {
    try {
      const videos = await storage.getTrendingVideos();
      res.json(videos);
    } catch (err) {
      console.error("GET /api/trending-videos failed:", err);
      res.status(500).json({ error: "Failed to fetch trending videos" });
    }
  });

  app.get("/api/analytics", async (_req, res) => {
    try {
      const analytics = await storage.getLatestAnalytics();
      res.json(analytics);
    } catch (err) {
      console.error("GET /api/analytics failed:", err);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (err) {
      console.error("GET /api/projects failed:", err);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const newProject = await storage.createProject(projectData);
      res.status(201).json(newProject);
    } catch (err) {
      console.error("POST /api/projects failed:", err);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.post("/api/ai-suggestions", async (req, res) => {
    try {
      const { topic, platform, style } = req.body;

      if (!topic) {
        return res.status(400).json({ error: "Missing topic in request body" });
      }

      const prompt = `Generate 5 YouTube Shorts titles, 10 tags, and 3 ideas for the topic "${topic}" in the style of "${style}" for ${platform}. Format as a readable list.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      });

      const text = completion.choices[0]?.message?.content;
      res.status(200).json({ suggestions: text });
    } catch (error) {
      console.error("AI error:", error);
      res.status(500).json({ error: "AI generation failed" });
    }
  });
}
