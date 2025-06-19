// src/pages/ContentAnalyzer.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Search, Zap, Hash, Target, TrendingUp, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import API_BASE_URL from '@/lib/api';

// This interface should match the JSON object your backend AI prompt is designed to return
interface ContentAnalysis {
  optimizedTitles: string[];
  viralTags: string[];
  viralScore: number;
  // You can add more fields here as you expand the AI's analysis capabilities
}

export default function ContentAnalyzer() {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async ({ content, platform }: { content: string; platform: string }) => {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, { // Note: using /api/analyze as requested
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, platform }),
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
    analyzeMutation.mutate({ content: content.trim(), platform });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    });
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

      {/* Analysis Results Section */}
      {analyzeMutation.isSuccess && analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Viral Score */}
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

          {/* Optimized Titles */}
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

          {/* Viral Tags */}
          <Card className="lg:col-span-3">
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

        </div>
      )}
    </div>
  );
}