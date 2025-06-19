
import type { Express } from "express";
import type OpenAI from "openai";
import type { IStorage } from "./storage";
import { insertProjectSchema } from "../shared/schema";

export function registerRoutes(app: Express, openai: OpenAI, storage: IStorage) {

  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (err) {
      console.error('GET /api/projects failed:', err);
      res.status(500).json({ error: "Failed to get projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProjectById(id);
      if (!project) return res.status(404).json({ error: "Not found" });
      res.json(project);
    } catch (err) {
      console.error('GET /api/projects/:id failed:', err);
      res.status(500).json({ error: "Failed to get project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const parsed = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(parsed);
      res.status(201).json(project);
    } catch (err) {
      console.error('POST /api/projects failed:', err);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.get("/api/trending-videos", async (_req, res) => {
    try {
      const videos = await storage.getTrendingVideos();
      res.json(videos);
    } catch (err) {
      console.error('GET /api/trending-videos failed:', err);
      res.status(500).json({ error: "Failed to get trending videos" });
    }
  });

  app.get("/api/analytics", async (_req, res) => {
    try {
      const data = await storage.getLatestAnalytics();
      if (!data) return res.status(404).json({ error: "No analytics found" });
      res.json(data);
    } catch (err) {
      console.error("GET /api/analytics failed:", err);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.post("/api/ai-suggestions", async (req, res) => {
    try {
      const { topic } = req.body;
      if (!topic) return res.status(400).json({ error: "Missing topic in request body" });

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a content strategist AI..." },
          { role: "user", content: `Give me 5 content ideas for ${topic}` }
        ]
      });

      const text = response.choices[0]?.message?.content;
      res.json({ suggestions: text });
    } catch (err) {
      console.error("POST /api/ai-suggestions failed:", err);
      res.status(500).json({ error: "AI generation failed" });
    }
  });
}
