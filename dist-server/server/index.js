import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import OpenAI from "openai";
import { setupVite } from "./vite.js";
import { registerRoutes } from "./routes.js";
dotenv.config();
const app = express();
app.use(express.json());
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const server = createServer(app);
registerRoutes(app, openai);
await setupVite(app, server);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
