import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, FileText, Image, Plus, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/types";

export default function CreatorWorkspace() {
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects']
  });

  const createProjectMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await apiRequest('POST', '/api/projects', {
        title,
        description: `New project: ${title}`,
        status: 'planning',
        progress: 0
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setNewProjectTitle("");
      toast({
        title: "Success!",
        description: "New project created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project.",
        variant: "destructive",
      });
    }
  });

  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project title.",
        variant: "destructive",
      });
      return;
    }
    createProjectMutation.mutate(newProjectTitle);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent text-white';
      case 'in-progress':
        return 'bg-warning text-white';
      case 'planning':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'planning':
        return 'Planning';
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      {/* Workspace Header */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Creator Workspace</h2>
            <p className="opacity-90">Plan, create, and optimize your content in one place</p>
          </div>
          <div className="hidden md:block">
            <Edit className="w-12 h-12 opacity-50" />
          </div>
        </div>
      </div>

      {/* Workspace Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Content Planner */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-foreground">Content Calendar</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Plan your content schedule and track upcoming posts
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm font-medium">Morning Routine Video</span>
                <span className="text-xs text-muted-foreground">Tomorrow</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm font-medium">Productivity Tips</span>
                <span className="text-xs text-muted-foreground">Friday</span>
              </div>
            </div>
            <Button className="w-full">
              View Full Calendar
            </Button>
          </CardContent>
        </Card>

        {/* Script Generator */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-foreground">Script Generator</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              AI-powered scripts tailored to your content style
            </p>
            <div className="mb-4">
              <Input placeholder="Enter your video topic..." />
            </div>
            <Button className="w-full" variant="secondary">
              Generate Script
            </Button>
          </CardContent>
        </Card>

        {/* Thumbnail Creator */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-accent" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-foreground">Thumbnail Ideas</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Get AI suggestions for eye-catching thumbnails
            </p>
            <div className="mb-4 h-20 bg-muted/50 rounded-lg flex items-center justify-center">
              <Image className="w-8 h-8 text-muted-foreground" />
            </div>
            <Button className="w-full bg-accent hover:bg-accent/90">
              Create Thumbnail
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Projects</CardTitle>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Project title..."
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                className="w-48"
              />
              <Button 
                onClick={handleCreateProject}
                disabled={createProjectMutation.isPending}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-border rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-3"></div>
                  <div className="h-2 bg-muted rounded mb-2"></div>
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">{project.title}</h4>
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusLabel(project.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {project.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress: {project.progress}%</span>
                    <Button variant="link" size="sm">
                      Edit
                    </Button>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No active projects. Create your first project!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
