import type { Express } from "express";
import type { IStorage } from "./storage";
import type OpenAI from "openai";
import { insertProjectSchema } from "../shared/schema";

export function registerRoutes(app: Express, openai: OpenAI, storage: IStorage) {
  // --- This route is now fixed to use the filters correctly ---
  app.get("/api/trending-videos", async (req, res) => {
    try {
      const { platform, category } = req.query;
      const videos = await storage.getTrendingVideos(platform as string, category as string);
      res.json(videos);
    } catch (err) {
      console.error("GET /api/trending-videos failed:", err);
      res.status(500).json({ error: "Failed to fetch trending videos" });
    }
  });

  // --- All other working routes are preserved below ---
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
    console.log("Serving MOCKED response for /api/ai-suggestions");
    const mockSuggestions = {
        titles: ["You Won't Believe This Productivity Hack!", "The SECRET to Waking Up Energized", "My 5AM Routine ACTUALLY Changed My Life"],
        tags: ["productivity", "lifehack", "morningroutine", "motivation"],
        contentIdeas: [{ title: "The '2-Minute Rule'", description: "Explain how doing any task for just 2 minutes makes it easier to start.", engagement: "High" }]
    };
    res.status(200).json(mockSuggestions);
  });
  app.post("/api/analyze-content", async (req, res) => {
    console.log("Serving MOCKED response for /api/analyze-content");
    const mockAnalysis = {
        viralScore: 9,
        optimizedTitles: ["This Simple Trick Changed Everything", "I Tried the Viral 'X' Method", "You're Using [Common Product] Wrong"],
        viralTags: ["viral", "trending", "hacks", "mustsee"],
        hookIdeas: [{ hook: "Start with a shocking statistic", description: "Did you know 90% of people do this?", engagement: "Very High" }],
        contentStrategy: { bestTiming: "6-9 PM on weekdays.", format: "Use fast cuts and captions.", approach: "Focus on one powerful takeaway."}
    };
    res.status(200).json(mockAnalysis);
  });
}