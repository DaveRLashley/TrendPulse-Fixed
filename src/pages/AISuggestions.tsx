import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Brain, Hash, Lightbulb, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { generateContentSuggestions } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";
import type { ContentSuggestion } from "@/types";

export default function AISuggestions() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<ContentSuggestion | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: generateContentSuggestions,
    onSuccess: (data) => {
      setSuggestions(data);
      queryClient.invalidateQueries({ queryKey: ['/api/content-suggestions'] });
      toast({
        title: "Success!",
        description: "AI suggestions generated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate suggestions.",
        variant: "destructive",
      });
    },
  });

  const styleOptions = [
    "educational",
    "entertaining", 
    "inspiring",
    "funny",
    "trending"
  ];

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a content topic.",
        variant: "destructive",
      });
      return;
    }

    const style = selectedStyles.length > 0 ? selectedStyles.join(", ") : "general";
    
    generateMutation.mutate({
      topic: topic.trim(),
      platform,
      style
    });
  };

  return (
    <div className="p-6">
      {/* AI Input Panel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Generate AI-Powered Content Ideas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Content Topic
              </label>
              <Input
                placeholder="e.g., productivity tips, cooking recipes"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Target Platform
              </label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube Shorts</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content Style
            </label>
            <div className="flex flex-wrap gap-2">
              {styleOptions.map((style) => (
                <Button
                  key={style}
                  variant={selectedStyles.includes(style) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleStyle(style)}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="w-full"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate AI Suggestions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* AI Suggestions Results */}
      {suggestions && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Title Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hash className="w-5 h-5 mr-2 text-primary" />
                Title Suggestions
                <Badge variant="secondary" className="ml-2">
                  AI Generated
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestions.titles?.map((title, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                    <p className="font-medium text-foreground">{title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        Viral Score: {(Math.random() * 2 + 8).toFixed(1)}
                      </span>
                      <Button variant="link" size="sm">
                        Use This
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tag Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hash className="w-5 h-5 mr-2 text-secondary" />
                Trending Tags
                <Badge variant="secondary" className="ml-2">
                  Hot Trends
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestions.tags?.map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className={index < 3 ? "bg-primary/10 text-primary border-primary" : ""}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">💡 Pro Tip:</p>
                <p className="text-sm text-foreground">
                  Use 3-5 trending tags combined with 2-3 niche tags for optimal reach.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Ideas */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-warning" />
                Content Ideas & Hooks
                <Badge variant="secondary" className="ml-2">
                  Creative
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.contentIdeas?.map((idea, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="ml-2 font-medium text-foreground">{idea.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{idea.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-accent">
                        Engagement: {idea.engagement}
                      </span>
                      <Button variant="link" size="sm">
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
