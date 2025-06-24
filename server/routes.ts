import type { Express } from "express";
import type { IStorage } from "./storage";
import type OpenAI from "openai";
import { insertProjectSchema } from "../shared/schema";

export function registerRoutes(app: Express, openai: OpenAI, storage: IStorage) {
  // --- YOUR EXISTING, WORKING ROUTES ---
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
      if (!topic || !platform || !style) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const prompt = `Generate 5 YouTube Shorts titles, 10 relevant tags, and 3 content ideas for a trending video on the topic of "${topic}" in the style of "${style}" for the platform "${platform}". Structure the output as a JSON object with keys "titles", "tags", and "contentIdeas".`;
      
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" },
      });
      const result = completion.choices[0].message.content;
      res.status(200).json(JSON.parse(result || '{}'));
    } catch (error) {
      console.error("AI suggestion error:", error);
      res.status(500).json({ error: "AI generation failed" });
    }
  });

  // --- THE NEWLY ADDED ROUTE ---
  app.post("/api/analyze-content", async (req, res) => {
    try {
        const { content, platform } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Content to analyze is required" });
        }
        const prompt = `Analyze the following content idea for a ${platform} short-form video: "${content}". Provide a detailed analysis in a JSON object with the following keys: "viralScore" (a number from 1 to 10), "optimizedTitles" (an array of 5 catchy titles), "viralTags" (an array of 10 relevant hashtags without the #), "hookIdeas" (an array of 5 objects, each with a "hook", "description", and "engagement" property), and "contentStrategy" (an object with "bestTiming", "format", and "approach" keys).`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a world-class content strategist who provides analysis in a structured JSON format." },
                { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
        });
        const result = completion.choices[0]?.message?.content;
        res.status(200).json(JSON.parse(result || '{}'));
    } catch (error) {
        console.error("Content analysis error:", error);
        res.status(500).json({ error: "Content analysis failed" });
    }
  });
}