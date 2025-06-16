import { storage } from "./storage.js";
import { insertContentSuggestionSchema, insertProjectSchema } from "../shared/schema.js";
export function registerRoutes(app, openai) {
    app.get("/api/trending", async (req, res) => {
        const { platform, category } = req.query;
        const videos = await storage.getTrendingVideos(typeof platform === "string" ? platform : undefined, typeof category === "string" ? category : undefined);
        res.json(videos);
    });
    app.post("/api/suggestions", async (req, res) => {
        const result = insertContentSuggestionSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.format() });
        }
        const suggestionData = result.data;
        const suggestion = await storage.createContentSuggestion(suggestionData);
        res.status(201).json(suggestion);
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
        const result = insertProjectSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.format() });
        }
        const projectData = result.data;
        const project = await storage.createProject(projectData);
        res.status(201).json(project);
    });
    app.put("/api/projects/:id", async (req, res) => {
        const id = Number(req.params.id);
        const updates = req.body;
        const updatedProject = await storage.updateProject(id, updates);
        if (!updatedProject) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.json(updatedProject);
    });
    app.get("/api/analytics", async (_req, res) => {
        const analytics = await storage.getLatestAnalytics();
        if (!analytics) {
            return res.status(404).json({ error: "No analytics data found" });
        }
        res.json(analytics);
    });
    app.post("/api/suggest", async (req, res) => {
        const { topic, platform, style } = req.body;
        if (!topic || !platform || !style) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const prompt = `Generate YouTube Shorts titles, tags, and content ideas for a trending video on the topic of "${topic}" in the style of "${style}" for the platform "${platform}".`;
        try {
            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-4",
            });
            const result = completion.choices[0].message.content;
            res.status(200).json({ result });
        }
        catch (error) {
            console.error("OpenAI error:", error);
            res.status(500).json({ error: "Failed to generate content" });
        }
    });
}
