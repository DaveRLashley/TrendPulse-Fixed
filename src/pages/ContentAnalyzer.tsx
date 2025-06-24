// src/pages/ContentAnalyzer.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Search, Zap, Hash, Target, TrendingUp, Copy, Clock } from "lucide-react"; // Added Clock icon
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import API_BASE_URL from '@/lib/api';

// UPDATED interface to include all expected fields from the AI
interface ContentAnalysis {
  optimizedTitles: string[];
  viralTags: string[];
  viralScore: number;
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
}

export default function ContentAnalyzer() {
  const [content, setContent] = useState("");
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async ({ content, platform }: { content: string; platform: string }) => {
      // Using the correct /api/analyze-content endpoint
      const response = await fetch(`${API_BASE_URL}/api/analyze-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, platform }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze content');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
      toast({
        title: "Analysis Complete!",
        description: "Your content has been optimized.",
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
    // The platform value is missing from the original file, but the API needs it.
    // I'll default to 'youtube'. You can add a <Select> dropdown for this later.
    analyzeMutation.mutate({ content: content.trim(), platform: 'youtube' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    });
  };

  // Helper function to style the engagement badges
  const getEngagementColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'very high': return 'bg-green-100 text-green-800';
      case 'high': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Content Analyzer</h2>
            <p className="opacity-90">AI-powered optimization for your video scripts and ideas</p>
          </div>
          <div className="hidden md:block">
            <Search className="w-12 h-12 opacity-50" />
          </div>
        </div>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-primary" />
            Analyze Your Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your video script, title idea, or a brief description here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full"
          />
          <Button
            onClick={handleAnalyze}
            disabled={analyzeMutation.isPending}
            className="w-full"
          >
            {analyzeMutation.isPending ? "Analyzing..." : "Analyze Content"}
          </Button>
        </CardContent>
      </Card>

      {/* --- THIS ENTIRE RESULTS SECTION IS NEWLY POPULATED --- */}
      {analyzeMutation.isSuccess && analysis && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Viral Score
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-6xl font-bold text-green-600">{analysis.viralScore}</div>
                <p className="text-muted-foreground">out of 10</p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Optimized Titles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.optimizedTitles?.map((title, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-foreground flex-1">{title}</p>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(title)} className="ml-2">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hash className="w-5 h-5 mr-2 text-blue-600" />
                Suggested Viral Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.viralTags?.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer bg-blue-100 text-blue-800 border-blue-300"
                    onClick={() => copyToClipboard(`#${tag}`)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Viral Hook Ideas
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.hookIdeas?.map((idea, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{idea.hook}</span>
                    <Badge className={getEngagementColor(idea.engagement)}>{idea.engagement}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{idea.description}</p>
                  <Button variant="link" size="sm" onClick={() => copyToClipboard(idea.description)} className="p-0 h-auto">
                    Copy Hook
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Content Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Best Timing</h4>
                <p className="text-sm text-muted-foreground">{analysis.contentStrategy?.bestTiming}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Format</h4>
                <p className="text-sm text-muted-foreground">{analysis.contentStrategy?.format}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Approach</h4>
                <p className="text-sm text-muted-foreground">{analysis.contentStrategy?.approach}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}