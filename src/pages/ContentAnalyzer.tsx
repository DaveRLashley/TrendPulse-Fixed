// src/pages/ContentAnalyzer.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Search, Zap, Hash, Target, Clock, TrendingUp, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import API_BASE_URL from '@/lib/api';

interface ContentAnalysis {
  optimizedTitles: string[];
  viralTags: string[];
  hookIdeas: {
    hook: string;
    description: string;
    engagement: string;
  }[];
  contentStrategy: {
    bestTiming: string;
    format: string;
    approach: string;
  };
  viralScore: number;
}

export default function ContentAnalyzer() {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);

  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async ({ content, platform }: { content: string; platform: string }) => {
      const response = await fetch(`${API_BASE_URL}/api/analyze-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, platform }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to analyze content');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
      toast({
        title: "Analysis Complete!",
        description: "Your content has been optimized for maximum engagement.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter content to analyze.",
        variant: "destructive",
      });
      return;
    }

    analyzeMutation.mutate({ content: content.trim(), platform });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    });
  };

  const getEngagementColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'very high':
        return 'bg-green-100 text-green-800';
      case 'high':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* ... rest of your component's JSX ... */}
    </div>
  );
}