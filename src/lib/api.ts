// src/lib/api.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not set. Please add it to your .env file.");
}

export default API_BASE_URL;