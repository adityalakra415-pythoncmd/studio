"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, UploadCloud, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export function ContentUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isUploading && uploadProgress < 100) {
      timer = setTimeout(() => {
        setUploadProgress((prev) => Math.min(prev + Math.random() * 20, 100));
      }, 500);
    } else if (uploadProgress >= 100 && isUploading) {
      setIsUploading(false);
      setIsComplete(true);
      toast({
        title: "Analysis Complete",
        description: "Your content has been summarized and added to your study plan.",
      });
    }
    return () => clearTimeout(timer);
  }, [isUploading, uploadProgress, toast]);

  const handleAnalyze = () => {
    setIsComplete(false);
    setUploadProgress(0);
    setIsUploading(true);
  };

  const resetState = () => {
    setIsComplete(false);
    setUploadProgress(0);
    setIsUploading(false);
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Ingest Content</CardTitle>
        <CardDescription>Upload materials for your study plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <UploadCloud className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="link">
              <Link className="w-4 h-4 mr-2" />
              Link
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <div className="flex flex-col items-center justify-center p-6 mt-2 border-2 border-dashed rounded-lg border-muted-foreground/20">
              <UploadCloud className="w-12 h-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-center text-muted-foreground">
                Drag & drop files here or click to browse
              </p>
              <Input type="file" className="sr-only" />
            </div>
          </TabsContent>
          <TabsContent value="link">
            <div className="flex flex-col p-6 mt-2 border-2 border-dashed rounded-lg border-muted-foreground/20">
              <p className="mb-4 text-sm text-center text-muted-foreground">
                Paste a link to a video or article.
              </p>
              <Input placeholder="https://..." />
            </div>
          </TabsContent>
        </Tabs>
        {(isUploading || isComplete) && (
          <div className="mt-4 space-y-2">
            <Progress value={uploadProgress} />
            <p className="text-sm text-center text-muted-foreground">
              {isUploading && `Analyzing... ${Math.round(uploadProgress)}%`}
              {isComplete && "Analysis complete!"}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isComplete ? (
           <Button className="w-full" onClick={resetState}>
            Upload More
          </Button>
        ) : (
          <Button className="w-full" onClick={handleAnalyze} disabled={isUploading}>
            {isUploading ? "Analyzing..." : "Analyze Content"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
