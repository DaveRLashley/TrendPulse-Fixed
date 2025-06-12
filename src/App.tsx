import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useLocation } from "wouter";

// Pages
import Dashboard from "@/pages/Dashboard";
import TrendingContent from "@/pages/TrendingContent";
import AISuggestions from "@/pages/AISuggestions";
import ContentAnalyzer from "@/pages/ContentAnalyzer";
import CreatorWorkspace from "@/pages/CreatorWorkspace";
import Analytics from "@/pages/Analytics";
import NotFound from "@/pages/not-found";

const getPageTitle = (location: string) => {
  switch (location) {
    case "/":
      return "Dashboard";
    case "/trending":
      return "Trending Content";
    case "/ai-suggestions":
      return "AI Suggestions";
    case "/analyzer":
      return "Content Analyzer";
    case "/workspace":
      return "Creator Workspace";
    case "/analytics":
      return "Analytics";
    default:
      return "Dashboard";
  }
};

function Router() {
  const [location] = useLocation();
  const title = getPageTitle(location);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col flex-1">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/trending" component={TrendingContent} />
            <Route path="/ai-suggestions" component={AISuggestions} />
            <Route path="/analyzer" component={ContentAnalyzer} />
            <Route path="/workspace" component={CreatorWorkspace} />
            <Route path="/analytics" component={Analytics} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;