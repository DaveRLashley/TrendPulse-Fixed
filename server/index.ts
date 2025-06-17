// server/index.ts

import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import OpenAI from "openai";
import { registerRoutes } from "./routes";
import cors from 'cors';

dotenv.config();

const app = express();

// --- START: UPDATED CORS CONFIGURATION ---
const corsOptions = {
  origin: [
    process.env.CORS_ORIGIN || "https://trendpulse-fixed.netlify.app",
    "http://localhost:5173"
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204
};

// This line handles the "preflight" requests that browsers send for CORS
app.options('*', cors(corsOptions));

// This line handles the actual requests
app.use(cors(corsOptions));
// --- END: UPDATED CORS CONFIGURATION ---

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const server = createServer(app);

// Register all API routes
registerRoutes(app, openai);

const PORT = process.env.PORT || 3001;
// Render provides the PORT env var
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});