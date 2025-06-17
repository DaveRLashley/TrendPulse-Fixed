// src/lib/openai.ts
import API_BASE_URL from '@/lib/api';

// Client-side utilities for working with AI suggestions
// Note: Actual OpenAI calls are made server-side for security

export interface AIContentSuggestion {
  titles: string[];
  tags: string[];
  contentIdeas: {
    title: string;
    description: string;
    engagement: string;
  }[];
}

export interface AIRequestParams {
  topic: string;
  platform: string;
  style: string;
}

export const generateContentSuggestions = async (
  params: AIRequestParams
): Promise<AIContentSuggestion> => {
  const response = await fetch(`${API_BASE_URL}/api/ai-suggestions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate suggestions');
  }

  return response.json();
};

export const getContentSuggestionsHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/api/content-suggestions`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch suggestions history');
  }

  return response.json();
};