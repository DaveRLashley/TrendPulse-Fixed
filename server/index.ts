import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import OpenAI from "openai";
import { registerRoutes } from "./routes";
import cors from 'cors';

dotenv.config();

const app = express();

// Allow requests from your Netlify frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*", // Allow all for now
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