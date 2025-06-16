import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import OpenAI from "openai";
import { registerRoutes } from "./routes.js";
import cors from 'cors';

dotenv.config();

const app = express();

// Allow requests from your Netlify frontend and local development
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || "[https://trendpulse-fixed.netlify.app](https://trendpulse-fixed.netlify.app)",
    "http://localhost:5173"
  ],
  credentials: true
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const server = createServer(app);

// Register all API routes
registerRoutes(app, openai);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});