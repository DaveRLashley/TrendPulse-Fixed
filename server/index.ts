import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import OpenAI from "openai";
import { registerRoutes } from "./routes";
import { storage } from "./storage";
import cors from "cors";

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    process.env.CORS_ORIGIN || "https://trendpulse-fixed.netlify.app",
    "http://localhost:5173",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const server = createServer(app);

// Pass the imported storage and openai instances into the routes function
registerRoutes(app, openai, storage);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});