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
      const prompt = `Generate 5 YouTube Shorts titles, 10 relevant tags, and 3 content ideas for a trending video on the topic of "${topic}" in the style of "${style}" for the platform "${platform}". Structure the output as a JSON object with keys "titles", "tags", and "contentIdeas". The "contentIdeas" should be an array of objects, each with a "title", "description", and "engagement" property.`;
      
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" },
      });

      const result = completion.choices[0].message.content;
      res.status(200).json(JSON.parse(result || '{}'));

    } catch (error) {
      console.error("OpenAI error in /api/ai-suggestions:", error);
      // NOTE: This will still fail if your OpenAI quota is exceeded.
      res.status(500).json({ error: "Failed to generate AI suggestions" });
    }
  });
  
  app.post("/api/analyze-content", async (req, res) => {
    try {
        const { content } = req.body;
        const prompt = `Analyze the following content for a short-form video. Provide a viral score out of 10, suggest 3 optimized titles, and list 5 viral tags. Structure the output as a single JSON object with keys "viralScore" (number), "optimizedTitles" (array of strings), and "viralTags" (array of strings). Content: "${content}"`;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a content analyst providing structured feedback in JSON format." },
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