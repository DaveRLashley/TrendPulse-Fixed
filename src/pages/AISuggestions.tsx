import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Brain, Hash, Lightbulb, Loader2, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import API_BASE_URL from '@/lib/api';

// This interface matches the mocked data from your backend
interface AISuggestion {
  titles: string[];
  tags: string[];
  contentIdeas: {
    title: string;
    description: string;
    engagement: string;
  }[];
}

// The API call function
const generateContentSuggestions = async (params: { topic: string, platform: string, style: string }): Promise<AISuggestion> => {
    const response = await fetch(`${API_BASE_URL}/api/ai-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate suggestions');
    }
    return response.json();
};


export default function AISuggestions() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  // Restored the setter function for our state
  const [suggestions, setSuggestions] = useState<AISuggestion | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: generateContentSuggestions,
    onSuccess: (data) => {
      // Re-enabled this line to save the API results to our state
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

  const styleOptions = ["educational", "entertaining", "inspiring", "funny", "trending"];

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Title copied to clipboard." });
  };

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast({ title: "Error", description: "Please enter a content topic.", variant: "destructive" });
      return;
    }
    const style = selectedStyles.length > 0 ? selectedStyles.join(", ") : "general";
    generateMutation.mutate({ topic: topic.trim(), platform, style });
  };

  return (
    <div className="p-6 space-y-6">
      {/* --- START: YOUR EXISTING UI FOR THE INPUT FORM (UNCHANGED) --- */}
      <Card>
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
      {/* --- END: YOUR EXISTING UI FOR THE INPUT FORM (UNCHANGED) --- */}


      {/* --- START: NEW UI SECTION TO DISPLAY RESULTS --- */}
      {generateMutation.isSuccess && suggestions && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Title Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hash className="w-5 h-5 mr-2 text-primary" />
                Title Suggestions
                <Badge variant="secondary" className="ml-2">AI Generated</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestions.titles?.map((title, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground flex-1">{title}</p>
                    <Button variant="link" size="sm" onClick={() => copyToClipboard(title)}>Use This</Button>
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
                <Badge variant="secondary" className="ml-2">Hot Trends</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestions.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline" className={index < 3 ? "bg-primary/10 text-primary border-primary" : ""}>
                    #{tag}
                  </Badge>
                ))}
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">💡 Use 3-5 trending tags with 2-3 niche tags for optimal reach.</p>
              </div>
            </CardContent>
          </Card>

          {/* Content Ideas */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-warning" />
                Content Ideas & Hooks
                <Badge variant="secondary" className="ml-2">Creative</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.contentIdeas?.map((idea, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{idea.title}</span>
                      <Badge variant="outline" className="text-accent border-accent">{idea.engagement}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{idea.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {/* --- END: NEW UI SECTION TO DISPLAY RESULTS --- */}
    </div>
  );
}