import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Search, Zap, Hash, Target, Clock, TrendingUp, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import API_BASE_URL from '@/lib/api'; // Or the correct relative path

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
      // UPDATED LINE
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
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Content Analyzer</h2>
            <p className="opacity-90">AI-powered optimization for your Shorts content</p>
          </div>
          <div className="hidden md:block">
            <Search className="w-12 h-12 opacity-50" />
          </div>
        </div>
      </div>

      {/* Input Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Analyze Your Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Platform
              </label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube Shorts</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Video Title or Description
            </label>
            <Textarea
              placeholder="Enter your video title, description, or content idea..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>
          
          <Button 
            onClick={handleAnalyze}
            disabled={analyzeMutation.isPending}
            className="w-full"
          >
            {analyzeMutation.isPending ? "Analyzing..." : "Analyze Content"}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Optimized Titles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Optimized Titles
                </div>
                <Badge className="bg-purple-100 text-purple-800">
                  Viral Score: {analysis.viralScore}/10
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.optimizedTitles?.map((title, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg border-l-4 border-purple-600">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-foreground flex-1">{title}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(title)}
                        className="ml-2"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Viral Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hash className="w-5 h-5 mr-2 text-blue-600" />
                Viral Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {analysis.viralTags?.map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className={`cursor-pointer ${index < 5 ? "bg-blue-100 text-blue-800 border-blue-300" : ""}`}
                    onClick={() => copyToClipboard(`#${tag}`)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">💡 Pro Tip:</p>
                <p className="text-sm text-blue-700">
                  Use the highlighted tags for maximum reach. Mix trending and niche tags for best results.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Hook Ideas */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Viral Hook Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.hookIdeas?.map((idea, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{idea.hook}</span>
                      <Badge className={getEngagementColor(idea.engagement)}>
                        {idea.engagement}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{idea.description}</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => copyToClipboard(idea.description)}
                    >
                      Copy Hook
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Strategy */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Content Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Best Timing</h4>
                  <p className="text-sm text-muted-foreground">{analysis.contentStrategy?.bestTiming}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Format</h4>
                  <p className="text-sm text-muted-foreground">{analysis.contentStrategy?.format}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Approach</h4>
                  <p className="text-sm text-muted-foreground">{analysis.contentStrategy?.approach}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}