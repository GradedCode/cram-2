import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, BookOpen } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center shadow-float">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-accent" />
          </div>
          <CardTitle className="text-4xl font-bold text-primary">404</CardTitle>
          <CardDescription className="text-lg">
            Oops! This study session wasn't found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The page you're looking for seems to have gone on a study break.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="study" asChild className="flex-1">
              <a href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </a>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <a href="/">
                <BookOpen className="h-4 w-4 mr-2" />
                Start Cramming
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
