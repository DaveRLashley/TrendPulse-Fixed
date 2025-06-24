import type { Express } from "express";
import type { IStorage } from "./storage";
import type OpenAI from "openai";
import { insertProjectSchema } from "../shared/schema";

export function registerRoutes(app: Express, openai: OpenAI, storage: IStorage) {
  // --- START: THIS IS THE ONLY CHANGE ---
  // The route now correctly reads `platform` and `category` from the request
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
  // --- END: THIS IS THE ONLY CHANGE ---

  // All of your other working routes are preserved below
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
      titles: [ "You Won't Believe This Productivity Hack!", "The SECRET to Waking Up Energized", "My 5AM Routine ACTUALLY Changed My Life", "The Only Content Planner You'll Ever Need", "How I 10x My Output With One Simple Tool" ],
      tags: ["productivity", "lifehack", "morningroutine", "motivation", "success", "entrepreneur", "devlife"],
      contentIdeas: [
        { title: "The '2-Minute Rule'", description: "Explain how doing any task for just 2 minutes makes it easier to start and build momentum.", engagement: "High" },
        { title: "Time blocking vs. Task Batching", description: "Compare and contrast two popular productivity methods with visual examples.", engagement: "Medium" },
        { title: "Review of a Notion Template", description: "Showcase a popular Notion template for content creators and how you use it.", engagement: "High" }
      ]
    };
    res.status(200).json(mockSuggestions);
  });

  app.post("/api/analyze-content", async (req, res) => {
    console.log("Serving MOCKED response for /api/analyze-content");
    const mockAnalysis = {
      viralScore: 9,
      optimizedTitles: [ "This Simple Trick Changed Everything", "I Tried the Viral 'X' Method, Here's What Happened", "You're Using [Common Product] All Wrong" ],
      viralTags: ["viral", "trending", "hacks", "mustsee", "lifechanging"],
      hookIdeas: [
        { hook: "Start with a shocking statistic", description: "Did you know 90% of people make this mistake every day?", engagement: "Very High" },
        { hook: "Ask a provocative question", description: "What if everything you know about [topic] is wrong?", engagement: "High" },
        { hook: "Use the 'Before vs After' format", description: "Show a dramatic transformation related to the content.", engagement: "High" },
        { hook: "Create urgency or FOMO", description: "This trick won't work much longer, here's why...", engagement: "Medium" },
        { hook: "Use controversy or debate", description: "Everyone is wrong about [topic], and I can prove it.", engagement: "High" },
      ],
      contentStrategy: {
        bestTiming: "Post between 6-9 PM on weekdays.",
        format: "Use fast cuts, on-screen text captions, and a trending audio track.",
        approach: "Focus on a single, powerful takeaway for the viewer."
      }
    };
    res.status(200).json(mockAnalysis);
  });
}