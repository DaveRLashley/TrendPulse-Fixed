import type { Express } from "express";
import { storage } from "./storage";
import { z } from "zod";
import type OpenAI from "openai";
import { insertProjectSchema, insertContentSuggestionSchema } from "../shared/schema";

export function registerRoutes(app: Express, openai: OpenAI) {
  // --- EXISTING ROUTES ---
  app.get("/api/trending", async (req, res) => {
    const { platform, category } = req.query;
    const videos = await storage.getTrendingVideos(
      typeof platform === "string" ? platform : undefined,
      typeof category === "string" ? category : undefined
    );
    res.json(videos);
  });

  app.get("/api/suggestions", async (_req, res) => {
    const suggestions = await storage.getContentSuggestions();
    res.json(suggestions);
  });

  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    const result = insertProjectSchema.parse(req.body);
    const project = await storage.createProject(result);
    res.status(201).json(project);
  });
  
  app.get("/api/analytics", async (_req, res) => {
    const analytics = await storage.getLatestAnalytics();
    if (!analytics) {
      return res.status(404).json({ error: "No analytics data found" });
    }
    res.json(analytics);
  });

  app.post("/api/ai-suggestions", async (req, res) => {
    try {
      const { topic, platform, style } = req.body;
      if (!topic || !platform || !style) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const prompt = `Generate 5 YouTube Shorts titles, 10 relevant tags, and 3 content ideas for a trending video on the topic of "${topic}" in the style of "${style}" for the platform "${platform}". Structure the output as a JSON object with keys "titles", "tags", and "contentIdeas". The "contentIdeas" should be an array of objects, each with a "title", "description", and "engagement" property.`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        // --- THIS LINE IS THE ONLY CHANGE ---
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" },
      });

      const result = completion.choices[0].message.content;
      if (result) {
        const suggestionData = JSON.parse(result);
        await storage.createContentSuggestion({
            topic,
            platform,
            style,
            ...suggestionData
        });
        res.status(200).json(suggestionData);
      } else {
        throw new Error("No content returned from OpenAI");
      }
    } catch (error) {
      console.error("OpenAI error:", error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });
}